import React from "react";
import { useAuth } from "../../contexts/AuthContext";
import BotonVolver from "../../components/BotonVolver/BotonVolver";

const Ayuda = () => {
  const { user } = useAuth();

  const manuales = {
    Alumno:
      "https://docs.google.com/presentation/d/e/2PACX-1vQtTLRRVohyKQP0IcqATKAgU0C8caqOBf3c17qoGk5Aoy0N1LUaKq5LcwNhhr3iq4N2-t3mqFkXeXPD/pubembed?start=false&loop=false&delayms=3000",
    Profesor:
      "https://docs.google.com/presentation/d/e/2PACX-1vQINLebkBt5OLy9mX8Cg435mgvq-aICHO9sNDvhGeK5tOzgnV0gTf_imkNavVjJHW0UQSGWVeT7QKuM/pubembed?start=false&loop=false&delayms=3000",
    Administrador:
      "https://docs.google.com/presentation/d/e/2PACX-1vSlLB3ssQROoat-B59VsVsoJ5WyNHR3oToM7dz3w5hFaXaYB2CEtbk7FpTHufgs-Flm0xLhQNjTu08Q/pubembed?start=false&loop=false&delayms=3000",
  };

  return (
    <>
      <BotonVolver />
      <div>
        <h1>Manual de usuario del {user?.rol.toLowerCase()}</h1>
        <p>
          Consultá a continuación el manual de usuario correspondiente a tu rol.
          En caso de dudas, contactá a secretaría
        </p>
      </div>
      <iframe src={manuales[user?.rol]} width="100%" height="569px" />
    </>
  );
};

export default Ayuda;
