# backend/model.py
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.cluster import KMeans
import xgboost as xgb
import joblib
import os
from utils import chlorophyll_service, get_sst_at_coords # Import the new services

class SharkModel:
    def __init__(self, data_path='final_final.csv'):
        self.data_path = data_path
        self.model = None
        self.scaler = None
        self.hotspots = None # Hotspots are now only used for distance calc
        self.model_path = 'xgb_model.joblib'
        self.scaler_path = 'scaler.joblib'
        self.hotspots_path = 'hotspots.joblib' # This will be created during training

    # The training method remains largely the same as it generates the model files.
    # We will keep it for completeness and first-time setup.
    def _get_min_distance_to_hotspot(self, lat, lon, hotspots):
        from geopy.distance import geodesic
        try:
            point = (lat, lon)
            distances = [geodesic(point, cp).kilometers for cp in hotspots]
            return min(distances) if distances else np.nan
        except (ValueError, TypeError):
            return np.nan

    def train(self):
        # This function runs only once if the model files don't exist
        print("Training model...")
        try:
            df = pd.read_csv(self.data_path)
        except FileNotFoundError:
            print(f"Error: Dataset '{self.data_path}' not found.")
            return

        df.dropna(subset=['Latitude', 'Longitude'], inplace=True)
        coastal_coords = df[df['Shark_Presence'] == 1][['Latitude', 'Longitude']].values

        kmeans = KMeans(n_clusters=10, random_state=42, n_init=10)
        kmeans.fit(coastal_coords)
        self.hotspots = kmeans.cluster_centers_
        joblib.dump(self.hotspots, self.hotspots_path)

        df['distance_from_coast'] = df.apply(
            lambda row: self._get_min_distance_to_hotspot(row['Latitude'], row['Longitude'], self.hotspots),
            axis=1
        )
        df.dropna(subset=['distance_from_coast'], inplace=True)

        feature_columns = ['Sea Surface Temperature', 'Chlorophyll', 'distance_from_coast']
        X = df[feature_columns]
        y = df['Shark_Presence']

        X_train, _, y_train, _ = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)

        self.scaler = StandardScaler()
        X_train_scaled = self.scaler.fit_transform(X_train)
        joblib.dump(self.scaler, self.scaler_path)

        self.model = xgb.XGBClassifier(n_estimators=100, learning_rate=0.1, max_depth=5, use_label_encoder=False, eval_metric='logloss', random_state=42)
        self.model.fit(X_train_scaled, y_train)
        joblib.dump(self.model, self.model_path)
        print("Model training complete and files saved.")

    def load_model(self):
        if not all(os.path.exists(p) for p in [self.model_path, self.scaler_path, self.hotspots_path]):
            self.train()
        else:
            print("Loading pre-trained model and components...")
            self.model = joblib.load(self.model_path)
            self.scaler = joblib.load(self.scaler_path)
            self.hotspots = joblib.load(self.hotspots_path)
            print("Model, scaler, and hotspots loaded successfully.")

    def predict_shark_presence(self, latitude, longitude):
        if self.model is None:
            self.load_model()
            if self.model is None:
                return {"error": "Model could not be loaded or trained."}

        print("\n--- New Prediction Request ---")
        print(f"Fetching data for Lat: {latitude}, Lon: {longitude}")

        # 1. Get Chlorophyll from image
        chlorophyll = chlorophyll_service.get_chlorophyll_at_coords(latitude, longitude)
        if chlorophyll is None:
            return {"error": "Could not retrieve Chlorophyll data for the selected point. The location might be too far from valid data."}

        # 2. Get SST from NASA API
        try:
            sst = get_sst_at_coords(latitude, longitude)
            if sst is None:
                return {"error": "Could not retrieve Sea Surface Temperature data from NASA services for the selected point. Please try a different location in the ocean."}
        except ValueError as e: # Catches the missing credentials error
            return {"error": str(e)}


        # 3. Calculate distance to nearest hotspot
        dist_coast = self._get_min_distance_to_hotspot(latitude, longitude, self.hotspots)

        # 4. Run prediction
        input_df = pd.DataFrame({
            'Sea Surface Temperature': [sst],
            'Chlorophyll': [chlorophyll],
            'distance_from_coast': [dist_coast]
        })

        input_scaled = self.scaler.transform(input_df)
        probability = self.model.predict_proba(input_scaled)[0][1]

        print(f"  ✅ Prediction successful. Probability: {probability:.4f}")

        return {
            "latitude": float(latitude),
            "longitude": float(longitude),
            "sst": round(float(sst), 2),
            "chlorophyll": round(float(chlorophyll), 4),
            "distance_from_coast_km": round(float(dist_coast), 2),
            "shark_presence_probability": round(float(probability), 4)
        }

# Instantiate the model
shark_predictor = SharkModel()