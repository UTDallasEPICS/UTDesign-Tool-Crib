export async function bearerToken() {
  // Request client credentials grant for the API
  const requestBody = {
    grant_type: "client_credentials",
    client_id: process.env.AUTH0_CLIENT_ID,
    client_secret: process.env.AUTH0_CLIENT_SECRET,
    audience: process.env.AUTH0_ISSUER_BASE_URL + "/api/v2/",
  };

  // Post request with JSON body and refresh of 1 day
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(requestBody),
    next: { revalidate: 86400 }, // Token works for 24 hours only, then needs to be revalidated
  };

  // Fetch API token
  const tokenResponse = await fetch(
    process.env.AUTH0_ISSUER_BASE_URL + "/oauth/token",
    requestOptions
  );

  // await tokenResponse
  if (!tokenResponse.ok) {
    throw new Error("Failed to fetch Auth0 Bearer Token");
  }
  const tokenJSON = await tokenResponse.json();
  const token = tokenJSON.token_type + " " + tokenJSON.access_token;

  return token;
}
