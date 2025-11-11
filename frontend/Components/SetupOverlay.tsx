import { AiOutlineCheckCircle, AiOutlineLoading3Quarters, AiOutlineMinusCircle } from "react-icons/ai";

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
      return <AiOutlineCheckCircle />;
    case "active":
      return (
        <AiOutlineLoading3Quarters className="setup-step__icon--spinning" />
      );
    default:
      return <AiOutlineMinusCircle />;
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
    <div className="setup-overlay">
      <div className="setup-overlay__card">
        <div>
          <h2 className="setup-overlay__title">{title}</h2>
          <p className="setup-overlay__subtitle">{subtitle}</p>
        </div>
        <ul className="setup-steps">
          {steps.map((step) => (
            <li
              key={step.id}
              className={`setup-step setup-step--${step.status}`}
            >
              <span className="setup-step__icon">{resolveIcon(step.status)}</span>
              <span>{step.label}</span>
            </li>
          ))}
        </ul>
        {hint ? <p className="setup-overlay__hint">{hint}</p> : null}
      </div>
    </div>
  );
};
