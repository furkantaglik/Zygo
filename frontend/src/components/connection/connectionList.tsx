"use client";
import {
  GetRequestDetails,
  AcceptRequest,
  RejectRequest,
} from "@/services/connectionServices";
import { useAuthStore } from "@/lib/zustand/authStore";
import Spinner from "../_global/spinner";
import Avatar from "../user/avatar";
import Link from "next/link";

const ConnectionList = () => {
  const { user: currentUser } = useAuthStore();
  const { data: requests, isLoading: requestsLoading } = GetRequestDetails();
  const { mutate: acceptRequest } = AcceptRequest();
  const { mutate: rejectRequest } = RejectRequest();

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
        status: `sizi takip etmeye başladı. `,
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
    <div className="border border-accent p-2">
      <h1 className="text-xl font-bold mb-4">Bağlantı Yönetimi</h1>

      {filteredRequests.length > 0 ? (
        <ul className="space-y-2">
          {filteredRequests.map((request, index) => (
            <li
              key={index}
              className="p-2 rounded shadow flex justify-between items-center"
            >
              <span className="flex  gap-x-3">
                <Link href={`/${request.relatedUser}`} className="flex gap-x-1">
                  <Avatar size={25} avatarUrl={request.avatar} />
                  <strong> {request.relatedUser}</strong>
                </Link>
                <p>{request.status}</p>
              </span>

              {request.action === "receive" && (
                <div className="space-x-2">
                  <button
                    onClick={() => handleAccept(request.requestId)}
                    className="px-4 py-1 bg-green-500 text-white rounded"
                  >
                    Kabul Et
                  </button>
                  <button
                    onClick={() => handleReject(request.requestId)}
                    className="px-4 py-1 bg-red-500 text-white rounded"
                  >
                    Reddet
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>
          Henüz herhangi bir bağlantı isteği veya takip eden bulunmamaktadır.
        </p>
      )}
    </div>
  );
};

export default ConnectionList;
