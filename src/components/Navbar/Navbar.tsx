import { NavLink } from "react-router-dom";
import styles from "./Navbar.module.css";
import useAuthContext from "../../hooks/useAuthContext";
import { useAuthentication } from "../../hooks/useAuthentication";
import { useState } from "react";

const Navbar = () => {
  const { user } = useAuthContext();
  const { logout } = useAuthentication();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <nav className={styles.navbar}>
      <NavLink to="/" className={styles.brand} onClick={closeMenu}>
        Vini <span>Blog</span>
      </NavLink>

      <button
        className={styles.hamburger}
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        <span className={styles.bar}></span>
        <span className={styles.bar}></span>
        <span className={styles.bar}></span>
      </button>

      <ul
        className={`${styles.links_list} ${isMenuOpen ? styles.show_menu : ""}`}
      >
        <li onClick={closeMenu}>
          <NavLink
            to="/"
            className={({ isActive }) => (isActive ? styles.active : "")}
          >
            Home
          </NavLink>
        </li>

        {!user && (
          <>
            <li onClick={closeMenu}>
              <NavLink
                to="/login"
                className={({ isActive }) => (isActive ? styles.active : "")}
              >
                Entrar
              </NavLink>
            </li>
            <li onClick={closeMenu}>
              <NavLink
                to="/register"
                className={({ isActive }) => (isActive ? styles.active : "")}
              >
                Cadastrar
              </NavLink>
            </li>
          </>
        )}
        {user && (
          <>
            <li onClick={closeMenu}>
              <NavLink
                to="/posts/create"
                className={({ isActive }) => (isActive ? styles.active : "")}
              >
                Novo post
              </NavLink>
            </li>
            <li onClick={closeMenu}>
              <NavLink
                to="/dashboard"
                className={({ isActive }) => (isActive ? styles.active : "")}
              >
                Dashboard
              </NavLink>
            </li>
          </>
        )}
        <li onClick={closeMenu}>
          <NavLink
            to="/about"
            className={({ isActive }) => (isActive ? styles.active : "")}
          >
            Sobre
          </NavLink>
        </li>
        {user && (
          <li onClick={closeMenu}>
            <button onClick={logout}>Sair</button>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
