import { useAuth } from "@/context/authContext";
import { redirect } from "next/navigation";

// components/Header.tsx
export default function Header() {
  const {isAuthenticated}=useAuth();
  if(!isAuthenticated){
    console.log("Non Authenticated")
     redirect("/auth/sign-in")

  }
  console.log("USER",isAuthenticated)
  return (
    <header className="bg-white shadow p-4 flex justify-between items-center">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <div className="flex items-center gap-4">
        <span className="text-sm">User Name</span>
        <button className="bg-gray-200 p-2 rounded-full">Logout</button>
      </div>
    </header>
  );
}