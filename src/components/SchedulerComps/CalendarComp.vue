<template>
    <div class="scheduler-calendar-parent">
        <ScheduleSetForm
            :modalCloseProp="modalClose"
            :schedule="queSchedule"
            :facilities="labelValueForFacilities.noAllOpts"
            :roles="labelValueForDesignations.noAllOpts"
            @close="e=>{modalClose=e;}"
            @onCreate="e=>createSchedule(e)"
            @onUpdate="e=>updateSchedule(e)"
            @onDelete="e=>deleteSchedule(e)"
            @onResult="e=>alertResult=e"
            @noServicesError="noServicesErrorStatus=true;alert('No Services Found','You might need to add a service before you can manage schedules.','danger',[],4000)"
            @services="e=>services = e"
        />
        <StyledAlert
            :header="styledAlert.header"
            :body="styledAlert.body"
            :buttons="styledAlert.buttons"
            :type="styledAlert.type"
            :duration="styledAlert.duration"
            :show="styledAlert.show"
            @dismiss="styledAlert.show=false;noServicesError()"
            @onResult="e=>alertResult=e"
        />

        <div class="scheduler-form-advanceddelete-modalparent" :class="{open:advancedDelete.open}">
            <div class="scheduler-form-advanceddelete-modal" v-if="services != null && services.length > 0">
                <h2 class="font-semibold">Advanced Delete</h2>
                <div class="grid mt-1 gap-2" style="grid-template-columns: 3fr 5fr;" >
                    <label class="mt-1">Delete schedule from dates</label>
                    <div class="flex gap-1 items-center" >
                        <CustomFieldVue
                            class="flex-grow" 
                            type="date"
                            name="scheduler-delete-datestart"
                            :value="advancedDelete.date_start"
                            @on-result="e=>advancedDelete.date_start=e"
                        />
                        to
                        <CustomFieldVue 
                            class="flex-grow"
                            type="date"
                            name="scheduler-delete-datestart"
                            :value="advancedDelete.date_end"
                            @on-result="e=>advancedDelete.date_end=e"
                        />
                    </div>
                    <label class="mt-1">Specific Service</label>
                    <CustomFieldVue 
                    type="select"
                    name="scheduler-delete-service"
                    columns="1fr 1fr 1fr 1fr"
                    :values="[{label:'All Services',value:'all'},...JSON.parse(JSON.stringify(services))]"
                    :value="advancedDelete.service"
                    @on-result="e=>advancedDelete.service=e"
                    />
                    <label class="mt-1">Target Weekdays</label>
                    <CustomFieldVue 
                        type="checkbox-group"
                        name="scheduler-delete-repeatdays"
                        columns="1fr 1fr 1fr 1fr"
                        :select="advancedDelete.days"
                        @on-result="e=>advancedDelete.days=e"
                        :values="[
                            {label:'Sun',value:0},
                            {label:'Mon',value:1},
                            {label:'Tue',value:2},
                            {label:'Wed',value:3},
                            {label:'Thu',value:4},
                            {label:'Fri',value:5},
                            {label:'Sat',value:6}
                        ]"
                    />
                </div>
                <div class="mb-2">
                    <h3 class="">Time Slots</h3>
                    <div class="max-h-[100px] overflow-y-auto pr-2 overflow-x-hidden mb-2">
                        <div class="grid gap-1 items-center mb-1" :style="{
                                'grid-template-columns': (advancedDelete.timeSlots.length > 1) ? '1fr 20px 1fr 22px' : '1fr 20px 1fr'
                            }" v-for="ts,i in advancedDelete.timeSlots">
                            <CustomFieldVue 
                                type="time"
                                name="scheduler-form-timestart"
                                :value="dateFormat('%H:%M','2022-01-01 '+advancedDelete.timeSlots[i].time_start)"
                                @on-result="e=>advancedDelete.timeSlots[i].time_start=e"
                            />
                            to
                            <CustomFieldVue 
                                type="time"
                                name="scheduler-form-timestart"
                                :value="dateFormat('%H:%M','2022-01-01 '+advancedDelete.timeSlots[i].time_end)"
                                @on-result="e=>advancedDelete.timeSlots[i].time_end=e"
                            />
                            <div>
                                <button class="basic danger bg-red-500 text-white p-1 flex justify-center items-center w-[20px] h-[20px] p-1" v-if="advancedDelete.timeSlots.length > 1" @click="advancedDelete.timeSlots.splice(i,1)">
                                    <i v-html="icons.trash"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                    <button class="savechanges" @click="advancedDelete.timeSlots.push({time_start:'',time_end:''})" >Add Time Slot</button>
                </div>
                <div class="mt-4 mb-2 bg-red-50 p-3 border border-red-300 rounded-md">
                    <p class="italic font-semibold text-red-700 text-sm">Important Notes:</p>
                    <ul class="italic font-semibold text-red-700 text-sm list-disc pl-3">
                        <li>All changes made here will directly reflect on the database. Please proceed with utmost caution.</li>
                        <li>This does not delete the schedules that are not yet saved and will only delete the schedules that are already in the database.</li>
                    </ul>
                </div>
                
                <div class="flex justify-end gap-1">
                    <button class="dangercolor" @click="advancedDeleteFunc">
                        Delete Schedules
                    </button>
                    <button class="" @click="advancedDelete.open = false">
                        Cancel
                    </button>
                </div>
            </div>
        </div>



        <div class="scheduler-calendar-topcontrols">
            <div class="scheduler-calendar-controls">
                <button @click="nextMonths(-1)">&laquo;</button>
                <h4 class="title">{{ title }}</h4>
                <button @click="nextMonths(1)">&raquo;</button>
            </div>
            <div>
                <button class="viewselect" :class="{active:dragMode == 1}" @click="dragMode = (dragMode == 0) ? 1:0">Drag to: {{ (dragMode == 0) ? 'Move':'Copy' }}</button>
                <button class="savechanges" @click="saveChanges">Save Changes</button>
                <button class="advanceddelete" @click="advancedDelete.open = true">Advanced Delete</button>
            </div>
        </div>
        
        <div class="scheduler-calendar-days" :class="{calendarWeekView: viewMode == 1}">

            <div class="scheduler-calendar-item title">SUN</div>
            <div class="scheduler-calendar-item title">MON</div>
            <div class="scheduler-calendar-item title">TUE</div>
            <div class="scheduler-calendar-item title">WED</div>    
            <div class="scheduler-calendar-item title">THU</div>
            <div class="scheduler-calendar-item title">FRI</div>
            <div class="scheduler-calendar-item title">SAT</div>

            

            <div class="scheduler-calendar-item" :class="{isNotCurrentMonth:!cb.isCurrentMonth && viewMode == 0,active: new Date(cb.date + ' 00:00:00').getTime() == new Date(qd.y,qd.m,qd.d).getTime()}" v-for="cb,i in calendarBoxes" :key="i" @click="cb.onclick(cb.date,$event)" @dragenter.prevent @dragover.prevent="$event.target.closest('.scheduler-calendar-item').classList.add('dragovered')" @dragleave.prevent="$event.target.closest('.scheduler-calendar-item').classList.remove('dragovered')" @drop="$event.target.closest('.scheduler-calendar-item').classList.remove('dragovered');dropSched(cb.date,$event,1)" @dblclick="">
                <p class="datenum"><span>{{cb.dateNum}}</span> <span class="calendar-date-tooltip" @click="addSchedule(cb.date)">Add Schedules</span></p>
                <div class="dayschedule-cont">
                    <div class="dayschedule" v-for="ds,i in cb.scheds" :key="i" draggable="true" @dragstart="dragSched(ds,$event,0)" @click="editSchedule(ds)" :style="'border-bottom: 3px solid '+ds.color">
                        <h5 :style="'color:'+ds.color" class="white-space:nowrap;overflow:hidden;text-overflow:ellipsis">{{ ds.service }}</h5>
                        <p>
                            <span>{{ dateFormat('%h:%M%a',ds.shift_date + ' '+ds.shift_start) }}</span> - 
                            <span>{{ dateFormat('%h:%M%a',ds.shift_date + ' '+ds.shift_end) }}</span>
                        </p>
                    </div>
                </div>
                
            </div>
        </div>
    </div>
