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
import FestivalCard from "./(dashboardComponents)/Festivale";
export default function Home() {

  const router= useRouter();

const token= localStorage.getItem("token");
if(token==null){
return router.push("/login");
}

// console.log("token:  ",token);
const decoded = jwtDecode(token);

  const [userData, setUserData] = useState({
    Name: decoded.Name ||"Ayush Raj Singh",
    EmpID: decoded.EmployeeId || "170",
    Role: decoded.Role || "Software Developer",
    Team: decoded.Team || "Team Shubham",
    Designation: decoded.Designation || "Intern",
    Email: decoded.EmailId || "ayush123@gmail.com",
    Phone: decoded.PhoneNo || "1234567890",
    Address: decoded.Address || "Noida",
    ProfilePicture:"/profile.jpg",
    Image:
     decoded.imageUrl || "https://media.licdn.com/dms/image/v2/D5603AQEKM_w6uOQsUA/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1704348578073?e=1746057600&v=beta&t=AIAa378zWYb9x1tZkBCrJyALxTnjbuK3s-BQtDlgVAI",
    userId: decoded.userId ||"67c1743a237d2fe4aeb76ffd",
  });

  const [dashboardData, setDashboardData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const observerRef = useRef(null);
  const lastPostRef = useRef(null);
 

  useEffect(() => {
    fetchPosts();
  }, [page]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      console.log("dashboard DataEnter")
      const res = await axios.get(
        `http://localhost:5279/apiDashboard/GetAllPosts?page=${page}&pageSize=10`
      );
      
      setDashboardData((prev) => [...prev, ...res.data.value]);
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
          <PostContext.Provider value={{ dashboardData, setDashboardData, userData }}>
            <PostInput profileUrl={userData.Image} />
          </PostContext.Provider>
        </div>

        <div className="w-full max-w-4xl mx-auto space-y-6">
          {/* {dashboardData.length === 0 ? (
            <h1 className="text-black size-max text-center">Loading...</h1>
          ) : (
            <>
              <PostContext.Provider value={{ userData }}>
                {dashboardData.map((post, index) => (
                  <div key={index} ref={index === dashboardData.length - 1 ? lastPostRef : null}>
                    {post.type !== "Poll" ? (
                      <AnimatedPostCard
                        profileImage="https://media.licdn.com/dms/image/v2/C5103AQFTiwdba6bFqA/profile-displayphoto-shrink_100_100/profile-displayphoto-shrink_100_100/0/1516274936348?e=1746057600&v=beta&t=vR_wHlnYK86TFKIAgENOAfXKzDkTZPTIluFKyGIaLMs"
                        username="ABC"
                        title={post.title}
                        description={post.description}
                        imageUrl={post.image}
                        PostId={post.id}
                        like={post.like}
                        date={post.created_at}
                        commentDatas={post.comment}
                      />
                    ) : (
                      <PollCard
                        profileImage="https://media.licdn.com/dms/image/v2/D5603AQEKM_w6uOQsUA/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1704348578073?e=1746057600&v=beta&t=AIAa378zWYb9x1tZkBCrJyALxTnjbuK3s-BQtDlgVAI"
                        username="Ayush Raj Singh"
                        title={post.title}
                        description={post.description}
                        totalVotes={post.totalVotes}
                        postId={post.id}
                        totalYes={post.totalYes}
                        totalNo ={post.totalNo}
                      />
                    )}
                  </div>
                ))}
              </PostContext.Provider>
            </>
          )} */}

          <FestivalCard/>
        </div>
      </div>
      {loading && <h1 className="text-center">Loading more posts...</h1>}
    </div>
  );
}
