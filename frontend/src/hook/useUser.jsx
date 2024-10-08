import axios from "axios";
import { useEffect, useState } from "react";

export const useUser = () => {
    const [loading, setLoading] = useState(true);
    const [userDetails, setUserDetails] = useState(null);

    async function getDetails() {
        try {
            const res = await axios.get('/', {
                withCredentials: true,
            });
            setUserDetails(res.data);
            setLoading(false); // Move setLoading inside try block to ensure it's always set
        }
        catch (err) {
            console.log(err);
            setLoading(false); // Set loading to false in case of error
        }
    }

    useEffect(() => {
        getDetails();
    }, []); // Empty dependency array, so it runs only once on component mount

    useEffect(() => {
        if (userDetails) {
            
            // console.log("User details:", userDetails);
        }
    }, [userDetails]); // Log userDetails whenever it changes

    return { loading, userDetails };
};