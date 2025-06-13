import React from 'react'
import LoginForm from '../../components/LoginForm/LoginForm'
import styles from './Login.module.css'

const Login = () => {
  return (
    <div className={styles.container}>
        <LoginForm />
    </div>
  )
}

export default Login