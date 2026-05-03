"use client";

import type { ReactNode } from "react";
import Image from "next/image";

import type {
  TimelineNode,
  TimelineNodeSection,
  TimelineNodeStat,
} from "@/lib/types";
import { cn } from "@/lib/utils";

const notebookPalette = [
  { label: "bg", color: "#0b0f17" },
  { label: "panel", color: "#111827" },
  { label: "grid", color: "#1f2937" },
  { label: "text", color: "#e5e7eb" },
  { label: "muted", color: "#9ca3af" },
  { label: "male", color: "#60a5fa" },
  { label: "female", color: "#f472b6" },
  { label: "accent", color: "#34d399" },
  { label: "warn", color: "#fbbf24" },
  { label: "danger", color: "#f87171" },
];

const inspectionRanges = [
  {
    label: "Ancho",
    min: 199,
    mean: 941,
    max: 8675,
    unit: "px",
  },
  {
    label: "Alto",
    min: 308,
    mean: 1168,
    max: 7360,
    unit: "px",
  },
];

const splitBreakdown = [
  { label: "Train", total: 3792, male: 1904, female: 1888, ratio: 70 },
  { label: "Validation", total: 813, male: 408, female: 405, ratio: 15 },
  { label: "Test", total: 813, male: 408, female: 405, ratio: 15 },
];

const architectureBlocks = [
  { label: "Input", detail: "224 x 224 x 3", meta: "Sin batch" },
  { label: "Conv 1", detail: "48 filtros · k=3", meta: "1,344 params" },
  { label: "BN + Pool", detail: "MaxPool 2x2", meta: "SpatialDropout 0.10" },
  { label: "Conv 2", detail: "96 filtros · k=3", meta: "41,568 params" },
  { label: "BN + Pool", detail: "MaxPool 2x2", meta: "SpatialDropout 0.15" },
  { label: "Conv 3", detail: "192 filtros · k=3", meta: "166,080 params" },
  { label: "Head", detail: "GAP -> Dense 128", meta: "Dropout 0.50" },
  { label: "Output", detail: "Sigmoid binaria", meta: "129 params" },
];

const experimentCards = [
  {
    name: "Exp-A | base",
    filters: "(32, 64, 128)",
    kernel: "3",
    dense: "128",
    dropout: "0.50",
    lr: "0.0010",
    valAcc: 0.7774,
    testAcc: 0.7934,
    auc: 0.8719,
    loss: 0.4655,
    params: 110785,
    tone: "muted",
  },
  {
    name: "Exp-B | wider",
    filters: "(48, 96, 192)",
    kernel: "3",
    dense: "192",
    dropout: "0.40",
    lr: "0.0010",
    valAcc: 0.7847,
    testAcc: 0.7872,
    auc: 0.862,
    loss: 0.4753,
    params: 247585,
    tone: "default",
  },
  {
    name: "Exp-C | k5+lr↓",
    filters: "(32, 64, 128)",
    kernel: "5",
    dense: "128",
    dropout: "0.50",
    lr: "0.0005",
    valAcc: 0.8278,
    testAcc: 0.829,
    auc: 0.8904,
    loss: 0.435,
    params: 276161,
    tone: "accent",
  },
];

const thresholdMarkers = [
  { label: "Baseline", value: 0.5, note: "F1 0.8543", tone: "muted" },
  { label: "Óptimo F1", value: 0.55, note: "F1 0.8581", tone: "accent" },
  { label: "Runtime", value: 0.65, note: "Acc 0.8352", tone: "dark" },
];

const confusionMatrices = [
  {
    label: "Threshold 0.50",
    cells: [
      [298, 107],
      [24, 384],
    ],
    footer: "Más recall para Male, menos equilibrio entre clases.",
  },
  {
    label: "Threshold 0.65",
    cells: [
      [339, 66],
      [68, 340],
    ],
    footer: "Más balance entre clases y coherencia con el runtime actual.",
  },
];

const xaiMethodCards = [
  {
    title: "Saliency / SmoothGrad",
    items: [
      "GradientTape sobre la entrada.",
      "15 muestras con ruido gaussiano.",
      "sigma = 0.10 del rango dinámico.",
      "Overlay final con INFERNO y alpha 0.55.",
    ],
  },
  {
    title: "Grad-CAM",
    items: [
      "Última capa convolucional: conv3.",
      "Pesos por media global de gradientes.",
      "Resize al tamaño de la imagen original.",
      "Overlay final con JET y alpha 0.50.",
    ],
  },
];

const xaiCases = [
  {
    label: "Male correcto",
    idx: 627,
    pMale: 0.9984,
    pFemale: 0.0016,
    notes: ["Se elige el 3er caso correcto más confiable.", "Panel 1x4 con original, saliency, heatmap y overlay."],
  },
  {
    label: "Female correcto",
    idx: 448,
    pMale: 0,
    pFemale: 1,
    notes: ["También se toma el 3er caso correcto más confiable.", "Luego se contrasta en una figura 2x3 lado a lado."],
  },
];

