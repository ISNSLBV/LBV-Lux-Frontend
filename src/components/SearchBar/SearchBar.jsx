import React from 'react'
import { Search } from 'lucide-react'
import styles from './SearchBar.module.css'

const SearchBar = ({ placeholder, ...props }) => {
  return (
    <div className={styles.container}>
        <Search className={styles.icono} />
        <input className={styles.input} type="text" placeholder={placeholder} {...props} />
    </div>
  )
}

export default SearchBar