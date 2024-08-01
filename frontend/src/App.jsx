import React from 'react';
import { BrowserRouter as Router,Routes, Route } from 'react-router-dom';
import ProfilePage from './components/ProfilePage';
import ChatRoom from './components/ChatRoom';

const App = () => {
  return (
    <Router>
        <Routes>
          <Route path="/profile/:userId" component={ProfilePage} />
          <Route path="/chat/:roomId" component={ChatRoom} />
        </Routes>
    </Router>
  );
};

export default App;
