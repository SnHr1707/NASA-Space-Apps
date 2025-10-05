# backend/app.py
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from model import shark_predictor

app = FastAPI(title="Sharky Prediction API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class PredictionInput(BaseModel):
    latitude: float
    longitude: float

@app.on_event("startup")
async def startup_event():
    shark_predictor.load_model()

@app.get("/")
def read_root():
    return {"message": "Welcome to the Sharky Prediction API"}

@app.get("/hotspots")
def get_hotspots():
    """
    Loads the calculated hotspots, converts them to GeoJSON format, and returns them.
    """
    if shark_predictor.hotspots is None:
        raise HTTPException(status_code=503, detail="Hotspots are not loaded or trained yet.")

    # Convert the numpy array of [lat, lon] into a GeoJSON Feature Collection
    # Note: GeoJSON coordinates are in [longitude, latitude] order.
    hotspot_features = []
    for i, (lat, lon) in enumerate(shark_predictor.hotspots):
        feature = {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [lon, lat]  # Correct [lon, lat] order for GeoJSON
            },
            "properties": {
                # Add properties that the frontend tooltip expects
                "name": f"Calculated Hotspot #{i + 1}",
                "species": "Various Species"
            }
        }
        hotspot_features.append(feature)

    geojson_data = {
        "type": "FeatureCollection",
        "features": hotspot_features
    }

    return geojson_data

@app.post("/predict")
def predict(data: PredictionInput):
    """
    Accepts latitude and longitude, fetches environmental data,
    and returns the predicted probability of shark presence.
    """
    result = shark_predictor.predict_shark_presence(
        latitude=data.latitude,
        longitude=data.longitude
    )

    if "error" in result:
        raise HTTPException(status_code=503, detail=result["error"])

    return result