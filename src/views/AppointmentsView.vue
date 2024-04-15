<script setup>
import MasterLayoutVue from "../components/MasterLayout.vue";
import {onMounted, ref} from 'vue';
import {axios,dateAdjusted,dateFormat,dateOffseted,dateFormatTimezone} from '../functions'
import icons from '../assets/icons';
import CustomField from '../components/SchedulerComps/CustomField.vue'
import AppointmentsCalendar from '../components/AppointmentsCalendar.vue'
import Tooltip from "../components/Tooltip.vue";
import StyledAlert from '../components/SchedulerComps/StyledAlert.vue';
import DateFunc from "../DateTime";

let locations = ref(0)
let services = ref(0)
let workers = ref(0)
let viewMode = ref(0)
let styledAlert = ref({
  header:'Scheduler Error',
  body:'asdsad',
  buttons:[],
  type:'neutral',
  duration:2000,
  show:false
})
let fetchSettings = ref({
  date: dateFormat('%y-%M-%D'),
  orderBy: 'book_appointment_id',
  orderDir: 'DESC',
  results: 10,
  offset: 0,
  includeDate: false,
  includeFinished: false
})

let appointments = ref([])
let appointmentsMaxCount = ref(0)
let appointmentsIndex = ref(0)
let modal = ref({
    open:false,
    info:{}
})

onMounted(()=>{
  let getparams = new URLSearchParams(window.location.search);
  if(getparams.get('date') == null) fetchSettings.value.date = dateFormat('%y-%M-%D');
  else {
    fetchSettings.value.date = getparams.get('date');
    fetchSettings.value.includeDate = true;
  }
  fetchSettings.value.includeFinished = true;
  fetchSettings.value.orderBy = 'DATE(`book_schedule_date`) %orderdir%, `book_schedule_timestart` %orderdir%'
  fetchSettings.value.orderDir = 'DESC'
  fetchFilter();

  fetchCount();
})

function styledAlertFunc(header,body,type,buttons=[],duration=2000){
    styledAlert.value.header = header;
    styledAlert.value.body = body;
    styledAlert.value.type = type;
    styledAlert.value.buttons = buttons;
    styledAlert.value.duration = duration;
    styledAlert.value.show = true;
}

let alertResult = ref(null);
function waitForConfirm(header,body,type,buttons=[],duration=2000){
    alertResult.value = null;
    styledAlertFunc(header,body,type,buttons,duration);

    return new Promise(res=>{
        let wait = setInterval(()=>{
            if(alertResult.value == null) return
            
            clearInterval(wait)
            res(alertResult.value)
            alertResult.value = null
        },10)
    })
}
        

async function changeStatus(id, status){
  let prompts = [
    {title: 'Pending Appointment',body:'Nothing to do here...',type:'success',buttons:null},
    {title: 'Approve this appointment?',body:'Selecting \'yes\' will prompt the booking app to send a notification confirming the approval of the client\'s appointment.',type:'warning',},
    {title: 'Deny this appointment?',body:'Selecting \'yes\' will prompt the booking app to send a notification informing the client that their appointment has been denied.',type:'danger',},
    {title: 'Mark appointment as complete?',body:'Selecting \'yes\' will change the status to \'Completed\'.',type:'success',},
  ]
  let resp = await waitForConfirm(prompts[status].title,
    prompts[status].body
  ,prompts[status].type,[
    {label:'Yes',data:true},
    {label:'No',data:false},
  ],3000);
  if(!resp) {
    alertResult.value = null
    return
  }

  modal.value.open = false;
  axios.post('appointments/changeStatus?id='+id,null,{status:status}).then(res=>{
    if(!res.data.success) return;
    alertResult.value = null
    appointments.value[appointments.value.findIndex(el=>el.book_appointment_id == id)].book_appointment_status = status
  })
}

function consoleLog(e){
  console.log(e)
}

function fetchFilter(){
  fetchSettings.value.offset = 0;
  axios.post('appointments/fetchFiltered',null,fetchSettings.value).then(res=>{
    appointments.value = [];
    if(res.data == null || !res.data.success) return;
    appointments.value = res.data.result.appointments
    appointmentsMaxCount.value = res.data.result.count
  })
}

