"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useParams } from "next/navigation";
import { Menu, X, ChevronDown } from "lucide-react";
import useThemeToggler from "@/state/themeState";
import useUserPassPhraseHash from "@/state/passphraseHash";

export default function VaultNavbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { PassPhraseHashValue } = useUserPassPhraseHash();
  const [vaultDropdown, setVaultDropdown] = useState(false);
  const [searchedText, setSearchedText] = useState("");
  const { theme, toggleTheme } = useThemeToggler();
  const pathname = usePathname();
  const params = useParams();
  const userId = params["user-id"];
  const token = params["token"];
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setVaultDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navLinkBase = "block px-3 py-1.5 rounded-md transition-colors";
  const navLinkActive = "bg-green-100 text-green-600 font-semibold";
  const navLinkHover =
    "text-gray-800 dark:text-gray-200 hover:bg-green-50 dark:hover:bg-green-700 hover:text-green-600 dark:hover:text-green-400";

  return (
    <header className="w-full rounded-lg rounded-t-none bg-white dark:bg-gray-900 dark:shadow-gray-700 text-black dark:text-white shadow-md fixed top-0 left-0 z-50 transition-colors duration-300">
      <div className="flex items-center justify-between px-5 py-2 md:px-8">
        {/* Logo */}
        <Link
          href="/"
          className="flex justify-center items-center gap-2 text-xl font-extrabold tracking-wide select-none"
        >
          <Image
            className="mt-[2px] dark:invert"
            width={36}
            height={36}
            src="/images/brandLogo.png"
            alt="logo"
          />
          <span className="text-green-600 dark:text-green-400">lockRift</span>
        </Link>

        {/* Hamburger */}
        <div className="lg:hidden">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
            className="focus:outline-none text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition"
          >
            {menuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>

        {/* Nav */}
        <nav
          className={`absolute lg:static top-14 left-0 w-full lg:w-auto transition-all duration-300 ease-in-out ${
            menuOpen ? "block" : "hidden"
          } bg-white dark:bg-gray-900 lg:bg-transparent lg:flex lg:items-center`}
        >
          <ul className="rounded-lg mt-1 shadow-lg grid grid-cols-2 sm:grid-cols-3 lg:shadow-none lg:flex lg:flex-row lg:items-center flex-wrap gap-y-2 lg:gap-x-4 px-6 lg:px-3 py-3 lg:py-1.5 text-[15px] font-medium text-gray-800 dark:text-gray-200">
            {/* Vault Dropdown */}
            <li className="relative" ref={dropdownRef}>
              <button
                onClick={() => setVaultDropdown(!vaultDropdown)}
                aria-haspopup="true"
                aria-expanded={vaultDropdown}
                className="group cursor-pointer flex items-center gap-1 text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition font-semibold"
              >
                Vault
                <ChevronDown
                  size={16}
                  style={{
                    transform: vaultDropdown ? "rotate(180deg)" : "rotate(0deg)",
                    transition: "transform 0.3s ease",
                  }}
                  className={`${
                    vaultDropdown
                      ? "text-green-600 dark:text-green-400"
                      : "text-gray-600 dark:text-gray-400"
                  } group-hover:text-green-600 dark:group-hover:text-green-400`}
                />
              </button>
             {vaultDropdown && (
                 <ul className="absolute top-12 left-0 w-56 bg-white dark:bg-gray-900 text-sm rounded-xl shadow-xl z-50 border border-gray-200                dark:border-gray-700 p-2 space-y-1 transition-all duration-300">
                   {[
                     {
                       href: `/user/${userId}/vault-items`,
                       label: '📦 Previous Vaults',
                       match: `/user/${userId}/vault-items`,
                     },
                     {
                       href: `/user/${userId}/shared-vault/${PassPhraseHashValue}`,
                       label: '🤝 Shared Vault',
                       match: `/user/${userId}/shared-vault/${token}`,
                     },
                     {
                       href: `/user/${userId}/new-vault`,
                       label: '➕ New Vault',
                       match: `/user/${userId}/new-vault`,
                     },
                     {
                       href: `/user/${userId}/vault-settings`,
                       label: '⚙️ Vault Settings',
                       match: `/user/${userId}/vault-settings`,
                     },
                     {
                       href: `/subscription`,
                       label: '💳 Subscription',
                       match: `/subscription`,
                     },
                   ].map(({ href, label, match }) => (
                     <li key={href}>
                       <Link
                         href={href}
                         className={`flex items-center px-4 py-2 text-[14px] rounded-md transition duration-200 ${
                           pathname === match
                             ? 'bg-gray-100 dark:bg-gray-700 text-blue-600 font-semibold'
                             : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                         }`}
                       >
                         {label}
                       </Link>
                     </li>
                   ))}
                 </ul>
               )}
            </li>

            {/* Links */}
            <li>
              <Link
                href={`/user/${userId}/dashboard`}
                className={`${navLinkBase} ${
                  pathname === `/user/${userId}/dashboard`
                    ? navLinkActive
                    : navLinkHover
                }`}
              >
                Dashboard
              </Link>
            </li>
            <li>
              <Link
                href={`/user/${userId}/breach-info`}
                className={`${navLinkBase} ${
                  pathname === `/user/${userId}/breach-info`
                    ? navLinkActive
                    : navLinkHover
                }`}
              >
                Breach Info
              </Link>
            </li>
            <li>
              <Link
                href={`/user/${userId}/audit-logs`}
                className={`${navLinkBase} ${
                  pathname === `/user/${userId}/audit-logs`
                    ? navLinkActive
                    : navLinkHover
                }`}
              >
                History
              </Link>
            </li>

            {/* Search */}
            <li>
              <input
                type="text"
                placeholder="Search..."
                value={searchedText}
                onChange={(e) => setSearchedText(e.target.value)}
                className="w-full max-w-[180px] px-3 py-1 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 placeholder-gray-500 text-sm border border-gray-300 dark:border-gray-600 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
                aria-label="Search"
              />
            </li>

            {/* Account */}
            <li>
              <Link
                href={`/user/${userId}/profile-details`}
                className={`${navLinkBase} ${
                  pathname === `/user/${userId}/profile-details`
                    ? navLinkActive
                    : navLinkHover
                }`}
              >
                Account
              </Link>
            </li>

            {/* Theme Toggle */}
            <li>
              <button
                className="cursor-pointer rounded-lg p-1 hover:bg-green-100 dark:hover:bg-green-700 transition"
                onClick={toggleTheme}
                aria-label="Toggle theme"
              >
                {theme === "light" ? (
                  <img
                    title="dark theme"
                    width={30}
                    className="dark:invert"
                    height={24}
                    src="/images/dark-mode.png"
                    alt="darkThemeSign"
                  />
                ) : (
                  <img
                    title="light theme"
                    width={30}
                    className="dark:invert"
                    height={24}
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
