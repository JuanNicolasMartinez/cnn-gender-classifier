import { cn } from "@/lib/utils";

type TimelineConnectorProps = {
  direction: "left" | "right";
};

export function TimelineConnector({ direction }: TimelineConnectorProps) {
  return (
    <div
      aria-hidden
      className={cn(
        "timeline-connector hidden xl:block",
        direction === "left"
          ? "timeline-connector-left"
          : "timeline-connector-right",
      )}
    />
  );
}
