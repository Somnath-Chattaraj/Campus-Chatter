import React, { useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import axios from 'axios'; 

const Logout = () => {
    const [loggedOut, setLoggedOut] = React.useState(false);

    useEffect(() => {
        const logout = async () => {
            try {
                await axios.get("/api/logout", { 
                    withCredentials: true,
                });
                setLoggedOut(true); 
            } catch (err) {
                console.error("Error logging out:", err);
            }
        };
        logout();
    }, []);

    if (loggedOut) {
        return <Navigate to="/" />; 
    }

    return null; 
};

export default Logout;
