import { useEffect} from 'react'
import { useNavigate } from "react-router-dom";

const useAuth = () => {
   
    const navigate = useNavigate();

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (!storedToken) {
            return;
        }
        //setToken(storedToken);

        try {
            const decoded = JSON.parse(atob(storedToken.split(".")[1]));
            console.log("Decoded Token:", decoded);

            if (decoded.exp * 1000 < Date.now()) {
                localStorage.removeItem("token");
                alert("Login Expired, Please Login Again");
                navigate("/login-signup");
            }
        } catch (error) {
            console.error("Invalid token:", error);
            localStorage.removeItem("token");
            navigate("/login-signup");
        }
    }, [navigate])
}

export default useAuth
