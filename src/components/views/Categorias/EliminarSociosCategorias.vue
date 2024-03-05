<template>
    <Loading v-if="this.loading" />
    <div v-else class="container-fluid  mb-5 px-md-5">
        <div class="text text-center">
            <h2>Eliminar socios de la Categoria: <strong>{{ nombreCategoria }}</strong> </h2>
            <h4>Deporte: <strong>{{ deporteCategoria }}</strong> </h4>
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
        <div v-if="listSocios && listSocios.length > 0">
            <table class="table table-bordered table-hover ">
                <thead>
                    <tr>
                        <th class="d-none d-sm-table-cell">NroSocio:
                            <button class="btn bg-success" @click="ordenar('nroSocio')"></button>
                        </th>
                        <th>Nombre:</th>
                        <th>Apellido:</th>
                        <th class="d-none d-sm-table-cell">Dni:
                            <button class="btn bg-success" @click="ordenar('dni')"></button>
                        </th>
                        <th>Eliminar</th>
                    </tr>
                </thead>
                <tbody class="pointer">
                    <tr v-for="socio in sociosFiltados" :key="socio.idSocio">
                        <td @click="irA(socio.idSocio)" class="d-none d-sm-table-cell">{{ socio.nroSocio }}</td>
                        <td @click="irA(socio.idSocio)">{{ socio.nombre }} <label class="btn-group" id="socioNuevo"
                                v-if="socio.esNuevoSocio">"NUEVO"</label> </td>
                        <td @click="irA(socio.idSocio)">{{ socio.apellido }}</td>
                        <td @click="irA(socio.idSocio)" class="d-none d-sm-table-cell">{{ socio.dni }}</td>
                        <td><button @click="eliminarSocio(socio.idSocio)" class="btn btn-danger"><svg
                                    xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                    class="bi bi-trash" viewBox="0 0 16 16">
                                    <path
                                        d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6Z" />
                                    <path
                                        d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1ZM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118ZM2.5 3h11V2h-11v1Z" />
                                </svg></button></td>
                    </tr>
                </tbody>

            </table>
            <p>Socios en la categoria: <strong>{{ this.listSocios.length }}</strong></p>
        </div>
        <div v-else class="text text-center fw-bold h3 alert alert-danger">No se encontraron socios asignados a la categoria
        </div>
        <br>
        <div class="d-flex justify-content-center mb-3">

        </div>
        <div class="d-flex justify-content-center">
            <div class="btn-group">

                <button class="btn btn-dark" @click="volverAtras()">Volver</button>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import apiUrl from '../../../../config/config.js';
import { useElementStore } from '../../../utils/Store';
import { useRouter } from "vue-router";
import { verificarAutorizacionCategoria } from '../../../utils/permisos.js'
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
            nombreCategoria: "nombreCategoria",
            deporteCategoria: "nombreDeporteCategoria",
            listSocios: [],
            busqueda: "",
            sociosFiltados: [],
            tipoFiltro: "",
            size: 0,
            orden: 0,
            router: useRouter(),
            profesoresCategoria: [

            ],
            fecha1SemanaAtras: "",

            loading: true

        };
    },
    async created() {
        this.idCategoria = this.$route.params.id;
        try {
            if (! await verificarAutorizacionCategoria(this.idCategoria)) {
                this.$router.push(`/unauthorized`);

            }
            let respuesta = await axios.get(`${apiUrl}/categoria/${this.idCategoria}/nombreCategoria`, { withCredentials: true });
            this.nombreCategoria = respuesta.data.nombreCategoria
            let nombreDeporteBuscado = await axios.get(`${apiUrl}/categoria/${this.idCategoria}/nombreDeporte`, { withCredentials: true });
            this.deporteCategoria = nombreDeporteBuscado.data.nombreDeporte
            //console.log(this.deporteCategoria);
            let respuestaSocios = await axios.get(`${apiUrl}/sociosXCategoria/${this.idCategoria}`, { withCredentials: true });
            let sociosLista = respuestaSocios.data.sociosDatos
            sociosLista.forEach(socio => {
                this.listSocios.push(socio)
            });


            this.sociosFiltados = this.listSocios;
            this.size = this.listSocios.length


            // console.log("Los profesores son: " + this.profesoresCategoria);


        } catch (e) {
            console.log("catch");
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
        async eliminarSocio(idSocio) {

            if (confirm("¿Eliminar al socio de la categoria?")) {
                try {
                    this.loading = true
                    await axios.delete(`${apiUrl}/sociosXCategoria/${this.idCategoria}/${idSocio}/eliminarDeCategoria`, { withCredentials: true });

                    alert("Socio eliminado de la categoria")
                    location.reload();
                } catch (e) {
                    console.log(e);
                }
            } else {
                alert('Se canceló la operación');

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

                //console.log(this.sociosFiltados);

                this.size = this.sociosFiltados.length || 0;
            }






        },
        reiniciar() {
            this.sociosFiltados = this.listSocios;
            this.size = this.listSocios.length
        },
        ordenar(columna) {
            this.orden = !this.orden

            this.sociosFiltados.sort((a, b) => {
                let factorOrden = this.orden ? -1 : 1;
                if (a[columna] < b[columna]) return -1 * factorOrden;
                if (a[columna] > b[columna]) return 1 * factorOrden;
                return 0;
            });
        },
        volverAtras() {
            this.$router.go(-1)
        },
        irA(id) {
            if (id != 0) {
                this.router.push(`/socios/${id}`);
            }
        }
    },
};
</script>

<style scoped>
#explicacion {
    color: red;
}

#socioNuevo {
    background-color: blue;
    color: white;
    padding: 5px;
    margin-left: 30px;

}</style>
