import React, { useState, useEffect } from "react";
import { ToastContainer } from "react-toastify";
import { showToast } from "./Toastify2";
function ItemButtons({
  savedItem,
  onDelete,
  onSave,
  phoneNumber,
  setPhoneNumber,
  userName,
  setUserName,
  title,
  description,
  location,
  city,
}) {
  // const [email, setEmail] = useState("");
  const [save, setSave] = useState({});
  const [currentItemData, setCurrentItemData] = useState(null);
  const [currentUserData, setCurrentUserData] = useState(null);
  const [profileImage, setProfileImage] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState(Array(4).fill(null));
  const [isModalLoading, setIsModalLoading] = useState(false);

  const openEditModal = async (item) => {
    try {
      setIsModalLoading(true);

      if (item?.itemId) {
        // Fetch item details
        const response1 = await fetch(
          `https://lost-and-found-backend-xi.vercel.app/auth/get-foundItemById/${item.itemId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const data1 = await response1.json();
        setCurrentItemData(data1.foundItem);

        const imageArray = data1.foundItem?.imageUrl || [];
        const formattedArray = [
          ...imageArray,
          ...Array(4 - imageArray.length).fill(null),
        ].slice(0, 4);
        setUploadedFiles(formattedArray);

        const userId = data1.foundItem?.userId;

        if (userId) {
          // Get user details
          const response2 = await fetch(
            `https://lost-and-found-backend-xi.vercel.app/auth/getUser/${userId}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );

          const data2 = await response2.json();
          setCurrentUserData(data2.user);
          // setEmail(data2.user?.email || "");
          console.log("Phone number2220", data2.user?.phone);

          setPhoneNumber(data2.user?.phone || "");
          setUserName(data2.user?.name || "");

          const fixedPath = data2.user?.profileImage?.replace(/\\/g, "/");
          const fullImageURL = fixedPath?.startsWith("http")
            ? fixedPath
            : `https://lost-and-found-backend-xi.vercel.app/${fixedPath}`;
          setProfileImage(fullImageURL || "");
        }

        // Show modal after data is loaded
        const modalElement = document.getElementById(
          `verifyLostItem-${item._id}`
        );
        const existingModal = window.bootstrap.Modal.getInstance(modalElement);
        if (existingModal) {
          existingModal.dispose();
        }

        const editModal = new window.bootstrap.Modal(modalElement);
        editModal.show();
      }
    } catch (error) {
      console.error("Failed to fetch item details:", error);
    } finally {
      setIsModalLoading(false);
    }
  };

  const handleWhatsapp = () => {
    if (!phoneNumber) {
      showToast("warning", "Phone number not available.", 3000, "top-right");
      return;
    }

    const message = `Respected Dear ${userName},\n\nI hope you are doing well. I just saw the item you found titled '${
      currentItemData?.title || title || ""
    }' with the description '${
      currentItemData?.description || description || ""
    }'.\n\nI lost it near '${
      currentItemData?.location || location || ""
    }' in city ${
      currentItemData?.city || city || ""
    } and I truly believe it is mine.\n\nIt is very important to me, so please let me know how I can confirm and collect it.\n\nI would be very thankful for your help and honesty.\n\nThank you so much.`;

    if (message.length > 2000) {
      showToast("warning", "Message is too long for WhatsApp.", 3000, "top-right");
      return;
    }

    const normalizedNumber = phoneNumber.startsWith("0")
      ? phoneNumber.slice(1)
      : phoneNumber;

    const encodedMessage = encodeURIComponent(message);
    const url = `https://api.whatsapp.com/send?phone=92${normalizedNumber}&text=${encodedMessage}`;
    console.log("Redirecting to WhatsApp:", url);
    window.open(url, "_blank");
  };

  const handleSave = async (id) => {
    const newSaveState = { ...save, [id]: !save[id] };
    setSave(newSaveState);
    localStorage.setItem("saveState", JSON.stringify(newSaveState));

    try {
      await fetch(
        `https://lost-and-found-backend-xi.vercel.app/auth/save-item/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ isSaved: !save[id] }),
        }
      );
        showToast("success", "Item saved successfully.", 3000, "top-right");

      onSave();
    } catch (error) {
      console.error("Error saving item:", error);
    }
  };

  const handleDeleteItem = async (id) => {
    const check = window.confirm("Are you sure you want to delete it?");
    if (!check) return;

    try {
      const response = await fetch(
        `https://lost-and-found-backend-xi.vercel.app/auth/delete-savedItems/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (!response.ok) {
        showToast("error", "Unable to delete SavedItems", 3000, "top-right");
      }
      onDelete();
       showToast("success", "SavedItem Deleted Successfully", 3000, "top-right");
    } catch (error) {
      console.error("Delete error:", error);
    }
  };
  useEffect(() => {
    const savedState = JSON.parse(localStorage.getItem("saveState")) || {};
    setSave(savedState);
  }, []);

  if (!savedItem) return null;

  return (
    <>
    <ToastContainer/>
   
    <div className="d-flex flex-wrap justify-content-center gap-2">
      {/* Details Button */}
      <button
        className="btn btn-primary btn-sm"
        title="Details"
        onClick={() => openEditModal(savedItem)}
        disabled={isModalLoading}
      >
        {isModalLoading ? (
          <span
            className="spinner-border spinner-border-sm me-2"
            role="status"
            aria-hidden="true"
          ></span>
        ) : (
          <i className="fa-solid fa-circle-info me-2"></i>
        )}
        Details
      </button>

      {/* WhatsApp Button */}
      <button
        className="btn btn-success btn-sm"
        title="WhatsApp"
        onClick={handleWhatsapp}
      >
        <i className="fa-brands fa-whatsapp me-2"></i> WhatsApp
      </button>

      {/* Delete Button */}
      <button
        className="btn btn-danger btn-sm"
        title="Delete"
        onClick={() => handleDeleteItem(savedItem._id)}
      >
        <i className="fa-solid fa-trash me-2"></i> Delete
      </button>

      {/* Save Button */}
      <button
        className={`${
          save[savedItem._id] ? "btn btn-outline-warning" : "btn btn-warning"
        } btn-sm`}
        title="Save"
        onClick={() => handleSave(savedItem._id)}
      >
        <i className="fa-solid fa-bookmark me-2"></i>
        {save[savedItem._id] ? " Saved" : "Save"}
      </button>

      {/* Modal - Unique for each item */}
      <div key={savedItem._id}>
        <div
          className="modal fade"
          id={`verifyLostItem-${savedItem._id}`}
          tabIndex="-1"
          aria-labelledby="verifyLostItemLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-centered modal-lg modal-dialog-scrollable">
            <div className="modal-content bg-dark text-light rounded-4 shadow">
              <div>
                <div className="modal-header border-0">
                  <h5 className="modal-title" id="verifyLostItemLabel">
                    <i className="fas fa-search me-2 text-success"></i>
                    Product Details | Founder
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
                    scrollbarWidth: "none",
                    msOverflowStyle: "none",
                  }}
                >
                  {isModalLoading ? (
                    <div className="text-center py-5">
                      <div
                        className="spinner-border text-primary"
                        role="status"
                      >
                        <span className="visually-hidden">Loading...</span>
                      </div>
                      <p className="mt-2">Loading details...</p>
                    </div>
                  ) : (
                    <form className="container-fluid p-0 px-md-3 text-dark">
                      {/* Owner Details Section */}
                      <div className="row">
                        <div className="col-12 mb-3">
                          <span className=" text-light fw-bold d-inline-flex align-items-center">
                            <span
                              className=" d-flex justify-content-center align-items-center me-1"
                              style={{ width: "25px", height: "25px" }}
                            >
                              <i className="fas fa-user text-secondary"></i>
                            </span>
                            FOUNDER DETAILS
                          </span>
                        </div>
                      </div>

                      <div className="row align-items-center justify-content-center px-2 px-md-3 text-white mt-1">
                        {/* Profile Image */}
                        <div className="col-12 text-center mb-1">
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
                              margin: "0 auto",
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

                        {/* Name */}
                        <div className="col-12 text-center d-flex justify-content-center align-items-center">
                          <h3 className="mb-0 me-2">
                            {currentUserData?.name || "Loading..."}
                          </h3>
                          <i
                            className="fas fa-circle-check text-primary mt-2"
                            title="Verified User"
                            style={{ fontSize: "1.2rem" }}
                          ></i>
                        </div>

                        {/* Email | Address */}
                        <div className="col-12 text-center mt-2">
                          <p className="mb-0">
                            {currentUserData?.email || "Loading..."} |{" "}
                            {currentUserData?.address || "Loading..."}
                          </p>
                        </div>
                      </div>
<div className="d-flex flex-wrap justify-content-center align-items-center gap-2 mt-2">
  <button
    className="btn btn-success btn-sm"
    title="WhatsApp"
    onClick={handleWhatsapp}
  >
    <i className="fa-brands fa-whatsapp me-1"></i> WhatsApp
  </button>

  <button
    className={`btn btn-sm ${
      save[savedItem._id]
        ? "btn-outline-warning"
        : "btn-warning"
    }`}
    title="Save"
    onClick={() => handleSave(savedItem._id)}
  >
    <i className="fa-solid fa-bookmark me-1"></i>
    {save[savedItem._id] ? "Saved" : "Save"}
  </button>

  <button
    className="btn btn-danger btn-sm"
    title="Delete"
    onClick={() => handleDeleteItem(savedItem._id)}
  >
    <i className="fa-solid fa-trash me-1"></i> Delete
  </button>
</div>


                      <hr
                        className="my-3"
                        style={{ border: "1px solid white" }}
                      />

                      {/* Product Details Section */}
                      <div className="row mt-4">
                        <div className="col-12  mb-3">
                          <span className="text-white fw-bold d-inline-flex ">
                            <span
                              className="d-flex justify-content-center align-items-center me-2"
                              style={{ width: "25px", height: "25px" }}
                            >
                              <i className="fas fa-tags text-secondary"></i>
                            </span>
                            FOUND ITEM DETAILS
                          </span>
                        </div>
                      </div>

                      <div className="row text-white px-2 px-md-3">
                        <div className="col-12 col-md-6 col-lg-4 mb-2">
                          <b>Title:</b>{" "}
                          {currentItemData?.title || "Not provided"}
                        </div>
                        <div className="col-12 col-md-6 col-lg-4 mb-2">
                          <b>Category:</b>{" "}
                          {currentItemData?.category || "Not provided"}
                        </div>
                        <div className="col-12 col-md-6 col-lg-4 mb-2">
                          <b>Sub Category:</b>{" "}
                          {currentItemData?.subCategory || "Not provided"}
                        </div>
                        <div className="col-12 col-md-6 col-lg-4 mb-2">
                          <b>Brand:</b>{" "}
                          {currentItemData?.brand || "Not provided"}
                        </div>
                        <div className="col-12 col-md-6 col-lg-4 mb-2">
                          <b>City:</b> {currentItemData?.city || "Not provided"}
                        </div>
                        <div className="col-12 col-md-6 col-lg-4 mb-2">
                          <b>Location:</b>{" "}
                          {currentItemData?.location || "Not provided"}
                        </div>
                        <div className="col-12 col-md-6 col-lg-4 mb-2">
                          <b>Date Found:</b>{" "}
                          {currentItemData?.dateFound
                            ? new Date(
                                currentItemData.dateFound
                              ).toLocaleDateString()
                            : "Not provided"}
                        </div>
                        <div className="col-12 mb-2">
                          <b>Description:</b>{" "}
                          {currentItemData?.description || "Not provided"}
                        </div>
                      </div>

                      {/* Images Grid */}

                      <div className="row mt-2">
                        <div className="col-12  mb-2">
                          <span className="text-white fw-bold d-inline-flex ">
                            <span
                              className="d-flex justify-content-center align-items-center me-2"
                              style={{ width: "25px", height: "25px" }}
                            >
                              <i className="fas fa-images text-secondary"></i>
                            </span>
                            ATTACHED IMAGES
                          </span>
                        </div>
                      </div>
                      <div className="row mt-3">
                        {uploadedFiles.map((url, idx) => (
                          <div
                            key={idx}
                            className="col-6 col-sm-4 col-md-3 mb-3"
                          >
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

                      {/* Action Buttons */}
                      <div className="row mt-1 mb-3">
                        <div className="col-12 d-flex justify-content-end">
                          <button
                            type="button"
                            className="btn btn-success me-2"
                            data-bs-dismiss="modal"
                            onClick={handleWhatsapp}
                          >
                            <i className="fa-brands fa-whatsapp me-1"></i>
                            WhatsApp
                          </button>
                          <button
                            type="button"
                            className="btn btn-danger"
                            onClick={() => handleDeleteItem(savedItem._id)}
                          >
                            <i className="fa-solid fa-trash me-1"></i>
                            Delete
                          </button>
                        </div>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
     </>
  );
}

export default ItemButtons;
