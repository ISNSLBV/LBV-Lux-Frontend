import React from 'react'
import { Link } from 'react-router-dom'
import logo from '../../assets/logo2.png'
import styles from './Header.module.css'
import Navbar from './Navbar/Navbar'

const Header = () => {
  return (
    <header>
        <Link className={styles.logoContainer} to="/">
            <img className={styles.logo} src={logo} alt="" />
        </Link>
        <Navbar />
    </header>
  )
}

export default Header