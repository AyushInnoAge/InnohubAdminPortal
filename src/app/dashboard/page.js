"use client";
import AnimatedPostCard from "../Components/AnimatedPostCard";
import PostInput from "./PostInputSection";
import SidebarProfile from "../Components/SlideBar";
import { useState } from "react";
import PollCard from "../Components/PollCard";

export default function Home() {
  const [userPost, setUserPost] = useState([
    {
      profileImage: "https://media.licdn.com/dms/image/v2/C5103AQFTiwdba6bFqA/profile-displayphoto-shrink_100_100/profile-displayphoto-shrink_100_100/0/1516274936348?e=1746057600&v=beta&t=vR_wHlnYK86TFKIAgENOAfXKzDkTZPTIluFKyGIaLMs",
      username: "Tom Dodds",
      title: "",
      description: "Success begins with a single step. Stay focused, work hard, and never give up—great things take time and effort.",
      imageUrl: "https://pixabay.com/photos/mosque-building-islam-religion-6835469/",
    },
    {
      profileImage: "https://media.licdn.com/dms/image/v2/D4E03AQF1182tZN9UUw/profile-displayphoto-shrink_100_100/B4EZRg3pVFHMAU-/0/1736791988099?e=1746057600&v=beta&t=TXIDx24Z_N2EuSPVrdfRPugWNDdlrqNnWHlYT9KaSAk",
      username: "Nathaniel",
      title: "Spaceship",
      description: "A spaceship is a vehicle designed for space travel, used for exploration, research, or transportation beyond Earth's atmosphere.",
      imageUrl: "https://cdn.pixabay.com/photo/2024/03/13/19/06/ai-generated-8631634_1280.jpg",
    },
  ]);





  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-100 w-full">
      {/* Sidebar - Smaller width */}
      <div className="hidden md:flex md:w-1/5 lg:w-1/6 p-4 bg-white shadow-md flex-col">
        <SidebarProfile
          imageUrl="https://media.licdn.com/dms/image/v2/D5603AQEKM_w6uOQsUA/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1704348578073?e=1746057600&v=beta&t=AIAa378zWYb9x1tZkBCrJyALxTnjbuK3s-BQtDlgVAI"
          UserName="Ayush Raj Singh"
          Designation="Software Developer"
        />
      </div>

      {/* Main Feed Section - Expanded width */}
      <div className="flex flex-col w-full md:w-4/5 lg:w-5/6 p-4 overflow-y-auto h-screen space-y-6">
        <div className="w-full max-w-4xl mx-auto">
          <PostInput profileUrl="https://media.licdn.com/dms/image/v2/D5603AQEKM_w6uOQsUA/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1704348578073?e=1746057600&v=beta&t=AIAa378zWYb9x1tZkBCrJyALxTnjbuK3s-BQtDlgVAI" />
        </div>
        <div className="w-full max-w-4xl mx-auto space-y-6">
          {userPost.map((post, index) => (
            <AnimatedPostCard
              key={index}
              profileImage={post.profileImage}
              username={post.username}
              title={post.title}
              description={post.description}
              imageUrl={post.imageUrl}
            />
          ))}
          <PollCard
            profileImage="https://media.licdn.com/dms/image/v2/D5603AQEKM_w6uOQsUA/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1704348578073?e=1746057600&v=beta&t=AIAa378zWYb9x1tZkBCrJyALxTnjbuK3s-BQtDlgVAI"
            username="Ayush Raj Singh"
            title="Group Discussion"
            description="A group discussion is a collaborative exchange of ideas where participants share perspectives, analyze topics, and reach conclusions through constructive dialogue."
          />
        </div>
      </div>
    </div>
  );
}
