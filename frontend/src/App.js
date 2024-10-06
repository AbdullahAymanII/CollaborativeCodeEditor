import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Loading from "./pages/app/Loading";
import Login from "./pages/loginForm/Login";
import Registration from "./pages/loginForm/Registration";
import Home from "./pages/home/Home";
import CreateRoom from "./pages/createRoom/CreateRoom";
// import CreateProject from "./pages/createRoom/CreateProject";
import AddMembers from "./pages/createRoom/AddMembers";
import JoinRoom from "./pages/joinRoom/JoinRoom";
import CodingPage from "./pages/codingRoom/CodingPage";
import OAuth2RedirectHandler from "./pages/app/OAuth2RedirectHandler";
import NotFound from "./pages/app/NotFound";

function App() {
    const [loading, setLoading] = useState(true);
    const location = useLocation();
    const [user, setUser] = useState(null);
    const [room, setRoom] = useState({ roomId: "", roomName: "" });
    const [project, setProject] = useState({ projectName: '', projectDescription: '' });

    // Fetch user info and set globally
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

    // Handle loading animation during route changes
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
                    <Routes location={location} key={location.pathname}>
                        <Route path="/" element={<Login />} />
                        <Route path="/register" element={<Registration />} />
                        <Route path="/home" element={<Home user={user} />} />
                        <Route path="/create-room" element={<CreateRoom user={user} room={room}/>} />
                        {/*<Route path="/create-project" element={<CreateProject user={user} room={room} projec={project}/>} />*/}
                        <Route path="/add-members" element={<AddMembers user={user} room={room} projec={project}/>} />
                        <Route path="/join-room" element={<JoinRoom />} />
                        <Route path="/join-room/:roomId/:roleClick" element={<CodingPage />} /> {/* New dynamic route for CodingRoom */}
                        {/*<Route path="/join-room/:roomId/VIEWER" element={<ViewerPage />} /> /!* New dynamic route for CodingRoom *!/*/}
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