export function TimelineModalContent({ node }: { node: TimelineNode }) {
  switch (node.id) {
    case "environment":
      return <EnvironmentBody node={node} />;
    case "theme":
      return <ThemeBody node={node} />;
    case "dataset":
      return <DatasetBody node={node} />;
    case "inspection":
      return <InspectionBody node={node} />;
    case "visual-audit":
      return <VisualAuditBody node={node} />;
    case "tensor-build":
      return <TensorBuildBody node={node} />;
    case "split":
      return <SplitBody node={node} />;
    case "normalization":
      return <NormalizationBody node={node} />;
    case "architecture":
      return <ArchitectureBody node={node} />;
    case "compile-callbacks":
      return <CompileBody node={node} />;
    case "training-fit":
      return <TrainingBody node={node} />;
    case "test-save":
      return <TestSaveBody node={node} />;
    case "hp-sweep":
      return <SweepBody node={node} />;
    case "threshold-eval":
      return <ThresholdBody node={node} />;
    case "xai-impl":
      return <XaiImplBody node={node} />;
    case "xai-cases":
      return <XaiCasesBody node={node} />;
    case "reflection":
      return <ReflectionBody node={node} />;
    default:
      return <DefaultBody node={node} />;
  }
}

function EnvironmentBody({ node }: { node: TimelineNode }) {
  return (
    <div className="mt-6 grid gap-4 xl:grid-cols-[minmax(0,1.1fr)_minmax(18rem,0.9fr)]">
      <div className="grid gap-4">
        <SectionSteps section={node.sections[0]} numbered mono />
        <SectionSteps section={node.sections[1]} />
      </div>
      <div className="grid gap-3">
        <StatsGrid stats={node.stats} columns={1} big />
        <SurfaceCard className="bg-[rgba(44,51,49,0.92)] text-[var(--color-white-warm)]">
          <p className="text-[0.68rem] uppercase tracking-[0.24em] text-[rgba(247,247,240,0.64)]">
            Boot chain
          </p>
          <div className="mt-4 flex flex-wrap gap-2 text-sm">
            {["random", "numpy", "tf.random", "warnings", "paths"].map((item) => (
              <span
                key={item}
                className="rounded-full border border-[rgba(247,247,240,0.16)] px-3 py-2"
              >
                {item}
              </span>
            ))}
          </div>
        </SurfaceCard>
      </div>
    </div>
  );
}

function ThemeBody({ node }: { node: TimelineNode }) {
  return (
    <div className="mt-6 grid gap-4 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
      <SurfaceCard>
        <p className="text-[0.68rem] uppercase tracking-[0.24em] text-secondary">
          Paleta del notebook
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {notebookPalette.map((swatch) => (
            <article
              key={swatch.label}
              className="rounded-[22px] border p-3"
              style={{
                backgroundColor: "var(--color-surface-light)",
                borderColor: "rgba(143, 145, 142, 0.24)",
              }}
            >
              <div
                className="h-16 rounded-[18px]"
                style={{ backgroundColor: swatch.color }}
              />
              <div className="mt-3 flex items-center justify-between gap-3">
                <span className="text-sm font-medium text-primary">
                  {swatch.label}
                </span>
                <span className="text-xs uppercase tracking-[0.2em] text-secondary">
                  {swatch.color}
                </span>
              </div>
            </article>
          ))}
        </div>
      </SurfaceCard>

      <div className="grid gap-4">
        <StatsGrid stats={node.stats} columns={1} />
        <SectionSteps section={node.sections[0]} />
        <SurfaceCard className="bg-[var(--color-accent)] text-primary">
          <p className="text-[0.68rem] uppercase tracking-[0.24em] opacity-70">
            Uso real
          </p>
          <p className="mt-3 text-lg font-semibold tracking-[-0.04em]">
            ROC, PR, histogramas y tablas heredan exactamente esta plantilla.
          </p>
          <p className="mt-2 text-sm leading-6 opacity-80">
            El notebook usa `colorway` con male, female, accent, warn y danger.
          </p>
        </SurfaceCard>
      </div>
    </div>
  );
}

function DatasetBody({ node }: { node: TimelineNode }) {
  return (
    <div className="mt-6 grid gap-4 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
      <SurfaceCard>
        <p className="text-[0.68rem] uppercase tracking-[0.24em] text-secondary">
          Balance de clases
        </p>
        <div className="mt-4 grid gap-4">
          <HeroValue value="5,418" label="imágenes totales" accent />
          <BalanceRow label="Male" value={2720} total={5418} color="var(--color-accent)" />
          <BalanceRow label="Female" value={2698} total={5418} color="var(--color-clinical-pink)" />
          <div className="grid gap-3 md:grid-cols-2">
            <TinyInfo label="Repositorio" value="KaggleHub" />
            <TinyInfo label="Gap de clases" value="22 imgs" />
          </div>
        </div>
      </SurfaceCard>

      <div className="grid gap-4">
        <SectionSteps section={node.sections[0]} />
        <SectionSteps section={node.sections[1]} />
        <SurfaceCard>
          <p className="text-[0.68rem] uppercase tracking-[0.24em] text-secondary">
            Directorios
          </p>
          <div className="mt-4 grid gap-3 text-sm text-primary">
            <CodeLine>DATA_ROOT/</CodeLine>
            <CodeLine className="ml-4">Male Faces/</CodeLine>
            <CodeLine className="ml-4">Female Faces/</CodeLine>
          </div>
        </SurfaceCard>
      </div>
    </div>
  );
}

