from fastapi import FastAPI, UploadFile, File, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.model_loader import load_model
from app.preprocessing import (
    read_image_from_bytes,
    preprocess_image,
    pil_to_numpy_rgb,
)
from app.inference import predict_binary_class
from app.xai import generate_gradcam, generate_saliency_map


app = FastAPI(
    title=settings.app_name,
    description="API for binary face classification using a custom CNN.",
    version="1.0.0",
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


model = load_model()


@app.get("/")
def root():
    return {
        "message": "CNN Gender Classifier API is running.",
        "docs": "/docs",
        "health": "/health",
    }


@app.get("/health")
def health():
    return {
        "status": "ok",
        "model_loaded": model is not None,
    }


@app.post("/predict")
async def predict(
    file: UploadFile = File(...),
    include_xai: bool = Query(default=True),
):
    """
    Receives an image, preprocesses it, runs model inference,
    and optionally returns Grad-CAM and Saliency Map visualizations.
    """

    if file.content_type not in ["image/jpeg", "image/png", "image/jpg", "image/webp"]:
        raise HTTPException(
            status_code=400,
            detail="Invalid file type. Please upload a JPG, PNG or WEBP image.",
        )

    try:
        file_bytes = await file.read()

        pil_image = read_image_from_bytes(file_bytes)
        image_array = preprocess_image(pil_image)
        original_rgb = pil_to_numpy_rgb(pil_image)

        prediction = predict_binary_class(model, image_array)

        if include_xai:
            prediction["gradcam"] = generate_gradcam(
                model=model,
                image_array=image_array,
                original_rgb=original_rgb,
            )

            prediction["saliency"] = generate_saliency_map(
                model=model,
                image_array=image_array,
                original_rgb=original_rgb,
            )
        else:
            prediction["gradcam"] = None
            prediction["saliency"] = None

        return prediction

    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=f"Prediction failed: {str(error)}",
        )