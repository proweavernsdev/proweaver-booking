<template>
    <div id="printparent" v-html="lStore.printHtml">
    </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { lStore } from '../functions';
import router from '../router';
onMounted(()=>{
    window.print()
    router.go(-1)
})
</script>

<style scoped>
#printparent{padding: 20px;}
</style>