import { useState, useEffect } from "react";
import React from "react";
import { showToast } from "./Toastify2";
import { ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

import "./Signup.css";

import ReCAPTCHA from "react-google-recaptcha";

function Signup() {
  const [profileImage, setProfileImage] = useState(null);
  const [frontSideCnic, setFrontSideCnic] = useState(null);
  const [backSideCnic, setBackSideCnic] = useState(null);
  const [profileImageDB, setProfileImageDB] = useState(null);
  const [frontSideCnicDB, setFrontSideCnicDB] = useState(null);
  const [backSideCnicDB, setBackSideCnicDB] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [contact, setContact] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [cnic, setCnic] = useState("");
  const [address, setAddress] = useState("");
  const [isChecked, setIsChecked] = useState(false);
  const [action, setAction] = useState("signin");
  const [lemail, setlEmail] = useState("");
  const [lpassword, setlPassword] = useState("");
  const [lcnic, setlCnic] = useState("");
  const navigate = useNavigate();
  const [loginType, setLoginType] = useState("email");
  const [isRemeber, setIsRemeber] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showcPassword, setShowcPassword] = useState(false);
  const [showlPassword, setShowlPassword] = useState(false);
  const [captchaValue, setCaptchaValue] = useState(null);
  const [forgetEmail, setForgetEmail] = useState("");
  const [strength, setStrength] = useState("");


    const checkPasswordStrength = (password) => {
    if (password.length < 8) return "Weak";
    if (
      password.length >= 6 &&
      /[A-Z]/.test(password) &&
      /[0-9]/.test(password) &&
      /[!@#$%^&*]/.test(password)
    ) {
      return "Strong";
    }
    return "Medium";
  };
  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    setStrength(checkPasswordStrength(value));
  };
  const handleAlreadyLogin = (e) => {
    e.preventDefault();
    setAction("signin");
  };
  const handleCaptchaChange = (value) => {
    setCaptchaValue(value);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (lcnic !== "") {
      const cnicPattern = /^\d{5}-\d{7}-\d{1}$/;
      if (!cnicPattern.test(lcnic)) {
        showToast(
          "error",
          "Please enter a valid CNIC number in the format xxxxx-xxxxxxx-x",
          3000,
          "top-right"
        );
        return;
      }
    }
    try {
      const response = await fetch(
        "https://lost-and-found-backend-xi.vercel.app/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            loginType,
            email: lemail,
            password: lpassword,
            cnic: lcnic,
          }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        if (isRemeber) {
          localStorage.setItem("token", data.token);
          localStorage.setItem("userId", data.userId);
          localStorage.setItem("userName", data.userName);
          localStorage.setItem("role", data.role);
        } else {
          localStorage.setItem("token", data.token);
          localStorage.setItem("userId", data.userId);
          localStorage.setItem("userName", data.userName);
          sessionStorage.setItem("token", data.token);
          sessionStorage.setItem("userId", data.userId);
          sessionStorage.setItem("userName", data.userName);
          localStorage.setItem("role", data.role);
        }
        if (data.role === "admin") {
          navigate("/user-verification");
          console.log("admin");
        } else if (data.role === "user") {
          navigate("/notification");
        }
      } else {
        console.error("Login error:", data.message);
        showToast("error", `Login Failed: ${data.message}`, 3000, "top-right");
      }
    } catch (error) {
      console.error("Network or server error:", error);
      showToast(
        "error",
        "Network error! Please check the server.",
        3000,
        "top-right"
      );
    }
  };
  useEffect(() => {
    
    const cleanupModals = () => {
      
      const backdrops = document.querySelectorAll('.modal-backdrop');
      backdrops.forEach(backdrop => backdrop.remove());
      
    
      document.body.classList.remove('modal-open');
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
     const modals = document.querySelectorAll('.modal');
      modals.forEach(modal => {
        modal.style.display = 'none';
        const modalInstance = window.bootstrap.Modal.getInstance(modal); 
        if (modalInstance) {
          modalInstance.hide();
          modalInstance.dispose();
        }
      });
    };

    // Run cleanup on mount
    cleanupModals();

    // Optional: Also clean up when component unmounts
    return () => cleanupModals();
  }, []);


  const handleUploadImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(URL.createObjectURL(file));
      setProfileImageDB(file);
    }
  };
  const handleUploadFrontCinc = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFrontSideCnic(URL.createObjectURL(file));
      setFrontSideCnicDB(file);
    }
  };
  const handleUploadBackCnic = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBackSideCnic(URL.createObjectURL(file));
      setBackSideCnicDB(file);
    }
  };
  const handlesetActionSignIn = () => {
    setAction("signin");
  };
  const handlesetActionSignUp = () => {
    setAction("signup");
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const cnicPattern = /^\d{5}-\d{7}-\d{1}$/;
    if (!cnicPattern.test(cnic)) {
      showToast(
        "error",
        "Please enter a valid CNIC number in the format xxxxx-xxxxxxx-x",
        3000
      );
      return;
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      showToast("error", "Please enter a valid email address", 3000);
      return;
    }
    if (password !== confirmPassword) {
      showToast(
        "warning",
        "Confirm Password Does Not Match",
        3000,
        "top-right"
      );
      return;
    }
    const phoneRegex = /^[0-9]{11}$/;
    if (!phoneRegex.test(contact)) {
      showToast(
        "warning",
        "Please enter a valid 11-digit phone number..",
        3000,
        "top-right"
      );
      return false;
    }
    if (!profileImage) {
      showToast(
        "warning",
        "Please upload your profile picture.",
        3000,
        "top-right"
      );
      return false;
    }
    if (!frontSideCnic) {
      showToast(
        "warning",
        "Please upload the front side of your CNIC",
        3000,
        "top-right"
      );
      return false;
    }
    if (!backSideCnic) {
      showToast(
        "warning",
        "Please upload the back side of your CNIC.",
        3000,
        "top-right"
      );
      return false;
    }
    if (!isChecked) {
      showToast(
        "warning",
        "Please agree to the terms and conditions.",
        3000,
        "top-right"
      );
      return;
    }

    if (!captchaValue) {
      showToast("warning", "Please complete the reCAPTCHA.", 3000, "top-right");
      return;
    }

    resetFormData();

    navigate("/email-OTP", {
      state: {
        profileImage: profileImageDB,
        frontCnic: frontSideCnicDB,
        backCnic: backSideCnicDB,
        name,
        email,
        cnic,
        address,
        password,
        phone: contact,
        token: captchaValue,
      },
    });
  };

  const openForgetPasswordModal = () => {
    const modalElement = document.getElementById("forgetPasswordModal");

    const existingModal = window.bootstrap.Modal.getInstance(modalElement);
    if (existingModal) {
      existingModal.dispose();
    }

    const forgetModal = new window.bootstrap.Modal(modalElement);
    forgetModal.show();
  };

  const verifyForgetPassword = async () => {
    if (!forgetEmail.trim()) {
      showToast("error", "Email is required", 3000, "top-right");
      return;
    }

    try {
      const response = await fetch(
        "https://lost-and-found-backend-xi.vercel.app/auth/getUserEmail",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: forgetEmail }),
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        showToast("success", "User Email Verified!", 3000, "top-right");

        // Forcefully hide modal
        const modalElement = document.getElementById("forgetPasswordModal");

        const modalInstance =
          window.bootstrap.Modal.getInstance(modalElement) ||
          new window.bootstrap.Modal(modalElement);

        modalInstance.hide();

        // Wait for Bootstrap transition to complete
        setTimeout(() => {
          navigate("/email-OTP", {
            state: {
              forgetName: data.name,
              forgetEmail: forgetEmail,
              action: "ForgetPassword",
              forgetToken: data.token,
            },
          });
        }, 500); // wait 500ms to let modal hide animation finish
      } else {
        showToast(
          "error",
          data.message || "Email not found",
          3000,
          "top-right"
        );
      }
    } catch (error) {
      console.error("Error verifying email:", error);
      showToast("error", "Something went wrong. Try again.", 3000, "top-right");
    }
  };

  const resetFormData = () => {
    setProfileImage(null);
    setFrontSideCnic(null);
    setProfileImageDB(null);
    setBackSideCnic(null);
    setFrontSideCnicDB(null);
    setBackSideCnicDB(null);
    setName("");
    setEmail("");
    setContact("");
    setPassword("");
    setConfirmPassword("");
    setCnic("");
    setAddress("");
    setIsChecked("");
    setShowcPassword(null);
    setShowPassword(null);
  };

  return (
    <>
      <ToastContainer />

      <div className="container vh-100 d-flex justify-content-center align-items-center">
        <div
          className="card shadow text-white p-1"
          style={{
            maxWidth: "450px",
            width: "100%",
            borderRadius: "10px",
            background: "linear-gradient(45deg, #0f2027, #203a43, #2c5364)",
            maxHeight: "90vh",
            overflowY: "auto",
          }}
        >
          <div
            className="card-body"
            style={{
              overflowY: "scroll",
              maxHeight: "100%",
              scrollbarWidth: "none", // Firefox
              msOverflowStyle: "none", // IE 10+
            }}
          >
            <div className="d-flex" style={{ marginTop: 30 }}>
              <Link
                to="/login-signup"
                className={`signup-link ${
                  action === "signin" ? "active-tab" : ""
                }`}
                onClick={handlesetActionSignIn}
              >
                SIGN IN
              </Link>
              <Link
                to="/login-signup"
                className={`signup-link ${
                  action === "signup" ? "active-tab" : ""
                }`}
                onClick={handlesetActionSignUp}
                style={{ marginLeft: 28 }}
              >
                SIGN UP
              </Link>
            </div>

            {action === "signup" ? (
              <>
                <div
                  className="text-center text-white mb-3"
                  style={{ marginTop: 50 }}
                >
                  <h1
                    style={{
                      fontSize: "2rem",
                      fontWeight: "bold",
                      letterSpacing: "2px",
                    }}
                  >
                    SIGN UP
                  </h1>
                  <p style={{ opacity: 0.8, fontSize: "1.1rem" }}>
                    Join our Lost and Found community! Create your account to
                    easily report and claim lost items.
                  </p>
                </div>

                <form
                  onSubmit={handleRegister}
                  className="container text-white p-3 rounded"
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.05)",
                    boxShadow: "0 0 15px rgba(0, 0, 0, 0.5)",
                    backdropFilter: "blur(5px)",
                  }}
                >
                  {/* Profile Image */}
                  <div
                    className="d-flex justify-content-center"
                    style={{ marginTop: 50 }}
                  >
                    <div
                      style={{
                        width: "125px",
                        height: "150px",
                        borderRadius: "5%",
                        border: "3px solid white",
                        marginBottom: "10px",
                        backgroundColor: "#203a43",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        overflow: "hidden",
                        fontSize: "80px",
                        color: "white",
                      }}
                    >
                      {profileImage ? (
                        <img
                          src={profileImage}
                          alt="Profile"
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      ) : (
                        <>
                          <i className="fas fa-user"></i>
                        </>
                      )}
                    </div>
                  </div>
                  <p style={{ textAlign: "center", color: "yellow" }}>
                    Recommended image size: 125 × 150 pixels
                  </p>

                  {/* Upload Picture */}
                  <div className="mb-3 input-group mt-2">
                    <span className="input-group-text bg-white">
                      <i className="fas fa-image"></i>
                    </span>
                    <input
                      type="file"
                      className="form-control"
                      id="picture"
                      onChange={handleUploadImage}
                    />
                  </div>

                  {/* Name */}
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
                      <i className="fas fa-id-card"></i>
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="xxxxx-xxxxxxx-x"
                      id="cnic"
                      value={cnic}
                      onChange={(e) => setCnic(e.target.value)}
                      required
                    />
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
                      onChange={(e) => setContact(e.target.value)}
                      required
                      minLength={11}
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
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  {/* Password */}

                  <div className="mb-3 input-group">
                    <span className="input-group-text bg-white">
                      <i className="fas fa-lock"></i>
                    </span>

                    <input
                      type={showPassword ? "text" : "password"}
                      className="form-control"
                      placeholder="Password"
                      id="password"
                      value={password}
                     onChange={handlePasswordChange}
                      required
                      minLength={8}
                    />

                    <span
                      className="input-group-text bg-white"
                      style={{ cursor: "pointer" }}
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      <i
                        className={`fas ${
                          showPassword ? "fa-eye-slash" : "fa-eye"
                        }`}
                      ></i>
                    </span>
                  </div>
                   {password && (
                  <div className="mb-2" style={{marginTop:"-10px"}}>
                    {/* Strength Text */}
                    <div
                      style={{
                        fontSize: "14px",
                        fontWeight: "bold",
                        color:
                          strength === "Weak"
                            ? "red"
                            : strength === "Medium"
                            ? "orange"
                            : "green",
                      }}
                    >
                      {strength} Password
                    </div>

                    {/* Progress Bar */}
                    <div className="progress mt-1" style={{ height: "5px" }}>
                      <div
                        className="progress-bar"
                        role="progressbar"
                        style={{
                          width:
                            strength === "Weak"
                              ? "33%"
                              : strength === "Medium"
                              ? "66%"
                              : "100%",
                          backgroundColor:
                            strength === "Weak"
                              ? "red"
                              : strength === "Medium"
                              ? "orange"
                              : "green",
                        }}
                      ></div>
                    </div>
                  </div>
                )}

                  {/* Confirm Password */}
                  <div className="mb-3 input-group">
                    <span className="input-group-text bg-white">
                      <i className="fas fa-lock"></i>
                    </span>
                    <input
                      type={showcPassword ? "text" : "password"}
                      className="form-control"
                      placeholder="Confirm Password"
                      id="confirmPassword"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      minLength={8}
                    />
                    <span
                      className="input-group-text bg-white"
                      style={{ cursor: "pointer" }}
                      onClick={() => setShowcPassword(!showcPassword)}
                    >
                      <i
                        className={`fas ${
                          showcPassword ? "fa-eye-slash" : "fa-eye"
                        }`}
                      ></i>
                    </span>
                  </div>
                  <div className="color-white">
                    <hr
                      className="my-4"
                      style={{ borderTop: "3px solid white" }}
                    />

                    <div className="d-flex align-items-center text-white">
                      <i
                        className="fas fa-exclamation-circle me-2"
                        style={{ fontSize: "20px", marginBottom: 35 }}
                      ></i>
                      <p>
                        Your CNIC details are collected for identity
                        verification purposes only and will not be shared
                        publicly.
                      </p>
                    </div>
                  </div>

                  <div
                    className="d-flex justify-content-center"
                    style={{ marginTop: 20 }}
                  >
                    <div
                      style={{
                        width: "375px",
                        height: "240px",
                        borderRadius: "3%",
                        border: "3px solid white",
                        marginBottom: "10px",
                        backgroundColor: "#203a43",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        overflow: "hidden",
                        fontSize: "100px",
                        color: "white",
                        flexDirection: "column",
                        textAlign: "center",
                      }}
                    >
                      {frontSideCnic ? (
                        <img
                          src={frontSideCnic}
                          alt="Profile"
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      ) : (
                        <>
                          <i className="fas fa-id-card"></i>
                          <h5 className="my-2">Upload Front Side of Cnic</h5>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="mb-3 input-group mt-2">
                    <span className="input-group-text bg-white">
                      <i className="fas fa-image"></i>
                    </span>
                    <input
                      type="file"
                      className="form-control"
                      id="frontSideCnic"
                      onChange={handleUploadFrontCinc}
                    />
                  </div>

                  <div
                    className="d-flex justify-content-center"
                    style={{ marginTop: 20 }}
                  >
                    <div
                      style={{
                        width: "375px",
                        height: "240px",
                        borderRadius: "3%",
                        border: "3px solid white",
                        marginBottom: "10px",
                        backgroundColor: "#203a43",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        overflow: "hidden",
                        fontSize: "100px",
                        color: "white",
                        flexDirection: "column",
                        textAlign: "center",
                      }}
                    >
                      {backSideCnic ? (
                        <img
                          src={backSideCnic}
                          alt="Profile"
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      ) : (
                        <>
                          <i className="fas fa-id-card-alt"></i>
                          <h5 className="my-2">Upload Back Side of Cnic</h5>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="mb-3 input-group mt-2">
                    <span className="input-group-text bg-white">
                      <i className="fas fa-image"></i>
                    </span>
                    <input
                      type="file"
                      className="form-control"
                      id="backSideCnic"
                      onChange={handleUploadBackCnic}
                    />
                  </div>

                  <div
                    className="d-flex align-items-center text-white"
                    style={{ marginTop: 30 }}
                  >
                    <i
                      className="fas fa-exclamation-triangle me-2"
                      style={{ fontSize: "20px", marginBottom: 65 }}
                    ></i>
                    <p>
                      Please double-check your information. Submitting invalid
                      data or fake documents will result in rejection.
                    </p>
                  </div>

                  <div className="form-check text-white">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="termsCheckbox"
                      checked={isChecked}
                      onChange={(e) => setIsChecked(e.target.checked)}
                    />
                    <label className="form-check-label" htmlFor="termsCheckbox">
                      I agree to the terms and conditions
                    </label>
                  </div>
                  <div
                    className="d-grid"
                    style={{
                      marginTop: 20,
                      display: "flex",
                      justifyContent: "center",
                      width: "100%",
                    }}
                  >
                    <div style={{ width: "100%", maxWidth: "400px" }}>
                      <ReCAPTCHA
                        sitekey="6LcJTx4rAAAAAMLiXT1eAp_CGL3VLgeG3NaDokGh"
                        onChange={handleCaptchaChange}
                        style={{ width: "100%" }}
                      />
                    </div>
                  </div>

                  {/* Register Button */}
                  <div className="d-grid" style={{ marginTop: 20 }}>
                    <button type="submit" className="btn btn-outline-light">
                      <i className="fas fa-user-plus me-2"></i>Register
                    </button>
                  </div>
                  <div className="text-center mt-2">
                    <p className="text-white">
                      Already have an account?{" "}
                      <Link
                        to="/login-signup"
                        className="text-decoration-none"
                        onClick={handleAlreadyLogin}
                      >
                        Login
                      </Link>
                    </p>
                  </div>
                </form>
              </>
            ) : (
              <>
                <div
                  className="text-center text-white mb-3"
                  style={{ marginTop: 50 }}
                >
                  <h1
                    style={{
                      fontSize: "2rem",
                      fontWeight: "bold",
                      letterSpacing: "2px",
                    }}
                  >
                    LOGIN
                  </h1>
                  <p style={{ opacity: 0.8, fontSize: "1.1rem" }}>
                    Welcome back! Please enter your credentials to continue.
                  </p>
                </div>

                <form
                  onSubmit={handleLogin}
                  className="container text-white p-3 rounded"
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.05)",
                    boxShadow: "0 0 15px rgba(0, 0, 0, 0.5)",
                    backdropFilter: "blur(5px)",
                  }}
                >
                  <div className="text-center mb-4 mt-4">
                    <div className="d-flex flex-column flex-md-row justify-content-center gap-2">
                      <button
                        type="button"
                        className={`btn w-100 w-md-auto ${
                          loginType === "email"
                            ? "btn-light text-dark"
                            : "btn-outline-light"
                        }`}
                        onClick={() => setLoginType("email")}
                      >
                        Login with Email
                      </button>
                      <div className="text-white fw-bold">OR</div>
                      <button
                        type="button"
                        className={`btn w-100 w-md-auto ${
                          loginType === "cnic"
                            ? "btn-light text-dark"
                            : "btn-outline-light"
                        }`}
                        onClick={() => setLoginType("cnic")}
                      >
                        Login with CNIC
                      </button>
                    </div>
                  </div>

                  {loginType === "email" && (
                    <div className="mb-3 input-group">
                      <span className="input-group-text bg-white">
                        <i className="fas fa-envelope"></i>
                      </span>
                      <input
                        type="email"
                        className="form-control"
                        placeholder="Email"
                        value={lemail}
                        onChange={(e) => setlEmail(e.target.value)}
                        required
                        pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                        title="Please enter a valid email address"
                      />
                    </div>
                  )}

                  {loginType === "cnic" && (
                    <div className="mb-3 input-group">
                      <span className="input-group-text bg-white">
                        <i className="fas fa-id-card"></i>
                      </span>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="xxxxx-xxxxxxx-x"
                        value={lcnic}
                        onChange={(e) => setlCnic(e.target.value)}
                        required
                      />
                    </div>
                  )}

                  {/* Password field */}
                  <div className="mb-3 input-group">
                    <span className="input-group-text bg-white">
                      <i className="fas fa-lock"></i>
                    </span>
                    <input
                      type={showlPassword ? "text" : "password"}
                      className="form-control"
                      placeholder="Password"
                      value={lpassword}
                      onChange={(e) => setlPassword(e.target.value)}
                      required
                      minLength={8}
                    />
                    <span
                      className="input-group-text bg-white"
                      style={{ cursor: "pointer" }}
                      onClick={() => setShowlPassword(!showlPassword)}
                    >
                      <i
                        className={`fas ${
                          showlPassword ? "fa-eye-slash" : "fa-eye"
                        }`}
                      ></i>
                    </span>
                  </div>
                  <div className="form-check text-white">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="termsCheckbox"
                      checked={isRemeber}
                      onChange={(e) => setIsRemeber(e.target.checked)}
                    />
                    <label className="form-check-label" htmlFor="termsCheckbox">
                      Keep me signed in
                    </label>
                  </div>

                  <div className="d-grid mt-3">
                    <button type="submit" className="btn btn-outline-light">
                      <i className="fas fa-sign-in-alt me-2"></i>Login
                    </button>
                  </div>
                  <div className="text-end mt-3">
                    <button
                      type="button"
                      className="btn btn-link text-white-50 fw-semibold p-0 m-0"
                      style={{ fontSize: "0.9rem" }}
                      onClick={openForgetPasswordModal}
                    >
                      Forgot Password?
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      </div>

      <div
        className="modal fade"
        id="forgetPasswordModal"
        tabIndex="-1"
        aria-labelledby="forgetPasswordModalLabel"
        aria-hidden="true"
        data-bs-backdrop="static"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="forgetPasswordModalLabel">
                Forget Password Request
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={() => {
                  // Reset email when closing
                  setForgetEmail("");
                }}
              ></button>
            </div>
            <div className="modal-body">
              <form onSubmit={(e) => e.preventDefault()}>
                <div className="mb-3">
                  <label htmlFor="forgetEmailInput" className="form-label">
                    <strong>Enter Your Email</strong>
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="forgetEmailInput"
                    value={forgetEmail}
                    onChange={(e) => setForgetEmail(e.target.value)}
                    required
                  />
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
                onClick={() => setForgetEmail("")}
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={verifyForgetPassword}
                disabled={!forgetEmail.trim()} // Disable if empty
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Signup;
