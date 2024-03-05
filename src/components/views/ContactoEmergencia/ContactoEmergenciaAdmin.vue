<template>
    <loading v-if="loading" />
    <div v-else class="container-fluid">
        <div class="row">
            <div class="col-md-6 offset-md-3" v-if="contactosEmergencia != null">
                <h3 class="text-center"><strong>MODIFICAR CONTACTOS DE EMERGENCIA</strong></h3>
                <div class="text-end mb-1"><code>*campos obligatorios</code></div>
                <div class="card bg-light text-dark mt-3 ms-3 me-0 mb-3" v-for="contacto in contactosEmergencia" :key="contacto.idContactoEmergencia">
                    <div class="card-body">
                        <h4 class="mb-3">Detalles del Contacto: <strong>{{ obtenerNombre(contacto.idContactoEmergencia)
                        }}</strong></h4>
                        <div>
                            <p class="p pe-2 ps-2">
                                <strong>Nombre: <code>*</code></strong><input type="text" class="form-control"
                                    v-model="contacto.nombre" />
                            </p>
                            <h6 class="alert-sm mb-0 text-center p-2 m-2 rounded mb-3"
                                v-if="validarNombre(contacto.nombre) !== null">
                                <strong>{{ validarNombre(contacto.nombre) }}</strong>
                            </h6>
                            <p class="p pe-2 ps-2">
                                <strong>Email: </strong><input type="email" class="form-control" v-model="contacto.email" />
                            </p>
                            <h6 class="alert-sm mb-0 text-center p-2 m-2 rounded mb-3"
                                v-if="validarMail(contacto.email) !== null">
                                <strong>{{ validarMail(contacto.email) }}</strong>
                            </h6>
                            <p class="p pe-2 ps-2">
                                <strong>Telefono: </strong><input type="number" class="form-control"
                                    v-model="contacto.telefono" />
                            </p>
                            <h6 class="alert-sm mb-0 text-center p-2 m-2 rounded mb-3"
                                v-if="validarTelefono(contacto.telefono) !== null">
                                <strong>{{ validarTelefono(contacto.telefono) }}</strong>
                            </h6>
                            <p class="p pe-2 ps-2">
                                <strong>Observaciones: </strong>
                                <textarea style="height: 100px; max-height: 200px;" class="form-control"
                                    v-model="contacto.observaciones"></textarea>
                            </p>
                            <h6 class="alert-sm mb-0 text-center p-2 m-2 rounded mb-3"
                                v-if="validarObservaciones(contacto.observaciones) !== null">
                                <strong>{{ validarObservaciones(contacto.observaciones) }}</strong>
                            </h6>
                            <div class="d-flex justify-content-center">
                                <div class="btn-group">
                                    <button class="btn btn-macabi1" @click="updateContactoEmergencia(contacto)">Actualizar
                                        Contacto</button>
                                    <button class="btn btn-danger" @click="deleteContactoEmergencia(contacto)">Borrar
                                        Contacto</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-6 offset-md-3" v-if="contactosEmergencia == null">
                <div class="card fondo-card">
                    <div class="card-body" style="border-radius: 10px;">
                        <h5 class="fw-bold text-center">No se encontraron contactos de emergencia</h5>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div v-if="!loading" class="d-flex justify-content-center ms-3 mt-3 mb-5">
        <div class="btn-group">
            <button class="btn btn-success" data-bs-toggle="modal" data-bs-target="#myModal">Agregar
                Contacto</button>
            <button class="btn btn-dark"><router-link to="/contactosEmergencia" class="nav-item nav-link" href="#">Volver a
                    Contactos</router-link></button>
        </div>
    </div>
    <br>
    <!--MODAL / MODAL / MODAL / MODAL / MODAL / MODAL / MODAL / MODAL / MODAL / MODAL / MODAL / MODAL / MODAL / MODAL / MODAL / -->
    <div class="modal fade" id="myModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">Crear Contacto de Emergencia</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <p class="p pe-3">
                        <strong>Nombre: <code>*</code></strong><input type="text" class="form-control"
                            v-model="contactoCreate.nombre" />
                    </p>
                    <h6 class="alert-sm mb-0 text-center p-2 m-2 rounded mb-3" v-if="errorNombre !== null">
                        <strong>{{ errorNombre }}</strong>
                    </h6>
                    <p class="p pe-3">
                        <strong>Email: </strong><input type="text" class="form-control" v-model="contactoCreate.email" />
                    </p>
                    <h6 class="alert-sm mb-0 text-center p-2 m-2 rounded mb-3" v-if="errorMail !== null">
                        <strong>{{ errorMail }}</strong>
                    </h6>
                    <p class="p pe-3">
                        <strong>Teléfono: </strong><input type="number" min="0" class="form-control"
                            v-model="contactoCreate.telefono" />
                    </p>
                    <h6 class="alert-sm mb-0 text-center p-2 m-2 rounded mb-3" v-if="errorTelefono !== null">
                        <strong>{{ errorTelefono }}</strong>
                    </h6>
                    <p class="p pe-3">
                        <strong>Observaciones: </strong>
                        <textarea style="height: 100px; max-height: 200px;" class="form-control"
                            v-model="contactoCreate.observaciones"></textarea>
                    </p>
                    <h6 class="alert-sm mb-0 text-center p-2 m-2 rounded mb-3" v-if="errorObservaciones !== null">
                        <strong>{{ errorObservaciones }}</strong>
                    </h6>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-macabi1" @click="crearContactoEmergencia">Crear</button>
                    <button type="button" class="btn btn-danger" data-bs-dismiss="modal">Cerrar</button>
                    <div class="text-start"><code>*campos obligatorios</code></div>
                </div>
            </div>
        </div>
    </div>
