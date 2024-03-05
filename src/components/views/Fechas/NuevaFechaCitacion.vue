<template>
  <Loading v-if="this.loading" />
  <div v-else class="container-fluid px-3 px-sm-5 mb-5">
    <div class="row m">
      <h3 class="text-center mt-2">Citación de socios para la fecha: <strong> {{
        utils.obtenerFechaFormateada(fechaCitacion) }}</strong></h3>
      <h4 class="text-center mt-2">Categoria: <strong>{{ this.nombreCategoria }}</strong></h4>
      <h5 class="text-center mt-2">Deporte: <strong>{{ this.nombreDeporte }}</strong></h5>
      <code class="text-end" v-if="users.length != 0"># Seleccionar socios para la citación</code>
      <table class="table table-bordered table-hover mt-2" v-if="users.length != 0">
        <thead>
          <tr>
            <th class="d-none d-sm-table-cell">Nro. de Socio</th>
            <th>Nombre</th>
            <th>Apellido</th>
            <th class="d-none d-sm-table-cell">DNI</th>
            <th class="text-center">#</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(user, index) in users" :key="index" @click="toggleSociosElegidos(user.idSocio)"
            style="cursor: pointer;">
            <td class="d-none d-sm-table-cell">{{ user.nroSocio }}</td>
            <td>{{ user.nombre }}</td>
            <td>{{ user.apellido }}</td>
            <td class="d-none d-sm-table-cell">{{ user.dni }}</td>
            <td class="text-center">
              <input style="height: 20px; width: 20px;" type="checkbox" :value="{ idSocio: user.idSocio }"
                v-model="usersElegidos">
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="users.length == 0" class="mt-3">
        <div class="card fondo-card">
          <div class="card-body" style="border-radius: 10px;">
            <h5 class="fw-bold text-center">{{ mensajeNoHaySocios }}</h5>
          </div>
        </div>
      </div>
      <code v-if="users.length != 0" class="text-center">Seleccionar o Des-Selecionar todos los socios</code>
      <div v-if="users.length != 0" class="d-flex align-items-center justify-content-center mt-3">
        <div class="btn-group">
          <button @click="selectAll" class="btn btn-success">Todos</button>
          <button @click="deleteAll" class="btn btn-danger">Quitar</button>
        </div>
      </div>
      <div class="d-flex align-items-center justify-content-center mt-3">
        <div class="btn-group">
          <button @click="nuevaCitacion" class="btn btn-macabi1">Confirmar</button>
          <button @click="this.$router.go(-2)" class="btn btn-dark">Volver</button>
        </div>
      </div>
    </div>
  </div>
  <br>
</template>


<script>
import axios from "axios";
import apiUrl from '../../../../config/config.js'
import { verificarAutorizacionCategoria } from "../../../utils/permisos";
import { Utils } from '../../../utils/utils.js'
import Loading from "../../dependentComponents/Loading.vue";

export default {
  name: "NuevaFechaCitacion",
  components: {},
  data: () => ({
    mensajeNoHaySocios: "No hay socios asignados a esta categoria. Podes generar la fecha y asignar socios a la citación más tarde",
    fechaCitacion: "21/05/1997",
    categoria: "",
    users: [],
    usersElegidos: [],
    utils: new Utils(),
    nombreDeporte: '',
    nombreCategoria: '',

    loading: true
  }),
  components: {
    Loading
  },
  async created() {
    try {
      this.fechaCitacion = this.$route.query.fecha;
      this.categoria = this.$route.params.idCategoria;
      this.nombreCategoria = this.$route.query.categoria;
      this.nombreDeporte = this.$route.query.deporte;

      if (!await verificarAutorizacionCategoria(this.categoria)) {
        this.$router.push("/unauthorized")
      }

      let respuesta = await axios.get(`${apiUrl}/sociosXCategoria/${this.categoria}`, { withCredentials: true });
      this.users = respuesta.data.sociosDatos

    } catch (e) {
      throw e
    } finally {
      this.loading = false
    }
  },
  methods: {
    async nuevaCitacion() {
      this.loading = true
      try {
        let parametro = {
          idCategoria: this.categoria,
          fechaCalendario: this.fechaCitacion,
          tipo: 'C',
          idSocios: this.usersElegidos
        };
        let result = await axios.post(`${apiUrl}/fecha/`, parametro, { withCredentials: true });
        this.$router.push(`/fechasCategoria/${this.categoria}`);

      } catch (e) {
        alert(e.response.data.message)
        this.$router.push(`/fechasCategoria/${this.categoria}`);

      } finally {
        this.loading = false
      }
    },

    selectAll() {
      this.usersElegidos = this.users.map(user => ({ idSocio: user.idSocio }));
    },

    deleteAll() {
      this.usersElegidos = []
    },

    toggleSociosElegidos(idSocio) {
      const index = this.usersElegidos.findIndex(socio => socio.idSocio === idSocio);

      if (index !== -1) {
        this.usersElegidos.splice(index, 1);
      } else {
        this.usersElegidos.push({ idSocio: idSocio });
      }
    }
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