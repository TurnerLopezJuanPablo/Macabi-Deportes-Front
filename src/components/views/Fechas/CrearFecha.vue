<template>
  <Loading v-if="this.loading" />
  <div v-else class="container-fluid mb-5">
    <div class="row m">
      <div class="col-md-6 offset-md-3">
        <h3 class="text-center mt-2">Crear Fecha</h3>
        <div class="text-end"><code>*campos obligatorios</code></div>
        <div class="card bg-light text-dark mb-4">
          <div class="card-body">
            <div class="form-group mb-3">
              <label class="fw-bold">Categoria: <code>*</code></label>
              <input type="text" class="form-control" aria-describedby="emailHelp" :value="nombreCategoria" disabled>
            </div>
            <div class="form-group mb-3">
              <label for="tipoFecha" class="fw-bold">Tipo de fecha: <code>*</code></label>
              <select id="tipoFecha" class="form-control" v-model="selectedTipoFecha">
                <option v-for="opcion in opciones" :value="opcion.value">{{ opcion.label }}</option>
              </select>
            </div>
            <div class="form-group mb-3">
              <label for="" class="fw-bold">Deporte: <code>*</code></label>
              <input type="text" class="prueba form-control" aria-describedby="emailHelp" :value="nombreDeporte" disabled>
            </div>
            <div class="form-group mb-3">
              <label for="" class="fw-bold">Fecha: <code>*</code></label>
              <input v-model="fechaElegida" type="date" name="" id="fecha" class="form-control" :min="fechaMin">
            </div>
          </div>
        </div>
      </div>
      <div class="d-flex justify-content-center align-items-center mb-1">
        <button type="button" class="btn btn-success" data-bs-toggle="collapse" data-bs-target="#demo">Ayuda</button>
      </div>
      <div class="d-flex justify-content-center align-items-center">
        <div id="demo" class="collapse">
          <code><strong>"Entrenamiento"</strong> para automaticamente citar a todos los socios de la <strong>Categoría.</strong>
                      <br><strong>"Citacion"</strong> para poder elegir que socios citar a la fecha de la <strong>Categoría.</strong>
                    </code>
        </div>
      </div>
      <div class="d-flex justify-content-center align-items-center mt-4">
        <div class="btn-group">
          <button @click="ingresarFecha" class="btn btn-macabi1">Crear fecha</button>
          <button class="btn btn-dark" @click="this.$router.go(-1)">Volver</button>
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
import Loading from "../../dependentComponents/Loading.vue";
import { routerKey } from "vue-router";

export default {
  components: {},
  data: () => ({
    fechaMin: "",
    minFecha: "",
    fechaElegida: null,
    nombreCategoria: null,
    nombreDeporte: null,
    tiposDisponibles: ['Entrenamiento, Citación'],
    tipoFecha: "",
    selectedTipoFecha: '', // Aquí almacenarás el valor seleccionado,
    idCat: 0,
    opciones: [
      { value: 'E', label: 'Entrenamiento' },
      { value: 'C', label: 'Citación' }],

    loading: true
  }),
  components: {
    Loading
  },
  async created() {


    const date = new Date()
    date.setDate(date.getDate());
    date.setFullYear(date.getFullYear() - 1)
    this.fechaMin = date.toISOString().slice(0, 10);

    this.idCat = this.$route.params.idCategoria,

      this.minFecha = new Date().toISOString().split('T')[0]

    if (!await verificarAutorizacionCategoria(this.idCat)) {
      this.$router.push("/unauthorized")
    }

    try {
      let nombreDeLaCategoria = await axios.get(`${apiUrl}/categoria/${this.idCat}/nombreCategoria`, { withCredentials: true });

      this.nombreCategoria = nombreDeLaCategoria.data.nombreCategoria

      let nombreDeporteBuscado = await axios.get(`${apiUrl}/categoria/${this.idCat}/nombreDeporte`, { withCredentials: true });

      this.nombreDeporte = nombreDeporteBuscado.data.nombreDeporte
    } catch(e) {
      alert(e.response.data.message)
      this.$router.go(-1)
    } finally {
      this.loading = false
    }
  },

  methods: {
    async ingresarFecha(event) {

      if (this.fechaElegida == null || this.selectedTipoFecha == '') {
        alert("Error, complete todos los campos")
      } else {

        this.loading = true

        event.preventDefault();


        if (this.selectedTipoFecha == "E") {
          let parametro = {
            idCategoria: this.idCat,
            fechaCalendario: this.fechaElegida,
            tipo: this.selectedTipoFecha
          };

          try {
            const result = await axios.post(`${apiUrl}/fecha/`, parametro, { withCredentials: true });

            if (result.status == 200) {
              this.$router.push({ path: `/fechasCategoria/${this.idCat}` });
            }





          } catch (e) {

            if (e.response && e.response.data && e.response.data.message) {
              alert(e.response.data.message)
            }
          } finally {
            this.loading = false
          }

        } else {

          try {

            let parametro = {
              idCategoria: this.idCat,
              fechaCalendario: this.fechaElegida,
            };

            const result = await axios.post(`${apiUrl}/fecha/citacionDisponible`, parametro, { withCredentials: true });

            if (result.status == 200) {
              this.$router.push({
                path: `/nuevaCitacion/${this.idCat}`,
                query: {
                  fecha: this.fechaElegida,
                  categoria: this.nombreCategoria,
                  deporte: this.nombreDeporte
                }
              });
            }
          } catch (e) {
            if (e.response && e.response.data && e.response.data.message) {
              alert(e.response.data.message)
            }
          } finally {
            this.loading = false
          }


        }


      }
    },
    confirmarFecha() {
      let fechaCorrecta = true;
      const fechaSeleccionada = new Date(this.fechaElegida);
      let diaDeHoy = new Date()

      if (fechaSeleccionada < diaDeHoy) {
        alert('No puedes seleccionar una fecha anterior a la fecha actual.');
        fechaCorrecta = false;
      }

      return fechaCorrecta;
    },

  },
};
</script>
<style scoped>
@import '../../../assets/btn.css';
</style>