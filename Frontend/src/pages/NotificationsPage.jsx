import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { acceptFriendRequest, getFriendRequests } from "../lib/api";
import { BellIcon, CheckCircleIcon, UserCheckIcon } from "lucide-react";
import NoNotificationsFound from "../components/NoNotificationFound";

const NotificationsPage = () => {
  const queryClient = useQueryClient();

  // Fetch friend requests
  const { data: friendRequests, isLoading } = useQuery({
    queryKey: ["friendRequests"],
    queryFn: getFriendRequests,
  });

  // Accept friend request
  const { mutate: acceptRequestMutation, isPending } = useMutation({
    mutationFn: acceptFriendRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friendRequests"] });
      queryClient.invalidateQueries({ queryKey: ["friends"] });
    },
  });

  const incomingRequests = friendRequests?.incomingReqs || [];
  const acceptedRequests = friendRequests?.acceptedReqs || [];

  return (
    <Layout showSidebar={true}>
      <div className="p-6 lg:p-8 space-y-8 max-w-4xl mx-auto">

        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-4 flex items-center gap-2">
          <BellIcon className="size-6 text-primary" />
          Notifications
        </h1>

        {/* Loader */}
        {isLoading ? (
          <div className="flex justify-center py-20">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : (
          <>
            {/* Incoming Requests */}
            {incomingRequests.length > 0 && (
              <section className="space-y-4">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <UserCheckIcon className="size-5 text-primary" />
                  Friend Requests
                  <span className="badge badge-primary ml-2">
                    {incomingRequests.length}
                  </span>
                </h2>

                <div className="space-y-3">
                  {incomingRequests.map((req) => (
                    <div
                      key={req._id}
                      className="card bg-base-200 shadow-md p-4 flex items-center justify-between hover:shadow-lg transition"
                    >
                      <div className="flex items-center gap-4">
                        <img
                          src={req.sender.profilePic}
                          alt={req.sender.fullName}
                          className="w-14 h-14 rounded-full object-cover bg-base-300"
                        />
                        <div>
                          <h3 className="font-semibold">{req.sender.fullName}</h3>
                          <span className="text-sm opacity-70">
                            Native: {req.sender.nativeLanguage}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => acceptRequestMutation(req._id)}
                        disabled={isPending}
                        className="btn btn-primary btn-sm"
                      >
                        {isPending ? "Accepting..." : "Accept"}
                      </button>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Accepted Requests Section */}
            {acceptedRequests.length > 0 && (
              <section className="space-y-4 mt-8">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <CheckCircleIcon className="size-5 text-success" />
                  Accepted Requests
                </h2>

                <div className="space-y-3">
                  {acceptedRequests.map((req) => (
                    <div
                      key={req._id}
                      className="card bg-base-200 shadow p-4 flex items-center gap-4"
                    >
                      <img
                        src={req.sender.profilePic}
                        alt={req.sender.fullName}
                        className="w-12 h-12 rounded-full object-cover bg-base-300"
                      />
                      <p>{req.sender.fullName} is now your friend 🎉</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* If No Notifications */}
            {incomingRequests.length === 0 && acceptedRequests.length === 0 && (
              <NoNotificationsFound />
            )}
          </>
        )}
      </div>
    </Layout>
  );
};

export default NotificationsPage;
