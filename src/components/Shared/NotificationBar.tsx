import { Bell, CheckCircle, Clock, CreditCard, Loader, Settings, UserPlus, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useGetNotificationsQuery, useReadAllNotificationMutation } from "../../redux/features/notification/notificationApi";
import { formatChatTime } from "./FormatChatTime";
import { useEffect } from "react";
import { useSocket } from "../../hooks/socketConnection";
import { toast } from "sonner";

const getTypeConfig = (type: string) => {
    switch (type?.toUpperCase()) {
        case 'REQUESTED':
            return { icon: Bell, bg: 'bg-blue-100', text: 'text-blue-600' };
        case 'APPROVED':
            return { icon: CheckCircle, bg: 'bg-green-100', text: 'text-green-600' };
        case 'REJECTED':
            return { icon: X, bg: 'bg-red-100', text: 'text-red-600' };
        case 'PAYMENT':
            return { icon: CreditCard, bg: 'bg-amber-100', text: 'text-amber-600' };
        case 'USER':
            return { icon: UserPlus, bg: 'bg-purple-100', text: 'text-purple-600' };
        case 'ADMIN':
            return { icon: Settings, bg: 'bg-indigo-100', text: 'text-indigo-600' };
        default:
            return { icon: Bell, bg: 'bg-gray-100', text: 'text-gray-600' };
    }
};

const NotificationBar = ({ profileData }: any) => {
    const { data: notificationData, refetch, isLoading } = useGetNotificationsQuery({});
    
    const [readAllNotification] = useReadAllNotificationMutation();

    const notifications: any[] = notificationData?.data ?? [];
    const unreadCount = notifications.filter((n) => !n.read).length;

    const socket = useSocket()

    useEffect(() => {
        if (!socket) return;

        socket.on(`send-notification::${profileData?._id}`, () => { refetch() });
        socket.on(`unreadCountUpdate::${profileData?._id}`, () => { refetch() });

        return () => {
            socket.off(`send-notification::${profileData?._id}`);
            socket.off(`unreadCountUpdate::${profileData?._id}`);
        }
    }, [])


    const handleMarkAllRead = async () => {
        try {
           const response =  await readAllNotification({}).unwrap();
           if(response?.success){
            toast.success(response?.message);            
           }
        } catch (error:any) {
            console.error(error?.data?.message);
        }
    };
    return (
        <div className="absolute right-0 top-18 mt-2 w-96 bg-white border border-gray-200 rounded-lg shadow-xl z-20 overflow-hidden max-h-[500px] flex flex-col">

            {/* Header */}
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <div>
                    <h3 className="text-gray-900 font-medium">Notifications</h3>
                    {unreadCount > 0 && (
                        <p className="text-xs text-gray-400 mt-0.5">{unreadCount} unread</p>
                    )}
                </div>
                <button
                    onClick={()=>handleMarkAllRead()}
                    disabled={unreadCount === 0}
                    className="text-xs text-primary hover:underline disabled:opacity-40 disabled:cursor-not-allowed"
                >
                    Mark all as read
                </button>
            </div>

            {/* Notifications List */}
            <div className="overflow-y-auto flex-1">
                {isLoading ? (
                    <div className="flex items-center justify-center gap-3 h-40">
                        <Loader className="w-5 h-5 animate-spin text-gray-400" />
                        <span className="text-sm text-gray-400">Loading...</span>
                    </div>
                ) : notifications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-10 text-center">
                        <Bell className="w-8 h-8 text-gray-300 mb-2" />
                        <p className="text-sm text-gray-400">No notifications yet</p>
                    </div>
                ) : (
                    notifications.map((notification: any) => {
                        const { icon: Icon, bg, text } = getTypeConfig(notification.type);


                        return (
                            <div
                                key={notification._id}
                                className={`p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer ${!notification.read ? 'bg-blue-50/50' : ''}`}
                            >
                                <div className="flex gap-3">
                                    <div className={`w-10 h-10 rounded-full ${bg} flex items-center justify-center flex-shrink-0`}>
                                        <Icon className={`w-5 h-5 ${text}`} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className={`text-sm leading-snug ${!notification.read ? 'font-semibold text-gray-900' : 'text-gray-800'}`}>
                                            {notification?.title}
                                        </p>
                                        <p className="text-gray-500 text-xs mt-1 truncate">{notification?.text}</p>
                                        <p className="text-gray-400 text-xs mt-2 flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            {formatChatTime(notification.createdAt)}
                                        </p>
                                    </div>
                                    {!notification.read && (
                                        <div className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0 mt-2" />
                                    )}
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* Footer */}
            <div className="p-3 border-t border-gray-200 text-center">
                <Link to="/notification" className="text-xs text-primary hover:underline">
                    View all notifications
                </Link>
            </div>
        </div>
    );
};

export default NotificationBar;