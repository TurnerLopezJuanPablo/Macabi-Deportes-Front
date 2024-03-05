<template>
	<Loading v-if="loading" />

	<div v-else class="container mb-5">

		<div class="sub_container_title">{{ titulo }}</div>

		<div v-if="existeCategoria">

			<div class="sub_container_sub_title"> Fechas de la Categoria</div>

			<div class="month-selector">

				<div class="btn_mes" @click="cambiarFecha(-1, 'year')">
					<svg width="800px" height="800px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path d="M19 19L12.7071 12.7071C12.3166 12.3166 12.3166 11.6834 12.7071 11.2929L19 5"
							stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
						<path d="M11 19L4.70711 12.7071C4.31658 12.3166 4.31658 11.6834 4.70711 11.2929L11 5"
							stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
					</svg>
				</div>

				<div class="btn_mes iz" @click="cambiarFecha(-1, 'month')">
					<svg width="800px" height="800px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path d="M15.5 19L9.20711 12.7071C8.81658 12.3166 8.81658 11.6834 9.20711 11.2929L15.5 5"
							stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
					</svg>
				</div>

				<div class="sub_container_sub_title mes">{{ mesSelected }}</div>

				<div class="btn_mes dr" @click="cambiarFecha(1, 'month')">
					<svg width="800px" height="800px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path d="M9.5 5L15.7929 11.2929C16.1834 11.6834 16.1834 12.3166 15.7929 12.7071L9.5 19"
							stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
					</svg>
				</div>

				<div class="btn_mes dr" @click="cambiarFecha(1, 'year')">
					<svg width="800px" height="800px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path d="M5.5 5L11.7929 11.2929C12.1834 11.6834 12.1834 12.3166 11.7929 12.7071L5.5 19"
							stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
						<path d="M13.5 5L19.7929 11.2929C20.1834 11.6834 20.1834 12.3166 19.7929 12.7071L13.5 19"
							stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
					</svg>
				</div>
			</div>
			<br>
			<div class="d-flex justify-content-between align-items-center">
				<p class="">Fechas en total: <strong>{{ cantFechasToShow }}</strong></p>
			</div>

			<div v-if="fechasToShow !== null">
				<table class="tabla_macabi1">
					<thead>
						<tr>
							<th class="big">Fecha Calendario:</th>
							<th class="big">Tipo:</th>
							<th class="small">Fechas:</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="fecha in fechasToShow" :key="fecha.idFecha" class="resaltable"
							@click="$router.push(`/fechas/${fecha.idFecha}`);">
							<td class="show_data_cell" data-cell="Fecha Calendario">{{
								utils.obtenerFechaFormateada(fecha.fechaCalendario) }}</td>
							<td class="show_data_cell" data-cell="Tipo">{{ mapearTipo(fecha.tipo) }}</td>
						</tr>
						<tr v-if="!fechaDeCategoriaStore.getElements">
							<td colspan="2" style="text-align: center;"> No hay Fechas en la Categoria</td>
						</tr>
						<tr v-else-if="fechasToShow.length == 0">
							<td colspan="2" style="text-align: center;"> No hay Fechas para el rango seleccionado en esta
								categoria </td>
						</tr>
					</tbody>

				</table>
			</div>

			<div style="margin-top: 27px;" class="sub_container_sub_title"> Socios de la Categoria</div>
			<br>
			<div class="d-flex justify-content-between align-items-center">
				<p class="">Socios asignados a categoria: <strong>{{ cantSociosToShow }}</strong></p>
			</div>

			<div v-if="sociosToShow !== null">
				<table class="tabla_macabi1 socios_table">
					<thead>
						<tr>
							<th class="big">Numero Socio</th>
							<th class="big">Nombre</th>
							<th class="big">DNI</th>
							<th class="big" style="width: 8%;">Total</th>
							<th class="big" style="width: 6%;">P</th>
							<th class="big" style="width: 6%;">A</th>
							<th class="big" style="width: 6%;">J</th>
							<th class="big" style="width: 7%;">N/A</th>
							<th class="big text-center" style="width: 11%;">%</th>
							<th class="small">Socios:</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="socio in sociosToShow" class="resaltable"
							@click="router.push(`/socios/${socio.idSocio}`)">

							<td class="big" data-cell="Id">{{ socio.nroSocio }}</td>
							<td class="show_data_cell" data-cell="Nombre">{{ socio.apellido }}, {{ socio.nombre }}</td>
							<td class="show_data_cell" data-cell="Dni">{{ socio.dni }}</td>

							<td class="show_data_cell" data-cell="Total" style="font-weight: bold;">
								<span>
									{{ socio.Fechas.length }}
								</span>
							</td>

							<td class="big" data-cell="P" style="font-weight: bold;">
								<span class="text-success text-center">
									{{ socio.asistencia.P }}
								</span>
							</td>
							<td class="big" data-cell="A" style="font-weight: bold;">
								<span class="text-danger">
									{{ socio.asistencia.A }}
								</span>
							</td>
							<td class="big" data-cell="J" style="font-weight: bold;">
								<span class="text-warning">
									{{ socio.asistencia.J }}
								</span>
							</td>

							<td class="small2" style="font-weight: bold;">
								<div style="text-align: start;">
									P:
									<span class="text-success text-center">
										{{ socio.asistencia.P }}
									</span>
								</div>
								<div style="text-align: start;">
									A:
									<span class="text-danger">
										{{ socio.asistencia.A }}
									</span>
								</div>
								<div style="text-align: start;">
									J:
									<span class="text-warning">
										{{ socio.asistencia.J }}
									</span>
								</div>

							</td>
							<td class="show_data_cell" data-cell="N/A" style="font-weight: bold;">
								<span class="text-secondary">
									{{ socio.asistencia["N/A"] }}
								</span>
							</td>
							<td class="show_data_cell" data-cell="Asistencia"
								style="font-weight: bold; display: flex; align-items: center; justify-content: space-between;">
								<div class="vertical-bar-container">
									<div class="vertical-bar"
										:style="{ backgroundColor: barColor(+socio.asistencia.presentismo) }">
										<div class="percentage-label">{{ socio.asistencia.presentismo }}%</div>
									</div>
								</div>
							</td>

						</tr>
						<tr v-if="!sociosDeCategoriaStore.getElements">
							<td colspan="9" style="text-align: center;"> No hay Socios en la Categoria</td>
						</tr>
						<tr v-else-if="sociosToShow.length == 0">
							<td colspan="9" style="text-align: center;"> No hay Asistencias de ningun Socio en la fecha
								seleccionada </td>
						</tr>

					</tbody>

				</table>

			</div>

		</div>

		<div class="sub_container_buttons2">
			<div class="btn-group">
				<button @click="nuevaFecha" class="btn btn-primary primary-macabi">
					Crear fecha
				</button>

				<button class="btn btn-dark" @click="router.go(-1)">Volver
				</button>
			</div>
		</div>
		<br>
	</div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useElementStore } from '../../../utils/Store';
