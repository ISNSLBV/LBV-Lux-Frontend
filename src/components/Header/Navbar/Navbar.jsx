import React from "react";
import styles from "./Navbar.module.css";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import logo from "../../../assets/logo.png";
import BotonLogout from "../../BotonLogout/BotonLogout";
import { useAuth } from "../../../contexts/AuthContext";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, checking } = useAuth();

  const esAdmin = user?.rol === "Administrador";
  const esProfesor = user?.rol === "Profesor";
  const esAlumno = user?.rol === "Alumno";

  console.log("checking:", checking);
  console.log("user:", user);
  console.log("esAdmin:", user?.rol === "Administrador");

  return (
    <nav className={styles.navbar}>
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className={`${styles.hamburger}`}
      >
        <Menu size={32} strokeWidth={3} />
      </button>
      <ul
        className={`${styles.navbarList} ${
          isOpen ? styles.navbarListOpen : ""
        }`}
      >
        <li className={styles.mobileMenuControl} style={{ listStyle: "none" }}>
          <Link className={styles.logoContainer} to="/">
            <img className={styles.logo} src={logo} alt="" />
          </Link>
          <button
            onClick={() => setIsOpen(false)}
            className={`${styles.mobileMenuClose}`}
          >
            <X size={32} strokeWidth={3} />
          </button>
        </li>
        {!checking && esAdmin && (
          <li className={styles.navbarItem}>
            <Link
              onClick={() => setIsOpen(false)}
              className={styles.navbarLink}
              to="/admin/"
            >
              Panel de Administrador
            </Link>
          </li>
        )}
        <li className={styles.navbarItem}>
          <Link
            onClick={() => setIsOpen(false)}
            className={styles.navbarLink}
            to="/preguntas-frecuentes"
          >
            Preguntas frecuentes
          </Link>
        </li>
        <li className={styles.navbarItem}>
          <Link onClick={() => setIsOpen(false)} className={styles.navbarLink}>
            Ayuda
          </Link>
        </li>
        <li className={`${styles.navbarItem} ${styles.navbarBotonLogout}`}>
          <BotonLogout />
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
