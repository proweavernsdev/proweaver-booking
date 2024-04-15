<template>
    <div id="printArea" :class="{printing:isPrinting}">
        <!-- top controls -->
        <h2 class="text-3xl font-bold text-center mb-3">{{ dateFormat('%lm',dateAdjusted(cc.y,cc.m,cc.d).getTime()) }}
            <span class="text-[#936520]">{{ dateFormat('%y',dateAdjusted(cc.y,cc.m,cc.d).getTime()) }}</span>
        </h2>

        <div class="flex gap-2 w-full items-center mb-10 justify-center">
                <button v-if="!isPrinting" @click="nextMonths(-1)" class="text-sm text-center flex justify-center items-center shadow shadow-gray-300 h-[30px] p-2 bg-gray-200 hover:scale-105 active:scale-95 transition"><i v-html="icons.chevronLeft" class="m-1 mt-[5px]"></i>Prev</button>
                <button class="text-sm text-center flex justify-center items-center shadow shadow-gray-300 h-[30px] p-2 bg-gray-200 hover:scale-105 active:scale-95 transition" v-if="!isPrinting" @click="generatePDF">Print As PDF<i v-html="icons.pdf" class="m-1 mt-[5px]"></i></button>
                <button v-if="!isPrinting" @click="nextMonths(1)" class="text-sm text-center flex justify-center items-center shadow shadow-gray-300 h-[30px] p-2 bg-gray-200 hover:scale-105 active:scale-95 transition">Next <i v-html="icons.chevronRight" class="m-1 mt-[5px]"></i></button>
                <div v-if="isPrinting">
                    As of {{dateFormat('%lm %d, %y - %h:%I:%S %a',time) }}
                </div>
            </div>


        <!-- calendar view -->
        <div class="grid border-dashed border-gray-400 border" style="grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr;">
            <div class="font-bold border-r border-dashed border-gray-400 px-1 py-1 text-sm">SUN</div>
            <div class="font-bold border-r border-dashed border-gray-400 px-2 py-1">MON</div>
            <div class="font-bold border-r border-dashed border-gray-400 px-2 py-1">TUE</div>
            <div class="font-bold border-r border-dashed border-gray-400 px-2 py-1">WED</div>
            <div class="font-bold border-r border-dashed border-gray-400 px-2 py-1">THU</div>
            <div class="font-bold border-r border-dashed border-gray-400 px-2 py-1">FRI</div>
            <div class="font-bold  border-dashed border-gray-400 px-1 py-1 text-sm">SAT</div>

            <div class="pb-8 pt-0 border-t border-solid border-orange-500" v-for="c,ic in cBox" :class="{
                'border-gray-500 text-gray-800' : c.isCurrentMonth,
                'border-stone-300 text-stone-500' : !c.isCurrentMonth,
                'border-r border-r-solid':(ic+1) % 7 != 0,
            }" data-printclass="calendar-dates">
                <h3 class="font-bold mb-3 border-b border-solid border-orange-500 px-2 bg-orange-100 text-sm">{{ c.dateNum }}</h3>
                <div class="p-2">
                    <div class="text-[12px] mb-2"  v-for="cs,i in c.scheds">
                        <strong class="block text-md">{{cs.service}}</strong>
                        <p v-if="cs.special_status > 0" class="bg-red-500 text-white font-semibold w-max px-1.5 rounded-full my-1">{{ ['None','Reserved','Closed'][cs.special_status] }}</p>
                        <p>{{ dateFormat('%h1:%I%a',new Date(cs.shift_date+' '+cs.shift_start).getTime()) }} - {{ dateFormat('%h1:%I%a',new Date(cs.shift_date+' '+cs.shift_end).getTime()) }}</p>
                        <!-- <p v-if="cs.appointments.length == 0">(No entry)</p> -->
                        <!-- <p v-if="cs.appointments.length > 0">({{ cs.appointments.length }} {{ cs.appointments.length > 1? 'Entries' : 'Entry' }})</p> -->
                        <ul class="list-disc list-inside">
                            <li class=" hover:underline cursor-pointer text-red-600 underline text-[10  px]" v-for="appt,ia in cs.appointments"
                            :style="isPrinting ? 'white-space: normal !important;overflow: visible !important;text-overflow: unset !important;':''"
                                @click="modal.info = {...appt,...cs};modal.open=true"
                            ><span class="font-bold -ml-1">{{ appt.book_appointment_name==''? '<No Name Index>':appt.book_appointment_name }}</span> ({{ ['Pending','Approved','Denied','Completed'][appt.book_appointment_status] }})</li>
                        </ul>
                    </div>
                </div>
            </div>

        </div>
    </div>
    

    <!-- modal view -->
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
              <td class="border-b p-1">{{ dateFormat('%sm %d, %y (%h:%I %a)',modal.info.book_appointment_created_at) }}</td>
            </tr>
          </table>
          <div class="flex justify-end my-5">
            <button v-if="[0,'0'].includes(modal.info.book_appointment_status)" class="transition flex gap-2 items-end rounded-md w-[100px] text-white bg-green-700 mx-[4px] p-1.5 text-base hover:scale-105 active:scale-95" @click="changeStatus(modal.info.book_appointment_id,1,modal.info.id)"><i class="text-base w-[20px] h-[20px] object-contain" v-html="icons.thumbsUp" ></i> Approve</button>
            <button v-if="[0,'0',1,'1'].includes(modal.info.book_appointment_status)" class="transition flex gap-2 items-center rounded-md w-[80px] text-white bg-red-700 mx-[2px] p-1.5 text-base hover:scale-105 active:scale-95" @click="changeStatus(modal.info.book_appointment_id,2,modal.info.id)"><i class="text-base w-[20px] h-[20px] object-contain mt-1" v-html="icons.thumbsDown" ></i> Deny</button>
            <button v-if="[1,'1'].includes(modal.info.book_appointment_status)" class="transition flex gap-2 items-center rounded-md w-[120px] text-white bg-teal-700 mx-[2px] p-1.5 text-base hover:scale-105 active:scale-95" @click="changeStatus(modal.info.book_appointment_id,3,modal.info.id)"><i class="text-base mt-1 w-[20px] h-[20px] object-contain" v-html="icons.check" ></i> Completed</button>
          </div>
          
        </div>
    </div>
    </div>
