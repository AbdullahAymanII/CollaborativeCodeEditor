import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Loading from "./pages/app/Loading";
import Login from "./pages/loginForm/Login";
import Home from "./pages/home/Home";
import CreateRoom from "./pages/createRoom/CreateRoom";
import JoinRoom from "./pages/joinRoom/JoinRoom";
import CodingPage from "./pages/codingRoom/CodingPage";
import OAuth2RedirectHandler from "./pages/app/OAuth2RedirectHandler";
import NotFound from "./pages/app/NotFound";
import EditRoom from "./pages/editRoom/EditRoom";
import RoomDetailsDashboard from "./pages/editRoom/RoomDetailsDashboard";
import LandingPage from "./pages/LandingPage/LandingPage";

function App() {
    const [loading, setLoading] = useState(true);
    const location = useLocation();
    const [user, setUser] = useState(null);
    const [room, setRoom] = useState({ roomId: "", roomName: "" });

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) return;
                const response = await fetch('http://localhost:8080/api/user/info', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (!response.ok) throw new Error('Failed to fetch user');
                const userData = await response.json();
                setUser(userData);
            } catch (error) {
                console.error('Error fetching user:', error);
            }
        };
        fetchUser();
    }, []);

    useEffect(() => {
        setLoading(true);
        const timeout = setTimeout(() => setLoading(false), 1000);
        return () => clearTimeout(timeout);
    }, [location.pathname]);

    return (
        <div className="App">
            <AnimatePresence mode="wait">
                {loading && <Loading />}
            </AnimatePresence>

            {!loading && (
                <AnimatePresence mode="wait">
                    <Routes location={location} key={location.pathname}>LandingPage
                        <Route path="/" element={<LandingPage />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/home" element={<Home user={user} />} />
                        <Route path="/create-room" element={<CreateRoom user={user} room={room}/>} />
                        <Route path="/join-room" element={<JoinRoom />} />
                        <Route path="/join-room/:roomId/:roleClick" element={<CodingPage />} />
                        <Route path="/edit-room" element={<EditRoom />} />
                        <Route path="/edit-room/room/:roomId" element={<RoomDetailsDashboard />} />
                        <Route path="/oauth2/redirect" element={<OAuth2RedirectHandler />} />
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </AnimatePresence>
            )}
        </div>
    );
}

export default function AppWrapper() {
    return (
        <Router>
            <App />
        </Router>
    );
}
