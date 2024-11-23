import React from 'react'
import { useNavigate } from 'react-router-dom';


const Unauthorization = () => {
  const navigate = useNavigate();

  const handleOnClick = () => {
    navigate('/'); 
  };
  return (
    <div>
      <div className="flex flex-col items-center justify-center w-screen h-[91vh]">
        <img className='w-[30rem] h-[30rem]'
          src="https://i.imgur.com/Me67S4K.png" alt="401" />
        <button
          onClick={handleOnClick}
          className="px-4 py-2 bg-[#22A094] text-white rounded hover:bg-[#22a093ae]"
        >
          Go to Login
        </button>
      </div>
    </div>
  );
};

export default Unauthorization