from pydantic import BaseModel


class ProbabilityResponse(BaseModel):
    male: float | None = None
    female: float | None = None


class PredictionResponse(BaseModel):
    predicted_class: str
    confidence: float
    probabilities: dict[str, float]
    raw_score: float
    gradcam: str | None = None
    saliency: str | None = None