import { useRoute, useRouter } from 'vue-router';
import apiUrl from '../../../../config/config.js'
import { verificarAutorizacionCategoria } from "../../../utils/permisos";
import Loading from '../../dependentComponents/Loading.vue';

import moment from "moment";
import 'moment/dist/locale/es'

import { Utils } from '../../../utils/utils.js'


const loading = ref(true)

const utils = new Utils()

const titulo = ref("Loading....")

const route = useRoute()
const router = useRouter()
const idCategoria = route.params.id;

let existeCategoria = false

const categoriaStore = useElementStore(`categoria${idCategoria}Store`)();
const fechaDeCategoriaStore = useElementStore(`fechasCategoria${idCategoria}Store`)();
const sociosDeCategoriaStore = useElementStore(`sociosDeCategoria${idCategoria}Store`)();

const cantFechasToShow = ref(0);
const cantSociosToShow = ref(0);
const fechasToShow = ref([]);
const sociosToShow = ref([]);

let objMoment
let idsFechasSelected = new Set()

const mesSelected = ref('.....')

onMounted(async () => {

	initDate()

	fechaDeCategoriaStore.elements = null
	fechaDeCategoriaStore.currentElement = null
	await fetchCategoria()

	if (!await verificarAutorizacionCategoria(idCategoria)) {
		router.push({ path: "/unauthorized" })
	}


	loading.value = false

});


function initDate() {
	if (sessionStorage.getItem(`preSelectedDateFLC${idCategoria}`)) {
		objMoment = moment(sessionStorage.getItem(`preSelectedDateFLC${idCategoria}`), 'MMMM YYYY');
	} else {
		objMoment = moment()
	}
	mesSelected.value = objMoment.format('MMMM YYYY')
}

async function fetchCategoria() {
	//carga la categoria, si no hay categoria es que el id esta mal, por lo que todo esta mal
	await categoriaStore.fetchElements(`${apiUrl}/categoria/${idCategoria}`)

	if (categoriaStore.getElements && categoriaStore.getElements.result && categoriaStore.getElements.result.Deporte) {
		titulo.value = `${categoriaStore.getElements.result.Deporte.nombre} "${categoriaStore.getElements.result.nombreCategoria}"`
		await fetchFechas()
		await fetchSocios()
		existeCategoria = true
	} else {
		titulo.value = `La categoria no existe`
	}
}

async function fetchSocios() {
	await sociosDeCategoriaStore.fetchElements(`${apiUrl}/categoria/${idCategoria}/getSociosWithAsistencia`)
	if (sociosDeCategoriaStore.getElements && sociosDeCategoriaStore.getElements.result) {
		showSocios()
	} else {
		//manejar Error no hay socios
	}
}

async function fetchFechas() {
	await fechaDeCategoriaStore.fetchElements(`${apiUrl}/categoria/${idCategoria}/getFechas`)

	if (fechaDeCategoriaStore.getElements && fechaDeCategoriaStore.getElements.result) {
		showFechas()
	} else {
		//manejar Error no hay fechas
	}
}

