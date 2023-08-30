import "./globals.css";
import Link from "next/link";
import Image from "next/image";
import logo from "../src/Styles/logo.svg";
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
