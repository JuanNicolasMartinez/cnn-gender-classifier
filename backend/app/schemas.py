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


class InputSizeResponse(BaseModel):
    width: int
    height: int
    channels: int


class ClassesResponse(BaseModel):
    positive: str
    negative: str


class ModelMetadataResponse(BaseModel):
    model_name: str
    input_size: InputSizeResponse
    classes: ClassesResponse
    threshold: float
    accepted_mime_types: list[str]
    supports_xai: bool
    xai_outputs: list[str]
