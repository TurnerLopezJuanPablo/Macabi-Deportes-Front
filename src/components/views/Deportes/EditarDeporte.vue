<template>
    <Loading v-if="loading" />
    <div v-else class="container-fluid mt-2">
        <div class="row">
            <div class="col-md-6 offset-md-3" v-if="deporte">
                <div class="card bg-light text-dark mb-5" style="width: 100%;">
                    <div v-if="deporte" class="card-body">
                        <h4>Detalles del Deporte: <strong>{{ nombre }}</strong></h4>
                        <div>
                            <p>
                                <strong>Nombre: </strong><input type="text" class="form-control" v-model="deporte.nombre" />
                            </p>
                            <div class="d-flex justify-content-center mb-3">
                                <button class="btn btn-macabi1" @click="updateNombre">Actualizar Nombre</button>
                            </div>
                            <p>
                                <strong>Categorias asignadas: </strong>
                            </p>
                            <ul v-if="categoriasStore.getElements" class="list-group mt-1 mb-4 text-center"
                                style="font-size: x-large; max-height: 300px; overflow-y: auto;">
                                <li class="list-group text-dark" v-on:click="irA(categoria.idCategoria, 'detalleCategoria')"
                                    :class="[categoria.idCategoria == 0 ? 'list-group-item list-group-item-danger' : 'list-group-item list-group-item-action list-group-item-light']"
                                    v-for="categoria in categorias" :key="categoria.idCategoria">
                                    {{ categoria.nombreCategoria }}
                                </li>
                            </ul>
                            <div v-else>
                                <h6 class="alert-sm mb-0 text-center p-2 m-2 rounded mb-3">
                                    <strong>Deporte {{ nombre }} no posee categorías</strong>
                                </h6>
                            </div>
                            <div class="justify-content-center d-flex">
                                <button class="btn btn-success mb-3" data-bs-toggle="modal"
                                    data-bs-target="#categoriaModal">Agregar Categoria</button>
                            </div>
                            <p>
                                <strong>Coordinadores: </strong>
                            </p>
                            <table class="table table-bordered table-hover" v-if="coordinadores != 0">
                                <thead>
                                    <tr>
                                        <th>Nombre:</th>
                                        <th>Apellido:</th>
                                        <th class="d-none d-sm-table-cell">DNI:</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="coordinador in coordinadores" :key="coordinador.idUsuario"
                                        @click="irA(coordinador.idUsuario, 'usuarios')">
                                        <td class="td-custom">{{ coordinador.nombre }}</td>
                                        <td class="td-custom">{{ coordinador.apellido }}</td>
                                        <td class="d-none d-sm-table-cell td-custom">{{ coordinador.dni }}</td>
                                    </tr>
                                </tbody>
                            </table>
                            <div v-else>
                                <h6 class="alert-sm mb-0 text-center p-2 m-2 rounded mb-3">
                                    <strong>Deporte {{ nombre }} no posee coordinadores asigados</strong>
                                </h6>
                            </div>
                            <div class="justify-content-center d-flex">
                                <button class="btn btn-success mb-3" @click="agregarCoordinador" data-bs-toggle="modal"
                                    data-bs-target="#myModal2">
                                    Editar Coordinadores
                                </button>
                            </div>
                            <div class="d-flex justify-content-center">
                                <button class="btn btn-danger" @click="confirmarEliminarDeporte">Borrar Deporte</button>
                            </div>
                            <h5 class="alert alert-danger alert-sm mb-0 text-center m-2 mb-3" v-if="message != null">
                                <strong>{{ message }}</strong>
                            </h5>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-6 offset-md-3 mb-4" v-else>
                <div class="card fondo-card">
                    <div class="card-body" style="border-radius: 10px;">
                        <h5 class="fw-bold text-center">No se encontró el deporte</h5>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div v-if="!loading" class="d-flex justify-content-center mb-5">
        <button type="button" @click="router.go(-1)" class="btn btn-dark" href="#">Volver</button>
    </div>
    <br>
    <!--MODAL / MODAL / MODAL / MODAL / MODAL / MODAL / MODAL / MODAL / MODAL / MODAL / MODAL / MODAL / MODAL / MODAL / MODAL / -->
    <div class="modal fade" id="categoriaModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">Crear Categoría</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <p class="p pe-3">
                        <strong>Nombre: <code>*</code></strong><input type="text" class="form-control"
                            v-model="nombreCategoria" />
                    </p>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-macabi1" @click="crearCategoria">Crear</button>
                    <button type="button" class="btn btn-danger" data-bs-dismiss="modal">Cerrar</button>
                    <div class="text-start"><code>*campos obligatorios</code></div>
                </div>
            </div>
            <h5 v-if="messageModal != null" class="alert alert-danger alert-sm mb-0 text-center m-2 mb-3">
                <strong>{{ messageModal }}</strong>
            </h5>
        </div>
    </div>
    <!--MODAL 2 / MODAL 2 / MODAL 2 / MODAL 2 / MODAL 2 / MODAL 2 / MODAL 2 / MODAL 2 / MODAL 2 / MODAL 2 / MODAL 2 / MODAL 2 / -->
    <div class="modal fade" id="myModal2" tabindex="-1" aria-labelledby="exampleModalLabel2" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel2">Seleccionar Coordinadores</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div v-for="coordinador in coordinadoresModal" :key="coordinador.idUsuario">
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" :value="coordinador.idUsuario"
                                :checked="isChecked(coordinador.idUsuario)">
                            <label class="form-check-label" for="exampleCheckbox1">
                                <p class="h6"> {{ coordinador.nombre }}, {{ coordinador.apellido }} | DNI: {{
                                    coordinador.dni }}</p>
                            </label>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-macabi1" @click="saveSelectedCoordinadores">Guardar</button>
                    <button type="button" class="btn btn-danger" data-bs-dismiss="modal">Cerrar</button>
                </div>
            </div>
        </div>
    </div>
