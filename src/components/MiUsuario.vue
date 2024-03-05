<template>
	<!-- <div v-if="!this.usrStore.isLogged" class="borde_doble">
		<div class="container_basic">
			<h1>no estas logeado</h1>
		</div>
	</div> -->
	<loading v-if="this.loading"/>
	<div class="container-fluid mt-3 mb-5" v-else>
		<div class="row">
			<div class="col-md-6 offset-md-3" v-if="this.user">
				<h3 class="text-center">Detalles del Usuario: <strong>{{ this.user.apellido }}, {{ this.user.nombre
				}}</strong>
				</h3>
				<br>
				<div class="card bg-light text-dark mb-4">
					<div class="card-body">
						<p class="mb-2"><strong class="font-weight-bold">Email: </strong>{{ this.user.email }}</p>
						<p class="mb-2"><strong class="font-weight-bold">Dni: </strong>{{ this.user.dni }}</p>
						<p class="mb-2"><strong class="font-weight-bold">Edad: </strong>{{
							utils.obtenerEdadXFecha(this.user.fechaNacimiento) }}<code>*</code></p>
						<p class="mb-2"><strong class="font-weight-bold">Fecha de nacimiento: </strong>{{
							utils.obtenerFechaFormateada(this.user.fechaNacimiento) }}</p>
						<p class="mb-2"><strong class="font-weight-bold">Telefono: </strong>{{ this.user.telefono }}</p>
						<p class="mb-2"><strong class="font-weight-bold">Rol: </strong>{{ roleName }}</p>
						<p class="mb-2"><strong class="font-weight-bold">Activo: </strong>{{ activo }}</p>
						<p class="mb-2"><strong class="font-weight-bold">Direccion: </strong>{{ this.user.direccion }}</p>
					</div>
				</div>
				<div class="text-end my-3 ms-5">
                    <code>* Edad calculada a partir de la fecha de nacimiento automáticamente</code>
                </div>
			</div>

			<div v-if="this.user" class="d-flex justify-content-center mb-3">
				<div class="btn-group">
					
					<button class="btn btn-success"  @click="updatePassword">
                            Cambiar contraseña
                        </button>
					<button type="submit" class="btn btn-danger" @click="salir">Cerrar Sesion</button>
				</div>
			</div>

			<div v-if="this.user" class="d-flex justify-content-center mb-3">
				<div class="btn-group">
					<router-link class="btn btn-macabi1" v-if="this.user.idRol != '3' "
						:to="`/modificarusuario/${this.user.idUsuario}`">Modificar mis datos</router-link>
					<button class="btn btn-dark" @click="volver">Volver</button>
				</div>
			</div>
		</div>
	</div>
	<br>
</template>
  
<script>
import { usrStore } from '../stores/usrStore.ts'
import axios from 'axios';
import apiUrl from '../../config/config';
import { Utils } from '../utils/utils';
import { useRouter } from 'vue-router';
import Loading from './dependentComponents/Loading.vue';

export default {
	data() {
		return {
			usrStore: usrStore(),
			user: null,
			utils: new Utils(),
			router: useRouter(),
			loading: true
		}
	},
	components: {
		Loading
	},
	mounted() {

		if (!this.usrStore.isLogged) {
			this.$router.push("/login");
		} else {
			document.title = "Mi Usuario"

			axios.get(`${apiUrl}/usuario/${this.usrStore.currentUser.idUsuario}`, { withCredentials: true })
				.then(response => {
					this.user = response.data.result;
					this.loading = false
				})
				.catch(error => {
					console.error('Error al obtener los datos:', error);
					alert("No se encontró el usuario")
				});
		}
	},
	updated() {
		if (!this.usrStore.isLogged) {
			this.$router.push("/login");
		}

	},
	methods: {
		 updatePassword() {
            this.$router.push(`/updatePass/${this.usrStore.currentUser.idUsuario}`)
        },


		salir() {
			this.usrStore.logOut()
			this.$router.push('/login');
		},

		navegar(ubicacion) {
			this.$router.push(`/${ubicacion}`);
		},

		volver() {
			this.$router.go(-1);
		},
	},
	computed: {
		roleName() {
			switch (this.user.idRol) {
				case 1:
					return "Administrador";
				case 2:
					return "Coordinador";
				case 3:
					return "Profesor"
				default:
					return "Unknown";
			}
		},
		activo() {
			return this.user.activo ? "Si" : "No"
		}
	}
}

</script>