<template>
    <div class="pwbcf-custom-field">
        <input :readonly="readonly" :placeholder="placeholder" :type="(type == 'number' || type== 'integer') ? 'text' : type  ?? 'text'" :class="'pwbcf-'+name" v-if="!groupTypes.includes(type) &&  type != 'textarea' && type != 'paypal'" :value="valueC" @blur="valueC = $event.target.value;validate(valueC)" :name="name" @change="e=>{if(type=='checkbox') valueC = e.target.checked}" :checked="valueC">
        <textarea :value="valueC" :placeholder="placeholder" :class="'pwbcf-'+type" v-if="type=='textarea'" @blur="valueC = $event.target.value"></textarea>
        
        <div class="pwbcf-checkbox-group" :style="{'grid-template-columns':columns}" v-if="type == 'checkbox-group'">
            <label v-for="v,i in values" :key="i" :for="name+'_'+i">
                {{v.label}}
                <input :readonly="readonly" type="checkbox" :id="name+'_'+i" :name="name+'_'+i" @change="checkThis(v.value,$event)" :checked="selectC != null && selectC.includes(v.value)">
            </label>
        </div>
        <div class="pwbcf-radio-group" v-if="type == 'radio-group'" :style="{'grid-template-columns':columns}">
            <label v-for="v,i in values" :key="i" :for="name+'_'+i">
                {{v.label}}
                <input :readonly="readonly" :id="name+'_'+i" type="radio" :name="name" :checked="valueC == v.value" @change="valueC = v.value;"></label>
        </div>
        
        <div class="pwbcf-select" :class="'pwbcf-select-'+name"  v-if="type == 'select'" @click="closeAllOpenSelects" :data-pwbcf="name" :style="{width:largest+'rem',minWidth:'100%'}">
            <span v-html="selectedValue"></span>
            <i class="pwbcf-select-caret-down">&#9660;</i>
            <div class="pwbcf-select-menu">
                <div :class="{active:valueC == v.value}" class="pwbcf-select-option" v-for="v,i in values" :key="i" @click="loaded=true;valueC = v.value;selectedValue = v.label" v-html="v.label">
                    
                </div>
            </div>
        </div>
        <span class="pwbcf-field-error" v-if="error != ''">{{error}}</span>
    </div>
</template>

<script>

