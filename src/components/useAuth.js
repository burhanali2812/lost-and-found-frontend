import { useEffect} from 'react'
import { useNavigate } from "react-router-dom";
import { showToast } from "./Toastify2";
import { ToastContainer } from "react-toastify";
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
   

            if (decoded.exp * 1000 < Date.now()) {
                localStorage.removeItem("token");
                   showToast(
                          "error",
                          "Login Expired, Please Login Again",
                          3000,
                          "top-right"
                        );
              
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
