'use client';
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from 'next/image';
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

export function Navbar() {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsSignedIn(!!session);
    };
    checkSession();
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setIsSignedIn(!!session);
      }
    );
    return () => {
      subscription?.unsubscribe();
    };
  }, [supabase]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <nav className="py-5 px-4 flex items-center justify-between border-b bg-white">
      {/* Left: Logo and Tabs */}
      <div className="flex items-center gap-8">
        <Link href="/" className="flex items-center">
          <Image
            src="/FathomLogo-WhiteBackground copy.jpg"
            alt="Fathom Realty Logo"
            width={150}  // Adjust as needed
            height={40} // Adjust as needed
            className="mr-4"
          />
          <h1 className="text-black text-3xl font-semibold cursor-pointer">
            Joey <span className="text-red-500">Souza</span>
          </h1>
        </Link>
        <div className="hidden md:flex gap-6 ml-6">
          <Link href="/" className="text-gray-700 hover:text-red-500 font-medium transition">Home</Link>
          <Link href="/myservices" className="text-gray-700 hover:text-red-500 font-medium transition">My Services</Link>
          <Link href="/contact" className="text-gray-700 hover:text-red-500 font-medium transition">Contact</Link>

          {isSignedIn && (
            <Link href="/admindashboard" className="text-gray-700 hover:text-red-500 font-medium transition">Dashboard</Link>
          )}
        </div>
      </div>
      {/* Right: Discrete Auth Link */}
      <div>
        {!isSignedIn ? (
          <Link href="/signin" className="text-xs text-gray-400 hover:text-red-500">Realtor Login</Link>
        ) : (
          <button
            onClick={handleSignOut}
            className="text-xs text-gray-400 hover:text-red-500"
          >
            Sign Out
          </button>
        )}
      </div>
    </nav>
  );
}
