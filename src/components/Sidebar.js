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
  //const role = localStorage.getItem('role');
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

  const toggleSidebar = () => {
    if (isMobile) {
      setShowMobileMenu(!showMobileMenu);
    } else {
      setIsOpen(!isOpen);
    }
  };

  return (
    <div className="d-flex vh-100">
      {isMobile && (
        <button
          className="btn btn-dark position-fixed m-2"
          style={{ zIndex: 1000 }}
          onClick={toggleSidebar}
        >
          <i className="fas fa-bars"></i>
        </button>
      )}

      {/* Sidebar */}
      <div
        className={`sidebar text-white d-flex flex-column p-3 ${
          isOpen ? "sidebar-open" : "sidebar-collapsed"
        } ${
          isMobile
            ? showMobileMenu
              ? "mobile-sidebar-open"
              : "mobile-sidebar-closed"
            : ""
        }`}
        style={{
          position: "fixed",
          height: "100vh",
          backgroundImage: "linear-gradient(45deg, #0f2027, #203a43, #2c5364)",
          zIndex: 999,
        }}
      >
        {/* Logo */}
        <h4 className="text-center mt-4 fw-bold text-white">
          <i className="fa-solid fa-magnifying-glass-location me-2"></i>
          {!isMobile || showMobileMenu ? "LOST & FOUND HUB" : ""}
        </h4>

        {(isOpen || isMobile) && (
          <div className="d-flex align-items-center justify-content-center gap-2 mb-3">
            <div style={{ textAlign: "center" }}>
              {profilePicture ? (
                <img
                  src={profilePicture}
                  alt="Profile"
                  style={{
                    width: "85px",
                    height: "100px",
                    objectFit: "cover",
                    borderRadius: "10px",
                    marginBottom: "10px",
                    marginTop: "15px",
                  }}
                />
              ) : (
                <i
                  className="fa-solid fa-user-circle fa-5x text-secondary"
                  style={{ marginBottom: "10px" }}
                ></i>
              )}
              {(!isMobile || showMobileMenu) && (
                <>
                  <div className="text-center">
                    <h4 className="mb-1">{userName || "Loading..."}</h4>
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
                          <i className="fas fa-user-shield "></i> Admin {" | "}
                        </>
                      )}
                      {userData?.isVerified === "accepted" ? (
                        <>
                          <i className="fas fa-check-circle "></i> Verified
                        </>
                      ) : (
                        "Not Verified"
                      )}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Navigation Links */}
        <div className="my-3">
          <ul className="nav flex-column">
            {userData && userData.role === "admin" ? (
              <li className="nav-item">
                <Link
                  to="/dashboard"
                  className="nav-link text-white"
                  onClick={() => isMobile && setShowMobileMenu(false)}
                >
                  <i className="fas fa-home"></i>{" "}
                  {(!isMobile || showMobileMenu) && (
                    <span className="ms-2">Dashboard</span>
                  )}
                </Link>
              </li>
            ) : (
              ""
            )}
            {userData && userData.role === "user" ? (
              <li className="nav-item mt-2">
                <Link to="/notification" className="nav-link text-white">
                  <i className="fas fa-bell"></i>
                  {(!isMobile || showMobileMenu) && (
                    <span className="ms-2">Notifications</span>
                  )}
                  {unreadCount > 0 && (
                    <span className="badge bg-danger ms-2">{unreadCount}</span>
                  )}
                </Link>
              </li>
            ) : (
              ""
            )}

            {userData && userData.role === "admin" && (
              <>
                <li className="nav-item">
                  <Link
                    to="/user-verification"
                    className="nav-link text-white"
                    onClick={() => isMobile && setShowMobileMenu(false)}
                  >
                    <i className="fas fa-user-check"></i>
                    {(!isMobile || showMobileMenu) && (
                      <>
                        <span className="ms-2">User Verification</span>
                        {user && user.length > 0 && (
                          <span className="badge bg-danger ms-2">
                            {user.length}
                          </span>
                        )}
                      </>
                    )}
                  </Link>
                </li>

                <li className="nav-item">
                  <Link
                    to="/lostItemsRequest"
                    className="nav-link text-white"
                    onClick={() => isMobile && setShowMobileMenu(false)}
                  >
                    <i className="fas fa-search-location"></i>
                    {(!isMobile || showMobileMenu) && (
                      <>
                        <span className="ms-2">Lost Item Requests</span>
                        {lostItems && lostItems.length > 0 && (
                          <span className="badge bg-danger ms-2">
                            {lostItems.length}
                          </span>
                        )}
                      </>
                    )}
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    to="/foundItemsRequest"
                    className="nav-link text-white"
                    onClick={() => isMobile && setShowMobileMenu(false)}
                  >
                    <i className="fas fa-check-circle"></i>
                    {(!isMobile || showMobileMenu) && (
                      <>
                        <span className="ms-2">Found Item Claims</span>

                        {foundItems && foundItems.length > 0 && (
                          <span className="badge bg-danger ms-2">
                            {foundItems.length}
                          </span>
                        )}
                      </>
                    )}
                  </Link>
                </li>
              </>
            )}

            {userData?.isVerified === "accepted" && (
              <>
                <li className="nav-item">
                  <Link
                    to="/reportLostItems"
                    className="nav-link text-white"
                    onClick={() => isMobile && setShowMobileMenu(false)}
                  >
                    <i className="fa-solid fa-magnifying-glass"></i>{" "}
                    {(!isMobile || showMobileMenu) && (
                      <span className="ms-2">Report Lost Items</span>
                    )}
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    to="/reportFoundItems"
                    className="nav-link text-white"
                    onClick={() => isMobile && setShowMobileMenu(false)}
                  >
                    <i className="fa-solid fa-clipboard-list"></i>{" "}
                    {(!isMobile || showMobileMenu) && (
                      <span className="ms-2">Report Found Items</span>
                    )}
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    to="/displaySavedItems"
                    className="nav-link text-white"
                    onClick={() => isMobile && setShowMobileMenu(false)}
                  >
                    <i className="fa-solid fa-bookmark me-2"></i>{" "}
                    {(!isMobile || showMobileMenu) && (
                      <>
                        <span className="ms-2">Saved Items</span>
                        {savedItem && savedItem.length > 0 && (
                          <span className="badge bg-danger ms-2">
                            {savedItem.length}
                          </span>
                        )}
                      </>
                    )}
                  </Link>
                </li>
              </>
            )}

            <li className="nav-item">
              <Link
                to="/profileSetting"
                className="nav-link text-white"
                onClick={() => isMobile && setShowMobileMenu(false)}
              >
                <i className="fa-solid fa-user-cog"></i>{" "}
                {(!isMobile || showMobileMenu) && (
                  <span className="ms-2">Profile Setting</span>
                )}
              </Link>
            </li>

              <li className="nav-item mt-3">
            <button onClick={handleToast} className="btn btn-danger w-100">
              <i className="fas fa-sign-out-alt me-2"></i>Logout
            </button>
          </li>
          </ul>
        </div>
      </div>

      {/* Main Content */}
      <div
        className="flex-grow-1 p-4"
        style={{
          marginLeft: isMobile ? "0" : isOpen ? "250px" : "80px",
          transition: "margin-left 0.3s ease-in-out",
          paddingTop: isMobile ? "60px" : "0",
        }}
      >
        {children}
      </div>

      {/* Sidebar Styles */}
      <style>{`
        .sidebar {
          width: 250px;
          transition: all 0.3s ease-in-out;
        }
        .sidebar-collapsed {
          width: 80px;
        }
        .sidebar-collapsed span {
          display: none;
        }
          .sidebar {
          width: 250px;
          transition: all 0.3s ease-in-out;
          overflow-y: auto;
          scrollbar-width: none;        /* Firefox */
          -ms-overflow-style: none;     /* Internet Explorer 10+ */
        }

        .sidebar::-webkit-scrollbar {
          display: none;                /* Chrome, Safari and Opera */
        }
        .nav-link {
          padding: 10px;
          transition: background 0.3s;
        }
        .nav-link:hover {
          background:#1f5f74;
          border-radius: 5px;
        }
        
        /* Mobile styles */
        .mobile-sidebar-closed {
          transform: translateX(-100%);
        }
        .mobile-sidebar-open {
          transform: translateX(0);
        }
        
        @media (min-width: 768px) {
          .mobile-sidebar-closed {
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
}

export default Sidebar;