function showFechas() {

	const minDate = objMoment.clone().startOf('month')
	const maxDate = objMoment.clone().endOf('month')

	let fechasFiltered = fechaDeCategoriaStore.getElements.result.Fechas.filter(fechaCat => {
		let fechaCatMoment = moment(fechaCat.fechaCalendario)
		return fechaCatMoment >= minDate && fechaCatMoment <= maxDate
	}).sort((a, b) => {
		return moment(a.fechaCalendario) - moment(b.fechaCalendario);
	});

	fechasToShow.value = fechasFiltered
	cantFechasToShow.value = fechasFiltered.length

	idsFechasSelected = new Set(fechasFiltered.map(x => x.idFecha))
}

function showSocios() {

	let sociosProcesados = sociosDeCategoriaStore.getElements.result
		.filter(socio => {
			return socio.Fechas.some(fecha => {
				return idsFechasSelected.has(fecha.idFecha)
			});
		})
		.map((socio) => {
			const fechasFiltradas = socio.Fechas.filter(fecha => {
				return idsFechasSelected.has(fecha.idFecha)
			});
			return { ...socio, Fechas: fechasFiltradas };
		});

	const comparar = (a, b) => {
		const valorA = a.apellido.toLowerCase();
		const valorB = b.apellido.toLowerCase();

		return valorA.localeCompare(valorB);
	};

	//console.log("🚀 ~ file: FechasListCategoria.vue:274 ~ showSocios ~ value:", mapAsistencia(sociosProcesados) )
	sociosToShow.value = mapAsistencia(sociosProcesados)
	sociosToShow.value.sort(comparar)

	cantSociosToShow.value = sociosProcesados.length
}


function mapAsistencia(inputData) {
	return inputData.map((socio) => {
		const counts = socio.Fechas.reduce(
			(acc, fecha) => {
				const estado = fecha.Asistencia?.estado;
				acc[estado || 'N/A']++;
				return acc;
			},
			{ P: 0, A: 0, J: 0, 'N/A': 0 }
		);

		const total = counts.P + counts.A + counts.J + counts['N/A'];
		const totalSinNA = counts.P + counts.A + counts.J
		const presentismo = total === 0 ? 'N/A' : ((counts.P / totalSinNA) * 100).toFixed(2);

		return {
			...socio,
			asistencia: {
				...counts,
				total,
				totalSinNA,
				presentismo,
			},
		};
	});
}

function cambiarFecha(cant, tipe) {
	objMoment.add(cant, tipe)
	mesSelected.value = objMoment.format('MMMM YYYY')

	sessionStorage.setItem(`preSelectedDateFLC${idCategoria}`, mesSelected.value)

	showFechas();
	showSocios()
}

function mapearTipo(tipo) {
	if (tipo === 'C') {
		return 'Citación';
	} else if (tipo === 'E') {
		return 'Entrenamiento';
	} else {
		return 'Tipo Desconocido';
	}
}

function nuevaFecha() {
	router.push({ path: "/crearfecha/" + idCategoria });
}

function getCountOfDateTipe(character, dateArray) {

	let count = 0


	dateArray.forEach(fecha => {
		if (fecha.Asistencia.estado == character) {
			count++
		}
	});


	return count

}
function barColor(presentismo) {
	if (presentismo === 100) {
		return '#4CAF50'; // Green
	} else if (presentismo > 60) {
		return '#FFC107'; // Yellow
	} else {
		return '#FF5252'; // Red
	}
}


function barHeight(presentismo) {
	if (presentismo === 100) {
		return 100
	} else if (presentismo > 60) {
		return 90
	} else {
		return 80;
	}
}



</script>

<style scoped>
.tabla_macabi1 .small2 {
	display: none;
}

@media screen and (max-width:1000px) {
	.tabla_macabi1 .small2 {
		display: grid;
		grid-template-columns: 1fr 1fr 1fr;
	}

	.socios_table td {
		padding: 0.5rem 1rem;
	}

}



.mes {
	display: flex;
}

.month-selector {
	display: flex;
	justify-content: center;
	align-items: center;
	user-select: none;
	cursor: context-menu;
}

.month-selector svg {
	height: 30px;
	width: 30px;
}

.btn_mes {
	display: flex;
	justify-content: center;
	align-items: center;
	cursor: pointer;
	padding: 15px;
	border-radius: 25px;
}

.btn_mes:hover {
	background-color: rgba(82, 82, 82, 0.1);

}

.iz {
	margin-right: 20px;
}

.dr {
	margin-left: 20px;
}

@media (max-width: 410px) {
	.iz {
		margin-right: 0px;
	}

	.dr {
		margin-left: 0px;
	}
}

.vertical-bar-container {
	display: flex;
	flex-direction: column-reverse;
	align-items: center;
	height: 35px;
}

.vertical-bar {
	position: relative;
	width: 60px;
	border-radius: 8px;
	transition: height 0.5s ease;
	height: 100%;
}

.percentage-label {
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	color: white;
	font-weight: bold;
	font-size: 14px
}
</style>