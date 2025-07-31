import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import ReportFoundItems from "./components/ReportFoundItems";
import ReportLostItems from "./components/ReportLostItems";
import Sidebar from "./components/Sidebar";
import useAuth from "./components/useAuth";
import Signup from "./components/Signup";
import UserVerification from "./components/UserVerification";
import Notification from "./components/Notification";
import LostItemsRequest from "./components/LostItemsRequest";
import FoundItemsRequest from "./components/FoundItemsRequest";
import DisplayMatchedItems from "./components/DisplayMatchedItems";
import DisplaySavedItems from "./components/DisplaySavedItems";
import EmailOTPManage from "./components/EmailOTPManage";
import ProtectedRoute from "./components/ProtectedRoute";
import ProfileSetting from "./components/ProfileSetting";
import AllUsersData from "./components/AllUsersData";
import Pwa_App from "./components/Pwa_App";

function App() {
  const [user, setUser] = useState([]);
  const [lostItems, setLostItems] = useState([]);
  const [foundItems, setFoundItems] = useState([]);
  const [notification, setNotification] = useState([]);
  const [savedItem, setSavedItem] = useState([]);
  const [isAdminApproved, setIsAdminApproved] = useState(false);

  const userId = localStorage.getItem("userId");
  const token = useAuth();
   const [triggerSidebarEffect, setTriggerSidebarEffect] = useState(false);

  const handleEditUser = () => {
    setTriggerSidebarEffect(true); // this will notify Sidebar
  };

  const getLostItems = async () => {
    try {
      const response = await fetch(
        "https://lost-and-found-backend-xi.vercel.app/auth/get-lostItems",
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
      const filterLostItems = data.lostItems.filter(
        (item) => item.request === "disapproved"
      );
      setLostItems(filterLostItems);
    } catch (error) {
      console.error("Error fetching Lost Items:", error);
    }
  };

  const getAllSavedItems = async () => {
    try {
      const response = await fetch(
        "https://lost-and-found-backend-xi.vercel.app/auth/get-savedItems",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (!response.ok) {
        return;
      }
      const data = await response.json();
      const userSavedItems = (data.saveditems || []).filter(
        (item) => String(item.userId) === String(userId)
      );
      const filteredSaved = userSavedItems.filter(
        (item) => item.isSaved === true
      );
      setSavedItem(filteredSaved);
    } catch (error) {
      console.error("Error fetching Saved Items:", error);
    }
  };

  const getFoundItems = async () => {
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
        (item) => item.request === "disapproved"
      );
      setFoundItems(filterFoundItems);
    } catch (error) {
      console.error("Error fetching Found Items:", error);
    }
  };

  useEffect(() => {
    getLostItems();
  }, []);
  useEffect(() => {
    getAllSavedItems();
  }, []);
  useEffect(() => {
    getFoundItems();
  }, []);

  if (token === null) return <div>Loading...</div>;

  const handleApprove = () => {
    console.log("isAdminApproved in Parent after set:", true);
    setIsAdminApproved(true);
  };

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/email-OTP" element={<EmailOTPManage />} />
      <Route path="/login-signup" element={<Signup />} />

      {/* Redirect from root based on login */}
      <Route
        path="/"
        element={<Navigate to={user ? "/reportLostItems" : "/login-signup"} />}
      />

      {/* Protected Routes */}
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <Sidebar
              user={user}
              notification={notification}
              lostItems={lostItems}
              foundItems={foundItems}
              savedItem={savedItem}
              triggerEffect={triggerSidebarEffect} 
              setTriggerEffect={setTriggerSidebarEffect}
            >
              <Routes>
                <Route
                  path="/reportLostItems"
                  element={
                    <ReportLostItems isAdminApproved={isAdminApproved} />
                  }
                />
                <Route
                  path="/reportFoundItems"
                  element={<ReportFoundItems />}
                />
                <Route
                  path="/user-verification"
                  element={<UserVerification user={user} setUser={setUser} />}
                />
                <Route
                  path="/notification"
                  element={
                    <Notification
                      notification={notification}
                      setNotification={setNotification}
                    />
                  }
                />
                <Route
                  path="/lostItemsRequest"
                  element={
                    <LostItemsRequest
                      lostItems={lostItems}
                      setLostItems={setLostItems}
                      onApprove={handleApprove}
                    />
                  }
                />
                <Route
                  path="/foundItemsRequest"
                  element={
                    <FoundItemsRequest
                      foundItems={foundItems}
                      setFoundItems={setFoundItems}
                      onApprove={handleApprove}
                    />
                  }
                />
                  <Route
                  path="/getallUsersData"
                  element={
                    <AllUsersData/>
                  }
                />
                <Route
                  path="/displayImages"
                  element={<DisplayMatchedItems />}
                />
                <Route
                  path="/displaySavedItems"
                  element={<DisplaySavedItems />}
                />
                 <Route
                  path="/profileSetting"
                  element={<ProfileSetting  editUser={handleEditUser} />}
                />
                 <Route
                  path="/app"
                  element={<Pwa_App/>}
                />
              </Routes>
            </Sidebar>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
