
import axios from "axios";
import apiUrl from "../../config/config";
import { usrStore } from "../stores/usrStore";

export const verificarAutorizacionCategoria = async (idCategoria) => {
    let permitido = true;
    const userStore = usrStore()
    if(userStore.getRol == 'P'){
        let respuesta = await axios(`${apiUrl}/usuario/${userStore.getId}/${idCategoria}/validarPermisoProfesor`, { withCredentials: true })
        permitido = respuesta.data.result
    }else {
        if(userStore.getRol  == 'C') {
           let respuesta  = await axios(`${apiUrl}/usuario/${userStore.getId}/${idCategoria}/validarPermisoCoordinador`, { withCredentials: true })
           permitido = respuesta.data.result
        }
    }
    return permitido
  };

  
export const verificarAutorizacionFecha = async (idFecha) => {
    let permitido = true;
    const userStore = usrStore()
    if(userStore.getRol == 'P'){
        let respuesta = await axios(`${apiUrl}/usuario/${userStore.getId}/${idFecha}/validarFechaPermisoProfesor`, { withCredentials: true })
        permitido = respuesta.data.result
    }else {
        if(userStore.getRol  == 'C') {
           let respuesta  = await axios(`${apiUrl}/usuario/${userStore.getId}/${idFecha}/validarFechaPermisoCoordinador`, { withCredentials: true })
           permitido = respuesta.data.result
        }
    }
    return permitido
  };

  export const verificarDeportePermitidoCoordinador = async (idDeporte) => {
    let permitido = true;
    const userStore = usrStore()
        if(userStore.getRol  == 'C') {
           let respuesta  = await axios(`${apiUrl}/usuario/${userStore.getId}/${idDeporte}/validarDeportePermisoCoordinador`, { withCredentials: true })
           permitido = respuesta.data.result
        }
    
    return permitido
  };

  export const cambiosPerfilPropioPermiso = async (idUsuario) => {
    let permitido = true;
    const userStore = usrStore()
    let cordinarOProfesor =  (userStore.getRol == 'C' || userStore == 'P')

        if(cordinarOProfesor && userStore.getId != idUsuario) {
           permitido = false
        }
    
    return permitido
  };

  export const permisosModificarPerfil = async (idUsuario, rolUsuario) => {
    let permitido = true;
    const userStore = usrStore()

    let perfilPropio = userStore.getId == idUsuario;

    let noPermitidoCoordinador = (userStore.getRol  == 'C' && rolUsuario != "3")

        if(!perfilPropio && noPermitidoCoordinador) {
           permitido = false
        }
    
    return permitido
  };

  export const vistaPerfilUsuario = async(idRolUserPorVer) => {
    let permitido = true
    const userStore = usrStore()

    let noPermitidoProfesor = (userStore.getRol  == 'P' && idRolUserPorVer != 'P')
    let noPermitidoCoordinador = (userStore.getRol  == 'C' && idRolUserPorVer == 'A')



    if(noPermitidoProfesor || noPermitidoCoordinador){
      permitido = false;
   }

   return permitido
  }