function InspectionBody({ node }: { node: TimelineNode }) {
  return (
    <div className="mt-6 grid gap-4">
      <div className="grid gap-4 xl:grid-cols-2">
        {inspectionRanges.map((range) => (
          <SurfaceCard key={range.label}>
            <p className="text-[0.68rem] uppercase tracking-[0.24em] text-secondary">
              {range.label}
            </p>
            <div className="mt-4 space-y-4">
              <RangeRail {...range} />
              <div className="grid gap-3 sm:grid-cols-3">
                <TinyInfo label="Min" value={`${range.min} ${range.unit}`} />
                <TinyInfo label="Media" value={`${range.mean} ${range.unit}`} />
                <TinyInfo label="Max" value={`${range.max} ${range.unit}`} />
              </div>
            </div>
          </SurfaceCard>
        ))}
      </div>
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(18rem,0.8fr)]">
        <SectionSteps section={node.sections[0]} />
        <SectionSteps section={node.sections[1]} />
        <StatsGrid stats={node.stats} columns={1} />
      </div>
    </div>
  );
}

function VisualAuditBody({ node }: { node: TimelineNode }) {
  return (
    <div className="mt-6 grid gap-4 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
      <SurfaceCard className="overflow-hidden p-0">
        <div className="border-b border-[rgba(143,145,142,0.2)] px-5 py-4">
          <p className="text-[0.68rem] uppercase tracking-[0.24em] text-secondary">
            Dataset mosaic
          </p>
          <p className="mt-2 text-sm leading-6 text-secondary">
            El propio reporte ya exportó una vista de ejemplos representativos.
          </p>
        </div>
        <Image
          src="/model-assets/dataset-examples.png"
          alt="Muestras del dataset usadas en el notebook"
          width={1400}
          height={900}
          className="h-auto w-full object-cover"
        />
      </SurfaceCard>
      <div className="grid gap-4">
        <StatsGrid stats={node.stats} columns={1} />
        <SectionSteps section={node.sections[0]} />
        <SectionSteps section={node.sections[1]} />
      </div>
    </div>
  );
}

function TensorBuildBody({ node }: { node: TimelineNode }) {
  const steps = ["Open", "RGB", "Resize 224", "Stack X", "Label y"];
  return (
    <div className="mt-6 grid gap-4">
      <SurfaceCard>
        <p className="text-[0.68rem] uppercase tracking-[0.24em] text-secondary">
          Flujo de ingestión
        </p>
        <div className="mt-4 grid gap-3 md:grid-cols-5">
          {steps.map((step, index) => (
            <div key={step} className="grid gap-3">
              <div className="rounded-[24px] border border-[rgba(143,145,142,0.24)] bg-surface-light px-4 py-4 text-center">
                <p className="text-[0.66rem] uppercase tracking-[0.22em] text-secondary">
                  Paso {index + 1}
                </p>
                <p className="mt-2 text-lg font-semibold tracking-[-0.04em] text-primary">
                  {step}
                </p>
              </div>
            </div>
          ))}
        </div>
      </SurfaceCard>
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(18rem,0.9fr)]">
        <SectionSteps section={node.sections[0]} />
        <SectionSteps section={node.sections[1]} />
        <StatsGrid stats={node.stats} columns={1} />
      </div>
    </div>
  );
}

function SplitBody({ node }: { node: TimelineNode }) {
  return (
    <div className="mt-6 grid gap-4">
      <SurfaceCard>
        <p className="text-[0.68rem] uppercase tracking-[0.24em] text-secondary">
          Partición oficial
        </p>
        <SegmentedSplitBar />
      </SurfaceCard>
      <div className="grid gap-4 xl:grid-cols-3">
        {splitBreakdown.map((split) => (
          <SurfaceCard key={split.label}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[0.66rem] uppercase tracking-[0.22em] text-secondary">
                  {split.label}
                </p>
                <p className="mt-2 text-3xl font-semibold tracking-[-0.06em] text-primary">
                  {split.total.toLocaleString("es-CO")}
                </p>
              </div>
              <span className="rounded-full border border-[rgba(143,145,142,0.24)] bg-surface-light px-3 py-2 text-xs uppercase tracking-[0.22em] text-secondary">
                {split.ratio}%
              </span>
            </div>
            <div className="mt-4 space-y-3">
              <BalanceRow label="Male" value={split.male} total={split.total} color="var(--color-accent)" />
              <BalanceRow label="Female" value={split.female} total={split.total} color="var(--color-clinical-pink)" />
            </div>
          </SurfaceCard>
        ))}
      </div>
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(18rem,0.7fr)]">
        <SectionSteps section={node.sections[0]} />
        <SectionSteps section={node.sections[1]} />
      </div>
    </div>
  );
}

