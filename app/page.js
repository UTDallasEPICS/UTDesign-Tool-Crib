import Dashboard from "@/app/Components/Dashboard";
import Header from "./Components/Header";
import { auth0 } from "./lib/auth0";
import { redirect } from "next/navigation";

export const title = "Dashboard";

export default async function Home() {
  const session = await auth0.getSession();
  if (!session) {
    return redirect("/auth/login?returnTo=/");
  }
  return (
    <main>
      <Header title="Dashboard" />
      <Dashboard />
    </main>
  );
}
