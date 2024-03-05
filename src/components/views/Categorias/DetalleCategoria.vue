<template>
    <Loading v-if="this.loading" />
    <div v-else class="container-fluid px-3 px-md-5 mb-5">
        <div class="text text-center">
            <h1>Categoria: <strong>{{ nombreCategoria }}</strong> </h1>
            <h4>Deporte: <strong>{{ deporteCategoria }}</strong> </h4>
        </div>
        <h6 class="my-3"><strong>Profesor/es:</strong></h6>
        <div class="ms-5 mb-0" v-if="profesoresCategoria != 0">
            <button v-for="(profesor, index) in profesoresCategoria" :key="index" class="mb-1 mx-1 btn btn-sm btn-dark"
                @click="verProfesor(profesor.idUsuario)">
                {{ profesor.apellido }}, {{ profesor.nombre }}
            </button>
        </div>
        <div v-else>
            <div class="card fondo-card margenes">
                <div class="card-body" style="border-radius: 10px;">
                    <h6 class="fw-bold text-center">No se encontraron profesores asignados a la categoría</h6>
                </div>
            </div>
        </div>
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
                        <button class="btn btn-danger text-center" type="button" v-on:click="reiniciar">Reiniciar</button>
                        <button class="btn btn-success text-center" type="button" v-on:click="buscar">Buscar</button>
                    </div>
                </div>
                <div class="col text-md-end">
                    <div class="d-flex justify-content-end mt-3 mb-0">
                        <p>Socios encontrados: <strong>{{ this.size }}</strong></p>
                    </div>
                </div>
            </div>
        </form>
        <br>
        <div class="text text-center mb-3"> <code>Solo se muestran los socios asignados a la categoría</code></div>
        <div v-if="listSocios && listSocios.length > 0">
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
                <tbody class="pointer">
                    <tr v-for="socio in sociosFiltados" :key="socio.idSocio" @click="irA(socio.idSocio)">
                        <td class="d-none d-sm-table-cell td-custom">{{ socio.nroSocio }}</td>
                        <td class="td-custom">{{ socio.nombre }} <p class="badge bg-macabi ms-1 my-0" id="socioNuevo"
                                v-if="socio.esNuevoSocio">NUEVO</p>
                        </td>
                        <td class="td-custom">{{ socio.apellido }}</td>
                        <td class="d-none d-sm-table-cell td-custom">{{ socio.dni }}</td>
                        <td class="d-none d-lg-table-cell td-custom2">{{ socio.email }}</td>
                    </tr>
                </tbody>
            </table>
            <div class="text text-start mb-2">
                <p>Socios en la categoría: <strong>{{ this.listSocios.length }}</strong></p>
            </div>

            <div class="text text-center">
                <p class="badge bg-macabi me-2 mb-0">NUEVO</p>
                <br>
                <code>* El socio fue agregado a la categoría dentro de los últimos 7 días</code>
            </div>

        </div>
        <div v-else>
            <div class="card fondo-card margenes">
                <div class="card-body" style="border-radius: 10px;">
                    <h6 class="fw-bold text-center">No se encontraron socios asignados a la
                        categoria</h6>
                </div>
            </div>
        </div>
        <hr>
        <div class="d-flex justify-content-center">
            <router-link :to="`/fechasCategoria/${this.idCategoria}`" class="btn btn-dark">Fechas</router-link>
        </div>
        <div class="text text-center pt-3">
            <code>Añadir o quitar socios <strong>de esta Categoría</strong></code>
        </div>
        <div class="d-flex justify-content-center my-3">
            <div class="btn-group">
                <router-link :to="`/agregarSocio/${this.idCategoria}`" class="btn btn-success">Añadir socios</router-link>
                <router-link :to="`/eliminarSociosCategoria/${this.idCategoria}`" class="btn btn-danger">Quitar
                    socios</router-link>
            </div>
        </div>
        <div class="d-flex justify-content-center mb-5">
            <div class="btn-group">
                <router-link v-if="this.rolUsuario != 'P'" :to="`/modificarCategoria/${this.idCategoria}`"
                    class="btn btn-macabi1">Editar
                    Categoría</router-link>
                <button class="btn btn-dark" @click="volverAtras()">Volver</button>
            </div>
        </div>
        <hr v-if="listSociosCumple && listSociosCumple.length > 0">
        <br v-if="listSociosCumple && listSociosCumple.length > 0">
        <div v-if="listSociosCumple && listSociosCumple.length > 0" class="cumpleanos-box mx-1">
            <h2 class="text-center mb-3">Cumpleaños del Mes de {{ obtenerNombreMes() }}</h2>
            <table class="table table-bordered table-hover mt-3" cumpleanos-table>
                <thead>
                    <tr>
                        <th class="d-none d-md-table-cell">Nombre:</th>
                        <th>Apellido:</th>
                        <th>Cumpleaños:</th>
                    </tr>
                </thead>
                <tbody class="pointer">
                    <tr v-for="socio in listSociosCumple" :key="socio.idSocio" @click="irA(socio.idSocio)">
                        <td class="d-none d-md-table-cell td-custom">{{ socio.nombre }}</td>
                        <td class="td-custom">{{ socio.apellido }}</td>
                        <td class="td-custom"> <b> {{ obtenerFechaFormateada(socio.fechaNacimiento) }} </b>
                            ({{ calcularEdad(socio.fechaNacimiento) }})</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import apiUrl from '../../../../config/config.js';
