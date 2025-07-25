import React, { useEffect, useState } from "react";
import { showToast } from "./Toastify2";
import { ToastContainer } from "react-toastify";
function AllUsersData() {
  const [allUsers, setAllUsers] = useState([]);
  const userId = localStorage.getItem("userId");
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
        return;
      }
      const data = await response.json();
     // const filteredUsers = data.users.filter((user) => user.isDeleted === true)
      setAllUsers(data.users);
    } catch (error) {
      console.error("Error fetching Users:", error);
    }
  };
  useEffect(() => {
    getUser();
  }, [userId]);

  const deleteUser = async (id) => {
    const confirm = window.confirm("Are You Sure to delete user ?");
    if (!confirm) {
      return;
    }
    try {
      const response = await fetch(
        `https://lost-and-found-backend-xi.vercel.app/auth/deleteUser/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) {
        showToast("error", "Error Deleting User", 3000, "top-right");
        return;
      }
      showToast("success", "User Deleted Successfully!", 3000, "top-right");
      getUser();
    } catch (error) {
      console.error("Error fetching Users:", error);
    }
  };

  return (
    <div>
      <ToastContainer />
      <div className="container table-responsive">
        <table className="table table-striped table-hover  my-3">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Contact</th>
              <th>Email</th>
              <th>Address</th>
              <th>Cnic#</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {allUsers.filter((user) => user.role !== "admin").length > 0 ? (
              allUsers
                .filter((user) => user.role !== "admin")
                .map((user, index) => (
                  <tr key={user._id}>
                    <td>{index + 1}</td>
                    <td>{user.name || "Loading..."}</td>
                    <td>{user.phone || "Loading..."}</td>
                    <td>{user.email || "Loading..."}</td>
                    <td>{user.address || "Loading..."}</td>
                    <td>{user.cnic || "Loading..."}</td>
                    <td>
                      <button
                        className="btn btn-outline-danger btn-sm mx-1"
                        title="Delete"
                        onClick={() => deleteUser(user._id)}
                      >
                        <i className="fa-solid fa-trash-can"></i>
                      </button>
                    </td>
                  </tr>
                ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center">
                  No Users Available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AllUsersData;
