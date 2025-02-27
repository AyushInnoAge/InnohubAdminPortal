import { Card } from "../Components/ui/card";
import { Avatar } from "../Components/ui/avatar";
import { Button } from "../Components/ui/button";
import { Badge } from "../Components/ui/badge";
import { Linkedin } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "../Components/ui/tooltip";

export default function SidebarProfile2({
  imageUrl,
  UserName,
  Designation,
  achievements = [
    {
      id: 1,
      color: "bg-blue-500",
      title: "Achievement 1",
      desc: "Description of achievement 1",
    },
    {
      id: 2,
      color: "bg-yellow-500",
      title: "Achievement 2",
      desc: "Description of achievement 2",
    },
    {
      id: 3,
      color: "bg-green-500",
      title: "Achievement 3",
      desc: "Description of achievement 3",
    },
    {
      id: 4,
      color: "bg-red-500",
      title: "Achievement 4",
      desc: "Description of achievement 4",
    },
   
  ],
}) {
  return (
    <TooltipProvider>
      <Card className="w-full p-5 shadow-lg rounded-2xl bg-white">
        {/* Profile Section */}
        <div className="flex flex-col items-center text-center">
          <Avatar
            src={imageUrl}
            className="w-16 h-16 mb-3 border-4 border-gray-300"
          />
          <h2 className="text-lg font-semibold text-black">{UserName}</h2>
          <p className="mt-1 text-sm text-gray-700 text-center">
            {Designation}
          </p>
        </div>

        {/* Achievements Section */}
        <div className="mt-6">
          <h3 className="text-md font-semibold mb-3 text-gray-800">
            Achievements
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {achievements.map((ach) => (
              <Tooltip key={ach.id}>
                <TooltipTrigger className="transition-transform hover:scale-110">
                  <Avatar
                    src="https://img.freepik.com/premium-photo/best-seller-batch-golden-rebon_1137257-3331.jpg?semt=ais_hybrid"
                    className={`w-12 h-12 ${ach.color} rounded-lg`}
                  />
                </TooltipTrigger>
                <TooltipContent className="p-3 bg-gray-800 text-white rounded-lg shadow-md">
                  <strong>{ach.title}</strong>
                  <p className="text-xs mt-1">{ach.desc}</p>
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          <Button variant="outline">Profile</Button>
          <Button variant="default" className="flex gap-2">
            <Linkedin size={18} /> LinkedIn
          </Button>
        </div>
      </Card>
    </TooltipProvider>
  );
}