import { useElementStore } from '../../../utils/Store';
import { verificarAutorizacionCategoria } from '../../../utils/permisos.js'
import { usrStore } from '../../../stores/usrStore';
import { Utils } from "../../../utils/utils"
import Loading from '../../dependentComponents/Loading.vue';

export default {
    setup() {
        const socioStore = useElementStore("categoria")(); // Asegúrate de usar la tienda correcta
        const { currentElement, fetchElementById, elements } = socioStore;
        return { currentElement, fetchElementById, elements };
    },
    components: {
        Loading
    },
    data() {
        return {
            idCategoria: "",
            nombreCategoria: "Categoría No encontrada",
            deporteCategoria: "Deporte No encontrado",
            listSocios: [],
            busqueda: "",
            sociosFiltados: [],
            tipoFiltro: "",
            size: 0,
            profesoresCategoria: [

            ],

            fecha1SemanaAtras: "",
            rolUsuario: "",
            listSociosCumple: [],
            utils: new Utils(),

            loading: true,
            orden: true,
            column: null

        };
    },
    async created() {
        this.idCategoria = this.$route.params.id;
        const userStore = usrStore();
        this.rolUsuario = userStore.getRol
        if (! await verificarAutorizacionCategoria(this.idCategoria)) {
            this.$router.push(`/unauthorized`);

        }

        try {
            let respuesta = await axios.get(`${apiUrl}/categoria/${this.idCategoria}/nombreCategoria`, { withCredentials: true });
            this.nombreCategoria = respuesta.data.nombreCategoria
            let nombreDeporteBuscado = await axios.get(`${apiUrl}/categoria/${this.idCategoria}/nombreDeporte`, { withCredentials: true });
            this.deporteCategoria = nombreDeporteBuscado.data.nombreDeporte
            let respuestaSocios = await axios.get(`${apiUrl}/sociosXCategoria/${this.idCategoria}`, { withCredentials: true });
            let sociosLista = respuestaSocios.data.sociosDatos
            sociosLista.forEach(socio => {
                this.listSocios.push(socio)
                const mesActual = new Date().getMonth() + 1;
                let mesNacimiento = new Date(socio.fechaNacimiento);
                mesNacimiento.setDate(mesNacimiento.getDate() + 1)
                mesNacimiento = mesNacimiento.getMonth() + 1;
                //   mesNacimiento.setDate(mesNacimiento.getDate() + 1)
                if (mesNacimiento === mesActual) {
                    this.listSociosCumple.push(socio);
                }
            });






            this.fecha1SemanaAtras = new Date();
            this.fecha1SemanaAtras.setDate(this.fecha1SemanaAtras.getDate() - 7);
            this.asignarSiEsNuevoUsuarioONo(this.fecha1SemanaAtras, this.listSocios)

            this.sociosFiltados = this.listSocios
            this.size = this.listSocios.length

            try {
                let resultProfes = await axios.get(`${apiUrl}/categoria/${this.idCategoria}/getProfesores`);
                this.profesoresCategoria = resultProfes.data.usuariosList;
            } catch (e) {

            }


        } catch (e) {
        } finally {
            this.loading = false
        }

    },
    methods: {

        asignarSiEsNuevoUsuarioONo(fechaDiaSemanaAnterior, listaSocios) {

            listaSocios.forEach(socio => {

                let fechaRegistroSocio = new Date(socio.fechaRegistro)
                fechaRegistroSocio.setDate(fechaRegistroSocio.getDate() + 1)
                if (fechaRegistroSocio < fechaDiaSemanaAnterior) {
                    socio.esNuevoSocio = false;

                } else {
                    socio.esNuevoSocio = true;
                }

            });

        },
        obtenerNombreMes() {
            const meses = [
                'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
                'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
            ];
            const mesActual = new Date().getMonth();
            return meses[mesActual];
        },


        calcularEdad(fechaNacimiento) {
            const fechaNac = new Date(fechaNacimiento);
            const hoy = new Date();
            const edad = hoy.getFullYear() - fechaNac.getFullYear();


            if ((hoy.getDate() >= fechaNac.getUTCDate())) {
                return `Cumplió ${edad} años`;
            } else {
                return `Cumple ${edad} años`;
            }
        },


        obtenerFechaFormateada(fecha) {
            return this.utils.obtenerFechaFormateada(fecha);
        },


        ordenarListaPorFecha() {
            this.listSociosCumple.sort((a, b) => {
                return new Date(a.fechaNacimiento) - new Date(b.fechaNacimiento);
            });
        },


        verProfesor(profesor) {
            this.$router.push(`/usuarios/${profesor}`);
        },


        irA(id) {
            if (id != 0) {
                this.$router.push(`/socios/${id}`);

            }
        },
        buscar() {
            this.reiniciar();


            if (this.busqueda !== "") {
                this.tipoFiltro = document.getElementById("filtro").value;
                this.sociosFiltados = this.listSocios.filter(item => {
                    let propiedad = item[this.tipoFiltro];
                    let propiedadLowerCase = String(propiedad).toLowerCase();
                    let busquedaLowerCase = String(this.busqueda).toLowerCase();
                    return propiedadLowerCase.includes(busquedaLowerCase);
                });
                this.size = this.sociosFiltados.length || 0;

                if (this.size == 0) {
                    if (this.busqueda !== "") {
                        alert(`No se encontraron socios con el filtro: "${this.tipoFiltro}" y con la búsqueda: "${this.busqueda}"`)
                    }
                    this.reiniciar()
                }
            }






        },
        reiniciar() {
            this.sociosFiltados = this.listSocios;
            this.size = this.sociosFiltados.length || 0
        },

        volverAtras() {
            this.$router.go(-1)
        },

        ordenar(columna) {
            this.orden = !this.orden;
            this.column = columna.toUpperCase()

            const comparar = (a, b) => {
                const factorOrden = this.orden ? -1 : 1;
                const valorA = typeof a[columna] === 'number' ? a[columna] : a[columna].toLowerCase();
                const valorB = typeof b[columna] === 'number' ? b[columna] : b[columna].toLowerCase();

                if (valorA < valorB) return -1 * factorOrden;
                if (valorA > valorB) return 1 * factorOrden;
                return 0;
            };

            if (this.size != 0) {
                this.sociosFiltados.sort(comparar);
            }
        }
    },
};
</script>

