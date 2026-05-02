import type {
  ChartAsset,
  HeroHighlight,
  MetricDescriptor,
  NavigationItem,
  PatientOverviewCardData,
  PipelineStage,
  TimelineNode,
} from "@/lib/types";

export const navigationItems: NavigationItem[] = [
  {
    href: "/dashboard",
    label: "Dashboard",
    eyebrow: "Métricas y prod",
    icon: "dashboard",
  },
  {
    href: "/pipeline",
    label: "Pipeline",
    eyebrow: "Preproceso y CNN",
    icon: "pipeline",
  },
  {
    href: "/model",
    label: "Model",
    eyebrow: "Inferencia y XAI",
    icon: "model",
  },
];

export const modelOverviewCard: PatientOverviewCardData = {
  eyebrow: "Clinical ML profile",
  title: "cnn_gender",
  subtitle: "Clasificador binario listo para producción",
  meta: "Runtime FastAPI + TensorFlow/Keras",
  status: "XAI activo",
  details: [
    { label: "Input", value: "224 x 224 x 3", icon: "image" },
    { label: "Clases", value: "Male / Female", icon: "dataset" },
    { label: "Threshold", value: "0.65", icon: "runtime" },
  ],
};

export const pipelineOverviewCard: PatientOverviewCardData = {
  eyebrow: "Notebook journey",
  title: "15 hitos del laboratorio",
  subtitle: "Entorno, EDA, preproceso, CNN, tuning, evaluación y XAI",
  meta: "Dashboard + timeline unificada",
  status: "Notebook completamente trazado",
  details: [
    { label: "Timeline", value: "15 nodos interactivos", icon: "pipeline" },
    { label: "Experimentos", value: "Exp-A / Exp-B / Exp-C", icon: "training" },
    { label: "Artifacts", value: "model.keras + ROC/PR + XAI", icon: "deploy" },
  ],
};

export const dashboardMetrics: MetricDescriptor[] = [
  {
    label: "Validation accuracy",
    value: "90.4%",
    detail: "Mejor punto del `training_log.csv`",
    tone: "accent",
  },
  {
    label: "Validation AUC",
    value: "97.2%",
    detail: "Curva de validación del reporte",
    tone: "muted",
  },
  {
    label: "Offline accuracy",
    value: "83.9%",
    detail: "Evaluation del notebook con threshold 0.50",
    tone: "light",
  },
  {
    label: "Threshold prod",
    value: "0.65",
    detail: "Decisión activa del backend en inferencia",
    tone: "dark",
  },
];

export const datasetStats = {
  total: "5,418",
  male: "2,720",
  female: "2,698",
  train: "3,792",
  validation: "813",
  test: "813",
  split: "70 / 15 / 15",
};

export const reportCharts: ChartAsset[] = [
  {
    title: "Accuracy por época",
    description: "Curva exportada desde `reports/figures/accuracy_curve.png`.",
    src: "/model-assets/accuracy-curve.png",
    alt: "Curva de accuracy del entrenamiento del modelo CNN.",
  },
  {
    title: "Loss por época",
    description: "Permite ver la brecha train/val y el efecto de los callbacks.",
    src: "/model-assets/loss-curve.png",
    alt: "Curva de pérdida del entrenamiento del modelo CNN.",
  },
  {
    title: "AUC por época",
    description: "La señal más estable para comparar el modelo en validación.",
    src: "/model-assets/auc-curve.png",
    alt: "Curva AUC del entrenamiento del modelo CNN.",
  },
  {
    title: "Muestras del dataset",
    description: "Ejemplos de rostros reales usados en entrenamiento y evaluación.",
    src: "/model-assets/dataset-examples.png",
    alt: "Mosaico de ejemplos del dataset Male and Female Faces Dataset.",
  },
];

export const pipelineHeroHighlights: HeroHighlight[] = [
  { label: "Modelo", value: "cnn_gender" },
  { label: "Split", value: "70 / 15 / 15" },
  { label: "Input", value: "224 x 224" },
  { label: "XAI", value: "2 mapas" },
];

