<template>
    <Loading v-if="loading" />
    <div v-else class="container-fluid">
        <div class="row">
            <div class="col-md-6 offset-md-3" v-if="socio">
                <h3 class="text-center">Detalles del Socio: <strong>{{ socio.apellido }}, {{ socio.nombre }}</strong></h3>
                <br>
                <div class="card bg-light text-dark mb-4">
                    <div v-if="socio" class="card-body">
                        <div>
                            <p>
                            <p class="mb-2"><strong>Número de Socio:</strong> {{ socio.nroSocio }}</p>
                            <p class="mb-2"><strong>DNI:</strong> {{ socio.dni }}</p>
                            <p class="mb-2"><strong>Email:</strong> {{ socio.email }}</p>
                            <p class="mb-2"><strong>Teléfono:</strong> {{ socio.telefono }}</p>
                            <p class="mb-2"><strong>Dirección:</strong> {{ socio.direccion }}</p>
                            <p class="mb-2"><strong class="font-weight-bold">Edad: </strong>{{
                                utils.obtenerEdadXFecha(socio.fechaNacimiento) }}</p>
                            <p class="mb-2"><strong class="font-weight-bold">Fecha de nacimiento: </strong>{{
                                utils.obtenerFechaFormateada(socio.fechaNacimiento) }}</p>
                            </p>
                            <hr>
                            <p>
                                <strong class="h5 fw-bold">Observaciones: </strong>
                                <textarea style="height: 200px; max-height: 200px;" disabled class="form-control mt-2"
                                    v-model="socio.observaciones"></textarea>
                            </p>
                            <hr>
                            <p class="p pe-3">
                                <strong class="h5 fw-bold">Datos de contacto: </strong>
                            </p>
                            <div v-if="infoContactos == null" class="p px-2">
                                <h6 class="alert-sm mb-0 text-center p-2 m-2 rounded mb-3">
                                    <strong>{{ socio.nombre }} no posee datos de contacto</strong>
                                </h6>
                            </div>
                            <div v-else class="card mb-2" style="background-color: rgb(236, 236, 236);"
                                v-for="contacto in infoContactos">
                                <div class="card-body">
                                    <h5 class="text-center"><strong>{{ contacto.nombre }} {{ contacto.apellido }}</strong>
                                    </h5>
                                    <p class="p pe-3 mb-2 mt-4">
                                        <strong>Email: </strong>{{ contacto.email }}
                                    </p>
                                    <p class="p pe-3 mb-2">
                                        <strong>Teléfono: </strong>{{ contacto.telefono }}
                                    </p>
                                </div>
                            </div>

                            <hr>
                            <p>
                                <strong class="h5 fw-bold">Categorias asociadas: </strong>
                            </p>
                            <table class="table table-bordered" v-if="categorias.length != 0">
                                <thead style="background-color: rgb(255, 255, 255);">
                                    <tr>
                                        <th>Categoria:</th>
                                        <th>Deporte:</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="categoria in categorias" :key="categoria.idCategoria">
                                        <td class="tablaHoover" @click="irA(categoria.idCategoria, 'detalleCategoria')">{{
                                            categoria.nombreCategoria }}</td>
                                        <td class="tablaHoover" @click="irA(categoria.idDeporte, 'detalleDeporte')">{{
                                            obtenerNombreDeporte(categoria.idDeporte) }}</td>
                                    </tr>
                                </tbody>
                            </table>
                            <div v-else class="p px-2">
                                <h6 class="alert-sm mb-0 text-center p-2 m-2 rounded mb-3">
                                    <strong>{{ socio.nombre }} no posee cateogorías asignadas</strong>
                                </h6>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-6 offset-md-3 mb-4" v-if="!socio">
                <div class="card fondo-card">
                    <div class="card-body" style="border-radius: 10px;">
                        <h5 class="fw-bold text-center">No se encontró el socio</h5>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div v-if="!loading" class="d-flex justify-content-center align-items-center mb-5">
        <div class="btn-group">
            <button v-if="socio" @click="editarSocio" class="btn btn-macabi1">Modificar socio</button>
            <button class="btn btn-dark" @click="volver()">Volver</button>
        </div>
    </div>
</template>
<style scoped>
@import '../../../assets/btn.css';

tbody {
    cursor: pointer;
}

h6 {
    background-color: #f8d7da;
    border-color: #f0959e;
    color: #723b47;
    border-width: 1px;
    border-style: solid;
    border-radius: 4px;
    padding: 8px;
}

.tablaHoover:hover {
    background-color: rgb(230, 230, 230)
}
</style>
<script>
import { useElementStore } from '../../../utils/Store';
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import apiUrl from '../../../../config/config.js'
import { Utils } from "../../../utils/utils"
import Loading from '../../dependentComponents/Loading.vue';

export default {
    setup() {
        const sociosStore = useElementStore("socios")()
        const deporteStore = useElementStore("deportes")()
        const categoriasStore = useElementStore("categorias")()
        const utils = new Utils()
        const route = useRoute()
        const router = useRouter()
        const idSocio = route.params.id

        const loading = ref(true)

        onMounted(async () => {
            await sociosStore.fetchElementById(`${apiUrl}/socio/`, idSocio)
            await deporteStore.fetchElements(`${apiUrl}/deporte/getAll`)
            await categoriasStore.fetchElementById(`${apiUrl}/sociosXCategoria/categorias`, idSocio)
            data.value;
            loading.value = false
        })

        const socio = ref(null)
        const infoContactos = ref(null)
        const deporte = ref(null)
        const categorias = ref(null)

        const data = computed(() => {
            if (sociosStore.currentElement != null) {
                socio.value = sociosStore.currentElement.result;

                if (socio.value.InfoContactos.length != 0) {
                    infoContactos.value = socio.value.InfoContactos
                }
            }

            if (categoriasStore.currentElement != null) {
                categorias.value = categoriasStore.currentElement.categorias
            }

            if (deporteStore.getElements != null) {
                deporte.value = deporteStore.getElements.result
            }
        });

        function obtenerNombreDeporte(idDeporte) {
            const deporteEncontrado = deporteStore.getWithKeyValue("idDeporte", idDeporte)

            if (deporteEncontrado) { return deporteEncontrado.nombre; } else { return "Nombre no encontrado"; }
        }

        function deleteSocio() {
            alert("not implemented")
        }

        const updateSocio = async () => {
            alert("not implemented")
        };

        function volver() {
            router.go(-1)
        }

        function irA(id, route) {
            router.push(`/${route}/${id}`)
        }

        return {
            socio,
            sociosStore,
            updateSocio,
            deleteSocio,
            infoContactos,
            categorias,
            obtenerNombreDeporte,
            utils,
            volver,
            irA,
            loading
        }
    },
    data() {
        return {
            agregarFecha: "Agregar nueva fecha",
        };
    }, methods: {
        editarSocio() {
            const idSocio = this.$route.params.id
            this.$router.push({ path: "/socios/update/" + idSocio });
        }
    },
    components: {
        Loading
    }
}
</script>