<style scoped>
.fondo-card {
    background-color: #f8d7da;
    border-color: #f0959e;
    color: #723b47;
    border-width: 2px;
    border-style: solid;
    border-radius: 4px;
    padding: 8px;
}

.margenes {
    margin-left: 6%;
    margin-right: 6%;
}

@media (min-width: 800px) {
    .margenes {
        margin-left: 30%;
        margin-right: 30%;
    }
}

#explicacion {
    color: red;
}


#socioNuevo {
    color: white;
}

.pointer {
    cursor: pointer;
}


/* En tu archivo de estilos (por ejemplo, styles.css) */
.cumpleanos-box {
    /* Ajusta el margen según sea necesario */
    padding: 15px;
    border: 4px solid #013a77;
    /* Color del borde del cuadro */
    border-radius: 10px;
    /* Esquinas redondeadas */
}


.cumpleanos-table th,
.cumpleanos-table td {
    border: 5px solid #013a77;
    /* Color del borde de las celdas de la tabla */
    padding: 8px;
}


@media (max-width: 767px) {
    .cumpleanos-box {
        margin: 10px;
        padding: 10px;
    }

    .cumpleanos-table th,
    .cumpleanos-table td {
        padding: 6px;
    }
}


@media (max-width: 479px) {
    .cumpleanos-box {
        margin: 5px;
        padding: 5px;
    }


    .cumpleanos-table th,
    .cumpleanos-table td {
        padding: 4px;
    }
}

.bg-macabi {
    background-color: #004896;
}
</style>


