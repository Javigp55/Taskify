import { useNavigate } from "react-router-dom";
import { fijado, Recibirapi, Recibirtarea } from "../api/tarea.api";
import { toast } from "react-hot-toast";
import {Recibirtareas} from './Recibirtareas'


//Esta funcion recibe el parametro task de Recibirtareas.jsx
export function Tarjeta({ task , onReload }) {
  const navigate = useNavigate(); //Redireccion


  const botonFijar = async (event) => {
    //Para que el boton de fijar no herede la propiedad onClick del div
    event.stopPropagation();
    
    try{
    const res = await fijado(task.id)
    res
    toast.success(res.data.message);
    onReload();
    
    }catch(error){
      toast.error(error.message)
    }
    
  }

  return (
    <div //Div que engloba cada tarea
      className="bg-gray-50 p-0 rounded-lg active:scale-105 active:bg-gray-200 hover:scale-105 hover:bg-gray-200 shadow shadow-gray-700 h-[240px] transition-all duration-300 mb-2"
      onClick={() => {
        // Cuando se pulsa encima del div se redireccion a tarea/:id
        navigate("/tarea/", { state: { taskId: task.id } });
        
      }}
    >
      <div className="flex justify-end bg-gray-800 rounded-t-lg ">
      

      {task.done ? (
        <button onClick={botonFijar} className="mt-0.5 mr-2 justify-end"><span className="material-symbols-outlined items-center text-lime-50 cursor-pointer active:scale-110 transition-all duration-300">keep</span></button>
      ) : (
        <button onClick={botonFijar} className="mt-0.5 mr-2 justify-end"><span className="material-symbols-outlined items-center text-lime-50 cursor-pointer active:scale-110 transition-all duration-300">keep_off</span></button>
      )}</div>
      <h1 className="text-center tx-2xl font-bold mb-2 uppercase line-clamp-2 break-words m-3">
        {task.title}
      </h1>
      <p className="text-center line-clamp-5 break-words m-3">{task.description}</p>
    </div>
  );
}
