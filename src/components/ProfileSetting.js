import React, { useState, useEffect } from "react";
import { ToastContainer } from "react-toastify";
import { showToast } from "./Toastify2";
import { data, useNavigate } from "react-router-dom";
import imageCompression from "browser-image-compression";
function ProfileSetting() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const userId = localStorage.getItem("userId");
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [resetPasswordModal, setResetPasswordModal] = useState(false);
  const [deleteAccountModal, setDeleteAccountModal] = useState(false);
  const [verifiedPassword, setVerifiedPassword] = useState(false);
  const [showEditCnicPasswordModal, setEditShowCnicPasswordModal] =
    useState(false);
  const [userEditModal, setUserEditModal] = useState(false);
  const [cnicVisible, setCnicVisible] = useState(false);
  const [cnicEditVisible, setEditCnicVisible] = useState(false);
  const [idPassword, setIdPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [cnicText, setCnicText] = useState("View CNIC Images");
  const [cnicEditText, setCnicEditText] = useState("View CNIC Images");
  const [resetPasswordText, setResetPasswordText] = useState("Verify");
  const [name, setName] = useState("");
  const [cnic, setCnic] = useState("");
  const [email, setEmail] = useState("");
  const [contact, setContact] = useState("");
  const [address, setAddress] = useState("");
  const [status, setStatus] = useState("");
  const [isHovered, setIsHovered] = useState(false);
   const [loading, setLoading] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);
  
  const [profileImage, setProfileImage] = useState(null);
  const [frontCnicImage, setFrontCnicImage] = useState(null);
  const [backCnicImage, setBackCnicImage] = useState(null);
    const [profileImageDB, setProfileImageDB] = useState(null);
    const [frontSideCnicDB, setFrontSideCnicDB] = useState(null);
    const [backSideCnicDB, setBackSideCnicDB] = useState(null);
  useEffect(() => {
    if (currentUser) {
      setContact(currentUser.phone || "Loading...");
      setProfileImage(currentUser?.profileImage || "loading");
      setFrontCnicImage(currentUser.frontCnic || null)
      setBackCnicImage(currentUser.backCnic || null)
      setProfileImageDB(currentUser?.profileImage || "loading");
      setFrontSideCnicDB(currentUser.frontCnic || null)
      setBackSideCnicDB(currentUser.backCnic || null)
    }
  }, [currentUser]);

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
          return;
        }
        const data = await response.json();
        const user = data.users.find((user) => user._id === userId);
        setCurrentUser(user);
      } catch (error) {
        console.error("Error fetching Users:", error);
      }
    };
  useEffect(() => {
 

    getUser();
  }, [userId]);
  const resetPassword = async () => {
    setLoadingPassword(true)
    const token = localStorage.getItem("resetToken");

    if (newPassword !== confirmPassword) {
      showToast(
        "warning",
        "Confirm password does'nt match!",
        3000,
        "top-right"
      );
      setLoadingPassword(false)
      return;
    }
    try {
      const response = await fetch(
        "https://lost-and-found-backend-xi.vercel.app/auth/reset-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token,
            newPassword: newPassword,
          }),
        }
      );
      if (response.ok) {
        setLoadingPassword(false)
        showToast(
          "success",
          "Password changed successfully!",
          3000,
          "top-right"
        );
        setVerifiedPassword(false);
        setResetPasswordModal(false);
        setResetPasswordText("Verify");
        setIdPassword("");
      } else {
        setLoadingPassword(false)
        showToast("error", "Error changing password!", 3000, "top-right");
      }
    } catch (error) {
      setLoadingPassword(false)
      console.error("Error Uploading User:", error);
      showToast("error", "Network or Server Error", 3000, "top-right");
    }
  };

  const verifyPassword = async (action) => {
    setLoadingPassword(true)
    setLoading(true)
    if (resetPasswordText === "Reset Password") {
      resetPassword();
      return;
    }

    if (!idPassword) {
      showToast("error", "Please enter your password", 3000, "top-right");
      return;
    }

    try {
      console.log("checkAction", action);

      const response = await fetch(
        "https://lost-and-found-backend-xi.vercel.app/auth/verify-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ password: idPassword, action: action }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setLoading(false)
        setLoadingPassword(false)
        showToast("success", data.message, 3000, "top-right");
        if (action === "cnic") {
          setIdPassword("");
          setCnicText("Hide CNIC Images");
          setCnicVisible(true); // Removes blur from image
          setShowPasswordModal(false);
        } else if (action === "password") {
          localStorage.setItem("resetToken", data.token);
          setVerifiedPassword(true);
          setResetPasswordText("Reset Password");
        } else if (action === "delete") {
          await deleteAccount();
        } else if (action === "cnicEdit") {
          setCnicEditText("Hide CNIC Images");
          setIdPassword("");
          setEditCnicVisible(true);
          setEditShowCnicPasswordModal(false);
        }
      } else {
        setLoading(false)
        setLoadingPassword(false)
        showToast("error", data.message, 3000, "top-right");
      }
    } catch (error) {
      setLoading(false)
      setLoadingPassword(false)
      console.error("Error:", error);
      showToast("error", "Network Error. Try again.", 3000, "top-right");
    }
  };

   const handleUpdateData = async () => {
      setLoading(true);
      const formData = new FormData();
      if (profileImageDB) formData.append("profileImage", profileImageDB);
      if (frontSideCnicDB) formData.append("frontCnic", frontSideCnicDB);
      if (backSideCnicDB) formData.append("backCnic", backSideCnicDB);
      if (name) formData.append("name", name);
      if (address) formData.append("address", address);
      console.log(profileImageDB,)
      console.log(frontSideCnicDB,)
      console.log(backSideCnicDB,)
      console.log(name,)
      console.log(address,)

      try {
        const response = await fetch(
          "https://lost-and-found-backend-xi.vercel.app/auth/update-profile",
          {
            method: "PUT",
              headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
            body: formData,
          }
        );
  
        const data = await response.json();
  
        if (response.ok) {
         await getUser()
          showToast(
            "success",
            "User Updated Successfully",
            3000,
            "top-right"
          );
          setLoading(false);
          setUserEditModal(false)
        } else {
          setLoading(false);
          showToast("error", data.message || "Updating User Failed", 3000, "top-right");
        }
      } catch (error) {
        setLoading(false);
        console.error("Error Updating User:", error);
        showToast("error", "Network or Server Error", 3000, "top-right");
      }
    };

  const openPasswordModal = () => {
    if (cnicText === "View CNIC Images") {
      setShowPasswordModal(true);
    } else {
      setCnicVisible(false);
      setCnicText("View CNIC Images");
    }
  };
  const closePasswordModal = () => {
    if (resetPasswordText === "Reset Password") {
      setResetPasswordText("Verify");
      setResetPasswordModal(false);
      setVerifiedPassword(false);
      setIdPassword("");
    } else if (resetPasswordText === "Verify") {
      setShowPasswordModal(false);
      setResetPasswordModal(false);
      setIdPassword("");
    } else {
      setCnicText("View CNIC Images");
      setIdPassword("");
    }
  };
  const openEditShowCnicPasswordModal = () => {
    if (cnicEditText === "View CNIC Images") {
      setEditShowCnicPasswordModal(true);
    } else {
      setEditCnicVisible(false);
      setCnicEditText("View CNIC Images");
    }
  };
  const openUserEditModal = () => {
    setName(currentUser?.name || "Loading...");
    setCnic(currentUser?.cnic || "Loading...");
    setAddress(currentUser?.address || "Loading...");
    setEmail(currentUser?.email || "Loading...");
    setContact(currentUser?.phone || "Loading...");
    setProfileImage(currentUser?.profileImage);
    setStatus(
      currentUser.isVerified === "accepted" ? "Verified" : "Not Verified"
    );

    setUserEditModal(true);
  };



   const compressAndSetImage = async (e, setPreview, setFileState) => {
      const file = e.target.files[0];
      if (!file) return;
  
      const options = {
        maxSizeMB: 0.6,
        maxWidthOrHeight: 800,
        useWebWorker: true,
      };
  
      try {
        const compressedFile = await imageCompression(file, options);
        console.log("Original:", file.size / 1024 / 1024, "MB");
        console.log("Compressed:", compressedFile.size / 1024 / 1024, "MB");
  
        setPreview(URL.createObjectURL(compressedFile));
        setFileState(compressedFile);
      } catch (error) {
        console.error("Compression failed:", error);
      }
    };

  

  const deleteAccount = async () => {
    const confirmation = window.confirm("Do You want to delete account?");
    setLoading(true)
    if (!confirmation) {
      return;
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
        setLoading(false)
        showToast("error", "Error Deleting Account", 3000, "top-right");
        return;
      }
        setLoading(false)
        localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
      showToast("success", "Account Deleted SuccessFully", 3000, "top-right");
      setTimeout(() => {
        navigate("/login-signup");
      }, 1500);
    } catch (error) {
      setLoading(false)
      console.error("Error Deleting Account:", error);
    }
  };

  return (
    <>
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
                      onClick={openUserEditModal}
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
                  <button
                    className="btn btn-warning"
                    onClick={openPasswordModal}
                  >
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
                              src={currentUser.frontCnic }
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
                              src={currentUser.backCnic }
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
        <div className="row">
          <div className="col-md-8"></div> {/* Push buttons to right */}
          <div className="col-md-4 mt-4 mb-5 d-flex flex-column flex-md-row justify-content-md-end align-items-center gap-2">
            <button
              className="btn btn-danger w-100 w-md-auto"
              onClick={() => setDeleteAccountModal(true)}
            >
              <i className="fas fa-trash-alt me-1"></i> Delete My Account
            </button>
            <button
              className="btn btn-warning w-100 w-md-auto"
              onClick={() => setResetPasswordModal(true)}
            >
              <i className="fas fa-key me-1"></i> Reset Password
            </button>
          </div>
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
                <button
                  className="btn btn-primary"
                  onClick={() => verifyPassword("cnic")}
                  disabled={loadingPassword}
                >
                  {loadingPassword === false ? (
                  <>
                    Submit
                    <i className="fas fa-paper-plane ms-2"></i>
                  </>
                ) : (
                  <>
                    Verifying...
                    <div
                      className="spinner-border spinner-border-sm text-dark ms-2"
                      role="status"
                    ></div>
                  </>
                )}
                  
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {deleteAccountModal && (
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
                  onClick={() => setDeleteAccountModal(false)}
                ></button>
              </div>

              <div className="modal-body">
                <input
                  type="password"
                  className="form-control mb-3"
                  placeholder="Enter your password"
                  value={idPassword}
                  onChange={(e) => setIdPassword(e.target.value)}
                />

                <div className="alert alert-info small mb-0">
                  <strong>Note:</strong> To permanently delete your account,
                  please confirm by entering your password.
                </div>
              </div>

              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setDeleteAccountModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => verifyPassword("delete")}
                  disabled={loading}
                >
                   {loading === false ? (
                  <>
                    Delete Account permanently
                    <i className="fas fa-trash ms-2"></i>
                  </>
                ) : (
                  <>
                    Deleting...
                    <div
                      className="spinner-border spinner-border-sm text-dark ms-2"
                      role="status"
                    ></div>
                  </>
                )}
                  
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {userEditModal && (
        <div
          className="modal show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Personal Information</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setUserEditModal(false)}
                ></button>
              </div>

              <div className="container d-flex flex-column align-items-center justify-content-center">
                {profileImage ? (
                  <img
                    src={profileImage}
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

                <div className="mb-3">
                  <label htmlFor="picture" style={{ cursor: "pointer" }}>
                    <div
                      onMouseEnter={() => setIsHovered(true)}
                      onMouseLeave={() => setIsHovered(false)}
                      style={{
                        width: "40px",
                        height: "40px",
                        border: "2px solid #343a40",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: "50%",
                        backgroundColor: isHovered ? "#343a40" : "transparent", // light blue on hover
                        transform: isHovered ? "scale(1.1)" : "scale(1)",
                        transition: "all 0.3s ease-in-out",
                      }}
                    >
                      <i
                        className="fas fa-camera"
                        style={{
                          color: isHovered ? "white" : "#343a40",
                          transition: "color 0.3s ease-in-out",
                        }}
                      ></i>
                    </div>
                  </label>

                  <input
                    type="file"
                    id="picture"
                    className="d-none"
                    accept="image/*"
                    onChange={(e) =>
                              compressAndSetImage(
                                e,
                                setProfileImage,
                                setProfileImageDB
                              )}
                  />
                </div>

                <div className="mb-3 input-group">
                  <span className="input-group-text bg-white">
                    <i className="fas fa-user"></i>
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Name"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    minLength={2}
                  />
                </div>
                <div className="mb-3 input-group">
                  <span className="input-group-text bg-white">
                    <i className="fas fa-map-marker-alt"></i>
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Complete Address With City Name"
                    id="name"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                    minLength={5}
                  />
                </div>

                <div className="mb-3 input-group">
                  <span className="input-group-text bg-white">
                    <i className="fas fa-id-card"></i>
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="xxxxx-xxxxxxx-x"
                    id="cnic"
                    value={cnic}
                    required
                    disabled
                    data-bs-toggle="tooltip"
                    title="You cannot update this field"
                  />
                  <span className="input-group-text bg-light">
                    <i className="fas fa-lock"></i>
                  </span>
                </div>

                {/* Contact */}
                <div className="mb-3 input-group">
                  <span className="input-group-text bg-white">
                    <i className="fas fa-phone"></i>
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Whatsapp Contact"
                    id="contact"
                    value={contact}
                    required
                    minLength={11}
                    disabled
                    data-bs-toggle="tooltip"
                    title="You cannot update this field"
                  />
                  <span className="input-group-text bg-light">
                    <i className="fas fa-lock"></i>
                  </span>
                </div>

                {/* Email */}
                <div className="mb-3 input-group">
                  <span className="input-group-text bg-white">
                    <i className="fas fa-envelope"></i>
                  </span>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Email"
                    id="email"
                    value={email}
                    required
                    disabled
                    data-bs-toggle="tooltip"
                    title="You cannot update this field"
                  />
                  <span className="input-group-text bg-light">
                    <i className="fas fa-lock"></i>
                  </span>
                </div>

                <div className="mb-3 input-group">
                  <span className="input-group-text bg-white">
                    {status === "Verified" ? (
                      <i
                        className="fas fa-check-circle"
                        style={{ color: "#28a745" }}
                      ></i> // Green check
                    ) : (
                      <i
                        className="fas fa-times-circle"
                        style={{ color: "#dc3545" }}
                      ></i> // Red cross
                    )}
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Status"
                    id="cnic"
                    value={status}
                    required
                    disabled
                    data-bs-toggle="tooltip"
                    title="You cannot update this field"
                  />
                  <span className="input-group-text bg-light">
                    <i className="fas fa-lock"></i>
                  </span>
                </div>
              </div>
              <div className="container">
                 {cnicEditVisible === false ?(<div className="alert alert-info small mb-0">
                    <strong>Note:</strong> To change your CNIC, please first
                    click the
                    <strong style={{ color: "#0d6efd", margin: "0 4px" }}>
                      "View CNIC Images"
                    </strong>{" "}
                     below button and enter your password to unlock access.
                  </div>):("")}
                <div
                  className="d-flex justify-content-end mt-2"
                  style={{ marginRight: "16px" }}
                >
                  <button
                    className="btn btn-warning "
                    onClick={openEditShowCnicPasswordModal}
                  >
                    <i className="fas fa-id-card me-2"></i> {cnicEditText}
                  </button>
                </div>

                <div className=" mt-2 gap-3 mb-3  d-flex flex-column align-items-center justify-content-center">
                  {/* Front CNIC */}
                 

                  <div className="col-11">
                    <div className="card shadow-sm border-0">
                      <div className="card-header bg-dark text-white fw-bold text-center">
                        Front Side of CNIC
                        {cnicEditVisible === true && (
                          <>
                            <label
                              htmlFor="cnicFront"
                              style={{ cursor: "pointer", marginLeft: "15px" }}
                            >
                              <i
                                className="fas fa-sync-alt"
                                style={{
                                  color: "#ffc107",
                                  marginRight: "5px",
                                }}
                              ></i>
                              <span
                                style={{ color: "#ffc107", fontWeight: "500" }}
                              >
                                Change
                              </span>
                            </label>

                            <input
                              type="file"
                              id="cnicFront"
                              accept="image/*"
                              className="d-none"
                               onChange={(e) =>
                              compressAndSetImage(
                                e,
                                setFrontCnicImage,
                                setFrontSideCnicDB
                              )} // your handler function
                            />
                          </>
                        )}
                      </div>

                      <div className="card-body p-2">
                        {frontCnicImage? (
                          <div className="ratio ratio-4x3">
                            <img
                              src={frontCnicImage}
                              alt="CNIC Front"
                              className="img-fluid rounded"
                              style={{
                                filter: cnicEditVisible ? "none" : "blur(8px)",
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
                  <div className="col-11">
                    <div className="card shadow-sm border-0">
                      <div className="card-header bg-dark text-white fw-bold text-center">
                        Back Side of CNIC
                        {cnicEditVisible === true && (
                          <>
                            <label
                              htmlFor="cnicback"
                              style={{ cursor: "pointer", marginLeft: "15px" }}
                            >
                              <i
                                className="fas fa-sync-alt"
                                style={{
                                  color: "#ffc107",
                                  marginRight: "5px",
                                }}
                              ></i>
                              <span
                                style={{ color: "#ffc107", fontWeight: "500" }}
                              >
                                Change
                              </span>
                            </label>

                            <input
                              type="file"
                              id="cnicBack"
                              accept="image/*"
                              className="d-none"
                              onChange={(e) =>
                              compressAndSetImage(
                                e,
                                setBackCnicImage,
                                setBackSideCnicDB
                              )} // your handler function
                            />
                          </>
                        )}
                      </div>
                      <div className="card-body p-2">
                        {backCnicImage ? (
                          <div className="ratio ratio-4x3">
                            <img
                              src={backCnicImage}
                              alt="CNIC Back"
                              className="img-fluid rounded"
                              style={{
                                filter: cnicEditVisible ? "none" : "blur(8px)",
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
              </div>

              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setUserEditModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-primary"
                  onClick={handleUpdateData}
                  disabled={loading}
                >
                   {loading === false ? (
                  <>
                    Submit
                    <i className="fas fa-paper-plane ms-2"></i>
                  </>
                ) : (
                  <>
                    Updating...
                    <div
                      className="spinner-border spinner-border-sm text-dark ms-2"
                      role="status"
                    ></div>
                  </>
                )}
                  
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {resetPasswordModal && (
        <div
          className="modal show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Password Reset</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={closePasswordModal}
                ></button>
              </div>

              <div className="modal-body">
                <label className="form-label">
                  <strong>Enter Old Password</strong>
                </label>
                <input
                  type="password"
                  className="form-control mb-3"
                  placeholder="Your Old password"
                  value={idPassword}
                  onChange={(e) => setIdPassword(e.target.value)}
                  disabled={verifiedPassword}
                />
                {verifiedPassword && (
                  <>
                    <label className="form-label">
                      <strong>Enter New Password</strong>
                    </label>
                    <input
                      type="password"
                      className="form-control mb-3"
                      placeholder="Your New password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <label className="form-label">
                      <strong>Enter Confirm Password</strong>
                    </label>
                    <input
                      type="password"
                      className="form-control mb-3"
                      placeholder="Your Confirm password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </>
                )}
              </div>

              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={closePasswordModal}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-primary"
                  onClick={() => verifyPassword("password")}
                >
                  {resetPasswordText}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showEditCnicPasswordModal && (
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
                  onClick={() => setEditShowCnicPasswordModal(false)}
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
                  onClick={() => setEditShowCnicPasswordModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-primary"
                  onClick={() => verifyPassword("cnicEdit")}
                  disabled={
                    loading
                  }
                >
                   {loading === false ? (
                  <>
                     Verify
                    <i className="fa-solid fa-key ms-2"></i>
                  </>
                ) : (
                  <>
                    Verifying...
                    <div
                      className="spinner-border spinner-border-sm text-dark ms-2"
                      role="status"
                    ></div>
                  </>
                )}
                  
                 
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ProfileSetting;
