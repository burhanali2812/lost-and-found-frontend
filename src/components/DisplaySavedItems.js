import { useEffect, useState } from "react";
import ItemCard from "./ItemCard";
import { ToastContainer } from "react-toastify";
import { showToast } from "./Toastify2";
import match from "../images/match.jpg"
function DisplaySavedItems() {
  const [matchedItems, setMatchedItems] = useState([]);
  const [userItem, setUserItem] = useState([]);

  const [loading, setLoading] = useState(true); // State for loading
  const userId = localStorage.getItem("userId");

  const getAllSavedItems = async () => {
    setLoading(true); // Start loading
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
        //&& !item.isDeleted
      );
      const filteredSaved = userSavedItems.filter(
        (item) => item.isSaved === true
      );

      setUserItem(filteredSaved);

      const itemIds = filteredSaved.map((item) => item.itemId);
      if (itemIds.length === 0) {
        setLoading(false); // End loading
        setMatchedItems([]);
        return;
      }

      const foundItemsResponse = await fetch(
        "https://lost-and-found-backend-xi.vercel.app/auth/get-foundItemsByIds",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ itemIds }),
        }
      );

      if (!foundItemsResponse.ok) {
        return;
      }

      const foundItemsData = await foundItemsResponse.json();
      setMatchedItems(foundItemsData.foundItems || []);
    } catch (error) {
      console.error("Error:", error);
      showToast( "error","Something went wrong. Please try again later.", 3000 ,"top-right");
    } finally {
      setLoading(false); // End loading
    }
  };

  useEffect(() => {
    getAllSavedItems();
  }, []); //userId// Remove userItems from dependency array

  const UpdateSaveItem = () => {
    getAllSavedItems();
  };

  return (
    <>
    <ToastContainer/>
    <div className="container">
      <div className="row">
        {loading ? ( // Show loading state
          <p>Loading...</p>
        ) : matchedItems.length === 0 && userItem.length === 0 ? (
          <>
           <div className="d-flex justify-content-center mt-5">
                 <img
                   src={match}
                   alt="Notification"
                   className="img-fluid"
                   style={{ width: "100%", maxWidth: "500px" }}
                 />
                 
               </div>
          <div className="text-center fw-bold">
            <h3 style={{opacity: "0.5"}}>No Saved Or Matched Item Found</h3>
          </div>
          </>
        
               
        ) : (
          <>
            {matchedItems.map((item) => {
              const savedItem = userItem.find(
                (u) => String(u.itemId) === String(item._id)
              );

              return (
                <ItemCard
                  key={item._id || item.itemId}
                  item={item}
                  savedItem={savedItem}
                  onDelete={UpdateSaveItem}
                  onSave={UpdateSaveItem} // This might be undefined if no match
                />
              );
            })}
          </>
        )}
      </div>
    </div>
    </>
  );
}

export default DisplaySavedItems;
