import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authContext } from "../../context/AuthContext";
import Swal from "sweetalert2";
import UseValidateUser from "../../hooks/UseValidateUser";
import { useQuery } from "react-query";
import Loading from "../../components/Loading/Loading";
import useFetchHooks from "../../hooks/useFetchHooks";
import "./UserForm.scss";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
const UserForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");

  const [dataDb, setDataDb] = useState({});

  const [setShakeAnimation] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  const [context] = useContext(authContext);

  const navigate = useNavigate();

  const { hookGetFetch } = useFetchHooks();
  const { isLoading, isSuccess } = useQuery(
    ["usersGetUser", "getUser"],
    () => hookGetFetch(`getUser`),
    {
      onSuccess: (data) => {
        setDataDb(data);
        setName(data.name);
        setEmail(data.email);
      },
    }
  );

  const modifyUser = async (e) => {
    e.preventDefault();
    if (dataDb.name === name && dataDb.email === email) {
      setStatusMessage("Debes cambiar algún dato ✌️");
      setShakeAnimation(true);
      setTimeout(() => {
        setShakeAnimation(false);
      }, 500);
    } else {
      const validated = UseValidateUser(
        name,
        email,
        setStatusMessage,
        setShakeAnimation
      );

      if (validated) {
        try {
          const formData = new FormData();
          formData.append("name", name);
          formData.append("email", email);
          formData.append("password", pass);

          console.log("Datos a enviar: ", formData);

          const res = await fetch(
            `${import.meta.env.VITE_HOST_BACK}:${
              import.meta.env.VITE_PORT_BACK
            }/modifyUser`,
            {
              method: "PUT",
              headers: {
                Authorization: `Bearer ${context.token}`,
              },
              body: formData,
            }
          );

          if (res.ok) {
            Swal.fire({
              position: "top-center",
              icon: "success",
              title: `La modificacion ha sido completada con exito!`,
              showConfirmButton: false,
              timer: 2500,
              customClass: {
                popup: "rounded-popup",
              },
            });

            navigate(`/`);
            setName("");
            setEmail("");
            setPass("");
          } else {
            const body = await res.json();
            console.log(body.error);
            setStatusMessage(body.error);
            setShakeAnimation(true);
            setTimeout(() => {
              setShakeAnimation(false);
            }, 500);
          }
        } catch (error) {
          console.error(error);
          setShakeAnimation(true);
          setTimeout(() => {
            setShakeAnimation(false);
          }, 500);
        }
      }
    }
  };

  return (
    <>
      <section className="user-page">
        <h1>Modificar usuario</h1>

        <ErrorMessage message={statusMessage} />
        {isLoading ? <Loading /> : null}
        {isSuccess ? (
          <form onSubmit={modifyUser} className="user-form">
            <label htmlFor="name">Nombre</label>
            <input
              type="text"
              name="name"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <label htmlFor="email">Email</label>
            <input
              type="email"
              name="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <label htmlFor="pass">Nueva password</label>
            <input
              type="password"
              name="pass"
              id="pass"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
            />

            <button type="submit" className="submit-btn">
              Modificar datos
            </button>
          </form>
        ) : null}
      </section>
    </>
  );
};

export default UserForm;
