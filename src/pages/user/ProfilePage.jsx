import React, { useEffect, useState } from "react";
import UserInfo from "../../components/user/UserInfo";
import TripCard from "../../components/user/TripCard";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import useTripStore from "../../stores/tripStore";
import useUserStore from "../../stores/userStore"; 
import EditUserForm from "../../components/user/EditUserForm";
import { toast } from "react-toastify";
import { MdAddToPhotos } from "react-icons/md";

const ProfilePage = () => {
  const [trips, setTrips] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const { user, fetchUser, updateUser } = useUserStore(); 
  const [editInput, setEditInput] = useState({
    firstName: user.firstName ||"",
    lastName: user.lastName ||"",
    profileImage: user.profileImage ||"",
  });
  const { resetTrip,startDate,endDate,setStartDate,setEndDate } = useTripStore();
  const navigate = useNavigate();
  const [file, setFile] = useState(null);

  const handleChange = (e) => {
      const { name, value } = e.target;
      if (name === "profileImage") {
          setFile(e.target.files[0]);
      } else {
          setEditInput({ ...editInput, [name]: value });
      }
  };

  const fetchTrips = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get("http://localhost:8080/trips/all", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200) {
        setTrips(response.data.trips);
      } else {
        console.error("Failed to fetch trips:", response.data.message);
      }
    } catch (error) {
      console.error("Error fetching trips:", error);
    }
  };

  const fetchDestinations = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get("http://localhost:8080/destinations/", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200) {
        setDestinations(response.data.destinations);
      } else {
        console.error("Failed to fetch destinations:", response.data.message);
      }
    } catch (error) {
      console.error("Error fetching destinations:", error);
    }
  };

  const handleEditUserInfo = async (e) => {
    e.preventDefault();
   try {
    const data =  new FormData();
    data.append("firstName", editInput.firstName);
    data.append("lastName", editInput.lastName);
    if(file){
        data.append("profileImage", file);
    }
    
    await updateUser(data); 
    setIsEditing(false);
    toast.success("Profile updated successfully");
   } catch (error) {
    console.log(error)
   }
  };
  
  const handleEdit = () =>{
    setIsEditing(true);
  }

  const handleDeleteTrip = (tripId) => {
    setTrips((prevTrips) => prevTrips.filter((trip) => trip.id !== tripId));
  };

  const handleAddTrip = () => {
    resetTrip();
    navigate("/");
  };

  useEffect(() => {
    fetchUser(); 
    fetchTrips();
    fetchDestinations();
  }, []);

  useEffect(() => {
    if (user) {
      setEditInput({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        profileImage: user.profileImage || "",
      });
    }
  }, [user]);

  return (
    <div className="flex">
      <div className="w-1/4 h-full">
        {isEditing ? (
          <EditUserForm
            editInput={editInput}
            setEditInput={setEditInput}
            handleEditUserInfo={handleEditUserInfo}
            setIsEditing={setIsEditing}
            handleChange={handleChange}
          />
        ) : (
          <UserInfo userInfo={user} onEdit={handleEdit} />
        )}
      </div>
      <div className="w-3/4 p-6">
      <div className="mb-6 flex justify-between">
        <h2 className="text-3xl font-bold mb-4">My Trips</h2>
        <button
          onClick={handleAddTrip}
          className="bg-yellow-400 text-white w-28 font-bold px-2 py-2 rounded hover:bg-yellow-500 transition-colors duration-300"
        ><div className="flex items-center gap-2">
          <MdAddToPhotos /> 
          <span>Add New</span>
        </div>
        </button>
      </div>
      <div className="h-[650px] overflow-y-scroll">
        {trips.length > 0 ? (
          trips.map((trip) => {
            const destination =
              destinations.find((dest) => dest.id === trip.destinationId)
                ?.name || "Unknown Destination";
            const startDate = new Date(trip.startDate);
            const endDate = new Date(trip.endDate);
            endDate.setDate(startDate.getDate() + trip.days-1);

            return (
              <div
                key={trip.id}
                onClick={() =>
                  navigate("/user/trip-detail", { state: { tripId: trip.id } })
                }
              >
                <TripCard
                  tripName={trip.name}
                  destination={destination}
                  date={`${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`}
                  people={trip.people}
                  tripId={trip.id}
                  onDelete={handleDeleteTrip}
                />
              </div>
            );
          })
        ) : (
          <p>No trips available</p> 
        )}
        </div>
      </div>
    </div>

  );
};

export default ProfilePage;
