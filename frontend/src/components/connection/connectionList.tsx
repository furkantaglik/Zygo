"use client";
import {
  useGetRequestDetails,
  useAcceptRequest,
  useRejectRequest,
} from "@/services/connectionServices";
import { useAuthStore } from "@/lib/zustand/authStore";
import Spinner from "../_global/spinner";
import Avatar from "../user/avatar";
import Link from "next/link";
import { timeAgo } from "@/lib/utils/timeAgo";
import { Check } from "lucide-react";

const ConnectionList = () => {
  const { user: currentUser } = useAuthStore();
  const { data: requests, isLoading: requestsLoading } = useGetRequestDetails();
  const { mutate: acceptRequest } = useAcceptRequest();
  const { mutate: rejectRequest } = useRejectRequest();

  if (requestsLoading || !currentUser) {
    return <Spinner />;
  }

  const filteredRequests = [
    ...(requests?.receivedRequests || [])
      .filter(
        (request) =>
          request.status === "pending" &&
          request.requester.username !== currentUser.username
      )
      .map((request) => ({
        ...request,
        status: ` sizi takip etmek istiyor. `,
        relatedUser: request.requester.username,
        avatar: request.requester.avatar,
        requestId: request._id,
        action: "receive",
      })),

    ...(requests?.acceptedRequests || [])
      .filter((request) => request.requester.username !== currentUser.username)
      .map((request) => ({
        ...request,
        status: `sizi takip etmeye başladı.  `,
        relatedUser: request.requester.username,
        avatar: request.requester.avatar,
        requestId: request._id,
        action: "accepted",
      })),
  ];

  const handleAccept = (requestId: string) => {
    acceptRequest({ requestId });
  };

  const handleReject = (requestId: string) => {
    rejectRequest({ requestId });
  };

  return (
    <div className="border border-accent  w-full rounded-lg shadow-lg h-full">
      <h1 className="text-md font-semibold my-2 ms-2">Bağlantı Yönetimi</h1>

      {filteredRequests.length > 0 ? (
        <ul className="space-y-0 h-[300px] overflow-y-auto no-scrollbar">
          {filteredRequests.map((request, index) => (
            <li
              key={index}
              className={`p-1 border border-accent grid items-center transition-colors justify-between w-full ${
                request.action === "receive"
                  ? "grid-cols-1 gap-3"
                  : "grid-cols-2"
              }`}
            >
              <div className="flex gap-x-4 items-center">
                <Link
                  href={`/${request.relatedUser}`}
                  className="flex items-center gap-3 "
                >
                  <Avatar size={40} avatarUrl={request.avatar} />
                  <div>
                    <h1 className="flex items-center gap-x-1  font-semibold">
                      {request.relatedUser}
                      {request.requester.verified && (
                        <Check className="text-primary " />
                      )}
                    </h1>
                    <p className="text-sm">{request.status}</p>
                  </div>
                </Link>
              </div>

              {request.action === "receive" && (
                <div className="flex gap-x-4 w-full font-semibold text-sm">
                  <button
                    onClick={() => handleAccept(request.requestId)}
                    className="px-3 py-2  bg-primary rounded-md hover:bg-primary-dark transition"
                  >
                    Kabul Et
                  </button>
                  <button
                    onClick={() => handleReject(request.requestId)}
                    className="px-3 py-2 bg-accent rounded-md hover:bg-accent-dark transition"
                  >
                    Reddet
                  </button>
                </div>
              )}

              <div className="text-xs ml-auto">
                {timeAgo(request.updatedAt)}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center text-gray-500 py-6">
          Henüz herhangi bir bağlantı isteği veya takip eden bulunmamaktadır.
        </p>
      )}
    </div>
  );
};

export default ConnectionList;
