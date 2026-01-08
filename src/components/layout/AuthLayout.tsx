import { ReactNode } from "react";
import {
  Gavel,
  Tag,
  Clock,
  DollarSign,
  Award,
  Star,
  Gem,
  TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AuthLayoutProps {
  children: ReactNode;
  maxWidth?: "md" | "lg" | "xl";
}

const FloatingIcon = ({
  icon: Icon,
  className,
}: {
  icon: React.ElementType;
  className: string;
}) => (
  <div className={`absolute text-primary/50 ${className}`}>
    <Icon className="w-full h-full" strokeWidth={1} />
  </div>
);

const AuthLayout = ({ children, maxWidth = "md" }: AuthLayoutProps) => {
  const maxWidthClasses = {
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-3xl",
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted p-4 relative overflow-hidden">
      {/* Background pattern using theme colors */}
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='hsl(var(--primary))' fill-opacity='0.15'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Decorative waves */}
      <div className="absolute inset-0 opacity-30">
        <svg
          className="absolute bottom-0 left-0 w-full"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
        >
          <path
            fill="hsl(var(--primary))"
            fillOpacity="0.1"
            d="M0,96L48,112C96,128,192,160,288,165.3C384,171,480,149,576,133.3C672,117,768,107,864,122.7C960,139,1056,181,1152,181.3C1248,181,1344,139,1392,117.3L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          />
        </svg>
        <svg
          className="absolute top-0 left-0 w-full"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
        >
          <path
            fill="hsl(var(--primary))"
            fillOpacity="0.08"
            d="M0,224L48,208C96,192,192,160,288,154.7C384,149,480,171,576,181.3C672,192,768,192,864,176C960,160,1056,128,1152,117.3C1248,107,1344,117,1392,122.7L1440,128L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
          />
        </svg>
      </div>

      {/* Floating decorative icons */}
      <FloatingIcon
        icon={Gavel}
        className="w-12 h-12 top-[8%] left-[5%] rotate-[-15deg] animate-pulse"
      />
      <FloatingIcon
        icon={Tag}
        className="w-12 h-12 top-[15%] right-[8%] rotate-20 animate-bounce"
      />
      <FloatingIcon
        icon={Clock}
        className="w-12 h-12 bottom-[20%] left-[8%] rotate-10 animate-bounce"
      />
      <FloatingIcon
        icon={DollarSign}
        className="w-12 h-12 top-[40%] left-[3%] rotate-[-8deg]"
      />
      <FloatingIcon
        icon={Award}
        className="w-12 h-12 bottom-[15%] right-[5%] -rotate-12d"
      />
      <FloatingIcon
        icon={Star}
        className="w-12 h-12 top-[25%] left-[15%] rotate-25"
      />
      <FloatingIcon
        icon={Gem}
        className="w-12 h-12 bottom-[30%] right-[12%] rotate-15"
      />
      <FloatingIcon
        icon={TrendingUp}
        className="w-16 h-16 top-[60%] right-[3%] rotate-[-5deg] animate-pulse"
      />

      {/* Subtle gradient orbs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-accent/5 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />
      <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-primary/3 rounded-full blur-2xl" />

      {/* Main content */}
      <div className={cn("relative z-10 w-full", maxWidthClasses[maxWidth])}>
        <div className="bg-background/95 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-border/30 space-y-8">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