function NormalizationBody({ node }: { node: TimelineNode }) {
  return (
    <div className="mt-6 grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <SurfaceCard>
        <p className="text-[0.68rem] uppercase tracking-[0.24em] text-secondary">
          Antes y después
        </p>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <HeroValue value="uint8" label="entrada cruda" />
          <HeroValue value="[0,1]" label="tensor normalizado" accent />
        </div>
        <div className="mt-5 space-y-3">
          <RangeLegend left="0" right="255" label="Escala original" />
          <RangeLegend left="0.000" right="1.000" label="Escala después de dividir por 255" accent />
          <RangeLegend left="815.6 MB" right="2283.2 MB" label="Costo de memoria reportado" pink />
        </div>
      </SurfaceCard>

      <div className="grid gap-4">
        <StatsGrid stats={node.stats} columns={2} />
        <SectionSteps section={node.sections[0]} />
        <SectionSteps section={node.sections[1]} />
      </div>
    </div>
  );
}

function ArchitectureBody({ node }: { node: TimelineNode }) {
  return (
    <div className="mt-6 grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(20rem,0.9fr)]">
      <SurfaceCard>
        <p className="text-[0.68rem] uppercase tracking-[0.24em] text-secondary">
          Stack de capas
        </p>
        <div className="mt-4 grid gap-3">
          {architectureBlocks.map((block, index) => (
            <div
              key={`${block.label}-${index}`}
              className={cn(
                "rounded-[24px] border px-4 py-4",
                index % 2 === 0 ? "bg-surface-light" : "bg-[rgba(247,247,240,0.64)]",
              )}
              style={{ borderColor: "rgba(143, 145, 142, 0.24)" }}
            >
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-primary">{block.label}</p>
                <span className="text-xs uppercase tracking-[0.22em] text-secondary">
                  {block.meta}
                </span>
              </div>
              <p className="mt-2 text-sm leading-6 text-secondary">{block.detail}</p>
            </div>
          ))}
        </div>
      </SurfaceCard>
      <div className="grid gap-4">
        <StatsGrid stats={node.stats} columns={1} />
        <SectionSteps section={node.sections[0]} />
        <SectionSteps section={node.sections[1]} />
        <SectionSteps section={node.sections[2]} />
      </div>
    </div>
  );
}

function CompileBody({ node }: { node: TimelineNode }) {
  const compileChips = ["Adam", "1e-3", "binary_crossentropy", "accuracy", "AUC", "precision", "recall"];
  return (
    <div className="mt-6 grid gap-4 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
      <SurfaceCard>
        <p className="text-[0.68rem] uppercase tracking-[0.24em] text-secondary">
          Recipe de compilación
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {compileChips.map((chip) => (
            <span
              key={chip}
              className="rounded-full border border-[rgba(143,145,142,0.24)] bg-surface-light px-3 py-2 text-sm text-primary"
            >
              {chip}
            </span>
          ))}
        </div>
        <div className="mt-5">
          <SectionSteps section={node.sections[0]} />
        </div>
      </SurfaceCard>
      <div className="grid gap-4">
        <div className="grid gap-4 md:grid-cols-3">
          <CallbackCard title="EarlyStopping" lines={["monitor=val_loss", "patience=8", "restore_best_weights=True"]} />
          <CallbackCard title="ReduceLROnPlateau" lines={["monitor=val_loss", "factor=0.5", "patience=4 · min_lr=1e-6"]} />
          <CallbackCard title="ModelCheckpoint" lines={["models/model.keras", "monitor=val_accuracy", "save_best_only=True"]} accent />
        </div>
        <StatsGrid stats={node.stats} columns={2} />
        <SectionSteps section={node.sections[1]} />
        <SectionSteps section={node.sections[2]} />
      </div>
    </div>
  );
}

function TrainingBody({ node }: { node: TimelineNode }) {
  const charts = [
    { title: "Accuracy", src: "/model-assets/accuracy-curve.png" },
    { title: "Loss", src: "/model-assets/loss-curve.png" },
    { title: "AUC", src: "/model-assets/auc-curve.png" },
  ];

  return (
    <div className="mt-6 grid gap-4">
      <div className="grid gap-4 xl:grid-cols-3">
        {charts.map((chart) => (
          <SurfaceCard key={chart.title} className="overflow-hidden p-0">
            <div className="border-b border-[rgba(143,145,142,0.2)] px-4 py-3">
              <p className="text-[0.68rem] uppercase tracking-[0.24em] text-secondary">
                {chart.title}
              </p>
            </div>
            <Image
              src={chart.src}
              alt={`Curva ${chart.title} del notebook`}
              width={1200}
              height={800}
              className="h-auto w-full"
            />
          </SurfaceCard>
        ))}
      </div>
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(18rem,0.75fr)]">
        <div className="grid gap-4 md:grid-cols-2">
          <SectionSteps section={node.sections[0]} />
          <SectionSteps section={node.sections[1]} />
          <SectionSteps section={node.sections[2]} />
        </div>
        <StatsGrid stats={node.stats} columns={1} big />
      </div>
    </div>
  );
}

