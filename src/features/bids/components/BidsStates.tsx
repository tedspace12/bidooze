import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, RefreshCw, Search, Plus } from "lucide-react";
import { useRouter } from "next/navigation";

interface ErrorStateProps {
    title: string;
    message: string;
    onRetry: () => void;
}

export const ErrorState = ({ title, message, onRetry }: ErrorStateProps) => (
    <Card className="w-full">
        <CardContent className="flex flex-col items-center justify-center py-12 px-6">
            <AlertCircle className="h-12 w-12 text-destructive mb-4" />
            <h3 className="text-lg font-semibold mb-2">{title}</h3>
            <p className="text-muted-foreground text-center mb-6 max-w-md">{message}</p>
            <Button onClick={onRetry} variant="outline" className="gap-2">
                <RefreshCw className="h-4 w-4" />
                Try Again
            </Button>
        </CardContent>
    </Card>
);

interface EmptyStateProps {
    title: string;
    message: string;
    actionLabel?: string;
    actionHref?: string;
    icon?: React.ReactNode;
}

export const EmptyState = ({ title, message, actionLabel, actionHref, icon }: EmptyStateProps) => {
    const router = useRouter();

    return (
        <Card className="w-full">
            <CardContent className="flex flex-col items-center justify-center py-12 px-6">
                {icon || <Search className="h-12 w-12 text-muted-foreground mb-4" />}
                <h3 className="text-lg font-semibold mb-2">{title}</h3>
                <p className="text-muted-foreground text-center mb-6 max-w-md">{message}</p>
                {actionLabel && actionHref && (
                    <Button onClick={() => router.push(actionHref)} className="gap-2">
                        <Plus className="h-4 w-4" />
                        {actionLabel}
                    </Button>
                )}
            </CardContent>
        </Card>
    );
};