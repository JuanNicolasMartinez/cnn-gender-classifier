import os
import tensorflow as tf
from app.config import settings


_model = None


def _ensure_model_present():
    if os.path.exists(settings.model_path):
        return

    if not settings.hf_model_repo:
        raise FileNotFoundError(
            f"Model not found at '{settings.model_path}' and HF_MODEL_REPO is not set."
        )

    from huggingface_hub import hf_hub_download

    print(f"Downloading model from {settings.hf_model_repo} ...")
    os.makedirs(os.path.dirname(settings.model_path), exist_ok=True)
    hf_hub_download(
        repo_id=settings.hf_model_repo,
        filename="model.keras",
        local_dir=os.path.dirname(settings.model_path),
    )
    print("Model downloaded.")


def load_model():
    global _model

    if _model is None:
        _ensure_model_present()
        _model = tf.keras.models.load_model(settings.model_path)

    return _model