function TestSaveBody({ node }: { node: TimelineNode }) {
  return (
    <div className="mt-6 grid gap-4">
      <StatsGrid stats={node.stats} columns={4} big />
      <div className="grid gap-4 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <SectionSteps section={node.sections[0]} />
        <div className="grid gap-4">
          <SurfaceCard className="bg-[var(--color-accent)] text-primary">
            <p className="text-[0.68rem] uppercase tracking-[0.24em] opacity-70">
              Artefacto persistido
            </p>
            <p className="mt-3 text-3xl font-semibold tracking-[-0.06em]">
              models/model.keras
            </p>
            <p className="mt-3 text-sm leading-6 opacity-80">
              Este es el snapshot que conecta evaluación offline con inferencia y XAI.
            </p>
          </SurfaceCard>
          <SectionSteps section={node.sections[1]} />
        </div>
      </div>
    </div>
  );
}

function SweepBody({ node }: { node: TimelineNode }) {
  return (
    <div className="mt-6 grid gap-4">
      <div className="grid gap-4 xl:grid-cols-3">
        {experimentCards.map((experiment) => (
          <ExperimentCard key={experiment.name} experiment={experiment} />
        ))}
      </div>
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <SectionSteps section={node.sections[0]} />
        <SectionSteps section={node.sections[1]} />
        <SectionSteps section={node.sections[2]} />
        <SectionSteps section={node.sections[3]} />
      </div>
    </div>
  );
}

function ThresholdBody({ node }: { node: TimelineNode }) {
  return (
    <div className="mt-6 grid gap-4">
      <SurfaceCard>
        <p className="text-[0.68rem] uppercase tracking-[0.24em] text-secondary">
          Threshold rail
        </p>
        <div className="relative mt-8 h-16">
          <div className="absolute left-0 right-0 top-6 h-[2px] rounded-full bg-[rgba(143,145,142,0.32)]" />
          {thresholdMarkers.map((marker) => (
            <div
              key={marker.label}
              className="absolute top-0 -translate-x-1/2"
              style={{ left: `${marker.value * 100}%` }}
            >
              <div
                className={cn(
                  "mx-auto h-5 w-5 rounded-full border",
                  marker.tone === "accent"
                    ? "border-[rgba(17,17,17,0.08)] bg-accent"
                    : marker.tone === "dark"
                      ? "border-[rgba(44,51,49,0.6)] bg-[var(--color-card-dark)]"
                      : "border-[rgba(143,145,142,0.32)] bg-surface-light",
                )}
              />
              <div className="mt-3 min-w-[8rem] -translate-x-[3.5rem] rounded-[18px] border border-[rgba(143,145,142,0.2)] bg-surface-light px-3 py-2 text-center">
                <p className="text-[0.64rem] uppercase tracking-[0.2em] text-secondary">
                  {marker.label}
                </p>
                <p className="mt-1 text-sm font-semibold text-primary">
                  {marker.value.toFixed(2)}
                </p>
                <p className="mt-1 text-xs text-secondary">{marker.note}</p>
              </div>
            </div>
          ))}
        </div>
      </SurfaceCard>
      <div className="grid gap-4 xl:grid-cols-2">
        {confusionMatrices.map((matrix) => (
          <SurfaceCard key={matrix.label}>
            <p className="text-[0.68rem] uppercase tracking-[0.24em] text-secondary">
              {matrix.label}
            </p>
            <ConfusionMatrixCard cells={matrix.cells} />
            <p className="mt-4 text-sm leading-6 text-secondary">{matrix.footer}</p>
          </SurfaceCard>
        ))}
      </div>
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(18rem,0.8fr)]">
        <SectionSteps section={node.sections[0]} />
        <SectionSteps section={node.sections[1]} />
        <SectionSteps section={node.sections[2]} />
        <SectionSteps section={node.sections[3]} />
      </div>
    </div>
  );
}

function XaiImplBody({ node }: { node: TimelineNode }) {
  return (
    <div className="mt-6 grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(18rem,0.8fr)]">
      {xaiMethodCards.map((method) => (
        <SurfaceCard key={method.title}>
          <p className="text-[0.68rem] uppercase tracking-[0.24em] text-secondary">
            {method.title}
          </p>
          <div className="mt-4 space-y-3">
            {method.items.map((item) => (
              <div
                key={item}
                className="rounded-[20px] border border-[rgba(143,145,142,0.24)] bg-surface-light px-3 py-3 text-sm leading-6 text-primary"
              >
                {item}
              </div>
            ))}
          </div>
        </SurfaceCard>
      ))}
      <div className="grid gap-4">
        <StatsGrid stats={node.stats} columns={1} />
        <SectionSteps section={node.sections[0]} />
        <SectionSteps section={node.sections[1]} />
      </div>
    </div>
  );
}

