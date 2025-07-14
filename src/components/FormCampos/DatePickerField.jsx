import React from 'react';
import styles from './estilos/DatePickerField.module.css';
import { Calendar } from 'lucide-react';

const DatePickerField = ({ label, name, formik }) => {
  const { values, setFieldValue, handleBlur, errors, touched } = formik;
  const errorText = touched[name] && errors[name] ? errors[name] : '';

  return (
    <div className={styles.datePickerGroup}>
      <label htmlFor={name}>{label}</label>
      <div className={styles.inputWrapper}>
        <input
          type="date"
          id={name}
          name={name}
          value={values[name] || ''}
          onChange={(e) => {
            setFieldValue(name, e.target.value || '');
          }}
          onBlur={handleBlur}
          placeholder="dd/mm/aaaa"
          className={`${styles.inputField} ${errorText ? styles.inputError : ''}`}
        />
        <Calendar className={styles.icon} />
      </div>
      {errorText && <div className={styles.errorText}>{errorText}</div>}
    </div>
  );
};

export default DatePickerField;