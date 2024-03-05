<template>
	<Navbar />
	<div class="contenedor">
		<div class="componentes pt-5">
			<RouterView></RouterView>
		</div>
	</div>
	<Footer />
</template>

<script setup>
import { usrStore } from './stores/usrStore.ts'
import { onMounted } from "vue";
import Footer from "./components/dependentComponents/Footer.vue";
import Navbar from "./components/dependentComponents/Navbar.vue";

const usuarioStore = usrStore()

/*
onMounted(async () => {
	await usuarioStore.reiniciarSesion()
})
*/
</script>

<style scoped>
.componentes {
	display: flex;
	align-content: center;
	justify-content: center;
	flex-direction: column;
	align-items: center;


	overflow-x: hidden;
	height: auto;
	padding-top: 20px;
	padding-bottom: 100px;
	flex: 0;
}

.contenedor {
	display: flex;
	flex-direction: column;
	min-height: 110vh;

	background-image: url("../src/assets/coloredShapes.svg");

}
</style>