</template>
<style scoped>
@import '../../../assets/btn.css';

.fondo-card,
h6 {
    background-color: #f8d7da;
    border-color: #f0959e;
    color: #723b47;
    border-width: 2px;
    border-style: solid;
    border-radius: 4px;
    padding: 8px;
}
</style>
<script>
import { useElementStore } from '../../../utils/Store';
import { ref, onMounted, computed } from "vue";
import apiUrl from '../../../../config/config.js'
import Loading from '../../dependentComponents/Loading.vue';

export default {
    setup() {
        const contactosStore = useElementStore("contactoEmergencia")()

        const loading = ref(true)

        onMounted(async () => {
            await contactosStore.fetchElements(`${apiUrl}/contactoEmergencia/getAll`)
            loading.value = false
            data.value;
        })

        const contactosEmergencia = ref(null)

        const data = computed(() => {
            if (contactosStore.getElements != null) {
                contactosEmergencia.value = contactosStore.getElements.result

                contactosEmergencia.value.forEach(e => {
                    nombres.push([e.idContactoEmergencia, e.nombre])
                });
            }
        });

        function nombre(nombre) { return nombre }

        const contactoCreate = computed(() => contactosStore.currentElement)

        contactosStore.setCurrentElement({
            nombre: "",
            email: "",
            telefono: "",
            observaciones: "",
        });

        const crearContactoEmergencia = (async () => {
            if (validarContacto(contactoCreate.value) && contactosStore.confirm("crear", "registrado", "contacto de emergencia")) {
                await contactosStore.createElement(`${apiUrl}/contactoEmergencia/`, JSON.parse(JSON.stringify(contactoCreate.value)));
                location.reload()
            }
        });

        const updateContactoEmergencia = (async (contacto) => {
            if (validarContacto(contacto) && contactosStore.confirm("modificar", "modificado", "Contacto de " + obtenerNombre(contacto.idContactoEmergencia))) {
                await contactosStore.updateElement(`${apiUrl}/contactoEmergencia/`, JSON.parse(JSON.stringify(contacto)), "idContactoEmergencia");
                location.reload()
            }
        });

        const errorNombre = ref(null)
        const errorMail = ref(null)
        const errorTelefono = ref(null)
        const errorObservaciones = ref(null)

        function validarContacto(contacto) {
            let msg = null
            let crear = true;

            errorNombre.value = null
            errorMail.value = null
            errorTelefono.value = null
            errorObservaciones.value = null

            msg = validarNombre(contacto.nombre)

            if (msg != null) {
                errorNombre.value = msg
                crear = false
            }

            msg = null

            msg = validarMail(contacto.email)

            if (msg != null) {
                errorMail.value = msg
                crear = false
            }

            msg = null

            if (contacto.email === '') {
                contacto.email = null
            }

            msg = validarTelefono(contacto.telefono)

            if (msg != null) {
                errorTelefono.value = msg
                crear = false
            }

            msg = null

            msg = validarObservaciones(contacto.observaciones)

            if (msg != null) {
                errorObservaciones.value = msg
                crear = false
            }

            if(!crear) {
                alert("Error detectado en el ingreso de campos")
            }

            return crear
        }

        const deleteContactoEmergencia = (async (contacto) => {
            if (contactosStore.confirm("eliminar", "eliminar", `Contacto de ${contacto.nombre}`)) {
                await contactosStore.deleteElement(`${apiUrl}/contactoEmergencia/`, contacto.idContactoEmergencia);
                location.reload()
            }
        });

        const nombres = []

        function obtenerNombre(id) {
            const elementoEncontrado = nombres.find(item => item[0] === id);
            return elementoEncontrado ? elementoEncontrado[1] : 'No encontrado';
        }

        function validarNombre(nombre) {
            nombre = nombre.trim()

            if (nombre.length < 2 || nombre.length > 50) {
                return "El nombre debe tener un mínimo de 2 caracteres y un máximo de 50";
            } else {
                return null;
            }
        }

        const validateMail = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

        function validarMail(mail) {
            if (mail) {
                mail = mail.trim();
            }

            if (mail !== null && mail !== undefined && mail !== '' && !validateMail.test(mail)) {
                return "Formato de Correo Electrónico incorrecto";
            } else {
                return null;
            }
        }

        function validarTelefono(contacto) {
            if (contacto !== null && (contacto < 0 || contacto.toString().length > 20)) {
                return "El número de teléfono debe ser un número positivo y tener un máximo de 20 caracteres";
            } else {
                return null;
            }
        }

        function validarObservaciones(observaciones) {
            if (observaciones !== null && observaciones.trim().length > 250) {
                return "Las observaciones deben tener un máximo de 250 caracteres";
            } else {
                return null;
            }
        }

        return {
            contactosEmergencia,
            nombre,
            contactoCreate,
            crearContactoEmergencia,
            updateContactoEmergencia,
            deleteContactoEmergencia,
            obtenerNombre,
            loading,
            validarNombre,
            validarMail,
            validarTelefono,
            validarObservaciones,
            errorNombre,
            errorMail,
            errorTelefono,
            errorObservaciones
        }
    },
    components: {
        Loading
    }
}
</script>