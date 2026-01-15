import { ReactNode } from "react";
import { Button } from "@/components/ui/button";

interface SectionHeaderProps {
  title: string | ReactNode;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  actionElement?: ReactNode;
  className?: string;
}

const SectionHeader = ({
  title,
  description,
  actionLabel,
  onAction,
  actionElement,
  className = "",
}: SectionHeaderProps) => {
  return (
    <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-6 sm:mb-8 ${className}`}>
      <div className="min-w-0">
        {typeof title === "string" ? (
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground">{title}</h2>
        ) : (
          title
        )}
        {description && (
          <p className="text-muted-foreground mt-1 sm:mt-2 text-sm sm:text-base">{description}</p>
        )}
      </div>
      {actionElement ? (
        <div className="shrink-0">{actionElement}</div>
      ) : actionLabel && onAction ? (
        <Button variant="outline" onClick={onAction} className="self-start sm:self-auto shrink-0">
          {actionLabel}
        </Button>
      ) : null}
    </div>
  );
};

export default SectionHeader;
