<template>
	<Loading v-if="loading" />
	<div v-else class="container_grid tamaño_xl">

		<div class="sub_container_title">
			{{ titulo }}
		</div>

		<div class="container_basic">

			<div>
				<h4 class="text-center fw-bold d-none d-lg-block">Coordinadores</h4>
				<table class="tabla_macabi1">
					<tr>
						<th class="big">Nombre</th>
						<th class="big" style="width: 20%;">DNI</th>
						<th class="big" style="width: 40%;">Email</th>
						<th class="big" style="width: 15%;">Estado</th>

						<th class="small">Coordinadores</th>
					</tr>

					<tr v-for="coordinador in coordinadores" @click="$router.push(`/usuarios/${coordinador.idUsuario}`);"
						class="resaltable">
						<td class="show_data_cell" data-cell="Nombre">{{ coordinador.nombre }}, {{ coordinador.apellido }}
						</td>
						<td class="show_data_cell" data-cell="DNI">{{ coordinador.dni }}</td>
						<td class="show_data_cell" data-cell="Email">{{ coordinador.email }}</td>
						<td class="show_data_cell" data-cell="Estado">
							<span class="text-success fw-bold" v-if="coordinador.activo"> Activo </span>
							<span class="text-danger fw-bold" v-else> Inactivo </span>
						</td>
					</tr>

				</table>
			</div>

			<div style="margin-top: 20px;">
				<table class="tabla_macabi1">
					<tr>
						<th>Categorias</th>
					</tr>

					<tr v-for="categoria in categorias" class="resaltable text-center"
						@click="$router.push(`/detalleCategoria/${categoria.idCategoria}`);">
						<td class="show_data_cell" data-cell="Nombre">{{ categoria.nombreCategoria }}</td>
					</tr>

				</table>
			</div>

		</div>

	</div>


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

	<div v-if="!loading" class="sub_container_buttons btn-group mb-5">
		<button v-if="rolUsuario == 'A'" class="btn btn-primary primary-macabi"
			@click="$router.push(`/editarDeporte/${idDeporte}`);">Editar Deporte</button>

		<button v-if="rolUsuario == 'C'" class="btn btn-primary primary-macabi" data-bs-toggle="modal"
			data-bs-target="#categoriaModal">Agregar nueva categoria</button>
		<button class="btn btn-dark" @click="$router.go(-1)">Volver</button>
	</div>
</template>

<script setup>
import { usrStore } from '../../../stores/usrStore';
import apiUrl from '../../../../config/config.js';
import { useElementStore } from '../../../utils/Store';
import { useRoute, useRouter } from 'vue-router';



import { ref, onMounted } from "vue";
import axios from "axios";
import { verificarDeportePermitidoCoordinador } from "../../../utils/permisos";
import Loading from '../../dependentComponents/Loading.vue';


const router2 = useRouter()

const router = useRoute()
const idDeporte = router.params.id
const userStore = usrStore()
const rolUsuario = userStore.getRol

const loading = ref(true)

let titulo = ref("Loading...")
let coordinadores = ref([])
let categorias = ref([])

const deporteStore = useElementStore(`deporte${idDeporte}Store`)()
const categoriasDeDeporteStore = useElementStore(`categoriasDeDeporte${idDeporte}Store`)()

onMounted(async () => {
	if (!await verificarDeportePermitidoCoordinador(idDeporte)) {
		router2.push({ path: "/unauthorized" })
	}

	try {
		await deporteStore.fetchElementById(`${apiUrl}/deporte/${idDeporte}/coordinadores`)

		if (deporteStore.currentElement && deporteStore.currentElement.success) {
			titulo.value = deporteStore.currentElement.result.nombre
			coordinadores.value = deporteStore.currentElement.result.CoordinadoresAsignados

			await categoriasDeDeporteStore.fetchElements(`${apiUrl}/categoria/${idDeporte}/deporte`)

			categorias.value = categoriasDeDeporteStore.getElements.result
			categorias.value.sort(comparar);

		} else {
			titulo.value = "Deporte No Encontrado"
		}
	} catch (e) {
		console.log(e)
	} finally {
		loading.value = false
	}

})

const comparar = (a, b) => {
	const valorA = a.nombreCategoria.toLowerCase();
	const valorB = b.nombreCategoria.toLowerCase();

	return valorA.localeCompare(valorB);
};

const nombreCategoria = ref(null)
const messageModal = ref(null);

async function crearCategoria() {
	const nuevaCategoria = {
		nombreCategoria: nombreCategoria.value,
		idDeporte: idDeporte,
	};

	try {
		const response = await axios.post(apiUrl + '/categoria', nuevaCategoria, { withCredentials: true });
		console.log('Respuesta del servidor:', response.data);
		alert("Categoria creada con éxito")
		location.reload()

	} catch (error) {
		const msj = error.response.data.message
		if (msj != 'idProfesores is not iterable') {
			messageModal.value = msj;
		} else {
			location.reload()
		}
	}
};


</script>

<style scoped></style>

