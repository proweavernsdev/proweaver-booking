<template>
    
    <div class="pwfvf-custom-field" :class="{'pwfvf-checkbox-input':type == 'checkbox'}">
        <input :readonly="readonly" :placeholder="placeholder" :type="(type == 'number' || type== 'integer') ? 'text' : type  ?? 'text'" :class="'pwfvf-'+name" v-if="!groupTypes.includes(type) &&  type != 'textarea' && type != 'paypal' && type != 'checkbox'" :value="valueC" @blur="valueC = $event.target.value;validate(valueC)" :name="name" @change="e=>{if(type=='checkbox') valueC = e.target.checked}">
        <textarea :value="valueC" :placeholder="placeholder" :class="'pwfvf-'+type" v-if="type=='textarea'" @blur="valueC = $event.target.value" :checked="valueC"></textarea>

        <label v-if="type == 'checkbox'" class="pwfvf-checkbox-main" :class="{active: valueC == true}" >
            <input :id="name" type="checkbox" hidden :checked="valueC == true" @change="$event=>valueC = $event.target.checked">
        </label>
        
        <div class="pwfvf-checkbox-group" :style="{'grid-template-columns':columns}" v-if="type == 'checkbox-group'" :class="{'pwcf-readonly':readonly}">
            <label v-for="v,i in values" :key="i" :for="name+'_'+i" :class="{active:selectC != null && selectC.includes(v.value)}">{{v.label}}
                <input style="display:none" :readonly="readonly" type="checkbox" :id="name+'_'+i" :name="name+'_'+i" @change="checkThis(v.value,$event);" :checked="selectC != null && selectC.includes(v.value)">
            </label>
        </div>
        <div class="pwfvf-radio-group" v-if="type == 'radio-group'" :style="{'grid-template-columns':columns}" :class="{'pwcf-readonly':readonly}">
            <label v-for="v,i in values" :key="i" :for="name+'_'+i" :class="{active:valueC == v.value}">
                <input style="display:none" :readonly="readonly" :id="name+'_'+i" type="radio" :name="name" :checked="valueC == v.value" @change="valueC = v.value;">
                {{v.label}}
            </label>
        </div>

        <!-- <div class="pwfvf-select" :class="'pwfvf-select-'+name"  v-if="type == 'select'" @click="closeAllOpenSelects" :data-pwfvf="name" >
            <span v-html="selectedValue"></span>
            <i class="pwfvf-select-caret-down">&#9660;</i> 
            <select class="w-full" :class="{'pwcf-readonly':readonly}">
                <option :class="{active:valueC == v.value}" class="pwfvf-select-option" v-for="v,i in values" :key="i" @click="loaded=true;valueC = v.value;selectedValue = v.label" v-html="v.label">
                    
                </option>
            </select>
        </div> -->

        
        
        <div class="pwfvf-select" :class="'pwfvf-select-'+name"  v-if="type == 'select'" @click="closeAllOpenSelects" :data-pwfvf="name" tabindex="1">
            <span v-html="selectedValue"></span>
            <i class="pwfvf-select-caret-down">&#9660;</i>
            <div class="pwfvf-select-menu" :class="{'pwcf-readonly':readonly}">
                <div :class="{active:valueC == v.value}" class="pwfvf-select-option" v-for="v,i in values" :key="i" @click="loaded=true;valueC = v.value;selectedValue = v.label" v-html="v.label">
                    
                </div>
            </div>
        </div>

        <div class="pwfvf-select" :class="'pwfvf-select-'+name"  v-if="type == 'datalist'" @click="closeAllOpenSelects" :data-pwfvf="name" tabindex="1">
            <input class="w-full bg-transparent outline-none" v-model="selectedValue" :placeholder="placeholder" @input="dataListTyping"/>
            <i class="pwfvf-select-caret-down">&#9660;</i>
            <div class="pwfvf-select-menu" :class="{'pwcf-readonly':readonly}">
                <div :class="{active:valueC == v.value}" class="pwfvf-select-option" v-for="v,i in filteredDatalist" :key="i" @click="loaded=true;valueC = v.value;selectedValue = v.label" v-html="v.label">
                    
                </div>
            </div>
        </div>



        <span class="pwfvf-field-error" v-if="error != ''">{{error}}</span>
    </div>
</template>

<script>
import { delayExec } from '../functions';

