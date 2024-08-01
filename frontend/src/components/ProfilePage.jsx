import React from 'react';
import { useParams } from 'react-router-dom';
import useHistory, {Link} from 'use-history'
import axios from 'axios';

const ProfilePage = () => {
  const { userId } = useParams(); // The ID of the user whose profile is being viewed
  const history = useHistory();
  const [profile, setProfile] = React.useState(null);
  const currentUserId = 'current_user_id'; // Replace with actual current user ID

  React.useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`/api/users/${userId}`);
        setProfile(response.data);
      } catch (error) {
        console.error('Failed to fetch profile', error);
      }
    };

    fetchProfile();
  }, [userId]);

  const handleMessageClick = async () => {
    try {
      // Create or get existing chat room
      const response = await axios.post('/api/chat/createOrJoinRoom', { userId: currentUserId, targetUserId: userId });
      const roomId = response.data.roomId;
      history.push(`/chat/${roomId}`);
    } catch (error) {
      console.error('Failed to create or join chat room', error);
    }
  };

  if (!profile) return <div>Loading...</div>;

  return (
    <div>
      <h1>{profile.name}</h1>
      <p>{profile.email}</p>
      <button onClick={handleMessageClick}>Message</button>
    </div>
  );
};

export default ProfilePage;
