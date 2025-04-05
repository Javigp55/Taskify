import React, { useEffect } from 'react'
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useForm } from 'react-hook-form'
import { login, registro } from '../api/tarea.api.js'
import { toast } from "react-hot-toast";
import Cookies from 'js-cookie'
import Loginimg from "../assets/login.jpg"
import "../App.css"





export function Registro() {
    //Usamos useLocation para saber si estamos en la pagina de registrar o la de login
    const navigate = useNavigate()
    const location = useLocation()
    const isRegister = location.pathname === "/registrar"

    const ErrorToast = (message) => {
        toast.error(message, {
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            icon: false,
            style: {
                background: "rgba(223, 87, 87, 0.9)",
                border: "2px solid #ff5050",
                color: "white",
              },
          });
        };

    useEffect(() => {
      const usuario = Cookies.get("Auth");  // Obtener la cookie
      if (usuario === "true") {  // Verificar si el valor es 'true'
        navigate("/tareas");  // Redirigir a /tareas
      }
    }, []);

    

    //usamos el userForm
     const {register, formState: {errors}, handleSubmit, setValue, clearErrors} = useForm()

     useEffect(() => {

        clearErrors("username")
        clearErrors("password")
        clearErrors("email")

        
      }, [errors.username, errors.email, errors.password]);

     const onSubmit = handleSubmit(async data => {
        if (isRegister){
            try{
                const res = await registro(data)

                toast.success(res.data.message);
                setValue("username","")
                setValue("password","")
                setValue("email","")
                navigate("/login")
            }
            catch(error){
            console.log(error.response.data.email[0])
            if (error.response.data.email){
                ErrorToast(error.response.data.email[0])
            }
            if (error.response.data.username){
                ErrorToast(error.response.data.username[0])
            }
            }
        }
        else{
            try{
                const res = await login(data)
                res
                Cookies.set("Auth", true, { expires: 7, path: "/" })
                navigate("/tareas")
            }
            catch(error){
                ErrorToast(error.response.data.error)
            }
        }


            
     })
  return (
    <div className='flex justify-center items-center p-10 mb-15 w-full'>
        <div className='bg-yellow-50  h-120 grid grid-cols-1 sm:grid-cols-2 rounded-lg shadow shadow-gray-800'>

            <div className='hidden sm:block'><img src={Loginimg} alt="Login" className="w-full h-full rounded-l-lg" /></div>
            <div className='bg-gray-50 p-8 rounded-lg'>
            <h1 className="text-2xl font-bold mb-6 text-center">
                     {isRegister ? "Regístrate" : "Inicia Sesión"}
                        </h1>
                    {/*  Registro */} 
            {isRegister ? ( 
                <>
                <div className='flex flex-col sm:flex-row justify-center items-center mb-7 gap-1'><span className='font-light'>¿Ya tienes cuenta creada?</span> <Link to="/login" className='font-medium text-blue-500 hover:text-blue-700'>Logueate</Link></div>
                <form onSubmit={onSubmit} className='flex flex-col items-center'>

                    <input type='text' placeholder='Usuario'
                    {...register("username", {required: true})}
                    className="bg-white p-3 rounded-lg block w-full mb-5 shadow shadow-gray-800"
                    />
                    {errors.username && (ErrorToast("El usuario es requerido"))}
                    <input type='text' placeholder='E-mail'
                    {...register("email", {required: true})}
                    className="bg-white p-3 rounded-lg block w-full mb-5 shadow shadow-gray-800"
                    />
                    {errors.email && (ErrorToast("El e-mail es requerido"))}
                    <input type='password' placeholder='Contraseña'
                    {...register("password", {required: true})}
                    className="bg-white p-3 rounded-lg block w-full mb-5 shadow shadow-gray-800"
                    />
                    {errors.password && ErrorToast("La contraseña es requerida")}
                    <button className='w-full  bg-green-400 rounded-lg 
                             hover:bg-emerald-500 p-3 mt-6 sm:w-1/3 sm:justify-center'>Registrar</button>
                </form>
                </> ) : (
            // Login
            <>
            <div className='flex flex-col sm:flex-row justify-center items-center mb-8 gap-1'><span className='font-light'>¿Aun no estas registrado?</span> <Link to="/registrar" className='font-medium text-blue-500 hover:text-blue-700'>Registrate ahora</Link></div>
                <form onSubmit={onSubmit} className='flex flex-col items-center'>

                    <input type='text' placeholder='Usuario'
                    {...register("username", {required: true})}
                    className="bg-white p-3 rounded-lg block w-full mb-8 shadow shadow-gray-800"
                    />
                    {errors.username && ErrorToast("El usuario es requerido")}

                    <input type='password' placeholder='Contraseña'
                    {...register("password", {required: true})}
                    className="bg-white p-3 rounded-lg block w-full mb-2 shadow shadow-gray-800"
                    />
                    {errors.password && ErrorToast("La contraseña es requerida")}
                    <Link to="/" className='w-full flex justify-end font-medium text-blue-500 hover:text-blue-700'><span>¿Has olvidado tu contraseña?</span></Link>
                    <button className='w-full  bg-green-400 rounded-lg 
                             hover:bg-emerald-500 p-3 mt-6 sm:w-1/3 sm:justify-center'>Login</button>
                </form>
                </>

        )}
        </div>
    </div>
    </div>
  )
}