function fetchPage(i){
  fetchSettings.value.offset = (i - 1) * fetchSettings.value.results;
  axios.post('appointments/fetchFiltered',null,fetchSettings.value).then(res=>{
    appointments.value = [];
    if(res.data == null || !res.data.success) return;
    appointments.value = res.data.result.appointments
    appointmentsIndex.value = i
  })
}

function fetchCount(){
  axios.post('location/fetch','default').then(res=>{
    if(!res.data.success) return;
    locations.value = res.data.result.length;
  })

  axios.post('services/fetch','default').then(res=>{
    if(!res.data.success) return;
    services.value = res.data.result.length;
  })

  axios.post('worker/fetch','default').then(res=>{
    if(!res.data.success) return;
    workers.value = res.data.result.length;
  })
}

function dismissAlert(e){
  styledAlert.value.show=false
}

function parseJSON(mix){
  let schedule = {
    'Schedule ID' : mix.book_schedule_id,
    'Date' : dateFormat('%lm %d, %y',mix.book_schedule_date),
    'From' : dateFormat('%h:%I %a',mix.book_schedule_date+' '+mix.book_schedule_timestart),
    'To' : dateFormat('%h:%I %a',mix.book_schedule_date+' '+mix.book_schedule_timeend),
    'Description' : mix.book_schedule_description ?? '-',
  };


  return {
    appointment:JSON.parse(mix.book_appointment_custominputs),
    schedule:schedule,
    status: ['Pending', 'Approved', 'Denied','Completed'][mix.book_appointment_status]
  }
}

</script>

