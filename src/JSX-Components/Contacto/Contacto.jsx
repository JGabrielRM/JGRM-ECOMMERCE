import React from "react";	
import { CiMail} from "react-icons/ci";
import { FiMapPin } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import { useState } from "react";
import Footer from '../Footer/Footer.jsx';

export function Contacto() {
  const [para, setPara] = useState("")
  const [texto, setTexto] = useState("")
  const [correo, setCorreo] = useState("")
  const [nombre, setNombre] = useState("")
  const [error, setError] = useState("")
  const [enviado, setEnviado] = useState(false)  // Nuevo estado para mensaje de éxito

  const handleChangeNombre = (e) => {
    setNombre(e.target.value);
    if (e.target.value.trim() !== "") {
      setError((prev) => ({ ...prev, nombre: "" })); // Limpia el error específico
    }
  };

  const handleChangeCorreo = (e) => {
    setCorreo(e.target.value);
    if (e.target.value.trim() !== "") {
      setError((prev) => ({ ...prev, correo: "" }));
    }
  };

  const handleChangeTexto = (e) => {
    setTexto(e.target.value);
    if (e.target.value.trim() !== "") {
      setError((prev) => ({ ...prev, correo: "" }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let errores = {};

    // Validación de campos vacíos
    if (nombre.trim() === "") {
        errores.para = "El nombre no puede estar vacío.";
    }
    // Validación de correo
    else if (correo.trim() === "") {
        errores.para = "El correo no puede estar vacío.";
    }
    else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(correo)) {
        errores.para = "Ingresa un correo válido.";
    }
    // Validación de mensaje
    else if (texto.trim() === "") {
        errores.para = "El cuadro del mensaje no puede estar vacío.";
    }

    // Si hay errores, actualizar el estado y detener el envío
    if (Object.keys(errores).length > 0) {
        setError(errores);
        setEnviado(false);
        return;
    }

    // Si no hay errores, continuar con el envío
    console.log('Formulario enviado:', { nombre, correo, texto });
    // Limpiar el formulario
    setNombre('');
    setCorreo('');
    setTexto('');
    setError({});
    setEnviado(true);

    // Ocultar el mensaje de éxito después de 3 segundos
    setTimeout(() => {
      setEnviado(false);
    }, 3000);
  }

  return (
    <div className="flex flex-col" style={{ minHeight: 'calc(100vh - 80px)' }}>
      <section className="bg-gray-100 py-12 px-6 flex-grow">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900">Contáctanos</h2>
          <p className="text-gray-600 mt-2">
            ¿Tienes alguna pregunta o necesitas ayuda? Estamos aquí para ti.
          </p>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Email */}
            <div className="bg-white shadow-lg rounded-lg p-6 flex flex-col items-center">
              <CiMail className="text-gray-700 w-10 h-10" />
              <h3 className="text-lg font-semibold mt-4">Correo Electrónico</h3>
              <p className="text-gray-600">josegrmog@gmail.com</p>
            </div>

            {/* Teléfono */}
            <div className="bg-white shadow-lg rounded-lg p-6 flex flex-col items-center">
              <FaWhatsapp className="text-gray-700 w-10 h-10" />
              <h3 className="text-lg font-semibold mt-4">WhatsApp</h3>
              <p className="text-gray-600">+57 323 2465878</p>
            </div>

            {/* Ubicación */}
            <div className="bg-white shadow-lg rounded-lg p-6 flex flex-col items-center">
              <FiMapPin className="text-gray-700 w-10 h-10" />
              <h3 className="text-lg font-semibold mt-4">Ubicación</h3>
              <p className="text-gray-600">Cúcuta, Colombia</p>
            </div>
          </div>
          
          {/* Formulario de contacto */}
          <div className="mt-12 bg-white shadow-lg rounded-lg p-8 max-w-3xl mx-auto">
            <h3 className="text-2xl font-semibold text-gray-900">Envíanos un mensaje</h3>
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">

              <input type="text" placeholder="Nombre" value={nombre} onChange={handleChangeNombre}  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-600" />
              

              <input type="text" placeholder="Correo Electrónico" value={correo} onChange={handleChangeCorreo}  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-600" />
              
              <textarea placeholder="Mensaje" rows="4"  value={texto} onChange={handleChangeTexto}  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-600"></textarea>
              <button className="w-full bg-gray-900 text-white py-3 rounded-lg hover:bg-gray-700 transition">
                Enviar Mensaje
              </button>
              {error.para && <p className="text-red-500">{error.para}</p>}
              {enviado && (
                <p className="text-green-600 font-medium text-center animate-fade-in">
                  ¡Mensaje enviado exitosamente!
                </p>
              )}
            </form>
          </div>
        </div>
      </section>
      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  );
}