function XaiCasesBody({ node }: { node: TimelineNode }) {
  return (
    <div className="mt-6 grid gap-4">
      <div className="grid gap-4 xl:grid-cols-2">
        {xaiCases.map((item) => (
          <SurfaceCard key={item.label}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[0.66rem] uppercase tracking-[0.22em] text-secondary">
                  {item.label}
                </p>
                <p className="mt-2 text-2xl font-semibold tracking-[-0.06em] text-primary">
                  idx {item.idx}
                </p>
              </div>
              <span className="rounded-full border border-[rgba(143,145,142,0.24)] bg-surface-light px-3 py-2 text-xs uppercase tracking-[0.22em] text-secondary">
                Correcto
              </span>
            </div>
            <div className="mt-4 space-y-3">
              <BalanceRow label="P(Male)" value={item.pMale * 10000} total={10000} color="var(--color-accent)" displayValue={item.pMale.toFixed(4)} />
              <BalanceRow label="P(Female)" value={item.pFemale * 10000} total={10000} color="var(--color-clinical-pink)" displayValue={item.pFemale.toFixed(4)} />
            </div>
            <div className="mt-5 grid gap-3 md:grid-cols-3">
              {["Original", "Saliency", "Grad-CAM"].map((panel) => (
                <div
                  key={panel}
                  className="rounded-[22px] border border-[rgba(143,145,142,0.24)] bg-surface-light px-3 py-6 text-center"
                >
                  <p className="text-[0.66rem] uppercase tracking-[0.22em] text-secondary">
                    {panel}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-4 space-y-2">
              {item.notes.map((note) => (
                <p key={note} className="text-sm leading-6 text-secondary">
                  {note}
                </p>
              ))}
            </div>
          </SurfaceCard>
        ))}
      </div>
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(18rem,0.8fr)]">
        <SectionSteps section={node.sections[0]} />
        <SectionSteps section={node.sections[1]} />
        <SectionSteps section={node.sections[2]} />
        <StatsGrid stats={node.stats} columns={1} />
      </div>
    </div>
  );
}

function ReflectionBody({ node }: { node: TimelineNode }) {
  return (
    <div className="mt-6 grid gap-4">
      <div className="grid gap-4 xl:grid-cols-2">
        <SurfaceCard>
          <p className="text-[0.68rem] uppercase tracking-[0.24em] text-secondary">
            Notebook
          </p>
          <div className="mt-4 space-y-3">
            <HeroValue value="89.91%" label="accuracy offline" accent />
            <HeroValue value="96.75%" label="AUC en test" />
            <SectionPreview section={node.sections[0]} />
          </div>
        </SurfaceCard>
        <SurfaceCard>
          <p className="text-[0.68rem] uppercase tracking-[0.24em] text-secondary">
            Runtime y límites
          </p>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <TinyInfo label="Threshold runtime" value="0.65" />
            <TinyInfo label="Óptimo F1 notebook" value="0.55" />
            <TinyInfo label="Snapshot visible en app" value="48 / 96 / 192" />
            <TinyInfo label="Tema sensible" value="género ≠ verdad absoluta" />
          </div>
          <div className="mt-4">
            <SectionPreview section={node.sections[2]} />
          </div>
        </SurfaceCard>
      </div>
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <SectionSteps section={node.sections[1]} />
        <StatsGrid stats={node.stats} columns={2} />
      </div>
    </div>
  );
}

function DefaultBody({ node }: { node: TimelineNode }) {
  return (
    <div
      className={cn(
        "mt-6 grid gap-4",
        node.stats?.length
          ? "xl:grid-cols-[minmax(0,1.15fr)_minmax(16rem,0.85fr)]"
          : "xl:grid-cols-1",
      )}
    >
      <div
        className={cn(
          "grid gap-4",
          node.sections.length <= 1
            ? "md:grid-cols-1"
            : node.sections.length === 2
              ? "md:grid-cols-2"
              : "md:grid-cols-2 2xl:grid-cols-3",
        )}
      >
        {node.sections.map((section) => (
          <SectionSteps key={section.title} section={section} />
        ))}
      </div>
      {node.stats?.length ? <StatsGrid stats={node.stats} columns={1} /> : null}
    </div>
  );
}

function SectionSteps({
  section,
  numbered = false,
  mono = false,
}: {
  section: TimelineNodeSection | undefined;
  numbered?: boolean;
  mono?: boolean;
}) {
  if (!section) return null;

  return (
    <SurfaceCard>
      <p className="text-[0.68rem] uppercase tracking-[0.24em] text-secondary">
        {section.title}
      </p>
      <ul className="mt-4 space-y-3">
        {section.items.map((item, index) => (
          <li
            key={item}
            className={cn(
              "rounded-[20px] border border-[rgba(143,145,142,0.24)] bg-surface-light px-3 py-3 text-sm leading-6 text-primary",
              mono && "font-mono text-[0.92rem]",
            )}
          >
            {numbered ? (
              <div className="flex gap-3">
                <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-[rgba(143,145,142,0.24)] text-[0.72rem] text-secondary">
                  {index + 1}
                </span>
                <span>{item}</span>
              </div>
            ) : (
              item
            )}
          </li>
        ))}
      </ul>
    </SurfaceCard>
  );
}

function StatsGrid({
  stats,
  columns,
  big = false,
}: {
  stats: TimelineNodeStat[] | undefined;
  columns: 1 | 2 | 3 | 4;
  big?: boolean;
}) {
  if (!stats?.length) return null;

  const gridClass =
    columns === 4
      ? "md:grid-cols-2 xl:grid-cols-4"
      : columns === 3
        ? "md:grid-cols-2 xl:grid-cols-3"
        : columns === 2
          ? "md:grid-cols-2"
          : "grid-cols-1";

  return (
    <div className={cn("grid gap-3", gridClass)}>
      {stats.map((stat, index) => (
        <article
          key={stat.label}
          className={cn(
            "rounded-[24px] border p-4",
            big && "min-h-[8.5rem] flex flex-col justify-end",
          )}
          style={{
            backgroundColor:
              big && index === 0 ? "var(--color-accent)" : "var(--color-surface)",
            borderColor: "rgba(143, 145, 142, 0.3)",
          }}
        >
          <p className="text-[0.66rem] uppercase tracking-[0.22em] text-secondary">
            {stat.label}
          </p>
          <p
            className={cn(
              "mt-2 font-semibold tracking-[-0.06em] text-primary",
              big ? "text-4xl" : "text-2xl",
            )}
          >
            {stat.value}
          </p>
        </article>
      ))}
    </div>
  );
}

function SurfaceCard({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn("rounded-[28px] border p-4", className)}
      style={{
        backgroundColor:
          className?.includes("bg-") ? undefined : "var(--color-surface)",
        borderColor: "rgba(143, 145, 142, 0.3)",
      }}
    >
      {children}
    </section>
  );
}

function HeroValue({
  value,
  label,
  accent = false,
}: {
  value: string;
  label: string;
  accent?: boolean;
}) {
  return (
    <div
      className="rounded-[24px] border px-4 py-4"
      style={{
        backgroundColor: accent ? "var(--color-accent)" : "var(--color-surface-light)",
        borderColor: "rgba(143, 145, 142, 0.24)",
      }}
    >
      <p className="text-[0.66rem] uppercase tracking-[0.22em] text-secondary">
        {label}
      </p>
      <p className="mt-3 text-4xl font-semibold tracking-[-0.08em] text-primary">
        {value}
      </p>
    </div>
  );
}

function BalanceRow({
  label,
  value,
  total,
  color,
  displayValue,
}: {
  label: string;
  value: number;
  total: number;
  color: string;
  displayValue?: string;
}) {
  const ratio = total === 0 ? 0 : Math.max(0, Math.min(100, (value / total) * 100));
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3 text-sm">
        <span className="font-medium text-primary">{label}</span>
        <span className="text-secondary">
          {displayValue ?? value.toLocaleString("es-CO")}
        </span>
      </div>
      <div className="h-3 rounded-full bg-[rgba(143,145,142,0.16)]">
        <div
          className="h-full rounded-full"
          style={{ width: `${ratio}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}

function TinyInfo({ label, value }: { label: string; value: string }) {
  return (
    <article className="rounded-[20px] border border-[rgba(143,145,142,0.24)] bg-surface-light px-3 py-3">
      <p className="text-[0.64rem] uppercase tracking-[0.2em] text-secondary">
        {label}
      </p>
      <p className="mt-2 text-lg font-semibold tracking-[-0.05em] text-primary">
        {value}
      </p>
    </article>
  );
}

function CodeLine({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-[18px] border border-[rgba(143,145,142,0.2)] bg-surface-light px-3 py-3 font-mono text-sm text-primary",
        className,
      )}
    >
      {children}
    </div>
  );
}

function RangeRail({
  label,
  min,
  mean,
  max,
  unit,
}: {
  label: string;
  min: number;
  mean: number;
  max: number;
  unit: string;
}) {
  const meanOffset = ((mean - min) / (max - min)) * 100;

  return (
    <div>
      <div className="flex items-center justify-between gap-3 text-sm">
        <span className="font-medium text-primary">{label}</span>
        <span className="text-secondary">
          {min} - {max} {unit}
        </span>
      </div>
      <div className="relative mt-3 h-3 rounded-full bg-[rgba(143,145,142,0.16)]">
        <div
          className="absolute top-1/2 h-5 w-5 -translate-y-1/2 rounded-full border border-[rgba(17,17,17,0.08)] bg-accent"
          style={{ left: `calc(${meanOffset}% - 0.625rem)` }}
        />
      </div>
      <p className="mt-2 text-xs uppercase tracking-[0.2em] text-secondary">
        Media: {mean} {unit}
      </p>
    </div>
  );
}

function SegmentedSplitBar() {
  return (
    <div className="mt-4">
      <div className="grid h-16 grid-cols-[70fr_15fr_15fr] overflow-hidden rounded-[24px] border border-[rgba(143,145,142,0.24)] bg-surface-light">
        <div className="flex items-center justify-center bg-[rgba(238,255,31,0.55)] text-sm font-semibold text-primary">
          Train 70%
        </div>
        <div className="flex items-center justify-center border-l border-[rgba(143,145,142,0.2)] text-sm font-semibold text-primary">
          Val 15%
        </div>
        <div className="flex items-center justify-center border-l border-[rgba(143,145,142,0.2)] bg-[rgba(233,165,162,0.24)] text-sm font-semibold text-primary">
          Test 15%
        </div>
      </div>
    </div>
  );
}

function RangeLegend({
  left,
  right,
  label,
  accent = false,
  pink = false,
}: {
  left: string;
  right: string;
  label: string;
  accent?: boolean;
  pink?: boolean;
}) {
  const bg = pink
    ? "linear-gradient(90deg, rgba(233,165,162,0.32), rgba(242,223,220,0.92))"
    : accent
      ? "linear-gradient(90deg, rgba(238,255,31,0.35), rgba(238,255,31,0.95))"
      : "linear-gradient(90deg, rgba(143,145,142,0.18), rgba(247,247,240,0.95))";

  return (
    <div>
      <div className="flex items-center justify-between gap-3 text-xs uppercase tracking-[0.2em] text-secondary">
        <span>{left}</span>
        <span>{label}</span>
        <span>{right}</span>
      </div>
      <div className="mt-2 h-4 rounded-full" style={{ background: bg }} />
    </div>
  );
}

function CallbackCard({
  title,
  lines,
  accent = false,
}: {
  title: string;
  lines: string[];
  accent?: boolean;
}) {
  return (
    <article
      className="rounded-[24px] border p-4"
      style={{
        backgroundColor: accent ? "var(--color-accent)" : "var(--color-surface)",
        borderColor: "rgba(143, 145, 142, 0.24)",
      }}
    >
      <p className="text-[0.66rem] uppercase tracking-[0.22em] text-secondary">
        {title}
      </p>
      <div className="mt-4 space-y-2">
        {lines.map((line) => (
          <div
            key={line}
            className="rounded-[18px] border border-[rgba(143,145,142,0.18)] bg-surface-light px-3 py-2 text-sm text-primary"
          >
            {line}
          </div>
        ))}
      </div>
    </article>
  );
}

function ExperimentCard({
  experiment,
}: {
  experiment: (typeof experimentCards)[number];
}) {
  return (
    <article
      className="rounded-[28px] border p-4"
      style={{
        backgroundColor:
          experiment.tone === "accent" ? "rgba(238,255,31,0.92)" : "var(--color-surface)",
        borderColor: "rgba(143, 145, 142, 0.28)",
      }}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[0.66rem] uppercase tracking-[0.22em] text-secondary">
            {experiment.name}
          </p>
          <p className="mt-2 text-2xl font-semibold tracking-[-0.06em] text-primary">
            {Math.round(experiment.testAcc * 1000) / 10}%
          </p>
        </div>
        <span className="rounded-full border border-[rgba(143,145,142,0.24)] bg-surface-light px-3 py-2 text-xs uppercase tracking-[0.22em] text-secondary">
          AUC {experiment.auc.toFixed(4)}
        </span>
      </div>
      <div className="mt-4 space-y-3">
        <BalanceRow label="Val acc" value={experiment.valAcc * 10000} total={10000} color="var(--color-card-dark)" displayValue={experiment.valAcc.toFixed(4)} />
        <BalanceRow label="Test acc" value={experiment.testAcc * 10000} total={10000} color="var(--color-accent)" displayValue={experiment.testAcc.toFixed(4)} />
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <TinyInfo label="Filtros" value={experiment.filters} />
        <TinyInfo label="Kernel" value={experiment.kernel} />
        <TinyInfo label="Dense" value={experiment.dense} />
        <TinyInfo label="Dropout" value={experiment.dropout} />
        <TinyInfo label="LR" value={experiment.lr} />
        <TinyInfo label="Params" value={experiment.params.toLocaleString("es-CO")} />
      </div>
      <p className="mt-4 text-sm leading-6 text-secondary">
        Test loss {experiment.loss.toFixed(4)}.
      </p>
    </article>
  );
}

function ConfusionMatrixCard({ cells }: { cells: number[][] }) {
  const flat = cells.flat();
  const max = Math.max(...flat);
  return (
    <div className="mt-4 grid grid-cols-2 gap-3">
      {flat.map((value, index) => (
        <div
          key={`${value}-${index}`}
          className="rounded-[22px] border p-4 text-center"
          style={{
            backgroundColor: `rgba(238,255,31,${0.18 + (value / max) * 0.48})`,
            borderColor: "rgba(143, 145, 142, 0.24)",
          }}
        >
          <p className="text-[0.64rem] uppercase tracking-[0.2em] text-secondary">
            {index === 0
              ? "TN"
              : index === 1
                ? "FP"
                : index === 2
                  ? "FN"
                  : "TP"}
          </p>
          <p className="mt-2 text-3xl font-semibold tracking-[-0.06em] text-primary">
            {value}
          </p>
        </div>
      ))}
    </div>
  );
}

function SectionPreview({ section }: { section: TimelineNodeSection | undefined }) {
  if (!section) return null;
  return (
    <div className="rounded-[24px] border border-[rgba(143,145,142,0.24)] bg-surface-light p-4">
      <p className="text-[0.66rem] uppercase tracking-[0.22em] text-secondary">
        {section.title}
      </p>
      <div className="mt-3 space-y-2 text-sm leading-6 text-primary">
        {section.items.slice(0, 3).map((item) => (
          <p key={item}>{item}</p>
        ))}
      </div>
    </div>
  );
}
