<template>
    <Loading v-if="loading" />
    <div v-else class="container-fluid">
        <div class="row">
            <div class="col-md-6 offset-md-3" v-if="socio">
                <h3 class="text-center">Detalles del Socio: <strong>{{ nombre }}</strong></h3>
                <div class="text-end mb-1"><code>*campos obligatorios</code></div>
                <div class="card bg-light text-dark mb-4">
                    <div v-if="socio" class="card-body">
                        <div>
                            <p class="p pe-2 ps-2">
                                <strong>Numero de Socio: <code>*</code></strong><input disabled type="text"
                                    class="form-control" v-model="socio.nroSocio" />
                            </p>
                            <p class="p pe-2 ps-2">
                                <strong>Nombre: <code>*</code></strong><input type="text" class="form-control"
                                    v-model="socio.nombre" />
                            </p>
                            <h6 class="alert-sm mb-0 text-center p-2 m-2 rounded mb-3"
                                v-if="validarNombre(socio.nombre, 'nombre', 24) !== null">
                                <strong>{{ validarNombre(socio.nombre, 'nombre', 24) }}</strong>
                            </h6>
                            <p class="p pe-2 ps-2">
                                <strong>Apellido: <code>*</code></strong><input type="text" class="form-control"
                                    v-model="socio.apellido" />
                            </p>
                            <h6 class="alert-sm mb-0 text-center p-2 m-2 rounded mb-3"
                                v-if="validarNombre(socio.apellido, 'apellido', 24) !== null">
                                <strong>{{ validarNombre(socio.apellido, 'apellido', 24) }}</strong>
                            </h6>
                            <p class="p pe-2 ps-2">
                                <strong>Dni: <code>*</code></strong><input type="number" min="0" class="form-control"
                                    v-model="socio.dni" />
                            </p>
                            <h6 class="alert-sm mb-0 text-center p-2 m-2 rounded mb-3"
                                v-if="validarNumero(socio.dni, 6, 10, 'dni') !== null">
                                <strong>{{ validarNumero(socio.dni, 6, 10, 'dni') }}</strong>
                            </h6>
                            <p class="p pe-2 ps-2">
                                <strong>Email: <code>*</code></strong><input type="email" class="form-control"
                                    v-model="socio.email" />
                            </p>
                            <h6 class="alert-sm mb-0 text-center p-2 m-2 rounded mb-3"
                                v-if="validarMail(socio.email) !== null">
                                <strong>{{ validarMail(socio.email) }}</strong>
                            </h6>
                            <p class="p pe-2 ps-2">
                                <strong>Telefono: <code>*</code></strong><input type="number" class="form-control"
                                    v-model="socio.telefono" />
                            </p>
                            <h6 class="alert-sm mb-0 text-center p-2 m-2 rounded mb-3"
                                v-if="validarNumero(socio.telefono, 8, 15, 'telefono') !== null">
                                <strong>{{ validarNumero(socio.telefono, 8, 15, 'telefono') }}</strong>
                            </h6>
                            <p class="p pe-2 ps-2">
                                <strong>Dirección: <code>*</code></strong><input type="text" class="form-control"
                                    v-model="socio.direccion" />
                            </p>
                            <h6 class="alert-sm mb-0 text-center p-2 m-2 rounded mb-3"
                                v-if="validarNumero(socio.direccion, 5, 50, 'direccion') !== null">
                                <strong>{{ validarNumero(socio.direccion, 5, 50, 'direccion') }}</strong>
                            </h6>
                            <p class="p pe-2 ps-2">
                                <strong>Fecha de Nacimiento: <code>*</code></strong><input type="date" id="fecha"
                                    :max="obtenerFechaMax()" class="form-control" v-model="socio.fechaNacimiento" />
                            </p>
                            <p class="p pe-2 ps-2">
                                <strong>Observaciones: </strong>
                                <textarea style="height: 100px; max-height: 200px;" class="form-control"
                                    v-model="socio.observaciones"></textarea>
                            </p>
                            <h6 class="alert-sm mb-0 text-center p-2 m-2 rounded mb-3"
                                v-if="validarObservaciones(socio.observaciones) !== null">
                                <strong>{{ validarObservaciones(socio.observaciones) }}</strong>
                            </h6>
                            <div class="d-flex justify-content-center">
                                <div class="btn-group">
                                    <button class="btn btn-macabi1" @click="updateSocio">Actualizar Socio</button>

                                    <button class="btn btn-danger" @click="deleteSocio">Borrar Socio</button>
                                </div>
                            </div>
                            <hr>
                            <p class="p pe-2 ps-2">
                                <strong>Datos de contacto: </strong>
                                <br>
                            <div class="card mt-3" style="background-color: rgb(236, 236, 236);"
                                v-for="(contacto, index) in infoContactos" :key="index">
                                <div class="card-body">
                                    <h5>Contacto: <strong>{{ nombreContacto[index] }}</strong></h5>
                                    <div class="text-end"><code>*campos obligatorios</code></div>
                                    <p class="p pe-2 ps-2">
                                        <strong>Nombre: <code>*</code></strong><input type="text" class="form-control"
                                            v-model="contacto.nombre" />
                                    </p>
                                    <h6 class="alert-sm mb-0 text-center p-2 m-2 rounded mb-3"
                                        v-if="errorNombreContacto[index + 1].error">
                                        <strong>{{ errorNombreContacto[index + 1].msg }}</strong>
                                    </h6>
                                    <p class="p pe-2 ps-2">
                                        <strong>Apellido: <code>*</code></strong><input type="text" class="form-control"
                                            v-model="contacto.apellido" />
                                    </p>
                                    <h6 class="alert-sm mb-0 text-center p-2 m-2 rounded mb-3"
                                        v-if="errorApellidoContacto[index + 1].error">
                                        <strong>{{ errorApellidoContacto[index + 1].msg }}</strong>
                                    </h6>
                                    <p class="p pe-2 ps-2">
                                        <strong>Email: <code>*</code></strong><input type="text" class="form-control"
                                            v-model="contacto.email" />
                                    </p>
                                    <h6 class="alert-sm mb-0 text-center p-2 m-2 rounded mb-3"
                                        v-if="errorMailContacto[index + 1].error">
                                        <strong>{{ errorMailContacto[index + 1].msg }}</strong>
                                    </h6>
                                    <p class="p pe-2 ps-2">
                                        <strong>Teléfono: <code>*</code></strong><input type="number" min="0"
                                            class="form-control" v-model="contacto.telefono" />
                                    </p>
                                    <h6 class="alert-sm mb-0 text-center p-2 m-2 rounded mb-3"
                                        v-if="errorTelefonoContacto[index + 1].error">
                                        <strong>{{ errorTelefonoContacto[index + 1].msg }}</strong>
                                    </h6>
                                    <div class="d-flex justify-content-center">
                                        <div class="btn-group">
                                            <button class="btn btn-macabi1"
                                                @click="updateContacto(contacto, index + 1)">Actualizar
                                                Contacto</button>
                                            <button class="btn btn-danger" @click="deleteContacto(contacto, index)">Borrar
                                                Contacto</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div v-if="infoContactos == null" class="p pe-2 ps-4">
                                <h6 class="alert-sm mb-0 text-center p-2 m-2 rounded mb-3">
                                    <strong>{{ socio.nombre }} no posee datos de contacto</strong>
                                </h6>
                            </div>
                            <div class="d-flex justify-content-center mt-4">
                                <button class="btn btn-success" data-bs-toggle="modal" data-bs-target="#myModal">Agregar
                                    Contacto</button>
                            </div>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-6 offset-md-3" v-if="!socio">
                <div class="card fondo-card mb-4">
                    <div class="card-body" style="border-radius: 10px;">
                        <h5 class="fw-bold text-center">No se encontró el socio</h5>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div v-if="!loading" class="d-flex justify-content-center mb-4">
        <button class="btn btn-dark" @click="volver">Volver</button>
    </div>
    <br>
    <!--MODAL / MODAL / MODAL / MODAL / MODAL / MODAL / MODAL / MODAL / MODAL / MODAL / MODAL / MODAL / MODAL / MODAL / MODAL / -->
    <div v-if="socio" class="modal fade" id="myModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">Crear Contacto para:</h5>
                    <h5 class="modal-title ps-2"><strong> {{ socio.nombre }}, {{
                        socio.apellido
                    }}</strong></h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <p class="p pe-2 ps-2">
                        <strong>Nombre: <code>*</code></strong><input type="text" class="form-control"
                            v-model="contactoCreate.nombre" />
                    </p>
                    <h6 class="alert-sm mb-0 text-center p-2 m-2 rounded mb-3" v-if="errorNombreContacto[0].error">
                        <strong>{{ errorNombreContacto[0].msg }}</strong>
                    </h6>
                    <p class="p pe-2 ps-2">
                        <strong>Apellido: <code>*</code></strong><input type="text" class="form-control"
                            v-model="contactoCreate.apellido" />
                    </p>
                    <h6 class="alert-sm mb-0 text-center p-2 m-2 rounded mb-3" v-if="errorApellidoContacto[0].error">
                        <strong>{{ errorApellidoContacto[0].msg }}</strong>
                    </h6>
                    <p class="p pe-2 ps-2">
                        <strong>Email: <code>*</code></strong><input type="text" class="form-control"
                            v-model="contactoCreate.email" />
                    </p>
                    <h6 class="alert-sm mb-0 text-center p-2 m-2 rounded mb-3" v-if="errorMailContacto[0].error">
                        <strong>{{ errorMailContacto[0].msg }}</strong>
                    </h6>
                    <p class="p pe-2 ps-2">
                        <strong>Teléfono: <code>*</code></strong><input type="number" min="0" class="form-control"
                            v-model="contactoCreate.telefono" />
                    </p>
                    <h6 class="alert-sm mb-0 text-center p-2 m-2 rounded mb-3" v-if="errorTelefonoContacto[0].error">
                        <strong>{{ errorTelefonoContacto[0].msg }}</strong>
                    </h6>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-macabi1" @click="crearContacto">Crear</button>
                    <button type="button" class="btn btn-danger" data-bs-dismiss="modal">Cerrar</button>
                    <div class="text-start"><code>*campos obligatorios</code></div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { useElementStore } from '../../../utils/Store';
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import apiUrl from '../../../../config/config.js'
import { Utils } from '../../../utils/utils';
import Loading from '../../dependentComponents/Loading.vue';

