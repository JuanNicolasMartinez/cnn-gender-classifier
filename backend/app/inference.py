from app.config import settings


def predict_binary_class(model, image_array):
    """
    Runs binary classification using a sigmoid output.

    Returns:
    - predicted class
    - confidence
    - probabilities for both classes
    """
    raw_prediction = model.predict(image_array, verbose=0)

    positive_probability = float(raw_prediction[0][0])
    negative_probability = 1.0 - positive_probability

    if positive_probability >= settings.threshold:
        predicted_class = settings.positive_class
        confidence = positive_probability
    else:
        predicted_class = settings.negative_class
        confidence = negative_probability

    return {
        "predicted_class": predicted_class,
        "confidence": round(confidence, 4),
        "probabilities": {
            settings.negative_class: round(negative_probability, 4),
            settings.positive_class: round(positive_probability, 4),
        },
        "raw_score": round(positive_probability, 4),
    }