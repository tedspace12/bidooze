import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface NotificationSetting {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
}

interface NotificationSectionProps {
  title: string;
  icon: React.ReactNode;
  settings: NotificationSetting[];
  onToggle: (id: string, enabled: boolean) => void;
}

const NotificationSection = ({
  title,
  icon,
  settings,
  onToggle,
}: NotificationSectionProps) => {
  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-primary/10 rounded-lg text-primary">
          {icon}
        </div>
        <h2 className="text-lg font-semibold text-foreground">{title}</h2>
      </div>
      
      <div className="space-y-5">
        {settings.map((setting) => (
          <div
            key={setting.id}
            className="flex items-start justify-between gap-4"
          >
            <div className="flex-1 min-w-0">
              <Label
                htmlFor={setting.id}
                className="text-sm font-medium text-foreground cursor-pointer"
              >
                {setting.label}
              </Label>
              <p className="text-sm text-muted-foreground mt-0.5">
                {setting.description}
              </p>
            </div>
            <Switch
              id={setting.id}
              checked={setting.enabled}
              onCheckedChange={(checked) => onToggle(setting.id, checked)}
              className="shrink-0"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationSection;
