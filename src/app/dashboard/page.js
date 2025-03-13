"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import AnimatedPostCard from "./(dashboardComponents)/AnimatedPostCard";
import PostInput from "./(dashboardComponents)/PostInputSection";
import SidebarProfile from "./(dashboardComponents)/SlideBar";
import PollCard from "./(dashboardComponents)/PollCard";
import FestivalCard from "./(dashboardComponents)/Festivale";
import BirthdayCard from "./(dashboardComponents)/BirthdayCard";
import AppreciationCard from "./(dashboardComponents)/EmployeeAward";
import { PostContext } from "../Components/ContextApi";

export default function Home() {
  const router = useRouter();
  const token = localStorage.getItem("token");
  if (!token) return router.push("/login");

  const decoded = jwtDecode(token);
  const [userData] = useState({
    Name: decoded.Name || "Ayush Raj Singh",
    EmpID: decoded.EmployeeId || "170",
    Role: decoded.Role || "Software Developer",
    Team: decoded.Team || "Team Shubham",
    Designation: decoded.Designation || "Intern",
    Email: decoded.EmailId || "ayush123@gmail.com",
    Phone: decoded.PhoneNo || "1234567890",
    Address: decoded.Address || "Noida",
    Image: decoded.imageUrl || "/profile.jpg",
    userId: decoded.userId || "67c1743a237d2fe4aeb76ffd",
  });

  const [dashboardData, setDashboardData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lastFetchedDate, setLastFetchedDate] = useState(null);
  // const observerRef = useRef(null);
  const lastPostRef = useRef(null);

  const fetchPosts = async () => {
    if (loading) return;
    setLoading(true);

    const url = lastFetchedDate
      ? `/api/posts/latest?lastFetchedDate=${lastFetchedDate}`
      : `/api/posts/latest`;
    
    try {
      const res = await fetch(url);
      const data = await res.json();
      if (data.length > 0) {
        setDashboardData((prev) => [...prev, ...data]);
        setLastFetchedDate(data[data.length - 1]?.createdAt); // Update cursor
      }
    } catch (error) {
      console.error("API call failed:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop + 100 >=
        document.documentElement.offsetHeight
      ) {
        fetchPosts();
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastFetchedDate]);

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-100 w-full">
      <div className="hidden md:flex md:w-1/5 lg:w-1/6 p-4 bg-white shadow-md flex-col">
        <SidebarProfile imageUrl={userData.Image} UserName={userData.Name} Designation={userData.Designation} />
      </div>

      <div className="flex flex-col w-full md:w-4/5 lg:w-5/6 p-4 overflow-y-auto h-screen space-y-6">
        <div className="w-full max-w-4xl mx-auto">
          <PostContext.Provider value={{ dashboardData, setDashboardData, userData }}>
            <PostInput profileUrl={userData.Image} />
          </PostContext.Provider>
        </div>

        <div className="w-full max-w-4xl mx-auto space-y-6">
          {dashboardData.length === 0 ? (
            <h1 className="text-black size-max text-center">Loading...</h1>
          ) : (
            <PostContext.Provider value={{ userData }}>
              {dashboardData.map((post, index) => (
                <div key={index} ref={index === dashboardData.length - 1 ? lastPostRef : null}>
                  {post.type === "Post" ? (
                    <AnimatedPostCard {...post} />
                  ) : post.type === "Poll" ? (
                    <PollCard {...post} />
                  ) : (post.type === "Birthday" || post.type === "Aniversary") ? (
                    <BirthdayCard />
                  ) : null}
                </div>
              ))}
            </PostContext.Provider>
          )}
          <FestivalCard />
          <AppreciationCard />
          <PollCard />
        </div>
      </div>
      {loading && <h1 className="text-center">Loading more posts...</h1>}
    </div>
  );
}