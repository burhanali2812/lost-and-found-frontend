import React, { useEffect, useState } from "react";
import notify from "../images/notify.jpg";
import { useNavigate } from "react-router-dom";
import { showToast } from "./Toastify2";
import "./Signup.css";
import { ToastContainer } from "react-toastify";
function Notification({ notification, setNotification }) {
  const [seenStatus, setSeenStatus] = useState({});
  const navigate = useNavigate();

  const userId = localStorage.getItem("userId");
  const handledisplayImage = () => {
    navigate("/displayImages");
  };
  const handleUpdateProfile = ()=>{
    navigate("/profileSetting")
  }

  const getNotifications = async () => {
    try {
      const response = await fetch(
        `https://lost-and-found-backend-xi.vercel.app/auth/get-notifications/${userId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (!response.ok) {
        showToast("error", "Cannot Fetch Notifications", 3000, "top-right");
        return;
      }
      const data = await response.json();
    
      setNotification(data.notifications);
    } catch (error) {
      console.error("Error fetching Notifications:", error);
    }
  };
  useEffect(() => {
    getNotifications();
  }, []);

  const deleteNotification = async (userid) => {
    try {
      const response = await fetch(
        `https://lost-and-found-backend-xi.vercel.app/auth/delete-notifications/${userid}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (!response.ok) {
        showToast("error", "Cannot Delete Notifications", 3000, "top-right");
        return;
      }
      showToast(
        "success",
        "Notification Deleted SuccessFully",
        3000,
        "top-right"
      );
      getNotifications();
    } catch (error) {
      console.error("Error Deleteing Notifications:", error);
    }
  };
  const seenNotification = async (id) => {
    const newStatus = !seenStatus[id]; // toggle
    setSeenStatus((prev) => ({ ...prev, [id]: newStatus }));

    try {
      const response = await fetch(
        `https://lost-and-found-backend-xi.vercel.app/auth/seen-notifications/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ isRead: newStatus }),
        }
      );

      if (!response.ok) {
        showToast("error", "Error marking notification", 3000, "top-right");
        return;
      }

      showToast(
        "success",
        `Notification ${newStatus ? "Seen" : "Unseen"}`,
        3000,
        "top-right"
      );
      getNotifications();
    } catch (error) {
      console.error("Error updating notification status:", error);
    }
  };
const deleteAccount = async () => {
  const confirm = window.confirm("Are you sure to delete account permanently?")
  if(!confirm){
    return
  }
  try {
    const response = await fetch(
      "https://lost-and-found-backend-xi.vercel.app/auth/deleteUser",
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    if (!response.ok) {
      showToast("error", "Error Deleting Account", 3000, "top-right");
      return;
    }

    showToast("success", "Account Deleted Successfully", 3000, "top-right");
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    setTimeout(() => {
      navigate("/login-signup");
    }, 1500);
  } catch (error) {
    console.error("Error Deleting Account:", error);
    showToast("error", "Network error while deleting account", 3000, "top-right");
  }
};


  return (
  <div>
  <ToastContainer />
  <div className="container">
    <h2 className="my-4 mx-3">NOTIFICATIONS</h2>

    {notification && notification.length > 0 ? (
      notification.map((notifications, index) => (
        <div key={notifications._id}>
          <div className="card border-0 w-100 px-3 py-3 mb-0">
            {/* Title and Time */}
            <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-2">
              <h5 className="mb-0 w-100">
                <span
                  style={{ fontSize: 15 }}
                  className={`px-2 py-1 rounded text-white d-inline-block w-100 w-md-auto text-center ${
                    notifications.title === "Request Accepted"
                      ? "bg-success"
                      : notifications.title === "Request Declined"
                      ? "bg-danger"
                      : notifications.title ===
                        "Account Verification Pending – Stay Updated!"
                      ? "bg-warning"
                      : notifications.title ===
                        "Lost Item Request Approved – We Are on It!"
                      ? "bg-success"
                      : notifications.title ===
                        "Lost Item Request Declined – Action Required"
                      ? "bg-danger"
                      : notifications.title ===
                        "Congratulations! We’ve Located Items Similar to Yours"
                      ? "bg-primary"
                      : notifications.title ===
                        "Found Item Request Approved – We Are on It!"
                      ? "bg-success"
                      : ""
                  }`}
                >
                  {notifications.title}
                </span>
              </h5>

              <small className="text-muted">
                <i className="fas fa-clock me-2"></i>
                {new Date(notifications.createdAt).toLocaleString()}
              </small>
            </div>

            {/* Message */}
            <p className="mb-1 mt-3">{notifications.message}</p>

            {/* Buttons */}
            {notifications.title === "Request Declined" ? (
              <div className="d-flex flex-column flex-sm-row justify-content-end align-items-stretch align-items-sm-center gap-2 mt-3">
                <button className="btn btn-outline-primary btn-sm w-100 w-sm-auto" onClick={handleUpdateProfile}>
                  <i className="fas fa-user-edit me-2"></i>
                  Update Profile & Resubmit
                </button>

                <button
                  className="btn btn-outline-danger btn-sm w-100 w-sm-auto"
                  onClick={deleteAccount}
                >
                  <i className="fas fa-user-times me-2"></i>
                  Delete Account & Start Over
                </button>
              </div>
            ) : notifications.title ===
              "Congratulations! We’ve Located Items Similar to Yours" ? (
              <div className="d-flex flex-column flex-sm-row justify-content-end align-items-stretch align-items-sm-center gap-2 mt-3">
                <button
                  className={`btn btn-sm w-100 w-sm-auto ${
                    seenStatus[notifications._id]
                      ? "btn-success"
                      : "btn-outline-success"
                  }`}
                  title={
                    seenStatus[notifications._id]
                      ? "Mark as Unseen"
                      : "Mark as Read"
                  }
                  onClick={() => seenNotification(notifications._id)}
                >
                  <i className="fas fa-eye"></i>
                </button>

                <button
                  className="btn btn-outline-primary w-100 w-sm-auto"
                  onClick={handledisplayImage}
                >
                  View Matched Items{" "}
                  <i className="fas fa-angle-double-right sliding-icon"></i>
                </button>
              </div>
            ) : (
              <div className="d-flex flex-column flex-sm-row justify-content-end align-items-stretch align-items-sm-center gap-2 mt-3">
                <button
                  className="btn btn-outline-danger btn-sm w-100 w-sm-auto"
                  title="Delete"
                  onClick={() => deleteNotification(notifications._id)}
                >
                  <i className="fas fa-trash-alt"></i>
                </button>
                <button
                  className={`btn btn-sm w-100 w-sm-auto ${
                    seenStatus[notifications._id]
                      ? "btn-success"
                      : "btn-outline-success"
                  }`}
                  title={
                    seenStatus[notifications._id]
                      ? "Mark as Unseen"
                      : "Mark as Read"
                  }
                  onClick={() => seenNotification(notifications._id)}
                >
                  <i className="fas fa-eye"></i>
                </button>
              </div>
            )}
          </div>

          {/* Divider */}
          {index !== notification.length - 1 && <hr className="my-1 mx-3" />}
        </div>
      ))
    ) : (
      <div className="d-flex justify-content-center mt-5">
        <img
          src={notify}
          alt="Notification"
          className="img-fluid"
          style={{ width: "80%", maxWidth: "300px" }}
        />
      </div>
    )}
  </div>
</div>

  );
}

export default Notification;
