<template>
    <div class="container_grid macabi_color_fondo tamaño_xs">

        <div class="sub_container_title lightgrey_color_fondo">
            Recuperar Clave
        </div>

        <div class="sub_container_basic lightgrey_color_fondo">

            <div v-if="!emailSend && !claveCambiada">

                <div class="form-text" id="basic-addon4">Ingrese su Email</div>

                <div class="form-floating mb-3 mt-3">
                    <input type="email" class="form-control" id="emailInput" :class="mailValid"
                        placeholder="name@example.com" v-model="email">
                    <label for="emailInput">Email</label>
                </div>

                <div class="sub_container_buttons">
                    <button type="" class="btn btn-dark" @click="$router.go(-1)">Regresar</button>

                    <button type="" class="btn btn-primary primary-macabi" @click="enviarEmailRecuperacion">

                        <span :class="isLoading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true">
                        </span>

                        Enviar Email
                    </button>

                </div>

            </div>

            <div v-else-if="emailSend && !claveCambiada">

                <div v-if="!tokenExistente" class="form-text" id="basic-addon4">Un Token de restablecimiento de contraseña
                    ha sido enviado a tu
                    dirección de correo electrónico </div>

                <div v-else class="form-text" id="basic-addon4">Un Token de restablecimiento de contraseña ha sido enviado a
                    tu
                    dirección de correo electrónico <b>con anterioridad.</b><br> Porfavor revise sus email anteriores o
                    reenviar el codigo</div>

                <div class="form-floating mb-3 mt-3">
                    <input type="text" class="form-control" id="tokenInput" placeholder="" :class="tokenValid"
                        v-model="token" autocomplete="off">
                    <label for="tokenInput">Token</label>
                </div>

                <tr></tr>

                <div class="form-floating mb-3">
                    <input type="password" class="form-control " id="claveInput" :class="claveValid" placeholder=""
                        v-model="nuevaClave" @keyup="isMayus($event, 'mayusAlert1')" @focusout="desactivar('mayusAlert1')"
                        autocomplete="off">

                    <label for="claveInput">Clave</label>

                    <svg xmlns="http://www.w3.org/2000/svg" id="mayusAlert1" width="16" height="16" fill="currentColor"
                        class="bi bi-capslock-fill capslock" viewBox="0 0 16 16">
                        <path
                            d="M7.27 1.047a1 1 0 0 1 1.46 0l6.345 6.77c.6.638.146 1.683-.73 1.683H11.5v1a1 1 0 0 1-1 1h-5a1 1 0 0 1-1-1v-1H1.654C.78 9.5.326 8.455.924 7.816L7.27 1.047zM4.5 13.5a1 1 0 0 1 1-1h5a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1h-5a1 1 0 0 1-1-1v-1z" />
                    </svg>

                </div>

                <div class="form-floating mb-3">
                    <input type="password" class="form-control " id="claveConfirmInput" :class="claveValid" placeholder=""
                        v-model="confirmNuevaClave" @keyup="isMayus($event, 'mayusAlert2')"
                        @focusout="desactivar('mayusAlert2')" autocomplete="off">

                    <label for="claveConfirmInput">Clave</label>

                    <svg xmlns="http://www.w3.org/2000/svg" id="mayusAlert2" width="16" height="16" fill="currentColor"
                        class="bi bi-capslock-fill capslock" viewBox="0 0 16 16">
                        <path
                            d="M7.27 1.047a1 1 0 0 1 1.46 0l6.345 6.77c.6.638.146 1.683-.73 1.683H11.5v1a1 1 0 0 1-1 1h-5a1 1 0 0 1-1-1v-1H1.654C.78 9.5.326 8.455.924 7.816L7.27 1.047zM4.5 13.5a1 1 0 0 1 1-1h5a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1h-5a1 1 0 0 1-1-1v-1z" />
                    </svg>

                </div>


                <div class="sub_container_buttons">
                    <button type="" class="btn btn-dark" @click="$router.go(-1)">Regresar</button>

                    <button type="" class="btn btn-primary primary-macabi" @click="reenviarEmailRecuperacion()">
                        <span :class="isLoading" class="spinner-border spinner-border-sm" role="status"
                            aria-hidden="true"></span>
                        Reenviar
                    </button>

                    <button type="" class="btn btn-primary primary-macabi" @click="cambiarClave()">
                        Cambiar Clave
                    </button>
                </div>


            </div>

            <div v-else-if="claveCambiada">

                <div class="form-text text" id="basic-addon4" style="text-align: center;">
                    Tu contraseña se ha actualizado exitosamente
                </div>

                <div class="sub_container_buttons2">
                    <button type="" class="btn btn-dark" @click="$router.push(`/login`);">Iniciar Sesión</button>
                </div>


            </div>

            <div v-if="msjError" class="alert alert-danger" role="alert">
                {{ msjError }}
            </div>

        </div>

    </div>
