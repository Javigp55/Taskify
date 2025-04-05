import { BrowserRouter, Routes, Route, Navigate} from "react-router-dom"
import { Recibir } from "./pages/Recibir"
import { Mandar } from "./pages/Mandar"
import { Navigation } from "./components/Navigation"
import { Toaster } from 'react-hot-toast'
import { Footer } from "./components/Footer"
import { Inicio } from "./pages/Inicio"
import { Registro } from "./components/Registro"
import { AuthContext } from "./context/AuthContext"


function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow bg-gradient-to-b from-lime-100 to-white">
    <AuthContext>
      <BrowserRouter basename="/Taskify">
          <Navigation />
          <Routes>
            <Route path="/" element={<Inicio />} />
            <Route path="/tareas" element={<Recibir />} />
            <Route path="/crear-tarea" element={<Mandar />} />
            <Route path="/tarea" element={<Mandar />} />
            <Route path="/login" element={<Registro />} />
            <Route path="/registrar" element={<Registro />} />
          </Routes>
          <Toaster/>

  
      </BrowserRouter>
    </AuthContext>
    </main>
    <Footer/>
      </div>
  )
    
  }

export default App
