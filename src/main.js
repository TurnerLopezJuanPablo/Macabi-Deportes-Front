import { createApp } from "vue";
import { createRouter, createWebHistory } from "vue-router";
import { createPinia } from "pinia";
import { usrStore } from "./stores/usrStore";

import './assets/main.css';

import "bootstrap/dist/css/bootstrap.css"

// IMPORT - IMPORT - IMPORT - IMPORT - IMPORT - IMPORT - IMPORT - IMPORT - IMPORT - IMPORT - IMPORT

// APP
import App from "./App.vue";
import Home from './components/Home.vue'
import Login from "./components/Login.vue";
import MiUsuario from "./components/MiUsuario.vue"
import NewPassword from "./components/NewPassword.vue";
import Unauthorized from "./components/Unauthorized.vue";
import UpdatePassword from "./components/UpdatePassword.vue"

// ASISTENCIAS
import TomarAsistencia from "./components/views/Asistencias/TomarAsistencia.vue";

// CATEGORIAS
import DetalleCategoria from "./components/views/Categorias/DetalleCategoria.vue";
import EliminarSociosCategorias from "./components/views/Categorias/EliminarSociosCategorias.vue";
import ModificarCategoria from "./components/views/Categorias/ModificarCategoria.vue";

// DEPORTES
import DeportesList from "./components/views/Deportes/DeporteList.vue";
import DetalleDeporte from "./components/views/Deportes/DetalleDeporte.vue";
import editarDeporte from "./components/views/Deportes/EditarDeporte.vue";

// FECHAS
import CrearFecha from "./components/views/Fechas/CrearFecha.vue"
import DetalleFecha from "./components/views/Fechas/DetalleFecha.vue"
import NuevaFechaCitacion from "./components/views/Fechas/NuevaFechaCitacion.vue"
import FechasListCategoria from "./components/views/Fechas/FechasListCategoria.vue"
import EditarFecha from "./components/views/Fechas/EditarFecha.vue"

// SOCIOS
import RegistrarSocio from "./components/views/Socios/RegistrarSocio.vue"
import SociosList from "./components/views/Socios/SociosList.vue"
import AgregarSocio from "./components/views/Socios/AgregarSocio.vue"
import DetalleSocio from "./components/views/Socios/DetalleSocio.vue"
import UpdateSocio from "./components/views/Socios/UpdateSocio.vue"

// USUARIOS
import UsuariosList from "./components/views/Usuarios/UsuariosList.vue";
import CrearUsuario from "./components/views/Usuarios/CrearUsuario.vue";
import DetalleUsuario from "./components/views/Usuarios/DetalleUsuario.vue";
import ModificarUsuario from "./components/views/Usuarios/ModificarUsuario.vue";

// CONTACTOS DE EMERGENCIA
import ContactoEmergenciaAdmin from "./components/views/ContactoEmergencia/ContactoEmergenciaAdmin.vue"
import ContactoEmergenciaList from "./components/views/ContactoEmergencia/ContactoEmergenciaList.vue"

