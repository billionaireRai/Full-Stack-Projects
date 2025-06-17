"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { Menu, X, ChevronDown } from "lucide-react";
import useThemeToggler from "@/state/themeState";

export default function VaultNavbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [vaultDropdown, setvaultDropdown] = useState(false);
  const { theme, toggleTheme } = useThemeToggler();

  const params = useParams();
  const userId = params["user-id"];
  const token = params["token"];

  return (
    <header className="w-full rounded-lg rounded-t-none bg-white dark:shadow-gray-500 text-black shadow-lg fixed top-0 left-0 z-50 transition-colors duration-300">
      <div className="flex items-center justify-between px-4 py-3 md:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 text-xl font-bold tracking-wide">
          <Image className="mt-[2px]" width={35} height={35} src="/images/brandLogo.png" alt="logo" />
          <span>lockRift</span>
        </Link>

        {/* Hamburger menu */}
        <div className="lg:hidden">
          <button onClick={() => setMenuOpen(!menuOpen)} className="focus:outline-none">
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Navigation */}
        <nav
          className={`absolute lg:static top-16 left-0 w-full lg:w-auto transition-all duration-200 ease-in-out ${
            menuOpen ? "block" : "hidden"
          } bg-white lg:bg-transparent lg:flex lg:items-center`}
        >
          <ul className="rounded-lg mt-2 shadow-lg grid grid-cols-2 sm:grid-cols-3 lg:shadow-none lg:flex lg:flex-row lg:items-center gap-3 lg:gap-6 px-4 lg:px-0 py-4 lg:py-0 text-sm font-medium text-black">
            {/* Vault Dropdown */}
            <li className="relative">
              <button
                onClick={() => setvaultDropdown(!vaultDropdown)}
                className="cursor-pointer flex items-center gap-1 hover:text-green-400 transition"
              >
                Vault <ChevronDown size={15} />
              </button>
              {vaultDropdown && (
                <ul className="absolute top-10 left-0 w-48 bg-white text-sm rounded-lg shadow-lg z-50 border-none">
                  <li>
                    <Link
                      href={`/user/${userId}/vault-item`}
                      className="block p-3 text-center text-black hover:bg-gray-100 hover:text-green-400 rounded-md m-1 transition-colors"
                    >
                      previous vaults
                    </Link>
                  </li>
                  <li>
                    <Link
                      href={`/user/${userId}/new-vault`}
                      className="block p-3 text-center text-black hover:bg-gray-100 hover:text-green-400 rounded-md m-1 transition-colors"
                    >
                      new vault
                    </Link>
                  </li>
                  <li>
                    <Link
                      href={`/user/${userId}/shared-vault/${token}`}
                      className="block p-3 text-center text-black hover:bg-gray-200 hover:text-green-400 rounded-md m-1 transition-colors"
                    >
                      shared vault
                    </Link>
                  </li>
                </ul>
              )}
            </li>

            {/* Navigation links */}
            <li className="hover:text-green-400">
              <Link href={`/user/${userId}/dashboard`}>dashboard</Link>
            </li>
            <li className="hover:text-green-400">
              <Link href={`/user/${userId}/breach-info`}>BreachInfo</Link>
            </li>
            <li className="hover:text-green-400">
              <Link href={`/user/${userId}/vault-settings`}>VaultSettings</Link>
            </li>
            <li className="hover:text-green-400">
              <Link href={`/user/${userId}/audit-logs`}>History</Link>
            </li>

            {/* Search Bar */}
            <li>
              <input
                type="text"
                placeholder="Search..."
                className="w-full max-w-xs px-4 py-2 rounded-lg bg-white text-gray-800 placeholder-gray-500 text-sm border border-gray-300 shadow-sm focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 transition"
              />
            </li>

            {/* Account */}
            <li className="hover:text-green-400">
              <Link href={`/user/${userId}/profile-details`}>Account</Link>
            </li>

            {/* Theme Toggle Button */}
            <li className="hover:text-green-400">
              <button
                className="cursor-pointer border-none animate-pulse rounded-lg"
                onClick={toggleTheme}
              >
                {theme === "light" ? (
                  <img
                    title="dark theme"
                    width={40}
                    height={30}
                    src="/images/dark-mode.png"
                    alt="darkThemeSign"
                  />
                ) : (
                  <img
                    title="light theme"
                    width={40}
                    height={30}
                    src="/images/light-mode.png"
                    alt="lightThemeSign"
                  />
                )}
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
