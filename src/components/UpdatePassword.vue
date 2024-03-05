<template>
    <Loading v-if="loading"/>
    <div v-else class="container-fluid">
        <div class="row">
            <div class="col-md-6 offset-md-3" v-if="usuario">
                <h3 class="text-center">Modificar contraseña del Usuario: <br><strong>{{ nombre }}</strong></h3>
                <div class="text-end mb-1"><code>*campos obligatorios</code></div>
                <div class="card bg-light text-dark mb-3">
                    <div class="card-body">

                        <p class="p pe-2 ps-2">
                            <strong>Contraseña original: <code>*</code></strong><input class="form-control" :type="mostrar2"
                                v-model="oldPass" placeholder="Ingrese su contraseña" onpaste="return false;" />
                        </p>
                        <div class="mt-2 mb-3 text-center">
                            <button class="btn btn-outline-dark" type="button" id="togglePassword"
                                @click="mostrarContrasenaClave">Ver contraseña</button>
                        </div>

                        <p class="p pe-2 ps-2">
                            <strong>Nueva Contraseña: <code>*</code></strong><input class="form-control" :type="mostrar4"
                                v-model="clave" placeholder="Ingrese nueva contraseña" onpaste="return false;" />
                        </p>
                        <div class="mt-2 mb-3 text-center">
                            <button class="btn btn-outline-dark" type="button" id="togglePassword"
                                @click="mostrarContrasenaNew">Ver contraseña</button>
                        </div>
                        <h6 class="alert-sm mb-0 text-center p-2 m-2 rounded mb-3" v-if="errorClave">
                            <strong>La nueva contraseña original debe tener un mínimo de 8 caracteres, una mayúscula y
                                un
                                número</strong>
                        </h6>
                        <h6 class="alert-sm mb-0 text-center p-2 m-2 rounded mb-3" v-if="errorSamePass">
                            <strong>La nueva contraseña no puede ser la misma que la anterior contraseña</strong>
                        </h6>

                        <p class="p pe-2 ps-2">
                            <strong>Confirme la Contraseña: <code>*</code></strong><input class="form-control"
                                type="password" v-model="claveConfirm" placeholder="Confirmar nueva contraseña"
                                onpaste="return false;" />
                        </p>
                        <h6 class="alert-sm mb-0 text-center p-2 m-2 rounded mb-3" v-if="errorClaveConfirm">
                            <strong>La nueva contraseña no es la misma</strong>
                        </h6>
                        <div class="text-center mb-2"><code>¡NO está permitido copiar y pegar!</code></div>
                    </div>
                </div>
                <div class="d-flex justify-content-center align-items-center mb-3">
                    <div class="btn-group">
                        <button class="btn btn-success" @click="updatePassword">
                            Cambiar contraseña
                        </button>
                    </div>
                </div>
            </div>
            <div class="d-flex justify-content-center">
                <button class="btn btn-dark" @click="volver">Volver</button>
            </div>
        </div>
    </div>
    <br>
</template>
<style scoped>
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
import { useElementStore } from "../stores/Store";
import { useRouter, useRoute } from "vue-router";
import { computed, ref } from "vue";
import { onBeforeMount } from "vue";
import axios from "axios";
import apiUrl from "../../config/config";
import { cambiosPerfilPropioPermiso } from '../utils/permisos';
import Loading from "./dependentComponents/Loading.vue";

export default {
    setup() {
        const route = useRoute();
        const router = useRouter();
        const idUsuario = route.params.idUsuario.toString();

        onBeforeMount(async () => {
            if (! await cambiosPerfilPropioPermiso(idUsuario)) {
                router.push(`/unauthorized`)
            }
        });

        const elementStore = useElementStore("usuario")();
        elementStore.fetchElementById(idUsuario).then(() => { nombre.value = `${usuario.value.apellido}, ${usuario.value.nombre}`; loading.value = false })

        const usuario = computed(() => elementStore.currentElement);

        const nombre = ref(null)
        const oldPass = ref(null)
        const clave = ref(null)
        const claveConfirm = ref(null)

        const errorClave = ref(false)
        const errorClaveConfirm = ref(false)
        const errorSamePass = ref(false)

        const loading = ref(true)

        function setInFalse() {
            errorClave.value = false
            errorClaveConfirm.value = false
            errorSamePass.value = false
        }

        function updatePassword() {
            setInFalse()

            let passValidated = false

            passValidated = validarContraseña(clave.value)

            if (!passValidated) {
                errorClave.value = true
            }

            if (claveConfirm.value != clave.value) {
                passValidated = false
                errorClaveConfirm.value = true
            }


            if (passValidated && confirm()) {
                const contraseñas = {
                    clave: clave.value,
                    oldPass: oldPass.value,
                };

                try {
                    loading.value = true

                    axios.post(`${apiUrl}/usuario/updatePassword/${idUsuario}`, contraseñas, { withCredentials: true })
                        .then(response => {
                            console.log('Respuesta del servidor:', response.data);
                            alert(`Tu contraseña ha sido modificada correctamente`);
                            router.push("/miUsuario")
                            loading.value = false
                        }).catch(error => {
                            alert(`Error en la solicitud: ${error.response.data.message}`);
                            loading.value = false
                        });
                } catch (e) {
                    console.log(e.response.data)
                }
            }
        }

        function validarContraseña(pass) {
            return /^(?=.*[A-Z])(?=.*\d).{8,}$/.test(pass)
        }

        function confirm() {
            if (window.confirm(`¿Estás seguro de modificar tu contraseña, esta acción no tiene vuelta atrás?`)) {
                return true
            } else { alert(`Acción cancelada`); return false; }
        }

        function volver() {
            router.go(-1)
        }

        const mostrar1 = ref(false);
        const mostrar2 = ref("password");

        function mostrarContrasenaClave() {
            if (mostrar1.value) {
                mostrar2.value = "password"
            } else mostrar2.value = "text"
            mostrar1.value = !mostrar1.value
        }

        const mostrar3 = ref(false);
        const mostrar4 = ref("password");

        function mostrarContrasenaNew() {
            if (mostrar3.value) {
                mostrar4.value = "password"
            } else mostrar4.value = "text"
            mostrar3.value = !mostrar3.value
        }

        return {
            errorSamePass,
            mostrar2,
            mostrar4,
            mostrarContrasenaClave,
            mostrarContrasenaNew,
            errorClaveConfirm,
            errorClave,
            usuario,
            nombre,
            updatePassword,
            volver,
            clave,
            claveConfirm,
            oldPass,
            loading
        };
    },
    components: {
        Loading
    }
};


</script>