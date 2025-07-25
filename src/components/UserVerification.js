import React, { useEffect, useState } from "react";

function UserVerification({ user, setUser }) {
  const [profileImage, setProfileImage] = useState(null);
  const [frontSideCnic, setFrontSideCnic] = useState(null);
  const [backSideCnic, setBackSideCnic] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  // const [user, setUser] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [contact, setContact] = useState("");
  const [cnic, setCnic] = useState("");
  const [address, setAddress] = useState("");
  const rejectionReasons = [
    "Name does not match CNIC.",
    "Name field is incomplete or invalid.",
    "CNIC number is incorrect or mismatched with CNIC image.",
    "CNIC format is invalid.",
    "Contact number is missing or invalid.",
    "Contact number is not reachable.",
    "Email is invalid or incomplete.",
    "Email is not accessible .",
    "Address is incomplete or unclear.",
    "Address does not match documents.",
    "Profile picture is missing.",
    "Profile picture is unclear or not visible.",
    "Profile picture does not show a proper face.",
    "Front CNIC image is missing.",
    "Front CNIC is unclear or blurry.",
    "CNIC front image is not genuine.",
    "Back CNIC image is missing.",
    "Back CNIC is unclear or blurry.",
    "CNIC back image is not readable.",
    "Multiple fields/images do not match the official CNIC details.",
    "Required documents are missing or fake.",
    "Information provided is not verifiable.",
    "Please upload clear and matching documents for approval.",
  ];

  const [message, setMessage] = useState("");

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
      console.log("data", data);
      const filterUsers = data.users.filter(
        (user) => user.isVerified === "requested"
      );
      setUser(filterUsers);
      console.log(filterUsers);
    } catch (error) {
      console.error("Error fetching Users:", error);
    }
  };
  useEffect(() => {
    getUser();
  }, [getUser]);

  const addNotification = async (userIds, types, reasonMessage = "") => {
    let finalMessage;
    let title;

    switch (types) {
      case "accepted":
        title = "Request Accepted";
        finalMessage =
          "Congratulations! Your request has been successfully approved. We are assisting in the search for your lost item, and if you find any lost items, please report them to us immediately so we can return them to the rightful owner. We promise that your provided information will remain secure, and any lost items will be returned to their rightful owner. Your cooperation is greatly appreciated. Thank you! \n Regards, Lost and Found Teams.";
        break;
      case "declined":
        title = "Request Declined";
        finalMessage = `Your request has been carefully reviewed but could not be approved due to the following reason: ${message}. We truly appreciate your effort and commitment to our Lost and Found system \n You now have two options: \n • You may resubmit your request by updating your profile with the correct information. \n • Or, if you prefer, you may delete your current account and register again with accurate details. \n Rest assured, your data remains secure with us. We encourage you to try again and help keep the system accurate and helpful for everyone. \n Regards, Lost and Found Teams.`;
        break;
      default:
        title = "Notification";
        finalMessage = "You have a new notification.";
    }

    try {
      const response = await fetch(
        `https://lost-and-found-backend-xi.vercel.app/auth/verifyUser/${userIds}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ isVerified: types }),
        }
      );

      if (!response.ok) {
        alert("Cannot Update User");
        return;
      }
      getUser();
    } catch (error) {
      console.error("Error fetching Users:", error);
    }

    try {
      const response = await fetch(
        "https://lost-and-found-backend-xi.vercel.app/auth/pushNotification",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            userId: userIds,
            message: finalMessage,
            title,
          }),
        }
      );
      console.log("Sending Notification To:", userIds);
      console.log("Message:", finalMessage);
      console.log("Title:", title);

      if (!response.ok) {
        alert("Cannot Push Notification");
        return;
      }
      setMessage("");
      alert("Notification Added");
    } catch (error) {
      console.error("Error Pushing Notification:", error);
    }

    // Close modals
    const messageModalEl = document.getElementById("messageModal");
    const verifyModalEl = document.getElementById("verifyUser");

    const messageModal = window.bootstrap.Modal.getInstance(messageModalEl);
    messageModal?.hide();

    const verifyModal = window.bootstrap.Modal.getInstance(verifyModalEl);
    verifyModal?.hide();

    alert("User Updated");
  };

  const openEditModal = (user) => {
    if (user) {
      setSelectedUser(user);
      const editModal = new window.bootstrap.Modal(
        document.getElementById("verifyUser")
      );
      editModal.show();

      setEmail(user.email || "");
      setName(user.name || "");
      setCnic(user.cnic || "");
      setContact(user.phone || "");
      setAddress(user.address || "");

      setProfileImage(user.profileImage);

      setFrontSideCnic(user.frontCnic);

      setBackSideCnic(user.backCnic);
    } else {
      console.error("User data is missing");
    }
  };
  const openMessageModal = (user) => {
    setSelectedUser(user);
    const messageModal = new window.bootstrap.Modal(
      document.getElementById("messageModal")
    );
    messageModal.show();
  };

  return (
    <div>
       <h1 className="text-center mt-4">
        <i class="fa-solid fa-users me-2"></i>Users Requests
      </h1>

         <div className="container table-responsive">
      <table className="table table-striped table-hover text-center my-3">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>CNIC No</th>
            <th>Contact No</th>
            <th>Email</th>
            <th>Address</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {user.length > 0 ? (
            user.map((users, index) => {
              return (
                <tr key={users._id}>
                  <td>{index + 1}</td>
                  <td>{users.name}</td>
                  <td>{users.cnic}</td>
                  <td>{users.phone}</td>
                  <td>{users.email}</td>
                  <td>{users.address}</td>
                  <td>
                    <button
                      className="btn btn-outline-success btn-sm mx-1"
                      title="Approve"
                      onClick={() => addNotification(users._id, "accepted")}
                    >
                      <i className="fas fa-check"></i>
                    </button>
                    <button
                      className="btn btn-outline-danger btn-sm mx-1"
                      title="Decline"
                      onClick={() => openMessageModal(users)}
                    >
                      <i className="fas fa-times"></i>
                    </button>
                    <button
                      className="btn btn-outline-primary btn-sm mx-1"
                      title="Details"
                      onClick={() => openEditModal(users)}
                    >
                      <i className="fas fa-info-circle"></i>
                    </button>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan="7" className="text-center">
                No Verification Request Available
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <div
        className="modal fade"
        id="verifyUser"
        tabIndex="-1"
        aria-labelledby="verifyUserLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-lg">
          <div className="modal-content bg-dark text-light rounded-4 shadow">
            <div className="modal-header border-0">
              <h5 className="modal-title" id="verifyUserLabel">
                <i className="fas fa-user-check me-2 text-success"></i>Verify
                User | Lost & Found
              </h5>
              <button
                type="button"
                className="btn-close btn-close-white"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <form className="container text-dark p-3 rounded">
                <div className="d-flex flex-column flex-md-row align-items-start mt-4 px-3 text-white">
                  {/* Profile Image */}
                  <div
                    style={{
                      width: "125px",
                      height: "150px",
                      borderRadius: "5%",
                      border: "3px solid white",
                      backgroundColor: "#203a43",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      overflow: "hidden",
                      fontSize: "80px",
                      color: "white",
                      marginBottom: "15px", // Space below image for mobile
                      marginRight: "0",
                    }}
                    className="me-md-4" // Margin on right for medium and above
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
                      <i className="fas fa-user"></i>
                    )}
                  </div>

                  {/* Text Info */}
                  <div className="flex-grow-1">
                    <div className="mb-2">
                      <b>Name:</b> {name || "Loading..."}
                    </div>
                    <div className="mb-2">
                      <b>CNIC No:</b> {cnic || "Loading..."}
                    </div>
                    <div className="mb-2">
                      <b>Contact:</b> {contact || "Loading..."}
                    </div>
                    <div className="mb-2">
                      <b>Email:</b> {email || "Loading..."}
                    </div>
                    <div className="mb-2">
                      <b>Address:</b> {address || "Loading..."}
                    </div>
                  </div>
                </div>

                <hr style={{ border: "1px solid white", margin: "10px 0" }} />

                <div className="text-white mb-1">
                  <p>
                    <b>CNIC Images:</b>
                  </p>
                </div>

                <div className="d-flex justify-content-center flex-wrap gap-3">
                  {/* Front Side CNIC */}
                  <div
                    style={{
                      width: "350px", // Front-specific width
                      height: "230px", // Front-specific height
                      borderRadius: "3%",
                      border: "3px solid white",
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
                        alt="CNIC Front"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      <>
                        <i className="fas fa-id-card"></i>
                        <h5 className="my-2">Front Side of CNIC</h5>
                      </>
                    )}
                  </div>

                  <div
                    style={{
                      width: "350px",
                      height: "230px",
                      borderRadius: "3%",
                      border: "3px solid white",
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
                        alt="CNIC Back"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      <>
                        <i className="fas fa-id-card-alt"></i>
                        <h5 className="my-2">Back Side of CNIC</h5>
                      </>
                    )}
                  </div>
                </div>
                {/* Register Button */}
                <div
                  className="d-flex justify-content-end"
                  style={{ marginTop: 20 }}
                >
                  <button
                    type="button"
                    className="btn btn-success"
                    data-bs-dismiss="modal"
                    onClick={() =>
                      addNotification(selectedUser._id, "accepted")
                    }
                  >
                    <i className="fas fa-check me-2"></i>Accept
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger ms-3"
                    onClick={() => openMessageModal(selectedUser)}
                  >
                    <i className="fas fa-times me-2"></i>Decline
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <div
        className="modal fade"
        id="messageModal"
        tabindex="-1"
        aria-labelledby="messageModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="messageModalLabel">
                Enter Decline Reason
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
                <div className="mb-3">
                  <label htmlFor="rejectionReason" className="form-label">
                    <strong>Select Rejection Reason</strong>
                  </label>
                  <select
                    id="rejectionReason"
                    className="form-select"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  >
                    <option value="">-- Select a reason --</option>
                    {rejectionReasons.map((reason, index) => (
                      <option key={index} value={reason}>
                        {reason}
                      </option>
                    ))}
                  </select>
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => addNotification(selectedUser._id, "declined")}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
 
  );
}

export default UserVerification;
