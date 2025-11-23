import { ReactNode } from "react";
import { cn } from "../../lib/utils";

interface IslandProps {
  children: ReactNode;
  className?: string;
  title?: string;
  actions?: ReactNode;
  headerClassName?: string;
}

export const Island = ({ children, className, title, actions, headerClassName }: IslandProps) => {
  return (
    <div className={cn("flex flex-col h-full w-full bg-jb-panel rounded-[var(--radius-panel)] overflow-hidden border border-jb-border shadow-sm", className)}>
      {(title || actions) && (
        <div className={cn("flex items-center justify-between px-4 py-2 bg-jb-panel shrink-0 h-10", headerClassName)}>
          {title && (
            <span className="text-xs font-bold text-jb-text-muted uppercase tracking-wider select-none">
              {title}
            </span>
          )}
          <div className="flex items-center gap-1">
            {actions}
          </div>
        </div>
      )}
      <div className="flex-1 min-h-0 relative flex flex-col">
        {children}
      </div>
    </div>
  );
};
