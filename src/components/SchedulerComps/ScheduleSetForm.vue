<template>
<div class="scheduler-form-modal" :class="{closed:modalClose}">
    <StyledAlert
        :header="styledAlert.header"
        :body="styledAlert.body"
        :buttons="styledAlert.buttons"
        :type="styledAlert.type"
        :duration="styledAlert.duration"
        :show="styledAlert.show"
        @dismiss="styledAlert.show=false;"
        @onResult="e=>alertResult=e"
    />

    <div class="scheduler-form-parent">
        
        <div class="scheduler-form-header">
            <h4 class="text-lg font-bold">{{(queSchedule.id == '') ? 'Add Schedules' : 'Edit Schedule'}}</h4>
            <a href="javascript:;" @click.prevent="modalClose=true;$emit('close',modalClose)" class="bg-white block"><i class="text-gray-900" v-html="icons.close"></i></a>
        </div>
        <div class="scheduler-form-body">
            <div class="scheduler-form-inputs">
                <label>Start Date</label>
                <CustomFieldVue 
                    type="date"
                    name="scheduler-form-datestart"
                    :readonly="true"
                    :value="queSchedule.shift_date"
                />
                <label v-if="queSchedule.id == ''">End Date</label>
                <CustomFieldVue 
                    v-if="queSchedule.id == ''"
                    type="date"
                    name="scheduler-form-dateend"
                    :value="queSchedule.shift_date_end"
                    @on-result="e=>queSchedule.shift_date_end=e"
                />

                <label v-if="queSchedule.id != ''">Start Time</label>
                <CustomFieldVue 
                    v-if="queSchedule.id != ''"
                    type="time"
                    name="scheduler-form-timestart"
                    :value="dateFormat('%H:%M','2022-01-01 '+queSchedule.shift_start)"
                    @on-result="e=>queSchedule.shift_start = dateFormat('%H:%M','2022-01-01 '+e)"
                />

                <label v-if="queSchedule.id != ''">End Time</label>
                <CustomFieldVue 
                    v-if="queSchedule.id != ''"
                    type="time"
                    name="scheduler-form-timeend"
                    :value="dateFormat('%H:%M','2022-01-01 '+queSchedule.shift_end)"
                    @on-result="e=>queSchedule.shift_end = dateFormat('%H:%M','2022-01-01 '+e)"
                />

                <label v-if="queSchedule.id == ''">Repeat Days</label>
                <CustomFieldVue 
                    v-if="queSchedule.id == ''"
                    type="checkbox-group"
                    name="scheduler-form-repeatdays"
                    columns="1fr 1fr 1fr 1fr"
                    :values="[
                        {label:'Sun',value:0},
                        {label:'Mon',value:1},
                        {label:'Tue',value:2},
                        {label:'Wed',value:3},
                        {label:'Thu',value:4},
                        {label:'Fri',value:5},
                        {label:'Sat',value:6}
                    ]"
                    :select="queSchedule.repeatDays"
                    @on-result="e=>queSchedule.repeatDays=e"
                />
                <label>Service</label>
                <CustomFieldVue 
                    type="select"
                    name="scheduler-form-service"
                    columns="1fr 1fr 1fr 1fr"
                    :values="filterOutNonExistingServices"
                    :value="queSchedule.service"
                    @on-result="e=>queSchedule.service=e"
                />
                <label>Color</label>
                <CustomFieldVue 
                    type="select"
                    name="scheduler-form-color"
                    :values="[
                        {label:`<div style='background:#8b9933;height:20px;color:#fff'>#8b9933</div>`,value:'#8b9933'},
                        {label:`<div style='background:#6d9933;height:20px;color:#fff'>#6d9933</div>`,value:'#6d9933'},
                        {label:`<div style='background:#4e9933;height:20px;color:#fff'>#4e9933</div>`,value:'#4e9933'},
                        {label:`<div style='background:#339936;height:20px;color:#fff'>#339936</div>`,value:'#339936'},
                        {label:`<div style='background:#339955;height:20px;color:#fff'>#339955</div>`,value:'#339955'},
                        {label:`<div style='background:#339974;height:20px;color:#fff'>#339974</div>`,value:'#339974'},
                        {label:`<div style='background:#339992;height:20px;color:#fff'>#339992</div>`,value:'#339992'},
                        {label:`<div style='background:#338199;height:20px;color:#fff'>#338199</div>`,value:'#338199'},
                        {label:`<div style='background:#336399;height:20px;color:#fff'>#336399</div>`,value:'#336399'},
                        {label:`<div style='background:#334499;height:20px;color:#fff'>#334499</div>`,value:'#334499'},
                        {label:`<div style='background:#413399;height:20px;color:#fff'>#413399</div>`,value:'#413399'},
                        {label:`<div style='background:#5f3399;height:20px;color:#fff'>#5f3399</div>`,value:'#5f3399'},
                        {label:`<div style='background:#7e3399;height:20px;color:#fff'>#7e3399</div>`,value:'#7e3399'},
                        {label:`<div style='background:#993396;height:20px;color:#fff'>#993396</div>`,value:'#993396'},
                        {label:`<div style='background:#993377;height:20px;color:#fff'>#993377</div>`,value:'#993377'},
                        {label:`<div style='background:#993358;height:20px;color:#fff'>#993358</div>`,value:'#993358'},
                        {label:`<div style='background:#99333a;height:20px;color:#fff'>#99333a</div>`,value:'#99333a'},
                        {label:`<div style='background:#994b33;height:20px;color:#fff'>#994b33</div>`,value:'#994b33'},
                        {label:`<div style='background:#996933;height:20px;color:#fff'>#996933</div>`,value:'#996933'},
                        {label:`<div style='background:#998833;height:20px;color:#fff'>#998833</div>`,value:'#998833'},
                    ]"
                    :value="queSchedule.color"
                    @on-result="e=>queSchedule.color=e"
                />
                <label>Max Bookings</label>
                <CustomFieldVue 
                    type="integer"
                    placeholder="Maximum appointments to take"
                    name="scheduler-form-maxapp"
                    :value="queSchedule.max_appointments"
                    @on-result="e=>queSchedule.max_appointments=e"
                />
                <label>Description</label>
                <CustomFieldVue 
                    type="textarea"
                    name="scheduler-form-description"
                    placeholder="You can provide more details about the schedule here..."
                    :value="queSchedule.description"
                    @on-result="e=>queSchedule.description=e"
                />
                <div class="col-span-2" v-if="queSchedule.id == ''">
                    <label class="mb-1 block">Time Slots</label>
                    <div class="max-h-[100px] overflow-y-auto pr-2">
                        <div class="grid gap-1 items-center mb-1" :style="{
                                'grid-template-columns': (timeSlots.length > 1) ? '1fr 1fr 30px' : '1fr 1fr'
                            }" v-for="ts,i in timeSlots">
                            <CustomFieldVue 
                                type="time"
                                name="scheduler-form-timestart"
                                :value="dateFormat('%H:%M','2022-01-01 '+timeSlots[i].time_start)"
                                 @on-result="e=>timeSlots[i].time_start=e"
                            />
                            <CustomFieldVue 
                                type="time"
                                name="scheduler-form-timestart"
                                :value="dateFormat('%H:%M','2022-01-01 '+timeSlots[i].time_end)"
                                 @on-result="e=>timeSlots[i].time_end=e"
                            />
                            <div>
                                <button class="basic danger bg-red-500 text-white p-1 flex justify-center items-center w-[30px] h-[30px]" v-if="timeSlots.length > 1" @click="timeSlots.splice(i,1)">
                                    <i v-html="icons.trash"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                    <button class="basic mt-2 block bg-green-700 text-white p-1" @click="timeSlots.push({time_start:'',time_end:''})">Add Time Slot</button>
                </div>
            </div>
            <p class="errormsg" v-if="errormsg != ''" v-html="errormsg"></p>
            <div class="text-align-right">
                <button @click="setSchedule">{{(queSchedule.id == '') ? 'Add' : 'Edit'}} Schedule</button>
                <button @click="deleteSched" class="danger" v-if="queSchedule.id != ''">Delete Schedule</button>
            </div>
        </div>
    </div>