</template>

<script setup>
import {ref, reactive, onMounted, watch, computed} from 'vue'
import icons from '../assets/icons'
import { dateFormat, axios,lStore, dateAdjusted } from '../functions';
import router from '../router';



//data
let isPrinting = ref(false)
let modal = ref({
    open:false,
    info:{}
})
let cc = reactive({
    y: 2023,
    m: 0,
    d: 1,
})

let lastFetch = reactive({
    y: 2023,
    m: 0,
})
let hasFetched = ref(false)

let qd = reactive({
    y: 2023,
    m: 0,
    d: 1,
})

let cBox = reactive([])
let schedules = reactive({})

// onmount
onMounted(()=>{
    let date = dateAdjusted()
    cc.y = qd.y = date.getFullYear()
    cc.m = qd.m = date.getMonth()
    cc.d = qd.d = date.getDate()

    if(document.getElementById('html2canvas') == null){
        const script = document.createElement('script')
        script.id = 'html2canvas'
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.8.1/html2pdf.bundle.min.js'
        document.body.appendChild(script)
    }

    if(document.getElementById('tailwindcss') == null){
        const link = document.createElement('link')
        link.id = 'html2canvas'
        link.rel= 'stylesheet'
        link.href = 'https://cdn.tailwindcss.com/3.2.7/tailwind.min.css'
        document.head.appendChild(link)
    }

    buildCalendar()
    fetchSchedulesFromServer()
    isPrinting.value = false
    setInterval(()=>time.value=dateAdjusted().getTime(),500)
})

//watch
watch(()=>cc,()=>{
    if(!hasFetched) return;
    if(cc.m != lastFetch.m) {
        fetchSchedulesFromServer();
        return;
    }

    if(cc.y != lastFetch.y) {
        fetchSchedulesFromServer();
        return;
    }
},{deep:true})

let time = ref(dateAdjusted().getTime())



//defines

//methods

function buildCalendar(){
    let startMonth = dateAdjusted(cc.y,cc.m,1);
    let endMonth = dateAdjusted(cc.y,cc.m+1,0);
    let offsetStart = dateAdjusted(cc.y,cc.m,1).getDay();
    let offsetEnd = dateAdjusted(cc.y,cc.m+1,0).getDay();
    startMonth.setDate(startMonth.getDate() - offsetStart);
    endMonth.setDate(endMonth.getDate() + (6 - offsetEnd));
    cBox.splice(0)

    while(startMonth.getTime() <= endMonth.getTime()){
        let dateString = dateFormat('%y-%M-%D',startMonth.getTime());
        let newDateBox = {
            date: dateString,
            dateNum: startMonth.getDate(),
            isCurrentMonth: startMonth.getMonth() == cc.m,
            scheds:fetchScheds(dateString),
            onclick:(dateString,e)=>{
                let date = dateAdjusted(dateString);
                qd.y = date.getUTCFullYear();
                qd.m = date.getUTCMonth();
                qd.d = date.getUTCDate();
            }
        }
        cBox.push(newDateBox);
        startMonth.setDate(startMonth.getDate() + 1);
    }

}

