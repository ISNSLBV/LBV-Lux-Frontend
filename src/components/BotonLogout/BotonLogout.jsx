// src/components/BotonLogout.jsx
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { LogOut } from 'lucide-react';
import styles from './BotonLogout.module.css';

export default function BotonLogout() {
  const { logout }   = useAuth();
  const navigate     = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();          // llama al backend y limpia el contexto
      navigate('/login');      // redirige al login
    } catch (err) {
      console.error('Logout falló', err);
    }
  };

  return (
    <button className={styles.boton} onClick={handleLogout}>
      <LogOut size={32} />
      <span className={styles.texto}>Cerrar sesión</span>
    </button>
  );
}
