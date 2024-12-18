import { useGetUserNotifications } from "@/services/notificationServices";
import Spinner from "../_global/spinner";
import { timeAgo } from "@/lib/utils/timeAgo";
import Link from "next/link";
import Avatar from "../user/avatar";
import { useMarkAllNotificationAsRead } from "@/services/notificationServices";
import { useEffect } from "react";
import { Check } from "lucide-react";

const NotificationList = () => {
  const { data: notifications, isLoading } = useGetUserNotifications();
  const { mutate } = useMarkAllNotificationAsRead();

  useEffect(() => {
    if (notifications?.length) {
      mutate();
    }
  }, [notifications, mutate]);

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <section className="border border-accent w-full rounded-lg shadow-lg h-full">
      <h1 className="text-md font-semibold my-2 ms-2">Bildirimler</h1>

      {/* Bildirim yoksa mesaj */}
      {notifications?.length === 0 ? (
        <div className="text-center py-5 text-gray-500">
          Şu an hiç bildirim bulunamadı.
        </div>
      ) : (
        <div className="max-h-[400px] overflow-y-auto no-scrollbar">
          {notifications?.map((notification) => (
            <div
              key={notification._id}
              className="p-1 border border-accent grid grid-cols-2 items-center transition-colors justify-between w-full"
            >
              <div className="flex gap-x-4 items-center">
                <Link
                  href={`/${notification.sender.username}`}
                  className="flex items-center gap-3"
                >
                  <Avatar size={40} avatarUrl={notification.sender.avatar} />
                  <div>
                    <h1 className="flex items-center gap-x-1 font-semibold">
                      {notification.sender.username}{" "}
                      {notification.sender.verified && (
                        <Check className="text-primary " />
                      )}
                    </h1>
                    <p className="text-sm">
                      {notification.type === "like"
                        ? "Gönderinizi beğendi."
                        : "Gönderinize yorum yaptı."}
                    </p>
                    {notification.type === "comment" && (
                      <p className="text-sm text-gray-400">
                        - {notification.content}
                      </p>
                    )}
                  </div>
                </Link>
              </div>

              <div className="text-xs ml-auto flex flex-col justify-center items-center">
                <Link href={`/post/${notification.post._id}`}>
                  <img
                    className="w-[80px] h-[60px] rounded mb-2"
                    src={notification.post.mediaUrl.replace(/\.mp4$/, ".jpg")}
                    alt="Post thumbnail"
                  />
                </Link>
                <p>{timeAgo(notification.createdAt!)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default NotificationList;
