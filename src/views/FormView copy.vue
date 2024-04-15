<script setup>
import {onMounted, ref,watch} from 'vue'
import TemplatedFields from '../components/TemplatedFields.vue'
import {hexToHsl} from '../functions'

let props = defineProps({
    form:{type:Object}
})


let form = ref(props.form)
let styles = ref(props.form.design)
let currentPageIndex = ref(0);
let defColorA = ref({
    'background' : styles.value.primaryColor,
    'color' : fgColor(styles.value.primaryColor)
})
let formRefresh = ref(false);

onMounted(()=>{
})

watch(()=>form.value,()=>{
  refreshForm()
},{deep:true})

function filteredByColumn(col){
    if(props.form.pages[currentPageIndex.value].page_columns == 1 && col ==1) return props.form.pages[currentPageIndex.value].page_fields
    else if (props.form.pages[currentPageIndex.value].page_columns == 1 && col ==2) return [];
    else return props.form.pages[currentPageIndex.value].page_fields.filter(el=>el.column == col) 
}

function fgColor(color) {
  const hslColor = hexToHsl(color);
  if(hslColor.l > 50) return '#222222';
  else return '#ffffff';
}

function refreshForm(){
    formRefresh.value = true;
    form.value = props.form
    styles.value = props.form.design
    currentPageIndex.value = 0;
    defColorA.value = {
        'background' : styles.value.primaryColor,
        'color' : fgColor(styles.value.primaryColor)
    }
  setTimeout(()=>formRefresh.value=false,10)
}

</script>
<template>
    <div id="pwfv-form-parent" class="max-w-[1000px] m-auto bg-white overflow-hidden rounded-md" v-if="!formRefresh">
        <h2 id="pwfv-form-title" :style="defColorA">{{ form.form_title }}</h2>
        <div id="pwfv-form-body" class="flex" :style="{
            'flex-direction' : styles.pagenavDesign
        }">
            <div class="min-w-[300px] p-3" :class="{'w-[100%]':styles.pagenavDesign == 'column'}" id="pwfv-form-pagenav">
                <ul>
                    <li v-for="p,i in form.pages" :key="i" class="flex items-center gap-2 hover:shadow-lg">
                        <small class="w-[20px] inline-block text-center rounded-full " :style="defColorA">
                            {{i+1}}</small>
                        {{ p.page_title }}</li>
                </ul>
            </div>
            <div class="grow p-3" id="pwfv-form-pageview">
                <div class="grid" id="pwfv-form-pageviewgrid" :class="'grid-cols-'+props.form.pages[currentPageIndex].page_columns">
                    <div class="mb-3" v-for="f,i in filteredByColumn(1) " :key="i" >
                        <div v-if="f.content_type == 'text'" v-html="f.text" :style="f.styles"></div>
                        <div v-if="f.content_type == 'field'">
                            {{ f }}
                        </div>
                        <div v-else>
                            <label :for="f.name">{{ f.label }}</label>
                        </div>
                    </div>
                    <div class="mb-3" v-show="props.form.pages[currentPageIndex].page_columns == 2" v-for="f,i in filteredByColumn(2) " :key="i" >
                        <div v-if="f.content_type == 'text'" v-html="f.text" :style="f.styles"></div>
                        <div v-if="f.content_type == 'field'">
                            <TemplatedFields
                                :type="f.type"
                                :name="f.name"
                                :value="f.value"
                                :readonly="f.readonly"
                                :required="f.required"
                                :placeholder="f.placeholder"
                                :values="f.values"
                                :select="f.select"
                                :options="f.options"
                                :index="f.index"
                                :styles="f.styles"
                                :color="defColorA.background"
                            />
                        </div>
                        <div v-else>
                            <label :for="f.name">{{ f.label }}</label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>    
</template>

<style scoped>
/* text-2xl font-bold p-5 bg-gray-700 text-white */
#pwfv-form-title{
    font-size: 25px;
    padding:20px;
    font-weight: 700;
}

#pwfv-form-pagenav{
    box-shadow:  inset 0 0 15px -3px rgb(0 0 0 / 0.1), inset 0 0px 3px -4px rgb(0 0 0 / 0.1);
}

#pwfv-form-pagenav ul{

}

#pwfv-form-pagenav ul li{
    padding: 5px;
    border-width:1px;
    border-style: solid;
    border-radius: 5px;
}

</style>