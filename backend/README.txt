# Backend - CNN Gender Classifier API

Backend desarrollado con FastAPI para desplegar una red neuronal convolucional entrenada con TensorFlow/Keras.

La API permite recibir una imagen de rostro, aplicar el mismo preprocesamiento usado durante el entrenamiento, ejecutar la predicción del modelo y devolver mapas de interpretabilidad visual mediante Grad-CAM y Saliency Map.

---

## Estructura

```txt
backend/
├── app/
│   ├── main.py
│   ├── config.py
│   ├── model_loader.py
│   ├── preprocessing.py
│   ├── inference.py
│   ├── xai.py
│   └── schemas.py
│
├── models/
│   └── model.keras
│
├── requirements.txt
├── Dockerfile
└── .dockerignore