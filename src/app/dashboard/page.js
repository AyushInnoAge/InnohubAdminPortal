"use client";
import AnimatedPostCard from "./(dashboardComponents)/AnimatedPostCard";
import PostInput from "./(dashboardComponents)/PostInputSection";
import SidebarProfile from "./(dashboardComponents)/SlideBar";
import { useEffect, useState, useContext, useRef, createContext } from "react";
import PollCard from "./(dashboardComponents)/PollCard";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import BirthdayCard from "./(dashboardComponents)/BirthdayCard";
import AppreciationCard from "./(dashboardComponents)/AppreciationCard";
import FestivalCard from "./(dashboardComponents)/Festivale";
import { DashboardDataFetch } from "@/_api_/dashboard";
import { AuthContext } from "@/context/AuthContext";

export const DashboardStatus = createContext();
export default function Home() {
  const { user } = useContext(AuthContext);

  // const { user } = auth;
  const router = useRouter();
  const [dashboardData, setDashboardData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const observerRef = useRef(null);
  const lastPostRef = useRef(null);
  const [lastFetchedDate, setLastFetchedDate] = useState(null);
  const [hasMoredata, setHasMoreData] = useState(true);
  //Token Arrangment
  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("user from contextApi=>", user);
    console.log("token => ", token);
    if (!token) return (window.location.href = "/login");
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const expiry = payload.exp * 1000;

      if (Date.now() > expiry) {
        localStorage.removeItem("token");
        return router.push("/login");
      }

      // setDecoded(jwtDecode(token)); // Decode after validation
    } catch {
      console.log("Invalid Token");
      localStorage.removeItem("token");
      return router.push("/login");
    }
  }, []);

  //Fetch Data For Dashboard Data By USing Api Call
  useEffect(() => {
    console.log("page: =>", page);
    fetchPosts();
  }, [page]);

  const fetchPosts = async () => {
    if (loading || !hasMoredata) return;
    setLoading(true);
    try {
      const response = await DashboardDataFetch(lastFetchedDate);
      console.log("res=> ", response);

      if (response.length > 0) {
        setDashboardData((prev) => [...prev, ...response]);
        let time = response[response.length - 1]?.nominationData
          ? response[response.length - 1]?.nominationData?.verifiedAt
          : response[response.length - 1]?.postData?.created_at;
        setLastFetchedDate(time);
      } else {
        setHasMoreData(false);
      }
    } catch (error) {
      console.error("API call failed:", error);
    }
    setLoading(false);
  };

  //Page change cheak
  useEffect(() => {
    if (!observerRef.current) {
      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && !loading) {
          // Prevents API calls while still loading
          setPage((prev) => prev + 1);
        }
      });
    }
    if (lastPostRef.current) {
      observerRef.current.observe(lastPostRef.current);
    }

    return () => {
      if (lastPostRef.current) {
        observerRef.current.unobserve(lastPostRef.current); // Cleanup observer
      }
    };
  }, [dashboardData, loading]);

  //dashboard data
  useEffect(() => {
    console.log("Dashboard Data: ", dashboardData);
  }, [dashboardData]);

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-100 w-full">
      <div className="hidden md:flex md:w-1/5 lg:w-1/6 p-4 bg-white shadow-md flex-col">
        <SidebarProfile
          UserProfileImage={
            user?.image?.trim()
              ? user.image
              : `https://api.dicebear.com/7.x/initials/svg?seed=${user?.name}`
          }
          UserName={user?.name || ""}
          Designation={user?.designation || ""}
        />
      </div>

      <div className="flex flex-col w-full md:w-4/5 lg:w-5/6 p-4 overflow-y-auto h-screen space-y-6">
        <div className="w-full max-w-4xl mx-auto">
          <DashboardStatus.Provider value={{ setDashboardData, setLoading }}>
            <PostInput
              UserProfileImage={
                user?.image?.trim()
                  ? user.image
                  : `https://api.dicebear.com/7.x/initials/svg?seed=${user?.name}`
              }
            />
          </DashboardStatus.Provider>
        </div>

        <div className="w-full max-w-4xl mx-auto space-y-6">
          {dashboardData.length == 0 ? (
            <h1 className="text-black size-max text-center">Loading..</h1>
          ) : (
            dashboardData.map((post, index) => (
              <div
                key={index}
                ref={index === dashboardData.length - 1 ? lastPostRef : null}
              >
                {post.postData != null && post.postData?.type === "Post" ? (
                  <AnimatedPostCard
                    PostId={post.postData?.id}
                    PostUser={post.userData?.userName}
                    PostUserProfile={post.userData?.profileImage}
                    PostImageUrl={post.postData?.image}
                    PostLike={post.postData?.postLikes}
                    PostComment={post.postData?.postComments}
                    PostType={post.postData?.type}
                    PostTitle={post.postData?.title}
                    PostDescription={post.postData?.description}
                    Postcreated_At={post.postData?.created_at}
                  />
                ) : post.postData != null && post.postData?.type === "Poll" ? (
                  <PollCard
                    PostId={post.postData?.id}
                    PostUser={post?.userData?.userName}
                    PostUserProfile={post?.userData?.profileImage}
                    PostTotalYes={post?.postData?.totalYes}
                    PostTotalNo={post?.postData?.totalNo}
                    PostType={post.postData?.type}
                    PostTitle={post.postData.title}
                    Postcreated_At={post.postData?.created_at}
                  />
                ) : post.postData != null &&
                  (post.postData?.type === "Birthday" ||
                    post.postData?.type === "Anniversary") ? (
                  <BirthdayCard
                    PostId={post.postData?.id}
                    PostImageUrl={post.postData?.image}
                    PostLike={post.postData?.postLikes}
                    PostComment={post.postData?.postComments}
                    PostType={post.postData?.type}
                    PostTitle={post.postData?.title}
                    PostDescription={post.postData?.description}
                    Postcreated_At={post.postData?.created_at}
                  />
                ) : post.postData != null &&
                  post.postData?.type == "Festival" ? (
                  <FestivalCard
                    PostId={post.postData?.id}
                    PostImageUrl={post?.postData?.image}
                    PostLike={post.postData?.postLikes}
                    PostComment={post.postData?.postComments}
                    PostType={post.postData?.type}
                    PostTitle={post.postData?.title}
                    PostDescription={post.postData?.description}
                    Postcreated_At={post.postData?.created_at}
                  />
                ) : post.nominationData != null &&
                  (post.nominationData?.nomination_Type ===
                    "Star of the month" ||
                    post.nominationData?.nomination_Type === "Shoutout" ||
                    post.nominationData?.nomination_Type == "Best team" ||
                    post.nominationData?.nomination_Type == "Best leader") ? (
                  <AppreciationCard
                    PostId={post.nominationData?.id}
                    NominatedUser={post.nominationData?.userId}
                    NominatedBy={post.nominationData?.nominated_By}
                    PostType={post.nominationData?.nomination_Type}
                    PostDescription={post.nominationData?.reason}
                    PostLike={post.nominationData?.postLikes}
                    PostComment={post.nominationData?.postComments}
                  />
                ) : null}
              </div>
            ))
          )}
          {/* <AppreciationCard />
          <PollCard /> */}
        </div>
      </div>
      {loading && <h1 className="text-center">Loading more posts...</h1>}
    </div>
  );
}