function fetchScheds(dateString){
    let hitScheds = [];
    for(let ds in schedules){
        let el = JSON.parse(JSON.stringify(schedules[ds]));
        if(el.shift_date != dateString) continue;
        hitScheds.push(el);
    }
    hitScheds.sort((a,b)=>{
        return dateAdjusted(dateString+' '+a.shift_start).getTime() - dateAdjusted(dateString+' '+b.shift_start).getTime()
    })

    return hitScheds;
}

function nextMonths(num){
    let date = dateAdjusted(cc.y,cc.m,cc.d)
    date.setMonth(date.getMonth() + num)
    cc.y = date.getFullYear()
    cc.m = date.getMonth()
    cc.d = date.getDate()
    qd.y = date.getFullYear()
    qd.m = date.getMonth()
    qd.d = date.getDate()
    buildCalendar()
}


async function generatePDF() {
    isPrinting.value = true
    setTimeout(()=>{
        lStore.printHtml = document.getElementById('printArea').innerHTML
        router.push('/print')
    },200)
}

function printCalendar(){
    isPrinting.value = true
    setTimeout(() => {
        let opt = {
            margin: [10,10,10,10],
            filename: `booking-schedule-${dateFormat('%sm-%y',dateAdjusted(cc.y,cc.m,cc.d).getTime())}-asof_${dateFormat('%y-%M-%D',dateAdjusted().getTime())}.pdf`,
            image: { type: 'jpeg', quality: 2 },
            html2canvas: {
                dpi: 300,
                scale:0.5,
                letterRendering: true,
                useCORS: true
            },
            jsPDF: { unit: 'mm', orientation: 'landscape',format:'letter'},
            pagebreak:    { mode: ['avoid-all', 'css'] }
        };
        try{
            html2pdf(document.querySelector('#printArea'),opt).save()
        }catch(e){
            console.log('printed');
        }
    }, 100);

    setTimeout(() => {
        isPrinting.value = false
    }, 500);
        
}

function fetchSchedulesFromServer(){
    let start = dateFormat('%y-%M-%D', dateAdjusted(cc.y,cc.m-1,1).getTime())
    let end = dateFormat('%y-%M-%D', dateAdjusted(cc.y,cc.m+2,0).getTime())
    lastFetch.m = cc.m;
    lastFetch.y = cc.y;
    hasFetched.value = true;
    axios.post(`schedules/fetchWithAppointments?book_schedule_date>=${start}&book_schedule_date<=${end}`).then(res=>{
        schedules.property = {}
        if(!res.data.success){
            return
        }
        res.data.result.forEach(el=>{
            if(schedules[el.book_schedule_id] != null && el != schedules[el.book_schedule_id]) return;
            schedules[el.book_schedule_id] = {
                id:el.book_schedule_id,
                shift_date: el.book_schedule_date,
                shift_start: el.book_schedule_timestart,
                shift_end: el.book_schedule_timeend,
                description: el.book_schedule_description,
                service: el.book_schedule_service,
                color: el.book_schedule_color,
                max_appointments: el.book_schedule_maxappointment,
                special_status:el.book_schedule_special_status,
                appointments: el.appointments
            }
        })

        buildCalendar()
        
    })
}

function parseJSON(mix){
  let schedule = {
    'Schedule ID' : mix.id,
    'Date' : dateFormat('%lm %d, %y',mix.shift_date),
    'From' : dateFormat('%h:%I %a',mix.shift_date+' '+mix.shift_start),
    'To' : dateFormat('%h:%I %a',mix.shift_date+' '+mix.shift_end),
    'Description' : ['',null].includes(mix.description) ? '-' : mix.description,
  };

  return {
    appointment:JSON.parse(mix.book_appointment_custominputs),
    schedule:schedule,
    status: ['Pending', 'Approved', 'Denied','Completed'][mix.book_appointment_status]
  }
}

function changeStatus(id, status, scheduleId){
  if(!confirm(['Pending', 'Approve', 'Deny','Complete'][status] + ' this appointment?')) return;
  modal.value.open = false;
  axios.post('appointments/changeStatus?id='+id,null,{status:status}).then(res=>{
    if(!res.data.success) return;
    let index = schedules[scheduleId].appointments.findIndex(el=>el.book_appointment_id==id)
    if(index < 0) return
    schedules[scheduleId].appointments[index].book_appointment_status = status
    buildCalendar()
  })
}

</script>

<style scoped>
/* #printArea.printing * {font-family: sans-serif;font-size:14px !important;}
#printArea.printing h2{font-size:18px !important;margin-right: 15px;}
#printArea.printing button{display: none;}
#printArea.printing [data-printclass="calendar-dates"]{padding: 0 !important;}
#printArea.printing ul{list-style-type: disc;} */
/* #printArea.printing ul li{white-space: normal !important;overflow: visible !important;text-overflow: unset !important;} */
</style>    