import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface EmptyStateAction {
    label: string;
    href?: string;
    onClick?: () => void;
    variant?: "default" | "outline" | "ghost";
}

interface EmptyStateProps {
    icon: ReactNode;
    title: string;
    description: string;
    actions?: EmptyStateAction[];
    className?: string;
}

const EmptyState = ({ icon, title, description, actions, className }: EmptyStateProps) => (
    <div className={`flex flex-col items-center justify-center py-16 px-6 text-center rounded-xl border border-dashed border-border bg-muted/20 ${className ?? ""}`}>
        <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-background border border-border shadow-sm mb-5">
            <div className="text-muted-foreground [&>svg]:h-6 [&>svg]:w-6">
                {icon}
            </div>
        </div>
        <h3 className="text-base md:text-lg font-semibold text-foreground mb-1.5">{title}</h3>
        <p className="text-sm md:text-base text-muted-foreground max-w-sm leading-relaxed mb-6">{description}</p>
        {actions && actions.length > 0 && (
            <div className="flex flex-wrap items-center justify-center gap-3">
                {actions.map((action, i) =>
                    action.href ? (
                        <Link key={i} href={action.href}>
                            <Button variant={action.variant ?? (i === 0 ? "default" : "outline")} size="sm">
                                {action.label}
                            </Button>
                        </Link>
                    ) : (
                        <Button
                            key={i}
                            variant={action.variant ?? (i === 0 ? "default" : "outline")}
                            size="sm"
                            onClick={action.onClick}
                        >
                            {action.label}
                        </Button>
                    )
                )}
            </div>
        )}
    </div>
);

export default EmptyState;
