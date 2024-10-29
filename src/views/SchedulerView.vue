<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import MasterLayoutVue from "../components/MasterLayout.vue";
import SchedulerCalendar from '../components/SchedulerV2/SchedulerCalendar.vue';
import moment from 'moment-timezone';

// Create a ref to store the current time in New York
const newYorkTime = ref('');

// Detect user's timezone
const userTimezone = moment.tz.guess();

console.log(userTimezone);

// Function to update the New York time every second
const updateNewYorkTime = () => {
    newYorkTime.value = moment.tz('America/New_York').format('MMMM Do YYYY, h:mm:ss A z');
};

let intervalId;

onMounted(() => {
    // Always update the New York time regardless of user timezone
    updateNewYorkTime();
    intervalId = setInterval(updateNewYorkTime, 1000);
});

// Clear interval on unmount to avoid memory leaks
onUnmounted(() => {
    clearInterval(intervalId);
});
</script>

<template>
    <MasterLayoutVue>
        <div class="flex border-b pb-3">
            <div class="flex-1">
                <h1 class="text-3xl font-bold">Scheduler</h1>
            </div>
            <!-- Display the New York time regardless of user timezone -->
            <div v-if="userTimezone !== 'America/New_York'">
                <h2 class="text-2xl font-bold">{{ newYorkTime }}</h2>
            </div>
        </div>

        <SchedulerCalendar />
    </MasterLayoutVue>
</template>