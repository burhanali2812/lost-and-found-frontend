import { useState, useEffect, useRef } from "react";
import { sendGenericEmail } from "./sendGenericEmail";
import { useNavigate, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { showToast } from "./Toastify2";
function EmailOTPManage() {
  const [timer, setTimer] = useState(120); // 2 minutes in seconds
  const [canResend, setCanResend] = useState(false);
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [strength, setStrength] = useState("");
  const inputRefs = useRef([]);
  const navigate = useNavigate();
  const location = useLocation();
  const [Loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showcPassword, setShowcPassword] = useState(false);
  const {
    profileImage,
    frontCnic,
    backCnic,
    name,
    email,
    cnic,
    address,
    password,
    phone,
    token,
  } = location.state || {};
  const { forgetName, forgetEmail, action, forgetToken } = location.state;

  const sendOTP = async () => {
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
      } else {
        const data = await response.json();
        showToast(
          "error",
          data.message || "Failed to send OTP",
          3000,
          "top-right"
        );
      }
    } catch (error) {
      console.error("Error:", error);
      showToast("error", "Network Error. Try again.", 3000, "top-right");
    }
  };
  const modelClosed = () => {
    navigate("/login-signup");
  };

  useEffect(() => {
    setLoading(true);
    sendOTP();
    setTimeout(() => {
      setLoading(false); // Hide loader
    }, 2000);
    inputRefs.current[0]?.focus(); // auto-focus on first input
  }, []);

  useEffect(() => {
    if (timer === 0) {
      setCanResend(true);
      return;
    }
    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  const handleResend = () => {
    setLoading(true);
    sendOTP();
    setTimeout(() => {
      setLoading(false); // Hide loader
    }, 2000);
    showToast("success", "OTP Resent!", 3000, "top-right");
    setOtp(new Array(6).fill("")); // reset input boxes
    inputRefs.current[0]?.focus();
    setCanResend(false);
  };

  const handleChange = (element, index) => {
    if (!/^[a-zA-Z0-9]?$/.test(element.value)) return;

    const newOtp = [...otp];
    newOtp[index] = element.value.toUpperCase();
    setOtp(newOtp);

    if (element.value !== "" && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (
      e.key === "Backspace" &&
      otp[index] === "" &&
      inputRefs.current[index - 1]
    ) {
      inputRefs.current[index - 1].focus();
    }
  };

  const getOtpValue = () => otp.join("");

  const verifyOTP = async () => {
    setLoading(true);
    const enteredOtp = getOtpValue();
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
      const data = await response.json(); // Get server response
      if (response.ok) {
        if (action === "ForgetPassword") {
          openChangePasswordModal();
        } else {
          await finalSignup();
          showToast("success", "OTP Verified Successfully!", 3000, "top-right");
        }
      } else {
        showToast(
          "error",
          data.message || "Invalid OTP. Please try again.",
          3000,
          "top-right"
        );
      }
    } catch (error) {
      console.error("Error:", error);
      showToast("error", "Network Error. Try again.", 3000, "top-right");
    }
    setLoading(false);
  };
  const openChangePasswordModal = () => {
    const modalElement = document.getElementById("changePasswordModal");
    const existingModal = window.bootstrap.Modal.getInstance(modalElement);
    if (existingModal) existingModal.dispose();

    const newModal = new window.bootstrap.Modal(modalElement);
    newModal.show();
  };

  const finalSignup = async () => {
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
        setLoading(false);
        showToast("success", "User Registered Successfully", 3000, "top-right");
        navigate("/login-signup");
      } else {
        setLoading(false); // Ensure loading is turned off
        showToast("error", data.message || "Signup failed", 3000, "top-right");
      }
    } catch (error) {
      setLoading(false); // Ensure loading is turned off
      console.error("Error Uploading User:", error);
      showToast("error", "Network or Server Error", 3000, "top-right");
    }
  };
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
    setNewPassword(value);
    setStrength(checkPasswordStrength(value));
  };
  const passwordChnage = async () => {
    if (newPassword !== confirmPassword) {
      showToast(
        "warning",
        "Confirm password does'nt match!",
        3000,
        "top-right"
      );
      return;
    }
    console.log("forgetToken", forgetToken);
    console.log("newPassword", newPassword);
    try {
      const response = await fetch(
        "https://lost-and-found-backend-xi.vercel.app/auth/reset-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token: forgetToken,
            newPassword: newPassword,
          }),
        }
      );
      if (response.ok) {
        setLoading(false);
        showToast(
          "success",
          "Password changed successfully!",
          3000,
          "top-right"
        );
        setTimeout(() => {
          navigate("/login-signup");
        }, 1500);
      } else {
        setLoading(false);
        showToast("error", "Error changing password!", 3000, "top-right");
      }
    } catch (error) {
      setLoading(false);
      console.error("Error Uploading User:", error);
      showToast("error", "Network or Server Error", 3000, "top-right");
    }
  };

  return (
    <div>
      {Loading && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center bg-dark bg-opacity-75"
          style={{ zIndex: 1055 }}
        >
          <button className="btn btn-dark" type="button" disabled>
            <span
              className="spinner-border spinner-border-sm me-2"
              role="status"
              aria-hidden="true"
            ></span>
            Loading...
          </button>
        </div>
      )}
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
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
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
                      {timer % 120}
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="mt-2">
                      <span
                        className="text-warning"
                        style={{
                          cursor: "pointer",
                          fontWeight: "bold",
                          fontSize: "1.05rem",
                        }}
                        onClick={handleResend}
                      >
                        <i className="fas fa-paper-plane me-2"></i>
                        Resend OTP
                      </span>
                    </div>

                    <div className="mt-2">
                      <p className="text-light" style={{ fontSize: "0.9rem" }}>
                        <i className="fas fa-info-circle me-2"></i>
                        Didn't receive the OTP? Check your spam folder or try
                        resending.
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>

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
                  ref={(el) => (inputRefs.current[index] = el)}
                  onChange={(e) => handleChange(e.target, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                />
              ))}
            </div>

            {/* Timer or Resend Section */}

            <div className="text-center mt-4">
              <button
                className="btn btn-outline-warning fw-bold d-flex align-items-center justify-content-center px-4 py-2 mx-auto"
                onClick={verifyOTP}
              >
                <i className="fas fa-key me-2"></i>
                Verify OTP
              </button>
            </div>
          </div>
        </div>
      </div>

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
                Forget Password Request
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <form>
                {/* New Password Field */}
                <div className="mb-3">
                  <label className="form-label">
                    <strong>Enter New Password</strong>
                  </label>
                  <div className="input-group">
                    <input
                      type={showPassword ? "text" : "password"}
                      className="form-control"
                      placeholder="Enter new password"
                      value={newPassword}
                      onChange={handlePasswordChange}
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
                </div>

                {/* Password Strength */}
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

                {/* Confirm Password Field */}
                <label className="form-label mt-3">
                  <strong>Enter Confirm Password</strong>
                </label>
                <div className="input-group">
                  <input
                    type={showcPassword ? "text" : "password"}
                    className="form-control"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
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
              </form>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
                onClick={modelClosed}
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={passwordChnage}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EmailOTPManage;
