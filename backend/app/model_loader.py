import tensorflow as tf
from app.config import settings


_model = None


def load_model():
    """
    Loads the Keras model only once and keeps it in memory.
    This avoids reloading the model on every request.
    """
    global _model

    if _model is None:
        _model = tf.keras.models.load_model(settings.model_path)

    return _model