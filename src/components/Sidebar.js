import React, { useState, useEffect } from "react";
import { showToast } from "./Toastify2";
import { useNavigate, Link } from "react-router-dom";

function Sidebar({
  children,
  user,
  notification,
  lostItems,
  foundItems,
  savedItem,
}) {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [profilePicture, setProfilePicture] = useState(null);
  const [userData, setUserData] = useState(null);

  const userId = localStorage.getItem("userId");
  const userName = localStorage.getItem("userName");
  const unreadCount = notification.filter((n) => !n.isRead).length;

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setShowMobileMenu(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const getProfileImage = async () => {
      try {
        const response = await fetch(
          `https://lost-and-found-backend-xi.vercel.app/auth/getUser/${userId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (!response.ok) return;

        const data = await response.json();
        setProfilePicture(data.user.profileImage);
        setUserData(data.user);
      } catch (error) {
        console.error("Error fetching profile image:", error);
      }
    };

    getProfileImage();
  }, [userId]);

  const handleToast = () => {
    localStorage.clear();
    showToast("success", "LogOut Successfully!", 3000);
    setTimeout(() => navigate("/login-signup"), 1300);
  };

  const toggleSidebar = () => {
    if (isMobile) {
      setShowMobileMenu(!showMobileMenu);
    } else {
      setIsOpen(!isOpen);
    }
  };

  return (
    <div className="d-flex flex-column flex-md-row">
      {/* Toggle button for mobile */}
      {isMobile && (
        <button
          className="btn btn-dark position-fixed m-2"
          onClick={toggleSidebar}
          style={{ zIndex: 1050 }}
        >
          <i className="fas fa-bars"></i>
        </button>
      )}

      {/* Sidebar */}
      <div
        className={`bg-dark text-white p-3 d-flex flex-column position-fixed ${
          isMobile
            ? showMobileMenu
              ? "start-0"
              : "d-none"
            : isOpen
            ? "sidebar-open"
            : "sidebar-collapsed"
        }`}
        style={{
          minHeight: "100vh",
          width: isMobile ? "250px" : isOpen ? "250px" : "70px",
          zIndex: 1040,
          transition: "all 0.3s ease",
        }}
      >
        {/* Logo */}
        <h5 className="text-center fw-bold mb-4">
          <i className="fa-solid fa-clipboard-list me-2"></i>
          {(!isMobile || showMobileMenu) && "Lost & Found"}
        </h5>

        {/* Profile */}
        {userData && (
          <div className="text-center mb-3">
            {profilePicture ? (
              <img
                src={profilePicture}
                alt="Profile"
                className="rounded"
                style={{ width: "85px", height: "100px", objectFit: "cover" }}
              />
            ) : (
              <i className="fa-solid fa-user-circle fa-4x text-secondary mb-2"></i>
            )}
            <h6 className="mb-1 mt-2">{userName || "Loading..."}</h6>
            <span
              className="badge"
              style={{
                backgroundColor:
                  userData.isVerified === "accepted" ? "#28a745" : "#dc3545",
              }}
            >
              {userData.role === "admin" && (
                <>
                  <i className="fas fa-user-shield"></i> Admin |{" "}
                </>
              )}
              {userData.isVerified === "accepted" ? "Verified" : "Not Verified"}
            </span>
          </div>
        )}

        {/* Navigation */}
        <ul className="nav nav-pills flex-column mb-auto">
          {userData?.role === "admin" && (
            <>
              <NavItem icon="fas fa-home" to="/dashboard" label="Dashboard" />
              <NavItem
                icon="fas fa-user-check"
                to="/user-verification"
                label="User Verification"
                badge={user?.length}
              />
              <NavItem
                icon="fas fa-search-location"
                to="/lostItemsRequest"
                label="Lost Item Requests"
                badge={lostItems?.length}
              />
              <NavItem
                icon="fas fa-check-circle"
                to="/foundItemsRequest"
                label="Found Item Claims"
                badge={foundItems?.length}
              />
            </>
          )}
          {userData?.role === "user" && (
            <>
              <NavItem
                icon="fas fa-bell"
                to="/notification"
                label="Notifications"
                badge={unreadCount}
              />
            </>
          )}
          {userData?.isVerified === "accepted" && (
            <>
              <NavItem
                icon="fa-solid fa-magnifying-glass"
                to="/reportLostItems"
                label="Report Lost Items"
              />
              <NavItem
                icon="fa-solid fa-clipboard-list"
                to="/reportFoundItems"
                label="Report Found Items"
              />
            </>
          )}
          <li className="nav-item mt-3">
            <button onClick={handleToast} className="btn btn-danger w-100">
              <i className="fas fa-sign-out-alt me-2"></i>Logout
            </button>
          </li>
        </ul>
      </div>

      {/* Main Content Area */}
      <div
        className="flex-grow-1"
        style={{
          marginLeft: isMobile
            ? "0"
            : isOpen
            ? "250px"
            : "70px",
          transition: "margin-left 0.3s ease",
          padding: "1rem",
          width: "100%",
        }}
      >
        {children}
      </div>
    </div>
  );
}

function NavItem({ icon, to, label, badge }) {
  return (
    <li className="nav-item">
      <Link to={to} className="nav-link text-white d-flex justify-content-between align-items-center">
        <span>
          <i className={`${icon}`}></i> <span className="ms-2">{label}</span>
        </span>
        {badge > 0 && <span className="badge bg-danger">{badge}</span>}
      </Link>
    </li>
  );
}

export default Sidebar;
