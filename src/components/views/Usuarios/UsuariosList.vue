<template>
  <Loading v-if="loading" />
  <div v-else class="container-fluid px-3 px-lg-5 mb-5">
    <div class="text text-center h1">{{ txtTitle }}</div>
    <br>
    <form @submit.prevent="buscar()">
      <div class="row g-2">
        <div class="col-12 col-md-auto">
          <select id="filtro" class="form-select" style="cursor: pointer;">
            <option disabled>Filtrar por:</option>
            <option value="nombre">Nombre</option>
            <option value="apellido">Apellido</option>
            <option value="email">Mail</option>
            <option value="dni">Dni</option>
          </select>
        </div>
        <div class="col-12 col-md-auto">
          <input type="text" class="form-control" placeholder="Buscar..." v-model="busqueda">
        </div>
        <div class="col-12 col-md-auto" v-if="usuarioStore.getRol == 'A'">
          <button class="btn btn-macabi1 mb-1 px-3" type="button" data-bs-toggle="collapse"
            data-bs-target="#checkboxesCollapse" aria-expanded="true" aria-controls="checkboxesCollapse">
            Filtro por ROL
          </button>
          <div id="checkboxesCollapse" class="accordion-collapse collapse" aria-labelledby="headingOne"
            data-bs-parent="#checkboxAccordion">
            <div class="accordion-body my-1">
              <input type="checkbox" id="admin" name="A" value="A" v-model="checkboxes"
                class="form-check-input form-check-input-sm mx-1" style="cursor: pointer;">
              <label for="Administrador" class="form-check-label">Administrador</label><br>
              <input type="checkbox" id="coordinador" name="C" value="C" v-model="checkboxes"
                class="form-check-input form-check-input-sm mx-1" style="cursor: pointer;">
              <label for="Coordinador" class="form-check-label">Coordinador</label><br>
              <input type="checkbox" id="profesor" name="P" value="P" v-model="checkboxes"
                class="form-check-input form-check-input-sm mx-1" style="cursor: pointer;">
              <label for="Profesor" class="form-check-label">Profesor</label>
            </div>
          </div>
        </div>
        <div class="col-12 col-md-auto">
          <div class="btn-group d-flex justify-content-center mx-md-0" style="margin: 0% 40%;">
            <button class="btn btn-danger text-center" type="button" v-on:click="reiniciar">Reiniciar</button>
            <button class="btn btn-success text-center" type="button" v-on:click="buscar">Buscar</button>
          </div>
        </div>
        <div class="col text-md-end">
          <div class="d-flex justify-content-end mt-3 mb-0">
            <p>Usuarios encontrados: <strong>{{ size }}</strong></p>
          </div>
        </div>
      </div>
    </form>
    <div class="d-flex justify-content-center align-items-center mt-2">
      <button type="button" class="btn btn-success" data-bs-toggle="collapse" data-bs-target="#demo">Ayuda</button>
    </div>
    <div id="demo" class="collapse">
      <code><strong>"Click"</strong> en los botones verdes para ordenar las columnas por orden <strong>ASCENDENTE</strong> o <strong>DESCENDENTE</strong></code>
    </div>
    <div class="text-end mt-3 mt-lg-0" v-if="column">
      <strong>Orden: </strong>
      <p v-if="!orden" class="d-inline">{{ column }} - Ascendente</p>
      <p v-else class="d-inline">{{ column }} - Descendente</p>
    </div>
    <br v-if="!column">
    <div class="d-flex justify-content-end input-group" v-if="usuarios">
      <table class="table table-bordered table-hover">
        <thead>
          <tr>
            <th>
              <div class="d-flex flex-column flex-md-row align-items-center">
                <span>Nombre:</span>
                <button class="button-list ms-2" @click="ordenar('nombre')"></button>
              </div>
            </th>
            <th>
              <div class="d-flex flex-column flex-md-row align-items-center">
                <span>Apellido:</span>
                <button class="button-list ms-2" @click="ordenar('apellido')"></button>
              </div>
            </th>
            <th class="d-none d-sm-table-cell">
              <div class="d-flex flex-column flex-md-row align-items-center">
                <span>Email:</span>
                <button class="button-list ms-2" @click="ordenar('email')"></button>
              </div>
            </th>
            <th class="d-none d-sm-table-cell">
              <div class="d-flex flex-column flex-md-row align-items-center">
                <span>Dni:</span>
                <button class="button-list ms-2" @click="ordenar('dni')"></button>
              </div>
            </th>
            <th class="d-none d-md-table-cell" v-if="mostrar">Rol:</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in usuarios" :key="user.idUsuario" @click="irA(user.idUsuario)"
            :class="{ 'table-danger': !user.activo }">
            <td class="td-custom">{{ user.nombre }}</td>
            <td class="td-custom">{{ user.apellido }}</td>
            <td class="d-none d-sm-table-cell td-custom2">{{ user.email }}</td>
            <td class="d-none d-sm-table-cell"> {{ user.dni }}</td>
            <td class="d-none d-md-table-cell" v-if="mostrar"> {{ obtenerRol(user.Rol.tipo) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="d-flex justify-content-between my-3">
      <p class="pe-5" v-if="elementStore.getElements">Usuarios en total: <strong>{{ elementStore.getElements.length
      }}</strong></p>
      <code>Si se encuentra en rojo, el usuario no está activo</code>
    </div>
    <div class="d-flex justify-content-center align-items-center">
      <div class="btn-group">
        <button class="btn btn-macabi1">
          <router-link to="/crearusuario" class="nav-item nav-link" href="#">Crear Usuario</router-link>
        </button>
        <button class="btn btn-dark">
          <router-link to="/" class="nav-item nav-link" href="#">Volver a Inicio</router-link>
        </button>
      </div>
    </div>
  </div>
  <br>
</template>
<style scoped>
@import '../../../assets/btn.css';
</style>
<script>
import { useElementStore } from "../../../stores/Store";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import Loading from '../../dependentComponents/Loading.vue';
import { usrStore } from "../../../stores/usrStore";

export default
  {
    components: {
      Loading,
    },
    setup() {
      const elementStore = useElementStore("usuario")()
      let busqueda = ""
      const usuarios = ref(null)
      const router = useRouter();
      const loading = ref(true)

      const txtTitle = ref('USUARIOS')
      const mostrar = ref(true)

      const size = ref(0)

      const usuarioStore = usrStore()

      onMounted(() => {
        elementStore.currentElement = null
        elementStore.fetchElements().then(() => {
        }).then(() => {
          if (usuarioStore.getRol == 'C') {
            elementStore.setElements(elementStore.getElements.filter((usuario) => usuario.Rol.tipo == 'P'))
            mostrar.value = false
            txtTitle.value = 'PROFESORES'
          }

          usuarios.value = elementStore.getElements

        }).then(() => {
          size.value = usuarios.value.length || 0
          loading.value = false
        })

      })
      const checkboxes = ref(['P', 'C', 'A'])

      function buscar() {
        reiniciar();
        busqueda = this.busqueda;

        if (busqueda !== "") {
          usuarios.value = elementStore.getElements.filter(item => {
            const propiedad = item[document.getElementById("filtro").value];
            const propiedadLowerCase = String(propiedad).toLowerCase();
            const busquedaLowerCase = String(busqueda).toLowerCase();
            return propiedadLowerCase.includes(busquedaLowerCase) && checkboxes.value.some(rol => item.Rol.tipo.includes(rol));
          });
        } else {
          usuarios.value = elementStore.getElements.filter(item => {
            return checkboxes.value.some(rol => item.Rol.tipo.includes(rol));
          });
        }

        const rolesMap = {
          'P': 'Profesores',
          'A': 'Administradores',
          'C': 'Coordinadores'
        };

        let msjCheckboxes = ''

        if (checkboxes.value.length === 3) {
          msjCheckboxes = 'Usuarios';
        } else if (checkboxes.value.length > 0) {
          msjCheckboxes = checkboxes.value.map(rol => rolesMap[rol]).join(', ');
        }

        size.value = usuarios.value.length || 0;

        if (size.value == 0) {
          if (busqueda !== "") {
            alert(`No se encontraron "${msjCheckboxes}" con el filtro: "${document.getElementById("filtro").value}" y con la búsqueda: "${busqueda}"`)
          }
          reiniciar()
        }
      }

      function reiniciar() {
        usuarios.value = elementStore.getElements
        size.value = usuarios.value.length || 0
      }

      const orden = ref(true)
      const column = ref(null)

      function ordenar(columna) {
        orden.value = !orden.value;
        column.value = columna.toUpperCase()

        const comparar = (a, b) => {
          const factorOrden = orden.value ? -1 : 1;
          const valorA = typeof a[columna] === 'number' ? a[columna] : a[columna].toLowerCase();
          const valorB = typeof b[columna] === 'number' ? b[columna] : b[columna].toLowerCase();

          if (valorA < valorB) return -1 * factorOrden;
          if (valorA > valorB) return 1 * factorOrden;
          return 0;
        };

        usuarios.value.sort(comparar);
      }


      function irA(id) {
        if (id != 0) {
          router.push(`/usuarios/${id}`);
        }
      }

      function obtenerRol(rol) {
        if (rol != null || rol != '') {
          if (rol == 'A') {
            return 'Administrador'
          } else if (rol == 'C') {
            return 'Coordinador'
          } else if (rol == 'P') {
            return 'Profesor'
          }
        } else {
          return 'Rol desconocido'
        }
      }

      return {
        elementStore,
        usuarios,
        buscar,
        busqueda,
        reiniciar,
        size,
        ordenar,
        irA,
        checkboxes,
        obtenerRol,
        loading,
        Loading,
        usuarioStore,
        orden,
        column,
        txtTitle,
        mostrar
      }
    },
  }
</script>