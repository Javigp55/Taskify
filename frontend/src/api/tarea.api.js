import axios from "axios";
import Cookies from "js-cookie"

const PROD = "https://react-django-gestion-tareas.vercel.app/tasks/api/"
const DEV = "https://127.0.0.1:8000/tasks/api"
const instance = axios.create({
  withCredentials: true,
  baseURL: PROD,
})

const refreshaxios = axios.create({
  withCredentials: true,
  baseURL: PROD,
})



instance.interceptors.response.use(
  (response) => response,  // Responde normalmente si la solicitud tiene éxito.
  async (error) => {
    const config = error.config;

    // Si el error es un 401 y no hemos intentado hacer el refresh aún
    if (error.response?.status === 401 && !config._retry) {
      config._retry = true; // Marca que ya intentamos refrescar el token

      try {
        // Realizamos el intento de refresh
        await refresh()

        // Si el refresh es exitoso, reintenta la solicitud original
        return instance(config); 
      } catch (err) {
        console.log("⛔ Refresh falló:", err.response?.status);
        // Si el refresh falla, borra las cookies y redirige al login
        document.cookie = "Auth=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
        // Redirige a la página de login
        window.location.href = "/login";
        // Asegúrate de que el flujo se detenga aquí.
        return Promise.reject(err); // No sigue propagando el error
      }
    }
    // Si no es 401 o el refresh ya ha sido intentado, simplemente propaga el error
    return Promise.reject(error);
  }
);









// Recibir todas las tareas
export const Recibirapi = async () => {
  const res = await instance.get("recibir-tareas/")
  return res.data;
};

// recibir solo 1 tarea por el id recibido
export const Recibirtarea = async (taskId) => {
  const response = await instance.post("tarea/", { "id": taskId });
  return response.data
};

//crear tarea
export const creartarea = (task) => {
  return instance.post("crear-tareas/", task);
};

// borrar tarea
export const borrartarea = async (taskId) => {
  const response = await instance.delete("borrar/", {data :{ "id": taskId }});
  return response.data
};

//ACTUALIZAR
export const actualizar = (taskId, task) => {
  return instance.put("editar/", {"id":taskId , "title":task.title , "description": task.description});
};


//FIJAR
export const fijado = async (id) => {
  try{
    const res = await instance.patch("fijar/", {"id": id});
    return res;
  }catch(error){
    if (error.response) {
      console.error("Error:", error.response.data); // Muestra el error en consola
      throw new Error(error.response.data.error || "Ocurrió un error");
  } else {
      console.error("Error en la solicitud:", error.message);
      throw new Error("No se pudo conectar con el servidor");
  }
  }

};

//API LOGIN
export const login = async (user) => {

    const res = await instance.post("/login/", user);
    return res;
};


  //API REGISTRO
  export const registro = async (user) => {
    
      const res = await instance.post("/register/", user);
      return res;

    };

  //API LOGOUT
  export const logout = async () => {

      const res = await instance.post("/logout/");
      return res;
  }

    //Refresh USER

    export const refresh = async () => {
      try {
        const res = await refreshaxios.post("/refresh/");
        return res.data; // Devuelve solo los datos
      } catch (error) {
        if (error.response && error.response.status === 401) {
          console.error("Refresh token inválido o expirado");
          throw new Error("No autorizado, cerrando sesión...");
        }
        throw error;
      }
    };


    export const borraruser = async () => {

      const res = await instance.delete("/borrarusuario/");
      return res;
  }

  export const borrartareas = async () => {

    const res = await instance.delete("/borrartareas/");
    return res;
}