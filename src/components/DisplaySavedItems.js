import { useEffect, useState } from "react";
import ItemCard from "./ItemCard";
function DisplaySavedItems() {
  const [matchedItems, setMatchedItems] = useState([]);
  const [userItem, setUserItem] = useState([]);

  const [loading, setLoading] = useState(true); // State for loading
  const userId = localStorage.getItem("userId");

  const getAllSavedItems = async () => {
    setLoading(true); // Start loading
    try {
      const response = await fetch(
        "http://localhost:5000/auth/get-savedItems",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) {
        alert("Error getting saved items");
        return;
      }

      const data = await response.json();
      const userSavedItems = (data.saveditems || []).filter(
        (item) => String(item.userId) === String(userId)
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
        "http://localhost:5000/auth/get-foundItemsByIds",
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
        alert("Error getting full found item details");
        return;
      }

      const foundItemsData = await foundItemsResponse.json();
      setMatchedItems(foundItemsData.foundItems || []);
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong. Please try again later.");
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
    <div className="container">
      <div className="row">
        {loading ? ( // Show loading state
          <p>Loading...</p>
        ) : matchedItems.length === 0 && userItem.length === 0 ? (
          <p>No matched or saved items found.</p>
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
  );
}

export default DisplaySavedItems;