export const pipelineSummaryMetrics: MetricDescriptor[] = [
  {
    label: "Hitos notebook",
    value: "15",
    detail: "Pasos explícitos desde imports hasta reflexión final",
    tone: "accent",
  },
  {
    label: "Experimentos",
    value: "3",
    detail: "Comparativa Exp-A, Exp-B y Exp-C con validación justa",
    tone: "light",
  },
  {
    label: "Entrenamiento",
    value: "30 ep / 32 batch",
    detail: "Fit principal con callbacks y checkpoint del mejor snapshot",
    tone: "muted",
  },
  {
    label: "Interpretabilidad",
    value: "2 métodos",
    detail: "SmoothGrad Saliency + Grad-CAM regional",
    tone: "dark",
  },
];

export const pipelineTimelineNodes: TimelineNode[] = [
  {
    id: "environment",
    label: "Configuración del entorno",
    shortLabel: "Setup",
    summary: "Se cargan TensorFlow, NumPy, Plotly, OpenCV y se fija `SEED = 42` para reproducibilidad.",
    detail:
      "El notebook arranca preparando librerías, warnings, rutas y semillas para que entrenamiento, split y visualizaciones sean reproducibles.",
    badgeCount: 4,
    tone: "default",
    icon: "runtime",
    size: "sm",
    lane: "top",
    complexity: "Baja",
    stats: [
      { label: "Semilla", value: "42" },
      { label: "Bloques", value: "Base + DL + viz" },
    ],
    sections: [
      {
        title: "Qué se hizo",
        items: [
          "Imports de TensorFlow/Keras, sklearn, Plotly, PIL, OpenCV y utilidades del sistema.",
          "Fijación de semillas en `random`, `numpy` y `tf.random`.",
          "Inspección de la versión de TensorFlow y disponibilidad de GPU.",
        ],
      },
      {
        title: "Por qué importa",
        items: [
          "Permite repetir resultados del split y del entrenamiento.",
          "Hace trazable el entorno antes de tocar el dataset.",
        ],
      },
    ],
  },
  {
    id: "theme",
    label: "Tema visual del reporte",
    shortLabel: "Plotly",
    summary: "Se define un tema oscuro refinado para que todas las figuras del notebook compartan gramática visual consistente.",
    detail:
      "No afecta el modelo, pero sí la legibilidad del laboratorio y la comparación entre curvas, tablas e histogramas.",
    badgeCount: 1,
    tone: "muted",
    icon: "metrics",
    size: "sm",
    lane: "bottom",
    complexity: "Baja",
    stats: [
      { label: "Plantilla", value: "nico_dark" },
      { label: "Paleta", value: "5 tonos base" },
    ],
    sections: [
      {
        title: "Qué se hizo",
        items: [
          "Creación de la plantilla `nico_dark` con fondos, grillas, tipografía y `colorway` homogéneos.",
          "Aplicación de la plantilla como default en Plotly para todo el notebook.",
        ],
      },
      {
        title: "Por qué importa",
        items: [
          "Ayuda a leer mejor las curvas del entrenamiento y las comparativas de tuning.",
          "Evita mezclar estilos diferentes en un informe técnico largo.",
        ],
      },
    ],
  },
  {
    id: "dataset",
    label: "Descarga y estructura del dataset",
    shortLabel: "Dataset",
    summary: "Se descarga el dataset desde KaggleHub y se localizan las carpetas `Male Faces` y `Female Faces`.",
    detail:
      "Aquí se define la base real del experimento: 5,418 imágenes organizadas por clase en dos directorios separados.",
    badgeCount: 2,
    tone: "active",
    icon: "dataset",
    size: "md",
    lane: "top",
    complexity: "Media",
    stats: [
      { label: "Total", value: "5,418" },
      { label: "Clases", value: "Male / Female" },
    ],
    sections: [
      {
        title: "Qué se hizo",
        items: [
          "Descarga automática con `kagglehub.dataset_download`.",
          "Construcción de rutas `DATA_ROOT`, `MALE_DIR` y `FEMALE_DIR`.",
          "Conteo explícito de archivos por clase para detectar balance inicial.",
        ],
      },
      {
        title: "Hallazgos",
        items: [
          "2,720 imágenes male.",
          "2,698 imágenes female.",
          "Dataset casi balanceado, lo que reduce sesgo de frecuencia de clase.",
        ],
      },
    ],
  },
  {
    id: "inspection",
    label: "Inspección de tamaños y formatos",
    shortLabel: "EDA 1",
    summary: "Se toma una muestra de 400 imágenes para revisar anchos, altos, modos y formatos antes del resize.",
    detail:
      "El notebook no asume homogeneidad; la verifica con muestreo para justificar la estandarización a 224×224.",
    badgeCount: 3,
    tone: "default",
    icon: "metrics",
    size: "md",
    lane: "bottom",
    complexity: "Media",
    stats: [
      { label: "Muestra", value: "400 imgs" },
      { label: "Chequeos", value: "size + mode + format" },
    ],
    sections: [
      {
        title: "Qué se hizo",
        items: [
          "Función `inspect` para abrir una muestra aleatoria y extraer `im.size`, `im.mode` y `im.format`.",
          "Cálculo de mínimos, máximos y medias de ancho/alto en la muestra.",
          "Visualización posterior de histogramas de tamaños con Plotly.",
        ],
      },
      {
        title: "Por qué importa",
        items: [
          "Confirma la variabilidad de resolución del dataset.",
          "Justifica el resize y la conversión explícita a RGB antes de crear tensores.",
        ],
      },
    ],
  },
  {
    id: "visual-audit",
    label: "Distribuciones y mosaicos",
    shortLabel: "EDA 2",
    summary: "Se grafican la distribución de clases, histogramas de tamaños y mosaicos representativos de male y female.",
    detail:
      "Esta etapa transforma el dataset en algo inspeccionable visualmente antes de entrenar cualquier CNN.",
    badgeCount: 4,
    tone: "muted",
    icon: "image",
    size: "md",
    lane: "top",
    complexity: "Media",
    stats: [
      { label: "Gráficos", value: "3 vistas" },
      { label: "Mosaico", value: "12 ejemplos por clase" },
    ],
    sections: [
      {
        title: "Qué se hizo",
        items: [
          "Bar chart de distribución male/female.",
          "Histogramas separados para anchos y altos.",
          "Mosaicos de rostros con bordes cromáticos distintos por clase.",
        ],
      },
      {
        title: "Valor analítico",
        items: [
          "Permite detectar sesgos visibles, diversidad aparente y ruido de fondo.",
          "Aporta evidencia cualitativa sobre el dataset antes del preproceso.",
        ],
      },
    ],
  },
  {
    id: "tensor-build",
    label: "Carga a tensores y resize 224×224",
    shortLabel: "Load",
    summary: "Cada archivo se abre con PIL, se convierte a RGB, se redimensiona y se concatena en memoria como `uint8`.",
    detail:
      "Aquí nace el tensor `X` y la etiqueta binaria `y` con la convención `1 = Male`, `0 = Female`.",
    badgeCount: 5,
    tone: "active",
    icon: "image",
    size: "lg",
    lane: "bottom",
    complexity: "Alta",
    stats: [
      { label: "Shape", value: "(5418, 224, 224, 3)" },
      { label: "Tipo", value: "uint8" },
    ],
    sections: [
      {
        title: "Qué se hizo",
        items: [
          "Función `load_images` para abrir, convertir a RGB y redimensionar con `Image.BILINEAR`.",
          "Construcción de `X_male` y `X_female`, luego concatenación en `X`.",
          "Creación del vector binario `y` con codificación `1 = Male`, `0 = Female`.",
          "Liberación de memoria intermedia con `gc.collect()`.",
        ],
      },
      {
        title: "Implicaciones",
        items: [
          "Fija la forma de entrada usada después en Keras.",
          "Hace explícita la carga completa en memoria para acelerar experimentación.",
        ],
      },
    ],
  },
  {
    id: "split",
    label: "Split estratificado 70 / 15 / 15",
    shortLabel: "Split",
    summary: "Se divide el dataset en train, validation y test con `train_test_split` y `stratify=y`.",
    detail:
      "La semilla fija asegura que el laboratorio pueda repetirse con la misma partición oficial.",
    badgeCount: 3,
    tone: "default",
    icon: "split",
    size: "md",
    lane: "top",
    complexity: "Media",
    stats: [
      { label: "Train", value: "3,792" },
      { label: "Val/Test", value: "813 / 813" },
    ],
    sections: [
      {
        title: "Qué se hizo",
        items: [
          "Primer split 70/30 para separar `train` del resto.",
          "Segundo split 50/50 sobre `temp` para obtener validación y test balanceados.",
          "Chequeo explícito del conteo male/female por subconjunto.",
        ],
      },
      {
        title: "Por qué importa",
        items: [
          "Evita fuga de información entre entrenamiento y evaluación final.",
          "Mantiene proporciones de clase estables en todos los subconjuntos.",
        ],
      },
    ],
  },
  {
    id: "normalization",
    label: "Escalado a `float32` y rango [0,1]",
    shortLabel: "Scale",
    summary: "Los tensores se convierten a `float32` dividiendo por 255 para estabilizar el entrenamiento.",
    detail:
      "El notebook valida el rango final y reporta memoria de `X_train_s` como parte de la trazabilidad.",
    badgeCount: 2,
    tone: "muted",
    icon: "runtime",
    size: "sm",
    lane: "bottom",
    complexity: "Baja",
    stats: [
      { label: "Dtype", value: "float32" },
      { label: "Rango", value: "[0, 1]" },
    ],
    sections: [
      {
        title: "Qué se hizo",
        items: [
          "Conversión de `X_train`, `X_val` y `X_test` a `float32`.",
          "Normalización simple `array / 255.0`.",
          "Chequeo del rango mínimo y máximo del tensor entrenable.",
        ],
      },
      {
        title: "Por qué importa",
        items: [
          "Reduce inestabilidad numérica en backpropagation.",
          "Alinea el preproceso con el backend de inferencia.",
        ],
      },
    ],
  },
  {
    id: "architecture",
    label: "Diseño de la CNN desde cero",
    shortLabel: "CNN",
    summary: "Se construye `build_cnn` con tres bloques Conv+BN+Pool+SpatialDropout y cabeza densa regularizada.",
    detail:
      "Es uno de los puntos más complejos del notebook porque define la arquitectura, regularización y entrada del modelo final.",
    badgeCount: 6,
    tone: "active",
    icon: "training",
    size: "xl",
    lane: "top",
    complexity: "Muy alta",
    stats: [
      { label: "Filtros", value: "48 / 96 / 192" },
      { label: "Head", value: "GAP + Dense128" },
    ],
    sections: [
      {
        title: "Bloques principales",
        items: [
          "Entrada `224×224×3` con opción de augmentation embebida.",
          "Bloque 1: Conv2D -> BatchNorm -> MaxPool -> SpatialDropout2D(0.10).",
          "Bloque 2: Conv2D -> BatchNorm -> MaxPool -> SpatialDropout2D(0.15).",
          "Bloque 3: Conv2D -> BatchNorm -> MaxPool -> SpatialDropout2D(0.20).",
          "Cabeza: `GlobalAveragePooling2D -> Dense(128) -> Dropout(0.5) -> Dense(1, sigmoid)`.",
        ],
      },
      {
        title: "Decisiones de diseño",
        items: [
          "Sin transfer learning, cumpliendo el requisito del laboratorio.",
          "Uso de `BatchNormalization`, `SpatialDropout2D` y regularización L2 para controlar overfitting.",
          "La variante servida desactiva augmentation en la instancia final del modelo exportado.",
        ],
      },
    ],
  },
  {
    id: "compile-callbacks",
    label: "Compilación, métricas y callbacks",
    shortLabel: "Control",
    summary: "La CNN se compila con Adam y un set de métricas amplio; además se definen EarlyStopping, ReduceLROnPlateau y ModelCheckpoint.",
    detail:
      "Este bloque gobierna cómo aprende el modelo, cuándo frena y qué snapshot termina persistido a disco.",
    badgeCount: 4,
    tone: "default",
    icon: "training",
    size: "lg",
    lane: "bottom",
    complexity: "Alta",
    stats: [
      { label: "Optimizer", value: "Adam 1e-3" },
      { label: "Callbacks", value: "3 activos" },
    ],
    sections: [
      {
        title: "Qué se configuró",
        items: [
          "Loss `binary_crossentropy`.",
          "Métricas: accuracy, AUC, precision y recall.",
          "EarlyStopping con `patience=8` y restauración de mejores pesos.",
          "ReduceLROnPlateau con factor 0.5 y `patience=4`.",
          "Checkpoint del mejor modelo en `models/model.keras` monitoreando `val_accuracy`.",
        ],
      },
      {
        title: "Por qué importa",
        items: [
          "Reduce sobreentrenamiento y guarda automáticamente el mejor snapshot.",
          "Deja la ruta `model.keras` lista para despliegue posterior.",
        ],
      },
    ],
  },
  {
    id: "training-fit",
    label: "Entrenamiento principal y curvas",
    shortLabel: "Fit",
    summary: "Se entrena el modelo principal durante 30 épocas con batch 32 y se grafican loss/accuracy de train y validación.",
    detail:
      "El notebook usa este fit como línea base del proyecto y luego exporta las curvas para documentar comportamiento del entrenamiento.",
    badgeCount: 3,
    tone: "active",
    icon: "metrics",
    size: "lg",
    lane: "top",
    complexity: "Alta",
    stats: [
      { label: "Épocas", value: "30" },
      { label: "Batch", value: "32" },
    ],
    sections: [
      {
        title: "Qué se hizo",
        items: [
          "Ejecución de `model.fit` con `validation_data=(X_val_s, y_val)`.",
          "Persistencia del objeto `history` para extraer curvas por época.",
          "Generación de gráficos comparando `loss`, `val_loss`, `accuracy` y `val_accuracy`.",
        ],
      },
      {
        title: "Valor analítico",
        items: [
          "Permite detectar brechas train-val y el efecto de los callbacks.",
          "Sirve como referencia frente a la etapa de tuning posterior.",
        ],
      },
    ],
  },
  {
    id: "test-save",
    label: "Evaluación inicial y guardado",
    shortLabel: "Test",
    summary: "Después del fit se evalúa sobre test y se guarda el snapshot principal como `models/model.keras`.",
    detail:
      "Es el puente entre entrenamiento offline y el artefacto que luego se carga para inferencia y XAI.",
    badgeCount: 2,
    tone: "default",
    icon: "deploy",
    size: "md",
    lane: "bottom",
    complexity: "Media",
    stats: [
      { label: "Artifact", value: "model.keras" },
      { label: "Salida", value: "metrics dict" },
    ],
    sections: [
      {
        title: "Qué se hizo",
        items: [
          "Llamada a `model.evaluate(..., return_dict=True)` sobre `X_test_s`.",
          "Impresión de loss, accuracy y otras métricas del conjunto de test.",
          "Guardado explícito del modelo en `models/model.keras`.",
        ],
      },
      {
        title: "Rol en el notebook",
        items: [
          "Deja un snapshot utilizable antes del bloque de comparativa de hiperparámetros.",
          "Conecta el laboratorio con el despliegue posterior.",
        ],
      },
    ],
  },
  {
    id: "hp-sweep",
    label: "Comparativa de hiperparámetros",
    shortLabel: "Tuning",
    summary: "Se entrenan tres configuraciones con filtros, kernel, dropout y learning rate distintos para comparar validación y test.",
    detail:
      "Es uno de los bloques más grandes del notebook porque reinicia sesión, recompila y evalúa tres arquitecturas bajo reglas comparables.",
    badgeCount: 3,
    tone: "active",
    icon: "training",
    size: "xl",
    lane: "top",
    complexity: "Muy alta",
    stats: [
      { label: "Experimentos", value: "Exp-A/B/C" },
      { label: "Épocas HP", value: "18" },
    ],
    sections: [
      {
        title: "Qué se hizo",
        items: [
          "Definición de tres configuraciones con cambios en filtros, kernel, dense units, dropout y LR.",
          "Loop de entrenamiento con `keras.backend.clear_session()` para aislar experimentos.",
          "Uso de callbacks más cortos (`patience=5` y `patience=3`) para comparación justa.",
          "Construcción de `results_df` con accuracy/AUC/loss y número de parámetros.",
          "Visualización tabular y curvas comparativas de `val_accuracy` y `val_loss`.",
        ],
      },
      {
        title: "Resultado narrativo",
        items: [
          "El notebook usa esta etapa para justificar la selección de la configuración final.",
          "La comparación no se basa solo en accuracy sino también en estabilidad train-val.",
        ],
      },
    ],
  },
  {
    id: "threshold-eval",
    label: "Threshold, F1 y métricas finales",
    shortLabel: "Eval",
    summary: "Se carga el mejor modelo, se mide baseline en 0.50, se barre threshold y se generan confusion matrix, ROC, PR y histogramas.",
    detail:
      "Este bloque concentra gran parte de la evaluación rigurosa del notebook y documenta una tensión importante entre threshold óptimo y threshold operativo.",
    badgeCount: 5,
    tone: "active",
    icon: "metrics",
    size: "xl",
    lane: "bottom",
    complexity: "Muy alta",
    stats: [
      { label: "Sweep", value: "0.20 → 0.79" },
      { label: "Prod", value: "0.65" },
    ],
    sections: [
      {
        title: "Qué se hizo",
        items: [
          "Carga del modelo guardado y predicción de probabilidades sobre test.",
          "Clasificación baseline con threshold 0.50 y `classification_report`.",
          "Barrido de thresholds para maximizar F1 y graficar `F1-score vs threshold`.",
          "Generación de matriz de confusión, curva ROC, curva Precision-Recall e histograma de probabilidades.",
        ],
      },
      {
        title: "Observaciones clave",
        items: [
          "El notebook reporta un threshold óptimo de F1 distinto al valor productivo configurado hoy.",
          "La UI debe mostrar esa discrepancia en vez de ocultarla.",
        ],
      },
    ],
  },
  {
    id: "xai-impl",
    label: "Implementación de Saliency y Grad-CAM",
    shortLabel: "XAI",
    summary: "Se define la última capa convolucional y luego se implementan funciones para Saliency, SmoothGrad, Grad-CAM y overlays.",
    detail:
      "Es otro bloque complejo porque incluye gradientes sobre píxeles y mapas de activación, además de composición visual final.",
    badgeCount: 6,
    tone: "active",
    icon: "xai",
    size: "xl",
    lane: "top",
    complexity: "Muy alta",
    stats: [
      { label: "Métodos", value: "Saliency + Grad-CAM" },
      { label: "Última conv", value: "auto-detectada" },
    ],
    sections: [
      {
        title: "Qué se implementó",
        items: [
          "Función `get_last_conv_layer` para detectar la última `Conv2D` del modelo.",
          "Saliency vanilla y SmoothGrad con `GradientTape` sobre la imagen de entrada.",
          "Grad-CAM clásico usando gradientes respecto a la última capa convolucional.",
          "Overlays con OpenCV para superponer heatmaps sobre la imagen original.",
        ],
      },
      {
        title: "Por qué importa",
        items: [
          "Conecta la predicción binaria con evidencia visual interpretable.",
          "Permite comparar granularidad fina de píxeles frente a regiones semánticas amplias.",
        ],
      },
    ],
  },
  {
    id: "xai-cases",
    label: "Casos ejemplo y comparación lado a lado",
    shortLabel: "Cases",
    summary: "Se seleccionan rostros male y female correctamente clasificados y se visualizan paneles completos con overlays.",
    detail:
      "El notebook no se queda en funciones abstractas: aterriza la interpretabilidad en ejemplos concretos del conjunto de test.",
    badgeCount: 2,
    tone: "default",
    icon: "image",
    size: "lg",
    lane: "bottom",
    complexity: "Alta",
    stats: [
      { label: "Casos", value: "2 correctos" },
      { label: "Vista", value: "1x4 y 2x3" },
    ],
    sections: [
      {
        title: "Qué se hizo",
        items: [
          "Selección de ejemplos male/female correctos ordenados por confianza.",
          "Paneles `xai_panel` con original, saliency, heatmap Grad-CAM y overlay final.",
          "Comparación lado a lado entre overlays de ambas clases.",
        ],
      },
      {
        title: "Lectura del resultado",
        items: [
          "Se busca coherencia entre ambos métodos como señal de atención facial legítima.",
          "El análisis reporta activaciones frecuentes en mandíbula, cabello y zona ocular.",
        ],
      },
    ],
  },
  {
    id: "reflection",
    label: "Resultados, límites y trabajo futuro",
    shortLabel: "Review",
    summary: "El notebook cierra con una reflexión sobre desempeño, interpretabilidad, sesgos del dataset y extensiones posibles.",
    detail:
      "Esta etapa baja el tono triunfalista y vuelve explícitos los límites éticos y técnicos del problema.",
    badgeCount: 3,
    tone: "muted",
    icon: "profile",
    size: "md",
    lane: "top",
    complexity: "Media",
    stats: [
      { label: "Accuracy", value: "> 90% reportado" },
      { label: "Future work", value: "Score-CAM / IG / cuantización" },
    ],
    sections: [
      {
        title: "Conclusiones del notebook",
        items: [
          "El modelo final se presenta como estable y con AUC alta sobre test.",
          "Los mapas XAI se interpretan como evidencia de atención facial y no de artefactos de fondo.",
          "La clasificación de género se reconoce como una tarea sensible y no como verdad absoluta.",
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
    ],
  },
];

export const pipelineStages: PipelineStage[] = [
  {
    id: "01",
    title: "Ingesta del dataset",
    summary: "Se descarga el dataset de Kaggle y se separan las clases Male / Female.",
    detail:
      "La base contiene 5,418 imágenes RGB: 2,720 male y 2,698 female.",
    badge: "Kaggle + inspección inicial",
  },
  {
    id: "02",
    title: "Preprocesamiento",
    summary: "Cada imagen se convierte a RGB, se redimensiona y se normaliza.",
    detail:
      "El backend replica exactamente este flujo: resize a 224 x 224, escala [0, 1] y batch dimension.",
    badge: "RGB -> 224 -> [0,1]",
  },
  {
    id: "03",
    title: "Split reproducible",
    summary: "Se construyen conjuntos de train, validation y test.",
    detail:
      "La división oficial es 70 / 15 / 15: 3,792 train, 813 val y 813 test.",
    badge: "70 / 15 / 15",
  },
  {
    id: "04",
    title: "Entrenamiento CNN",
    summary: "La red se entrena desde cero con bloques convolucionales y regularización.",
    detail:
      "La historia oficial del pipeline usa Adam lr=1e-3, EarlyStopping patience=8 y ReduceLROnPlateau factor=0.5 patience=4.",
    badge: "From scratch",
  },
  {
    id: "05",
    title: "Evaluación offline",
    summary: "Se miden accuracy, AUC, precision, recall y F1 en test.",
    detail:
      "El notebook reporta accuracy offline 83.9% con threshold 0.50 y un threshold óptimo 0.55 para F1.",
    badge: "Notebook metrics",
  },
  {
    id: "06",
    title: "Exportación y despliegue",
    summary: "El mejor snapshot se guarda como `model.keras` y se sirve vía FastAPI.",
    detail:
      "El runtime actual usa threshold 0.65 y devuelve probas, raw score y overlays XAI.",
    badge: "Backend productivo",
  },
];

export const deployedArchitecture = [
  "Input 224 x 224 x 3",
  "Conv2D(48) -> BatchNormalization -> MaxPool -> SpatialDropout2D(0.10)",
  "Conv2D(96) -> BatchNormalization -> MaxPool -> SpatialDropout2D(0.15)",
  "Conv2D(192) -> BatchNormalization -> MaxPool -> SpatialDropout2D(0.20)",
  "GlobalAveragePooling2D -> Dense(128) -> Dropout(0.50) -> Dense(1, sigmoid)",
];

export const trainingControls = [
  "Optimizador Adam con learning rate inicial 1e-3",
  "EarlyStopping monitor=val_loss, patience=8, restore_best_weights=True",
  "ReduceLROnPlateau factor=0.5, patience=4, min_lr=1e-6",
  "Entrada fija 224 x 224 y salida sigmoide binaria",
];

export const xaiNotes = [
  "Grad-CAM resalta regiones semánticas amplias de la cara sobre la última capa convolucional.",
  "Saliency Map enfatiza píxeles con mayor sensibilidad local frente a la salida sigmoide.",
  "Los overlays aumentan interpretabilidad, pero no sustituyen validación humana ni eliminan sesgos del dataset.",
];

export const modelHeroHighlights: HeroHighlight[] = [
  { label: "Entrada", value: "Upload o cámara" },
  { label: "Salida", value: "Clase + score + XAI" },
  { label: "Tipos", value: "JPG / PNG / WEBP" },
  { label: "Objetivo", value: "Inferencia clínica visual" },
];

export const architectureSnapshot = {
  modelName: "cnn_gender",
  input: "224 x 224 x 3",
  convolutionalBlocks: "48 / 96 / 192 filtros",
  denseHead: "Dense 128 + Dropout 0.50",
  totalParams: "704,165 parámetros totales",
  trainableParams: "234,497 trainables",
};
