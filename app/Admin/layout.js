import logo from "../../src/Styles/logo.svg";
import "../../src/Styles/header.css";
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
          <Link href="Manage-Teams">
            <button id="manage-teams-button">Manage Teams</button>
          </Link>
          <Link href="Manage-Tools">
            <button id="manage-tools-button">Manage Tools</button>
          </Link>
          <button>Create Users</button>
          <Link href="/">
            <button>Dashboard</button>
          </Link>
        </div>
      </div>
      {children}
    </div>
  );
}