</template>
<style scoped>
@import "../../../assets/btn.css";

h6 {
    background-color: #f8d7da;
    border-color: #f0959e;
    color: #723b47;
    border-width: 1px;
    border-style: solid;
    border-radius: 4px;
    padding: 8px;
}
</style>
<script>
import { useElementStore } from "../../../utils/Store";
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";
import apiUrl from '../../../../config/config.js';
import Loading from "../../dependentComponents/Loading.vue";


export default {
    setup() {
        const categoriasStore = useElementStore("categorias")()
        const deporteStore = useElementStore("deportes")()
        const usuariosStore = useElementStore("usuarios")()

        const route = useRoute()
        const router = useRouter()

        const idDeporte = route.params.id
        const nombre = ref(null)
        const loading = ref(true)

        onMounted(async () => {
            categoriasStore.deleteElements()

            await deporteStore.fetchElementById(`${apiUrl}/deporte/`, idDeporte)
            await deporteStore.fetchElements(`${apiUrl}/deporte/getAll`)
            await categoriasStore.fetchElements(`${apiUrl}/categoria/${idDeporte}/deporte`)
            await usuariosStore.fetchElements(`${apiUrl}/deporte/${idDeporte}/coordinadores`)
            loading.value = false
            data.value;

        });

        const categorias = ref(null)
        const deporte = ref(null)
        const deportes = ref(null)
        const coordinadores = ref(null)

        const message = ref(null);

        const data = computed(() => {
            if (deporteStore.currentElement != null) {
                deporte.value = deporteStore.currentElement.result;

                if (categoriasStore.getElements !== null) {
                    categorias.value = categoriasStore.getElements.result

                    if (categorias.value) {
                        categorias.value.sort((a, b) => comparar(a, b, 'nombreCategoria'));
                    }

                } else {
                    categorias.value = []
                }

                coordinadores.value = usuariosStore.getElements.result.CoordinadoresAsignados

                if (coordinadores.value) {
                    coordinadores.value.sort((a, b) => comparar(a, b, 'nombre'));
                }

                deportes.value = deporteStore.getElements.result.filter(deporte => deporte.idDeporte != idDeporte)
                nombre.value = deporte.value.nombre
            }
        });

        const comparar = (a, b, columna) => {
            const valorA = String(a[columna]).toLowerCase();
            const valorB = String(b[columna]).toLowerCase();

            return valorA.localeCompare(valorB);
        };

        function obtenerCoordinador(idUsuario) {
            const usuarioEncontrado = usuariosStore.getElements.result.find((usuario) => usuario.idUsuario === idUsuario);

            if (usuarioEncontrado) { return usuarioEncontrado; } else { return "Nombre no encontrado"; }
        }

        const updateNombre = async () => {
            if (validarNombre() && deporteStore.confirm("modificar", "modificado", "nombre del Deporte")) {
                loading.value = true
                const deporteMod = JSON.parse(JSON.stringify(deporteStore.currentElement.result))
                deporteStore.updateElement(`${apiUrl}/deporte/`, deporteMod, "idDeporte")
                router.go(-1)
            }
        }

        function validarNombre() {
            let resultado = false

            const nombreDuplicado = deportes.value.some((deporte2) => deporte2.nombre == deporte.value.nombre);

            if (String(deporte.value.nombre).length < 2 || String(deporte.value.nombre).length > 24) {
                alert("El nombre debe tener un minimo de 2 caracteres y un maximo de 24.")
            } else if (nombreDuplicado) {
                alert("El nombre no se puede repetir")
            } else {
                resultado = true
            }

            return resultado
        }

        const coordinadoresModal = ref(null)

        const agregarCoordinador = async () => {
            const coordinadoresStore = useElementStore("coordinadores")()
            await coordinadoresStore.fetchElements(`${apiUrl}/usuario/2/rol/activos`)
            coordinadoresModal.value = coordinadoresStore.getElements.result
        }

        function saveSelectedCoordinadores() {
            const checkboxes = document.querySelectorAll('input[type="checkbox"]');
            const valoresSeleccionados = [];

            checkboxes.forEach((checkbox) => {
                if (checkbox.checked) {
                    valoresSeleccionados.push(checkbox.value);
                }
            });

            const nuevosCoordinadores = [];

            coordinadoresModal.value.forEach((coordinador) => {
                if (valoresSeleccionados.includes(coordinador.idUsuario.toString())) {
                    nuevosCoordinadores.push(coordinador);
                }
            });

            if (usuariosStore.confirm("modificar", "modificado", "Coordinador/es")) {
                coordinadores.value = nuevosCoordinadores;
                updateCoordinadores()
            }
        }

        async function updateCoordinadores() {
            loading.value = true

            await usuariosStore.deleteElement(`${apiUrl}/deporte/`, idDeporte);

            const usuarios = { idUsuarios: [] }
            for (const coordinador of coordinadores.value) {
                usuarios.idUsuarios.push(coordinador.idUsuario);
            }

            try {
                await axios.post(`${apiUrl}/deporte/${idDeporte}/agregarCoordinadores`, usuarios,)
            } catch (error) {
                console.log("error", error)
            } finally {
                location.reload()
            }
        }

        function isChecked(id) {
            let checked = false

            if (coordinadores.value) {
                checked = coordinadores.value.some(coordinador => coordinador.idUsuario == id);
            }

            return checked
        }

        function irA(id, route) {
            if (id != 0) {
                router.push(`/${route}/${id}`);
            }
        }

        const nombreCategoria = ref(null)
        const messageModal = ref(null);

        async function crearCategoria() {
            const nuevaCategoria = {
                nombreCategoria: nombreCategoria.value,
                idDeporte: idDeporte,
            };

            loading.value = true

            try {
                const response = await axios.post(apiUrl + '/categoria', nuevaCategoria, { withCredentials: true });
                alert("Categoria creada con éxito")
                location.reload()
            } catch (error) {
                const msj = error.response.data.message
                if (msj != "Los IDs de Usuarios estan en un formato Incorrecto") {
                    messageModal.value = msj;
                } else {
                    location.reload()
                }
            } finally {
                loading.value = false
            }
        }

        const deleteDeporte = async () => {
            try {
                await deporteStore.deleteElement(
                    apiUrl,
                    "deporte/" + idDeporte + "/eliminarDeporte"
                );
                alert("Deporte eliminado con éxito");
                location.reload()
            } catch (error) {
                console.error("Error al eliminar el deporte:", error);
            }
        };

        const confirmarEliminarDeporte = () => {
            const mensaje = `¿Estás seguro de eliminar el deporte: "${nombre.value}"?`;
            if (window.confirm(mensaje)) {
                deleteDeporte();
            } else {
                console.log("Operación de eliminación cancelada.");
            }
        };

        return {
            categoriasStore,
            deporteStore,
            usuariosStore,
            deleteDeporte,
            obtenerCoordinador,
            deporte,
            categorias,
            coordinadores,
            agregarCoordinador,
            updateNombre,
            message,
            coordinadoresModal,
            saveSelectedCoordinadores,
            isChecked,
            irA,
            nombre,
            nombreCategoria,
            crearCategoria,
            messageModal,
            categoriasStore,
            confirmarEliminarDeporte,
            router,
            loading
        }
    },
    components: {
        Loading
    }
}
</script>