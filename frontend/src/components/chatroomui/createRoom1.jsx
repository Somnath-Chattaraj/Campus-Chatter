import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useUser } from '../../hook/useUser';

const Createroom1 = () => {
    const [users, setUsers] = useState([]);
    const {loading, userDetails} = useUser();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('/user/all', {
                    withCredentials: true,
                });
                // Assuming the response data is an array of users
                setUsers(response.data); // Set the users state to the data received
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };

        fetchUsers();
    }, []);
    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h2>Choose from below users to create a Room</h2>
            <div>
                {users.map((user) => {
                    return (
                        (user.user_id !== userDetails.user_id) && <div key={user.user_id}>  {user.user_id} </div>
                    );
                }
                )}
            </div>
        </div>
    );
};

export { Createroom1 };
