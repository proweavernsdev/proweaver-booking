<script>
import {axios, dateFormat,dateAdjusted,dateOffseted} from '../functions'
import StyledAlertVue from './SchedulerV2/StyledAlert.vue'
import DateFunc from '../DateTime'

export default{
    emits:['onResult','onFetch','selectedService'],
    components:{StyledAlertVue},
    props:{
        schedule: {
            type: String
        },
        serviceSelect:{
            default:'',
            type:String
        }
    },
    data(){
        return{
            title:'',
            cc:{y:0,m:0,d:0},
            qd:{y:0,m:0,d:0},
            calendarBoxes:[],
            availDates:[],
            availableSchedules:[],
            fetching:false,
            chosenSchedule:null,
            scheduleSelection: false,
            service:null,
            styledAlert:{
                header:'Scheduler Error',
                body:'asdsad',
                buttons:[],
                type:'neutral',
                duration:2000,
                show:false
            }
        }
    },
    watch:{
        fetching(){
            this.$emit('onFetch',this.fetching)
        },
        async schedule(){
            if(['',null].includes(this.schedule)) return;
            this.chosenSchedule = this.schedule
        },
        serviceSelect(){
            this.service = this.serviceSelect
            this.waitForCondition(()=>this.fetching == false,()=>{
    
                this.fetchScheds();
            })
        }
    },
    async mounted(){
        // setInterval(()=>{
        //     // console.log(new DateFunc().client().dateObj)
        // },1000)
        this.service = this.serviceSelect
        let date = this.dateTime().dateObj;
        this.cc.y = date.getUTCFullYear();
        this.cc.m = date.getUTCMonth();
        this.cc.d = date.getUTCDate();
        this.qd.y = date.getUTCFullYear();
        this.qd.m = date.getUTCMonth();
        this.qd.d = date.getUTCDate();
        
        this.buildCalendar()
        
        this.chosenSchedule = this.schedule
        if(['',null,undefined].includes(this.schedule)) {
            this.fetchScheds().then(()=>this.buildCalendar())
            return
        }   

        this.fetching = true;
        let requestString = 'schedules/fetchAvailable?book_schedule_id='+this.schedule;
        if(this.service != '' && this.service != null) requestString+='&book_schedule_service='+this.service  
        let res = await axios.post(requestString,'default')
        if(res.data == null || !res.data.success) return;
        date = this.dateAdjusted(res.data.result[0].book_schedule_date);
        this.cc.y = date.getFullYear();
        this.cc.m = date.getMonth();
        this.cc.d = date.getDate();
        this.qd.y = date.getFullYear();
        this.qd.m = date.getMonth();
        this.qd.d = date.getDate();
        
        this.waitForCondition(()=>this.fetching == false,()=>{
            this.fetchScheds().then(()=>{
                this.$emit('selectedService',res.data.result[0])
                this.buildCalendar()
                this.fetching = false;
            })
            
        })
        
        
    },
    methods:{
        dateFormat,
        dateTime(yearOrDateString=null,month=null,day=null,hours=0,minutes=0,seconds=0){
            return new DateFunc(yearOrDateString,month,day,hours,minutes,seconds)
        },
        dateAdjusted,
        dateOffseted,
        alertNotif(header,body,type,buttons=[],duration=2000){
            this.styledAlert.header = header;
            this.styledAlert.body = body;
            this.styledAlert.type = type;
            this.styledAlert.buttons = buttons;
            this.styledAlert.duration = duration;
            this.styledAlert.show = true;
        },
        waitForCondition(condition, action) {
            if (condition()) {
                action();
            } else {
                setTimeout(() => this.waitForCondition(condition, action), 100); // Wait for 100 milliseconds and check again
            }
        },
        selectSchedule(sched){
            if(
                this.dateTime(sched.book_schedule_date+' '+sched.book_schedule_timestart).dateObj.getTime() <=
                this.dateOffseted().getTime()
            ){
                this.alertNotif('Schedule Done','You cannot select a finished schedule!','danger')
                return
            }

            if(sched.is_full){
                this.alertNotif('Schedule Was Booked','Your chosen time slot appoinment is no longer available. Please make a selection for another time and date of the month, note that selections are based on "First response". Thank you!','danger')
                return;
            }

            if(sched.book_schedule_special_status == 1){
                this.alertNotif('Schedule Unavailable: Reserved','This schedule is already reserved. Please make a selection for another time and date of the month, note that selections are based on "First Response". Thank you!','danger')
                return;
            }

            if(sched.book_schedule_special_status == 2){
                this.alertNotif('Schedule Unavailable: Office Closed','Please make a selection for another time and date of the month, note that selections are based on "First Response". Thank you!','danger')
                return;
            }


            // only for capoe
            if(sched.conflicts > 0){
                this.alertNotif('Schedule Was Booked','Your chosen schedule is no longer available as it reached maximum number of bookings.','danger')
                return;
            }

            this.chosenSchedule = sched.book_schedule_id
            this.scheduleSelection = true;
            this.$emit('onResult',this.chosenSchedule)
            this.$emit('selectedService',sched)
        },
        async fetchScheds(){
            if(this.fetching) return;
            this.fetching = true;
            let date = dateAdjusted(this.qd.y,this.qd.m,this.qd.d);
            this.availDates = [];
            let includeService = (this.service != '' && this.service != null) ? '&service='+this.service : ''
            let res = await axios.post(`schedules/availableSchedulesWithinMonth?month=${this.cc.m+1}&year=${this.cc.y}${includeService}`,'default');
            if(res.data != null && res.data.success){
                res.data.result.forEach(el=>{
                    this.availDates.push(el.book_schedule_date);
                });    
            }
            
            includeService = (this.service != '' && this.service != null) ? '&book_schedule_service='+this.service : ''
            res = await axios.post('schedules/fetchAvailable?book_schedule_date='+dateFormat('%y-%M-%D',date.getTime())+includeService,'default')
            this.availableSchedules = [];
            if(res.data != null && res.data.success){
                res.data.result.forEach(el=>{
                    if(el.book_schedule_maxappointment < el.count_appointments) el.schedule_full = true;
                    else el.schedule_full = false;
                    this.availableSchedules.push(el);
                });

                

                if(this.value != null) this.selectedSchedule = this.value;
            }
            
            this.availableSchedules.sort((a,b)=>{
                return this.dateAdjusted(a.book_schedule_date+' '+a.book_schedule_timestart).getTime() - this.dateAdjusted(a.book_schedule_date+' '+b.book_schedule_timestart).getTime()
            })
            this.fetching = false;

            return;
        },
        buildCalendar(){
            let startMonth = this.dateAdjusted(this.cc.y,this.cc.m,1);
            let endMonth = this.dateAdjusted(this.cc.y,this.cc.m+1,0);
            let offsetStart = this.dateAdjusted(this.cc.y,this.cc.m,1).getDay();
            let offsetEnd = this.dateAdjusted(this.cc.y,this.cc.m+1,0).getDay();
            startMonth.setDate(startMonth.getDate() - offsetStart);
            endMonth.setDate(endMonth.getDate() + (6 - offsetEnd));
            this.calendarBoxes = [];

            while(startMonth.getTime() <= endMonth.getTime()){
                let dateString = dateFormat('%y-%M-%D',startMonth.getTime());
                let newDateBox = {
                    date: dateString,
                    dateNum: startMonth.getDate(),
                    isCurrentMonth: startMonth.getMonth() == this.cc.m,
                    scheds:this.fetchScheds(dateString),
                    onclick:async (dateString)=>{
                        if(this.fetching) return;
                        let date = this.dateAdjusted(dateString);
                        this.qd.y = date.getFullYear();
                        this.qd.m = date.getMonth();
                        this.qd.d = date.getDate();
                        if(date.getMonth() != this.cc.m){
                            date = this.dateAdjusted(this.qd.y,this.qd.m,this.qd.d)
                            this.cc.y = date.getFullYear();
                            this.cc.m = date.getMonth();
                            this.cc.d = date.getDate();
                            this.fetchScheds().then(()=>{
                                this.buildCalendar()
                                this.fetching = false;
                            });
                            return;
                        }
                        this.fetching = true;
                        this.availableSchedules = [];
                        let includeService = (this.service != '' && this.service != null) ? '&book_schedule_service='+this.service : ''
                        let res = await axios.post('schedules/fetchAvailable?book_schedule_date='+dateFormat('%y-%M-%D',date.getTime())+includeService,'default')
                        if(res.data != null && res.data.success){
                            res.data.result.forEach(el=>{
                                if(el.book_schedule_maxappointment < el.count_appointments) el.schedule_full = true;
                                else el.schedule_full = false;
                                this.availableSchedules.push(el);
                            });
                            if(this.value != null) this.selectedSchedule = this.value;
                        }
                        this.availableSchedules.sort((a,b)=>{
                            return this.dateAdjusted(a.book_schedule_date   +' '+a.book_schedule_timestart).getTime() - this.dateAdjusted(a.book_schedule_date +' '+b.book_schedule_timestart).getTime()
                        })
                        this.fetching = false;
                    }
                }
                this.calendarBoxes.push(newDateBox);
                startMonth.setDate(startMonth.getDate() + 1);
            }

            this.title = dateFormat('%lm %y',this.dateAdjusted(this.cc.y,this.cc.m,this.cc.d).getTime());
        },
        nextMonths(num){
            if(this.fetching) return;
            let date = this.dateAdjusted(this.cc.y,this.cc.m,this.cc.d);
            date.setMonth(date.getMonth() + num);
            if(num > 0 && this.dateAdjusted(this.cc.y,this.cc.m+2,0).getDate() < this.cc.d) date.setMonth(date.getMonth() - 1);
            if(num < 0 && this.dateAdjusted(this.cc.y,this.cc.m-1,0).getDate() < this.cc.d) date.setMonth(date.getMonth() + 1);
            this.qd.y = this.cc.y = date.getFullYear();
            this.qd.m = this.cc.m = date.getMonth();
            this.qd.d = this.cc.d = date.getDate();
            
            this.buildCalendar();
        },
    }
}

