import React, { Fragment, useEffect, useState } from 'react';
import useUserStore from '../../stores/userStore';
import axios from 'axios';

export default function TripManagement() {
    const [trips, setTrips] = useState([]);
    const [expandedPlaces, setExpandedPlaces] = useState(null);
    const { token } = useUserStore(state => state);

    useEffect(() => {
        getTrips();
    }, []);

    const getTrips = async () => {
        try {
            const result = await axios.get('http://localhost:8080/admin/trips', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setTrips(result.data.trips);
        } catch (error) {
            console.log(error);
        }
    };

    const togglePlaces = (index) => {
        setExpandedPlaces(expandedPlaces === index ? null : index);
    };

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Manage Trips</h1>
            <table className="min-w-full bg-white shadow-md rounded-lg text-center text-sm">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="py-2 px-3">Trip Name</th>
                        <th className="py-2 px-3">Days</th>
                        <th className="py-2 px-3">Created By</th>
                        <th className="py-2 px-3">Destination</th>
                        <th className="py-2 px-3">Places</th>
                        <th className="py-2 px-3">Start Date - End Date</th>
                    </tr>
                </thead>
                <tbody>
                    {trips.map((item, index) => (
                        <Fragment key={index}>
                            <tr className="border-t">
                                <td className="py-2 px-3">{item.name}</td>
                                <td className="py-2 px-3">{item.days}</td>
                                <td className="py-2 px-3">{item.user}</td>
                                <td className="py-2 px-3">{item.destination}</td>
                                <td 
                                    className="py-2 px-3 max-w-[150px] truncate cursor-pointer"
                                    onClick={() => togglePlaces(index)}
                                >
                                    {item.places}
                                </td>
                                <td className="py-2 px-3">
                                    {new Date(item.startDate).toLocaleDateString()} - {new Date(item.endDate).toLocaleDateString()}
                                </td>
                            </tr>
                            {expandedPlaces === index && (
                                <tr>
                                    <td colSpan="6" className="py-2 px-3 text-left">
                                        <div className="bg-gray-200 p-2 rounded">
                                            <strong>Places List:</strong> {item.places}
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </Fragment>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
