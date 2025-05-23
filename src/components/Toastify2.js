import { toast } from "react-toastify";

const allowedTypes = ["info", "success", "warning", "error", "default"];

export const showToast = (type, message, time = 3000, position) => {
  if (!allowedTypes.includes(type)) type = "default";
  toast[type](message, {
    position: position,
    autoClose: time,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: "light",
  });
};

