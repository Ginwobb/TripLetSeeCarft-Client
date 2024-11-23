import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

const useTripStore = create(persist(
  (set) => ({
    finalDest: [],
    selectedDest: '',
    startDate: '',
    endDate: '',
    numOfDays: 0,
    days: [],
    selectedPlaces: [],
    tripName: '',
    numberOfPeople: 1,

    resetTrip: () => set(() => ({
      finalDest: [],
      selectedDest: '',
      startDate: '',
      endDate: '',
      numOfDays: 0,
      days: [],
      selectedPlaces: [],
      tripName: '',
      numberOfPeople: 1,
    })),

    setFinalDest: (destinations) => set({ finalDest: destinations }),
    setSelectedDest: (dest) => set({ selectedDest: dest }),
    setStartDate: (date) => set({ startDate: date }),
    setEndDate: (date) => set({ endDate: date }),

    setTrip: (destination, numOfDays) => set(() => {
      const days = Array.from({ length: numOfDays }, () => ({ places: [] }));
      return { selectedDest: destination, numOfDays, days };
    }),

    addSelectedPlace: (place) => set((state) => {
      if (!state.selectedPlaces.some(p => p.id === place.id)) {
        return { selectedPlaces: [...state.selectedPlaces, place] };
      }
      return state;
    }),
    
    removeSelectedPlace: (id) => set((state) => ({
      selectedPlaces: state.selectedPlaces.filter(place => place.id !== id)
    })),

    setDays: (days) => {
      if (Array.isArray(days)) {
        set({ days });
      } else {
        console.error("Expected 'days' to be an array but received:", days);
      }
    },

    addPlaceToDay: (dayIndex, place) => set((state) => {
      if (Array.isArray(state.days) && dayIndex >= 0 && dayIndex < state.days.length) {
        const updatedDays = [...state.days];
        updatedDays[dayIndex].places.push(place);
        return { days: updatedDays };
      } else {
        console.error("Invalid days array or dayIndex:", state.days, dayIndex);
        return state;
      }
    }),
    
    removePlaceFromDay: (id, dayIndex) => set((state) => {
      const updatedDays = [...state.days];
      if (Array.isArray(updatedDays) && updatedDays[dayIndex]) {
        updatedDays[dayIndex].places = updatedDays[dayIndex].places.filter(place => place.id !== id);
      }
      return { days: updatedDays };
    }),

    setTripName: (name) => set({ tripName: name }), 
    setNumberOfPeople: (number) => set({ numberOfPeople: number }), 
  }),
  { name: "trip-storage" ,
    storage:createJSONStorage (() => localStorage)
  }
));

export default useTripStore;