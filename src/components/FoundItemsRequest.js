import React, { useEffect, useState } from "react";
import { showToast } from "./Toastify2";
import { ToastContainer } from "react-toastify";
import "./Signup.css";
function FoundItemsRequest({ foundItems, setFoundItems }) {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [selectedFoundItems, setSelectedFoundItems] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState(Array(4).fill(null));
  const [users, setUsers] = useState([]);
  const [reason, setReason] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [contact, setContact] = useState("");
  const [cnic, setCnic] = useState("");
  const [address, setAddress] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [Loading, setLoading] = useState(false);
  //const {setSelectedBrands} = useContext(BrandContext);

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
      if (!response.ok) return;

      const data = await response.json();
      setUsers(data.users);
    } catch (error) {
      console.error("Error fetching Users:", error);
    }
  };

  const getLostItems = async () => {
    try {
      const response = await fetch(
        "https://lost-and-found-backend-xi.vercel.app/auth/get-foundItems",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (!response.ok) return;

      const data = await response.json();
      const filterFoundItems = data.foundItems.filter(
        (items) => items.request === "disapproved"
      );
      setFoundItems(filterFoundItems);
    } catch (error) {
      console.error("Error fetching Lost Items:", error);
    }
  };

  useEffect(() => {
    setLoading(true);

    // Fetch both in parallel
    Promise.all([getUser(), getLostItems()]).then(() => {
      setTimeout(() => {
        setLoading(false); // Hide loader
      }, 2000);
    });
  }, []); // Run only once

  const verifyFoundItems = async (id, userID) => {
    try {
      const response = await fetch(
        `https://lost-and-found-backend-xi.vercel.app/auth/verifyFoundItems/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ request: "approved" }),
        }
      );
      if (!response.ok) {
        showToast("error", "Error Verifying Request", 3000, "top-right");
        return;
      }
      getLostItems();
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
              userId: userID,
              message:
                "Dear User, we are pleased to inform you that your found item request has been reviewed and approved. Our team has started the process of locating the rightful owner and will continue efforts to recover it promptly. Please monitor your notifications for updates. Thank you for trusting the Lost and Found System. Regards, Lost and Found Team.",
              title: "Found Item Request Approved – We Are on It!",
            }),
          }
        );

        if (!response.ok) {
          showToast("error", "Notification Sending error", 3000, "top-right");
          return;
        }
        showToast(
          "success",
          "Notification Sent Successfully",
          3000,
          "top-right"
        );
      } catch (error) {
        console.error("Error Pushing Notification:", error);
      }
    } catch (error) {
      console.error("Error verifying request:", error);
    }
  };

  const handleSearchingNotification = async (
    selectedCity,
    selectedCategory,
    userId
  ) => {
    let fetchedItems;
    try {
      const response = await fetch(
        `https://lost-and-found-backend-xi.vercel.app/auth/search-lost?city=${selectedCity}&category=${selectedCategory}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const data = await response.json();

      if (data.success) {
        console.log("Fetched matched items:", data.lostItems);
        fetchedItems = data.lostItems;
      } else {
        console.error("Error fetching found items:", data.message);
        return [];
      }
    } catch (error) {
      console.error("Network or server error:", error);
      return [];
    }

    console.log("Fetched Items:", fetchedItems);

    if (!Array.isArray(fetchedItems) || fetchedItems.length === 0) {
      console.error("No matched items found:", fetchedItems);
      return;
    }

    console.log("Selected Subcategory:", selectedSubcategory);
    console.log("Selected Brand:", selectedBrand);

    const checkSubcategory = fetchedItems.filter(
      (item) => item.subCategory === selectedSubcategory
    );
    console.log("Filtered by subCategory:", checkSubcategory);

    const checkBrand = checkSubcategory.filter(
      (item) => item.brand === selectedBrand
    );
    console.log("Filtered by brand:", checkBrand);

    // Check if brand match exists before sending notification
    if (checkBrand && checkBrand.length > 0) {
      try {
        checkBrand.forEach(async (matchedItem) => {
          const notificationResponse = await fetch(
            "https://lost-and-found-backend-xi.vercel.app/auth/pushNotification",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
              body: JSON.stringify({
                userId: matchedItem.userId,
                message:
                  "Great news! We have found some items that closely match your lost item request. Please take a moment to review them. You can save the ones that look right, chat directly with the founder, or remove any mismatches. We are here to help you get your lost item back as smoothly as possible. With care, Lost and Found Team.",
                title: "Congratulations! We’ve Located Items Similar to Yours",
              }),
            }
          );

          if (!notificationResponse.ok) {
            console.error("Notification failed for:", matchedItem.userId);
          }
        });

        // setSelectedBrands(checkBrand);
        showToast("success" ,"Notifications Sent Successfully", 3000 , "top-right");
      } catch (error) {
        console.error("Error Pushing Notification:", error);
      }
    }
  };

  const handleApprove = async (checkLostItem) => {
    await verifyFoundItems(checkLostItem._id, checkLostItem.userId); // still approve first
    await handleSearchingNotification(
      checkLostItem.city,
      checkLostItem.category,
      checkLostItem.userId
    ); // then search and notify
  };

  const declineFoundRequest = async () => {
    try {
      const response = await fetch(
        `https://lost-and-found-backend-xi.vercel.app/auth/verifyFoundItems/${selectedFoundItems._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ request: "declined" }),
        }
      );
      if (!response.ok) {
        showToast("error", "Error Declining Request", 3000, "top-right");
        return;
      }
      getLostItems();
      console.log("selectedFound items", setSelectedFoundItems);

      try {
        const notificationResponse = await fetch(
          "https://lost-and-found-backend-xi.vercel.app/auth/pushNotification",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({
              userId: selectedFoundItems.userId,
              message: `Dear User, We regret to inform you that your Found item request has been carefully reviewed but could not be approved due to the following reason: ${reason}. We understand the importance of your request and encourage you to review and update your information if needed. Our goal is to assist you as efficiently as possible. You may resubmit your request with the corrected details to continue with the process. Thank you for trusting the Lost and Found System. Regards, Lost and Found Team.`,
              title: "Found Item Request Declined – Action Required",
            }),
          }
        );

        if (!notificationResponse.ok) {
          showToast("error", "Notification Sending error", 3000, "top-right");
          return;
        }
        showToast("success" ,"Notifications Sent Successfully", 3000 , "top-right");
        showToast(
          "success",
          "Notification Sent Successfully",
          3000,
          "top-right"
        );
        setReason("");
      } catch (error) {
        console.error("Error Pushing Notification:", error);
      }
      const messageModalEl = document.getElementById("messageModal");
      const verifyModalEl = document.getElementById("verifyLostItem");

      const messageModal = window.bootstrap.Modal.getInstance(messageModalEl);
      messageModal?.hide();

      const verifyModal = window.bootstrap.Modal.getInstance(verifyModalEl);
      verifyModal?.hide();
    } catch (error) {
      console.error("Error Declining request:", error);
    }
  };
  const openMessageModal = (foundItems) => {
    setSelectedFoundItems(foundItems);
    const messageModal = new window.bootstrap.Modal(
      document.getElementById("messageModal")
    );
    messageModal.show();
  };

  const openEditModal = async (foundItems) => {
    setSelectedFoundItems(foundItems);
    if (foundItems) {
      setModalLoading(true);
      const modalElement = document.getElementById("verifyLostItem");

      const existingModal = window.bootstrap.Modal.getInstance(modalElement);
      if (existingModal) {
        existingModal.dispose();
      }

      const editModal = new window.bootstrap.Modal(modalElement);
      editModal.show();

      const newUser = users.find((u) => u._id === foundItems.userId) || {};

      setName(newUser.name || "Not available");
      setEmail(newUser.email || "Not available");
      setCnic(newUser.cnic || "Not available");
      setContact(newUser.phone || "Not available");
      setAddress(newUser.address || "Not available");
   
      setProfileImage(newUser.profileImage);

      setTitle(foundItems.title || "");
      setSelectedCategory(foundItems.category || "");
      setSelectedSubcategory(foundItems.subCategory || "");
      setSelectedBrand(foundItems.brand || "");
      setLocation(foundItems.location || "");
      setSelectedCity(foundItems.city || "");
      setDescription(foundItems.description || "");
      setDate(foundItems.dateLost || "");

      // Fix the image array handling
      const imageArray = Array.isArray(foundItems.imageUrl)
        ? foundItems.imageUrl
        : [foundItems.imageUrl].filter(Boolean);
      const formattedArray = [
        ...imageArray,
        ...Array(4 - imageArray.length).fill(null),
      ].slice(0, 4);
      setUploadedFiles(formattedArray);

      setTimeout(() => {
        setModalLoading(false);
      }, 2000);
    } else {
      console.error("found item data is missing");
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
      <div className="container">
        <table className="table table-striped table-hover  my-3">
          <thead>
            <tr>
              <th>#</th>
              <th>Owner Name</th>
              <th>Title</th>
              <th>Category</th>
              <th>Sub Category</th>
              <th>Brand</th>
              <th>City</th>
              <th>Date Lost</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {foundItems.length > 0 ? (
              foundItems.map((lostItem, index) => {
                return (
                  <tr key={lostItem._id}>
                    <td>{index + 1}</td>
                    <td>
                      {users.find((u) => u._id === lostItem.userId)?.name ||
                        "Unknown User"}
                    </td>
                    <td>{lostItem.title}</td>
                    <td>{lostItem.category}</td>
                    <td>{lostItem.subCategory}</td>
                    <td>{lostItem.brand}</td>
                    <td>{lostItem.city}</td>
                    <td>{new Date(lostItem.dateFound).toLocaleDateString()}</td>

                    <td>
                      <button
                        className="btn btn-outline-success btn-sm mx-1"
                        title="Approve"
                        onClick={() => handleApprove(lostItem)}
                      >
                        <i className="fas fa-check"></i>
                      </button>
                      <button
                        className="btn btn-outline-danger btn-sm mx-1"
                        title="Decline"
                        onClick={() => openMessageModal(lostItem)}
                      >
                        <i className="fas fa-times"></i>
                      </button>
                      <button
                        className="btn btn-outline-primary btn-sm mx-1"
                        title="Details"
                        onClick={() => openEditModal(lostItem)}
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
                  No found Items Request Available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {modalLoading && (
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

      <div>
        <div
          className="modal fade"
          id="verifyLostItem"
          tabIndex="-1"
          aria-labelledby="verifyLostItemLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-centered modal-lg modal-dialog-scrollable">
            <div className="modal-content bg-dark text-light rounded-4 shadow">
              <div>
                <div className="modal-header border-0">
                  <h5 className="modal-title" id="verifyLostItemLabel">
                    <i className="fas fa-search me-2 text-success"></i>Verify
                    Lost Item Request | Lost & Found
                  </h5>
                  <button
                    type="button"
                    className="btn-close btn-close-white"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  ></button>
                </div>
                <div
                  className="modal-body"
                  style={{
                    overflowY: "auto",
                    maxHeight: "calc(100vh - 100px)",
                    scrollbarWidth: "none", // For Firefox
                    msOverflowStyle: "none", // For IE
                  }}
                >
                  <form className="container-fluid p-0 px-md-3 text-dark">
                    {/* Owner Details Section */}
                    <div className="row">
                      <div className="col-12 text-center mb-3">
                        <span className="bg-light p-1 rounded fw-bold d-inline-flex align-items-center">
                          <span
                            className="bg-white rounded-circle d-flex justify-content-center align-items-center me-2"
                            style={{ width: "25px", height: "25px" }}
                          >
                            <i className="fas fa-user text-dark"></i>
                          </span>
                          OWNER DETAILS
                        </span>
                      </div>
                    </div>

                    <div className="row align-items-start px-2 px-md-3 text-white mt-4">
                      {/* Profile Image - Full width on mobile, fixed on larger screens */}
                      <div className="col-12 col-md-auto mb-3 mb-md-0 d-flex justify-content-center justify-content-md-start">
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
                            <i className="fas fa-user"></i>
                          )}
                        </div>
                      </div>

                      {/* Text Info - Full width on mobile */}
                      <div className="col-12 col-md">
                        <div className="row">
                          <div className="col-12 col-sm-6 mb-2">
                            <b>Name:</b> {name || "Loading..."}
                          </div>
                          <div className="col-12 col-sm-6 mb-2">
                            <b>CNIC No:</b> {cnic || "Loading..."}
                          </div>
                          <div className="col-12 col-sm-6 mb-2">
                            <b>Contact:</b> {contact || "Loading..."}
                          </div>
                          <div className="col-12 col-sm-6 mb-2">
                            <b>Email:</b> {email || "Loading..."}
                          </div>
                          <div className="col-12 mb-2">
                            <b>Address:</b> {address || "Loading..."}
                          </div>
                        </div>
                      </div>
                    </div>

                    <hr
                      className="my-3"
                      style={{ border: "1px solid white" }}
                    />

                    {/* Product Details Section */}
                    <div className="row mt-4">
                      <div className="col-12 text-center mb-3">
                        <span className="bg-light p-1 rounded fw-bold d-inline-flex align-items-center">
                          <span
                            className="bg-white rounded-circle d-flex justify-content-center align-items-center me-2"
                            style={{ width: "25px", height: "25px" }}
                          >
                            <i className="fas fa-tags text-dark"></i>
                          </span>
                          LOST ITEM DETAILS
                        </span>
                      </div>
                    </div>

                    <div className="row text-white px-2 px-md-3">
                      <div className="col-12 col-md-6 col-lg-4 mb-2">
                        <b>Title:</b> {title || "Not provided"}
                      </div>
                      <div className="col-12 col-md-6 col-lg-4 mb-2">
                        <b>Category:</b> {selectedCategory || "Not provided"}
                      </div>
                      <div className="col-12 col-md-6 col-lg-4 mb-2">
                        <b>Sub Category:</b>{" "}
                        {selectedSubcategory || "Not provided"}
                      </div>
                      <div className="col-12 col-md-6 col-lg-4 mb-2">
                        <b>Brand:</b> {selectedBrand || "Not provided"}
                      </div>
                      <div className="col-12 col-md-6 col-lg-4 mb-2">
                        <b>City:</b> {selectedCity || "Not provided"}
                      </div>
                      <div className="col-12 col-md-6 col-lg-4 mb-2">
                        <b>Location:</b> {location || "Not provided"}
                      </div>
                      <div className="col-12 col-md-6 col-lg-4 mb-2">
                        <b>Date Lost:</b>{" "}
                        {date
                          ? new Date(date).toLocaleDateString()
                          : "Not provided"}
                      </div>
                      <div className="col-12 mb-2">
                        <b>Description:</b> {description || "Not provided"}
                      </div>
                    </div>

                    {/* Images Grid - Responsive columns */}
                    <div className="row mt-3">
                      {uploadedFiles.map((url, idx) => (
                        <div key={idx} className="col-6 col-sm-4 col-md-3 mb-3">
                          {url ? (
                            <img
                              src={url}
                              alt={`Uploaded ${idx + 1}`}
                              className="img-fluid rounded border"
                              style={{
                                width: "100%",
                                height: "150px",
                                objectFit: "cover",
                              }}
                            />
                          ) : (
                            <div
                              className="border rounded d-flex align-items-center justify-content-center"
                              style={{
                                width: "100%",
                                height: "150px",
                                background: "#f8f9fa",
                              }}
                            >
                              <i className="fa-solid fa-image fa-3x text-muted"></i>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Action Buttons - Responsive layout */}
                    <div className="row mt-1 mb-3">
                      <div className="col-12 d-flex justify-content-end">
                        <button
                          type="button"
                          className="btn btn-success me-2"
                          data-bs-dismiss="modal"
                          onClick={() => handleApprove(selectedFoundItems)}
                        >
                          <i className="fas fa-check me-2"></i>Accept
                        </button>
                        <button
                          type="button"
                          className="btn btn-danger"
                          onClick={() => openMessageModal(selectedFoundItems)}
                        >
                          <i className="fas fa-times me-2"></i>Decline
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className="modal fade"
        id="messageModal"
        tabIndex="-1"
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
                    <strong>Write Rejection Reason</strong>
                  </label>
                  <textarea
                    className="form-control"
                    rows="4"
                    id="rejectionReason"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                  ></textarea>
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
                onClick={declineFoundRequest}
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

export default FoundItemsRequest;
