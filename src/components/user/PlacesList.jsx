import React, { useEffect, useState } from 'react';
import PlaceCard from './PlaceCard';
import { getCategories } from '../../api/getData-api';

const PlacesList = ({ places = [], addPlace, selectedPlaces, setSelectedCategory }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const result = await getCategories();
        setCategories(result); 
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError('Could not fetch categories.');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }
  const handleCategoryClick = (categoryId) => {
    setActiveCategory(categoryId); 
    setSelectedCategory(categoryId); 
  };

  return (
    <div className="bg-white border-2 border-amber-400 p-4 rounded-lg ">
      <h2 className="text-lg font-bold mb-4 text-gray-900">Recommend</h2>

      <div className="flex space-x-2 mb-4">
        <button
          className={`px-2 py-1 text-sm rounded-full border ${activeCategory === null ? 'bg-amber-400 text-white' : 'bg-gray-300 text-gray-900 hover:bg-gray-200 transition-all'}`}
          onClick={() => handleCategoryClick(null)}
        >
          All
        </button>
        {categories.map((category) => (
          <button
            key={category.id}
            className={`px-2 py-1 text-sm rounded-full border ${activeCategory === category.id ? 'bg-amber-400 text-white' : 'bg-gray-300 text-gray-900 hover:bg-gray-200 transition-all'}`}
            onClick={() => handleCategoryClick(category.id)}
          >
            {category.name}
          </button>
        ))}
      </div>

      {places.length === 0 ? (
        <p>No places found.</p>
      ) : (
        places.map((place) => (
          <PlaceCard
            key={place.id}
            place={place}
            onAdd={() => addPlace(place)}
            isSelected={selectedPlaces.some((p) => p.id === place.id)}
          />
        ))
      )}
    </div>
  );
};

export default PlacesList;


