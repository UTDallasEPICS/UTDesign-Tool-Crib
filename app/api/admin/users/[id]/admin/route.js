import { bearerToken } from "../../auth0-user-management-token";
import { adminID } from "../../adminID";
import { revalidateTag } from "next/cache";

async function setAdmin(requestType, userID) {
  // Get admin ID and bearer token
  const adminID_string = await adminID();
  console.log(adminID_string);
  const accessToken = await bearerToken();

  // Create
  const requestUrl =
    process.env.AUTH0_ISSUER_BASE_URL + "/api/v2/users/" + userID + "/roles";
  const requestBody = {
    roles: [adminID_string],
  };

  const requestOptions = {
    method: requestType,
    headers: { "Content-Type": "application/json", Authorization: accessToken },
    body: JSON.stringify(requestBody),
  };

  const res = await fetch(requestUrl, requestOptions);

  revalidateTag("users");

  return res;
}

export async function GET(request, { params }) {
  const userID = params.id;
  return await setAdmin("POST", userID);
}

export async function DELETE(request, { params }) {
  const userID = params.id;
  return await setAdmin("DELETE", userID);
}
