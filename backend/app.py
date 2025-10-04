from flask import Flask, request, Response, send_file
from flask_cors import CORS
import requests
from PIL import Image
import io

app = Flask(__name__)
CORS(app)

@app.route('/api/image-proxy')
def image_proxy():
    image_url = request.args.get('url')

    if not image_url:
        return "URL parameter is required.", 400

    try:
        # Fetch the image from the NASA server
        nasa_response = requests.get(image_url, stream=True)
        nasa_response.raise_for_status()

        # --- IMAGE PROCESSING TO MAKE BACKGROUND TRANSPARENT ---
        
        # Open the image from the raw binary data and ensure it has an alpha channel
        original_image = Image.open(io.BytesIO(nasa_response.content)).convert("RGBA")
        
        # Get the pixel data
        pixel_data = original_image.getdata()

        new_pixel_data = []
        for item in pixel_data:
            # Check if the pixel is black (or very dark)
            # A tolerance (e.g., 15) is used to catch near-black compression artifacts
            if item[0] < 15 and item[1] < 15 and item[2] < 15:
                # If it's black, make it fully transparent
                new_pixel_data.append((255, 255, 255, 0))
            else:
                # Otherwise, keep the original pixel
                new_pixel_data.append(item)

        # Apply the new transparent pixel data to the image
        original_image.putdata(new_pixel_data)

        # Save the modified image to an in-memory buffer
        img_io = io.BytesIO()
        original_image.save(img_io, 'PNG')
        img_io.seek(0) # Move the buffer's cursor to the beginning

        # Send the processed image back to the frontend
        return send_file(img_io, mimetype='image/png')
        # ---------------------------------------------------------

    except requests.exceptions.RequestException as e:
        # If the image doesn't exist for a specific day, NASA returns an error.
        # We'll return a simple 1x1 transparent pixel to avoid breaking the map.
        if e.response and e.response.status_code == 404:
            # Create a 1x1 transparent PNG
            transparent_pixel = Image.new('RGBA', (1, 1), (0, 0, 0, 0))
            img_io = io.BytesIO()
            transparent_pixel.save(img_io, 'PNG')
            img_io.seek(0)
            return send_file(img_io, mimetype='image/png')

        print(f"Error fetching image: {e}")
        return f"Failed to fetch image from URL: {image_url}", 502

if __name__ == '__main__':
    app.run(debug=True, port=5000)