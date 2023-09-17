import { NextResponse } from "next/server";

import { bearerToken } from "./auth0-user-management-token";
import { adminID } from "./adminID";
import { revalidate } from "../../teams/route";
import { revalidateTag } from "next/cache";

// Get list of users
export async function GET() {
  const adminID_string = await adminID();
  const accessToken = await bearerToken();
  const roleRequestURL =
    process.env.AUTH0_ISSUER_BASE_URL +
    "/api/v2/roles/" +
    adminID_string +
    "/users";
  const reqOptions = {
    headers: { Authorization: accessToken },
    next: { revalidate: 0 }, // Always revalidate since this can change at any time
  };

  // Get admin users
  const adminUsers = await fetch(roleRequestURL, reqOptions);
  // Convert response to JSON
  const adminUsersJSON = await adminUsers.json();
  // Get list of admin user IDs
  const adminUserIDs = adminUsersJSON.map((user) => user.user_id);
  const userRequestURL =
    process.env.AUTH0_ISSUER_BASE_URL +
    "/api/v2/users?" +
    new URLSearchParams({
      sort: "email:1",
      fields: "email,user_id",
    }).toString();
  // Get all users
  const allUsers = await fetch(userRequestURL, reqOptions);
  // Convert users to JSON
  const allUsersJSON = await allUsers.json();

  // Create object containing user email, ID, and admin status
  const userData = allUsersJSON.map((user) => {
    if (adminUserIDs.includes(user.user_id)) {
      return { ...user, isAdmin: true };
    }
    return { ...user, isAdmin: false };
  });

  return NextResponse.json({ data: userData });
}

// Create new user
export async function POST(request) {
  const { user } = await request.json();
  const accessToken = await bearerToken();
  const requestUrl = process.env.AUTH0_ISSUER_BASE_URL + "/api/v2/users";
  console.log(user);
  const requestBody = {
    connection: "Username-Password-Authentication",
    email: user,
    password: process.env.AUTH0_DEFAULT_PASSWORD, // Users need to reset password for first access
    email_verified: true, // Avoid confirmation email
  };
  const reqOptions = {
    method: "POST",
    headers: { Authorization: accessToken, "Content-Type": "application/json" },
    body: JSON.stringify(requestBody),
  };
  const res = await fetch(requestUrl, reqOptions);

  revalidateTag("users");

  return NextResponse.json({ res });
}

// Delete user
export async function DELETE(request) {
  const { user_id } = await request.json();
  const accessToken = await bearerToken();
  const requestUrl =
    process.env.AUTH0_ISSUER_BASE_URL + "/api/v2/users/" + user_id;
  const reqOptions = {
    method: "DELETE",
    headers: { Authorization: accessToken },
    next: { revalidate: 0 }, // Always revalidate since this can change at any time
  };

  const res = await fetch(requestUrl, reqOptions);

  revalidateTag("users");

  return NextResponse.json({ res });
}
