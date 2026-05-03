import type { TimelineNode } from "@/lib/types";

type TimelineNodeDetail = Pick<
  TimelineNode,
  "summary" | "detail" | "stats" | "sections"
>;

export const notebookTimelineDetails: Record<string, TimelineNodeDetail> = {
  environment: {
    summary:
      "El notebook carga TensorFlow, NumPy, Plotly, PIL, OpenCV y fija `SEED = 42` antes de tocar el dataset.",
    detail:
      "La corrida arranca verificando dependencias, silenciando warnings y dejando trazado el entorno real del laboratorio para que split, entrenamiento y gráficas puedan repetirse.",
    stats: [
      { label: "TensorFlow", value: "2.21.0" },
      { label: "GPUs", value: "0" },
      { label: "Semilla", value: "42" },
      { label: "Stack", value: "TF + NumPy + Plotly + OpenCV" },
    ],
    sections: [
      {
        title: "Preparación reproducible",
        items: [
          "Imports de TensorFlow/Keras, sklearn, Plotly, PIL, OpenCV, pandas, NumPy y utilidades del sistema.",
          "Fijación de semillas en `random`, `numpy` y `tf.random` para repetir split y entrenamiento.",
          "Inspección explícita de la versión de TensorFlow y del número de GPUs disponibles.",
        ],
      },
      {
        title: "Lectura operativa",
        items: [
          "La salida del notebook reporta `TensorFlow: 2.21.0` y `GPUs disponibles: 0`.",
          "Este hito explica por qué toda la corrida visible es CPU-bound y por qué las métricas posteriores pertenecen al mismo entorno.",
        ],
      },
    ],
  },
  theme: {
    summary:
      "Se define una plantilla `nico_dark` para que todas las figuras del notebook compartan la misma gramática visual.",
    detail:
      "No cambia el modelo, pero sí cambia cómo se leen histogramas, curvas, tablas y overlays a lo largo de todo el laboratorio.",
    stats: [
      { label: "Plantilla", value: "nico_dark" },
      { label: "Paleta", value: "5 tonos" },
      { label: "Cobertura", value: "Todas las figuras" },
    ],
    sections: [
      {
        title: "Configuración visual",
        items: [
          "Creación de la plantilla `nico_dark` con fondos, grillas, tipografía y `colorway` homogéneos.",
          "Aplicación de esa plantilla como default en Plotly antes de dibujar distribuciones, curvas y tablas.",
        ],
      },
      {
        title: "Por qué aparece aquí",
        items: [
          "Las curvas y tablas que antes estaban visibles en el dashboard ahora viven dentro de los modales y este paso explica su estilo de origen.",
          "Evita mezclar estilos distintos en un notebook técnico largo.",
        ],
      },
    ],
  },
  dataset: {
    summary:
      "El notebook descarga `ashwingupta3012/male-and-female-faces-dataset` y localiza las carpetas `Male Faces` y `Female Faces`.",
    detail:
      "Aquí nace la base real del experimento: 5,418 imágenes organizadas por clase en dos directorios y contadas explícitamente antes de cualquier resize.",
    stats: [
      { label: "Total", value: "5,418" },
      { label: "Male", value: "2,720" },
      { label: "Female", value: "2,698" },
      { label: "Gap", value: "22 imgs" },
    ],
    sections: [
      {
        title: "Fuente y estructura",
        items: [
          "Descarga automática con `kagglehub.dataset_download`.",
          "Construcción de rutas `DATA_ROOT`, `MALE_DIR` y `FEMALE_DIR` con `Path`.",
          "Conteo explícito de archivos por clase antes del preproceso.",
        ],
      },
      {
        title: "Hallazgos cuantitativos",
        items: [
          "2,720 imágenes male.",
          "2,698 imágenes female.",
          "Dataset casi balanceado: la diferencia es de solo 22 imágenes.",
          "La proporción visible es cercana a 50.2% male vs 49.8% female.",
        ],
      },
    ],
  },
  inspection: {
    summary:
      "Se toma una muestra de 400 imágenes para revisar anchos, altos, modos y formatos antes del resize.",
    detail:
      "El notebook no asume homogeneidad; la demuestra con un muestreo explícito para justificar la estandarización a 224x224.",
    stats: [
      { label: "Muestra", value: "400 imgs" },
      { label: "Ancho medio", value: "941 px" },
      { label: "Alto medio", value: "1,168 px" },
      { label: "Modos", value: "RGB/L/P/RGBA" },
    ],
    sections: [
      {
        title: "Resumen estadístico",
        items: [
          "Ancho en la muestra: min 199, max 8,675, media 941.",
          "Alto en la muestra: min 308, max 7,360, media 1,168.",
          "Modos detectados: RGB, L, P y RGBA.",
          "Formatos detectados: PNG y JPEG.",
        ],
      },
      {
        title: "Decisión de ingeniería",
        items: [
          "Confirma que el dataset mezcla resoluciones y representaciones de color.",
          "Justifica la conversión explícita a RGB y el resize uniforme antes de crear tensores.",
        ],
      },
    ],
  },
  "visual-audit": {
    summary:
      "Se grafican la distribución de clases, histogramas de tamaños y mosaicos representativos de male y female.",
    detail:
      "Esta etapa convierte el dataset en evidencia visual: los gráficos y mosaicos que antes veías en el dashboard ahora quedan explicados dentro de este evento.",
    stats: [
      { label: "Gráficos", value: "3 vistas" },
      { label: "Mosaico", value: "24 rostros" },
      { label: "Fuentes", value: "Plotly + Matplotlib" },
    ],
    sections: [
      {
        title: "Piezas visuales",
        items: [
          "Bar chart de distribución male/female.",
          "Histogramas separados para anchos y altos.",
          "Mosaicos de 12 rostros male y 12 female con bordes cromáticos diferenciados.",
        ],
      },
      {
        title: "Valor analítico",
        items: [
          "Permite detectar sesgos visibles, diversidad aparente y ruido de fondo.",
          "Aporta evidencia cualitativa sobre el dataset antes del preproceso.",
          "Conserva dentro del modal las vistas de dataset que antes estaban separadas del pipeline.",
        ],
      },
    ],
  },
  "tensor-build": {
    summary:
      "Cada archivo se abre con PIL, se convierte a RGB, se redimensiona y se concatena en memoria como `uint8`.",
    detail:
      "Aquí nacen el tensor `X` y la etiqueta binaria `y` con la convención `1 = Male`, `0 = Female` que luego se mantiene en evaluación y XAI.",
    stats: [
      { label: "Shape X", value: "(5418, 224, 224, 3)" },
      { label: "Shape y", value: "(5418,)" },
      { label: "Tipo", value: "uint8" },
      { label: "Memoria X", value: "815.6 MB" },
    ],
    sections: [
      {
        title: "Pipeline de carga",
        items: [
          "Función `load_images` para abrir, convertir a RGB y redimensionar con `Image.BILINEAR`.",
          "Construcción de `X_male` y `X_female`, luego concatenación en `X`.",
          "Creación del vector binario `y` con codificación `1 = Male`, `0 = Female`.",
          "Liberación de memoria intermedia con `gc.collect()`.",
        ],
      },
      {
        title: "Lectura de memoria",
        items: [
          "La carga completa en RAM acelera el laboratorio, pero hace visible un costo de 815.6 MB solo para `X`.",
          "La forma 224x224x3 fija la entrada que después reaparece en la app productiva.",
        ],
      },
    ],
  },
  split: {
    summary:
      "Se divide el dataset en train, validation y test con `train_test_split` y `stratify=y`.",
    detail:
      "La semilla fija y la estratificación dejan una partición oficial repetible para entrenamiento, validación y evaluación final.",
    stats: [
      { label: "Train", value: "3,792" },
      { label: "Validation", value: "813" },
      { label: "Test", value: "813" },
      { label: "Ratio", value: "70 / 15 / 15" },
    ],
    sections: [
      {
        title: "Método",
        items: [
          "Primer split 70/30 para separar `train` del resto.",
          "Segundo split 50/50 sobre `temp` para obtener validación y test balanceados.",
          "Chequeo explícito del conteo male/female por subconjunto.",
        ],
      },
      {
        title: "Conteos por subconjunto",
        items: [
          "Train: 1,904 male y 1,888 female.",
          "Validation: 408 male y 405 female.",
          "Test: 408 male y 405 female.",
          "La proporción de clases se mantiene casi idéntica en todos los subsets.",
        ],
      },
    ],
  },
  normalization: {
    summary:
      "Los tensores se convierten a `float32` dividiendo por 255 para estabilizar el entrenamiento.",
    detail:
      "El notebook valida el rango final y reporta memoria de `X_train_s` para dejar trazado el costo real del preproceso.",
    stats: [
      { label: "Dtype", value: "float32" },
      { label: "Rango", value: "[0, 1]" },
      { label: "Memoria train", value: "2283.2 MB" },
      { label: "Resize fijo", value: "224 x 224" },
    ],
    sections: [
      {
        title: "Transformación",
        items: [
          "Conversión de `X_train`, `X_val` y `X_test` a `float32`.",
          "Normalización simple `array / 255.0`.",
          "Chequeo del rango mínimo y máximo del tensor entrenable.",
        ],
      },
      {
        title: "Efecto práctico",
        items: [
          "Reduce inestabilidad numérica en backpropagation.",
          "Alinea el preproceso con el backend de inferencia que también trabaja en rango [0,1].",
          "Expone que el tensor de entrenamiento normalizado pesa más de 2.2 GB en memoria.",
        ],
      },
    ],
  },
  architecture: {
    summary:
      "Se construye `build_cnn` con tres bloques Conv+BN+Pool+SpatialDropout y una cabeza densa regularizada; luego la corrida principal instancia filtros 48/96/192 con `augment=False`.",
    detail:
      "Es uno de los bloques más densos del notebook porque fija arquitectura, regularización, forma de entrada y número real de parámetros del modelo entrenado ahí.",
    stats: [
      { label: "Modelo", value: "cnn_gender" },
      { label: "Params", value: "235,169" },
      { label: "Trainable", value: "234,497" },
      { label: "No trainable", value: "672" },
    ],
    sections: [
      {
        title: "Bloques principales",
        items: [
          "Entrada `224x224x3` con opción de augmentation embebida en la función constructora.",
          "La corrida principal del notebook usa `filters=(48, 96, 192)` y `augment=False` al instanciar el modelo.",
          "Bloque 1: Conv2D(48) + BatchNorm + MaxPool + SpatialDropout2D(0.10).",
          "Bloque 2: Conv2D(96) + BatchNorm + MaxPool + SpatialDropout2D(0.15).",
          "Bloque 3: Conv2D(192) + BatchNorm + MaxPool + SpatialDropout2D(0.20).",
          "Cabeza: `GlobalAveragePooling2D -> Dense(128) -> Dropout(0.50) -> Dense(1, sigmoid)`.",
        ],
      },
      {
        title: "Capas y parámetros",
        items: [
          "Conv1: 1,344 params; BatchNorm1: 192.",
          "Conv2: 41,568 params; BatchNorm2: 384.",
          "Conv3: 166,080 params; BatchNorm3: 768.",
          "Dense(128): 24,704 params; salida sigmoide: 129 params.",
        ],
      },
      {
        title: "Decisiones de diseño",
        items: [
          "No hay transfer learning: la CNN se construye completamente desde cero.",
          "La función `build_cnn` admite augmentation con `RandomFlip`, `RandomRotation(0.08)` y `RandomZoom(0.10)`.",
          "Se usa regularización L2 = 1e-4, BatchNormalization y SpatialDropout2D para contener overfitting.",
          "Este modal ahora absorbe la ficha de arquitectura que antes vivía aparte en el dashboard.",
        ],
      },
    ],
  },
  "compile-callbacks": {
    summary:
      "La CNN se compila con Adam y un set de métricas amplio; además se definen EarlyStopping, ReduceLROnPlateau y ModelCheckpoint.",
    detail:
      "Este bloque gobierna cómo aprende el modelo, cuándo frena y qué snapshot termina persistido a disco.",
    stats: [
      { label: "Optimizer", value: "Adam 1e-3" },
      { label: "Loss", value: "binary_crossentropy" },
      { label: "EarlyStop", value: "patience=8" },
      { label: "ReduceLR", value: "0.5 / patience=4" },
    ],
    sections: [
      {
        title: "Compilación",
        items: [
          "Loss `binary_crossentropy`.",
          "Métricas: accuracy, AUC, precision y recall.",
          "La salida sigmoide se optimiza como clasificación binaria pura.",
        ],
      },
      {
        title: "Callbacks",
        items: [
          "EarlyStopping con `patience=8` y `restore_best_weights=True`.",
          "ReduceLROnPlateau con factor 0.5, `patience=4` y `min_lr=1e-6`.",
          "ModelCheckpoint del mejor modelo en `models/model.keras` monitoreando `val_accuracy`.",
        ],
      },
      {
        title: "Cruce con la app",
        items: [
          "Los hiperparámetros que antes se resumían en tarjetas ahora quedan anexados al evento exacto que los define.",
          "El path `models/model.keras` es el puente entre notebook y runtime.",
        ],
      },
    ],
  },
  "training-fit": {
    summary:
      "Se entrena el modelo principal durante 30 épocas con batch 32 y después se exportan curvas de loss, accuracy y AUC.",
    detail:
      "El notebook usa este fit como línea base y de aquí salen varias de las métricas que antes se mostraban por fuera del pipeline.",
    stats: [
      { label: "Épocas", value: "30" },
      { label: "Batch", value: "32" },
      { label: "Best val acc", value: "90.4%" },
      { label: "Best val AUC", value: "97.2%" },
    ],
    sections: [
      {
        title: "Ejecución principal",
        items: [
          "Ejecución de `model.fit` con `validation_data=(X_val_s, y_val)`.",
          "Persistencia del objeto `history` para extraer curvas por época.",
          "Generación de curvas para `loss`, `val_loss`, `accuracy`, `val_accuracy` y AUC.",
        ],
      },
      {
        title: "Curvas reubicadas",
        items: [
          "La curva de accuracy por época y la de loss por época que estaban visibles en el dashboard ahora se interpretan desde este modal.",
          "La curva AUC queda asociada a la misma etapa del fit en lugar de aparecer como una pieza aislada.",
        ],
      },
      {
        title: "Nota de consistencia",
        items: [
          "Los 90.4% de `val_accuracy` y 97.2% de `val_auc` vienen del `training_log.csv` exportado para la UI.",
          "El notebook y ese log no tienen por qué corresponder a la misma corrida exacta; por eso la app ya no mezcla ambas lecturas en el tablero principal.",
        ],
      },
    ],
  },
  "test-save": {
    summary:
      "Después del fit se evalúa sobre test y se guarda el snapshot principal como `models/model.keras`.",
    detail:
      "Es el puente directo entre entrenamiento offline y el artefacto que luego se carga para inferencia y XAI.",
    stats: [
      { label: "Accuracy", value: "89.91%" },
      { label: "AUC", value: "96.75%" },
      { label: "Loss", value: "0.2620" },
      { label: "Precision/Recall", value: "84.98 / 97.06%" },
    ],
    sections: [
      {
        title: "Salida del notebook",
        items: [
          "Llamada a `model.evaluate(..., return_dict=True)` sobre `X_test_s`.",
          "Impresión de loss, accuracy, AUC, precision y recall del conjunto de test.",
          "Guardado explícito del modelo en `models/model.keras`.",
        ],
      },
      {
        title: "Interpretación",
        items: [
          "La accuracy 89.91% y el AUC 96.75% son la referencia offline fuerte que luego reaparece en la reflexión final.",
          "El recall 97.06% indica alta sensibilidad para la clase positiva tal como quedó codificada en el notebook.",
          "Este modal absorbe la parte de performance general que antes competía visualmente con el timeline.",
        ],
      },
    ],
  },
  "hp-sweep": {
    summary:
      "Se entrenan tres configuraciones con filtros, kernel, dropout y learning rate distintos para comparar validación y test.",
    detail:
      "Es uno de los bloques más grandes del notebook porque reinicia sesión, recompila y evalúa tres arquitecturas bajo reglas comparables.",
    stats: [
      { label: "Experimentos", value: "3" },
      { label: "Épocas HP", value: "18" },
      { label: "Winner", value: "Exp-C | k5+lr↓" },
      { label: "Test AUC", value: "89.04%" },
    ],
    sections: [
      {
        title: "Exp-A | base",
        items: [
          "Filtros (32, 64, 128), kernel 3, dense 128, dropout 0.50, lr 0.0010.",
          "Val acc 0.7774, Test acc 0.7934, Test AUC 0.8719, Test loss 0.4655.",
          "Parámetros: 110,785.",
        ],
      },
      {
        title: "Exp-B | wider",
        items: [
          "Filtros (48, 96, 192), kernel 3, dense 192, dropout 0.40, lr 0.0010.",
          "Val acc 0.7847, Test acc 0.7872, Test AUC 0.8620, Test loss 0.4753.",
          "Parámetros: 247,585.",
        ],
      },
      {
        title: "Exp-C | k5+lr↓",
        items: [
          "Filtros (32, 64, 128), kernel 5, dense 128, dropout 0.50, lr 0.0005.",
          "Val acc 0.8278, Test acc 0.8290, Test AUC 0.8904, Test loss 0.4350.",
          "Parámetros: 276,161.",
          "El notebook lo presenta como mejor configuración bajo el criterio de accuracy en test y brecha train-val.",
        ],
      },
      {
        title: "Lectura del bloque",
        items: [
          "Cada experimento limpia la sesión con `keras.backend.clear_session()` para aislar pesos y grafo.",
          "Los callbacks del sweep son más cortos (`patience=5` y `patience=3`) para comparar de forma justa.",
          "Todos los experimentos se entrenan con `EPOCHS_HP = 18` y el mismo `BATCH = 32`.",
          "Este modal absorbe la comparativa de tuning que antes aparecía resumida en tarjetas externas.",
        ],
      },
    ],
  },
  "threshold-eval": {
    summary:
      "Se carga el modelo guardado, se mide baseline en 0.50, se barre threshold y se generan confusion matrix, ROC, PR e histogramas.",
    detail:
      "Este bloque concentra gran parte de la evaluación rigurosa del notebook y documenta una tensión clara entre threshold óptimo para F1 y threshold operativo de la app.",
    stats: [
      { label: "Baseline", value: "0.50" },
      { label: "Best threshold", value: "0.55" },
      { label: "Best F1", value: "85.81%" },
      { label: "Prod threshold", value: "0.65" },
    ],
    sections: [
      {
        title: "Reporte con threshold 0.50",
        items: [
          "Female: precision 0.9255, recall 0.7358, F1 0.8198, support 405.",
          "Male: precision 0.7821, recall 0.9412, F1 0.8543, support 408.",
          "Accuracy total 0.8389; macro F1 0.8370; weighted F1 0.8371.",
        ],
      },
      {
        title: "Barrido de thresholds",
        items: [
          "El sweep recorre thresholds desde 0.20 hasta 0.79 en pasos de 0.01.",
          "Eso implica 60 thresholds candidatos evaluados sobre el mismo vector `y_proba`.",
          "F1 con threshold 0.50: 0.8543.",
          "F1 máximo encontrado: 0.8581 en threshold 0.55.",
          "El propio notebook sugiere configurar `THRESHOLD=0.55` en backend y en el Space.",
        ],
      },
      {
        title: "Reporte con threshold 0.65",
        items: [
          "Female: precision 0.8329, recall 0.8370, F1 0.8350.",
          "Male: precision 0.8374, recall 0.8333, F1 0.8354.",
          "Accuracy total 0.8352; macro y weighted avg 0.8352.",
          "Este valor coincide con el threshold que hoy usa la aplicación productiva.",
        ],
      },
      {
        title: "Artefactos de evaluación",
        items: [
          "Matriz de confusión, curva ROC, curva Precision-Recall e histograma de probabilidades por clase.",
          "El histograma usa `nbinsx = 30` y superpone distribuciones de `P(Male)` para clases reales male y female.",
          "Las vistas de AUC y distribución que antes estaban afuera del timeline ahora quedan ligadas a este evento de evaluación.",
        ],
      },
    ],
  },
  "xai-impl": {
    summary:
      "Se detecta la última capa convolucional y después se implementan Saliency, SmoothGrad, Grad-CAM y overlays.",
    detail:
      "Es otro bloque complejo porque incluye gradientes sobre píxeles, mapas de activación y composición visual final con OpenCV.",
    stats: [
      { label: "Última conv", value: "conv3" },
      { label: "Métodos", value: "Saliency + Grad-CAM" },
      { label: "SmoothGrad", value: "15 samples" },
      { label: "Noise", value: "0.10" },
    ],
    sections: [
      {
        title: "Funciones clave",
        items: [
          "Función `get_last_conv_layer` para detectar automáticamente la última `Conv2D` del modelo: `conv3`.",
          "Saliency vanilla y SmoothGrad con `GradientTape` sobre la imagen de entrada.",
          "Grad-CAM clásico usando gradientes respecto a la última capa convolucional.",
          "Overlays con OpenCV sobre la imagen original normalizada en [0,1].",
          "En `xai_panel`, SmoothGrad usa alpha 0.55 con `COLORMAP_INFERNO` y Grad-CAM alpha 0.50 con `COLORMAP_JET`.",
        ],
      },
      {
        title: "Lectura metodológica",
        items: [
          "Saliency enfatiza sensibilidad local de píxeles; Grad-CAM resume regiones semánticas más amplias.",
          "La combinación de ambos métodos reduce el riesgo de leer una sola explicación como verdad única.",
          "Este modal hereda la parte interpretativa que antes estaba repartida entre tarjetas y paneles XAI.",
        ],
      },
    ],
  },
  "xai-cases": {
    summary:
      "Se seleccionan rostros male y female correctamente clasificados y se visualizan paneles completos con overlays.",
    detail:
      "El notebook no se queda en funciones abstractas: aterriza la interpretabilidad en ejemplos concretos del conjunto de test.",
    stats: [
      { label: "Male idx", value: "627" },
      { label: "P(Male)", value: "0.9984" },
      { label: "Female idx", value: "448" },
      { label: "P(Male)", value: "0.0000" },
    ],
    sections: [
      {
        title: "Caso male",
        items: [
          "Se elige un ejemplo correctamente clasificado con idx 627.",
          "La selección sale del 3er ejemplo correcto más confiable, no del máximo absoluto.",
          "La probabilidad reportada para la clase positiva es P(Male)=0.9984.",
          "Se visualiza un panel 1x4 con original, saliency, heatmap Grad-CAM y overlay.",
        ],
      },
      {
        title: "Caso female",
        items: [
          "Se elige un ejemplo correctamente clasificado con idx 448.",
          "También proviene del 3er ejemplo correcto más confiable para esa clase.",
          "La probabilidad reportada para la clase positiva es P(Male)=0.0000.",
          "También se renderiza su panel 1x4 con ambos métodos de explicación.",
        ],
      },
      {
        title: "Comparación y lectura",
        items: [
          "El notebook además construye una vista 2x3 comparando overlays de ambas clases lado a lado.",
          "En el análisis final se mencionan activaciones frecuentes en mandíbula, cabello y zona ocular.",
          "Se busca coherencia entre SmoothGrad y Grad-CAM como evidencia de atención facial legítima.",
        ],
      },
    ],
  },
  reflection: {
    summary:
      "El notebook cierra con una reflexión sobre desempeño, interpretabilidad, sesgos del dataset y el desajuste entre lo documentado y lo servido por la app.",
    detail:
      "Esta etapa baja el tono triunfalista y vuelve explícitos los límites éticos y técnicos del problema, además de absorber el contexto que antes vivía en el dashboard.",
    stats: [
      { label: "Notebook acc", value: "89.91%" },
      { label: "Notebook AUC", value: "96.75%" },
      { label: "Runtime threshold", value: "0.65" },
      { label: "App snapshot", value: "48 / 96 / 192" },
    ],
    sections: [
      {
        title: "Conclusiones del notebook",
        items: [
          "La reflexión final resume el proyecto como una CNN estable con accuracy superior al 90% aproximadamente y AUC cercana a 0.97 en test.",
          "Los mapas XAI se leen como evidencia visual complementaria y no como prueba absoluta.",
          "La clasificación de género se trata como una tarea sensible, no como una verdad ontológica.",
        ],
      },
      {
        title: "Limitaciones y siguientes pasos",
        items: [
          "Dataset pequeño y sin documentación demográfica profunda.",
          "Riesgo de sesgos de representación y uso indebido del modelo.",
          "Posibles extensiones: multi-task, Score-CAM, Integrated Gradients y cuantización.",
        ],
      },
      {
        title: "Cruce con la app",
        items: [
          "La app productiva venía mostrando input 224x224x3, bloques 48/96/192, Dense 128 y 704,165 parámetros totales.",
          "El notebook que lees aquí muestra una corrida principal con bloques 48/96/192 y 235,169 parámetros totales.",
          "La misma función `build_cnn` permite otras configuraciones y por eso el sweep reabre variantes 32/64/128 y kernels distintos.",
          "El backend hoy usa threshold 0.65, aunque el barrido del notebook recomienda 0.55 para maximizar F1.",
          "Por eso las métricas del dashboard dejaron de estar flotando afuera: ahora viven dentro del evento que explica su origen y su posible contradicción.",
        ],
      },
    ],
  },
};