</div>
</template>

<script>
import {validateForm,dateFormat} from './scheduler.utils'
import CustomFieldVue from './CustomField.vue';
import StyledAlert from './StyledAlert.vue';
import { axios } from '../../functions';
import icons from '../../assets/icons'

export default{
    components:{CustomFieldVue,StyledAlert},
    props:{ modalCloseProp:Boolean,schedule:Object,facilities:Array,roles:Array},
    data(){
        return{
            dateFormat,
            console,
            icons,
            modalClose:true,
            errormsg:'',
            alertResult:null,
            styledAlert:{
                header:'Scheduler Error',
                body:'asdsad',
                buttons:[],
                type:'neutral',
                duration:2000,
                show:false
            },
            timeSlots: [{time_start:'00:00:00',time_end:'01:00:00'}],
            queSchedule:{
                id:'',
                shift_date: '',
                shift_date_end: '',
                shift_start:'',
                shift_end:'',
                timeSlots:[{time_start:'00:00:00',time_end:'01:00:00'}],
                repeatDays:[0,1,2,3,4,5,6],
                description:'',
                service:null,
                color:null,
                max_appointments:0
            },
            serviceOpts:[{label:'fetching...',value:'fetching'}]
        }
    },
    mounted(){
        axios.post('services/fetch','default').then(res=>{
            if(res.data.msg == 'fetch failed'){
                this.$emit('noServicesError')
                return;
            }
            if(!res.data.success) return;
            this.serviceOpts = res.data.result.map(el=>{
                return {
                    label: el.book_services_name,
                    value: el.book_services_name
                }
            });

            this.$emit('services',this.serviceOpts)
        })
    },
    computed:{
        filterOutNonExistingServices(){
            if(this.serviceOpts.findIndex(el=>el.value==this.queSchedule.service) >= 0 || this.queSchedule.id == '') return this.serviceOpts;
            this.alert('Removed Service Warning', 'You already removed the service that is binded with this schedule. If you change it, you cannot select the removed service again. (This schedule will not be seen from the form scheduler)','warning',[],5000)
            return [...this.serviceOpts,{
                label: this.queSchedule.service,
                value: this.queSchedule.service
            }]
        }
    },
    methods:{
        resetQueSched(){
            this.timeSlots  = [{time_start:'00:00:00',time_end:'01:00:00'}]
            this.queSchedule={
                id:'',
                shift_date: '',
                shift_date_end: '',
                shift_start:'',
                shift_end:'',
                timeSlots:[{time_start:'00:00:00',time_end:'01:00:00'}],
                repeatDays:[0,1,2,3,4,5,6],
                description:'',
                service:null,
                color:null,
                max_appointments:0
            }
        },
        waitForConfirm(header,body,type,buttons=[],duration=2000){
            this.alertResult = null;
            this.alert(header,body,type,buttons,duration);

            return new Promise(res=>{
                let wait = setInterval(()=>{
                    if(this.alertResult == null) return;
                    clearInterval(wait);
                    res(this.alertResult);
                },100)
            })
        },
        alert(header,body,type,buttons=[],duration=2000){
            this.styledAlert.header = header;
            this.styledAlert.body = body;
            this.styledAlert.type = type;
            this.styledAlert.buttons = buttons;
            this.styledAlert.duration = duration;
            this.styledAlert.show = true;
        },
        async deleteSched(){
            let resp = await this.waitForConfirm('Confirm Deletion?','This action cannot be undone once saved!','warning',[
                {label:'Yes',data:true},
                {label:'No',data:false},
            ],3000);
            if(!resp) return;
            this.$emit('onDelete',this.queSchedule.id)
            this.modalClose = true;
        },
        setSchedule(){
            this.errormsg = '';
            let emptyFieldsErrorMsg = 'The following fields are required:<br>';
            let rules = {
                shift_start:'required',
                shift_end:'required',
            };
            
            if(this.queSchedule.id == ''){
                rules = {
                    shift_date_end:'required',
                    shift_start:'required',
                    shift_end:'required',
                    // wage:'required',
                }
            }


            rules.callback = (v)=>{
                switch(v){
                    case 'shift_date_end':
                        emptyFieldsErrorMsg+='<strong>End Date</strong>, '
                    break;
                    case 'shift_start':
                        emptyFieldsErrorMsg+='<strong>Start Time</strong>, '
                    break;
                    case 'shift_end':
                        emptyFieldsErrorMsg+='<strong>End Time</strong>, '
                    break;
                    case 'max_appointments':
                        emptyFieldsErrorMsg+='<strong>Max Bookings</strong>, '
                    break;
                    // case 'wage':
                    //     emptyFieldsErrorMsg+='<strong>Rate/hr</strong>, '
                    // break;
                }
            }

            let valid = validateForm(this.queSchedule,rules);
            emptyFieldsErrorMsg = emptyFieldsErrorMsg.substring(0,emptyFieldsErrorMsg.length-2);
            

               

            if(!valid.allValid){
                this.errormsg = emptyFieldsErrorMsg;
                return;
            }

            if(new Date('2022-01-01 '+this.queSchedule.shift_start).toLocaleDateString() == "Invalid Date"){
                this.errormsg = 'The following fields are required:<br><strong>Start Time </strong>';
                return;
            }else if(new Date('2022-01-01 '+this.queSchedule.shift_end).toLocaleDateString() == "Invalid Date"){
                this.errormsg = 'The following fields are required:<br><strong>End Time </strong>';
                return;
            }


            if(this.queSchedule.max_appointments <= 0){
                this.errormsg = '<strong>Max Appointment</strong> field must be at least 1';
                return;
            }

            if(this.queSchedule.id == '' && this.queSchedule.repeatDays.length == 0){
                this.errormsg = '<strong>Repeat Days</strong> field should have at least one check';
                return;
            }
            
            if(this.queSchedule.id == '' && new Date(this.queSchedule.shift_date_end).getTime() < new Date(this.queSchedule.shift_date).getTime()){
                this.errormsg = '<strong>End Date</strong> must be set later than the Start Date';
                return;
            }

            this.queSchedule.timeSlots = JSON.parse(JSON.stringify(this.timeSlots))

            if(this.queSchedule.id == ''){
                let timeSlotsHasEmptyVals = false
                this.queSchedule.timeSlots.forEach(el=>{
                    if(el.time_start.match(/^([0-9]{2}:[0-9]{2}:[0-9]{2})|([0-9]{2}:[0-9]{2})$/g) == null 
                    || el.time_end.match(/^([0-9]{2}:[0-9]{2}:[0-9]{2})|([0-9]{2}:[0-9]{2})$/g) == null) timeSlotsHasEmptyVals = true 
                })

                if(timeSlotsHasEmptyVals) {
                    this.errormsg = '<strong>Time Slots</strong> have empty values';
                    return;
                }

                function sortTimeSlots(times) {
                        // Custom sorting function
                    const customSort = (a, b) => {
                        // Handle null values
                        if (a.time_start === '' || a.time_end === '') return 1; // Place null values at the end
                        if (b.time_start === '' || b.time_end === '') return -1; // Place null values at the end
                        // Compare time values
                        let returnResult = 0;
                        if (new Date('2023-01-01 '+a.time_start).getTime() < new Date('2023-01-01 '+b.time_start).getTime()) returnResult = -1;
                        if (new Date('2023-01-01 '+a.time_start).getTime() > new Date('2023-01-01 '+b.time_start).getTime()) returnResult = 1;
                        return returnResult;
                    };

                    // Sort the array using the custom sorting function
                    const sortedTimes = times.sort(customSort);

                    return sortedTimes;
                }

                this.queSchedule.timeSlots = sortTimeSlots(JSON.parse(JSON.stringify(this.queSchedule.timeSlots)))
            }
            
            if(this.queSchedule.id == '')
                this.$emit('onCreate',JSON.parse(JSON.stringify(this.queSchedule)));
            else
                this.$emit('onUpdate',JSON.parse(JSON.stringify(this.queSchedule)));

            this.resetQueSched()
        }
    },
    watch:{
        timeSlots:{
            handler(){
                if(this.timeSlots == null || this.timeSlots.length == 0) return
                let earliestTimeStart = ''
                let latestTimeEnd = '2020-01-01 00:00:00'
                
                this.timeSlots.forEach(el=>{
                    if(el.time_start == '') return
                    
                    
                    
                    if(earliestTimeStart == '' || new Date('2020-01-01 '+el.time_start).getTime() < new Date('2020-01-01 '+earliestTimeStart).getTime()) earliestTimeStart = el.time_start
                    
                    if(el.time_end == '') return
                    let realTimeEnd = new Date(this.queSchedule.shift_date+' '+el.time_end)
                    if(new Date('2020-01-01 '+el.time_end).getTime() < new Date('2020-01-01 '+el.time_start).getTime())
                        realTimeEnd.setDate(realTimeEnd.getDate() + 1)
                    if(realTimeEnd.getTime() > new Date(latestTimeEnd).getTime()) 
                        latestTimeEnd = realTimeEnd.toLocaleString('zh-Hans-CN', {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit',
                            hour12: false,
                            hour: '2-digit',    
                            minute: '2-digit',
                            second: '2-digit'
                        }).replaceAll('/','-').replaceAll(',','');
                })

                this.queSchedule.shift_start = earliestTimeStart
                this.queSchedule.shift_end = latestTimeEnd.split(' ')[1]
            },
            deep:true
        },
        modalCloseProp(){
            this.modalClose = this.modalCloseProp;
        },
        schedule:{
            handler(){
                this.errormsg = '';
                let editThisSchedule = JSON.parse(JSON.stringify(this.schedule))
                for(let sd in this.schedule){
                    editThisSchedule[sd] = this.schedule[sd];
                }
                if(editThisSchedule.id == '') editThisSchedule.repeatDays = [0,1,2,3,4,5,6];
                editThisSchedule.shift_date_end = editThisSchedule.shift_date;
                this.queSchedule = editThisSchedule
                
            },
            deep:true
        }
    }
}
</script>

