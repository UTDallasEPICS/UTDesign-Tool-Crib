import "./globals.css";
import { auth0 } from "./lib/auth0";
import { Auth0Provider } from "@auth0/nextjs-auth0";

export const metadata = {
  title: "UTDesign Toolcrib Inventory",
  description: "Created by UTD EPICS students",
};

export default async function RootLayout({ children }) {
  const session = await auth0.getSession();
  return (
    <html lang="en">
      <Auth0Provider user={session?.user}>
        <body>
          <main>{children}</main>
        </body>
      </Auth0Provider>
    </html>
  );
}
