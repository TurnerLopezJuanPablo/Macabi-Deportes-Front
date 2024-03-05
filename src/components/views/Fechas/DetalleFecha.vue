<template>
  <Loading v-if="loading" />
  <div v-else class="container mb-5">
    <div class="text text-center pb-3 h3">Detalles de la Fecha: <strong>{{
      utils.obtenerFechaFormateada(fechaDetalle.fechaCalendario) }}</strong></div>
    <div class="row">
      <div class="col-md-6 offset-md-3">
        <br>
        <div class="card bg-light text-dark mb-4">
          <div class="card-body">
            <p class="mb-2"><strong class="font-weight-bold">Fecha: </strong>{{
              utils.obtenerFechaFormateada(fechaDetalle.fechaCalendario) }}</p>
            <p class="mb-1"><strong class="font-weight-bold">Profesores Asignados: </strong></p>
            <button v-if="profesor" v-for="(profesor, index) in profesor" :key="index"
              class="mb-1 mx-1 btn btn-sm btn-dark" @click="verProfesor(profesor.idUsuario)">
              {{ profesor.apellido }}, {{ profesor.nombre }}
            </button>
            <div v-else>
              <div class="card fondo-card my-3">
                <div class="card-body" style="border-radius: 10px;">
                  <h6 class="fw-bold text-center">No se encontraron profesores asignados a la Categoría</h6>
                </div>
              </div>
            </div>
            <p class="my-2"><strong class="font-weight-bold">Tipo: </strong>{{ mapearTipo(fechaDetalle.tipo) }}</p>
            <p class="mb-2"><strong class="font-weight-bold">Categoria: </strong>{{ fechaDetalle.Categorium ?
              fechaDetalle.Categorium.nombreCategoria : 'Sin categoría' }}</p>
            <p class="mb-0"><strong class="font-weight-bold">Deporte: </strong>{{ deporte }}</p>
          </div>
        </div>
      </div>
      <h4 class="text-center my-4">
        Socios Anotados en esta Fecha: <strong>{{ size }}</strong>
      </h4>
      <table class="table table-bordered table-hover" v-if="sociosAsistenciaFecha.length !== 0">
        <thead>
          <tr>
            <th class="d-none d-sm-table-cell">Nombre</th>
            <th>Apellido</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="socio in sociosAsistenciaFecha" :key="socio.idSocio" @click="irA(socio.idSocio)"
            style="cursor: pointer;">
            <td class="d-none d-sm-table-cell td-custom">{{ socio.nombre }}</td>
            <td class="td-custom">{{ socio.apellido }}</td>
            <td class="td-custom">{{ mapearEstado(socio.estado) }}</td>
          </tr>
        </tbody>
      </table>
      <div v-if="sociosAsistenciaFecha.length === 0">
        <div class="card fondo-card my-3">
          <div class="card-body" style="border-radius: 10px;">
            <h5 class="fw-bold text-center">No hay socios anotados a la fecha</h5>
          </div>
        </div>
      </div>
    </div>
    <div class="d-flex justify-content-center align-items-center mb-4 mt-3">
      <div class="btn-group">
        <router-link class="btn btn-macabi1" :to="`/editarfecha/${fechaDetalle.idFecha}`">Editar Fecha</router-link>
        <button class="btn btn-success" @click="asignarAsistencia"
          v-if="sociosAsistenciaFecha.length !== 0">Asignar/Modificar asistencias</button>
      </div>
    </div>
    <div class="d-flex justify-content-center align-items-center">
      <div class="btn-group">
        <button @click="eliminarFecha" class="btn btn-danger">Eliminar fecha</button>
        <button class="btn btn-dark" @click="router.go(-1)">Volver</button>
      </div>
    </div>
  </div>
  <br>
