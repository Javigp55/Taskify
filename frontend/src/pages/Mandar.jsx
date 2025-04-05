import { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  creartarea,
  borrartarea,
  actualizar,
  Recibirtarea
} from "../api/tarea.api";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-hot-toast";
import miGif from "../assets/cargar.gif";
import { useQuery } from "@tanstack/react-query";
import Cookies from 'js-cookie'

export function Mandar() {
  const navigate = useNavigate();

  useEffect(() => {
    const usuario = Cookies.get("Auth");
    if (!usuario) { 
      navigate("/");
    }
  }, []);
  const location = useLocation();
  const { taskId } = location.state || {};
  // Creamos en una constante un useForm para crear despues un formulario
  // y registrar cada datos para poder enviarlo.
  const {
    register, // Este registra los datos.
    handleSubmit, // El encargado de realizar el Submit con los datos.
    formState: { errors },
    setValue, // Para ponerle unos valores predeterminados.
  } = useForm();



  // Se crea esta const la cual se utilizada en el formulario, utuliza el handleSubmit
  // para recoger los datos y despues enviarlos, si recibe parametros sera editando y si
  // no los recibe sera creando una nueva
  const onSubmit = handleSubmit(async (data) => {
    if (taskId) {
      try{
        await actualizar(taskId, data);
        navigate("/tareas");
        toast.success("Tarea editada correctamente.");
      }catch(error){
        console.log(error)
      }
    } else {
      try{
        await creartarea(data);
        toast.success("Tarea creada correctamente.");
        navigate("/tareas");
      }catch(error){
        console.log(error)
      }

    }
  });
  // Se crea el useQuery para recibir el API de cada tarea por separado 
  // y solo si recibe un parametro en la URL
  const {
    isLoading,
    data: tarea,
  } = useQuery({
    queryKey: ["tarea", taskId],
    queryFn: () => Recibirtarea(taskId),
    enabled: !!taskId
  });
  // Añadimos el loading para que espere mientras recibe los datos.
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <img src={miGif} alt="Cargar" className="w-10 h-10" />
      </div>
    );
  }


  return (
    <div className="p-15 bg-gradient-to-b from-lime-100 to-white">
      {taskId && (
        <div className="flex justify-center items-center">
          {setValue("title", tarea.title)}
          {setValue("description", tarea.description)}
          <div className="bg-gray-50 p-7 rounded-lg w-full mb-5 shadow shadow-gray-800 sm:w-1/2">
            <h1 className="text-center font-bold mb-3">INFORMACION TAREA</h1>
            <h1 className="text-center tx-2xl font-bold  uppercase break-words mb-3">
              {tarea.title}
            </h1>
            <p className="text-center break-words mb-8">{tarea.description}</p>
            <div className="flex justify-center">
            <button
              onClick={async () => {
                const aceptar = window.confirm("¿Quieres eliminar la tarea?");
                if (aceptar) {
                  await borrartarea(taskId);
                  toast.success("Tarea borrada correctamente.");
                  navigate("/tareas");
                }
              }}
              className="bg-red-500 p-3 rounded-lg w-full sm:w-1/3 cursor-pointer hover:bg-red-600 transition-all duration-75 active:scale-95"
            >
              Borrar
            </button></div>
          </div>
        </div>
      )}
      <div className="flex justify-center">
        {!taskId && setValue("title", "")}
        {!taskId && setValue("description", "")}
        <div className="bg-gray-50 p-7 rounded-lg w-full mb-5 shadow shadow-gray-800 sm:w-1/2">
          <form onSubmit={onSubmit}>
            <h1 className="text-center font-bold mb-5">{taskId ? "EDITAR TAREA" : "AÑADIR TAREA"}</h1>
            <input
              type="text"
              placeholder="Titulo"
              {...register("title", { required: true })}
              className="bg-white p-3 rounded-lg block w-full mb-5 shadow shadow-gray-800"
            />
            {errors.title && ""}
            <textarea
              rows="3"
              placeholder="Descripcion"
              {...register("description", { required: true })}
              className="bg-white p-3 rounded-lg block w-full mb-5 shadow shadow-gray-800"
            />
            {errors.description && (
              ""
            )}

            <button className="bg-indigo-500 p-3 rounded-lg block w-full sm:w-1/3 mt-3 cursor-pointer hover:bg-indigo-600">
              Guardar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
