import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const OAuth2RedirectHandler = () => {
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);

        const token = searchParams.get("token");
        console.log("----------------8988888888888888");
        console.log(token);
        console.log("----------------8988888888888888");
        if (token) {
            localStorage.setItem("token", token);
            navigate("/home");
        } else {
            navigate("/login");
        }
    }, [location, navigate]);

    return <div>Redirecting...</div>;
};

export default OAuth2RedirectHandler;
