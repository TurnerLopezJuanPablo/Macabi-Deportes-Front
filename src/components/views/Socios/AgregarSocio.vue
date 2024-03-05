<template>
  <Loading v-if="this.loading" />
  <div v-else class="container-fluid px-5 mb-5">
    <div class="text text-center pb-3 h2">Agregar socios a la categoria: <strong>{{ nombreCategoria }}</strong>
    </div>

    <form>
      <div class="row g-2">
        <input class="form-control" v-model="socioBuscado" type="text" name="datosSocio" placeholder="Dni o nro socio..">
        <label for="">Busqueda por: </label>
        <div class="botones my-3" v-if="socioBuscado">
          <button v-if="socioBuscado" class="btn botonHabilitado btn_busquedas" @click.prevent="buscarSocio('D')">{{
            tituloBotonDni
          }}</button>
          <button v-if="socioBuscado" class="btn botonHabilitado btn_busquedas" @click.prevent="buscarSocio('S')">{{
            tituloBotonNroSocio
          }}</button>

          <button v-if="socioBuscado" class="btn botonHabilitado btn_busquedas" @click.prevent="buscarPorApellido()">{{
            tituloBotonPorApellido
          }}</button>

          <!-- El .prevent() hace q el form no recargue cuando se se toque el boton </div> -->
        </div>
        <div class="botones my-3" v-else>
          <button class="btn btn_busquedas" disabled>{{ tituloBotonDni }}</button>
          <button class="btn btn_busquedas" disabled>{{ tituloBotonNroSocio }}</button>
          <button class="btn btn_busquedas" disabled>{{ tituloBotonPorApellido
          }}</button>
        </div>

      </div>
    </form>

    <div>
      <div class="d-flex justify-content-between align-items-center">
        <p class="">Socios por asignar: <strong>{{ sociosList.length }}</strong></p>
      </div>
      <div>
        <table class="table table-bordered">
          <thead>
            <tr>
              <th>Nro socio</th>
              <th>Nombre</th>
              <th class="d-none d-md-table-cell">Apellido</th>
              <th class="d-none d-md-table-cell">Dni</th>
              <th>Anular</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(socio, index) in sociosList" :key="socio.idSocio">
              <td>{{ socio.nroSocio }}</td>
              <td>{{ socio.nombre }}</td>
              <td class="d-none d-md-table-cell">{{ socio.apellido }}</td>
              <td class="d-none d-md-table-cell">{{ socio.dni }}</td>
              <td><button class="btn btn-danger" @click="eliminarDeListaSocios(index)"><svg
                    xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash"
                    viewBox="0 0 16 16">
                    <path
                      d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6Z" />
                    <path
                      d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1ZM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118ZM2.5 3h11V2h-11v1Z" />
                  </svg></button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div v-if="sociosList.length == 0">
      <p class="no-fechas" style="border-radius: 15px;">{{ mensaje }}</p>
    </div>
    <div class="d-flex justify-content-center align-items-center">
      <div class="btn-group ">
     
        
        <button disabled v-if="this.sociosList.length == 0" @click="agregarSociosACategoria" class="btn btn-success mr-2"> Agregar socios </button>
        <button v-else @click="agregarSociosACategoria" class="btn btn-success  mr-2"> Agregar socios </button>

        <button disabled v-if="this.sociosList.length == 0" @click="vaciarLista" class="btn btn-danger mr-2"> Vaciar lista</button>
        <button  v-else @click="vaciarLista" class="btn btn-danger mr-2"> Vaciar lista</button>


        <button class="btn btn-dark ml-2" @click="this.$router.go(-1)">Volver</button>
      </div>
    </div>
  </div>
  <br>
</template>

<script >
import axios from "axios";
import apiUrl from '../../../../config/config.js'
import { verificarAutorizacionCategoria } from "../../../utils/permisos";
import Unauthorized from "../../Unauthorized.vue";
import Loading from "../../dependentComponents/Loading.vue";