<template>
  
  <StyledAlert
      :header="styledAlert.header"
      :body="styledAlert.body"
      :buttons="styledAlert.buttons"
      :type="styledAlert.type"
      :duration="styledAlert.duration"
      :show="styledAlert.show"
      @dismiss="e=>dismissAlert(e)"
      @onResult="e=>alertResult=e"
  />

  <div id="modal_parent" class="transition w-screen h-screen fixed top-0 left-0" style="background: rgb(0,0,0,0.3);" :class="(modal.open) ? '' : 'opacity-0'" :style="modal.open ? 'z-index:999' :'z-index:-10'">
    <div id="modal_box" class=" absolute max-w-[600px]  bg-white top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] rounded-md overflow-auto w-10/12" v-if="modal.open">
      <div id="modal_header" class="p-5 bg-gray-900 rounded-md rounded-b-none text-white grid min-w-[400px]" style="grid-template-columns: 1fr 30px;">
        <h2 class="font-bold">View Appointment</h2>
        <button class="bg-white rounded-full w-[25px] h-[25px] flex justify-center items-center transition hover:scale-105 active:scale-95" @click="modal.open = false">
              <i v-html="icons.close" class="text-gray-900"></i>
          </button>
      </div>
        <div id="modal_body" class="p-5 min-w-[400px]" @submit.prevent="saveChanges" style="max-height: 70vh;">
          <h2 class="text-lg font-bold text-gray-800 mb-2">Schedule Details</h2>
          <table class="w-full border">
            <tr v-for="f,i in parseJSON(modal.info).schedule" :key="i" class="border-b">
              <td class="font-bold text-gray-800 border-b p-1">{{ i }}</td>
              <td class="border-b p-1">{{ f }}</td>
            </tr>
          </table>
          <h2 class="text-lg font-bold text-gray-800 mb-2 mt-4">Appointment Details</h2>
          <table class="w-full border">
            <tr>
              <td class="font-bold text-gray-800 border-b p-1">Status</td>
              <td class="border-b p-1">{{ parseJSON(modal.info).status }}</td>
            </tr>

            <tr v-for="f,i in parseJSON(modal.info).appointment" :key="i" class="border-b" v-show="!f.id.includes('pwid=scheduler')">
              <td class="font-bold text-gray-800 border-b p-1">{{ f.label.replaceAll('_',' ') }}</td>
              <td class="border-b p-1" v-html="[0,'','undefined',null,undefined].includes(f.value) ? '-' : typeof f.value == 'string' ? f.value.replaceAll('\n','<br>') : f.value"></td>
            </tr>

            <tr>
              <td class="font-bold text-gray-800 border-b p-1">Date Submitted</td>
              <td class="border-b p-1">{{ dateFormat('%sm %d, %y (%h:%M %a)',modal.info.book_appointment_created_at) }}</td>
            </tr>
          </table>
          <div class="flex justify-end my-5">
            <button v-if="[0,'0'].includes(modal.info.book_appointment_status)" class="transition flex gap-2 items-end rounded-md w-[100px] text-white bg-green-700 mx-[4px] p-1.5 text-base hover:scale-105 active:scale-95" @click="changeStatus(modal.info.book_appointment_id,1,modal.info.id)"><i class="text-base w-[20px] h-[20px] object-contain" v-html="icons.thumbsUp" ></i> Approve</button>
            <button v-if="[0,'0',1,'1'].includes(modal.info.book_appointment_status)" class="transition flex gap-2 items-center rounded-md w-[80px] text-white bg-red-700 mx-[2px] p-1.5 text-base hover:scale-105 active:scale-95" @click="changeStatus(modal.info.book_appointment_id,2,modal.info.id)"><i class="text-base w-[20px] h-[20px] object-contain mt-1" v-html="icons.thumbsDown" ></i> Deny</button>
            <button v-if="[1, '1'].includes(modal.info.book_appointment_status)" class="transition flex gap-2 items-center rounded-md w-[120px] text-white bg-teal-700 mx-[2px] p-1.5 text-base hover:scale-105 active:scale-95" @click="changeStatus(modal.info.book_appointment_id,3,modal.info.id)"><i class="text-base mt-1 w-[20px] h-[20px] object-contain" v-html="icons.check" ></i> Completed</button>
          </div>
          
        </div>
    </div>
  </div>
  <MasterLayoutVue>
    <h1 class="text-3xl font-bold border-b pb-3 mb-3 flex items-end">Appointments</h1>
    <div class="flex w-max border border-gray-900 mb-5 rounded-full overflow-hidden">
      <button class="p-1 px-2 pl-4 transition" :class="{'bg-gray-900 text-white':viewMode == 0}" @click="viewMode = 0">List View</button>
      <button class="p-1 px-2 pr-4 transition" :class="{'bg-gray-900 text-white':viewMode == 1}" @click="viewMode = 1">Month View</button>
    </div>


    <div v-show="viewMode == 0">
      <div class="flex gap-5 items-end border-b pb-4">
      <div>
        <label class="mb-1 block">Date:</label>
        <input type="date" class="block border p-1 border-gray-300 rounded-md" v-model="fetchSettings.date">
      </div>
      <div>
        <label class="mb-1 block">Order By:</label>
        <div class="flex gap-2">
          <CustomField
            type="select"
            name="pwaf-ordered-by"
            :value="fetchSettings.orderBy"
            @onResult="e=>fetchSettings.orderBy = e"
            :values="[
              {label:'Date Received',value:'book_appointment_id'},
              {label:'Scheduled Date',value: 'DATE(`book_schedule_date`) %orderdir%, `book_schedule_timestart` %orderdir%'},
              {label: 'Service',value: 'book_appointment_servicesname'},
              {label: 'Status',value: 'book_appointment_status'},
            ]"
          />
          <CustomField
            type="select"
            name="pwaf-order-dir"
            :value="fetchSettings.orderDir"
            @onResult="e=>fetchSettings.orderDir = e"
            :values="[
              {label:'Ascending',value:'ASC'},
              {label:'Descending',value:'DESC'},
            ]"
          />
        </div>
        
      </div>
      <div>
        <label class="mb-1 block">Results Per Page:</label>
        <CustomField
          type="select"
          name="pwaf-max-res"
          :value="fetchSettings.results"
          @onResult="e=>fetchSettings.results = e"
          :values="[
            {label:'10',value:10},
            {label:'25',value:25},
            {label:'50',value:50},
            {label:'100',value:100},
          ]"
        />
      </div>
      <button class="transition rounded-md bg-gray-900 text-white px-2 py-1 hover:scale-105 active:scale-95 mb-1" @click="fetchFilter()">Go</button>
    </div>
    <div class="flex gap-2 mt-2">
      <div class="flex mb-2">
        <label class="mr-2 select-none" for="pwaf-includedate">Include Date Filter?</label>
        <input type="checkbox" id="pwaf-includedate" @change="fetchSettings.includeDate = $event.target.checked">
      </div>
      <div class="flex mb-2">
        <label class="mr-2 select-none" for="pwaf-includefinish">Include Finished?</label>
        <input type="checkbox" id="pwaf-includefinish" @change="fetchSettings.includeFinished = $event.target.checked">
      </div>
    </div>
    <p class="mt-4 text-center border border-gray-300 p-3 italic rounded-md" v-if="appointments.length == 0">No appointment requests scheduled on this date...</p>
    <table class="w-full border-separate border-spacing-y-2 border-spacing-x-0" v-if="appointments.length > 0">
      <tr>
        <td class="font-bold p-2" v-if="services
         > 0">Service</td>
        <td class="font-bold p-2" v-if="locations
         > 0">Location</td>
         <td class="font-bold p-2">Date</td>
        <td class="font-bold p-2">Time</td>
        <td class="font-bold p-2">Name</td>
        <td class="font-bold p-2">Status</td>
        <td class="font-bold p-2">Action</td>
      </tr>
      <tr v-for="a,i in appointments" :key="i" style="box-shadow: 0 0 2px #999;" class="rounded-md hover:scale-[101%] transition hover:shadow-sm hover:bg-blue-100">
        <td class="p-2" v-if="services
         > 0"> {{ [0,null,'undefined',''].includes(a.book_appointment_servicesname) ? '-' : a.book_appointment_servicesname }}</td>
        <td class="p-2" v-if="locations
         > 0"> {{ [0,null,'undefined',''].includes(a.book_appointment_locationname) ? '-' : a.book_appointment_locationname }}</td>
         <td>{{dateFormat('%w - %sm %d, %y',a.book_schedule_date)}}</td>
        <td>{{dateFormat('%h:%I %a',a.book_schedule_date+' '+a.book_schedule_timestart)}} - {{dateFormat('%h:%I %a',a.book_schedule_date+' '+a.book_schedule_timeend)}}</td>
        <td class="overflow-hidden whitespace-nowrap text-ellipsis max-w-[300px]">{{a.book_appointment_name}}</td>
        <td>{{['Pending', 'Approved', 'Denied','Completed'][a.book_appointment_status]}}</td>
        <td class="flex items-center h-full p-2">
          <button v-if="[0,'0'].includes(a.book_appointment_status)" @click="changeStatus(a.book_appointment_id,1)" class="transition rounded-md text-white bg-green-700 mx-[2px] p-1 w-[27px] h-[27px] text-base hover:scale-105 active:scale-95"><div class="tooltip-hover"><Tooltip message="Approve appointment" /></div><i class="text-base" v-html="icons.thumbsUp"></i></button>
          <button v-if="[0,'0',1,'1'].includes(a.book_appointment_status)" @click="changeStatus(a.book_appointment_id,2)" class="transition rounded-md text-white bg-red-700 mx-[2px] p-1 w-[27px] h-[27px] text-base hover:scale-105 active:scale-95"><div class="tooltip-hover"><Tooltip message="Deny appointment" /></div><i class="text-base" v-html="icons.thumbsDown"></i></button>
          <button v-if="[1,'1'].includes(a.book_appointment_status)" @click="changeStatus(a.book_appointment_id,3)" class="transition rounded-md text-white bg-teal-700 mx-[2px] p-1 w-[27px] h-[27px] text-base hover:scale-105 active:scale-95"><div class="tooltip-hover"><Tooltip message="Mark as Complete" /></div><i class="text-base" v-html="icons.check"></i></button>
          <button class="transition rounded-md text-white bg-gray-700 mx-[2px] p-1 w-[27px] h-[27px] text-base hover:scale-105 active:scale-95" @click="modal.info = a;modal.open= true;"><div class="tooltip-hover"><Tooltip message="View" /></div><i class="text-base" v-html="icons.eye" ></i></button>
        </td>
      </tr>
    </table>
    <div class="flex gap-1" v-if="appointments.length > 0">
      <label>Pages:</label>
      <button @click="fetchPage(i)" class="w-[25px] h-[25px] shadow-md bg-gray-100 hover:underline hover:bg-gray-200 active:bg-gray-900 active:text-white transition" v-for="i in Math.ceil(appointmentsMaxCount/fetchSettings.results)" :style="i == appointmentsIndex ? 'background:rgb(17,24,39);color:#fff' : ''">{{ i }}</button>
    </div>
    </div>

    <div v-show="viewMode == 1">
      <AppointmentsCalendar />
    </div>
    
  </MasterLayoutVue>
</template>


<style>
.tooltip-hover{display: none;}
:hover > .tooltip-hover{display: block;}

</style>