<script setup>
import {axios,dateFormat} from "../functions";
import router from "../router";
import icons from '../assets/icons'
import MasterLayoutVue from "../components/MasterLayout.vue";
import { onMounted, ref } from 'vue';
import Tooltip from "../components/Tooltip.vue";

let forms = ref([])
let embedCode = ref(null)
onMounted(()=>{
    axios.post('forms/fetchLight').then(res=>{
        forms.value = [];
        if(res.data == null || !res.data.success) return;
        forms.value = res.data.result
    })
})

function go(url){
    if(window.location.hostname == '127.0.0.1') window.location.assign(`${import.meta.env.VITE_BASEURL}`+url)
    else window.location.assign(`${import.meta.env.VITE_BASEURL}`+url)
}
    

function deleteForm(id){
    if(!confirm('This action cannot be undone. Continue?')) return;
    axios.post('forms/delete?id='+id).then(res=>{
        window.location.reload();
    });
}

function showEmbedCode(id){
    embedCode.value = 
`<iframe id="pwform" src="${import.meta.env.VITE_BASEURL}form?form_id=${id}">
</iframe>`
}

</script>
<template>
    <MasterLayoutVue>
        <h1 class="text-3xl font-bold mb-4 border-b pb-3">Forms</h1>
        <p class="text-center m-2 italic" v-if="forms.length == 0">No forms created yet...</p>
        <p class="mb-1" v-if="embedCode != null">Copy code below and embed it to your website:</p>
        <textarea v-if="embedCode != null" class="block w-full resize-none border h-[50px] outline-none p-2 rounded-md mb-2" style="font-family:monospace" readonly v-model="embedCode" @click="$event.target.select()">
        </textarea>
        <ul>
          <li class="transition grid bg-white my-1 py-1 px-2 rounded-[4px] border border-gray-300 relative gap-1 items-center hover:scale-[1.005] active:scale-[0.995]" style="grid-template-columns: 1fr 40px 30px;" v-for="f,i in forms" :key="i">
            <p>{{f.book_form_name}} <span class="inline-block relative pl-3 ml-2 text-sm before:content-[''] before:bg-gray-900 before:w-1 before:h-1 before:absolute before:top-[10px] before:rounded-full before:left-0">Created: {{ dateFormat('%lm %d, %y',f.book_form_created) }}</span></p>
            <button title="Embed Form" class="rounded-md hover:scale-105 active:scale-95 transition bg-gray-900  text-white flex justify-center items-center text-[13px] p-2" @click="showEmbedCode(f.book_form_id)"><div class="tooltip-hover"><Tooltip message="Embed Form" /></div>{{ '</>' }}</button>
            <button title="Edit Form" class="rounded-md hover:scale-105 active:scale-95 transition bg-gray-900 text-white flex justify-center items-center p-2" @click="go('form-builder?form_id='+f.book_form_id)"><div class="tooltip-hover"><Tooltip message="Edit Form" /></div><i class="flex justify-center items-center" v-html="icons.pencil"></i></button>
          </li>
        </ul>
        <button class="bg-white mt-2 p-[3px] rounded-md  hover:scale-105 active:scale-95 transition flex items-center" @click="router.push('/form-builder')"><i class="block mr-1" v-html="icons.add"></i>Add New Form</button>
    </MasterLayoutVue>
</template>

<style>
.tooltip-hover{display: none;}
:hover > .tooltip-hover{display: block;}

</style>