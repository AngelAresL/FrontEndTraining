import { useState } from "react";

const OrderAndSearchInputTraining = ({ setAllTraining }) => {
  const [name, setName] = useState("");
  const [typology, setTypology] = useState("");
  const [muscleGroup, setMuscleGroup] = useState("");
  const tokenHardcoded =
    "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwicm9sIjoibm9ybWFsIiwiaWF0IjoxNzA1NDI3MTMzLCJleHAiOjE3MDgwMTkxMzN9.0v2wqt3G2sanwdrr4z0wBuwWr9yB7IL606j4X1YlO5Y";

  let nameOk;
  let typologyOk;
  if (name) {
    nameOk = `name=${name}`;
  } 
  if (typology) {
    typologyOk = `typology=${typology}`;
  }
  const getTrainingFetch = async () => {
    try {
      const res = await fetch(
        `http://localhost:8000/training?${nameOk}&${typologyOk}`,
        {
          headers: {
            Authorization: tokenHardcoded,
          },
        }
      );
      if (!res.ok) {
        throw new Error("Network response was not ok " + res.statusText);
      }

      const body = await res.json();
      console.log(body.data);

      setAllTraining(body.data);
    } catch (error) {
      console.error("Error:", error.menssage);
    }
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        getTrainingFetch();
      }}
    >
      <div>
        <label htmlFor="typology">Tipologia</label>
        <input
          type="text"
          id="typology"
          value={typology}
          onChange={(e) => {
            setTypology(e.target.value);
          }}
        />
      </div>
      <div>
        <label htmlFor="name">Nombre</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
          }}
        />
      </div>
      <div>
        <label htmlFor="muscleGroup">Grupo Muscular</label>
        <input
          type="text"
          id="muscleGroup"
          value={muscleGroup}
          onChange={(e) => {
            setMuscleGroup(e.target.value);
          }}
        />
      </div>
      <button>Buscar</button>
      <select
        value=""
        name="order"
        id="order"
        onChange={(e) => {
          e.preventDefault();

          getTrainingFetch(e.target.value);
        }}
      >
        <option value="">Ordenar por</option>
        <option value="name">Nombre</option>
        <option value="date">Fecha</option>
        <option value="likes">Likes</option>
      </select>
    </form>
  );
};

export default OrderAndSearchInputTraining;
