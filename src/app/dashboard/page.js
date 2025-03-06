"use client";
import AnimatedPostCard from "./(dashboardComponents)/AnimatedPostCard";
import PostInput from "./(dashboardComponents)/PostInputSection";
import SidebarProfile from "./(dashboardComponents)/SlideBar";
import { useEffect, useState } from "react";
import PollCard from "./(dashboardComponents)/PollCard";
import axios from "axios";
import { PostContext } from "./(dashboardComponents)/ContextApi";
export default function Home() {

  const [dashboardData, setDashboardData] = useState([]);


  //Every Reload and dependency change useEffect run and featch main ui data

  useEffect(() => {
    const featch = async () => {
      try {
        const res = await axios.get("http://localhost:5279/apiDashboard/GetAllPosts?page=1&pageSize=10");
        const data = res.data;
        setDashboardData(data.value);
        console.log(data);

        // return (setUserPost(data));
      } catch (error) {
        console.error("Api call failed: ", error);
      }
    }
    featch()
  }, [])


  //cheak data set in dashboard or not 
  useEffect(() => {
    console.log("Dashboard data", dashboardData);
  }, [dashboardData])





  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-100 w-full">

      <div className="hidden md:flex md:w-1/5 lg:w-1/6 p-4 bg-white shadow-md flex-col">
        <SidebarProfile
          imageUrl="https://media.licdn.com/dms/image/v2/D5603AQEKM_w6uOQsUA/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1704348578073?e=1746057600&v=beta&t=AIAa378zWYb9x1tZkBCrJyALxTnjbuK3s-BQtDlgVAI"
          UserName="Ayush Raj Singh"
          Designation="Software Developer"
        />
      </div>

      {/* {postdataExtract} */}


      <div className="flex flex-col w-full md:w-4/5 lg:w-5/6 p-4 overflow-y-auto h-screen space-y-6">
        <div className="w-full max-w-4xl mx-auto">
          <PostContext.Provider value={{ dashboardData, setDashboardData }}>
            <PostInput profileUrl="https://media.licdn.com/dms/image/v2/D5603AQEKM_w6uOQsUA/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1704348578073?e=1746057600&v=beta&t=AIAa378zWYb9x1tZkBCrJyALxTnjbuK3s-BQtDlgVAI"

            />
          </PostContext.Provider>
        </div>
        <div className="w-full max-w-4xl mx-auto space-y-6">

          {dashboardData.length === 0 ? (
            <h1 className="text-black size-max text-center">Loading...</h1>
          ) : (
            <>
              {dashboardData
                .filter((post) => post.type !== "Poll")
                .map((post, index) => (
                  <AnimatedPostCard
                    key={index}
                    profileImage="https://media.licdn.com/dms/image/v2/C5103AQFTiwdba6bFqA/profile-displayphoto-shrink_100_100/profile-displayphoto-shrink_100_100/0/1516274936348?e=1746057600&v=beta&t=vR_wHlnYK86TFKIAgENOAfXKzDkTZPTIluFKyGIaLMs"
                    username="ADCD"
                    title={post.title}
                    description={post.description}
                    imageUrl=""
                    PostId={post.id}
                    like={post.Like ? post.Like.length : 0}
                    date={post.created_at}
                  />
                ))}

              {dashboardData
                .filter((post) => post.type === "Poll")
                .map((post, index) => (
                  <PollCard
                    key={index}
                    profileImage="https://media.licdn.com/dms/image/v2/D5603AQEKM_w6uOQsUA/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1704348578073?e=1746057600&v=beta&t=AIAa378zWYb9x1tZkBCrJyALxTnjbuK3s-BQtDlgVAI"
                    username="Ayush Raj Singh"
                    title={post.title}
                    description={post.description}
                    totalVotes={post.totalVotes}
                  />
                ))}
            </>
          )}


        </div>
      </div>
    </div>
  );
}