// ROUTES - ROUTES - ROUTES - ROUTES - ROUTES - ROUTES - ROUTES - ROUTES - ROUTES - ROUTES - ROUTES
const routes = [
  // APP 
  { path: "/", component: Home, },
  { path: "/login", component: Login, },
  { path: "/miUsuario", component: MiUsuario, },//listo (No necesita validación. Solo lo puede ver el propio usuario xq es en base al token)
  { path: "/newPassword", component: NewPassword, },
  { path: "/unauthorized", component: Unauthorized, },
  { path: "/updatePass/:idUsuario", component: UpdatePassword },//Listo-- (Solo puede si coincide con su propio idUsuario)

  // ASISTENCIAS
  { path: "/tomarAsistencia/:id", component: TomarAsistencia },// LISTO--

  // CATEGORIAS
  { path: "/modificarCategoria/:id", component: ModificarCategoria },//LISTO--
  { path: "/detalleCategoria/:id", component: DetalleCategoria },//LISTO--
  { path: "/eliminarSociosCategoria/:id", component: EliminarSociosCategorias },//LISTO--

  // DEPORTES
  { path: "/deportes", component: DeportesList },//solo para admins
  { path: "/editarDeporte/:id", component: editarDeporte },//solo para admins--
  { path: "/detalleDeporte/:id", component: DetalleDeporte },//LISTO--

  // FECHAS
  { path: "/editarFecha/:id", component: EditarFecha, },//LISTO--
  { path: "/crearfecha/:idCategoria", component: CrearFecha }, //LISTO--
  { path: "/fechas/:id", component: DetalleFecha }, //LISTO--
  { path: "/nuevaCitacion/:idCategoria", component: NuevaFechaCitacion },//LISTO---
  { path: "/fechasCategoria/:id", component: FechasListCategoria }, //LISTO--

  // SOCIOS
  { path: "/registrarSocio", component: RegistrarSocio, },//TODOS
  { path: "/socios", component: SociosList, }, //Bloqueado para profe, pero un coordinar deberia poder verlo.
  { path: "/agregarSocio/:idCategoria", component: AgregarSocio }, //LISTO --
  { path: "/socios/:id", component: DetalleSocio }, //TODOS
  { path: "/socios/update/:id", component: UpdateSocio },//TODOS

  // USUARIOS
  { path: "/usuarios", component: UsuariosList, },
  { path: "/crearusuario", component: CrearUsuario }, //admin y coordinadorees en principio deberian poder verlo.
  { path: "/usuarios/:id", component: DetalleUsuario },
  { path: "/modificarusuario/:id", component: ModificarUsuario },

  // CONTACTOS DE EMERGENCIA
  { path: "/contactosEmergencia", component: ContactoEmergenciaList },
  { path: "/contactosEmergencia/admin", component: ContactoEmergenciaAdmin },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    return {top: 0};
  }
});

export const rutasNoAutorizadasParaCoordinador = [
  "/contactosEmergencia/admin",
  "/socios",
  "/deportes",
  "/editarDeporte/:id",
];

export const rutasNoAutorizadasParaProfesor = [
  "/usuarios",
  "/crearusuario",
  //"/usuarios/:id",
  "/modificarusuario/:id",
  "/registrarSocio",
  "/socios",
  // "/socios/update/:id",
  "/editarDeporte/:id",
  "/deportes",
  "/detalleDeporte/:id",
  "/modificarCategoria/:id",
  "/crearCategoria/:idDeporte",
  "/categorias",
  "/contactosEmergencia/admin",
];


function mismaRuta(ruta, tipoRol) {
  let pos = 0;
  let encontrado = false;
  let rutasPorRevisar = [];
  if (tipoRol === 'P') {
    rutasPorRevisar = rutasNoAutorizadasParaProfesor;
  } else {
    if (tipoRol === 'C') {
      rutasPorRevisar = rutasNoAutorizadasParaCoordinador;
    }
  }
  while (pos < rutasPorRevisar.length && !encontrado) {
    if (ruta === rutasPorRevisar[pos]) {
      encontrado = true
    } else {
      pos++
    }
  }

  return encontrado
}


//Esta es la base q voy a utilizar para q no me falle.
router.beforeEach(async (to, from, next) => {
  const usuarioStore = usrStore();

  if (!usuarioStore.isLogged) {
    // Si la sesión no está iniciada, reinicia la sesión
    await usuarioStore.reiniciarSesion();
  }
  const isLoginPage = to.path === "/login";
  const newPassordPage = to.path === "/newPassword";


  if (!usuarioStore.isLogged && !isLoginPage && !newPassordPage) {
    next({ path: "/login", component: Login });

  } else {
    if (to.matched.some(record => mismaRuta(record.path, usuarioStore.getRol))) {

      next({ path: "/unauthorized", component: Unauthorized }
      );
    }


    next();
  }
});





/*

//Esta es la base q voy a utilizar para q no me falle.
router.beforeEach(async (to, from, next) => {

  const usuarioStore = usrStore();
  if (!usuarioStore.isLogged) {
    // Si la sesión no está iniciada, reinicia la sesión
    await usuarioStore.reiniciarSesion();
  }
  console.log("Esta logueado: " + usuarioStore.isLogged);
  const isLoginPage = to.path === "/login";

  if (!usuarioStore.isLogged && !isLoginPage) {
    next( { path: "/login", component: Login });
  } else {
    if(to.matched.some(record => record.path === "/crearfecha/:idCategoria") && usuarioStore.getRol == 'C') {
      
      next(   { path: "/unauthorized", component: Unauthorized }
      );

    }
    next();
  }
});

*/

const pinia = createPinia();

createApp(App).use(pinia).use(router).mount("#app");


import "bootstrap/dist/js/bootstrap.js"
