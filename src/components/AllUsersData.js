import React,{useEffect, useState} from 'react'

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
            setAllUsers(data.users);
          } catch (error) {
            console.error("Error fetching Users:", error);
          }
        };
      useEffect(() => {
     
    
        getUser();
      }, [userId]);


  return (
    <div>
         <div className="container">
        <table className="table table-striped table-hover  my-3">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Contact</th>
              <th>Email</th>
              <th>Address</th>
              <th>Cnic#</th>
            </tr>
          </thead>
          <tbody>
            
            {allUsers.length > 0 ? (
              allUsers.map((user, index) => {
                return (
                  <tr key={user._id}>
                    <td>{index + 1}</td>
                    <td>{user.name || "Loading..."}</td>
                    <td>{user.phone || "Loading..."}</td>
                    <td>{user.email || "Loading..."}</td>
                    <td>{user.address || "Loading..."}</td>
                    <td>{user.cnic || "Loading..."}</td>
            

                    
                  </tr>
                );
              })
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
  )
}

export default AllUsersData
