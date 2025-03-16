"use client";
import AnimatedPostCard from "./(dashboardComponents)/AnimatedPostCard";
import PostInput from "./(dashboardComponents)/PostInputSection";
import SidebarProfile from "./(dashboardComponents)/SlideBar";
import { useEffect, useState, useContext, useRef } from "react";
import PollCard from "./(dashboardComponents)/PollCard";
import axios from "axios";
import { PostContext, UserDataContext } from "../Components/ContextApi";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import BirthdayCard from "./(dashboardComponents)/BirthdayCard";
import AppreciationCard from "./(dashboardComponents)/EmployeeAward";
import FestivalCard from "./(dashboardComponents)/Festivale";
export default function Home() {
  const router = useRouter();

  const token = localStorage.getItem("token");
  if (token == null) {
    return router.push("/login");
  }

  // console.log("token:  ",token);
  const decoded = jwtDecode(token);

  const [userData, setUserData] = useState({
    Name: decoded.Name || "Ayush Raj Singh",
    EmpID: decoded.EmployeeId || "170",
    Role: decoded.Role || "Software Developer",
    Team: decoded.Team || "Team Shubham",
    Designation: decoded.Designation || "Intern",
    Email: decoded.EmailId || "ayush123@gmail.com",
    Phone: decoded.PhoneNo || "1234567890",
    Address: decoded.Address || "Noida",
    ProfilePicture: "/profile.jpg",
    Image:
      decoded.imageUrl ||
      "https://media.licdn.com/dms/image/v2/D5603AQEKM_w6uOQsUA/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1704348578073?e=1746057600&v=beta&t=AIAa378zWYb9x1tZkBCrJyALxTnjbuK3s-BQtDlgVAI",
    userId: decoded.userId || "67c1743a237d2fe4aeb76ffd",
  });

  const [dashboardData, setDashboardData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const observerRef = useRef(null);
  const lastPostRef = useRef(null);
  const [lastFetchedDate, setLastFetchedDate] = useState(null);

  useEffect(() => {
    console.log("page: =>", page);
    fetchPosts();
  }, [page]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const url = lastFetchedDate
        ? `http://localhost:5279/apiDashboard/GetAllPostFromServices?lastFetchedDate=${lastFetchedDate}`
        : `http://localhost:5279/apiDashboard/GetAllPostFromServices`;

      console.log("url=> ", url);
      console.log("dashboard DataEnter");
      const res = await axios.get(url);
      const data = res.data.value;
      console.log("res=> ", res);
      if (data.length > 0) {
        setDashboardData((prev) => [...prev, ...data]);
        setLastFetchedDate(data[data.length - 1]?.created_At); //update cursour
      }
    } catch (error) {
      console.error("API call failed:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!observerRef.current) {
      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          setPage((prev) => prev + 1);
        }
      });
    }
    if (lastPostRef.current) {
      observerRef.current.observe(lastPostRef.current);
    }
  }, [dashboardData]);

  useEffect(() => {
    console.log(dashboardData);
  }, [dashboardData]);

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-100 w-full">
      <div className="hidden md:flex md:w-1/5 lg:w-1/6 p-4 bg-white shadow-md flex-col">
        <SidebarProfile
          imageUrl={userData.Image}
          UserName={userData.Name}
          Designation={userData.Designation}
        />
      </div>

      <div className="flex flex-col w-full md:w-4/5 lg:w-5/6 p-4 overflow-y-auto h-screen space-y-6">
        <div className="w-full max-w-4xl mx-auto">
          <PostContext.Provider
            value={{ dashboardData, setDashboardData, userData }}
          >
            <PostInput profileUrl={userData.Image} />
          </PostContext.Provider>
        </div>

        <div className="w-full max-w-4xl mx-auto space-y-6">
          {dashboardData.length === 0 ? (
            <h1 className="text-black size-max text-center">Loading...</h1>
          ) : (
            <PostContext.Provider value={{ userData }}>
              {dashboardData.map((post, index) => (
                <div
                  key={index}
                  ref={index === dashboardData.length - 1 ? lastPostRef : null}
                >
                  {post.type === "Post" ? (
                    <AnimatedPostCard
                      PostId={post.id}
                      PostUser={post.user}
                      PostImageUrl={post.imageUrl}
                      PostLike={post.like}
                      PostComment={post.comment?.[0]?.comment}
                      PostType={post.type}
                      PostTitle={post.title}
                      PostDescription={post.description}
                      Postcreated_At={post.created_At}
                      post={post}
                    />
                  ) : post.type === "Poll" ? (
                    <PollCard Post={post} />
                  ) : post.type === "Birthday" || post.type === "Anniversary" ? (
                    <BirthdayCard
                      PostId={post.id}
                      PostUser={post.user}
                      PostImageUrl={post.imageUrl}
                      PostLike={post.like}
                      PostComment={post.comment?.[0]?.comment}
                      PostType={post.type}
                      PostTitle={post.title}
                      PostDescription={post.description}
                      Postcreated_At={post.created_At}
                    />
                  ) : post.type == "Festivale" ? (
                    <FestivalCard
                      PostId={post.id}
                      PostUser={post.user}
                      PostImageUrl={post.imageUrl}
                      PostLike={post.like}
                      PostComment={post.comment?.[0]?.comment}
                      PostType={post.type}
                      PostTitle={post.title}
                      PostDescription={post.description}
                      Postcreated_At={post.created_At}
                      post={post}
                    />
                  ) : post.type == "Star of the month" ||
                    post.type == "Shoutout" ||
                    post.type == "Best team" ||
                    post.type == "Best leader" ? (
                    <AppreciationCard
                      PostId={post.id}
                      PostLike={post.like}
                      PostComment={post.comment?.[0]?.comment}
                      PostType={post.type}
                      PostTitle={post.title}
                      PostDescription={post.description}
                      Postcreated_At={post.created_At}
                      post={post}
                    />
                  ) : null}
                </div>
              ))}
            </PostContext.Provider>
          )}

          {/* <AppreciationCard />
          <PollCard /> */}
        </div>
      </div>
      {loading && <h1 className="text-center">Loading more posts...</h1>}
    </div>
  );
}