export default({
    props:{
        type:String,
        name:String,
        placeholder:String,
        options:Object,
        columns:String,
        value: null,
        values: null,
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
            loaded:false,
            groupTypes:['checkbox-group','radio-group','select']
        }
    },
    watch:{
        value(){
            if(this.value == null && this.type == 'select') {
                if(this.values.length == 0) return;
                this.selectedValue = this.values[0].label
                this.valueC = this.values[0].value
                this.$emit('onResult',this.values[0].value);
                return;
            }
            this.valueC = this.value;

            // if(this.type == 'select') this.console.log(this.type == 'select',this.values.length, this.name, this.values.filter(el=>el.value==this.value)[0].label)
            if(this.type == 'select') if(this.values.length > 0 && this.value != null && this.value != '' && this.values.filter(el=>el.value==this.value) != null) this.selectedValue = this.values.filter(el=>el.value==this.value)[0].label
        },
        values:{
            handler(val){
                if(this.type == 'select') {
                    if(this.loaded) return;
                    if(this.values.length == 0) return;
                    if((this.value != '' && this.value != null) || this.values.length == 0) return;
                    this.selectedValue = this.values[0].label
                    this.valueC = this.values[0].value;
                    this.$emit('onResult',this.values[0].value);
                    this.values.forEach(el=>this.largest = (this.largest < el.label.replace(/(<([^>]+)>)/gi, "").length) ? el.label.replace(/(<([^>]+)>)/gi, "").length : this.largest);
                    
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
                if(c == null) return;
                this.$emit('onResult',this.selectC);
            },
            deep:true
        }
        
    },
    mounted(){
        this.valueC = this.value;
        this.json = JSON.stringify(this.form);

        if(this.type == 'checkbox-group') this.selectC = this.select ?? [];
        if(this.type == 'select' && (this.value == null || this.value == '')) {
            if(this.values.length > 0) this.selectedValue = this.values[0].label
            if(this.values.length > 0) this.valueC = this.values[0].value;
        }else if(this.type == 'select'){
            let valueIndex = this.values.findIndex(el=>el.value == this.valueC)
            this.selectedValue = this.values[valueIndex].label
            this.valueC = this.values[valueIndex].value
        }
        if(this.values != null && this.values.length > 0) this.values.forEach(el=>{
            if(typeof el.label != 'string') el.label = el.label.toString();
            this.largest = (this.largest < el.label.replace(/(<([^>]+)>)/gi, "").length) ? el.label.replace(/(<([^>]+)>)/gi, "").length : this.largest
        });
        
    },
    methods:{
        validate(text){
            let emailregex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/g;
            let teleregex = /^[0-9+()]+[0-9.+()\- ]+[0-9.+()]+$/g;
            let numregex = /^[0-9]+$|^[0-9]+.[0-9]+$/g;
            let intregex = /^[0-9]+$|^[0-9]+$/g;
            this.error = '';

            if(this.type == 'email' && text.match(emailregex) == null && text != ''){
                this.error = `Email is not in valid format`;
                return;
            }else if(this.type == 'telephone' && text.match(teleregex) == null && text != ''){
                this.error = `Phone is not in valid format`;
                return;
            }else if(this.type == 'number' && text.match(numregex) == null && text != ''){
                this.error = `Number is not in valid format`;
                return;
            }else if(this.type == 'integer' && text.match(intregex) == null && text != ''){
                this.error = `Integer must only contain numbers`;
                return;
            }

            this.error = '';
        },
        closeAllOpenSelects(){
            if(this.readonly) return;
            document.querySelectorAll('.pwbcf-select').forEach(el=>{
                if(el.dataset.pwbcf == this.name) return;
                el.classList.remove('shown');
            })
            let e = document.querySelector(`.pwbcf-select[data-pwbcf="${this.name}"]`);
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
*{font-size:15px}
input[class^='pwbcf-']:not([type="radio"]):not([type="checkbox"]),textarea{
    all:unset;
    width: calc(100% - 20px);
    padding: 5px 7px;
    border: 1px solid #ddd;

    border-radius: 5px;
    font-size: 15px;
}


textarea{height: 150px;}


.pwbcf-checkbox-group,.pwbcf-radio-group{
    display: grid;
    gap:5px
}

.pwbcf-checkbox-group label, .pwbcf-radio-group label{
    padding: 5px 7px;
    border: 1px solid #ddd;

    border-radius: 5px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin:0;
}

.pwbcf-checkbox-group input, .pwbcf-radio-group input{
    float: right;
    outline: none;
}

.pwbcf-radio-group{
    display: grid;
}

.pwbcf-custom-field{padding: 0;}


.pwbcf-select{
    padding: 5px 7px;
    padding-right: 50px;
    border: 1px solid #ddd;

    border-radius: 5px;
    position: relative;
}

.pwbcf-select-caret-down{
    position: absolute;
    top:5px;
    right:10px;
    transition: 0.2s;
}

.pwbcf-select.shown .pwbcf-select-caret-down{
    transform: scale(-1);
    user-select: none;
}


.pwbcf-select-menu{
    background: #fff;
    position: absolute;
    top:99%;
    left:0;
    width: 100%;
    overflow: hidden;
    border: 1px solid #ddd;

    border-radius: 5px;
    z-index: 99;
    display: none;
    max-height: 200px;
    overflow: auto;
}


.pwbcf-select.shown .pwbcf-select-menu{display: block;}

.pwbcf-select-option{
    padding: 5px 7px;
}

.pwbcf-select-option:hover{
    background: #eee;
}

.pwbcf-field-error{
    padding: 5px;
    margin: 5px 0 10px;
    display: block;
    background: #fbcdcd;
    border: 1px solid #dfaeae;
    color: #773434;
}

textarea{white-space: pre-wrap;height:unset;min-height: 70px;}

</style>
