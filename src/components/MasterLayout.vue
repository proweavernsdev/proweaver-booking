<script setup>
import icons from '../assets/icons';
import {ref} from 'vue';
import { lStore } from '../functions'
import router from '../router';

const companyName = import.meta.env.VITE_COMPNAME
let isSideBarOpened = ref(true);
let modal = ref({
    open:false
})

function logout(){
    if(!confirm('Log out current session?')) return;
    delete lStore.token;
    router.go('/login')
}


</script>

<template>
    
    <div id="app-parent" class="flex content-start flex-wrap h-screen items-start">
        <header class="p-3 bg-gray-900 w-full flex items-center gap-5 text-white">
            <h2 class="text-2xl font-bold text-white">{{companyName}} | Booking App</h2>
            <button class="transition bg-gray-700 rounded-md hover:scale-105 active:scale-95" @click="isSideBarOpened = !isSideBarOpened">
                <i class="block p-2" v-html="icons.menu2"></i>
            </button>
        </header>
        <aside style="height: calc(100% - 65px); transition: 0.4s; left:0;z-index: 1;" :style="!isSideBarOpened ? 'width:50px':''" class="w-[300px] bg-gray-100 overflow-hidden absolute top-[65px]" :class="(isSideBarOpened) ? '' : 'p-0'">
            <ul>
                <li><RouterLink to="/scheduler" class="transition p-3 flex items-center border-b border-gray-300 active:scale-95 hover:bg-gray-700 hover:text-white" style="transition:0.2s" :style="(isSideBarOpened) ? '' : 'font-size:0'"><i class="block mr-3" v-html="icons.calendar"></i>Scheduler</RouterLink></li>
                <li><RouterLink to="/appointments" class="transition p-3 flex items-center border-b border-gray-300 active:scale-95 hover:bg-gray-700 hover:text-white" style="transition:0.2s" :style="(isSideBarOpened) ? '' : 'font-size:0'"><i class="block mr-3" v-html="icons.que"></i>Appointments</RouterLink></li>
                <li><RouterLink to="/forms" class="transition p-3 flex items-center border-b border-gray-300 active:scale-95 hover:bg-gray-700 hover:text-white" style="transition:0.2s" :style="(isSideBarOpened) ? '' : 'font-size:0'"><i class="block mr-3" v-html="icons.wrench"></i>Forms</RouterLink></li>
                <li><RouterLink to="/preferences" class="transition p-3 flex items-center border-b border-gray-300 active:scale-95 hover:bg-gray-700 hover:text-white" style="transition:0.2s" :style="(isSideBarOpened) ? '' : 'font-size:0'"><i class="block mr-3" v-html="icons.gear"></i>Preferences</RouterLink></li>
                <li><RouterLink to="/" class="transition p-3 flex items-center border-b border-gray-300 active:scale-95 hover:bg-gray-700 hover:text-white" style="transition:0.2s" :style="(isSideBarOpened) ? '' : 'font-size:0'" @click.prevent="logout"><i class="block mr-3" v-html="icons.logout"></i>Log Out</RouterLink></li>
            </ul>
        </aside>
        <div id="main_content" class="p-5 text-gray-900 ml-auto overflow-auto" style="height: calc(100vh - 75px);width: calc(100% - 300px); transition: 0.4s" :style="!isSideBarOpened ? 'width:calc(100% - 50px)':''">
            <slot />
        </div>
    </div>
</template>
