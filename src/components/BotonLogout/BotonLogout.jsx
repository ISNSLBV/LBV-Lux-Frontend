import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import styles from './BotonLogout.module.css';

export default function BotonLogout() {
  const { logout }   = useAuth();
  const navigate     = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/alumnos2025/login');
    } catch (err) {
      console.error('Error al cerrar sesión', err);
    }
  };

  return (
    <button className={styles.boton} onClick={handleLogout}>
      <span className={styles.texto}>Cerrar sesión</span>
    </button>
  );
}
