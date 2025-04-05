import { Link, useNavigate } from "react-router-dom"
import React ,{useState}from "react"
import { logout , borrartareas, borraruser} from "../api/tarea.api"
import Cookies from 'js-cookie'
import Logo from "../assets/logo.png"
import toast from "react-hot-toast"
import { useQueryClient } from "@tanstack/react-query";


export const Navigation = React.memo(() => {


const queryClient = useQueryClient();

const [Abierto, setAbierto] = useState(false)
const [Abierto2, setAbierto2] = useState(false)

  const navigate = useNavigate()
  const boton = () => {
    Cookies.remove("Auth", { path: '/' });
    logouut()
    setAbierto(false)
  }

  const logouut = async () =>{
    await logout();
    navigate("/")
  }


  const Ajustes = () => {
    return (
      <div className=" flex items-center justify-center relative ">
      <div className="justify-center items-center p-4  grid grid-cols-1 gap-3 absolute mr-120 -mt-20 md:mt-52 md:mr-65">
        <ul className="justify-center items-center bg-gray-50 border-b-2 border-gray-300 rounded-lg p-5 shadow-2xl shadow-gray-800 opacity-95 w-40">
        <li className="p-2 mb-2 cursor-pointer font-light text-sm text-gray-700 hover:text-lime-400 transition-colors duration-300" onClick={async () => {
                const aceptar = window.confirm("¿Quieres eliminar todas tus tareas?");
                if (aceptar) {
                  await borrartareas();
                  queryClient.invalidateQueries(["tareas"]);
                  toast.success("Todas las tareas eliminadas correctamente.")
                }
              }}>Borrar todas las tareas</li>

        <li className="p-2 cursor-pointer font-light text-sm text-gray-700 hover:text-lime-400 transition-colors duration-300" onClick={async () => {
                const aceptar = window.confirm("¿Quieres eliminar tu cuenta de usuario?");
                if (aceptar) {
                  await borraruser();
                  Cookies.remove("Auth", { path: '/' });
                  navigate("/")
                  toast.success("Usuario eliminado correctamente.")
                }
              }}>Eliminar cuenta</li>
      </ul>
      </div>


    </div>
    
    )
    
  }

  const cookies = Cookies.get("Auth")
  return (
    <div>
    <div className="flex justify-center items-center bg-white py-3 border-b-2 border-gray-300">
      <div className="ml-10 mr-auto">
       <Link to="/"> <img src={Logo} alt="Logo" className="max-w-30" /></Link>
      </div>
      
      {cookies ? (
        <div>
        <div className="hidden sm:flex justify-center ml-auto items-center mr-10">
      <Link to="/tareas" className="mr-5"><button className="cursor-pointer font-light text-sm text-gray-700 hover:text-lime-400 transition-colors duration-300">Mis tareas</button></Link>
      <Link to="/crear-tarea" className="mr-5"><button className="cursor-pointer font-light text-sm text-gray-700 hover:text-lime-400 transition-colors duration-300">Añadir tarea</button></Link>    
      <Link className="mr-5"><button className="mr-5 cursor-pointer font-light text-sm text-gray-700 hover:text-lime-400 transition-colors duration-300" onClick={() => (setAbierto2(!Abierto2))}>Ajustes</button></Link>    
      {Abierto2 && (
        <div
          className="fixed inset-0 bg-transparent"
          onClick={() => setAbierto2(false)}
        ></div>
      )}
      {Abierto2 && <Ajustes/>}
      
      <div className="flex items-center">
      <span className="material-icons text-gray-700 hover:text-lime-400 transition-colors duration-300 cursor-pointer"onClick={boton}>
          logout
        </span>
      </div>
      </div>
        <div className="md:hidden cursor-pointer " onClick={() => setAbierto(!Abierto)}>
        <span className="material-icons mr-5"role="menu" >{Abierto ? "close" : "menu"}</span>

        </div>

      </div>
) : (

  
  <div className="ml-auto mr-10">

    <Link to="/login"><button className="cursor-pointer font-light text-sm text-gray-700 hover:text-lime-400 transition-colors duration-300">Iniciar Sesion</button></Link>
  </div>
)}
   



    </div>
    {Abierto && (
        <div
          className="fixed inset-0 bg-transparent"
          onClick={() => setAbierto(false)}
        ></div>
      )}
    {Abierto && (
      <div className=" flex items-center justify-center relative">
        <div className="md:hidden justify-center items-center p-4  grid grid-cols-1 gap-3 absolute right-0 top-full -mt-3">
          <ul className=" bg-gray-50 border-b-2 border-gray-300 rounded-lg p-5 shadow-2xl shadow-gray-800 opacity-95">
        <li><Link className="flex active:text-lime-100 transition-all duration-200 p-2" to="/tareas" onClick={() => setAbierto(false)}><span>Mis Tareas</span></Link></li>
        <li><Link className="flex active:text-lime-100 transition-all duration-200 p-2" to="/crear-tarea" onClick={() => setAbierto(false)}><span>Añadir tarea</span></Link></li>
        <li><Link className="flex active:text-lime-100 transition-all duration-200 p-2" onClick={() => setAbierto2(!Abierto2)}><span>Ajustes</span></Link></li>
        <li><span className="flex active:text-lime-100 transition-all duration-200 p-2" onClick={boton}>Log Out</span></li>
        </ul>
        {Abierto2 && (
        <div
          className="fixed inset-0 bg-transparent"
          onClick={() => setAbierto2(false)}
        ></div>
      )}
        {Abierto2 && <Ajustes/>}
        </div>
      </div>

   )}



    </div>
  )
})


export default Navigation