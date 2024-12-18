import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/lib/zustand/authStore";
import {
  useSendRequest,
  useUnfollow,
  useRemoveFollower,
  useAcceptRequest,
  useRejectRequest,
  useGetRequestDetails,
} from "@/services/connectionServices";
import Modal from "../_global/modal";
import FollowersList from "./followersList";
import Spinner from "../_global/spinner";
import { IUser } from "@/types/user";
import FollowingList from "./followingList";
import { useGetUserPosts } from "@/services/postServices";

const ProfileConnectionCard = ({ userData }: { userData: IUser }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: requests } = useGetRequestDetails();
  const { data: postData } = useGetUserPosts(userData._id);
  const [isFollowersModalOpen, setFollowersModalOpen] = useState(false);
  const [isFollowingModalOpen, setFollowingModalOpen] = useState(false);
  const { user: currentUser, loading: authLoading } = useAuthStore();
  const { mutate: unfollowMutate, isPending: isUnfollowing } = useUnfollow();
  const { mutate: removeFollowerMutate, isPending: isRemoving } =
    useRemoveFollower();
  const { mutate: sendRequestMutate, isPending: isSendingRequest } =
    useSendRequest();
  const { mutate: acceptRequestMutate, isPending: isAccepting } =
    useAcceptRequest();
  const { mutate: rejectRequestMutate, isPending: isRejecting } =
    useRejectRequest();

  if (authLoading) return <Spinner />;

  const isFollowing = userData.followers?.includes(currentUser!._id);
  const isMeRequestSent = userData.receivedRequests?.includes(currentUser!._id);
  const isHerRequestSent = userData.sentRequests?.includes(currentUser!._id);
  const isMutualFollower = userData.following?.includes(currentUser!._id);
  const isOwnProfile = currentUser?._id === userData._id;

  const handleSendRequest = () =>
    sendRequestMutate({ receiverId: userData._id });
  const handleUnfollow = () => unfollowMutate({ userId: userData._id });
  const handleRemoveFollower = () =>
    removeFollowerMutate({ userId: userData._id });
  const handleAcceptRequest = (requestId: string) =>
    acceptRequestMutate({ requestId });
  const handleRejectRequest = (requestId: string) =>
    rejectRequestMutate({ requestId });

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab === "followers") setFollowersModalOpen(true);
    else if (tab === "following") setFollowingModalOpen(true);
  }, [searchParams]);

  const pendingRequest = requests?.receivedRequests.find(
    (request) =>
      request.requester._id === userData._id && request.status === "pending"
  );

  const showFollowersModal = () =>
    router.push(`/${userData.username}?tab=followers`);
  const showFollowingModal = () =>
    router.push(`/${userData.username}?tab=following`);

  return (
    <>
      <section>
        <div className="flex gap-x-2">
          <div className="flex gap-x-1">
            <p className="font-semibold">{postData ? postData.length : 0}</p>
            <span>Gönderi</span>
          </div>
          <button onClick={showFollowersModal} className="flex gap-x-1">
            <p className="font-semibold">{userData.followers.length}</p>
            <span>Takipçi</span>
          </button>
          <button onClick={showFollowingModal} className="flex gap-x-1">
            <p className="font-semibold">{userData.following.length}</p>
            <span>Takip</span>
          </button>
        </div>

        {/* Profile Actions */}
        {!isOwnProfile && (
          <div className="mt-4 flex flex-col gap-2">
            {isFollowing ? (
              <button
                className="bg-accent p-1 px-3 rounded font-semibold text-sm"
                onClick={handleUnfollow}
                disabled={isUnfollowing}
              >
                Takipten Çık
              </button>
            ) : isMeRequestSent ? (
              <button
                className="bg-accent p-1 px-3 rounded font-semibold text-sm"
                disabled={isSendingRequest}
              >
                İstek Gönderildi
              </button>
            ) : userData.private ? (
              <button
                className="bg-primary p-1 px-3 rounded font-semibold text-sm"
                onClick={handleSendRequest}
                disabled={isSendingRequest}
              >
                İstek Gönder
              </button>
            ) : (
              <button
                className="bg-primary p-1 px-3 rounded font-semibold text-sm"
                onClick={handleSendRequest}
                disabled={isSendingRequest}
              >
                Takip Et
              </button>
            )}

            {isHerRequestSent && (
              <div className="flex gap-2 items-center">
                <p className="text-sm">İstek gönderdi</p>
                <button
                  className="bg-primary p-1 px-3 rounded font-semibold text-sm"
                  onClick={() => handleAcceptRequest(pendingRequest?._id!)}
                  disabled={isAccepting}
                >
                  Kabul Et
                </button>
                <button
                  className="bg-accent p-1 px-3 rounded font-semibold text-sm"
                  onClick={() => handleRejectRequest(pendingRequest?._id!)}
                  disabled={isRejecting}
                >
                  Reddet
                </button>
              </div>
            )}

            {isMutualFollower && (
              <button
                className="bg-accent p-1 px-3 rounded font-semibold text-sm"
                onClick={handleRemoveFollower}
                disabled={isRemoving}
              >
                Takipçiyi Kaldır
              </button>
            )}
          </div>
        )}
      </section>

      <Modal
        title="Takipçiler"
        isOpen={isFollowersModalOpen}
        onClose={() => setFollowersModalOpen(false)}
      >
        <FollowersList userId={userData._id} />
      </Modal>
      <Modal
        title="Takip Edilenler"
        isOpen={isFollowingModalOpen}
        onClose={() => setFollowingModalOpen(false)}
      >
        <FollowingList userId={userData._id} />
      </Modal>
    </>
  );
};

export default ProfileConnectionCard;
