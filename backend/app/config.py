from pydantic import BaseModel
import os
from dotenv import load_dotenv

load_dotenv()


class Settings(BaseModel):
    app_name: str = "CNN Gender Classifier API"
    model_path: str = os.getenv("MODEL_PATH", "models/model.keras")

    image_width: int = int(os.getenv("IMAGE_WIDTH", "224"))
    image_height: int = int(os.getenv("IMAGE_HEIGHT", "224"))

    threshold: float = float(os.getenv("THRESHOLD", "0.5"))

    # IMPORTANTE:
    # Si entrenas con image_dataset_from_directory y carpetas:
    # data/female/
    # data/male/
    #
    # Keras normalmente ordena alfabéticamente:
    # female -> 0
    # male   -> 1
    #
    # En ese caso, la salida sigmoid representa la probabilidad de "male".
    positive_class: str = os.getenv("POSITIVE_CLASS", "male")
    negative_class: str = os.getenv("NEGATIVE_CLASS", "female")

    # HF Hub repo to download the model from if not present locally.
    # Format: "username/repo-name"  (leave empty to skip auto-download)
    hf_model_repo: str = os.getenv("HF_MODEL_REPO", "")

    cors_origins: list[str] = os.getenv(
        "CORS_ORIGINS",
        "http://localhost:3000,http://127.0.0.1:3000"
    ).split(",")


settings = Settings()