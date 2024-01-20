import { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authContext } from "../../context/AuthContext";
import Header from "../../layout/Header";
import Footer from "../../layout/Footer";
import "./LoginPage.scss";

const LoginPage = () => {
  const [statusMessage, setStatusMessage] = useState("");
  const [context, setContext] = useContext(authContext);
  const [shakeAnimation, setShakeAnimation] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleLogin = async () => {
      if (context?.token) {
        console.log("Usuario autenticado:", context);
        alert(`Loggeado correctamente, bienvenid@ ${context?.name}!`);
        navigate("/");
      }
    };

    handleLogin();
  }, [context, navigate]);

  const authUser = async (e) => {
    e.preventDefault();
    const loginBody = {
      email: e.target.elements.email.value,
      password: e.target.elements.password.value,
    };

    try {
      const res = await fetch(
        `${import.meta.env.VITE_HOST_BACK}:${
          import.meta.env.VITE_PORT_BACK
        }/login`,
        {
          body: JSON.stringify(loginBody),
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (res.ok) {
        const body = await res.json();
        const updatedContext = {
          name: body.name,
          token: body.token,
          role: body.rol,
        };
        setContext(updatedContext);

        if (updatedContext.token) {
          alert(`Loggeado correctamente, bienvenid@ ${updatedContext.name}!`);
          navigate("/");
        }
      } else {
        const body = await res.json();
        setStatusMessage(body.error);
        setShakeAnimation(true);
        setTimeout(() => {
          setShakeAnimation(false);
        }, 500);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const userFetchResponse = statusMessage;

  return (
    <>
      <Header />

      <section className="login-page">
        <h1>Login</h1>
        {statusMessage ? (
          <p className={`status-message ${shakeAnimation ? "shake" : ""}`}>
            {userFetchResponse}
          </p>
        ) : (
          <p className="intro-text">Introduce los datos</p>
        )}
        <form className="login-container" onSubmit={authUser}>
          <label htmlFor="email">Email</label>
          <input type="email" name="email" id="email" />
          <label htmlFor="password">Password</label>
          <input type="password" name="password" id="password" />
          <input type="submit" className="submit-btn" />
        </form>
        <Link to="/forgot-password" className="forgot-password">
          Olvide la contraseña
        </Link>
      </section>
      <Footer />
    </>
  );
};

export default LoginPage;