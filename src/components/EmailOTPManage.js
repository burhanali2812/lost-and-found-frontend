import { useState, useEffect, useRef } from "react";
import { sendGenericEmail } from "./sendGenericEmail";
import { useNavigate, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { showToast } from "./Toastify2";
function EmailOTPManage() {
  const [timer, setTimer] = useState(120); // 2 minutes in seconds
  const [canResend, setCanResend] = useState(false);
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [currentOTP, setCurrentOTP] = useState("");
  const inputRefs = useRef([]);
  const navigate = useNavigate();
  const location = useLocation();
  const [Loading, setLoading] = useState(false);
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

  const generateOTP = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let otp = "";
    for (let i = 0; i < 6; i++) {
      otp += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return otp;
  };

  const sendOTP = () => {
    const otpGenerated = generateOTP();
    setCurrentOTP(otpGenerated);
    console.log("otpGenerated", otpGenerated);
    console.log("name", name);
    console.log("email", email);
    sendGenericEmail(email, name, "", otpGenerated, "otp");
    setTimer(120); // reset timer to 2 minutes
    setCanResend(false);
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
      const otpGenerated = generateOTP();
      setCurrentOTP(otpGenerated);
      setCanResend(true);
      return;
    }
    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  // const formatTime = (seconds) => {
  //   const m = Math.floor(seconds / 60);
  //   const s = seconds % 60;
  //   return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  // };

  const handleResend = () => {
    setLoading(true)
    sendOTP();
      setTimeout(() => {
        setLoading(false); // Hide loader
      }, 2000);
    alert("OTP resent!");
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
    debugger;
    const enteredOtp = getOtpValue();
    if (enteredOtp === currentOTP) {
      await finalSignup();
      alert("OTP Verified Successfully!");
    } else {
      alert("Invalid OTP. Please try again.");
    }
  };

  const finalSignup = async () => {
    debugger;
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
        showToast("error", data.message, 3000, "top-right");
      }
    } catch (error) {
      console.error("Error Uploading User:", error);
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
    </div>
  );
}

export default EmailOTPManage;
