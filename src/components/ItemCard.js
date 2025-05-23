import React, { useState, useEffect } from "react";
import Carousel from "./Carousel";
import ItemButtons from "./ItemButtons";

export default function ItemCard({ item, savedItem, onDelete, onSave }) {
  const placeholderIcon = "https://via.placeholder.com/150?text=No+Image";
  const [userName, setUserName] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [city, setCity] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const rawImages = Array.isArray(item?.imageUrl)
    ? item.imageUrl
    : [item?.imageUrl || ""];
  const images = rawImages.map((img) =>
    typeof img === "string" && img.trim() !== "" ? img : placeholderIcon
  );

  useEffect(() => {
    const fetchPhoneNumber = async () => {
      try {
        if (savedItem?.itemId) {
          const response1 = await fetch(
            `https://lost-and-found-backend-xi.vercel.app/auth/get-foundItemById/${savedItem.itemId}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );

          const data1 = await response1.json();
          const userId = data1.foundItem?.userId;
          setTitle(data1.foundItem?.title);
          setDescription(data1.foundItem?.description);
          setLocation(data1.foundItem?.location);
          setCity(data1.foundItem?.city);

          if (userId) {
            // Step 2: Get user details using userId
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
            console.log("Phone number:", data2.user?.phone);
            setPhoneNumber(data2.user?.phone);
            setUserName(data2.user?.name || "");
            const fixedPath = data2.user?.profileImage?.replace(/\\/g, "/");
            const fullImageURL = fixedPath?.startsWith("http")
              ? fixedPath
              : `https://lost-and-found-backend-xi.vercel.app/${fixedPath}`;

            setProfileImage(fullImageURL);
            console.log("Profile Image URL:", data2.user?.profileImage);
          }
        }
      } catch (error) {
        console.error("Failed to fetch phone number:", error);
      }
    };

    fetchPhoneNumber();
  }, [savedItem]);

  return (
    <div className="col-md-4 mb-4">
      <div className="card">
        {/* Title */}
        <h4 className="card-title text-center mt-4 mb-2">
          {item.title || "No Title"}
        </h4>

        {/* Separator */}
        <hr
          style={{
            border: "none",
            borderTop: "3px solid black",
            width: "90%",
            textAlign: "center",
            borderRadius: "15px",
            margin: "auto",
          }}
          className="mb-2"
        />

        {/* Carousel */}
        <Carousel images={images} itemId={item._id} />

        {/* Separator */}
        <hr
          style={{
            border: "none",
            borderTop: "3px solid black",
            width: "90%",
            textAlign: "center",
            borderRadius: "15px",
            margin: "auto",
          }}
          className="mt-2"
        />

        <div className="d-flex align-items-center mb-1 mx-4 mt-2">
          <img
            src={profileImage || placeholderIcon}
            alt="Founder"
            className="rounded-circle me-2"
            style={{ width: "50px", height: "50px", objectFit: "cover" }}
          />
          <div>
            <div className="fw-bold d-flex align-items-center">
              {userName || "Unknown User"}
              <i
                className="fas fa-circle-check text-primary ms-1 mt-1"
                title="Verified User"
                style={{ fontSize: "0.9rem" }} // slightly smaller to look clean
              ></i>
            </div>
            <small className="text-muted">
              {new Date(item?.dateFound).toLocaleString() ||
                "Date not available"}
            </small>
          </div>
        </div>
        {/* Card Body */}
        <div className="card-body">
          <ItemButtons
            savedItem={savedItem}
            onDelete={onDelete}
            onSave={onSave}
            phoneNumber={phoneNumber}
            setPhoneNumber={setPhoneNumber}
            userName={userName}
            setUserName={setUserName}
            title={title}
            description={description}
            location={location}
            city={city}
          />
        </div>
      </div>
    </div>
  );
}
