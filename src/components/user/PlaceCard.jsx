import React, { useEffect, useState } from 'react';

const PlaceCard = ({ place, onAdd, isSelected }) => {
  
  const handleAdd = () => {
    onAdd();
  };

  return (
    <div className="border-2 rounded-lg p-4 mb-4 border-amber-400 bg-white">
      <div className='flex items-center gap-4 p-2'>
        {place.placeImage && (
          <img
            src={place.placeImage}
            alt={place.name}
            className="w-20 h-20 object-cover rounded-lg shadow-sm"
          />
        )}
        <div className="flex-1">
          <h3 className="font-bold text-gray-800">{place.name}</h3>
          <p className='text-zinc-600 text-sm max-h-16 overflow-y-auto my-2'>{place.description}</p>
          <div className="flex justify-end">
            <button 
              onClick={handleAdd} 
              className={`mt-2 text-white px-4 py-1 rounded ${isSelected ? 'bg-gray-400 cursor-not-allowed' : 'bg-yellow-400 hover:bg-amber-400'}`} 
              disabled={isSelected}
            >
              {isSelected ? 'Added' : 'Add'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceCard;
