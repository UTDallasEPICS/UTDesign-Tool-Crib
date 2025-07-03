import Link from "next/link";

export default function MainNav() {
  return (
    <div className="header-buttons">
      <Link href="/">
        <button>Dashboard</button>
      </Link>
      <Link href="/Borrow-Tool">
        <button>Borrow Tool</button>
      </Link>
      <Link href="/Return-Tool">
        <button>Return Tool</button>
      </Link>
      <Link href="/Admin/Manage-Teams">
        <button>Admin Panel</button>
      </Link>
      <Link href="/api/auth/logout">
        <button>Logout</button>
      </Link>
    </div>
  );
}
