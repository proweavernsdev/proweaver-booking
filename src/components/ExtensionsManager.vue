<script setup>
import { ref } from 'vue';
import CustomField from './SchedulerComps/CustomField.vue';

let extensions = ref([
    {
        "book_ext_id" : 1,
        "book_ext_name": "PayPal Checkout",
        "book_ext_fields":{
            "book_extcnf_client_id":{
                "label":"Client ID",
                "field_placeholder": "PayPal Client ID",
                "field_type":"text",
                "field_values": "",
                "field_value":"dsfdsfsdf"
            }            
        },
        "book_ext_data":{},
        "book_ext_availed":0,
    }
]);
let selectedExt = ref(null)


let props = defineProps({

})

function saveValue(i,type,e){
    if(type=="checkbox-group") selectedExt.value.book_ext_fields[i].field_select = e;
    else selectedExt.value.book_ext_fields[i].field_value = e;
}

</script>

<template>
    <div class="grid gap-2" style="grid-template-columns: 250px 1fr;">
        <div class="shadow-inner shadow-gray-50 border p-2">
            <div v-for="e,i in extensions" class="transition border border-gray-500 p-1 rounded text-sm hover:bg-gray-500 hover:text-white active:bg-gray-900 select-none" @click="selectedExt = JSON.parse(JSON.stringify(e))">
                {{ e.book_ext_name }}
            </div>
        </div>
        <div v-if="selectedExt != null" class="p-2 text-gray-700">
            <h2 class="font-bold mb-2">{{ selectedExt.book_ext_name }}</h2>
            <div>
                <div v-for="sef,i in selectedExt.book_ext_fields">
                    <label class="mt-2 mb-1 block">{{ sef.label }}</label>
                    <CustomField
                        :type="sef.field_type"
                        :values="sef.field_values"
                        :name="i"
                        :placeholder="sef.field_placeholder"
                        :select="sef.field_select"
                        :value="sef.field_value"
                        :columns="sef.field_columns"
                        @on-result="e=>saveValue(i,sef.field_type,e)"
                    />
                </div>
            </div>
            
            <button class="bg-green-700 text-white p-1 px-2 rounded mt-2 hover:scale-105 active:scale-95 transition">Save Changes</button>
        </div>
    </div>
    

</template>