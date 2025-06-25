import { useState, useEffect, useRef } from "react";
import React from "react";
import { showToast } from "./Toastify2";
import { ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import imageCompression from "browser-image-compression";
import Lottie from "lottie-react";
import successAnimation from "./success.json";
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
  const [loading, setLoading] = useState(false);
  const [forgetloading, setForgetloading] = useState(false);

  const [signupState, setSignupState] = useState(false);

  const [accountCreateAnimation, setAccountCreateAnimation] = useState(false);
  const [canResend, setCanResend] = useState(false);
  const [cnicToggle, setCnicToggle] = useState(false);
  const [personalToggle, setPersonalToggle] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [enterPasswordFields, setEnterPasswordFields] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null || "0000");

  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [timer, setTimer] = useState(60);
  const inputRefs = useRef([]);
  const [intervalId, setIntervalId] = useState(null);
  const [progress, setProgress] = useState(0);
  

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
   const handleDontHaveAccount = (e) => {
    e.preventDefault();
    setAction("signup");
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
    setLoading(true);
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
        setLoading(false);

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
          showToast("success", "Login Successfully", 3000, "top-right");
          setTimeout(() => {
            navigate("/user-verification");
          }, 1000);
        } else if (data.role === "user") {
          showToast("success", "Login Successfully", 3000, "top-right");
          setTimeout(() => {
            navigate("/notification");
          }, 1000);
        }
      } else {
        setLoading(false);
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
      const backdrops = document.querySelectorAll(".modal-backdrop");
      backdrops.forEach((backdrop) => backdrop.remove());

      document.body.classList.remove("modal-open");
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
      const modals = document.querySelectorAll(".modal");
      modals.forEach((modal) => {
        modal.style.display = "none";
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

  const handlesetActionSignIn = () => {
    setAction("signin");
  };
  const handlesetActionSignUp = () => {
    setAction("signup");
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
    setForgetloading(true);
    if (!forgetEmail.trim()) {
      showToast("error", "Email is required", 3000, "top-right");
      setForgetloading(false);
      return;
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(forgetEmail)) {
      showToast("error", "Please enter a valid email address", 3000);
      setForgetloading(false);
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
        setForgetloading(false);
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
        setForgetloading(false);
        showToast(
          "error",
          data.message || "Email not found",
          3000,
          "top-right"
        );
      }
    } catch (error) {
      setForgetloading(false);
      console.error("Error verifying email:", error);
      showToast("error", "Something went wrong. Try again.", 3000, "top-right");
    }
  };
  const handleLoginRedirect = () => {
    handlesetActionSignIn();
    setAccountCreateAnimation(false);
    navigate("/login-signup");
  };

  const sendOTP = async () => {
    try {
      const response = await fetch(
        "https://lost-and-found-backend-xi.vercel.app/auth/send-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: email, name: name }),
        }
      );
      if (response.ok) {
        setTimer(60);
        setCanResend(false);
        setLoading(false);
        setSignupState(true);

        const id = setInterval(() => {
          setTimer((prev) => {
            if (prev <= 1) {
              clearInterval(id);
              setCanResend(true);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);

        setIntervalId(id);
      } else {
        setLoading(false);
        const data = await response.json();
        showToast(
          "error",
          data.message || "Failed to send OTP",
          3000,
          "top-right"
        );
      }
    } catch (error) {
      setLoading(false);
      console.error("Error:", error);
      showToast("error", "Network Error. Try again.", 3000, "top-right");
    }
  };

  const handleResend = () => {
    sendOTP();
    setTimeout(() => {}, 2000);
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
    setVerifyLoading(true);
    const enteredOtp = getOtpValue();
    try {
      const response = await fetch(
        "https://lost-and-found-backend-xi.vercel.app/auth/verify-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: email, otp: enteredOtp }),
        }
      );
      const data = await response.json();
      if (response.ok) {
        await handlePersonalInformation();
        showToast("success", "OTP Verified Successfully!", 3000, "top-right");
        setSignupState(false);
        setCnicToggle(true);
        setVerifyLoading(false);
        setPersonalToggle(true);
      } else {
        setVerifyLoading(false);

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
  const handlePersonalInformation = async () => {
    try {
      const response = await fetch(
        "https://lost-and-found-backend-xi.vercel.app/auth/signup/step1",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: name,
            email: email,
            phone: contact,
            cnic: cnic,
            address: address,
          }),
        }
      );
      const data = await response.json();
      setCurrentUserId(data.userId);
      if (response.ok) {
        setProgress(50)
        showToast(
          "success",
          "Personal Information save Successfully!",
          3000,
          "bottom-center"
        );
      } else {
        showToast(
          "error",
          data.message || "Please try again.",
          3000,
          "top-right"
        );
      }
    } catch (error) {
      console.error("Error:", error);
      showToast("error", "Network Error. Try again.", 3000, "top-right");
    }
  };
  const sendOTpWithModal = async (e) => {
    e.preventDefault();
    setLoading(true);
    const fields = [email, name, contact, cnic, address];
    if (fields.some((field) => field === "")) {
      showToast("warning", "All Fields Are Required", 3000, "top-right");
      setLoading(false);
      return;
    }
    const cnicPattern = /^\d{5}-\d{7}-\d{1}$/;
    if (!cnicPattern.test(cnic)) {
      showToast(
        "error",
        "Please enter a valid CNIC number in the format xxxxx-xxxxxxx-x",
        3000
      );
      setLoading(false);
      return;
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      showToast("error", "Please enter a valid email address", 3000);
      setLoading(false);
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
      setLoading(false);
      return;
    }

    try {
      const response2 = await fetch(
        "https://lost-and-found-backend-xi.vercel.app/auth/checkExistEmail",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, cnic }),
        }
      );
      const data = await response2.json();
      if (response2.ok) {
        try {
          await sendOTP();
          setProgress(25)
          // setSignupState(true);
          setLoading(false);
          inputRefs.current[0]?.focus();

          if (timer === 0) {
            setCanResend(true);
          }
        } catch (otpError) {
          console.error("Error sending OTP:", otpError);
          showToast(
            "error",
            "Failed to send OTP. Please try again.",
            3000,
            "top-right"
          );
        }
      } else {
        showToast(
          "error",
          data.message || "Email not found",
          3000,
          "top-right"
        );
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.error("Error verifying email:", error);
      showToast("error", "Something went wrong. Try again.", 3000, "top-right");
    }
  };

  const handleCloseCnicOpenPassword = async () => {
    await handleUploadImages();
    setCnicToggle(false);
    setEnterPasswordFields(true);
  };

  const handleUploadImages = async () => {
    setLoading(true);
    if (!profileImage) {
      showToast(
        "warning",
        "Please upload your profile picture.",
        3000,
        "top-right"
      );
      setLoading(false);
      return;
    }
    if (!frontSideCnic) {
      showToast(
        "warning",
        "Please upload the front side of your CNIC",
        3000,
        "top-right"
      );
      setLoading(false);
      return;
    }
    if (!backSideCnic) {
      showToast(
        "warning",
        "Please upload the back side of your CNIC.",
        3000,
        "top-right"
      );
      setLoading(false);
      return;
    }

    const formData = new FormData();
    if (profileImageDB) formData.append("profileImage", profileImageDB);
    if (frontSideCnicDB) formData.append("frontCnic", frontSideCnicDB);
    if (backSideCnicDB) formData.append("backCnic", backSideCnicDB);
    if (currentUserId) formData.append("userId", currentUserId);

    try {
      const response = await fetch(
        "https://lost-and-found-backend-xi.vercel.app/auth/signup/step2",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (response.ok) {
        setProgress(75)
        showToast(
          "success",
          "Documents Uploaded Successfully",
          3000,
          "top-right"
        );
        setLoading(false);
      } else {
        setLoading(false);
        showToast("error", data.message || "Signup failed", 3000, "top-right");
      }
    } catch (error) {
      setLoading(false);
      console.error("Error Uploading User:", error);
      showToast("error", "Network or Server Error", 3000, "top-right");
    }
  };
  const handlePasswordGenerated = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (password !== confirmPassword) {
      showToast(
        "warning",
        "Confirm Password Does Not Match",
        3000,
        "top-right"
      );
      setLoading(false);
      return;
    }
    if (!captchaValue) {
      showToast("warning", "Please complete the reCAPTCHA.", 3000, "top-right");
      setLoading(false);
      return;
    }
    if (!isChecked) {
      setLoading(false);
      showToast(
        "warning",
        "Please agree to the terms and conditions.",
        3000,
        "top-right"
      );
      return;
    }

    try {
      const response = await fetch(
        "https://lost-and-found-backend-xi.vercel.app/auth/signup/step3",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: currentUserId,
            password: password,
            token: captchaValue,
          }),
        }
      );
      const data = await response.json();
      if (response.ok) {
        setLoading(false);
        setAccountCreateAnimation(true);
        setProgress(100)
        handleDontHaveAccount();
        showToast(
          "success",
          "Account Created Successfully!",
          3000,
          "top-right"
        );
      } else {
        setLoading(false);
        showToast(
          "error",
          data.message || "Please try again.",
          3000,
          "top-right"
        );
      }
    } catch (error) {
      setLoading(false);
      console.error("Error:", error);
      showToast("error", "Network Error. Try again.", 3000, "top-right");
    }
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
                 {
                  progress === 0 ? (""):(
                     <div
                    className="progress"
                    role="progressbar"
                    aria-label="Example with label"
                    aria-valuenow="25"
                    aria-valuemin="0"
                    aria-valuemax="100"
                    style={{ height: "11px" }} // sets overall height
                  >
                    <div
                      className="progress-bar bg-warning text-black fw-bold"
                      style={{ width: `${progress}%`, height: "11px", fontSize: "10px" }}
                    >
                      {`${progress}%`}
                    </div>
                  </div>
                  )
                 }

                  <p style={{ opacity: 0.8, fontSize: "1.1rem" }}>
                    Join our Lost and Found community! Create your account to
                    easily report and claim lost items.
                  </p>
                </div>

                <form
                  //onSubmit={handleRegister}
                  className="container text-white p-3 rounded"
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.05)",
                    boxShadow: "0 0 15px rgba(0, 0, 0, 0.5)",
                    backdropFilter: "blur(5px)",
                  }}
                >
                  {/* Profile Image */}

                  {!personalToggle && (
                    <>
                      {/* Name */}
                      <p
                        style={{
                          fontSize: "1.1rem",
                          fontWeight: "bold",
                          letterSpacing: "1px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "8px",
                        }}
                      >
                        <i className="fas fa-user-circle"></i>
                        PERSONAL INFORMATION
                      </p>

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

                      <div className="d-grid">
                        <button
                          className="btn btn-outline-light"
                          onClick={sendOTpWithModal}
                          disabled={loading}
                        >
                          {loading === false ? (
                            <>
                              Let’s Verify Your Email
                              <i className="fas fa-angle-double-right ms-1"></i>
                            </>
                          ) : (
                            <>
                              Generating OTP...
                              <div
                                className="spinner-border spinner-border-sm text-light ms-2"
                                role="status"
                              ></div>
                            </>
                          )}
                        </button>
                      </div>
                    </>
                  )}

                  <div>
                    {cnicToggle && (
                      <>
                        <p
                          style={{
                            fontSize: "1.1rem",
                            fontWeight: "bold",
                            letterSpacing: "1px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "8px",
                          }}
                        >
                          <i className="fas fa-folder"></i>
                          DOCUMENTS UPLOAD
                        </p>

                        <div
                          className="d-flex justify-content-center"
                          style={{ marginTop: 20 }}
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
                            onChange={(e) =>
                              compressAndSetImage(
                                e,
                                setProfileImage,
                                setProfileImageDB
                              )
                            }
                          />
                        </div>
                        <div className="color-white">
                          <div className="d-flex align-items-center text-white">
                            <i
                              className="fas fa-exclamation-circle me-2"
                              style={{ fontSize: "20px", marginBottom: 45 }}
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
                          style={{ marginTop: 10 }}
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
                                <h5 className="my-2">
                                  Upload Front Side of Cnic
                                </h5>
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
                            onChange={(e) =>
                              compressAndSetImage(
                                e,
                                setFrontSideCnic,
                                setFrontSideCnicDB
                              )
                            }
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
                                <h5 className="my-2">
                                  Upload Back Side of Cnic
                                </h5>
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
                            onChange={(e) =>
                              compressAndSetImage(
                                e,
                                setBackSideCnic,
                                setBackSideCnicDB
                              )
                            }
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
                            Please double-check your information. Submitting
                            invalid data or fake documents will result in
                            rejection.
                          </p>
                        </div>

                        {/* Register Button */}
                        <div className="d-grid" style={{ marginTop: 20 }}>
                          <button
                            type="submit"
                            className="btn btn-outline-light"
                            onClick={handleCloseCnicOpenPassword}
                            disabled={loading}
                          >
                            {loading === false ? (
                              <>
                                Continue to Password
                                <i className="fas fa-eye ms-2"></i>
                              </>
                            ) : (
                              <>
                                Uploading documents...
                                <div
                                  className="spinner-border spinner-border-sm text-dark ms-2"
                                  role="status"
                                ></div>
                              </>
                            )}
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                  {enterPasswordFields && (
                    <>
                      <p
                        style={{
                          fontSize: "1.1rem",
                          fontWeight: "bold",
                          letterSpacing: "1px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "8px",
                        }}
                      >
                        <i className="fas fa-lock"></i>
                        GENERATE PASSWORD
                      </p>
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
                        <div className="mb-2" style={{ marginTop: "-10px" }}>
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
                          <div
                            className="progress mt-1"
                            style={{ height: "5px" }}
                          >
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
                      <div className="form-check text-white">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="termsCheckbox"
                          checked={isChecked}
                          onChange={(e) => setIsChecked(e.target.checked)}
                        />
                        <label
                          className="form-check-label"
                          htmlFor="termsCheckbox"
                        >
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

                      <div className="d-grid" style={{ marginTop: 20 }}>
                        <button
                          type="submit"
                          className="btn btn-outline-light"
                          onClick={handlePasswordGenerated}
                          disabled={loading}
                        >
                          {loading === false ? (
                            <>
                              <i className="fas fa-user-plus me-2"></i>
                              Finish Signup
                            </>
                          ) : (
                            <>
                              <i className="fas fa-user-plus me-2"></i>
                              Finishing up...
                              <div
                                className="spinner-border spinner-border-sm text-light ms-2"
                                role="status"
                              ></div>
                            </>
                          )}
                        </button>
                      </div>
                    </>
                  )}

                  {enterPasswordFields || cnicToggle ? null : (
                    <div className="text-center mt-3">
                      <p className="text-white">
                        Already have an account?{" "}
                        <Link
                          to="/login-signup"
                          className="text-decoration-none"
                          onClick={handleAlreadyLogin}
                        >
                          Sign in
                        </Link>
                      </p>
                    </div>
                  )}
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
                  <div className=" input-group">
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
                  
                  <div className="text-end mt-1">
                    <button
                      type="button"
                      className="btn btn-link text-white-50 fw-semibold p-0 m-0"
                      style={{ fontSize: "0.9rem" }}
                      onClick={openForgetPasswordModal}
                    >
                      Forgot Password?
                    </button>
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
                    <button
                      type="submit"
                      className="btn btn-outline-light"
                      disabled={loading}
                    >
                      <i className="fas fa-sign-in-alt me-2"></i>
                      {loading ? (
                        <>
                          Verifying...
                          <div
                            className="spinner-border spinner-border-sm text-light ms-2"
                            role="status"
                          ></div>
                        </>
                      ) : (
                        "Login"
                      )}
                    </button>
                  </div>

                   <div className="text-center mt-3">
                      <p className="text-white">
                        Don't have an account?{" "}
                        <Link
                          to="/login-signup"
                          className="text-decoration-none"
                          onClick={handleDontHaveAccount}
                        >
                          Sign up
                        </Link>
                      </p>
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
                disabled={forgetloading} // Disable if empty
              >
                {forgetloading === false ? (
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

      {signupState && (
        <div
          className="modal show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div
            className="modal-dialog modal-dialog-centered"
            style={{
              width: "90vw", // 90% of the viewport width
              maxWidth: "370px", // limit on large screens
              margin: "auto",
            }}
          >
            <div
              className="modal-content text-white"
              style={{
                background: "linear-gradient(45deg, #0f2027, #203a43, #2c5364)",
              }}
            >
              <div className="modal-header">
                <h5 className="modal-title">VERIFY OTP</h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setSignupState(false)}
                ></button>
              </div>

              <div className="modal-body">
                <p style={{ opacity: 0.85, fontSize: "0.9rem" }}>
                  We've sent a One-Time Password (OTP) to your registered email.
                  Enter it below to verify your identity.
                </p>
                <p
                  style={{
                    opacity: 0.7,
                    fontSize: "0.9rem",
                    marginTop: "6px",
                    textAlign: "center",
                  }}
                >
                  <i className="fas fa-clock me-1"></i> OTP will expire in
                </p>

                <div className="text-center mt-2">
                  {!canResend ? (
                    <div className="d-flex justify-content-center align-items-center">
                      <div
                        className="mt-1"
                        style={{
                          width: "75px",
                          height: "75px",
                          borderRadius: "50%",
                          border: "6px solid white",
                          backgroundColor: "transparent",
                          color: "#ffc107",
                          fontSize: "32px",
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
                          <i className="fas fa-paper-plane me-2"></i> Resend OTP
                        </span>
                      </div>

                      <div className="mt-2">
                        <p
                          className="text-light"
                          style={{ fontSize: "0.9rem" }}
                        >
                          <i className="fas fa-info-circle me-2"></i> Didn't
                          receive the OTP? Check your spam folder or try
                          resending.
                        </p>
                      </div>
                    </>
                  )}
                </div>

                <div className="d-flex justify-content-center gap-2 mt-4">
                  {otp.map((val, index) => (
                    <input
                      key={index}
                      type="text"
                      maxLength="1"
                      className="form-control text-center"
                      style={{
                        width: "36px",
                        height: "40px",
                        fontSize: "0.7rem",
                        fontWeight: "bold",
                        borderRadius: "1px",
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

                <div className="text-center mt-4">
                  <button
                    className="btn btn-outline-warning fw-bold d-flex align-items-center justify-content-center px-3 py-2 mx-auto btn-sm"
                    onClick={verifyOTP}
                  >
                    <i className="fas fa-key me-2"></i>
                    {verifyLoading === false ? (
                      "Verify OTP"
                    ) : (
                      <>
                        Verifying OTP...
                        <div
                          className="spinner-border spinner-border-sm text-dark ms-2"
                          role="status"
                        ></div>
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setSignupState(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {accountCreateAnimation && (
        <>
          <div
            className="offcanvas offcanvas-bottom show"
            tabIndex="-1"
            style={{
              height: "47vh",
              visibility: "visible",
              backgroundColor: "#fff",
              borderTopLeftRadius: "20px",
              borderTopRightRadius: "20px",
            }}
          >
            <div className="offcanvas-body position-relative text-center d-flex flex-column justify-content-center align-items-center ">
              {/* Close Button */}
              <button
                className="btn-close position-absolute"
                style={{ top: 10, right: 15 }}
                onClick={handleLoginRedirect}
              ></button>

              {/* Animation */}
              <Lottie
                animationData={successAnimation}
                loop={true}
                style={{ height: 150 }}
              />

              {/* Message */}
              <h4 className="mt-3 text-success">
                🎉 Account Created Successfully!
              </h4>
              <p className="mt-3 px-4" style={{ maxWidth: "600px" }}>
                Thank you for signing up! We're excited to have you as part of
                our <strong>Lost and Found</strong> community.
              </p>

              {/* Button */}
              <button
                onClick={handleLoginRedirect}
                className="btn btn-outline-success mt-1 d-flex align-items-center gap-2"
              >
                <i className="fas fa-sign-in-alt"></i>
                Go to Login
              </button>
            </div>
          </div>

          {/* Backdrop */}
          <div
            className="offcanvas-backdrop fade show"
            onClick={() => setAccountCreateAnimation(false)}
          />
        </>
      )}
    </>
  );
}

export default Signup;
