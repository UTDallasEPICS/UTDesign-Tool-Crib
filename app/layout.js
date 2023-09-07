import "./globals.css";
import { UserProvider } from "@auth0/nextjs-auth0/client";

export const metadata = {
  title: "UTDesign Toolcrib Inventory",
  description: "Created by UTD EPICS students",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <UserProvider>
        <body>
          <main>{children}</main>
        </body>
      </UserProvider>
    </html>
  );
}
