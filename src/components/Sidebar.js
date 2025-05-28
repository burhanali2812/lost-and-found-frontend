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
  const [profilePicture, setProfilePicture] = useState(null);
  const [userData, setUserData] = useState(null);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const userId = localStorage.getItem("userId");
  const userName = localStorage.getItem("userName");
  const unreadCount = notification.filter((n) => !n.isRead).length;

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

        if (!response.ok) {
          return;
        }

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
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    showToast("success", "LogOut Successfully!", 3000);
    setTimeout(() => {
      navigate("/login-signup");
    }, 1300);
  };

  const toggleMobileMenu = () => setShowMobileMenu(!showMobileMenu);

  const NavLinkItem = ({ to, icon, text, badgeCount, onClick }) => (
    <Link
      to={to}
      className="nav-link text-white d-flex align-items-center py-2 px-3"
      onClick={onClick}
    >
      <i className={`${icon} me-3`} style={{ width: "24px", textAlign: "center" }}></i>
      <span className="me-auto">{text}</span>
      {badgeCount > 0 && <span className="badge bg-danger ms-2">{badgeCount}</span>}
    </Link>
  );

  const renderNavLinks = () => (
    <>
      {userData?.role === "admin" && (
        <NavLinkItem
          to="/dashboard"
          icon="fas fa-home"
          text="Dashboard"
          onClick={() => setShowMobileMenu(false)}
        />
      )}

      {userData?.role === "user" && (
        <NavLinkItem
          to="/notification"
          icon="fas fa-bell"
          text="Notifications"
          badgeCount={unreadCount}
          onClick={() => setShowMobileMenu(false)}
        />
      )}

      {userData?.role === "admin" && (
        <>
          <NavLinkItem
            to="/user-verification"
            icon="fas fa-user-check"
            text="User Verification"
            badgeCount={user?.length || 0}
            onClick={() => setShowMobileMenu(false)}
          />

          <NavLinkItem
            to="/lostItemsRequest"
            icon="fas fa-search-location"
            text="Lost Item Requests"
            badgeCount={lostItems?.length || 0}
            onClick={() => setShowMobileMenu(false)}
          />

          <NavLinkItem
            to="/foundItemsRequest"
            icon="fas fa-check-circle"
            text="Found Item Claims"
            badgeCount={foundItems?.length || 0}
            onClick={() => setShowMobileMenu(false)}
          />
        </>
      )}

      {userData?.isVerified === "accepted" && (
        <>
          <NavLinkItem
            to="/reportLostItems"
            icon="fa-solid fa-magnifying-glass"
            text="Report Lost Items"
            onClick={() => setShowMobileMenu(false)}
          />

          <NavLinkItem
            to="/reportFoundItems"
            icon="fa-solid fa-clipboard-list"
            text="Report Found Items"
            onClick={() => setShowMobileMenu(false)}
          />

          <NavLinkItem
            to="/displaySavedItems"
            icon="fa-solid fa-bookmark"
            text="Saved Items"
            badgeCount={savedItem?.length || 0}
            onClick={() => setShowMobileMenu(false)}
          />
        </>
      )}

      <NavLinkItem
        to="/notification"
        icon="fa-solid fa-user-cog"
        text="Profile Setting"
        onClick={() => setShowMobileMenu(false)}
      />

      <div
        className="nav-link text-white d-flex align-items-center py-2 px-3"
        onClick={() => {
          setShowMobileMenu(false);
          handleToast();
        }}
        style={{ cursor: "pointer" }}
      >
        <i className="fa-solid fa-right-from-bracket me-3" style={{ width: "24px", textAlign: "center" }}></i>
        <span>LogOut</span>
      </div>
    </>
  );

  return (
    <>
      {/* Bootstrap Navbar */}
      <nav className="navbar navbar-expand-md navbar-dark bg-dark fixed-top">
        <div className="container-fluid">
          <Link className="navbar-brand" to="#">
            <i className="fa-solid fa-clipboard-list me-2"></i>
            LOST & FOUND
          </Link>
          
          <button
            className="navbar-toggler"
            type="button"
            onClick={toggleMobileMenu}
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          
          <div className={`collapse navbar-collapse ${showMobileMenu ? 'show' : ''}`}>
            <div className="offcanvas offcanvas-start bg-dark text-white" tabIndex="-1" id="offcanvasNavbar">
              <div className="offcanvas-header">
                <h5 className="offcanvas-title" id="offcanvasNavbarLabel">
                  <div className="d-flex flex-column align-items-center w-100">
                    {profilePicture ? (
                      <img
                        src={profilePicture}
                        alt="Profile"
                        className="rounded"
                        style={{
                          width: "85px",
                          height: "100px",
                          objectFit: "cover",
                          marginBottom: "10px",
                        }}
                      />
                    ) : (
                      <i className="fa-solid fa-user-circle fa-5x text-secondary mb-2"></i>
                    )}
                    <h5 className="mb-1">{userName || "Loading..."}</h5>
                    <span
                      className="badge"
                      style={{
                        backgroundColor:
                          userData?.isVerified === "accepted"
                            ? "#28a745"
                            : "#dc3545",
                        color: "white",
                      }}
                    >
                      {userData?.role === "admin" && (
                        <>
                          <i className="fas fa-user-shield me-1"></i>Admin{" | "}
                        </>
                      )}
                      {userData?.isVerified === "accepted" ? (
                        <>
                          <i className="fas fa-check-circle me-1"></i>Verified
                        </>
                      ) : (
                        "Not Verified"
                      )}
                    </span>
                  </div>
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setShowMobileMenu(false)}
                  aria-label="Close"
                ></button>
              </div>
              <div className="offcanvas-body">
                <div className="navbar-nav">
                  {renderNavLinks()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container-fluid mt-5 pt-4">
        {children}
      </div>
    </>
  );
}

export default Sidebar;