</template>
<script>
import { useElementStore } from "../../../utils/Store";
import { onBeforeMount, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import apiUrl from "../../../../config/config.js";
import { verificarAutorizacionFecha } from "../../../utils/permisos";
import { Utils } from "../../../utils/utils";
import Loading from "../../dependentComponents/Loading.vue";

export default {
  components: {
    Loading
  },
  setup() {
    const asistenciaStore = useElementStore("asistencias")();
    const fechaStore = useElementStore("fechas")();
    const sociosAsistenciaFecha = ref([]);
    const fechaDetalle = ref([]);
    const route = useRoute();
    const router = useRouter();
    const idFecha = route.params.id;
    const size = ref(0);
    const deporte = ref("");
    const profesor = ref("");

    const loading = ref(true)

    onBeforeMount(async () => {
      await fetchs();
    });

    const utils = new Utils()

    async function fetchs() {
      try {
        if (!await verificarAutorizacionFecha(idFecha)) {
          router.push({ path: "/unauthorized" })
        }
        await asistenciaStore.fetchElements(`${apiUrl}/asistencia/${idFecha}`);
        sociosAsistenciaFecha.value = asistenciaStore.getElements.result;
        sociosAsistenciaFecha.value.sort(comparar)
        size.value = sociosAsistenciaFecha.value.length;
      } catch (error) {
        console.error("Error fetching socios anotados:", error);
      }

      try {
        await fechaStore.fetchElements(`${apiUrl}/fecha/fechas/${idFecha}`);
        fechaDetalle.value = fechaStore.getElements.result[0];
        if (fechaDetalle.value && fechaDetalle.value.idCategoria) {
          const idCategoria = fechaDetalle.value.idCategoria;
          deporte.value = await obtenerDeporte(idCategoria);
          profesor.value = await obtenerProfesor(idCategoria);
        }
      } catch (error) {
        console.error("Error fetching fecha detalle:", error);
      } finally {
        loading.value = false
      }
    }

    const comparar = (a, b) => {
      const valorA = a.apellido.toLowerCase();
      const valorB = b.apellido.toLowerCase();

      return valorA.localeCompare(valorB);
    };

    const obtenerDeporte = async (idCategoria) => {
      try {
        const response = await fetch(
          `${apiUrl}/categoria/${idCategoria}/nombreDeporte`
        );
        if (response.ok) {
          const data = await response.json();
          return data.nombreDeporte;
        } else {
          console.error("Error al obtener el nombre del deporte");
          return null;
        }
      } catch (error) {
        console.error("Error en la solicitud:", error);
        return null;
      }
    };

    const obtenerProfesor = async (idCategoria) => {
      try {
        const response = await fetch(`${apiUrl}/categoria/${idCategoria}/getProfesores`);
        if (response.ok) {
          const data = await response.json();

          return data.usuariosList
        } else {
          console.error("Error al obtener nombre del profesor");
          return null;
        }
      } catch (error) {
        console.error("Error en la solicitud:", error);
        return null;
      }
    };

    function mapearTipo(tipo) {
      if (tipo === "C") {
        return "Citación";
      } else if (tipo === "E") {
        return "Entrenamiento";
      } else {
        return "Tipo Desconocido";
      }
    }

    function mapearEstado(estado) {
      if (estado == "P") {
        return "Presente";
      } else if (estado == "A") {
        return "Ausente";
      } else if (estado == "J") {
        return "Justificado";
      }
      else if (estado == null) {
        return "Sin asignar";
      }
    }
    //function eliminarFecha() {

    //   let idCategoria = fechaDetalle.value.idCategoria;
    //   //fechaStore.deleteElement(apiUrl,"fecha/" + idFecha + "/eliminarFecha")
    //   if(confirm("¿Estas seguro que queres borras definitivamente la fecha con todas sus asistencias existentes?")) {
    //   fechaStore.deleteElement(apiUrl,"fecha/" + idFecha + "/eliminarFecha")

    //    router.push({ path: `/fechasCategoria/${idCategoria}` })
    //     alert("Borrado con éxito")
    //     }else
    //    alert('Se canceló la operación');

    //  }

    const eliminarFecha = async () => {
      let idCategoria = fechaDetalle.value.idCategoria;
      if (confirm("¿Estas seguro que queres borras definitivamente la fecha con todas sus asistencias existentes?")) {
        try {
          await fechaStore.deleteElement(apiUrl, "fecha/" + idFecha + "/eliminarFecha");
          alert("Borrado con éxito");
          router.push({ path: `/fechasCategoria/${idCategoria}` })
        } catch (error) {
          console.error("Error al eliminar fecha:", error);
        }
      } else {
        alert('Se canceló la operación');
      }
    };

    function asignarAsistencia() {

      router.push({ path: `/tomarAsistencia/${idFecha}` });
    }

    function irA(id) {
      if (id != 0) {
        router.push(`/socios/${id}`)
      }
    }

    function verProfesor(profesor) {
      router.push(`/usuarios/${profesor}`);
    }
    return {
      sociosAsistenciaFecha,
      fechaDetalle,
      size,
      mapearEstado,
      mapearTipo,
      obtenerDeporte,
      deporte,
      profesor,
      asignarAsistencia,
      eliminarFecha,
      utils,
      irA,
      router,
      verProfesor,
      loading
    };
  }, data() {
    return {
    };
  },
};
</script>

<style scoped>
@import '../../../assets/btn.css';

.fondo-card {
  background-color: #f8d7da;
  border-color: #f0959e;
  color: #723b47;
  border-width: 2px;
  border-style: solid;
  border-radius: 4px;
  padding: 8px;
}
</style>