import { Bell, Mail, Send } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { notifications } from "@/lib/data";

const iconMap = {
  email: <Mail className="h-4 w-4" />,
  telegram: <Send className="h-4 w-4" />,
  system: <Bell className="h-4 w-4" />,
};

export function NotificationsPanel() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
        <CardDescription>Recent alerts from your connected channels.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        {notifications.map((notification) => (
          <div key={notification.id} className="flex items-start gap-4">
            <div className="bg-muted text-muted-foreground rounded-full p-2">
              {iconMap[notification.type]}
            </div>
            <div className="grid gap-1">
              <p className="text-sm font-medium leading-none">
                {notification.message}
              </p>
              <p className="text-sm text-muted-foreground">{notification.time}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
