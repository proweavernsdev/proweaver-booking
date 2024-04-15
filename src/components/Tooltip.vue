<script setup>
// data
// defines
let props = defineProps({
    message:{type:String,default:'Test Tooltip'}
})
// onmount
// watch
// methods
</script>


<template>
    <div class="relative">
        <div class="absolute bg-gray-900 text-white max-w-[150px] min-w-[30px] text-xs bottom-[100%] p-1 pwba-tooltip rounded">
            {{ props.message}}
        </div>
    </div>
    
</template>



<style scoped>
.pwba-tooltip{
    left:50%;
    transform: translateX(-50%);
}
.pwba-tooltip:after{
    content:"";
    position: absolute;
    background: rgb(17 24 39);
    clip-path: polygon(50% 100%, 0 0, 100% 0);
    width: 20px;
    height: 5px;
    top:100%;
    left:50%;
    transform: translateX(-50%);
}
</style>