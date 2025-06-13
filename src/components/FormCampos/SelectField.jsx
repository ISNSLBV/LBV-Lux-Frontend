// components/preinscripcion/campos/SelectField.jsx
import React from 'react';
import styles from './estilos/SelectField.module.css'

const SelectField = ({ label, name, options = [], formik }) => {
  const { values, handleChange, handleBlur, errors, touched } = formik;
  const errorText = touched[name] && errors[name] ? errors[name] : '';

  return (
    <div className={styles.selectFieldGroup}>
      <label htmlFor={name}>
        {label} <span className="required">*</span>
      </label>
      <select
        id={name}
        name={name}
        value={values[name] || ''}
        onChange={handleChange}
        onBlur={handleBlur}
        className={errorText ? `${styles.selectError}` : ''}
      >
        <option value="" disabled>Seleccioná una opción</option>
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {errorText && <div className={styles.errorText}>{errorText}</div>}
    </div>
  );
};

export default SelectField;
