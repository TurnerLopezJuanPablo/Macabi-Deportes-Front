<template>
  <Loading v-if="loading" />
  <div v-else class="container fluid mb-5">
    <div class="text text-center pb-3 h3">Detalles de la Fecha: <strong>{{
      utils.obtenerFechaFormateada(fechaDetalle.fechaCalendario) }}</strong></div>
    <div class="row">
      <div class="col-md-6 offset-md-3">
        <br>
        <div class="card bg-light text-dark mb-4">
          <div class="card-body">
            <p><strong class="font-weight-bold">Fecha: <code>*</code></strong><input type="date" class="form-control"
                v-model="fechaDetalle.fechaCalendario"></p>
            <p class="mb-1"><strong class="font-weight-bold">Profesor Asignado: </strong></p>
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
    <div>
      <h4 class="text-center my-4">
        Socios Anotados en esta Fecha: <strong>{{ sociosAsistencia.sociosFinal.length }}</strong>
      </h4>
      <div class="text-center">
        <code>Solo se eliminan los socios de esta <strong>fecha/citación</strong> pero siguen dentro de la categoría</code>
      </div>
      <table class="table table-bordered table-hover">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Apellido</th>
            <th class="d-none d-sm-table-cell">Estado</th>
            <th v-if="fechaDetalle.tipo == 'C'">Eliminar</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="socio in sociosAsistencia.sociosFinal" :key="socio.idSocio">
            <td @click="irA(socio.idSocio)">{{ socio.nombre }}</td>
            <td @click="irA(socio.idSocio)">{{ socio.apellido }}</td>
            <td class="d-none d-sm-table-cell" @click="irA(socio.idSocio)">{{ mapearEstado(socio.estado) }}</td>
            <td v-if="fechaDetalle.tipo == 'C'">
              <button class="btn btn-danger" @click="eliminarSocio(socio)">
                X
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="sociosAsistencia.sociosFinal.length === 0">
        <p class="no-socios">No hay socios anotados en esta fecha.</p>
      </div>
    </div>
    <!-- Modal button start -->
    <div class="justify-content-center d-flex" v-if="fechaDetalle.tipo == 'C'">
      <button class="btn btn-success mb-3" data-bs-toggle="modal" data-bs-target="#myModal">
        Agregar Socios
      </button>
    </div>
    <!-- Modal button end -->
    <div class="d-flex justify-content-center align-items-center">
      <div class="btn-group">
        <button class="btn btn-macabi1" @click="editFecha()">
          Confirmar cambios
        </button>
        <button @click="router.go(-1)" class="btn btn-dark">Volver</button>
      </div>
    </div>

    <br>
  </div>

  <!-- Modal start -->
  <div class="modal fade" id="myModal" tabindex="-1" aria-labelledby="exampleModalLabel2" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel2">Seleccionar socios para agregar a esta fecha</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div v-for="socio in sociosXCategoria" :key="socio">
            <div class="form-check" v-if="!sociosAsistencia.sociosFinal.some(e => socio.idSocio == e.idSocio)">
              <input class="form-check-input pointer" type="checkbox" :value="socio" v-model="listaSociosAgregar">
              <label class="form-check-label" for="exampleCheckbox1">
                <p class="h6"> {{ socio.nombre }}, {{ socio.apellido }} | DNI: {{
                  socio.dni }}</p>
              </label>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-macabi1" @click="agregarSocios" data-bs-dismiss="modal">Guardar</button>
          <button type="button" class="btn btn-danger" data-bs-dismiss="modal">Cerrar</button>
        </div>
      </div>
    </div>
  </div>
  <!-- Modal end -->
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
    const route = useRoute();
    const router = useRouter();

    const asistenciaStore = useElementStore("asistencias")();
    const fechaStore = useElementStore("fechas")();
    const sociosXCategoriaStore = useElementStore("sociosXCategoria")();

    const sociosAsistencia = ref({ sociosInicial: [], sociosFinal: [] });
    const fechaDetalle = ref([]);
    const sociosXCategoria = ref([])

    const idFecha = route.params.id;

    const deporte = ref("");
    const profesor = ref("");
    const listaSociosAgregar = ref([])

    const utils = new Utils()

    const loading = ref(true)

    onBeforeMount(async () => {
      await fetchs();
      if (!await verificarAutorizacionFecha(idFecha)) {
        router.push({ path: "/unauthorized" })
      }
    });

    async function fetchs() {
      await obtenerSociosAnotados();
      fechaDetalle.value = await obtenerDetalleFecha();

      if (fechaDetalle.value && fechaDetalle.value.idCategoria) {
        const idCategoria = fechaDetalle.value.idCategoria;
        deporte.value = await obtenerDeporte(idCategoria);
        profesor.value = await obtenerProfesor(idCategoria);
        sociosXCategoria.value = await obtenerSociosXCategoria(idCategoria)
      }

      loading.value = false
    }

    const obtenerSociosXCategoria = async (idCategoria) => {
      let res = [];
      try {
        await sociosXCategoriaStore.fetchElements(`${apiUrl}/sociosXCategoria/${idCategoria}`);
        res = sociosXCategoriaStore.getElements.sociosDatos
        //console.log("165",res)
      } catch (error) {
        console.error("Error fetching socios x categoria:", error);
      }
      return res;
    }

    const obtenerDetalleFecha = async () => {
      let res = []
      try {
        await fechaStore.fetchElements(`${apiUrl}/fecha/fechas/${idFecha}`);
        res = fechaStore.getElements.result[0];
      } catch (error) {
        console.error("Error fetching fecha detalle:", error);
      }
      return res;
    }

    const obtenerSociosAnotados = async () => {
      try {
        await asistenciaStore.fetchElements(`${apiUrl}/asistencia/${idFecha}`);
        sociosAsistencia.value.sociosInicial = asistenciaStore.getElements.result;
        sociosAsistencia.value.sociosFinal = asistenciaStore.getElements.result
      } catch (error) {
        console.error("Error fetching socios anotados:", error);
      }
    }

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
      } else {
        return "Sin asignar";
      }
    }

    function eliminarSocio(socio) {
      sociosAsistencia.value.sociosFinal = sociosAsistencia.value.sociosFinal.filter(
        (e) => e.idSocio != socio.idSocio
      );


    }

    function volverADetalle() {
      router.go(-1)
    }

    async function agregarSocios() {
      sociosAsistencia.value.sociosFinal = sociosAsistencia.value.sociosFinal.concat(...listaSociosAgregar.value)
      listaSociosAgregar.value = listaSociosAgregar.value.filter(item => !sociosAsistencia.value.sociosFinal.includes(item));
    }


    async function editFechaCalendario() {
      
      try {
        await fechaStore.patchElement(`${apiUrl}/fecha/${idFecha}`, { fechaCalendario: fechaDetalle.value.fechaCalendario, idCategoria: fechaDetalle.value.idCategoria })

      } catch (error) {
        console.log("🚀 ~ file: EditarFecha.vue:196 ~ editFechaCalendario ~ error:", error.message.substring(error.message.length - 3))
        if (error.message.substring(error.message.length - 3) == 400) throw "La fecha calendario ya existe"
      }
    }


    
    async function editFecha() {
      var respuesta = confirm("¿Estás seguro de que deseas confirmar los cambios?");
      if (respuesta) {
        try {
        await editSociosRegistrados();

        await editFechaCalendario();
        router.go(-1)
      } catch (error) {
        alert("Error detectado en el ingreso de campos: " + error)
      }
   
} else {
    // El usuario hizo clic en "Cancelar" o cerró el cuadro de diálogo
    // Puedes realizar otra acción o simplemente ignorar
    alert("Acción cancelada");
}
      
      

    }

    async function editSociosRegistrados() {

      const sociosAgregados = sociosAsistencia.value.sociosFinal.filter(socioFinal => !sociosAsistencia.value.sociosInicial.some(socioInicial => socioFinal.idSocio == socioInicial.idSocio));

      const sociosBorrados = sociosAsistencia.value.sociosInicial.filter(socioInicial => !sociosAsistencia.value.sociosFinal.some(socioFinal => socioFinal.idSocio == socioInicial.idSocio));

      await agregarSociosDeFechaRequest(sociosAgregados)

      await eliminarSociosDeFechaRequest(sociosBorrados);
    }

    async function eliminarSociosDeFechaRequest(listSociosborrados) {
      for (const socioBorrado of listSociosborrados) {
        await asistenciaStore.deleteElementCustom(
          `${apiUrl}/asistencia/${idFecha}/${socioBorrado.idSocio}`
        );
      }
    }

    async function agregarSociosDeFechaRequest(listSociosAgregados) {
      for (const socioAgregado of listSociosAgregados) {
        await asistenciaStore.createElement(
          `${apiUrl}/asistencia`, { idFecha, idSocio: socioAgregado.idSocio, estado: null });
      }
    }

    
    function irA(id) {
      if (id != 0) {
        router.push(`/socios/${id}`)
      }
    }

    return {
      sociosAsistencia,
      fechaDetalle,
      mapearEstado,
      mapearTipo,
      obtenerDeporte,
      deporte,
      profesor,
      editFecha,
      eliminarSocio,
      sociosXCategoria,
      listaSociosAgregar,
      agregarSocios,
      volverADetalle,
      utils,
      router,
      irA,
      loading
    };
  },
  data() {
    return {};
  },
  methods: {},
  components: {
    Loading
  }
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

.pointer, input {
  cursor: pointer;
}
</style>
