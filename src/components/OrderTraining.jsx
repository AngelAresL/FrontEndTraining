import { useState } from "react";

const OrderAndSearchInputTraining = ({ allTraining, setAllTraining }) => {
  const [name, setName] = useState("");
  const [typology, setTypology] = useState("");
  const [muscleGroup, setMuscleGroup] = useState("");
  const [orderBy, setOrderBy] = useState("");
  const tokenHardcoded =
    "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwicm9sIjoibm9ybWFsIiwiaWF0IjoxNzA1NDI3MTMzLCJleHAiOjE3MDgwMTkxMzN9.0v2wqt3G2sanwdrr4z0wBuwWr9yB7IL606j4X1YlO5Y";

  let nameOk;
  let typologyOk;
  let muscleGroupOk;
  let orderByOk;

  if (name) {
    nameOk = `name=${name}`;
  }
  if (typology) {
    typologyOk = `typology=${typology}`;
  }
  if (muscleGroup) {
    muscleGroupOk = `muscle_group=${muscleGroup}`;
  }
  if (orderBy) {
    orderByOk = `order_by=${orderBy}`;
  }
  const getTrainingFetch = async () => {
    try {
      const res = await fetch(
        `http://localhost:8000/training?${nameOk}&${typologyOk}&${muscleGroupOk}&${orderByOk}`,
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
        setName("");
        setTypology("");
        setMuscleGroup("");
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
        value={orderBy}
        name="order"
        id="order"
        onChange={(e) => {
          e.preventDefault();
          setOrderBy(e.target.value);
          console.log(orderBy);

          getTrainingFetch();
        }}
      >
        <option value="">Ordenar por</option>
        <option value={orderBy}>Nombre</option>
        <option value={orderBy}>Fecha</option>
        <option value={orderBy}>Likes</option>
      </select>
    </form>
  );
};

export default OrderAndSearchInputTraining;
