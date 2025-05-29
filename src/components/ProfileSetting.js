import React, { useState, useEffect } from "react";

function ProfileSetting() {
  const [currentUser, setCurrentUser] = useState(null);
  const userId = localStorage.getItem("userId");

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
  return (
    <div>
      <div className="container">
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
                currentUser?.isVerified === "accepted" ? "#28a745" : "#dc3545",
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
              <div className="col-12  mb-3">
                <span className="bg-dark  text-white p-1 rounded fw-bold d-inline-flex align-items-center">
                  <span
                    className="bg-dark  rounded-circle d-flex justify-content-center align-items-center me-2"
                    style={{ width: "25px", height: "25px" }}
                  >
                    <i className="fas fa-id-badge text-white"></i>
                  </span>
                  PERSONAL INFORMATION
                </span>
              </div>
            </div>

            <div className="row text-dark px-2 px-md-3">
              <div className="col-12 col-md-6 col-lg-4 mb-2">
                <b>Email:</b> {currentUser.email || "Not provided"}
              </div>
              <div className="col-12 col-md-6 col-lg-4 mb-2">
                <b>CNIC:</b> {currentUser.cnic || "Not provided"}
              </div>
              <div className="col-12 col-md-6 col-lg-4 mb-2">
                <b>Contact:</b> {currentUser.phone || "Not provided"}
              </div>
              <div className="col-12 col-md-6 col-lg-4 mb-2">
                <b>Address:</b> {currentUser.address || "Not provided"}
              </div>
              <div className="col-12 col-md-6 col-lg-4 mb-2">
                <b>Created At:</b>{" "}
                {currentUser.createdAt
                  ? new Date(currentUser.createdAt).toLocaleDateString()
                  : "Not provided"}
              </div>
            </div>

           <div className="row mt-4 g-2">
            <div className="col-md-4">
              <div className="card shadow-sm border-0">
                <div className="card-header bg-dark text-white fw-bold text-center">
                  Front Side of CNIC
                </div>
                <div className="card-body d-flex align-items-center justify-content-center" style={{ height: "260px" }}>
                  {currentUser.frontCnic ? (
                    <img
                      src={currentUser.frontCnic}
                      alt="CNIC Front"
                      className="w-100 h-100 object-fit-cover"
                    />
                  ) : (
                    <div className="text-center w-100 text-muted">
                      <i className="fas fa-id-card fa-2x mt-4"></i>
                      <p className="mt-2">Front CNIC not uploaded</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card shadow-sm border-0">
                <div className="card-header bg-dark text-white fw-bold text-center">
                  Back Side of CNIC
                </div>
                <div className="card-body d-flex align-items-center justify-content-center" style={{ height: "260px"}}>
                  {currentUser.backCnic ? (
                    <img
                      src={currentUser.backCnic}
                      alt="CNIC Back"
                      className="w-100 h-100 object-fit-cover"
                    />
                  ) : (
                    <div className="text-center w-100 text-muted">
                      <i className="fas fa-id-card-alt fa-2x mt-4"></i>
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
  );
}

export default ProfileSetting;
