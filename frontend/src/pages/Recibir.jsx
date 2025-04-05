import { Recibirtareas } from "../components/Recibirtareas"
import React, { useEffect } from "react"
import Cookies from 'js-cookie'
import { useNavigate, } from "react-router-dom"

export function Recibir() {
    const navigate = useNavigate();
    useEffect(() => {
      const usuario = Cookies.get("Auth");
      if (!usuario) { 
        navigate("/");
      }
    }, []);


    return <div className=" p-5 pt-10 pb-8 sm:p-10"><Recibirtareas/></div>
  }
