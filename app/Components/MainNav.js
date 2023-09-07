import Link from "next/link";

export default function MainNav() {
  return (
    <div className="header-buttons">
      <Link href="/">
        <button>Dashboard</button>
      </Link>
      <Link href="/borrow-tool">
        <button>Borrow Tool</button>
      </Link>
      <Link href="/return-tool">
        <button>Return Tool</button>
      </Link>
      <Link href="/admin/manage-teams">
        <button>Admin Panel</button>
      </Link>
      <a href="/api/auth/logout">
        <button>Logout</button>
      </a>
    </div>
  );
}
