import { CheckCircle, Loader2, Circle } from "lucide-react";
import { cn } from "../lib/utils";

export type SetupStepStatus = "pending" | "active" | "complete";

export interface SetupOverlayStep {
  id: string;
  label: string;
  status: SetupStepStatus;
}

interface SetupOverlayProps {
  visible: boolean;
  title: string;
  subtitle: string;
  hint?: string;
  steps: SetupOverlayStep[];
}

const resolveIcon = (status: SetupStepStatus) => {
  switch (status) {
    case "complete":
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    case "active":
      return (
        <Loader2 className="w-5 h-5 text-jb-accent animate-spin" />
      );
    default:
      return <Circle className="w-5 h-5 text-jb-text-muted" />;
  }
};

export const SetupOverlay = ({
  visible,
  title,
  subtitle,
  hint,
  steps,
}: SetupOverlayProps) => {
  if (!visible) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-jb-panel border border-jb-border rounded-lg shadow-2xl w-full max-w-md p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-white mb-2">{title}</h2>
          <p className="text-sm text-jb-text-muted">{subtitle}</p>
        </div>
        
        <ul className="space-y-4">
          {steps.map((step) => (
            <li
              key={step.id}
              className={cn(
                "flex items-center gap-3 text-sm transition-colors",
                step.status === "active" ? "text-jb-text" : "text-jb-text-muted",
                step.status === "complete" && "text-jb-text"
              )}
            >
              <span className="shrink-0">{resolveIcon(step.status)}</span>
              <span>{step.label}</span>
            </li>
          ))}
        </ul>
        
        {hint && (
          <div className="mt-6 pt-4 border-t border-jb-border/50">
             <p className="text-xs text-jb-text-muted italic text-center">{hint}</p>
          </div>
        )}
      </div>
    </div>
  );
};
