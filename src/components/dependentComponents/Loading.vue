<template>
    <div :class="currentClass"></div>
    <br>
    <p class="h2">Cargando...</p>
</template>
  
<script>
export default {
    data() {
        return {
            currentIndex: 0,
            classes: [
                'spinner-border spinner-border-lg text-success loading',
                'spinner-border spinner-border-lg text-warning loading',
                'spinner-border spinner-border-lg text-danger loading',
                'spinner-border spinner-border-lg text-info loading',
            ],
        };
    },
    computed: {
        currentClass() {
            return this.classes[this.currentIndex];
        },
    },
    created() {
        setInterval(() => {
            this.currentIndex = (this.currentIndex + 1) % this.classes.length;
        }, 500);
    },
};
</script>  

<style scoped>
.loading {
    height: 10rem;
    width: 10rem;
    border: 1em solid currentColor;
    border-right-color: transparent;
    transition: 0.5s;
}
</style>
  