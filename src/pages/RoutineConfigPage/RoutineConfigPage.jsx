import { useRef, useState } from "react";
import useFetchHooks from "../../hooks/useFetchHooks";
import { useQuery } from "react-query";
import { useMutation } from "react-query";
import "./RoutineConfigPage.scss";
import { useParams } from "react-router-dom";
import Loading from "../../components/Loading/Loading";
import Swal from "sweetalert2";
import RoutineList from "../../components/RoutineList/RoutineList";
import RoutineDelete from "../../components/RoutineDelete/RoutineDelete";
import "./RoutineConfigPage.scss";

import jsPDF from "jspdf";

import html2canvas from "html2canvas";

const RoutineConfigPage = () => {
  const { id } = useParams();

  const { hookGetFetch, hookPostPatchFetch } = useFetchHooks();
  const mutation = useMutation(hookPostPatchFetch);

  const [routines, setRoutines] = useState([]);
  const [selectTraining, setSelectTraining] = useState([]);
  const [trainingRoutine, setTrainingRoutine] = useState([]);

  const pdfRef = useRef(null);

  const getTraining = useQuery(
    [`training`, "training"],
    () => hookGetFetch(`training`),
    {
      onSuccess: (data) => {
        setSelectTraining(data);
      },
    }
  );

  const getRoutine = useQuery(
    [`routine${id}`, `getRoutine/${id}`],
    () => hookGetFetch(`getRoutine/${id}`),
    {
      onSuccess: (data) => {
        setRoutines(data);
      },
    }
  );

  const listRoutine = useQuery(
    [`getTrainingRoutine/${id}`, `getTrainingRoutine/${id}`],
    () => hookGetFetch(`getTrainingRoutine/${id}`),
    {
      onSuccess: (data) => {
        setTrainingRoutine(data);
      },
    }
  );

  const renderizar = () => {
    listRoutine.refetch();
  };

  const handleChangeSelect = async (e) => {
    const postBody = { idTraining: e.target.value, reps: 0, series: 0 };

    mutation.mutate(
      {
        endpoint: `addTrainingToRoutine/${id}`,
        method: "POST",
        user: postBody,
      },
      {
        onError: (error) => {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: error,
          });
        },

        onSuccess: () => {
          listRoutine.refetch();
        },
      }
    );
  };

  const generarPDF = () => {
    if (!pdfRef.current) return;
    html2canvas(pdfRef.current).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF();
      pdf.addImage(imgData, "PNG", 0, 0);
      pdf.save("rutina.pdf");
      //Generar el Blob del PDF
      pdf.output("blob", (pdfBlob) => {
        // Crear un objeto FormData
        const formData = new FormData();
        formData.append("pdfFile", pdfBlob, "rutina.pdf");
        formData.append("email", "a.areslago@gmail.com");
     
        mutation.mutate(
          {
            endpoint: `sendPdf`,
            method: "POST",
            user: formData,
          },
          {
            onError: () => {},
            onSuccess: () => {},
          }
        );
      });
    });
  };

  return (
    <div className="container-config">
      <div className="container-options">
        {getTraining.isLoading ? <Loading /> : null}
        {getTraining.isError ? <p>{getTraining.error}</p> : null}
        {getTraining.isSuccess && (
          <select onChange={handleChangeSelect}>
            <option defaultValue="">Selecciona un entrenamiento</option>
            {selectTraining.map((entrenamiento) => {
              return (
                <option key={entrenamiento.id} value={entrenamiento.id}>
                  {entrenamiento.name}
                </option>
              );
            })}
          </select>
        )}
        {/* <RoutineDelete routineId={id} /> */}
        <button onClick={generarPDF} className="pdf-button">Generar PDF</button>
      </div>

      <div className="container-print" ref={pdfRef}>
        <div className="list-name-description">
          {getRoutine.isLoading ? <Loading /> : null}
          {getRoutine.isError ? <p>{getRoutine.error}</p> : null}
          {getRoutine.isSuccess && (
            <>
              <h2 className="title-routine">{routines.name}</h2>
              <p className="description-routine">{routines.description}</p>
            </>
          )}
        </div>
        <div className="list-router-training">
          <RoutineList
            trainingRoutine={trainingRoutine}
            renderizar={renderizar}
          />
        </div>
      </div>
      <RoutineDelete routineId={id} />
    </div>
  );
};

export default RoutineConfigPage;