export default {
  name: "AgregarSocio",
  components: {},
  data: () => ({
    mensaje: "No se buscaron socios para agregar",
    titulo: "Agregar socios a la categoria: ",
    tituloBotonDni: "Dni",
    tituloBotonPorApellido: "Apellido",
    tituloBotonNroSocio: "Número de Socio",
    idCat: 0,
    tipoBusqueda: 'D',
    sociosList: [],
    socioBuscado: "",
    nombreCategoria: "",
    sociosBuscadosPorApellido: [],
    loading: true
  }),
  components: {
    Loading
  },
  async created() {
    this.idCat = this.$route.params.idCategoria
    if (!await verificarAutorizacionCategoria(this.idCat)) {
      this.$router.push({ path: "/unauthorized", component: Unauthorized })
    }
    try {
      let response = await axios.get(`${apiUrl}/categoria/${this.idCat}/nombreCategoria`, { withCredentials: true });
    
      this.nombreCategoria = response.data.nombreCategoria;
    } catch (error) {
      console.error(error);
      this.nombreCategoria = 'categoría no encontrada'
    } finally {
      this.loading = false;
    }
  },
  methods: {
    async buscarPorApellido() {
      this.loading = true
      try {
        //console.log("Socio buscado:" + this.socioBuscado);
        let sociosApellido = await axios.get(`${apiUrl}/socio/getSociosPorApellido/${this.socioBuscado}`, { withCredentials: true });
        this.sociosBuscadosPorApellido = sociosApellido.data.result
        let sociosExistentes = false;
        let sociosInexistentes = false;
        this.sociosBuscadosPorApellido.forEach(socio => {
          if (!this.yaExisteSocioEnLista(socio.nroSocio)) {
            this.sociosList.push(socio)
            sociosInexistentes = true;
          } else {
            sociosExistentes = true
          }

        });

        if (sociosExistentes && sociosInexistentes) {
          alert("Solo se agregaron socios con el apellido similar que no se encuentran en la lista previa")
        } else {
          if (sociosExistentes && !sociosInexistentes) {
            alert("Todos los socios con apellidos similares, ya se encuentran en la lista")
          }
        }

      } catch (e) {
        alert(e.response.data.message)
      } finally {
        this.loading = false
      }

    },
    async buscarSocio(opcion) {
      this.tipoBusqueda = opcion;
      this.loading = true
      try {
        //console.log("Socio buscado:" + this.socioBuscado);

        let sociosGet;
        if (opcion == 'D') {
          sociosGet = await axios.get(`${apiUrl}/socio/getSocioPorDni/${this.socioBuscado}`, { withCredentials: true });

        } else {
          sociosGet = await axios.get(`${apiUrl}/socio/getSocioPorNroSocio/${this.socioBuscado}`, { withCredentials: true });
        }

        //console.log("El socio que se esta intentando buscar es " + sociosGet.data.result.nroSocio);

        if (!this.yaExisteSocioEnLista(sociosGet.data.result.nroSocio)) {
          this.sociosList.push(sociosGet.data.result)
        } else {
          alert("Ya existia este socio en la lista")
        }
        

      } catch (e) {
        alert(e.response.data.message)
      } finally {
        this.loading = false
      }

    },

    yaExisteSocioEnLista(nroSocio) {
      let existe = false
      if (this.sociosList.find(socio => socio.nroSocio === nroSocio) !== undefined) {
        existe = true
      }

      return existe;
    },

    vaciarLista(){
      this.sociosList = []
    },
    eliminarDeListaSocios(index) {
      this.sociosList.splice(index, 1)
    },

    /*
   eliminarDeListaSociosApellido(index) {
     
     this.sociosBuscadosPorApellido.splice(index, 1)
   },

 
   agregarAsociosPorAgregar(socio,index) {
     this.sociosList.push(socio)
     this.sociosBuscadosPorApellido.splice(index, 1)

 },
*/
    validarSocioExisteEnListaPorAgregar(idSocioNueva) {
      existe = false
      let pos = 0
      while (!existe && pos < this.sociosList.length) {

        if (this.sociosList[0].idSocio == idSocioNueva) {
          existe = true
        }
        pos++

      }

      return existe
    },


    async agregarSociosACategoria() { 
      this.loading = true
      try {
        let parametro = { socios: [] }
        this.sociosList.forEach(socio => {
          parametro.socios.push({ idSocio: socio.idSocio })
        });
        let response = await axios.post(`${apiUrl}/sociosXCategoria/${this.idCat}/agregar`, parametro, { withCredentials: true })

        alert(response.data.message)
        if (response.data.idSociosYaExistentes.length > 0) {
          alert("Se intentaron agregar " + response.data.idSociosYaExistentes.length + " socios que ya estaban asignados");

          this.sociosList = []

        }

        this.$router.back()
      } catch (e) {
        alert(e.response.data.message)
        this.sociosList = []

      } finally {
        this.loading = false
      }
    },



  },

};

</script>

<style scoped>
.botonHabilitado {

  background-color: #014187;
  color: white
}

.btnBorrar {
  background-color: #93979b;
  color: white
}

.no-fechas {
  text-align: center;
  padding: 10px;
  background-color: rgb(1, 65, 135);
  border: 1px solid #ffffff;
  border-radius: 4px;
  margin: 20px auto;
  max-width: 300px;
  color: white;
}

.botones {
  display: flex;
  justify-content: center;
}

.btn_busquedas {

  margin-left: 2px;
  margin-right: 2px;

}

@media (max-width: 768px) {
  .container {
    max-width: 80%;

  }

  .formulario {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .prueba {
    display: none;
  }

}
</style>

