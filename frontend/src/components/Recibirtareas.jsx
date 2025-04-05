import React from "react";
import { Recibirapi } from "../api/tarea.api";
import { Tarjeta } from "./Tarjetas";
import { useQuery } from "@tanstack/react-query";
import miGif from '../assets/cargar.gif'
import { Link } from "react-router-dom";

export function Recibirtareas() {

    const {
      data: tareas,
      isLoading, refetch
    } = useQuery({
      queryKey: ["tareass"],
      queryFn: Recibirapi,
    });

    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-screen">
          <img src={miGif} alt="Cargar" className="w-10 h-10" />
        </div>
      );
      
    }
    const handleReload = () => {
      refetch()
    };

    if (tareas.status === false)
      return(<div className="flex justify-center items-center h-screen ">
        <Link to="/crear-tarea">
      <div className="flex justify-center items-center cursor-pointer font-light text-sm text-gray-700 hover:text-lime-400 transition-colors duration-300">
        <span class="material-icons mr-1">
        add_circle
        </span><span>Añadir nueva tarea</span></div></Link>
        </div>
        )


  const tareasOrdenadas = [...tareas].sort((a, b) => b.done - a.done);
  return (

    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-5">
      {tareasOrdenadas.map((tarea) => (
        <Tarjeta key={tarea.id} task={tarea} onReload={handleReload} />
      ))}
    </div>

  );
}

export default Recibirtareas;
