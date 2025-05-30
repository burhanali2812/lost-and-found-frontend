import React, { useState, useEffect } from "react";
import { ToastContainer } from "react-toastify";
import { showToast } from "./Toastify2";
function ProfileSetting() {
  const [currentUser, setCurrentUser] = useState(null);
  const userId = localStorage.getItem("userId");
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const [cnicVisible, setCnicVisible] = useState(false);
  const [idPassword, setIdPassword] = useState("");
  const [cnicText, setCnicText] = useState("View CNIC Images");

  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await fetch(
          "https://lost-and-found-backend-xi.vercel.app/auth/getAllUser",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (!response.ok) {
          alert("Cannot Fetch Users");
          return;
        }
        const data = await response.json();
        const user = data.users.find((user) => user._id === userId);
        setCurrentUser(user);
      } catch (error) {
        console.error("Error fetching Users:", error);
      }
    };

    getUser();
  }, [userId]);

  const verifyPassword = async () => {
    console.log("idPassword", idPassword);

    try {
      const response = await fetch(
        "https://lost-and-found-backend-xi.vercel.app/auth/verify-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ password: idPassword }),
        }
      );
      const data = await response.json();
      if (response.ok) {
        showToast("success", data.message, 3000, "top-right");
        setIdPassword(" ");
        setCnicVisible(true); // Removes blur from image
        setShowPasswordModal(false);
      } else {
        showToast("error", data.message, 3000, "top-right");
      }
    } catch (error) {
      console.error("Error:", error);
      showToast("error", "Network Error. Try again.", 3000, "top-right");
    }
  };
  const openPasswordModal = () => {
    if (cnicText === "View CNIC Images") {
      setShowPasswordModal(true);
      setCnicText("Hide CNIC Images");
    } else {
      setCnicVisible(false);
      setCnicText("View CNIC Images");
    }
  };
  const closePasswordModal = () => {
    setShowPasswordModal(false);
    setCnicText("View CNIC Images");
  };
  return (
    <div className="container">
      <ToastContainer />
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="card-body">
          <div className="d-flex justify-content-center align-items-center mb-4">
            <h3 className="mb-0">
              {" "}
              <i className="fa-solid fa-user-cog me-2" aria-hidden="true"></i>
              PROFILE SETTING
            </h3>
          </div>

          <div className="d-flex flex-column align-items-center justify-content-center">
            {currentUser?.profileImage ? (
              <img
                src={currentUser.profileImage}
                alt="Profile"
                style={{
                  width: "110px",
                  height: "140px",
                  objectFit: "cover",
                  borderRadius: "9px",
                  marginBottom: "5px",
                  marginTop: "15px",
                }}
              />
            ) : (
              <i
                className="fa-solid fa-user-circle fa-5x text-secondary"
                style={{ marginBottom: "10px", marginTop: "15px" }}
              ></i>
            )}

            {/* Name */}
            <h2>{currentUser?.name || "Loading..."}</h2>

            {/* Role and Verification Badge */}
            <span
              className="badge d-inline-block"
              style={{
                backgroundColor:
                  currentUser?.isVerified === "accepted"
                    ? "#28a745"
                    : "#dc3545",
                color: "white",
                padding: "6px 10px",
                fontSize: "0.8rem",
              }}
            >
              {currentUser?.role === "admin" ? (
                <>
                  <i className="fas fa-user-shield me-1"></i> Admin
                </>
              ) : (
                <>
                  <i className="fas fa-user me-1"></i> User
                </>
              )}
              {" | "}
              {currentUser?.isVerified === "accepted" ? (
                <>
                  <i className="fas fa-check-circle ms-1"></i> Verified
                </>
              ) : (
                <>
                  <i className="fas fa-times-circle ms-1"></i> Not Verified
                </>
              )}
            </span>
          </div>
          <hr style={{ border: "1px solid black", margin: "10px 0" }} />

          {currentUser && (
            <>
              <div className="row mt-4">
                <div className="col-12 mb-3">
                  <span className="bg-white text-dark p-1 rounded fw-bold d-inline-flex align-items-center">
                    <span
                      className="bg-white rounded-circle d-flex justify-content-center align-items-center me-2"
                      style={{ width: "25px", height: "25px" }}
                    >
                      <i className="fas fa-id-badge text-dark"></i>
                    </span>
                    PERSONAL INFORMATION
                  </span>

                  <span
                    // onClick={openEditModal}
                    title="Edit Info"
                    role="button"
                    className="ms-2"
                    style={{ cursor: "pointer", color: "#0d6efd" }}
                  >
                    <i className="fas fa-edit"></i>
                  </span>
                </div>
              </div>

              <div className="row text-dark px-2 px-md-3">
                <div className="col-12 col-md-6 col-lg-12 mb-2">
                  <b>Email:</b> {currentUser.email || "Not provided"}
                </div>
                <div className="col-12 col-md-6 col-lg-12 mb-2">
                  <b>CNIC:</b> {currentUser.cnic || "Not provided"}
                </div>
                <div className="col-12 col-md-6 col-lg-12 mb-2">
                  <b>Contact:</b> {currentUser.phone || "Not provided"}
                </div>
                <div className="col-12 col-md-6 col-lg-12 mb-2">
                  <b>Address:</b> {currentUser.address || "Not provided"}
                </div>
                <div className="col-12 col-md-6 col-lg-12 mb-2">
                  <b>Created At:</b>{" "}
                  {currentUser.createdAt
                    ? new Date(currentUser.createdAt).toLocaleDateString()
                    : "Not provided"}
                </div>
              </div>
              <div className="d-flex justify-content-end mt-2">
                <button className="btn btn-warning" onClick={openPasswordModal}>
                  <i className="fas fa-id-card me-2"></i> {cnicText}
                </button>
              </div>

              <div className="row mt-2 g-3 justify-content-center">
                {/* Front CNIC */}
                <div className="col-12 col-md-6 col-lg-4">
                  <div className="card shadow-sm border-0">
                    <div className="card-header bg-dark text-white fw-bold text-center">
                      Front Side of CNIC
                    </div>
                    <div className="card-body p-2">
                      {currentUser.frontCnic ? (
                        <div className="ratio ratio-4x3">
                          <img
                            src={currentUser.frontCnic}
                            alt="CNIC Front"
                            className="img-fluid rounded"
                            style={{
                              filter: cnicVisible ? "none" : "blur(8px)",
                            }}
                          />
                        </div>
                      ) : (
                        <div className="text-center w-100 text-muted mt-4">
                          <i className="fas fa-id-card fa-2x"></i>
                          <p className="mt-2">Front CNIC not uploaded</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Back CNIC */}
                <div className="col-12 col-md-6 col-lg-4">
                  <div className="card shadow-sm border-0">
                    <div className="card-header bg-dark text-white fw-bold text-center">
                      Back Side of CNIC
                    </div>
                    <div className="card-body p-2">
                      {currentUser.backCnic ? (
                        <div className="ratio ratio-4x3">
                          <img
                            src={currentUser.backCnic}
                            alt="CNIC Back"
                            className="img-fluid rounded"
                            style={{
                              filter: cnicVisible ? "none" : "blur(8px)",
                            }}
                          />
                        </div>
                      ) : (
                        <div className="text-center w-100 text-muted mt-4">
                          <i className="fas fa-id-card-alt fa-2x"></i>
                          <p className="mt-2">Back CNIC not uploaded</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {showPasswordModal && (
        <div
          className="modal show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Enter Password</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={closePasswordModal}
                ></button>
              </div>

              <div className="modal-body">
                <input
                  type="password"
                  className="form-control mb-3"
                  placeholder="Your account password"
                  value={idPassword}
                  onChange={(e) => setIdPassword(e.target.value)}
                />

                <div className="alert alert-info small mb-0">
                  <strong>Note:</strong> For security reasons, please enter your
                  password to view CNIC images.
                </div>
              </div>

              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={closePasswordModal}
                >
                  Cancel
                </button>
                <button className="btn btn-primary" onClick={verifyPassword}>
                  Verify
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="row">
        <div className="col-md-8"></div> {/* Push buttons to right */}
        <div className="col-md-4 mt-4 mb-5 d-flex flex-column flex-md-row justify-content-md-end align-items-center gap-2">
          <button className="btn btn-danger w-100 w-md-auto">
            <i className="fas fa-trash-alt me-1"></i> Delete My Account
          </button>
          <button className="btn btn-warning w-100 w-md-auto">
            <i className="fas fa-key me-1"></i> Reset Password
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProfileSetting;
