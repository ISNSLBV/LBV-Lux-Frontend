import React from "react";
import styles from "./Navbar.module.css";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import logo from "../../../assets/logo.png";
import { useAuth } from "../../../contexts/AuthContext";
import { toast } from "react-toastify";

const Navbar = () => {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const { user, checking, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch {
      toast.error("Error al cerrar sesión");
    }
  };

  const opciones = [
    {
      titulo: "Panel de Administrador",
      redir: "/admin",
      rol: "Administrador",
    },
    {
      titulo: "Preguntas frecuentes",
      redir: "/preguntas-frecuentes",
    },
    {
      titulo: "Ayuda",
      redir: "/ayuda",
      rol: 'Administrador'
    },
    {
      titulo: "Cerrar sesión",
      redir: null,
    },
    {
      titulo: 'Perfil',
      redir: '/alumno/mi-perfil',
      rol: 'Alumno'
    },
  ];

  const opcionesFiltradas = opciones.filter(
    (o) => !o.rol || (user && user?.rol === o.rol)
  );

  if (checking) return null;

  return (
    <nav className={styles.navbar}>
      <button
        onClick={() => setMenuAbierto((prev) => !prev)}
        className={`${styles.hamburger}`}
      >
        <Menu size={32} strokeWidth={3} />
      </button>
      <ul
        className={`${styles.navbarList} ${
          menuAbierto ? styles.navbarListOpen : ""
        }`}
      >
        <li className={styles.mobileMenuControl} style={{ listStyle: "none" }}>
          <Link className={styles.logoContainer} to="/">
            <img className={styles.logo} src={logo} alt="" />
          </Link>
          <button
            onClick={() => setMenuAbierto(false)}
            className={`${styles.mobileMenuClose}`}
          >
            <X size={32} strokeWidth={3} />
          </button>
        </li>
        {opcionesFiltradas
          .filter((o) => o.titulo !== "Cerrar sesión")
          .map((o, i) => (
            <li className={styles.navbarItem} key={i}>
              <Link
                onClick={() => setMenuAbierto(false)}
                className={styles.navbarLink}
                to={o.redir}
              >
                {o.titulo}
              </Link>
            </li>
          ))}
        {user && (
          <li className={`${styles.navbarItem} ${styles.navbarBotonLogout}`}>
            <button className={styles.navbarLink} onClick={handleLogout}>
              Cerrar sesión
            </button>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
