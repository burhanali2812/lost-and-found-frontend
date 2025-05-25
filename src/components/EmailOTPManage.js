import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { showToast } from "./Toastify2";

function EmailOTPManage() {
  // State management
  const [timer, setTimer] = useState(120);
  const [canResend, setCanResend] = useState(false);
  const [otp, setOtp] = useState(new Array(6).fill(''));
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [strength, setStrength] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isReady, setIsReady] = useState(false);
  const inputRefs = useRef([]);
  const navigate = useNavigate();
  const location = useLocation();

  // Get data from location state
  const state = location.state || {};
  const {
    profileImage,
    frontCnic,
    backCnic,
    name = "",
    email = "",
    cnic = "",
    address = "",
    password = "",
    phone = "",
    token = "",
    forgetName = "",
    forgetEmail = "",
    action = "",
    forgetToken = ""
  } = state;

  // Check if we have required data
  useEffect(() => {
    const requiredData = action === "ForgetPassword" 
      ? forgetEmail && forgetName 
      : email && name;
    
    if (requiredData) {
      setIsReady(true);
      sendOTP();
    } else {
      showToast("error", "Missing required information", 3000, "top-right");
      navigate("/login-signup");
    }
  }, []);

  // Send OTP function
  const sendOTP = async () => {
    setIsLoading(true);
    const otpName = action === "ForgetPassword" ? forgetName : name;
    const otpEmail = action === "ForgetPassword" ? forgetEmail : email;
    
    try {
      const response = await fetch(
        "https://lost-and-found-backend-xi.vercel.app/auth/send-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name: otpName, email: otpEmail }),
        }
      );
      
      if (response.ok) {
        setTimer(120);
        setCanResend(false);
        inputRefs.current[0]?.focus();
      } else {
        const data = await response.json();
        showToast("error", data.message || "Failed to send OTP", 3000, "top-right");
      }
    } catch (error) {
      console.error("Error:", error);
      showToast("error", "Network Error. Try again.", 3000, "top-right");
    } finally {
      setIsLoading(false);
    }
  };

  // Timer countdown
  useEffect(() => {
    if (timer <= 0) {
      setCanResend(true);
      return;
    }
    
    const interval = setInterval(() => {
      setTimer(prev => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  // OTP input handling
  const handleChange = (e, index) => {
    const value = e.target.value;
    if (!/^[a-zA-Z0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.toUpperCase();
    setOtp(newOtp);

    if (value && index < 5 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  // OTP verification
  const verifyOTP = async () => {
    const enteredOtp = otp.join('');
    if (enteredOtp.length !== 6) {
      showToast("error", "Please enter a complete 6-digit OTP", 3000, "top-right");
      return;
    }

    setIsLoading(true);
    const actualEmail = action === "ForgetPassword" ? forgetEmail : email;
    
    try {
      const response = await fetch(
        "https://lost-and-found-backend-xi.vercel.app/auth/verify-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: actualEmail, otp: enteredOtp }),
        }
      );
      
      const data = await response.json();
      
      if (response.ok) {
        if (action === "ForgetPassword") {
          openChangePasswordModal();
        } else {
          await finalSignup();
        }
      } else {
        showToast("error", data.message || "Invalid OTP", 3000, "top-right");
      }
    } catch (error) {
      console.error("Error:", error);
      showToast("error", "Network Error. Try again.", 3000, "top-right");
    } finally {
      setIsLoading(false);
    }
  };

  const openChangePasswordModal = () => {
    const modalElement = document.getElementById("changePasswordModal");
    const modal = new window.bootstrap.Modal(modalElement);
    modal.show();
  };

  const modelClosed = () => {
    navigate("/login-signup");
  };

  const finalSignup = async () => {
    setIsLoading(true);
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("cnic", cnic);
    formData.append("address", address);
    formData.append("password", password);
    formData.append("phone", phone);
    formData.append("token", token);

    if (profileImage) formData.append("profileImage", profileImage);
    if (frontCnic) formData.append("frontCnic", frontCnic);
    if (backCnic) formData.append("backCnic", backCnic);

    try {
      const response = await fetch(
        "https://lost-and-found-backend-xi.vercel.app/auth/signup",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (response.ok) {
        showToast("success", "User Registered Successfully", 3000, "top-right");
        navigate("/login-signup");
      } else {
        showToast("error", data.message || "Signup failed", 3000, "top-right");
      }
    } catch (error) {
      console.error("Error Uploading User:", error);
      showToast("error", "Network or Server Error", 3000, "top-right");
    } finally {
      setIsLoading(false);
    }
  };

  const checkPasswordStrength = (password) => {
    if (password.length < 6) return "Weak";
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
    setNewPassword(value);
    setStrength(checkPasswordStrength(value));
  };

  const passwordChange = async () => {
    if (newPassword !== confirmPassword) {
      showToast("warning", "Passwords don't match!", 3000, "top-right");
      return;
    }

    if (strength === "Weak") {
      showToast("warning", "Password is too weak", 3000, "top-right");
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await fetch(
        "https://lost-and-found-backend-xi.vercel.app/auth/getUserEmail",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token: forgetToken,
            newPassword: confirmPassword,
          }),
        }
      );
      
      if (response.ok) {
        showToast("success", "Password changed successfully!", 3000, "top-right");
        navigate("/login-signup");
      } else {
        showToast("error", "Error changing password!", 3000, "top-right");
      }
    } catch (error) {
      console.error("Error:", error);
      showToast("error", "Network or Server Error", 3000, "top-right");
    } finally {
      setIsLoading(false);
    }
  };

  // Format timer as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Render only when data is ready
  if (!isReady) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="position-relative">
      {/* Loading Overlay */}
      {isLoading && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center bg-dark bg-opacity-75"
          style={{ zIndex: 1055 }}
        >
          <div className="text-center">
            <div className="spinner-border text-warning" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="text-white mt-2">Processing your request...</p>
          </div>
        </div>
      )}

      {/* Back Button */}
      <button 
        className="btn btn-link text-white position-absolute top-0 start-0 m-3"
        onClick={() => navigate(-1)}
        disabled={isLoading}
      >
        <i className="fas fa-arrow-left me-2"></i> Back
      </button>

      {/* Main Content */}
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
              overflowY: "auto",
              maxHeight: "100%",
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            <div className="text-center text-white mb-3" style={{ marginTop: 50 }}>
              <h1
                style={{
                  fontSize: "2rem",
                  fontWeight: "bold",
                  letterSpacing: "2px",
                }}
              >
                <i className="fas fa-lock-open me-2"></i>
                VERIFY OTP
              </h1>
              <p style={{ opacity: 0.85, fontSize: "1.1rem" }}>
                We've sent a One-Time Password (OTP) to your registered email.
                Enter it below to verify your identity.
              </p>
              <p
                style={{ opacity: 0.7, fontSize: "0.95rem", marginTop: "10px" }}
              >
                <i className="fas fa-clock me-2"></i>
                OTP will expire in
              </p>

              <div className="text-center mt-4">
                {!canResend ? (
                  <div className="d-flex justify-content-center align-items-center">
                    <div
                      className="mt-1"
                      style={{
                        width: "100px",
                        height: "100px",
                        borderRadius: "50%",
                        border: "8px solid white",
                        backgroundColor: "transparent",
                        color: "#ffc107",
                        fontSize: "39px",
                        fontWeight: "bold",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {formatTime(timer)}
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="mt-2">
                      <button
                        className="btn btn-link text-warning p-0"
                        style={{
                          fontWeight: "bold",
                          fontSize: "1.05rem",
                        }}
                        onClick={handleResend}
                        disabled={isLoading}
                      >
                        <i className="fas fa-paper-plane me-2"></i>
                        Resend OTP
                      </button>
                    </div>

                    <div className="mt-2">
                      <p className="text-light" style={{ fontSize: "0.9rem" }}>
                        <i className="fas fa-info-circle me-2"></i>
                        Didn't receive the OTP? Check your spam folder.
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* OTP Input Fields */}
            <div className="d-flex justify-content-center gap-2 mt-4">
              {otp.map((val, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength="1"
                  className="form-control text-center"
                  style={{
                    width: "45px",
                    height: "50px",
                    fontSize: "1rem",
                    fontWeight: "bold",
                    borderRadius: "3px",
                    backgroundColor: "#f8f9fa",
                    border: "1px solid #ced4da",
                  }}
                  value={otp[index]}
                  ref={el => inputRefs.current[index] = el}
                  onChange={e => handleChange(e, index)}
                  onKeyDown={e => handleKeyDown(e, index)}
                  onFocus={e => e.target.select()}
                  disabled={isLoading}
                />
              ))}
            </div>

            {/* Verify Button */}
            <div className="text-center mt-4">
              <button
                className="btn btn-outline-warning fw-bold d-flex align-items-center justify-content-center px-4 py-2 mx-auto"
                onClick={verifyOTP}
                disabled={isLoading || otp.join('').length !== 6}
              >
                {isLoading ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    Verifying...
                  </>
                ) : (
                  <>
                    <i className="fas fa-key me-2"></i>
                    Verify OTP
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Change Password Modal */}
      <div
        className="modal fade"
        id="changePasswordModal"
        tabIndex="-1"
        aria-labelledby="changePasswordModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="changePasswordModalLabel">
                Change Password
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                disabled={isLoading}
              ></button>
            </div>
            <div className="modal-body">
              <form>
                <div className="mb-3">
                  <label className="form-label">
                    <strong>New Password</strong>
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={handlePasswordChange}
                    disabled={isLoading}
                  />
                </div>
                {newPassword && (
                  <div className="mt-2">
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

                <div className="mb-3 mt-3">
                  <label className="form-label">
                    <strong>Confirm Password</strong>
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
                onClick={modelClosed}
                disabled={isLoading}
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={passwordChange}
                disabled={isLoading || !newPassword || !confirmPassword || newPassword !== confirmPassword}
              >
                {isLoading ? (
                  <span
                    className="spinner-border spinner-border-sm"
                    role="status"
                    aria-hidden="true"
                  ></span>
                ) : (
                  "Submit"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
}

export default EmailOTPManage;