<script setup>
import { onMounted, ref, watch,defineEmits } from 'vue';
import { Paypal, axios } from '../functions';

let props = defineProps({
    service: {default:'',type:String},
    paid: {default:'',type:String},
    paymentFunc:{type:Function},
    paymentFuncParams:{type:Array},
    currency: {default:'USD',type:String},
    fieldData: {type:Object}
});

let emit = defineEmits(['onPayment','onLoaded','onEmpty']);

let serviceDetails = ref({})
let fieldData = ref(null)
let refreshPayPalDiv = ref(false)
let lastPaidService = ''

watch(()=>props.service,()=>{
    fetchServiceDetails()
})

function fetchServiceDetails(){
    if(props.service == '' || props.service == null || fieldData.value.options.paypal_value_basis == 'fixed') return;

    axios.post('services/fetch?book_services_name='+props.service).then(res=>{
        serviceDetails.value = res.data.result[0]
        console.log(fieldData.value.options.paypal_value)
        fieldData.value.options.paypal_value = serviceDetails.value.book_services_price
        console.log([0,'',null].includes(fieldData.value.options.paypal_value) && fieldData.value.options.paypal_value_basis != 'fixed')
        if([0,'',null].includes(fieldData.value.options.paypal_value) && fieldData.value.options.paypal_value_basis != 'fixed') {
            emit('onEmpty')
            return
        }else{
            console.log('test')
            emit('onLoaded')
        }
        refreshPayPal();
    })
}

function refreshPayPal(){
    refreshPayPalDiv.value = true;
    setTimeout(()=>{
        refreshPayPalDiv.value = false;
        let payValue = fieldData.value.options.paypal_value
        
        Paypal.mountOn('#pwfv-paypalparent',payValue,props.currency).then(orderId=>{
            let params = props.paymentFuncParams
            props.paymentFunc(params[0],orderId,payValue)
        }).catch(err=>{
            console.assert('Paypal Error:',err)
        })
    },10)
}

onMounted(()=>{
    fieldData.value = JSON.parse(JSON.stringify(props.fieldData))
    if(fieldData.value != null && fieldData.value.options.paypal_value_basis == 'fixed') refreshPayPal();
    else fetchServiceDetails()
})

</script>

<template>
    <div class="pwfv-paypalcont" v-if="['',null].includes(props.paid) && fieldData != null && fieldData.options.paypal_value != null && (fieldData.options.paypal_value_basis == 'fixed' || (fieldData.options.paypal_value_basis == 'service-based' && serviceDetails.book_services_price != null))">
        <div class="pwfv-paypalcontheader">
            <label class="pwfv-fieldlabel">
                <h2> 
                    <small>Payment For:</small>
                    {{ fieldData.options.paypal_value_basis == 'fixed' ? fieldData.label : props.service }}
                </h2>
            </label>
            <span>{{ props.currency}} {{ parseFloat(fieldData.options.paypal_value).toFixed(2) }}</span>
        </div>
        <span class="pwfv-paypalrequired" v-if="fieldData.required">Payment must be received before proceeding.</span>
        <div id="pwfv-paypalparent" v-if="!refreshPayPalDiv"></div>
    </div>

    <div class="pwfv-paypalcont pwfv-paypalsuccess" v-if="fieldData != null && !['',null].includes(props.paid)">
        <div class="pwfv-paypalcontheader">
            <label class="pwfv-fieldlabel">
                <h2> 
                    <small>Payment For:</small>
                    {{ fieldData.options.paypal_value_basis == 'fixed' ? fieldData.label : props.service }}
                </h2>
            </label>
            <span>{{ props.currency }} {{ parseFloat(fieldData.options.paypal_value).toFixed(2) }}</span>
        </div>
        Thank you! Your payment is being processed.
    </div>

</template>

<style>

</style>