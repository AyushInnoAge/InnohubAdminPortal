import React from 'react';

export default function ProfileCard() {
  const profileData = {
    name: 'Vedant Shahi',
    avatar:
      'https://res.cloudinary.com/dnx8ycr6n/image/upload/v1746008508/uploads/Post/dl6febrza8fjnkdtmeta.jpg',
    role: 'IT Intern',
    email: 'vedant.shahi@innoage.in',
    totalHours: 264.0
  };

  return (
    <div className="flex flex-col items-center text-center gap-3 w-full bg-white rounded-2xl shadow-md  h-[767px] p-4 overflow-y-auto">
      <img
        src={profileData.avatar}
        alt="Avatar"
        className="w-20 h-20 rounded-full object-cover border-2 border-[#b05af7] mt-4"
      />
      <div>
        <h2 className="text-base font-semibold text-gray-900">{profileData.name}</h2>
        <p className="text-sm font-semibold text-gray-500">{profileData.role}</p>
        <p className="text-sm font-semibold text-gray-500">{profileData.email}</p>
      </div>
      <div className="text-center">
        <p className="text-xl font-bold text-blue-500">{profileData.totalHours.toFixed(2)}</p>
        <p className="text-sm font-semibold text-gray-500">Total hours</p>
       
      </div>
      <div className="text-center">
       
        <p className="text-xl font-bold text-blue-500">9:00-18:00</p>
        <p className="text-sm font-semibold text-gray-500">Shift Timing</p>
      </div>
      <div className="text-center">
       
       <p className="text-xl font-bold text-blue-500">Shubham Kumar</p>
       <p className="text-sm font-semibold text-gray-500">Reporting Manager</p>
     </div>
     <div className="text-center">
       
       <p className="text-xl font-bold text-red-500">6</p>
       <p className="text-sm font-semibold text-gray-500">Violations Commited</p>
     </div>
    </div>
  );
}