export default {
    setup() {
        const sociosStore = useElementStore("socios")()
        const contactoStore = useElementStore("contacto")()

        const route = useRoute()
        const idSocio = route.params.id

        const router = useRouter()

        const nombre = ref(null)
        const nombreContacto = ref(null)

        const utils = new Utils()

        const loading = ref(true)

        onMounted(async () => {
            await sociosStore.fetchElements(`${apiUrl}/socio/getAll`)
            await sociosStore.fetchElementById(`${apiUrl}/socio/`, idSocio)
            data.value;
            loading.value = false
        })

        const socio = ref(null)
        const infoContactos = ref(null)

        const data = computed(() => {
            if (sociosStore.currentElement != null) {
                socio.value = sociosStore.currentElement.result;
                nombre.value = `${socio.value.apellido}, ${socio.value.nombre}`

                if (socio.value.InfoContactos.length != 0) {
                    infoContactos.value = socio.value.InfoContactos
                    nombreContacto.value = infoContactos.value.map(contacto => `${contacto.apellido}, ${contacto.nombre}`);
                }

                createErrorsArray()
            }
        });

        const message = ref(null);
        const soloLetras = /^[A-Za-zÁÉÍÓÚáéíóú\s]+$/; // letras, espacios y acentos
        const validateMail = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

        const updateSocio = async () => {
            message.value = null

            const dni = socio.value.dni;
            const email = socio.value.email;

            let hasDuplicateDNI = false
            let hasDuplicateEmail = false

            if (sociosStore.getElements.result.length > 0) {
                hasDuplicateDNI = sociosStore.getElements.result.some((socio) => socio.dni == dni && socio.idSocio != idSocio);
                hasDuplicateEmail = sociosStore.getElements.result.some((socio) => socio.email === email && socio.idSocio != idSocio);
            }
            if (hasDuplicateDNI) {
                alert("El DNI no puede repetirse")
                message.value = "a";
            } else if (hasDuplicateEmail) {
                alert("El correo electrónico no puede repetirse")
                message.value = "a";
            } else if (!/@/.test(email) && email.trim() === '') {
                message.value = "El Email debe debe contener '@' y no estar vacío";
            } else if (!validateMail.test(email)) {
                message.value = "Formato Email incorrecto";
            } else if (dni < 0) {
                message.value = "El DNI debe ser un número positivo";
            } else if (String(dni).length < 6 || String(dni).length > 10) {
                message.value = "El DNI debe tener un largo minimo de 6 digitos y un maximo de 10.";
            } else if (socio.value.telefono < 0) {
                message.value = "El Telefono debe ser un número positivo";
            } else if (String(socio.value.telefono).length < 8 || String(socio.value.telefono).length > 15) {
                message.value = "El teléfono debe tener un mínimo de 8 caracteres y un máximo de 15.";
            } else if (String(socio.value.nombre).length < 2 || String(socio.value.nombre).length > 24) {
                message.value = "El nombre debe tener un minimo de 2 caracteres y un maximo de 24.";
            } else if (!soloLetras.test(socio.value.nombre)) {
                message.value = "El nombre debe contener solo letras.";
            } else if (String(socio.value.apellido).length < 2 || String(socio.value.nombre).length > 24) {
                message.value = "El apellido debe tener un minimo de 2 caracteres y un maximo de 24.";
            } else if (!soloLetras.test(socio.value.apellido)) {
                message.value = "El apellido debe contener solo letras.";
            } else if (!socio.value.direccion || (String(socio.value.direccion).length < 5 || String(socio.value.direccion).length > 50)) {
                message.value = "La Dirección debe tener un mínimo de 5 caracteres y un máximo de 50.";
            } else if (String(socio.value.observaciones).length > 250) {
                message.value = "Las observaciones deben tener un maximo de 250 caracteres.";
            }

            if (message.value != null) {
                alert("Error detectado en el ingreso de campos")
            } else if (sociosStore.confirm("modificar", "modificado", "Socio")) {
                const socioUpdate = JSON.parse(JSON.stringify(sociosStore.currentElement.result))
                try {
                    await sociosStore.patchElement(`${apiUrl}/socio/${socioUpdate.idSocio}`, socioUpdate)
                    router.go(-1)
                } catch (e) {
                    alert("Error updating");
                }
            }

        };

        async function deleteSocio() {
            if (utils.confirm("Eliminar", "Eliminado", "Socio")) {
                await sociosStore.deleteElement(`${apiUrl}/socio/`, idSocio)
                router.push('/socios')
            }
        }

        const contactoCreate = computed(() => contactoStore.currentElement)

        contactoStore.setCurrentElement({
            idSocio: idSocio,
            nombre: "",
            apellido: "",
            email: "",
            telefono: "",
        });

        const crearContacto = (async () => {
            if (validarContacto(contactoCreate.value, 0) && contactoStore.confirm("crear", "registrado", "contacto")) {
                await contactoStore.createElement(`${apiUrl}/contacto/`, JSON.parse(JSON.stringify(contactoCreate.value)));
                location.reload()
            }
        });

        const updateContacto = (async (contacto, pos) => {

            if (validarContacto(contacto, pos) && contactoStore.confirm("modificar", "modificado", "Contacto de " + nombreContacto.value[pos - 1])) {
                await contactoStore.updateElement(`${apiUrl}/contacto/`, JSON.parse(JSON.stringify(contacto)), "idInfoContacto");
                location.reload()
            }
        });

        const errorNombreContacto = ref(null)
        const errorApellidoContacto = ref(null)
        const errorMailContacto = ref(null)
        const errorTelefonoContacto = ref(null)

        function createErrorsArray() {
            if (socio.value.InfoContactos.length == 0) {

                errorNombreContacto.value = [({ error: ref(false), msg: ref(null) })]

                errorApellidoContacto.value = [({ error: ref(false), msg: ref(null) })]

                errorMailContacto.value = [({ error: ref(false), msg: ref(null) })]

                errorTelefonoContacto.value = [({ error: ref(false), msg: ref(null) })]

            } else {
                errorNombreContacto.value = Array.from({ length: infoContactos.value.length }, (_) => ({ error: ref(false), msg: ref(null) }));
                errorNombreContacto.value.unshift(({ error: ref(false), msg: ref(null) }))

                errorApellidoContacto.value = Array.from({ length: infoContactos.value.length }, (_) => ({ error: ref(false), msg: ref(null) }));
                errorApellidoContacto.value.unshift(({ error: ref(false), msg: ref(null) }))

                errorMailContacto.value = Array.from({ length: infoContactos.value.length }, (_) => ({ error: ref(false), msg: ref(null) }));
                errorMailContacto.value.unshift(({ error: ref(false), msg: ref(null) }))

                errorTelefonoContacto.value = Array.from({ length: infoContactos.value.length }, (_) => ({ error: ref(false), msg: ref(null) }));
                errorTelefonoContacto.value.unshift(({ error: ref(false), msg: ref(null) }))
            }
        }

        function cleanErrors(pos) {
            errorNombreContacto.value[pos].msg = null
            errorNombreContacto.value[pos].error = false

            errorApellidoContacto.value[pos].msg = null
            errorApellidoContacto.value[pos].error = false

            errorMailContacto.value[pos].msg = null
            errorMailContacto.value[pos].error = false

            errorTelefonoContacto.value[pos].msg = null
            errorTelefonoContacto.value[pos].error = false
        }

        function validarContacto(contacto, pos) {
            let msg = null
            let crear = true;

            cleanErrors(pos)

            msg = validarNombre(contacto.nombre, 'nombre', 50)

            if (msg != null) {
                errorNombreContacto.value[pos].msg = msg
                errorNombreContacto.value[pos].error = true

                crear = false
            }

            msg = validarNombre(contacto.apellido, 'apellido', 50)

            if (msg != null) {
                errorApellidoContacto.value[pos].msg = msg
                errorApellidoContacto.value[pos].error = true

                crear = false
            }

            msg = null

            msg = validarMail(contacto.email)

            if (msg != null) {
                errorMailContacto.value[pos].msg = msg
                errorMailContacto.value[pos].error = true

                crear = false
            }

            msg = validarTelefono(contacto.telefono)

            if (msg != null) {
                errorTelefonoContacto.value[pos].msg = msg
                errorTelefonoContacto.value[pos].error = true

                crear = false
            }

            if (!crear) {
                alert("Error en los campos ingresados")
            }

            return crear
        }

        const deleteContacto = (async (contacto, pos) => {
            if (contactoStore.confirm("eliminar", "eliminado", `Contacto de ${nombreContacto.value[pos]}`)) {
                await contactoStore.deleteElement(`${apiUrl}/contacto/`, contacto.idInfoContacto);
                location.reload()
            }
        });

        function obtenerFechaMax() {
            const fechaActual = new Date();
            const year = fechaActual.getFullYear();
            const month = (fechaActual.getMonth() + 1).toString().padStart(2, '0');
            const day = (fechaActual.getDate() - 1).toString().padStart(2, '0'); // Corregido: Restar 1 día

            return `${year}-${month}-${day}`;
        }

        function volver() {
            router.go(-1)
        }

        function validarNombre(valor, tipo, max) {
            if (valor === null) {
                return `El ${tipo} no puede ser nulo`;
            }

            if (valor.length < 2 || valor.length > max) {
                return `El ${tipo} debe tener un mínimo de 2 caracteres y un máximo de ${max}`;
            }

            if (!soloLetras.test(valor)) {
                return `El ${tipo} solo puede tener letras`;
            }

            return null;
        }

        function validarMail(mail) {
            if (mail === '') {
                return "El correo electrónico no puede ser nulo";
            } else if (mail.length > 50) {
                return "El correo electrónico no puede tener más de 50 caracteres";
            } else if (!validateMail.test(mail)) {
                return "Formato de Correo Electrónico incorrecto";
            } else {
                return null;
            }
        }

        function validarTelefono(contacto) {
            if (contacto === null || contacto === '') {
                return `El telefono no puede ser nulo`;
            }

            if (contacto.toString().length < 9 || contacto.toString().length > 30) {
                return "El número de teléfono debe ser un número positivo entre 9 y 30 caracteres";
            } else {
                return null;
            }
        }

        function validarNumero(contacto, min, max, tipo) {
            if (contacto === null || contacto === '') {
                if (tipo === 'direccion') {
                    return `La ${tipo} no puede ser nula`;
                } else {
                    return `El ${tipo} no puede ser nulo`;
                }
            }

            const telefonoString = contacto.toString();

            if (telefonoString.length < min || telefonoString.length > max || contacto < 0) {
                if (tipo === 'direccion') {
                    return `La ${tipo} debe ser un número positivo y tener entre ${min} y ${max} caracteres`;
                } else {
                    return `El ${tipo} debe ser un número positivo y tener entre ${min} y ${max} caracteres`;
                }
            }

            return null;
        }

        function validarObservaciones(observaciones) {
            if (observaciones !== null && observaciones.length > 250) {
                return "Las observaciones deben tener un máximo de 250 caracteres";
            } else {
                return null;
            }
        }

        return {
            socio,
            sociosStore,
            updateSocio,
            deleteSocio,
            infoContactos,
            obtenerFechaMax,
            updateContacto,
            deleteContacto,
            crearContacto,
            contactoCreate,
            nombre,
            nombreContacto,
            volver,
            loading,
            validarNombre,
            validarMail,
            validarTelefono,
            validarNumero,
            validarObservaciones,
            errorNombreContacto,
            errorApellidoContacto,
            errorMailContacto,
            errorTelefonoContacto,
            cleanErrors
        }
    },
    components: {
        Loading
    }
}
</script>
<style scoped>
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