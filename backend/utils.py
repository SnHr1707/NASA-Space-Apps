# backend/utils.py
import os
import sys
from math import sqrt, isnan
from PIL import Image
import numpy as np
import requests
from datetime import datetime, timedelta
from dotenv import load_dotenv
import earthaccess
import xarray as xr

# --- Load Environment Variables ---
load_dotenv()
NASA_USERNAME = os.getenv("EARTHDATA_USERNAME")
NASA_PASSWORD = os.getenv("EARTHDATA_PASSWORD")

# --- Chlorophyll Predictor Class (Unchanged) ---
class ChlorophyllPredictor:
    def __init__(self, map_path='chlorophyll_curr.png', colormap_path='colormap.png'):
        self.IMAGE_WIDTH = 4320
        self.IMAGE_HEIGHT = 2160
        self.GRID_SEARCH_THRESHOLD = 20

        try:
            print("Loading chlorophyll map...")
            self.map_image = Image.open(map_path).convert('RGB')
            print(f"✅ Loaded chlorophyll map: {map_path}")
            self.color_map = self._load_colormap(colormap_path)
        except FileNotFoundError as e:
            print(f"FATAL ERROR: Could not load required image file: {e}")
            sys.exit(1)

    def _load_colormap(self, image_path):
        cmap_img = Image.open(image_path).convert('RGB')
        width, height = cmap_img.size
        y_mid = height // 2
        start_x = next((x for x in range(width) if cmap_img.getpixel((x, y_mid)) != (255, 255, 255)), 0)
        end_x = next((width - 1 - x for x in range(width) if cmap_img.getpixel((width - 1 - x, y_mid)) != (255, 255, 255)), width - 1)
        gradient_width = end_x - start_x + 1
        log_min, log_max = np.log10(0.01), np.log10(20)
        log_values = np.logspace(log_min, log_max, num=gradient_width)
        color_to_value_map = {cmap_img.getpixel((start_x + i, y_mid)): val for i, val in enumerate(log_values)}
        print(f"✅ Loaded chlorophyll colormap with {len(color_to_value_map)} distinct colors.")
        return color_to_value_map

    def _coords_to_pixels(self, lat, lon):
        x = int((lon + 180.0) * (self.IMAGE_WIDTH / 360.0))
        y = int((-lat + 90.0) * (self.IMAGE_HEIGHT / 180.0))
        return max(0, min(self.IMAGE_WIDTH - 1, x)), max(0, min(self.IMAGE_HEIGHT - 1, y))

    def _find_closest_value(self, pixel_rgb):
        min_dist = float('inf')
        closest_value = None
        for map_color, value in self.color_map.items():
            dist = sqrt((pixel_rgb[0] - map_color[0])**2 + (pixel_rgb[1] - map_color[1])**2 + (pixel_rgb[2] - map_color[2])**2)
            if dist < min_dist:
                min_dist = dist
                closest_value = value
        return closest_value

    def get_chlorophyll_at_coords(self, lat, lon):
        x, y = self._coords_to_pixels(lat, lon)
        pixel_rgb = self.map_image.getpixel((x, y))
        if pixel_rgb[0] < 5 and pixel_rgb[1] < 5 and pixel_rgb[2] < 5:
            print(f"    -> Black pixel at ({x}, {y}). Starting grid search...")
            for i in range(1, self.GRID_SEARCH_THRESHOLD + 1):
                for dx in range(-i, i + 1):
                    for dy in range(-i, i + 1):
                        if abs(dx) != i and abs(dy) != i: continue
                        px, py = x + dx, y + dy
                        if not (0 <= px < self.IMAGE_WIDTH and 0 <= py < self.IMAGE_HEIGHT): continue
                        neighbor_rgb = self.map_image.getpixel((px, py))
                        if neighbor_rgb[0] > 5 or neighbor_rgb[1] > 5 or neighbor_rgb[2] > 5:
                            print(f"    -> Found valid pixel at ({px}, {py}).")
                            return self._find_closest_value(neighbor_rgb)
            print(f"    -> Grid search failed. No valid data within {self.GRID_SEARCH_THRESHOLD}px.")
            return None
        else:
            return self._find_closest_value(pixel_rgb)

# --- NEW AND IMPROVED SST Predictor Function ---
def get_sst_at_coords(lat, lon):
    """
    Fetches Sea Surface Temperature using earthaccess, with a 10-day fallback.
    """
    if not NASA_USERNAME or not NASA_PASSWORD:
        raise ValueError("NASA Earthdata credentials not found in .env file.")

    # Authenticate once using credentials from .env
    try:
        auth = earthaccess.login(strategy="environment")
        if not auth.authenticated:
            raise ValueError("NASA Earthdata authentication failed. Please check credentials.")
        print("✅ Successfully logged into NASA Earthdata.")
    except Exception as e:
        print(f"ERROR during NASA login: {e}")
        raise ValueError("NASA Earthdata authentication failed.")

    SST_SHORT_NAME = "MUR-JPL-L4-GLOB-v4.1"

    # Loop for 11 days (today + 10 fallback days)
    for i in range(11):
        target_date = datetime(2025, 10, 2) - timedelta(days=i)
        date_str = target_date.strftime('%Y-%m-%d')
        print(f"  -> Attempting to fetch SST for date: {date_str}")

        try:
            granules_sst = earthaccess.search_data(
                short_name=SST_SHORT_NAME,
                temporal=(date_str, date_str)
            )

            if not granules_sst:
                print(f"  -> No SST data found for {date_str}. Trying previous day.")
                continue

            # Open the first available data file (granule)
            with xr.open_dataset(earthaccess.open(granules_sst)[0], engine="h5netcdf") as ds:
                # Select the nearest point in the data grid
                data_point = ds['analysed_sst'].sel(lat=lat, lon=lon, method='nearest')
                sst_kelvin = data_point.values.item()

                # Check for invalid values (NaN) which occur over land
                if isnan(sst_kelvin):
                    print(f"  -> Data point is over land (NaN value). Trying previous day.")
                    continue

                sst_celsius = sst_kelvin - 273.15

                # Check for a reasonable temperature range
                if -2 <= sst_celsius <= 40:
                    print(f"  ✅ SUCCESS: Fetched SST: {sst_celsius:.2f} °C for {date_str}")
                    return sst_celsius
                else:
                    print(f"  -> Found an unrealistic SST value ({sst_celsius:.2f} °C). Trying previous day.")

        except Exception as e:
            print(f"  -> An error occurred while fetching SST for {date_str}: {e}. Trying previous day.")

    print("  ❌ FAILED: Could not retrieve a valid SST value after 11 attempts.")
    return None

# Instantiate the ChlorophyllPredictor on module load to be a singleton
chlorophyll_service = ChlorophyllPredictor()