"use client";
import { useState } from "react";
import useSWR from "swr";
import { useUser } from "@auth0/nextjs-auth0";
import "./users.css";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

// export default withPageAuthRequired(

export default function Users() {
  const { user, isLoading: userIsLoading, error } = useUser();
  // Get tool list from backend
  const {
    data: userData,
    mutate,
    isLoading,
  } = useSWR("/api/admin/users", fetcher);

  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserAdmin, setNewUserAdmin] = useState(false);

  const validateEmail = (event) => {
    const email = event.target.value;
    if (
      !String(email)
        .toLowerCase()
        .match(
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        )
    ) {
      document.getElementById("add-new-user").enabled = false;
    } else {
      document.getElementById("add-new-user").enabled = true;
    }
    setNewUserEmail(email);
  };

  const handleNewUser = async () => {
    const newUserResponse = await fetch("/api/admin/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user: newUserEmail }),
    });

    setNewUserEmail("");
    mutate();
  };

  const handleRemoveUser = async (user) => {
    //   console.log(user);
    if (
      window.confirm("Do you really want to delete user '" + user.email + "'?")
    ) {
      const deleteUserResponse = await fetch("/api/admin/users", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: user.user_id }),
      });
      mutate();
    }
  };

  const handleSetAdmin = async (event, user) => {
    const isAdmin = event.target.checked;
    console.log(isAdmin);
    console.log(user);
    var fetchMethod = "";
    if (isAdmin) {
      fetchMethod = "GET";
    } else {
      fetchMethod = "DELETE";
    }
    const setAdminResponse = await fetch(
      "/api/admin/users/" + user.user_id + "/admin",
      {
        method: fetchMethod,
        headers: { "Content-Type": "application/json" },
      }
    );
  };

  if (userIsLoading) return <div>Loading...</div>;
  if (!user) return <div>Not authenticated!</div>;

  return (
    <div>
      <h1>User Management</h1>
      <div className="user-box">
        <div className="user-header">
          <p>Email</p>
          <p className="no-grow">Admin</p>
          <p className="no-grow">Remove</p>
        </div>
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          userData.data.map((user) => (
            <div key={user.user_id} className="user-line">
              <p>{user.email}</p>
              <input
                type="checkbox"
                className="user-is-admin"
                defaultChecked={user.isAdmin}
                onChange={(event) => {
                  handleSetAdmin(event, user);
                }}
              />
              <button
                className="remove-user"
                onClick={() => {
                  handleRemoveUser(user);
                }}
              >
                -
              </button>
              {/* {user.user_id} {user.email} {user.isAdmin?"Admin":"Not Admin"} */}
            </div>
          ))
        )}
        <div className="new-user-line user-line">
          <input
            type="text"
            id="new-user-email"
            value={newUserEmail}
            onChange={validateEmail}
          />
          <input
            type="checkbox"
            className="user-is-admin"
            id="new-user-admin"
            hidden={true}
            disabled={true}
          />
          <button
            className="remove-user"
            id="add-new-user"
            onClick={handleNewUser}
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
}
//   ,
//   { returnTo: "/" }
// );
