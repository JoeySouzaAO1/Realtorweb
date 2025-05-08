'use client';
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from 'next/image';
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

export function Navbar() {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    // Prevent body scroll when menu is open
    document.body.style.overflow = isMobileMenuOpen ? 'auto' : 'hidden';
  };

  // Cleanup effect to restore body scroll when component unmounts
  useEffect(() => {
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  return (
    <nav className="sticky top-0 z-50 w-full">
      <div className="py-5 px-4 flex items-center justify-between border-b bg-white">
        {/* Left: Logo */}
        <div className="flex items-center flex-shrink-0">
          <Link href="/" className="flex items-center">
            <Image
              src="/FathomLogo-AvatarIcon.png"
              alt="Fathom Realty Logo"
              width={100}
              height={20}
              className="mr-4"
            />
            <h1 className="text-black text-3xl font-semibold cursor-pointer">
              Joey <span className="text-red-500">Souza</span>
            </h1>
          </Link>
        </div>

        {/* Center: Tabs */}
        <div className="hidden md:flex flex-1 justify-center gap-6">
          <Link href="/" className="text-gray-700 font-medium transition rounded-lg px-4 py-2 border hover:bg-red-50 hover:text-red-500 hover:border-red-200 focus:outline-none focus:ring-2 focus:ring-red-200 shadow-sm">
            Home
          </Link>
          <Link href="/myservices" className="text-gray-700 font-medium transition rounded-lg px-4 py-2 border hover:bg-red-50 hover:text-red-500 hover:border-red-200 focus:outline-none focus:ring-2 focus:ring-red-200 shadow-sm">
            My Services
          </Link>
          <Link href="/contact" className="text-gray-700 font-medium transition rounded-lg px-4 py-2 border hover:bg-red-50 hover:text-red-500 hover:border-red-200 focus:outline-none focus:ring-2 focus:ring-red-200 shadow-sm">
            Contact
          </Link>
          {isSignedIn && (
            <Link href="/admindashboard" className="text-gray-700 font-medium transition rounded-lg px-4 py-2 border hover:bg-red-50 hover:text-red-500 hover:border-red-200 focus:outline-none focus:ring-2 focus:ring-red-200 shadow-sm">
              Dashboard
            </Link>
          )}
        </div>

        {/* Right: Auth Link (Desktop) */}
        <div className="hidden md:block flex-shrink-0">
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

        {/* Hamburger Menu Button (Mobile) */}
        <button 
          className="md:hidden flex flex-col justify-center items-center w-8 h-8 space-y-1.5"
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
        >
          <span className={`block w-6 h-0.5 bg-gray-800 transform transition-transform duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
          <span className={`block w-6 h-0.5 bg-gray-800 transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`}></span>
          <span className={`block w-6 h-0.5 bg-gray-800 transform transition-transform duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
        </button>

        {/* Mobile Menu Dropdown */}
        <div 
          className={`absolute top-full left-0 right-0 bg-white shadow-lg transform transition-transform duration-300 origin-top md:hidden ${
            isMobileMenuOpen ? 'scale-y-100' : 'scale-y-0'
          }`}
        >
          <div className="flex flex-col py-4">
            <Link 
              href="/" 
              className="px-6 py-2 text-gray-700 hover:text-red-500 hover:bg-gray-50 font-medium transition"
              onClick={toggleMobileMenu}
            >
              Home
            </Link>
            <Link 
              href="/myservices" 
              className="px-6 py-2 text-gray-700 hover:text-red-500 hover:bg-gray-50 font-medium transition"
              onClick={toggleMobileMenu}
            >
              My Services
            </Link>
            <Link 
              href="/contact" 
              className="px-6 py-2 text-gray-700 hover:text-red-500 hover:bg-gray-50 font-medium transition"
              onClick={toggleMobileMenu}
            >
              Contact
            </Link>
            {isSignedIn && (
              <Link 
                href="/admindashboard" 
                className="px-6 py-2 text-gray-700 hover:text-red-500 hover:bg-gray-50 font-medium transition"
                onClick={toggleMobileMenu}
              >
                Dashboard
              </Link>
            )}
            <div className="px-6 py-2 border-t mt-2">
              {!isSignedIn ? (
                <Link 
                  href="/signin" 
                  className="text-gray-400 hover:text-red-500 text-sm"
                  onClick={toggleMobileMenu}
                >
                  Realtor Login
                </Link>
              ) : (
                <button
                  onClick={() => {
                    handleSignOut();
                    toggleMobileMenu();
                  }}
                  className="text-gray-400 hover:text-red-500 text-sm"
                >
                  Sign Out
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
