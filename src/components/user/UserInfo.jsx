import React from 'react';
import UserAvatar from '../UserAvatar';
import { EditIcon } from '../../icons';

const UserInfo = ({ userInfo, onEdit }) => {
  if (!userInfo) {
    return <p>Loading user info...</p>;
  }

  return (
    <div className="bg-yellow-400 p-6 rounded-lg flex flex-col items-center h-screen my-3 ml-2">
      <h2 className="font-bold text-3xl my-4">Personal Info</h2>
      <UserAvatar 
        className="w-36 h-36 bg-white rounded-full mb-4 hover:scale-105 transition-transform duration-300"
        imgSrc={userInfo.profileImage} />
        <div className="flex gap-2">
        <p className="font-bold text-xl">{userInfo.firstName} {userInfo.lastName}</p>
        <button onClick={onEdit}>
            <EditIcon className="w-5 h-5"/>
        </button>
        </div>
    </div>
  );
};

export default UserInfo;
