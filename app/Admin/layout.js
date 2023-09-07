import logo from "@/public/logo.svg";
import "@/app/styles/header.css";
import Image from "next/image";
import Link from "next/link";

export default function AdminLayout({ children }) {
  return (
    <div>
      <div className="header">
        <div className="title">
          <Image src={logo} alt="" />
          <h1>Admin Panel</h1>
        </div>
        <div className="header-buttons">
          <Link href="manage-teams">
            <button id="manage-teams-button">Manage Teams</button>
          </Link>
          <Link href="manage-tools">
            <button id="manage-tools-button">Manage Tools</button>
          </Link>
          <Link href="users">
            <button>Manage Users</button>
          </Link>
          <Link href="/">
            <button>Dashboard</button>
          </Link>
        </div>
      </div>
      {children}
    </div>
  );
}
