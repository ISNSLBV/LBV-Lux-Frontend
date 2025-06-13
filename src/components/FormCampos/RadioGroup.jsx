// components/preinscripcion/campos/RadioGroup.jsx
import React from 'react';
import styles from './estilos/RadioGroup.module.css'

const RadioGroup = ({ label, name, options = [], formik }) => {
  const { values, handleChange, handleBlur, errors, touched } = formik;
  const errorText = touched[name] && errors[name] ? errors[name] : '';

  return (
    <div className={styles.radioGroup}>
      <p>{label} <span className="required">*</span></p>
      <div className={styles.radioOptions}>
        {options.map(opt => (
          <label key={opt.value}>
            <input
              type="radio"
              name={name}
              value={opt.value}
              checked={values[name] === opt.value}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {opt.label}
          </label>
        ))}
      </div>
      {errorText && <div className={styles.errorText}>{errorText}</div>}
    </div>
  );
};

export default RadioGroup;
