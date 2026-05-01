from PIL import Image
import numpy as np
import io

from app.config import settings


def read_image_from_bytes(file_bytes: bytes) -> Image.Image:
    """
    Reads an uploaded image from raw bytes and converts it to RGB.
    """
    image = Image.open(io.BytesIO(file_bytes)).convert("RGB")
    return image


def preprocess_image(image: Image.Image) -> np.ndarray:
    """
    Applies the same preprocessing used during training:
    - RGB image
    - Resize to 224x224
    - Normalize pixels to [0, 1]
    - Add batch dimension
    """
    image = image.resize((settings.image_width, settings.image_height))

    image_array = np.array(image).astype("float32")
    image_array = image_array / 255.0

    image_array = np.expand_dims(image_array, axis=0)

    return image_array


def pil_to_numpy_rgb(image: Image.Image) -> np.ndarray:
    """
    Converts a PIL image to RGB NumPy array.
    Useful for Grad-CAM and visualization overlays.
    """
    image = image.convert("RGB")
    image = image.resize((settings.image_width, settings.image_height))

    return np.array(image).astype("uint8")