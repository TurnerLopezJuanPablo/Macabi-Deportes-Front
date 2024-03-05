<template>
    <Loading v-if="loading" />
    <div v-else class="container-fluid px-3 px-lg-5 mb-5">
        <div v-if="sociosStore.getElements != null">
            <div class="text text-center h1">SOCIOS</div>
            <br>
            <form @submit.prevent="buscar()">
                <div class="row g-2">
                    <div class="col-12 col-md-auto">
                        <select id="filtro" class="form-select" style="cursor: pointer;">
                            <option disabled>Filtrar por:</option>
                            <option value="nroSocio">Número de Socio</option>
                            <option selected value="nombre">Nombre</option>
                            <option value="apellido">Apellido</option>
                            <option value="dni">Dni</option>
                            <option value="email">Mail</option>
                        </select>
                    </div>
                    <div class="col-12 col-md-auto">
                        <input type="text" class="form-control" placeholder="Buscar..." v-model="busqueda">
                    </div>
                    <div class="col-12 col-md-auto">
                        <div class="btn-group d-flex justify-content-center mx-md-0" style="margin: 0% 40%;">
                            <button class="btn btn-danger text-center" type="button"
                                v-on:click="reiniciar">Reiniciar</button>
                            <button class="btn btn-success text-center" type="button" v-on:click="buscar">Buscar</button>
                        </div>
                    </div>
                    <div class="col text-md-end">
                        <div class="d-flex justify-content-end mt-3 mb-0">
                            <p>Socios encontrados: <strong>{{ size }}</strong></p>
                        </div>
                    </div>
                </div>
            </form>
            <div class="d-flex justify-content-center align-items-center mt-2">
                <button type="button" class="btn btn-success" data-bs-toggle="collapse"
                    data-bs-target="#demo">Ayuda</button>
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
            <div v-if="sociosStore.getElements != null || size > 0">
                <table class="table table-bordered table-hover">
                    <thead>
                        <tr>
                            <th class="d-none d-sm-table-cell">
                                <div class="d-flex flex-column flex-md-row align-items-center">
                                    <span>NroSocio:</span>
                                    <button class="button-list ms-2" @click="ordenar('nroSocio')"></button>
                                </div>
                            </th>
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
                                    <span>Dni:</span>
                                    <button class="button-list ms-2" @click="ordenar('dni')"></button>
                                </div>
                            </th>
                            <th class="d-none d-lg-table-cell">
                                <div class="d-flex flex-column flex-md-row align-items-center">
                                    <span>Email:</span>
                                    <button class="button-list ms-2" @click="ordenar('email')"></button>
                                </div>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="socio in socios" :key="socio.idSocio" @click="irA(socio.idSocio)">
                            <td class="d-none d-sm-table-cell td-custom">{{ socio.nroSocio }}</td>
                            <td class="td-custom">{{ socio.nombre }}</td>
                            <td class="td-custom">{{ socio.apellido }}</td>
                            <td class="d-none d-sm-table-cell">{{ socio.dni }}</td>
                            <td class="d-none d-lg-table-cell td-custom2">{{ socio.email }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <h5 v-else class="alert alert-warning alert-sm mb-0 text-center m-2 mb-3">
            <strong>No hay Socios cargados :c</strong>
        </h5>
        <div class="mt-3 d-flex justify-content-between mb-2" v-if="sociosStore.getElements">
            <p class="pe-5">Socios en total: <strong>{{ sociosStore.getElements.result.length }}</strong></p>
            <code v-if="size == 0">* Los socios se mostrarán a medida que se busquen con los filtros</code>
        </div>
        <div class="d-flex justify-content-center align-items-center">
            <div class="btn-group">
                <button class="btn btn-macabi1">
                    <router-link to="/registrarSocio" class="nav-item nav-link" href="#">Crear Socio</router-link>
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
import { useElementStore } from '../../../utils/Store';
import { onBeforeMount, ref } from "vue";
import { useRouter } from "vue-router";
import apiUrl from '../../../../config/config.js'
import Loading from '../../dependentComponents/Loading.vue';

export default {
    components: {
        Loading,
    },
    setup() {
        const sociosStore = useElementStore("socio")()
        const size = ref(0)
        const socios = ref(null)
        const errorFiltro = ref(false)
        let filtro = ""
        let busqueda = ""
        const router = useRouter();

        const loading = ref(true)

        onBeforeMount(async () => { fetchs() })

        async function fetchs() {
            await sociosStore.fetchElements(`${apiUrl}/socio/getAll`)
                .then(() => {
                    loading.value = false
                })
        }

        function buscar() {
            reiniciar();
            busqueda = this.busqueda;

            if (busqueda !== "") {
                filtro = document.getElementById("filtro").value;
                socios.value = sociosStore.getElements.result.filter(item => {
                    const propiedad = item[filtro];
                    const propiedadLowerCase = String(propiedad).toLowerCase();
                    const busquedaLowerCase = String(busqueda).toLowerCase();
                    return propiedadLowerCase.includes(busquedaLowerCase);
                });

                size.value = socios.value.length || 0;

                if (size.value == 0) {
                    if (busqueda !== "") {
                        alert(`No se encontraron socios con el filtro: "${document.getElementById("filtro").value}" y con la búsqueda: "${busqueda}"`)
                    }
                    reiniciar()
                }
            } else {
                size.value = 0;
            }
        }


        function reiniciar() {
            socios.value = null
            size.value = 0
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

            if (size.value != 0) {
                socios.value.sort(comparar);
            }
        }

        function irA(id) {
            if (id != 0) {
                router.push(`/socios/${id}`);
            }
        }

        return {
            sociosStore,
            size,
            socios,
            reiniciar,
            busqueda,
            errorFiltro,
            ordenar,
            buscar,
            irA,
            loading,
            Loading,
            orden,
            column
        }
    }

}
</script>