import React, { useEffect, useState } from "react";
import useUserStore from "../../stores/userStore";
import axios from "axios";

export default function PlaceManagement() {
  const [places, setPlaces] = useState([]);
  const [categories, setCategories] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    categoryId: "",
    destinationId: "",
    description: "",
    placeImage: "",
    lat: "",
    lng: "",
  });
  const [showModal, setShowModal] = useState(false);
  const { token } = useUserStore((state) => state);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedDestination, setSelectedDestination] = useState("");

  useEffect(() => {
    getPlaces();
    getCategories();
    getDestinations();
  }, []);

  const getPlaces = async () => {
    try {
      const result = await axios.get("http://localhost:8080/admin/places", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPlaces(result.data.places);
    } catch (error) {
      console.log(error);
    }
  };

  const getCategories = async () => {
    try {
      const result = await axios.get("http://localhost:8080/admin/categories", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCategories(result.data.categories);
    } catch (error) {
      console.log(error);
    }
  };

  const getDestinations = async () => {
    try {
      const result = await axios.get(
        "http://localhost:8080/admin/destinations",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setDestinations(result.data.destinations);
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "placeImage") {
      setFile(e.target.files[0]);
      setPreview(URL.createObjectURL(e.target.files[0]));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleAddOrUpdatePlace = async () => {
    const data = new FormData();
    setLoading(true);
    data.append("name", formData.name);
    data.append("description", formData.description);
    data.append("categoryId", formData.categoryId);
    data.append("destinationId", formData.destinationId);
    data.append("lat", formData.lat);
    data.append("lng", formData.lng);

    if (file) {
      data.append("placeImage", file);
    }

    try {
      if (selectedPlace) {
        await axios.put(
          `http://localhost:8080/admin/places/${selectedPlace.id}`,
          data,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
      } else {
        await axios.post("http://localhost:8080/admin/places", data, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
      }
      getPlaces();
      resetForm();
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleEdit = (place) => {
    setSelectedPlace(place);
    setFormData({
      name: place.name,
      categoryId: place.categoryId,
      destinationId: place.destinationId,
      description: place.description,
      placeImage: place.placeImage,
      lat: place.lat,
      lng: place.lng,
    });
    setFile(null);
    setPreview(null);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/admin/places/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      getPlaces();
    } catch (error) {
      console.log(error);
    }
  };

  const resetForm = () => {
    setSelectedPlace(null);
    setFormData({
      name: "",
      categoryId: "",
      destinationId: "",
      description: "",
      placeImage: "",
      lat: "",
      lng: "",
    });
    setFile(null);
    setPreview(null);
    setShowModal(false);
  };
  const filteredPlaces = places.filter((place) => {
    const matchesCategory = selectedCategory
      ? place.categoryId.toString() === selectedCategory.toString()
      : true;
    const matchesDestination = selectedDestination
      ? place.destinationId.toString() === selectedDestination.toString()
      : true;
    console.log("Place:", place);
    console.log("Matches Category:", matchesCategory);
    console.log("Matches Destination:", matchesDestination);
    return matchesCategory && matchesDestination;
  });

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Manage Places</h1>
      <div className="flex gap-4">
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="border rounded p-2 mb-4"
        >
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>

        <select
          value={selectedDestination}
          onChange={(e) => setSelectedDestination(e.target.value)}
          className="border rounded p-2 mb-4"
        >
          <option value="">All Destinations</option>
          {destinations.map((destination) => (
            <option key={destination.id} value={destination.id}>
              {destination.name}
            </option>
          ))}
        </select>

        <button
          className="bg-blue-500 text-white py-2 px-4 mb-4 rounded"
          onClick={() => {
            resetForm();
            setFile(null);
            setPreview(null);
            setShowModal(true);
          }}
        >
          Add New Place
        </button>
      </div>


      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg text-sm text-center">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-3 ">Place Name</th>
              <th className="py-2 px-3 ">Category</th>
              <th className="py-2 px-3 ">Destination</th>
              <th className="py-2 px-3 ">Description</th>
              <th className="py-2 px-3 ">Image</th>
              <th className="py-2 px-3 ">Latitude</th>
              <th className="py-2 px-3 ">Longitude</th>
              <th className="py-2 px-3 ">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPlaces.map((item, index) => (
              <tr key={index} className="border-t">
                <td className="py-2 px-3">{item.name}</td>
                <td className="py-2 px-3">
                  {
                    categories.find(
                      (category) => category.id === item.categoryId
                    )?.name
                  }
                </td>
                <td className="py-2 px-3">
                  {
                    destinations.find(
                      (destination) => destination.id === item.destinationId
                    )?.name
                  }
                </td>

                <td className="py-2 px-3 max-w-[200px] truncate overflow-hidden">
                  {item.description}
                </td>
                <td className="py-2 px-3 max-w-[150px] truncate">
                  {item.placeImage}
                </td>
                <td className="py-2 px-3 max-w-[100px] truncate">{item.lat}</td>
                <td className="py-2 px-3 max-w-[100px] truncate">{item.lng}</td>
                <td className="py-2 px-3">
                  <div className="flex justify-center">
                    <button
                      className="bg-yellow-500 text-white py-1 px-3 mr-2 rounded"
                      onClick={() => handleEdit(item)}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-500 text-white py-1 px-3 rounded"
                      onClick={() => handleDelete(item.id)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded shadow-lg max-h-[80vh] w-full max-w-2xl overflow-y-auto">
            <h2 className="text-2xl mb-4">
              {selectedPlace ? "Edit Place" : "Add New Place"}
            </h2>
            <input
              type="text"
              name="name"
              placeholder="Place Name"
              value={formData.name}
              onChange={handleChange}
              className="border rounded p-2 mb-2 w-full"
            />
            <select
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
              className="border rounded p-2 mb-2 w-full"
            >
              <option value="">Select Category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            <select
              name="destinationId"
              value={formData.destinationId}
              onChange={handleChange}
              className="border rounded p-2 mb-2 w-full"
            >
              <option value="">Select Destination</option>
              {destinations.map((destination) => (
                <option key={destination.id} value={destination.id}>
                  {destination.name}
                </option>
              ))}
            </select>
            <textarea
              name="description"
              placeholder="Description"
              value={formData.description}
              onChange={handleChange}
              className="border rounded p-2 mb-2 w-full h-32 overflow-y-auto"
            />
            <input
              type="file"
              name="placeImage"
              onChange={handleChange}
              className="border rounded p-2 mb-2 w-full"
            />
            {preview && (
              <div className="mb-4">
                <img
                  src={preview}
                  alt="Preview"
                  className="w-[350px] rounded"
                />
              </div>
            )}
            <input
              type="text"
              name="lat"
              placeholder="Latitude"
              value={formData.lat}
              onChange={handleChange}
              className="border rounded p-2 mb-2 w-full"
            />
            <input
              type="text"
              name="lng"
              placeholder="Longitude"
              value={formData.lng}
              onChange={handleChange}
              className="border rounded p-2 mb-2 w-full"
            />
            <button
              className="bg-blue-500 text-white py-2 px-4 rounded"
              onClick={handleAddOrUpdatePlace}
            >
              {selectedPlace ? "Update Place" : "Add Place"}
            </button>
            <button
              className="bg-red-500 text-white py-2 px-4 rounded ml-2"
              onClick={resetForm}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