</template>


<script setup>
import apiUrl from '../../config/config';
import axios from 'axios';

import { ref, computed } from "vue";

//Datos a ingresar
const email = ref("")
const token = ref("")
const nuevaClave = ref("")
const confirmNuevaClave = ref("")


const claveCambiada = ref(false)
const emailSend = ref(false)
const tokenExistente = ref(false)

const loading = ref(false)

//estado error
const msjError = ref("")

const errorEmail = ref(false)
const errorClaves = ref(false)
const errorToken = ref(false)

const isLoading = computed(() => {
    let msj
    if (!loading.value) {
        msj = 'hide'
    }
    return msj
});

const mailValid = computed(() => {
    let msj
    if (errorEmail.value) {
        msj = 'is-invalid'
    }
    return msj
});

const claveValid = computed(() => {
    let msj
    if (errorClaves.value) {
        msj = 'is-invalid'
    }
    return msj
});

const tokenValid = computed(() => {
    let msj
    if (errorToken.value) {
        msj = 'is-invalid'
    }
    return msj
});


async function enviarEmailRecuperacion() {
    loading.value = true
    errorEmail.value = false
    msjError.value = ''

    try {
        const data = {
            email: email.value,
            force: false
        }
        const response = await axios.post(`${apiUrl}/recoverPassword/sendEmail`, data, { withCredentials: true })
        tokenExistente.value = response.data.tokenExistente
        emailSend.value = response.data.success
        loading.value = false

    } catch (error) {

        if (error.hasOwnProperty('response')) {
            msjError.value = error.response.data.message

            if (error.response.hasOwnProperty('data') && error.response.data.hasOwnProperty('errorEmail')) {
                errorEmail.value = error.response.data.errorEmail
            }

        } else {
            //si no hay, significa que hay problemas con el server
            msjError.value = "Error con el Servidor"
        }
        loading.value = false
    }


}

async function reenviarEmailRecuperacion() {
    try {
        loading.value = true
        msjError.value = ''

        const data = {
            email: email.value,
            force: true
        }

        if (window.confirm(`Deseas Reenviar el Email de recuperacion a ${email.value}`)) {
            const response = await axios.post(`${apiUrl}/recoverPassword/sendEmail`, data, { withCredentials: true })
            alert("El Email se ha reenviado")
        }

        loading.value = false
       

    } catch (error) {
        loading.value = false

        if (error.hasOwnProperty('response')) {
            alert("Error al enviar el Email")
        } else {
            //si no hay, significa que hay problemas con el server
            msjError.value = "Error con el Servidor"
        }
    }



}

async function cambiarClave() {
    try {
        msjError.value = ''
        errorClaves.value = false
        const data = {
            email: email.value,
            token: token.value,
            nuevaClave: nuevaClave.value,
            confirmNuevaClave: confirmNuevaClave.value,
        }

        const response = await axios.post(`${apiUrl}/recoverPassword`, data, { withCredentials: true })

        claveCambiada.value = response.data.success

    } catch (error) {

        if (error.hasOwnProperty('response') && error.response.hasOwnProperty('data')) {

            msjError.value = error.response.data.message

            if (error.response.data.hasOwnProperty('errorClaves')) {
                errorClaves.value = error.response.data.errorClaves
            }

            if (error.response.data.hasOwnProperty('errorToken')) {
                errorToken.value = error.response.data.errorToken
            }

        } else {
            //si no hay, significa que hay problemas con el server
            msjError.value = "Error con el Servidor"
        }
    }

}

function isMayus(event, idTag) {
    const capsLockEnabled = event.getModifierState("CapsLock");

    if (capsLockEnabled) {
        document.getElementById(idTag).style.display = 'inherit'

    } else {
        document.getElementById(idTag).style.display = 'none'
    }
}

function desactivar(idTag) {
    document.getElementById(idTag).style.display = 'none'
}

</script>


<style scoped>
.hide {
    display: none;
}

.capslock {
    display: none;
    position: absolute;
    right: 40px;
    top: 21px
}

.sub_container_title {
    margin-bottom: 20px;
}

.alert {
    text-align: center;
}

@media screen and (max-width:700px) {
    .sub_container_buttons {
        flex-direction: column-reverse;
        align-items: center;
    }

    .btn {
        width: 100%;
        height: 60px;

        margin-bottom: 20px;
    }
}
</style>