export default({
    props:{
        type:String,
        name:String,
        placeholder:String,
        options:Object,
        columns:String,
        value: null,
        values: Object,
        select: Object,
        readonly: Boolean,
    },
    emits:['onResult'],
    data(){
        return{
            valueC: '',
            selectC:[],
            selectedValue:'',
            error:'',
            largest: 0,
            console,
            searchVal:'',
            loaded:false,
            groupTypes:['checkbox-group','radio-group','select','datalist'],
            debounceTimer: null
        }
    },
    computed:{
        filteredDatalist(){
            let filtered = this.values.filter(el=>{
                if(el.label == this.selectedValue) this.valueC = this.value
                if(el.label.toLowerCase().includes(this.selectedValue.toLowerCase()) || this.selectedValue == '') return true;
                return false;
            })
            if(filtered.length == 0) this.valueC = ''
            return filtered
        }
    },
    watch:{
        value(){
            
            if(this.value == null && (this.type == 'select' || this.type == 'datalist')) {
                if(this.values.length == 0) return;
                this.selectedValue = this.values[0].label
                this.valueC = this.values[0].value
                this.$emit('onResult',this.values[0].value);
                return;
            }
            this.valueC = this.value;
            // if(this.type == 'select' || this.type == 'datalist') this.console.log(this.type == 'select' || this.type == 'datalist',this.values.length, this.name, this.values.filter(el=>el.value==this.value)[0].label)

            if(this.type == 'select' || this.type == 'datalist') if(this.values.length > 0 && this.value != null && this.value != '' && this.values.filter(el=>el.value==this.value) != null) this.selectedValue = this.values.filter(el=>el.value==this.value)[0].label
        },
        values:{
            handler(val){
                if(this.type == 'select' || this.type == 'datalist') {
                    if(this.loaded) return;
                    if(this.values.length == 0) return;
                    if((this.value != '' && this.value != null) || this.values.length == 0) return;
                    this.selectedValue = this.values[0].label
                    this.valueC = this.values[0].value;
                    this.$emit('onResult',this.values[0].value);
                    this.values.forEach(el=>this.largest = (this.largest < el.label.length) ? el.label.length : this.largest); 
                }
            },
            deep:true
        },
        valueC(c){
            if(this.error == '') this.$emit('onResult',this.valueC);
        },
        select:{
            handler(c){
                if(c == null) return;
                this.selectC = c
            },
            deep:true
        },
        selectC:{
            handler(c){
                if(this.selectC == this.select) return;
                if(c == null) return;
                this.$emit('onResult',JSON.parse(JSON.stringify(this.selectC)));
            },
            deep:true
        }
        
    },
    mounted(){
        this.valueC = this.value;
        this.json = JSON.stringify(this.form);

        if(this.type == 'checkbox-group') this.selectC = this.select ?? [];
        if(this.type == 'select' || this.type == 'datalist') {
            if(this.values.length == 0) return;
            if(this.value == null){
                this.selectedValue = this.values.filter(el=>el.value==this.value)[0] ? this.values.filter(el=>el.value==this.value)[0].label : ''
                this.valueC = this.values[0].value;
            }else{
                this.selectedValue = this.values.filter(el=>el.value==this.value)[0] ? this.values.filter(el=>el.value==this.value)[0].label : ''
                this.valueC = this.value
                this.values.forEach(el=>this.largest = (this.largest < el.label.length) ? el.label.length : this.largest);
            }

            this.values.forEach(el=>this.largest = (this.largest < el.label.length) ? el.label.length : this.largest);
        }
    },
    methods:{
        dataListTyping(){
            document.querySelector(`.pwfvf-select[data-pwfvf='${this.name}']`).classList.add('shown')
        },
        validate(text){
            let emailregex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/g;
            let teleregex = /^[0-9+()]+[0-9.+()\- ]+[0-9.+()]+$/g;
            let numregex = /^[0-9]+$|^[0-9]+.[0-9]+$/g;
            let intregex = /^[0-9]+$|^[0-9]+$/g;
            this.error = '';

            if(this.type == 'email' && text.match(emailregex) == null && text != ''){
                this.error = 'Email is not in valid format';
                return;
            }else if(this.type == 'telephone' && text.match(teleregex) == null && text != ''){
                this.error = 'Phone is not in valid format';
                return;
            }else if(this.type == 'number' && text.match(numregex) == null && text != ''){
                this.error = 'Number is not in valid format';
                return;
            }else if(this.type == 'integer' && text.match(intregex) == null && text != ''){
                this.error = 'Integer must only contain numbers';
                return;
            }

            this.error = '';
        },
        closeAllOpenSelects(){
            if(this.readonly) return;
            document.querySelectorAll('.pwfvf-select').forEach(el=>{
                if(el.dataset.pwfvf == this.name) return;
                el.classList.remove('shown');
            })
            let e = document.querySelector(`.pwfvf-select[data-pwfvf="${this.name}"]`);
            if(!e.classList.contains('shown')) e.classList.add('shown');
            else e.classList.remove('shown');
        },
        checkThis(v,e){
            if(this.options != null && this.options.maximum_checks != 0 && this.selectC.length >= this.options.maximum_checks && e.target.checked) {
                e.target.checked = false;
                return;
            }
            if(this.selectC.includes(v)) this.selectC.splice(this.selectC.indexOf(v),1);
            else this.selectC.push(v);
        },
    }
})
</script>

<style scoped>
.pwcf-readonly{
    pointer-events: none;
}
</style>
