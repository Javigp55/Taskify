import React from "react";
import { Context } from "./Context";
import Cookies from 'js-cookie'


export const AuthContext = ( {children} ) => {

    const CheckAuth = async () => {
        console.log("Funcion global")
    }

  return (
    <Context.Provider
    value={{
    CheckAuth}}>
        { children }
    </Context.Provider>
  )
}

export default AuthContext