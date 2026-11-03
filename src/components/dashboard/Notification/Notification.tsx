import { Bell, CheckCheck } from "lucide-react";
import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { useSocket } from "../../../hooks/socketConnection";
import {
  useGetNotificationsQuery,
  useReadAllNotificationMutation,
} from "../../../redux/features/notification/notificationApi";
import { useGetProfileQuery } from "../../../redux/features/user/userApi";
import { getSearchParams } from "../../../utils/getSearchParams";
import ManagePagination from "../../Shared/ManagePagination";
import { Button } from "../../ui/button";
import { Card } from "../../ui/card";

const formatTimeAgo = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();

  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${diffDays}d ago`;
};

const NotificationItem = ({ notification }: any) => {
  console.log("nooti", notification);
  
  return (
    <div
      className={`p-4 cursor-pointer ${!notification.read && "bg-gray-100!"} hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0 ${!notification.read ? "bg-white" : ""
        }`}
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0">
          <Bell className="w-5 h-5 text-blue-600" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <p
              className={`text-sm ${!notification.read
                  ? "font-semibold text-gray-900"
                  : "text-gray-800"
                }`}
            >
              {notification.title}
            </p>
          </div>

          <div className="flex justify-between">
            <p className="text-sm text-gray-500 mt-0.5 leading-snug">
              {notification.text}
            </p>
            <p className="text-xs text-gray-400">
              {formatTimeAgo(notification.createdAt)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const Notification = () => {
  const scrollContainerRef = useRef(null);

  const { data: profileData } = useGetProfileQuery({});
  const { data: notificationsData, refetch } = useGetNotificationsQuery({});
  const [readAllNotification] = useReadAllNotificationMutation();
  const { page } = getSearchParams();

  useEffect(() => {
    refetch();
  }, [page]);

  const socket = useSocket();

  const notifications = notificationsData?.data || [];

  const unreadCount = notifications.filter((n: any) => !n.read).length;

  // socket realtime update
  useEffect(() => {
    if (!socket || !profileData?._id) return;

    socket.on(`send-notification::${profileData._id}`, () => {
      refetch();
    });

    socket.on(`unreadCountUpdate::${profileData._id}`, () => {
      refetch();
    });

    return () => {
      socket.off(`send-notification::${profileData._id}`);
      socket.off(`unreadCountUpdate::${profileData._id}`);
    };
  }, [socket, profileData, refetch]);

  const handleMarkAllRead = async () => {
    try {
      const response = await readAllNotification({}).unwrap();

      if (response?.success) {
        toast.success(response?.message);
        refetch();
      }
    } catch (error: any) {
      console.error(error?.data?.message);
    }
  };

  return (
    <div>
      <div className="mx-auto px-4 py-6">
        <Card className="bg-white shadow-sm border border-gray-200 overflow-hidden">

          {/* Header */}
          <header className="sticky top-0 bg-white border-b border-gray-200 px-5 py-4 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Notifications</h3>

              {unreadCount > 0 ? (
                <p className="text-sm text-gray-500 mt-0.5">
                  {unreadCount} unread notification
                  {unreadCount !== 1 ? "s" : ""}
                </p>
              ) : (
                <p className="text-sm text-gray-400 mt-0.5">All caught up!</p>
              )}
            </div>

            <Button              
              size="sm"
              onClick={handleMarkAllRead}
              disabled={unreadCount === 0}
              className="  gap-1.5 text-sm"
            >
              <CheckCheck className="w-4 h-4" />
              Mark all read
            </Button>
          </header>

          {/* List */}
          <div
            ref={scrollContainerRef}
            className="divide-y divide-gray-100 min-h-[30vh] max-h-[65vh] overflow-y-auto"
          >
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-16 text-center">
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                  <Bell className="h-8 w-8 text-gray-300" />
                </div>

                <h3 className="text-base font-semibold text-gray-700 mb-1">
                  No notifications yet
                </h3>

                <p className="text-sm text-gray-400">
                  When you get notifications, they'll show up here
                </p>
              </div>
            ) : (
              notifications.map((notif: any) => (
                <NotificationItem
                  key={notif._id}
                  notification={notif}
                />
              ))
            )}
          </div>

          {/* Footer */}
          <ManagePagination meta={notificationsData?.meta} />
        </Card>
      </div>
    </div>
  );
};

export default Notification;