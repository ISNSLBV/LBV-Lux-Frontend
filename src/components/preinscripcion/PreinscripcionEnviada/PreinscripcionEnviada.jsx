import React from "react";
import styles from "./PreinscripcionEnviada.module.css";
import {
  CheckCircle,
  XCircle,
  Mail,
  Phone,
  FileText,
  Home,
  RefreshCw,
  Clock,
  AlertTriangle,
  ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const PreinscripcionEnviada = ({ exito, mensaje, successData }) => {
  const navigate = useNavigate();
  const nextSteps = [
    {
      step: 1,
      title: "Confirmación por Email",
      description: "En breve recibirás un email de confirmación",
      icon: Mail,
      status: "pending",
    },
    {
      step: 2,
      title: "Entrega de Documentación",
      description:
        "Para continuar con la inscripción, deberás presentarte en el instituto y entregar la documentación detallada en esta página",
      icon: FileText,
      status: "pending",
    },
  ];

  const importantInfo = [
    {
      title: "Documentación Requerida",
      items: [
        "DNI (fotocopia)",
        "Analítico o Constancia de análitico en trámite",
        "2 fotos 4x4",
      ],
    },
    {
      title: "Información de Contacto",
      items: [
        "Teléfono: (011) 5263-2395",
        "Email: terciario@lujanbuenviaje.edu.ar",
        "Horario: Lun-Vie 19:00-22:00",
      ],
    },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.mainContent}>
        {exito ? (
          <>
            <div className={styles.resultHeader}>
              <div className={styles.successIcon}>
                <CheckCircle className={styles.iconLarge} />
              </div>
              <h1 className={styles.titleSuccess}>¡Preinscripción Enviada!</h1>
              <p className={styles.subtitle}>
                Tu solicitud ha sido recibida correctamente
              </p>
            </div>

            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <FileText className={styles.cardIcon} />
                <h2 className={styles.cardTitle}>
                  Detalles de tu Preinscripción
                </h2>
              </div>
              <div className={styles.cardContent}>
                <div className={styles.detailsGrid}>
                  <div className={styles.detailsColumn}>
                    <div className={styles.detailItem}>
                      <p className={styles.detailLabel}>
                        Número de Preinscripción
                      </p>
                      <p className={styles.detailValue}>
                        {successData.registrationNumber}
                      </p>
                    </div>
                    <div className={styles.detailItem}>
                      <p className={styles.detailLabel}>
                        Fecha y Hora de Envío
                      </p>
                      <p className={styles.detailText}>
                        {successData.submissionDate} a las{" "}
                        {successData.submissionTime}
                      </p>
                    </div>
                  </div>
                  <div className={styles.detailsColumn}>
                    <div className={styles.detailItem}>
                      <p className={styles.detailLabel}>Carrera Seleccionada</p>
                      <p className={styles.detailText}>
                        {successData.studentData.career}
                      </p>
                    </div>
                    <div className={styles.detailItem}>
                      <p className={styles.detailLabel}>Email de Contacto</p>
                      <p className={styles.detailText}>
                        {successData.studentData.email}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.contentGrid}>
              <div className={styles.card}>
                <div className={styles.cardHeader}>
                  <ArrowRight className={styles.cardIcon} />
                  <h2 className={styles.cardTitle}>Próximos Pasos</h2>
                </div>
                <div className={styles.cardContent}>
                  <div className={styles.stepsList}>
                    {nextSteps.map((step, index) => (
                      <div key={index} className={styles.stepItem}>
                        <div className={styles.stepNumber}>
                          <span>{step.step}</span>
                        </div>
                        <div className={styles.stepContent}>
                          <h3 className={styles.stepTitle}>{step.title}</h3>
                          <p className={styles.stepDescription}>
                            {step.description}
                          </p>
                        </div>
                        <div className={styles.stepIcon}>
                          <step.icon className={styles.stepIconSvg} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className={styles.card}>
                <div className={styles.cardHeader}>
                  <AlertTriangle className={styles.cardIcon} />
                  <h2 className={styles.cardTitle}>Información Importante</h2>
                </div>
                <div className={styles.cardContent}>
                  <div className={styles.infoList}>
                    {importantInfo.map((info, index) => (
                      <div key={index} className={styles.infoSection}>
                        <h3 className={styles.infoTitle}>{info.title}</h3>
                        <ul className={styles.infoItems}>
                          {info.items.map((item, itemIndex) => (
                            <li key={itemIndex} className={styles.infoItem}>
                              <div className={styles.bullet}></div>
                              {item}
                            </li>
                          ))}
                        </ul>
                        {index < importantInfo.length - 1 && (
                          <div className={styles.separator}></div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.actionButtons}>
              <button
                className={styles.primaryButton}
                onClick={() => navigate("/login")}
              >
                <Home className={styles.buttonIcon} />
                Volver al Inicio
              </button>
            </div>
          </>
        ) : (
          <>
            <div className={styles.resultHeader}>
              <div className={styles.errorIcon}>
                <XCircle className={styles.iconLarge} />
              </div>
              <h1 className={styles.titleError}>Error en la Preinscripción</h1>
              <p className={styles.subtitle}>
                No pudimos procesar tu solicitud
              </p>
            </div>

            <div className={styles.errorCard}>
              <div className={styles.cardHeader}>
                <AlertTriangle className={styles.errorCardIcon} />
                <h2 className={styles.cardTitle}>Detalles del Error</h2>
              </div>
              <div className={styles.cardContent}>
                <div className={styles.errorMessage}>
                  <p className={styles.errorTitle}>Error de Validación</p>
                  <p className={styles.errorDescription}>{mensaje}</p>
                </div>
                <div className={styles.errorCauses}>
                  <p className={styles.causesTitle}>Posibles causas:</p>
                  <ul className={styles.causesList}>
                    <li className={styles.causeItem}>
                      <div className={styles.errorBullet}></div>
                      Email inválido o ya registrado
                    </li>
                    <li className={styles.causeItem}>
                      <div className={styles.errorBullet}></div>
                      DNI ya registrado en el sistema
                    </li>
                    <li className={styles.causeItem}>
                      <div className={styles.errorBullet}></div>
                      Problemas de conexión con el servidor
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className={styles.contentGrid}>
              <div className={styles.card}>
                <div className={styles.cardHeader}>
                  <RefreshCw className={styles.cardIcon} />
                  <h2 className={styles.cardTitle}>¿Qué podés hacer?</h2>
                </div>
                <div className={styles.cardContent}>
                  <div className={styles.stepsList}>
                    <div className={styles.stepItem}>
                      <div className={styles.stepNumber}>
                        <span>1</span>
                      </div>
                      <div className={styles.stepContent}>
                        <h3 className={styles.stepTitle}>Revisar los datos</h3>
                        <p className={styles.stepDescription}>
                          Verificá que todos los campos estén completos y
                          correctos
                        </p>
                      </div>
                    </div>
                    <div className={styles.stepItem}>
                      <div className={styles.stepNumber}>
                        <span>2</span>
                      </div>
                      <div className={styles.stepContent}>
                        <h3 className={styles.stepTitle}>
                          Intentar nuevamente
                        </h3>
                        <p className={styles.stepDescription}>
                          Completá el formulario otra vez con los datos
                          correctos
                        </p>
                      </div>
                    </div>
                    <div className={styles.stepItem}>
                      <div className={styles.stepNumber}>
                        <span>3</span>
                      </div>
                      <div className={styles.stepContent}>
                        <h3 className={styles.stepTitle}>Contactanos</h3>
                        <p className={styles.stepDescription}>
                          Si el problema persiste, contactanos directamente
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles.card}>
                <div className={styles.cardHeader}>
                  <Phone className={styles.cardIcon} />
                  <h2 className={styles.cardTitle}>
                    Nuestros medios de contacto
                  </h2>
                </div>
                <div className={styles.cardContent}>
                  <div className={styles.contactList}>
                    <div className={styles.contactItem}>
                      <Phone className={styles.contactIcon} />
                      <div className={styles.contactInfo}>
                        <p className={styles.contactLabel}>Teléfono</p>
                        <p className={styles.contactValue}>(011) 5263-2395</p>
                      </div>
                    </div>
                    <div className={styles.contactItem}>
                      <Mail className={styles.contactIcon} />
                      <div className={styles.contactInfo}>
                        <p className={styles.contactLabel}>Email</p>
                        <p className={styles.contactValue}>
                          terciario@lujanbuenviaje.edu.ar
                        </p>
                      </div>
                    </div>
                    <div className={styles.contactItem}>
                      <Clock className={styles.contactIcon} />
                      <div className={styles.contactInfo}>
                        <p className={styles.contactLabel}>
                          Horario de Atención
                        </p>
                        <p className={styles.contactValue}>
                          Lunes a Viernes: 19:00 - 22:00
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.actionButtons}>
              <button
                className={styles.primaryButton}
                onClick={() => window.location.reload()}
              >
                <RefreshCw className={styles.buttonIcon} />
                Intentar Nuevamente
              </button>
              <button
                className={styles.secondaryButton}
                onClick={() => navigate("/login")}
              >
                <Home className={styles.buttonIcon} />
                Volver al Inicio
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PreinscripcionEnviada;
