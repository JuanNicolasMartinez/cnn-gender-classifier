# CNN Gender Classifier

Clasificador binario de rostros usando una red neuronal convolucional construida desde cero con TensorFlow/Keras.  
El sistema permite cargar una imagen de rostro, obtener una predicción entre las clases `male` y `female`, y visualizar mapas de interpretabilidad mediante Grad-CAM y Saliency Map.

Este proyecto fue desarrollado como parte de un laboratorio de Deep Learning enfocado en CNNs, clasificación de imágenes, despliegue en la nube e interpretabilidad visual.

---

## Tabla de contenidos

- [CNN Gender Classifier](#cnn-gender-classifier)
  - [Tabla de contenidos](#tabla-de-contenidos)
  - [Descripción general](#descripción-general)
  - [Objetivos del proyecto](#objetivos-del-proyecto)
  - [Arquitectura del sistema](#arquitectura-del-sistema)
  - [Estructura del proyecto](#estructura-del-proyecto)
  - [Dataset](#dataset)
  - [Modelo CNN](#modelo-cnn)
  - [Interpretabilidad visual](#interpretabilidad-visual)
    - [Saliency Map](#saliency-map)
    - [Grad-CAM](#grad-cam)
  - [Backend API](#backend-api)
  - [Frontend web](#frontend-web)
  - [Instalación local](#instalación-local)
    - [1. Clonar el repositorio](#1-clonar-el-repositorio)
  - [Ejecución del backend](#ejecución-del-backend)
    - [1. Entrar a la carpeta del backend](#1-entrar-a-la-carpeta-del-backend)
    - [2. Crear entorno virtual](#2-crear-entorno-virtual)
    - [3. Activar entorno virtual](#3-activar-entorno-virtual)
    - [4. Instalar dependencias](#4-instalar-dependencias)
    - [5. Verificar que el modelo exista](#5-verificar-que-el-modelo-exista)
    - [6. Ejecutar la API](#6-ejecutar-la-api)
  - [Ejecución del frontend](#ejecución-del-frontend)
    - [1. Entrar a la carpeta del frontend](#1-entrar-a-la-carpeta-del-frontend)
    - [2. Instalar dependencias](#2-instalar-dependencias)
    - [3. Crear archivo de variables de entorno](#3-crear-archivo-de-variables-de-entorno)
    - [4. Ejecutar el frontend](#4-ejecutar-el-frontend)
  - [Despliegue en la nube](#despliegue-en-la-nube)
    - [Backend con Docker](#backend-con-docker)
    - [Variables de entorno del frontend en producción](#variables-de-entorno-del-frontend-en-producción)
  - [Endpoints principales](#endpoints-principales)
    - [Health check](#health-check)
    - [Predicción](#predicción)
  - [Flujo de inferencia](#flujo-de-inferencia)
  - [Resultados esperados](#resultados-esperados)
  - [Consideraciones éticas](#consideraciones-éticas)
  - [Posibles mejoras](#posibles-mejoras)
  - [Tecnologías utilizadas](#tecnologías-utilizadas)
  - [Autores](#autores)
  - [Licencia](#licencia)

---

## Descripción general

El proyecto implementa una solución completa de Machine Learning para clasificación de imágenes de rostros. A diferencia de una aplicación monolítica construida únicamente con Streamlit, este sistema separa la lógica de inferencia del modelo en una API independiente, permitiendo que cualquier cliente externo pueda consumir el modelo.

La solución está dividida en tres partes principales:

1. Entrenamiento de una CNN desde cero usando TensorFlow/Keras.
2. Despliegue del modelo como una API usando FastAPI.
3. Consumo del modelo desde un frontend web moderno desarrollado con React/Next.js.

---

## Objetivos del proyecto

Los objetivos principales son:

- Construir una red neuronal convolucional desde cero para clasificación binaria de imágenes.
- Entrenar el modelo usando imágenes RGB de rostros humanos.
- Aplicar preprocesamiento consistente entre entrenamiento e inferencia.
- Evaluar el desempeño del modelo usando métricas de clasificación.
- Implementar técnicas de interpretabilidad visual como Grad-CAM y Saliency Map.
- Desplegar el modelo como una API independiente en la nube.
- Construir una interfaz web capaz de consumir la API desde cualquier navegador.
- Presentar una arquitectura más cercana a un sistema real de producción.

---

## Arquitectura del sistema

La arquitectura propuesta separa el frontend, el backend y el modelo entrenado.

```txt
Usuario
  |
  v
Frontend Web - Next.js / React
  |
  | POST /predict
  | Imagen cargada por el usuario
  v
Backend API - FastAPI
  |
  | Preprocesamiento
  | Inferencia
  | Grad-CAM
  | Saliency Map
  v
Modelo CNN - TensorFlow/Keras
  |
  v
Respuesta JSON
  |
  | Predicción
  | Probabilidades
  | Visualizaciones XAI
  v
Frontend Web
```

Esta separación permite que el modelo pueda ser consumido por diferentes clientes, por ejemplo:

- Aplicación web.
- Aplicación móvil.
- Dashboard administrativo.
- Otro backend.
- Script externo de pruebas.

---

## Estructura del proyecto

```txt
cnn-gender-classifier/
│
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── model_loader.py
│   │   ├── preprocessing.py
│   │   ├── inference.py
│   │   ├── xai.py
│   │   └── schemas.py
│   │
│   ├── models/
│   │   └── model.keras
│   │
│   ├── requirements.txt
│   ├── Dockerfile
│   └── .dockerignore
│
├── frontend/
│   ├── app/
│   ├── components/
│   ├── package.json
│   └── .env.local
│
├── notebooks/
│   └── train_cnn.ipynb
│
├── reports/
│   └── informe.pdf
│
└── README.md
```

---

## Dataset

El dataset utilizado es **Male and Female Faces Dataset**, disponible en Kaggle.

La estructura esperada del dataset es:

```txt
data/
├── male/
│   ├── image_1.jpg
│   ├── image_2.jpg
│   └── ...
│
└── female/
    ├── image_1.jpg
    ├── image_2.jpg
    └── ...
```

Durante el preprocesamiento se aplican los siguientes pasos:

1. Lectura de imágenes en formato RGB.
2. Redimensionamiento a `224x224` píxeles.
3. Normalización de valores de píxeles al rango `[0, 1]`.
4. División del dataset en entrenamiento, validación y prueba.
5. Uso de semilla fija para reproducibilidad.

Distribución sugerida:

```txt
Entrenamiento: 70%
Validación:    15%
Prueba:        15%
```

---

## Modelo CNN

El modelo se construye desde cero usando la API de Keras.  
La arquitectura base contiene varios bloques convolucionales seguidos de capas densas para clasificación binaria.

Arquitectura general:

```txt
Input: 224x224x3

Bloque 1:
Conv2D
ReLU
MaxPooling2D

Bloque 2:
Conv2D
ReLU
MaxPooling2D

Bloque 3:
Conv2D
ReLU
MaxPooling2D

Clasificador:
Flatten o GlobalAveragePooling2D
Dense
Dropout
Dense(1, activation='sigmoid')
```

La salida del modelo es una probabilidad entre `0` y `1`.

Ejemplo de interpretación:

```txt
p >= 0.5  -> female
p <  0.5  -> male
```

La codificación exacta de las clases debe coincidir con la utilizada durante el entrenamiento.

---

## Interpretabilidad visual

El proyecto incluye dos métodos de interpretabilidad visual:

### Saliency Map

El Saliency Map permite identificar qué píxeles de la imagen tienen mayor influencia sobre la predicción final del modelo.

Este método calcula la sensibilidad de la salida del modelo respecto a los píxeles de entrada.

### Grad-CAM

Grad-CAM permite visualizar qué regiones de alto nivel activan con más fuerza una capa convolucional profunda del modelo.

Este método es especialmente útil para verificar si la CNN está tomando decisiones basadas en zonas relevantes del rostro o si está aprendiendo patrones no deseados del fondo, iluminación, accesorios u otros elementos externos.

---

## Backend API

El backend está construido con FastAPI.

Responsabilidades principales del backend:

- Cargar el modelo entrenado una sola vez al iniciar la aplicación.
- Recibir imágenes mediante peticiones HTTP.
- Validar el archivo recibido.
- Aplicar el mismo preprocesamiento usado durante el entrenamiento.
- Ejecutar la predicción del modelo.
- Generar mapas Grad-CAM y Saliency Map.
- Devolver una respuesta JSON al frontend.

Tecnologías utilizadas:

```txt
FastAPI
TensorFlow/Keras
NumPy
Pillow
OpenCV
Matplotlib
Uvicorn
```

---

## Frontend web

El frontend está construido con React o Next.js.

Responsabilidades principales del frontend:

- Permitir al usuario cargar una imagen.
- Mostrar una vista previa de la imagen.
- Enviar la imagen al backend mediante una petición `POST`.
- Mostrar la clase predicha.
- Mostrar las probabilidades para cada clase.
- Mostrar las visualizaciones de interpretabilidad generadas por la API.

El frontend no contiene lógica de Machine Learning.  
Toda la inferencia se realiza en el backend.

---

## Instalación local

### 1. Clonar el repositorio

```bash
git clone https://github.com/usuario/cnn-gender-classifier.git
cd cnn-gender-classifier
```

---

## Ejecución del backend

### 1. Entrar a la carpeta del backend

```bash
cd backend
```

### 2. Crear entorno virtual

```bash
python -m venv venv
```

### 3. Activar entorno virtual

En macOS/Linux:

```bash
source venv/bin/activate
```

En Windows:

```bash
venv\Scripts\activate
```

### 4. Instalar dependencias

```bash
pip install -r requirements.txt
```

### 5. Verificar que el modelo exista

El archivo del modelo debe estar ubicado en:

```txt
backend/models/model.keras
```

### 6. Ejecutar la API

```bash
uvicorn app.main:app --reload
```

La API quedará disponible en:

```txt
http://localhost:8000
```

La documentación automática estará disponible en:

```txt
http://localhost:8000/docs
```

---

## Ejecución del frontend

### 1. Entrar a la carpeta del frontend

```bash
cd frontend
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Crear archivo de variables de entorno

Crear un archivo llamado `.env.local`:

```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### 4. Ejecutar el frontend

```bash
npm run dev
```

La aplicación estará disponible en:

```txt
http://localhost:3000
```

---

## Despliegue en la nube

La arquitectura recomendada para despliegue es:

```txt
Frontend:
Vercel

Backend:
Render, DigitalOcean App Platform, Railway o similar

Modelo:
Incluido dentro del backend en backend/models/model.keras
```

### Backend con Docker

El backend puede desplegarse usando Docker.

Ejemplo de `Dockerfile`:

```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Variables de entorno del frontend en producción

En Vercel se debe configurar:

```bash
NEXT_PUBLIC_API_URL=https://url-publica-del-backend.com
```

---

## Endpoints principales

### Health check

```http
GET /health
```

Respuesta esperada:

```json
{
  "status": "ok"
}
```

---

### Predicción

```http
POST /predict
```

Recibe una imagen mediante `multipart/form-data`.

Campo esperado:

```txt
file
```

Ejemplo de respuesta:

```json
{
  "predicted_class": "female",
  "confidence": 0.91,
  "probabilities": {
    "male": 0.09,
    "female": 0.91
  },
  "gradcam": "data:image/png;base64,...",
  "saliency": "data:image/png;base64,..."
}
```

---

## Flujo de inferencia

```txt
Imagen subida por el usuario
        |
        v
Validación del archivo
        |
        v
Conversión a RGB
        |
        v
Resize a 224x224
        |
        v
Normalización a [0, 1]
        |
        v
Predicción con CNN
        |
        v
Generación de Grad-CAM y Saliency Map
        |
        v
Respuesta JSON al frontend
```

---

## Resultados esperados

El sistema debe permitir:

- Subir una imagen de rostro.
- Obtener una predicción entre `male` y `female`.
- Visualizar el nivel de confianza del modelo.
- Mostrar las probabilidades de ambas clases.
- Visualizar un Grad-CAM superpuesto sobre la imagen original.
- Visualizar un Saliency Map superpuesto sobre la imagen original.
- Consultar el modelo desde cualquier cliente externo mediante una API HTTP.

---

## Consideraciones éticas

Este proyecto debe entenderse como un ejercicio académico de clasificación de imágenes y despliegue de modelos de Deep Learning.

El modelo no debe interpretarse como una herramienta definitiva para determinar identidad, género real, sexo biológico o características personales de una persona. La predicción depende directamente del dataset usado, de su distribución, de sus sesgos y de los patrones visuales aprendidos durante el entrenamiento.

Algunas consideraciones importantes:

- El modelo puede aprender sesgos presentes en el dataset.
- La iluminación, pose, calidad de imagen, edad, accesorios o fondo pueden afectar la predicción.
- Las clases `male` y `female` corresponden a las etiquetas del dataset, no necesariamente a la identidad de las personas.
- No se recomienda usar este sistema en contextos sensibles, administrativos, laborales, legales o de toma de decisiones reales.
- Para pruebas públicas se deben usar imágenes con autorización o imágenes de uso permitido.

---

## Posibles mejoras

Algunas extensiones futuras del proyecto son:

- Comparar la CNN construida desde cero con modelos preentrenados.
- Implementar transferencia de aprendizaje usando MobileNetV2, EfficientNet o ResNet.
- Mejorar la interfaz de usuario.
- Agregar autenticación para proteger la API.
- Guardar historial de predicciones.
- Agregar monitoreo de uso del modelo.
- Implementar pruebas unitarias para backend y frontend.
- Agregar validación más estricta de imágenes.
- Medir latencia promedio de inferencia.
- Desplegar el backend en un servicio con GPU.
- Exportar el modelo a TensorFlow Lite u ONNX.
- Agregar más técnicas de interpretabilidad visual.

---

## Tecnologías utilizadas

```txt
Python
TensorFlow/Keras
FastAPI
Uvicorn
NumPy
Pillow
OpenCV
Matplotlib
Docker
React
Next.js
Vercel
Render o DigitalOcean App Platform
```

---

## Autores

Proyecto desarrollado por:

```txt
Nombre del estudiante 1
Nombre del estudiante 2
Nombre del estudiante 3
```

Curso:

```txt
Deep Learning
```

Profesor:

```txt
Nombre del profesor
```

Universidad:

```txt
Nombre de la universidad
```

---

## Licencia

Este proyecto fue desarrollado con fines académicos.  
El uso, modificación o distribución del código debe respetar las condiciones del dataset original y las políticas de privacidad asociadas al uso de imágenes de rostros humanos.