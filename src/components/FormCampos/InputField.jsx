import React from 'react';
import styles from './estilos/InputField.module.css'

const InputField = ({ label, name, placeholder = '', formik, type = 'text' }) => {
  const { values, handleChange, handleBlur, errors, touched } = formik;
  const errorText = touched[name] && errors[name] ? errors[name] : '';

  return (
    <div className={styles.inputFieldGroup}>
      <label htmlFor={name}>
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        value={values[name] || ''}
        onChange={handleChange}
        onBlur={handleBlur}
        className={errorText ? `${styles.inputError}` : ''}
      />
      {errorText && <div className={styles.errorText}>{errorText}</div>}
    </div>
  );
};

export default InputField;