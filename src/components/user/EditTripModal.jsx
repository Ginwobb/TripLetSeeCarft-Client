import React, { useState } from 'react';
import axios from 'axios';

const EditTripModal = ({ isOpen, onClose, tripId, tripName, tripPeople, onTripUpdated }) => {
  const [name, setName] = useState(tripName || '');
  const [people, setPeople] = useState(tripPeople || 1);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `http://localhost:8080/trips/${tripId}`,
        {
          name,
          people: parseInt(people, 10), 
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    
      onTripUpdated(response.data.trip);
      onClose();
    } catch (error) {
      console.error('Error updating trip:', error);
    } finally {
      setLoading(false);
    }
  };
  

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-4">Edit Trip</h2>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Trip Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border rounded-lg"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Number of People</label>
          <input
            type="number"
            value={people}
            onChange={(e) => setPeople(e.target.value)}
            className="w-full p-2 border rounded-lg"
            min="1"
          />
        </div>

        <div className="flex justify-end space-x-4">
          <button onClick={onClose} className="bg-gray-300 text-black p-2 rounded-lg">
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="bg-blue-500 text-white p-2 rounded-lg"
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditTripModal;