<style scoped>
.scheduler-form-modal{position:fixed;top:0;left:0;width:100vw;height: 100vh;background: rgba(0,0,0,0.5);z-index: 9999;opacity: 1;transition: 0.3s ease-out;}
.scheduler-form-modal.closed{z-index: -100;opacity: 0;}
.scheduler-form-modal.closed .scheduler-form-parent{top:-100%}
.scheduler-form-parent{background: #fff;max-width: 500px;width: 90%;position: absolute;top:50%;left:50%;transform:translateX(-50%) translateY(-50%);border-radius: 5px;transition: 0.5s ease-out;}

.scheduler-form-header{padding:20px;background: #111827;color:#fff;border-radius: 5px 5px 0 0;position: relative;}
.scheduler-form-header a{all:unset;position: absolute;right:20px;top:50%;transform:translateY(-50%);transition: 0.1s;height: 30px;width: 30px;line-height:30px;text-align: center;background: #fff;border-radius: 50%;}
.scheduler-form-header a:hover{scale: 1.1;}
.scheduler-form-header a:active{scale: 0.9;}
.scheduler-form-body{padding: 20px}
.scheduler-form-inputs{display: grid;grid-template-columns: 1fr 3fr;gap: 5px;margin-bottom: 20px;}
.scheduler-form-inputs label{margin-top:5px;}

button{
    border-radius: 5px;
    font-size: 14px;
    transition: 0.2s;
}

button:not(.basic){
    margin: 0 2px;
    padding: 7px;
    background: #3d843d;
    color: #fff;
}


button.danger{background: #a2493e;}

button:hover{scale:1.05}
button:active{scale:0.95}

button.danger{
    background: #a2493e;
}

.errormsg{
    margin: 10px 0 10px;
    border: 1px solid #900;
    padding: 5px;
    background: #ffd3d3;
    color: #593434;
    font-size: 15px;
    text-align: center;
    border-radius: 5px;
}

.text-align-right{text-align: right;}

@media only screen and (max-width:600px){
    .scheduler-form-inputs {
        grid-template-columns: 1fr;
    }

    .scheduler-form-body{
        max-height: 70vh;
        overflow: auto;
    }
}


</style>
