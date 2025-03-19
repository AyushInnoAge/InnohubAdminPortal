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
import { useAuth } from "../Components/AuthContext";
export default function Home() {
  const router = useRouter();
  const { user, setUser } = useAuth(); 
  const [dashboardData, setDashboardData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const observerRef = useRef(null);
  const lastPostRef = useRef(null);
  const [lastFetchedDate, setLastFetchedDate] = useState(null);
  const [hasMoredata, setHasMoreData] = useState(true);
  const [userData, setUserData]=useState({
    Name:"",
    userId:"",
    Role:"",
    Designation:"",
    Image:"",
    department:"",
  })
  //Token Arrangment
  useEffect(() => {
    const token = localStorage.getItem("token");
    const storage=JSON.parse(localStorage.getItem("userData"));
    setUser(storage);
    console.log("token => ", token);
    if (!token) return window.location.href = "/login";
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
  }, [])

  //userInsert In Globle State
useEffect(()=>{
  if(user){
    setUserData({
      Name:user?.name || "...",
      userId:user?.id || ".." ,
      Role:user?.role || "Software devloper",
      Designation:user?.designation || "..",
      Image:`https://api.dicebear.com/7.x/initials/svg?seed=${user?.name}`,
      department:user?.department || "IT",
    })
  }
},[user]);

  //if page change dashboar data call
  useEffect(() => {
    console.log("page: =>", page);
    fetchPosts();
  }, [page]);

  const fetchPosts = async () => {
    if (loading || !hasMoredata) return;
    setLoading(true);
    try {
      const url = lastFetchedDate
        ? `http://localhost:5279/apiDashboard/GetAllPostFromServices?lastFetchedDate=${lastFetchedDate}`
        : `http://localhost:5279/apiDashboard/GetAllPostFromServices`;

      console.log("url=> ", url);
      console.log("dashboard DataEnter");
      const res = await axios.get(url);
      const data = res.data.message.value;
      console.log("res=> ", res);
      if (data.length > 0) {
        setDashboardData((prev) => [...prev, ...data]);
        setLastFetchedDate(data[data.length - 1]?.created_At); //update cursour
      } else {
        setHasMoreData(false)
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
        if (entries[0].isIntersecting && !loading) {  // Prevents API calls while still loading
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
    console.log(dashboardData);
    console.log("UserData=>", userData);
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
