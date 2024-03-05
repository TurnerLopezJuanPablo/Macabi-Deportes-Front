<template>
  <Loading v-if="loading" />
  <div v-else class="container mb-5">
    <div class="text text-center pb-3 h3">Asignar asistencia a la fecha: <strong>{{
      utils.obtenerFechaFormateada(fechaDetalle.fechaCalendario)
    }}</strong></div>

    <div class="row">
      <div class="col-md-6 offset-md-3">
        <br>
        <div class="card bg-light text-dark mb-4">
          <div class="card-body">
            <p class="mb-2"><strong class="font-weight-bold">Fecha: </strong>{{
              utils.obtenerFechaFormateada(fechaDetalle.fechaCalendario) }}</p>
            <p class="mb-1"><strong class="font-weight-bold">Profesores Asignados: </strong></p>
            <button v-for="(profesor, index) in profesor" :key="index" class="mb-1 mx-1 btn btn-sm btn-dark"
              @click="verProfesor(profesor.idUsuario)">
              {{ profesor.apellido }}, {{ profesor.nombre }}
            </button>
            <p class="my-2"><strong class="font-weight-bold">Tipo: </strong>{{ mapearTipo(fechaDetalle.tipo) }}</p>
            <p class="mb-2"><strong class="font-weight-bold">Categoria: </strong>{{ fechaDetalle.Categorium ?
              fechaDetalle.Categorium.nombreCategoria : 'Sin categoría' }}</p>
            <p class="mb-0"><strong class="font-weight-bold">Deporte: </strong>{{ deporte }}</p>
          </div>
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col-md-6 offset-md-3">
        <h4 class="text-center my-4">
          Socios Anotados en esta Fecha: <strong>{{ size }}</strong>
        </h4>
        <ul class="list-group" v-for="socio in sociosAsistenciaFecha" :key="socio.idSocio">
          <li class="list-group-item text-center mb-2 list-group-item-light">
            <strong> {{ socio.apellido }}, {{ socio.nombre }}</strong>
            <div class="d-flex align-items-center justify-content-center my-1 columnas-responsive">
              <div class="my-1">
                <input type="radio" :id="'p' + socio.idSocio" v-model="socio.estado" value="P"
                  :checked="socio.estado === 'P'" class="me-1" />
                <label class="me-0 me-sm-3 pointer" :for="'p' + socio.idSocio">Presente</label>
              </div>

              <div class="my-1">
                <input type="radio" :id="'j' + socio.idSocio" v-model="socio.estado" value="J"
                  :checked="socio.estado === 'J'" class="me-1" />
                <label class="me-0 me-sm-3 pointer" :for="'j' + socio.idSocio">Justificado</label>
              </div>

              <div class="my-1">
                <input type="radio" :id="'a' + socio.idSocio" v-model="socio.estado" value="A"
                  :checked="socio.estado === 'A'" />
                <label class="me-0 me-sm-1 pointer" :for="'a' + socio.idSocio">Ausente</label>
              </div>
            </div>
          </li>
        </ul>
        <div v-if="sociosAsistenciaFecha.length === 0">
          <div class="card fondo-card my-3">
            <div class="card-body" style="border-radius: 10px;">
              <h5 class="fw-bold text-center">No hay socios anotados a la fecha</h5>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="d-flex justify-content-center align-items-center">
      <div class="btn-group">
        <button class="btn btn-macabi1" @click="guardarAsistencia">
          Guardar asistencia
        </button>
        <button class="btn btn-dark" @click="cancelar">Volver</button>
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
    const utils = new Utils()
    const loading = ref(true)

    onBeforeMount(async () => {
      await fetchs();
    });

    async function fetchs() {
      try {
        if (! await verificarAutorizacionFecha(idFecha)) {
          router.push({ path: "/unauthorized" });

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
      }

      loading.value = false
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
      } else if (estado == null) {
        return "Sin asignar";
      }
    }

    const cancelar = () => {
      router.go(-1);
    };

    const guardarAsistencia = async () => {
      try {
        const cambiosAsistencia = [];
        loading.value = true

        // Itera sobre los socios y agrega los cambios de estado
        sociosAsistenciaFecha.value.forEach((socio) => {
          cambiosAsistencia.push({
            idFecha: idFecha,
            idSocio: socio.idSocio,
            estado: socio.estado,
          });
        });

        const response = await fetch(
          `${apiUrl}/asistencia/asistenciaAlumno/${idFecha}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(cambiosAsistencia),
          }
        );

        if (response.ok) {
          router.go(-1);
        } else {
          console.error("Error al guardar la asistencia");
        }
      } catch (error) {
        console.error("Error al guardar la asistencia:", error);
      }
    };

    return {
      sociosAsistenciaFecha,
      fechaDetalle,
      size,
      mapearEstado,
      mapearTipo,
      obtenerDeporte,
      deporte,
      profesor,
      cancelar,
      guardarAsistencia,
      utils,
      loading
    };
  },
  data() {
    return {};
  },
  methods: {
    editarFecha() {
      const idFecha = this.$route.params.idFecha;
      this.$router.push({ path: "/editarFecha/" + idFecha });
    },
  },
  components: {
    Loading
  }
};
</script>

<style scoped>
@import '../../../assets/btn.css';

input,
.pointer {
  cursor: pointer
}

@media screen and (max-width: 1000px) {
  .columnas-responsive {
    flex-direction: column;
    align-items: center;
  }
}

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
