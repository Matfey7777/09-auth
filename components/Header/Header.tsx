"use client";
import Link from "next/link";
import css from "./Header.module.css";
import { useAuthStore } from "@/lib/store/authStore";
import { logout } from "@/lib/api/clientApi";

export default function Header() {
  const { isAuthenticated, clearIsAuthenticated } = useAuthStore();
  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      clearIsAuthenticated();
    }
  };

  return (
    <header className={css.header}>
      <Link href="/" aria-label="Home">
        NoteHub
      </Link>
      <nav aria-label="Main Navigation">
        <ul className={css.navigation}>
          <li>
            <Link href="/">Home</Link>
          </li>
          <li>
            <Link href="/notes/filter/all">Notes</Link>
          </li>
          {!isAuthenticated && (
            <>
              <li>
                <Link href="/sign-up">Register</Link>
              </li>
              <li>
                <Link href="/sign-in">Login</Link>
              </li>
            </>
          )}
          {isAuthenticated && (
            <>
              <li>
                <Link href="/profile">Profile</Link>
              </li>
              <li>
                <button type="button" onClick={handleLogout}>
                  Logout
                </button>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
}