</template>

<script>
import {dateFormat} from './scheduler.utils'
import {axios} from '../../functions'
import CustomFieldVue from './CustomField.vue';
import ScheduleSetForm from './ScheduleSetForm.vue';
import StyledAlert from './StyledAlert.vue';
import icons from '../../assets/icons'

export default{
    components:{ScheduleSetForm,CustomFieldVue,StyledAlert},
    data(){
        return{
            icons,
            viewMode:0,
            branches:[],
            designations:[],
            editTracker:{
                created: [],
                updated: [],
                deleted: [],
                assignedChanges:{},
            },
            console,
            alertResult:null,
            cc:{y:0,m:0,d:0},
            qd:{y:0,m:0,d:0},
            calendarBoxes:[],
            title:'',
            services:[],
            noServicesErrorStatus:false,
            modalClose:true,
            styledAlert:{
                header:'Scheduler Error',
                body:'asdsad',
                buttons:[],
                type:'neutral',
                duration:2000,
                show:false
            },
            dragMode: 0,
            queSchedule:{
                id:'',
                shift_date: '',
                shift_start:'',
                shift_end:'',
                description:'',
                timeSlots:[{time_start:'00:00:00',time_end:'01:00:00'}],
                repeatDays:[],
                service:null,
                color:null,
                max_appointments:0
            },
            advancedDelete:{
                open: false,
                date_start: '',
                date_end: '',
                service: '',
                days:[],
                timeSlots:[{time_start:'00:00:00',time_end:'01:00:00'}]
            },
            defVals:{
                id:'',
                shift_date: '',
                shift_start:'',
                shift_end:'',
                timeSlots:[{time_start:'00:00:00',time_end:'01:00:00'}],
                repeatDays:[],
                description:'',
                service:null,
                color:null,
                max_appointments:0
            },
            schedules:{},
            lastFetch:{m:0,y:0},
            hasFetched: false
        }
    },
    mounted(){
        let date = new Date();
        this.cc.y = date.getFullYear();
        this.cc.m = date.getMonth();
        this.cc.d = date.getDate();
        this.qd.y = date.getFullYear();
        this.qd.m = date.getMonth();
        this.qd.d = date.getDate();
        this.buildCalendar();
        this.checkResponsive();
        this.initScheduler();
        window.onresize = ()=>this.checkResponsive();
    },
    watch:{
        cc:{
            handler(){
                if(!this.hasFetched) return;
                if(this.cc.m != this.lastFetch.m) {
                    this.fetchSchedulesFromServer();
                    return;
                }

                if(this.cc.y != this.lastFetch.y) {
                    this.fetchSchedulesFromServer();
                    return;
                }
            },
            deep:true
        },
        'advancedDelete.open' : {
            handler(){
                if(this.advancedDelete.open) return
                this.advancedDelete.date_start =  '',
                this.advancedDelete.date_end =  '',
                this.advancedDelete.service =  '',
                this.advancedDelete.days = [],
                this.advancedDelete.timeSlots = [{time_start:'00:00:00',time_end:'01:00:00'}]
            }
        }
    },
    computed:{
        employeesFiltered(){
            let filter = this.employeesFilter;
            let hitEmps = {};
            for(let i in this.employees){
                if(!this.employees[i].branches.includes(filter.facility) && filter.facility != -1) continue;
                if(!this.employees[i].roles.includes(filter.designation) && filter.designation != -1) continue;
                hitEmps[i] = JSON.parse(JSON.stringify(this.employees[i]));
            }
            this.employeesFilter.len = Object.values(hitEmps).length;
            return hitEmps;
        },
        labelValueForFacilities(){
            let opts = [];
            for(let b in this.branches){
                opts.push({
                    label: this.branches[b],
                    value: b
                });
            }

            let noAllOpts = JSON.parse(JSON.stringify(opts));

            opts.splice(0,0,{
                label: 'All Facilities',
                value: -1
            });
            
            return {
                noAllOpts,
                opts
            };
        },
        labelValueForDesignations(){
            let opts = [];
            for(let d in this.designations){
                opts.push({
                    label: this.designations[d].name,
                    value: d
                });
            }

            let noAllOpts = JSON.parse(JSON.stringify(opts));

            opts.splice(0,0,{
                label: 'All Designations',
                value: -1
            });

            return {
                noAllOpts,
                opts
            };
        }

    },
    methods:{
        async advancedDeleteFunc(){
            let delInfo = this.advancedDelete;

            if(delInfo.date_start == ''){this.alert('Start Date is empty','Please fill in the date field next to \'from\' keyword','danger');return}
            if(delInfo.date_end == ''){this.alert('End Date is empty','Please fill in the date field next to \'to\' keyword','danger');return}
            if(delInfo.days == null || delInfo.days.length == 0){this.alert('Target Weekdays are empty','Please select at least one day','danger');return}

            if(new Date(delInfo.date_end).getTime() < new Date(delInfo.date_start).getTime()){
                this.alert('Reversed Time Alert','The End Date is set earlier than the Start Date', 'danger')
                return
            }
            
            let timeSlotsHasEmptyVals = false
            delInfo.timeSlots.forEach(el=>{
                if(el.time_start.match(/^([0-9]{2}:[0-9]{2}:[0-9]{2})|([0-9]{2}:[0-9]{2})$/g) == null 
                || el.time_end.match(/^([0-9]{2}:[0-9]{2}:[0-9]{2})|([0-9]{2}:[0-9]{2})$/g) == null)
                    timeSlotsHasEmptyVals = true 
            })

            if(timeSlotsHasEmptyVals) {
                this.alert('Empty Time Slot Values','One or more fields under Time Slots are empty.', 'danger')
                return;
            }

            let resp = await this.waitForConfirm('Confirm Deletion?',
            `Please note that all the schedules you are about to delete will also delete the appointments that these schedules are associated with.<br><br>
            Schedules To Delete:<br>
            - Period: ${dateFormat('%sm %d, %y',delInfo.date_start)} - ${dateFormat('%sm %d, %y',delInfo.date_end)}<br>
            - Service: ${delInfo.service}<br>
            - Weekdays: ${delInfo.days.sort((a,b)=>a-b).map(el=>['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][el]).join(', ')}<br>
            - Time slots: ${delInfo.timeSlots.length} time slot/s
            `
            ,'warning',[
                {label:'Yes',data:true},
                {label:'No',data:false},
            ],3000);
            if(!resp) return

            axios.post('schedules/advancedDelete',null,{
                filterJSON: JSON.stringify(delInfo)
            }).then(()=>{
                this.schedules = {}
                this.fetchSchedulesFromServer()
                this.advancedDelete.open = false
            })


        },

        fetchSchedulesFromServer(){
            let start = dateFormat('%y-%m2-%D', new Date(this.cc.y,this.cc.m-1,1).getTime())
            let end = dateFormat('%y-%m2-%D', new Date(this.cc.y,this.cc.m+2,0).getTime())
            this.lastFetch.m = this.cc.m;
            this.lastFetch.y = this.cc.y;
            this.hasFetched = true;
            axios.post(`schedules/fetch?book_schedule_date>=${start}&book_schedule_date<=${end}`).then(res=>{
                if(!res.data.success){
                    return
                }

                for(let schedule in this.schedules){

                    if(
                        this.editTracker.created.includes(schedule) ||
                        this.editTracker.updated.includes(schedule) ||
                        this.editTracker.deleted.includes(schedule)
                    ) continue
                    delete this.schedules[schedule]
                    
                }

                res.data.result.forEach(el=>{


                    if(this.schedules[el.book_schedule_id] != null) return;

                    if(
                        this.editTracker.created.includes(el.book_schedule_id) ||
                        this.editTracker.updated.includes(el.book_schedule_id) ||
                        this.editTracker.deleted.includes(el.book_schedule_id)
                    ) return
                    
                    this.schedules[el.book_schedule_id] = {
                        id:el.book_schedule_id,
                        shift_date: el.book_schedule_date,
                        shift_start: el.book_schedule_timestart,
                        shift_end: el.book_schedule_timeend,
                        description: el.book_schedule_description,
                        service: el.book_schedule_service,
                        color: el.book_schedule_color,
                        max_appointments: el.book_schedule_maxappointment
                    }
                })

                

                this.buildCalendar()
                
            })
        },
        initScheduler(){
            this.fetchSchedulesFromServer()
        },
        parseToRequestContent(schedule){
            schedule = JSON.parse(JSON.stringify(schedule))
            let scheduleStartTime = new Date(schedule.shift_date+' '+schedule.shift_start);
            let scheduleEndTime = this.getScheduleEnd(schedule.shift_date,schedule.shift_start,schedule.shift_end);
            

            let sched = {
                book_schedule_id : schedule.id,
                book_schedule_date : schedule.shift_date,
                book_schedule_timestart : schedule.shift_start,
                book_schedule_timeend : schedule.shift_end,
                book_schedule_description : schedule.description,
                book_schedule_service : schedule.service,
                book_schedule_color : schedule.color,
                book_schedule_maxappointment : schedule.max_appointments
            };

            return sched;
            
        },
        async saveChanges(){
            let created = [];
            let updated = [];
            let completedCreate = 0;
            let completedUpdate = 0;
            let completedDelete = 0;

            this.editTracker.created.forEach(el=>created.push(this.parseToRequestContent(this.schedules[el])))
            this.editTracker.updated.forEach(el=>updated.push(this.parseToRequestContent(this.schedules[el])))


            if(
                created.length == 0 &&
                updated.length == 0 &&
                this.editTracker.deleted.length == 0 &&
                Object.keys(this.editTracker.assignedChanges).length == 0
            ){
                this.alert('','No changes made...','warning',[]);
                return;
            }

            let resp = await this.waitForConfirm('Save Changes?',
            `Changes you have made:
            <ul style="padding-left:15px">
            <li>Created <strong>${created.length}</strong> schedule${created.length > 1 ? 's':''}</li>
            <li>Updated <strong>${updated.length}</strong> schedule${updated.length > 1 ? 's':''}</li>
            <li>Deleted <strong>${this.editTracker.deleted.length}</strong> schedule${this.editTracker.deleted.length > 1 ? 's':''}</li>
            </ul>`
            ,'warning',[
                {label:'Yes',data:true},
                {label:'No',data:false},
            ],3000);
            if(!resp) return;

            created.forEach(el=>{
                axios.post('schedules/create',null,el).then(()=>completedCreate++);
            });

            updated.forEach(el=>{
                axios.post('schedules/update?id='+el.book_schedule_id,null,el).then(()=>completedUpdate++);
            });
            
            this.editTracker.deleted.forEach(el=>{
                axios.post('schedules/delete?id='+el,null).then(()=>{
                    completedDelete++;
                });
            });

            setInterval(()=>{
                let conditions = [false,false,false];

                if(completedCreate == created.length) conditions[0] = true;
                if(completedUpdate == updated.length) conditions[1] = true;
                if(completedDelete == this.editTracker.deleted.length) conditions[2] = true;
                
                if(conditions[0] && conditions[1] && conditions[2]) window.location.reload();

            },500);

        },
        checkAssignedDiffs(oldAssigned,newAssigned){
            let added = [];
            let deleted = [];
            newAssigned.forEach(el=>{
                let exists = oldAssigned.findIndex(el2=>el2.employee_id == el.employee_id)
                if(exists == -1) added.push(el);
            })

            oldAssigned.forEach(el=>{
                let exists = newAssigned.findIndex(el2=>el2.employee_id == el.employee_id)
                if(exists == -1) deleted.push(el);
            })

            return {
                added,
                deleted
            }
        },
        checkResponsive(){
            if(document.querySelector('.scheduler-calendar-parent').offsetWidth <= 1300){
                document.querySelector('.scheduler-calendar-parent').classList.add('responsive-1300');
                document.querySelector('.scheduler-calendar-parent').classList.remove('responsive-1000');
            }else if(document.querySelector('.scheduler-calendar-parent').offsetWidth <= 1000){
                document.querySelector('.scheduler-calendar-parent').classList.add('responsive-1000');
                document.querySelector('.scheduler-calendar-parent').classList.remove('responsive-1300');
            }else{
                document.querySelector('.scheduler-calendar-parent').classList.remove('responsive-1000');
                document.querySelector('.scheduler-calendar-parent').classList.remove('responsive-1300');
            }
        },
        dateFormat,
        
        getScheduleEnd(scheduleDate,schedStart,schedEnd){
            let scheduleStart = new Date(scheduleDate+' '+schedStart);
            let scheduleEnd = new Date(scheduleDate+' '+schedEnd);
            if(scheduleStart.getTime() >= scheduleEnd.getTime()) scheduleEnd.setDate(scheduleEnd.getDate() + 1);
            return scheduleEnd;
        },
        checkIfIsOneDayOrMore(scheduleDate,schedStart,schedEnd){
            let scheduleStart = new Date(scheduleDate+' '+schedStart);
            scheduleStart.setDate(scheduleStart.getDate() + 1);
            let scheduleEnd = this.getScheduleEnd(scheduleDate,schedStart,schedEnd);
            if(scheduleStart.getTime() == scheduleEnd.getTime()) return true;
            return false;
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
        createSchedule(e){ //create /
            let loopDate = new Date(e.shift_date);
            let endDate = new Date(e.shift_date_end);
            let iteration = 0;
            let midId = Date.now().toString(32);
            
            if(new Date(e.shift_date+' '+e.shift_start).getTime() <= new Date().getTime()){
                this.alert('Backdated Error','You cannot create a schedule set back in time.','danger',[],1500);
                this.modalClose = true;
                return;
            }

            if(this.getScheduleEnd(e.shift_date,e.shift_start,e.shift_end) <= new Date().getTime()){
                this.alert('Backdated Error','You cannot create a finished schedule.','danger',[],1500);
                return;
            }

            if(this.checkIfIsOneDayOrMore(e.shift_date,e.shift_start,e.shift_end)){
                this.alert('Schedule Duration Exceeded','The scheduler may only handle schedules that does not exceed or equal to 24 hours.','danger',[],2500);
                this.modalClose = true;
                return;
            }

            while(loopDate.getTime() <= endDate.getTime()){
                if(iteration == 0 || e.repeatDays.includes(loopDate.getDay())){
                    let newSched = {};
                    Object.keys(this.queSchedule).forEach(qs=>newSched[qs] = e[qs])

                    newSched.id = 
                    (1000).toString(32)+'-'+ //note: replace with user id of user adding the scheduke
                    midId+'-'+
                    iteration;

                    newSched.shift_date = dateFormat('%y-%m2-%D',loopDate.getTime());

                    newSched.timeSlots.forEach((el,i)=>{
                        let copyNewSched = JSON.parse(JSON.stringify(newSched))
                        copyNewSched.shift_start = el.time_start
                        copyNewSched.shift_end = el.time_end
                        copyNewSched.id = copyNewSched.id+'-'+i
                        this.schedules[copyNewSched.id] = copyNewSched;
                        this.editTracker.created.push(copyNewSched.id);
                    })

                    iteration++;

                }

                loopDate.setDate(loopDate.getDate() + 1);
            }


            this.modalClose = true;
            this.buildCalendar();

        },
        updateSchedule(e){ //update | create /
            let newSched = {};
            Object.keys(this.queSchedule).forEach(qs=>newSched[qs] = e[qs])


            if(this.getScheduleEnd(e.shift_date,e.shift_start,e.shift_end).getTime() <= new Date().getTime()){
                this.alert('Backdated Error','The schedule is set back in time.','danger',[],1500);
                this.modalClose = true;
                return;
            }

            if(this.checkIfIsOneDayOrMore(e.shift_date,e.shift_start,e.shift_end)){
                this.alert('Schedule Duration Exceeded','The scheduler may only handle schedules that does not exceed or equal to 24 hours.','danger',[],1500);
                this.modalClose = true;
                return;
            }
            

            let indexTrack = this.editTracker.created.indexOf(newSched.id);
            if(indexTrack === -1) this.editTracker.updated.push(newSched.id);
            

            for(let ns in newSched) this.schedules[e.id][ns] = newSched[ns];

            this.modalClose = true;
            this.buildCalendar();
        },
        deleteSchedule(e){ //delete | none /
            let ref = this.schedules[e];
            if(this.getScheduleEnd(ref.shift_date,ref.shift_start,ref.shift_end).getTime() <= new Date().getTime()){
                this.alert('Completed Schedule Error','The schedule is already finished, therefore the schedule cannot be deleted.','danger',[],3000);
                this.modalClose = true;
                this.resetQueSchedule();
                return;
            }

            let indexTrack = this.editTracker.created.indexOf(e);
            if(indexTrack === -1) this.editTracker.deleted.push(e);
            else this.editTracker.created.splice(indexTrack, 1)

            indexTrack = this.editTracker.updated.indexOf(e);
            if(indexTrack !== -1) this.editTracker.updated.splice(indexTrack, 1)

            delete this.schedules[e];
            this.modalClose = true;
            this.resetQueSchedule();
            this.buildCalendar();
        },
        resetQueSchedule(){
            this.queSchedule = JSON.parse(JSON.stringify(this.defVals))
        },
        addSchedule(date){
            this.resetQueSchedule();
            this.queSchedule.shift_date = date;
            this.modalClose=false;
        },
        noServicesError(){
            if(!this.noServicesErrorStatus) return;
            this.$router.push('/preferences');
        },
        editSchedule(schedule){
            this.resetQueSchedule();
            let editThisSchedule = JSON.parse(JSON.stringify(this.queSchedule))
            Object.keys(this.queSchedule).forEach(qd=>{
                editThisSchedule[qd] = schedule[qd];
            });
            this.queSchedule = editThisSchedule;

            this.modalClose=false;
        },
        fetchScheds(dateString){
            let hitScheds = [];
            for(let ds in this.schedules){
                let el = JSON.parse(JSON.stringify(this.schedules[ds]));
                if(el.shift_date != dateString) continue;
                hitScheds.push(el);
            }
            hitScheds.sort((a,b)=>{
                return new Date(dateString+' '+a.shift_start).getTime() - new Date(dateString+' '+b.shift_start).getTime()
            })
            return hitScheds;
        },
        dragSched(ds,e){
            try{
                e.dataTransfer.setData('schedData',JSON.stringify(ds));
            }catch(err){return;}
        },
        dropSched(date,e,originType){ //update | create /
            if(e.dataTransfer.getData('schedData') == '') return;
            let ds = JSON.parse(e.dataTransfer.getData('schedData'));

            if(this.getScheduleEnd(ds.shift_date,ds.shift_start,ds.shift_end).getTime() <= new Date().getTime() && this.dragMode == 0){
                this.alert('Backdated Error','You are trying to move a finished schedule.','danger');
                return;
            }

            if(this.getScheduleEnd(date,ds.shift_start,ds.shift_end).getTime() <= new Date().getTime()){
                this.alert('Backdated Error','You are trying to move a schedule where its end time is set back in time.','danger',[],3000);
                return;
            }

            if(this.dragMode == 1){
                ds.id = 
                (1000).toString(32)+'-'+ //note: replace with user id of user adding the scheduke
                Date.now().toString(32)+'-'+
                0;
                ds.assignedEmps = [];
                ds.shift_date = date;
                if(this.viewMode == 1) ds.type = originType;
                this.schedules[ds.id] = ds;

                
                this.editTracker.created.push(ds.id);
                this.buildCalendar();
                return;
            }

            if(this.viewMode == 1){
                // if(this.schedules[ds.id].assignedEmps.length > 0 && e.dataTransfer.getData('originType') == 0){
                //     this.alert('Schedule Type Update Warning','You are changing a schedule\'s type of a schedule that is previously open. You may want to check if the employees that are currently assigned are according to your decision.','warning',[],5000)
                // }

                this.schedules[ds.id].type = originType;
            }

            let indexTrack = this.editTracker.updated.indexOf(ds.id);
            if(indexTrack === -1) this.editTracker.updated.push(ds.id);
            this.schedules[ds.id].shift_date = date;
            this.buildCalendar()
        },
        buildCalendar(){
            let startMonth = new Date(this.cc.y,this.cc.m,1);
            let endMonth = new Date(this.cc.y,this.cc.m+1,0);
            let offsetStart = new Date(this.cc.y,this.cc.m,1).getDay();
            let offsetEnd = new Date(this.cc.y,this.cc.m+1,0).getDay();
            startMonth.setDate(startMonth.getDate() - offsetStart);
            endMonth.setDate(endMonth.getDate() + (6 - offsetEnd));
            this.calendarBoxes = [];

            while(startMonth.getTime() <= endMonth.getTime()){
                let dateString = dateFormat('%y-%m2-%D',startMonth.getTime());
                let newDateBox = {
                    date: dateString,
                    dateNum: startMonth.getDate(),
                    isCurrentMonth: startMonth.getMonth() == this.cc.m,
                    scheds:this.fetchScheds(dateString),
                    onclick:(dateString,e)=>{
                        let date = new Date(dateString);
                        this.qd.y = date.getFullYear();
                        this.qd.m = date.getMonth();
                        this.qd.d = date.getDate();
                    }
                }
                this.calendarBoxes.push(newDateBox);
                startMonth.setDate(startMonth.getDate() + 1);
            }

            this.title = dateFormat('%lm %y',new Date(this.cc.y,this.cc.m,this.cc.d).getTime());
        },
        nextMonths(num){
            let date = new Date(this.cc.y,this.cc.m,this.cc.d);
            date.setMonth(date.getMonth() + num);
            this.cc.y = date.getFullYear();
            this.cc.m = date.getMonth();
            this.cc.d = date.getDate();
            this.qd.y = date.getFullYear();
            this.qd.m = date.getMonth();
            this.qd.d = date.getDate();
            this.buildCalendar();
        },
        nextDays(num){
            let date = new Date(this.cc.y,this.cc.m,this.cc.d);
            date.setDate(date.getDate() + num);
            this.cc.y = date.getFullYear();
            this.cc.m = date.getMonth();
            this.cc.d = date.getDate();
            this.qd.y = date.getFullYear();
            this.qd.m = date.getMonth();
            this.qd.d = date.getDate();
            this.buildCalendar();
        }
    }
}
</script>

<style scoped>
.scheduler-calendar-controls{display: flex; align-items: center;padding: 10px;}
.scheduler-calendar-controls button{margin:0 5px}
.scheduler-calendar-controls .title{text-align: center;width: 100%;max-width: 400px;border:1px solid #333;height: 34px;line-height: 34px;border-radius: 5px;font-size: 17px;}

.scheduler-calendar-topcontrols{display: grid;grid-template-columns: 2fr 1fr;align-items: center;}
.scheduler-calendar-days{
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
    border-top:1px solid #ddd;
    border-left:1px solid #ddd;
    gap:7px
}

.scheduler-calendar-days.closedschedule{
    border-top:none
}

.scheduler-calendar-days.calendarWeekView{
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
}

.scheduler-calendar-employees-controls{
    margin-top: 20px;
    padding:10px;
    border-bottom:1px solid #ddd;
    display: flex;
    gap:20px;
    align-items: center;
}

.scheduler-calendar-employees-controls > div{
    display:flex;
    grid-template-columns: 1fr 2fr;
    gap:5px;
    align-items: center;
}

::-webkit-scrollbar,::-moz-scrollbar,::-ms-scrollbar {
    width: 8px;
    height: 8px;
}

::-webkit-scrollbar-track,::-moz-scrollbar-track,::-ms-scrollbar-track {
    background-color: #F5F5F5;
}

::-webkit-scrollbar-thumb,::-moz-scrollbar-thumb,::-ms-scrollbar-thumb {
    background-color: #AAA;
    border-radius: 5px;
}

.scheduler-form-advanceddelete-modalparent{
    position: fixed;
    top: 0;
    left: 0;
    background: rgba(0, 0, 0, 0.3);
    width: 100vw;
    height: 100vh;
    z-index: -1;
    display: flex;
    justify-content: center;
    align-items: center;
    opacity: 0;
    transition: 0.2s;
}

.scheduler-form-advanceddelete-modalparent.open{
    z-index: 99;
    opacity: 1;
}

.scheduler-form-advanceddelete-modal{
    max-width: 600px;
    width: 100%;
    background: #fff;
    padding: 20px;
    border-radius: 10px;
    scale:0;
    transition: 0.2s;
}



.scheduler-form-advanceddelete-modalparent.open .scheduler-form-advanceddelete-modal{
    scale:1
}

.scheduler-calendar-employees{
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
    grid-template-rows: 1fr;
    gap:7px;
}
.scheduler-calendar-item.title.openschedule{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 10px;
    grid-row: 1/3;
}

.scheduler-calendar-item.title.openschedule.closedschedule{
    grid-row: 1/2;
}

.scheduler-calendar-employees .scheduler-calendar-item.title.openschedule{
    grid-row: 1/2;
}

.scheduler-calendar-item.title.openschedule p.instrux{font-size: 12px;}

button.viewselect{
    border:1px solid #434343;
    background: #fff;
    border-radius: 0;
    color:#434343;
    margin:0 2px
}
/* button.viewselect:first-of-type{border-left:1px solid #434343;} */
button.viewselect.active{background:#434343;color:#fff;}

button{all:unset;padding: 10px;border-radius: 5px;transition: 0.2s;font-size: 14px;line-height: 14px;color:#fff;}
button:not(.basic):not(.viewselect):not(.savechanges):not(.advanceddelete){
    background:#434343;
}
button:hover{scale:1.05}
button:active{scale:0.95}
.scheduler-form-advanceddelete-modal button.danger{background: #a2493e;padding: 5px;border-radius: 5px;}
.scheduler-form-advanceddelete-modal button.dangercolor{background: #a2493e !important;}
.scheduler-calendar-item{border-bottom:1px solid #ddd;transition:0.2s;border-radius: 0 0 5px 0;}
.scheduler-calendar-item.title{padding: 5px;text-align: center;}
.scheduler-calendar-item .datenum{margin:0;width: 30px;height:30px;text-align: center;line-height: 30px;border-right:1px solid #ddd;border-bottom:1px solid #ddd;margin-bottom: 10px;transition:0.2s;display: flex;align-items: center;overflow: hidden;}

.scheduler-calendar-item .datenum span:first-child{width: 30px;}
.calendar-date-tooltip{width:0;overflow: hidden;padding: 0px;white-space: nowrap;text-align: center;flex-grow: 1;background: #ff9b96;color: #222;transition:0.2s;font-size: 14px;}

.calendar-date-tooltip:hover{background: #fd3c32;color: #fff;}
.calendar-date-tooltip:active{background: #bd251d;color: #fff;}

.calendar-date-tooltip{}
.scheduler-calendar-item.active .calendar-date-tooltip{width:max-content;padding: 5px;}
.scheduler-calendar-item.active{background:rgba(186, 229, 255, 0.263);}
.scheduler-calendar-days:not(.calendarWeekView) .scheduler-calendar-item.active .datenum{width: 100%;background: #ffffff;border-bottom:1px solid #fd3c32;}
.scheduler-calendar-item.active .datenum span:first-child{background: #fd3c32;color:#fff;}
.scheduler-calendar-item.isNotCurrentMonth:not(.active){background: #eee;}
.scheduler-calendar-item{border-right: 1px solid #ddd;}
.dayschedule-cont{min-height: 70px;padding: 3px;}
.dragovered .dayschedule-cont{box-shadow: inset 0 0 10px #aaa}
.dayschedule{background:#fff;text-align: center;padding: 5px;border:1px solid #ddd;border-radius:5px;margin:5px 0;transition:0.2s}

.dayschedule *{pointer-events: none;}
.dayschedule h3{}

.savechanges{background: #407a40;margin: 0 5px;}
.advanceddelete{background: rgb(178, 71, 53);}
.scheduler-calendar-days .dayschedule:hover{scale: 1.02;box-shadow: 0 0px 10px #aaa;}

.dayschedule-color{border:1px solid #ddd;display: inline-block;width:10px;height:10px;margin:0 5px;vertical-align: middle;border-radius: 50%;margin-bottom: 2px;}

.dayschedule p{font-size: 14px;}
.dayschedule p span{display: inline-block;}
.removeAssign{
    all: unset;
    font-size: 14px;
    margin: 5px 0;
    display: block;
    color: #593434;
}

.scheduler-calendar-parent{min-width: 1100px;min-height: 600px;}



/* responsive */
.scheduler-calendar-parent.responsive-1300 .dayschedule p{font-size: 12px;}
.scheduler-calendar-parent.responsive-1300 .dayschedule h5{font-size: 15px;}

.scheduler-calendar-parent.responsive-1300 .scheduler-calendar-employees .scheduler-calendar-item.title.openschedule.openschedule {font-size: 15px;}

.scheduler-no-employees{
    text-align: center;
    padding: 20px;
    border: 1px solid #ddd;
    border-radius: 5px;
    border-top: none;
    border-left: none;
}

.scheduler-calendar-item .roles p{display: inline-block;padding: 3px;font-size: 14px;margin: 2px;border-radius: 5px;}
.scheduler-calendar-item .roles p span{border:none}


</style>
