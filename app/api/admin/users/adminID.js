import { bearerToken } from "./auth0-user-management-token";

export async function adminID() {
  const accessToken = await bearerToken();

  // Post request with JSON body and refresh of 1 day
  // console.log(accessToken);
  const requestOptions = {
    headers: { "Content-Type": "application/json", Authorization: accessToken },
    next: { revalidate: false }, // Never revalidate ID
  };

  // Fetch API token
  const rolesResponse = await fetch(
    process.env.AUTH0_ISSUER_BASE_URL + "/api/v2/roles",
    requestOptions
  );

  if (!rolesResponse.ok) {
    console.log(rolesResponse.json());
    throw new Error("Failed to fetch Admin Role ID");
  }

  const responseJSON = await rolesResponse.json();

  var adminID = "";
  responseJSON.map((role) => {
    if (role.name === "Admin") {
      adminID = role.id;
    }
  });

  return adminID;
}
