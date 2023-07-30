import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { formToJSON } from "axios";

const Profile = () => {
  const { user, isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return <div>Loading ...</div>;
  }

  return (
    isAuthenticated && (
      <div>
        <img src={user.picture} alt={user.name} />
        <h2>{user.name}</h2>
        <p>{user.email}</p>
        <p>{user["http://localhost:3000/roles"]==="Admin"}</p>
      </div>
    )
  );
};

export default Profile;