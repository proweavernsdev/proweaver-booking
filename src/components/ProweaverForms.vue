<template>
    <div>
        <div id="bookapp-payment-iframe" class="fixed top-0 left-0 bg-black bg-opacity-60 w-screen h-screen z-[100] flex justify-center items-center">
            <div class="max-w-[600px] w-[90%] h-[80vh] bg-white outline">
                <div class="h-[60px] justify-center items-center grid grid-cols-[1fr_30px] p-2 border-b">
                    <h2 class="text-2xl font-bold">Online Payment</h2>
                    <button class="bg-black text-white flex justify-center items-center h-[30px] rounded-full" @click="closeFunction">
                        <i v-html="icons.close"></i>
                    </button>
                </div>
                <iframe class="w-full h-[calc(100%_-_60px)]" :src="iframeUrl" v-if="!paymentSuccessful"></iframe>
                <div v-else class="bg-emerald-200 text-emerald-900 p-2 m-2 rounded-lg flex items-center gap-2">
                    <i v-html="icons.check"></i> Payment Successful. You may now close this pop-up...
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { axios } from '@/functions'
import icons from '@/assets/icons'
import { ref } from 'vue'

const props = defineProps({
    value: {type:String},
    email: {type:String},
    phone: {type:String},
    service: {type:String},
    onsuccess: {type:Function},
    onclose: {type:Function}
})

const paymentSuccessful = ref(false)

const iframeUrl = ref(axios.baseUrl.replace('/pw-bookingapp/api/','')+`/wp-content/plugins/proweaverforms/forms/bookingapp-payment.php?value=${props.value ?? ''}&phone=${props.phone ?? ''}&email=${props.email ?? ''}&service=${props.service ?? ''}`)

function closeFunction(){
    if(props.onclose != null) props.onclose();
}

window.onmessage = (e)=>{
    if(!isValidJSONString(e.data)) return
    const res = JSON.parse(e.data)
    if(res.msg == null || res.msg != 'bookingapp-payment-successful') return

    paymentSuccessful.value = true

    if(props.onsuccess != null) props.onsuccess(res.transaction_id);

}

function isValidJSONString(str) {
  try {
    JSON.parse(str);
    return true;
  } catch (e) {
    return false;
  }
}


</script>

<style scoped>

</style>