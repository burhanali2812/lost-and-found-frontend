import { useEffect, useState } from "react";
import ItemCard from "./ItemCard";
import { ToastContainer } from "react-toastify";
import { showToast } from "./Toastify2";
function DisplayMatchedItems() {
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
        (item) => String(item.userId) === String(userId) && !item.isDeletedFromDisplayed
      );
    

      setUserItem(userSavedItems);

      const itemIds = userSavedItems.map((item) => item.itemId);
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

  const deleteSaveItem = () => {
    getAllSavedItems();
  };

return (
  <>
    <ToastContainer />

    {loading && (
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

    <div className="container">
        <h1 className="text-center mt-4">
          <i className="fa-solid fa-circle-check text-success me-2"></i> Possible Matched Items
      </h1>
     

      <div className="row mt-3">
        {!loading && matchedItems.length === 0 && userItem.length === 0 ? (
          <p>No matched or saved items found.</p>
        ) : (
          matchedItems.map((item) => {
            const savedItem = userItem.find(
              (u) => String(u.itemId) === String(item._id)
            );

            return (
              <ItemCard
                key={item._id || item.itemId}
                item={item}
                savedItem={savedItem}
                onDelete={deleteSaveItem}
                display="matchedItems"
              />
            );
          })
        )}
      </div>
    </div>
  </>
);

}

export default DisplayMatchedItems;