</script>

<template>

<StyledAlertVue
    :header="styledAlert.header"
    :body="styledAlert.body"
    :buttons="styledAlert.buttons"
    :type="styledAlert.type"
    :duration="styledAlert.duration"
    :show="styledAlert.show"
    @dismiss="styledAlert.show=false"
    @onResult="e=>alertResult=e"
/>

    <div class="pwfvf-scheduler"> <!--scheduler parent -->
        <div class="pwfvf-scheduler-header">
            <button @click="nextMonths(-1)">&#10094;</button>
            <h2>{{ title }}
            </h2>
            <button @click="nextMonths(1)">&#10095;</button>
        </div>
        <div class="pwfvf-scheduler-dateboxes">
            <div>SUN</div>
            <div>MON</div>
            <div>TUE</div>
            <div>WED</div>
            <div>THU</div>
            <div>FRI</div>
            <div>SAT</div>
            <div @click="cb.onclick(cb.date)" class="pwfvf-scheduler-datebox" v-for="cb,i in calendarBoxes" :class="{notCurrentMonth: !cb.isCurrentMonth, active:this.dateAdjusted(cb.date + ' 00:00:00').getTime() == this.dateAdjusted(qd.y,qd.m,qd.d).getTime(), hasSchedule:availDates.includes(cb.date)}">
                <span>{{cb.dateNum}}</span>
            </div>
        </div>
        <div class="pwfvf-scheduler-availscheds">
            <div class="spinner" v-if="fetching"></div>
            <div class="pwfvf-scheduler-availscheds-empty" v-if="!fetching && availableSchedules.length == 0">No schedules for this date...</div>
            <div class="pwfvf-scheduler-availscheds-item" v-for="asc in availableSchedules" @click="selectSchedule(asc)"   :key="asc.book_schedule_id" :class="{active:chosenSchedule == asc.book_schedule_id}">
                <h2>{{ asc.book_schedule_service }}
                    <span v-if="asc.is_full && asc.book_schedule_special_status == 0">Booked</span>
                    <span v-if="dateTime(asc.book_schedule_date+' '+asc.book_schedule_timestart).dateObj.getTime() <=
                dateOffseted().getTime() && asc.book_schedule_special_status == 0">Done</span>
                <span v-if=" asc.book_schedule_special_status != 0">{{ ['None','Reserved','Closed'][asc.book_schedule_special_status] }}</span>
                    <!-- <span v-if="this.dateAdjusted(asc.book_schedule_date+' '+asc.book_schedule_timestart).getTime() <=
                this.dateAdjusted().getTime()">Booked</span> -->
                </h2>
                <small>{{ dateFormat('%h:%I%a',asc.book_schedule_date +' '+asc.book_schedule_timestart)}} - 
                {{ dateFormat('%h:%I%a',asc.book_schedule_date +' '+asc.book_schedule_timeend)}}</small>
            </div>
        </div>
    </div><!--/scheduler parent --> 
</template>

<style>

.spinner {
  display: block;
  margin: 0 auto;
  width: 20px;
  height: 20px;
  border: 3px solid #aaa;
  border-top-color: #222;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.pwfvf-scheduler-availscheds-item h2 span{
    font-size: 11px;
    padding: 2px 5px;
    background: rgb(165, 48, 48);
    color: #fff;
    border-radius: 14px;
    margin: 2px;
}


</style>