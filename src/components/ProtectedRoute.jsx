import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import useUserStore from '../stores/userStore';

const ProtectedRoute = ({ element, allowedRoles }) => {
    const user = useUserStore(state => state.user);
    const [isAllowed, setIsAllowed] = useState(null); 

    const checkAuth = () => {
        if (user && user.role) {
            if (allowedRoles.includes(user.role)) {
                setIsAllowed(true);
            } else {
                setIsAllowed(false);
            }
        } else {
            setIsAllowed(false); 
        }
    }

    useEffect(() => {
        checkAuth();
    }, [user]);

    if (isAllowed === null) {
        return (<p>Loading....</p>);
    }

    if (!isAllowed) {
        return <Navigate to="/unauthorization" />;
    }

    return element;
};

export default ProtectedRoute;
