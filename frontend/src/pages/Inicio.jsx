import React, { useContext , useEffect}from 'react'
import { Link ,useNavigate, Navigate } from "react-router-dom"
import { Context } from '../context/Context'
import Cookies from 'js-cookie'
import Fotoinicio from '../assets/fotoincio.jpg'
import Tarea1 from '../assets/tarea1.png'
import Tarea2 from '../assets/tarea2.png'
import Tarea3 from '../assets/tarea3.png'
import Tarea4 from '../assets/tarea4.png'


export function Inicio() {
  
  const navigate = useNavigate();

  useEffect(() => {
    const usuario = Cookies.get("Auth");  // Obtener la cookie
    if (usuario === "true") {  // Verificar si el valor es 'true'
      navigate("/tareas");  // Redirigir a /tareas
    }
  }, []);


  return (
    <div>
      
    <div className='bg-lime-50 grid grid-cols-1 sm:grid-cols-2 pt-10 pb-10'> {/* PRIMER DIV DONDE ESTA EL TEXTO PRINCIPAL Y LA IMAGEN */}
      <div className='ml-10'> {/* DIV DE TEXTO Y BOTON REGISTRAR */}
        <section className='pt-8 mr-12'>
        <h1 className='font-bold text-3xl'>Organiza tus tareas y alcanza tus metas</h1>
        <p className='mt-10 mb-10'>¡Bienvenido a <strong>Taskify</strong>! La plataforma que te ayuda a gestionar tus deberes, proyectos y estudios de forma sencilla y eficaz.</p>
        <p className='mb-3'><em>¡Es gratis!</em> Solo toma 30 segundos.</p>
        </section>
        <div className='flex justify-center sm:justify-normal items-center mb-10 mr-5'>
          <Link to="/registrar" className=" w-full sm:w-auto p-5 mt-5 sm:p-3 bg-green-400 rounded-lg 
          r-3 hover:bg-emerald-500 font-medium transition-colors duration-300 text-center">
            <span className=' cursor-pointer font-bold sm:font-medium'>Registrarse ahora</span></Link></div>
        </div>{/* FIN DE DIV DE TEXTO Y BOTON REGISTRAR */}

      <div> {/* DIV IMAGEN */}
        <img  src={Fotoinicio} alt="Fotoinicio" className="rounded-lg border border-gray-300" />
        </div>
      </div>{/*  FIN DEL PRIMER DIV DE TEXTO E IMAGEN */}

      <div className='bg-white justify-center items-center p-5 grid grid-cols-2 sm:grid-cols-4 gap-5 sm:pl-8'>
        <div className='flex items-center'><img  src={Tarea1} alt="tarea1" className="w-13 rounded-lg border border-gray-200 mr-2" /> 
        <span>Sencillo editor para crear tareas.</span></div>

        <div className='flex items-center'><img  src={Tarea2} alt="tarea2" className="w-13 rounded-lg border border-gray-200 mr-2" /> 
        <span>Crea tareas sin limites.</span></div>

        <div className='flex items-center'><img  src={Tarea3} alt="tarea3" className="w-13 rounded-lg border border-gray-200 mr-2" /> 
        <span>Diseña en cualquier dispositivo</span></div>

        <div className='flex items-center'><img  src={Tarea4} alt="tarea4" className="w-13 rounded-lg border border-gray-200 mr-2" /> 
        <span>Crea tareas sin limites.</span></div>
      
      </div>

    </div>
  )
}
