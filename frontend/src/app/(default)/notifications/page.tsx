"use client";
import ConnectionList from "@/components/connection/connectionList";
import NotificationList from "@/components/notification/notificationList";

const NotificationsPage = () => {
  return (
    <section className="flex flex-col gap-y-5 ">
      <ConnectionList />
      <NotificationList />
    </section>
  );
};

export default NotificationsPage;
