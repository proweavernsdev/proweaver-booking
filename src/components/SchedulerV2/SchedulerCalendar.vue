<script setup>
import { onMounted, reactive, ref, computed, watch } from 'vue'
import { axios, validateForm, dateOffseted, dateFormat } from '@/functions'
import icons from '../../assets/icons';
import StyledAlertVue from './StyledAlert.vue'

//data
let calendarTitle = ref('')
let showMoreScheds = ref(false)
let schedLengths = ref({})

let calendarBoxes = ref([])
let serviceOpts = ref([])
let schedules = ref({})
let dragMode = ref('move')
let fetching = ref(false)
let isModalOpened = ref(false)
let errorMsgModal = ref('')
let cc = reactive({ y: 2023, m: 0, d: 1 })
let qd = reactive({ y: 2023, m: 0, d: 1 })
let lastFetch = reactive({ y: 2023, m: 0, d: 1 })
let editTracker = {
    created: [],
    updated: [],
    deleted: []
}
let styledAlert = reactive({
    header: 'Scheduler Error',
    body: 'asdsad',
    buttons: [],
    type: 'neutral',
    duration: 2000,
    show: false
})
let alertResult = ref(null)

let _id = ref('')
let _date = ref('')
let _date_end = ref('')
let _start = ref('')
let _end = ref('')
let _repeatDays = ref([0, 1, 2, 3, 4, 5, 6])
let _service = ref('')
let _color = ref('')
let _max_appointments = ref('')
let _special_status = ref(0)
let _appointee = ref('')
let _description = ref('')
let _timeSlots = ref([])

//computed
let queSchedule = computed(() => {
    return {
        id: _id.value,
        shift_date: _date.value,
        shift_date_end: _date_end.value,
        shift_start: _start.value,
        shift_end: _end.value,
        description: _description.value,
        timeSlots: _timeSlots.value,
        repeatDays: _repeatDays.value,
        service: _service.value,
        color: _color.value,
        max_appointments: _max_appointments.value,
        special_status: _special_status.value,
        appointee: _appointee.value
    }
})

//watch
watch(() => qd, () => showMoreScheds.value = false, { deep: true })

//onmounted
onMounted(() => {
    let date = dateAdjusted()
    cc.y = date.getFullYear()
    cc.m = date.getMonth()
    cc.d = date.getDate()
    qd.y = date.getFullYear()
    qd.m = date.getMonth()
    qd.d = date.getDate()
    fetchServices()
    fetchSchedulesFromServer()
    buildCalendar()
})

//methods
function dateAdjusted(yearOrDateString = null, month = null, day = null) {
    let date

    if (yearOrDateString == null) date = new Date()
    else if (month != null) date = new Date(yearOrDateString, month, day)
    else date = new Date(yearOrDateString)
    date.setTime(date.getTime() + date.getTimezoneOffset() * 60000)
    return date
}

const queScheduleFuncs = {
    reset() {
        _id.value = ''
        _date.value = ''
        _date_end.value = ''
        _start.value = ''
        _end.value = ''
        _repeatDays.value = [0, 1, 2, 3, 4, 5, 6]
        _service.value = ''
        _color.value = ''
        _max_appointments.value = ''
        _special_status.value = 0
        _appointee.value = ''
        _description.value = ''
        _timeSlots.value = []
    },
    set(schedule) {
        if (schedule == null) {
            queScheduleFuncs.reset()
            isModalOpened.value = true
            return
        }
        isModalOpened.value = true
        _id.value = schedule.id
        _date.value = schedule.shift_date
        _date_end.value = schedule.shift_date
        _start.value = schedule.shift_start
        _end.value = schedule.shift_end
        _description.value = schedule.description
        _timeSlots.value = schedule.timeSlots
        _repeatDays.value = schedule.repeatDays
        _service.value = schedule.service
        _color.value = schedule.color
        _appointee.value = schedule.appointee
        _max_appointments.value = schedule.max_appointments
        _special_status.value = schedule.special_status
    },

    getScheduleEnd(scheduleDate, schedStart, schedEnd) {
        let scheduleStart = dateOffseted(scheduleDate + ' ' + schedStart);
        let scheduleEnd = dateOffseted(scheduleDate + ' ' + schedEnd);
        if (scheduleStart.getTime() >= scheduleEnd.getTime()) scheduleEnd.setDate(scheduleEnd.getDate() + 1);
        return scheduleEnd;
    },
    checkIfIsOneDayOrMore(scheduleDate, schedStart, schedEnd) {
        let scheduleStart = dateAdjusted(scheduleDate + ' ' + schedStart);
        scheduleStart.setDate(scheduleStart.getDate() + 1);
        let scheduleEnd = queScheduleFuncs.getScheduleEnd(scheduleDate, schedStart, schedEnd);
        if (scheduleStart.getTime() == scheduleEnd.getTime()) return true;
        return false;
    },

    setSchedule() {
        errorMsgModal.value = '';
        let emptyFieldsErrorMsg = 'The following fields are required:<br>';
        let rules = {
            shift_start: 'required',
            shift_end: 'required',
            service: 'required',
            color: 'required'
        };

        if (queSchedule.value.id == '') {
            rules = {
                shift_date_end: 'required',
                shift_start: 'required',
                shift_end: 'required',
                service: 'required',
                color: 'required'
                // wage:'required',
            }
        }


        rules.callback = (v) => {
            switch (v) {
                case 'shift_date_end':
                    emptyFieldsErrorMsg += '<strong>End Date</strong>, '
                    break;
                case 'shift_start':
                    emptyFieldsErrorMsg += '<strong>Start Time</strong>, '
                    break;
                case 'shift_end':
                    emptyFieldsErrorMsg += '<strong>End Time</strong>, '
                    break;
                case 'max_appointments':
                    emptyFieldsErrorMsg += '<strong>Max Bookings</strong>, '
                    break;
                case 'service':
                    emptyFieldsErrorMsg += '<strong>Service</strong>, '
                    break;
                case 'color':
                    emptyFieldsErrorMsg += '<strong>Color</strong>, '
                    break;
                // case 'wage':
                //     emptyFieldsErrorMsg+='<strong>Rate/hr</strong>, '
                // break;
            }
        }

        let valid = validateForm(queSchedule.value, rules);
        emptyFieldsErrorMsg = emptyFieldsErrorMsg.substring(0, emptyFieldsErrorMsg.length - 2);

        if (!valid.allValid) {
            errorMsgModal.value = emptyFieldsErrorMsg;
            return;
        }

        if (dateAdjusted('2022-01-01 ' + queSchedule.value.shift_start).toLocaleDateString() == "Invalid Date") {
            errorMsgModal.value = 'The following fields are required:<br><strong>Start Time </strong>';
            return;
        } else if (dateAdjusted('2022-01-01 ' + queSchedule.value.shift_end).toLocaleDateString() == "Invalid Date") {
            errorMsgModal.value = 'The following fields are required:<br><strong>End Time </strong>';
            return;
        }


        if (parseInt(queSchedule.value.max_appointments) <= 0) {
            errorMsgModal.value = '<strong>Max Appointment</strong> field must be at least 1';
            return;
        }

        if (queSchedule.value.id == '' && queSchedule.value.repeatDays.length == 0) {
            errorMsgModal.value = '<strong>Repeat Days</strong> field should have at least one check';
            return;
        }

        if (queSchedule.value.id == '' && dateAdjusted(queSchedule.value.shift_date_end).getTime() < dateAdjusted(queSchedule.value.shift_date).getTime()) {
            errorMsgModal.value = '<strong>End Date</strong> must be set later than the Start Date';
            return;
        }

        if ([1, '1'].includes(queSchedule.value.special_status) && [null, ''].includes(queSchedule.value.appointee)) {
            errorMsgModal.value = 'You must provide the name of the <strong>Apointee</strong> if you want to set the schedule status to <strong>Reserved</strong>'
            return;
        }


        if (queSchedule.value.id == '')
            queScheduleFuncs.createSchedule()
        else
            queScheduleFuncs.updateSchedule()

        queScheduleFuncs.reset()
    },

    createSchedule() {
        let loopDate = dateAdjusted(queSchedule.value.shift_date);
        let endDate = dateAdjusted(queSchedule.value.shift_date_end);
        let iteration = 0;
        let midId = Date.now().toString(32);

        if (dateOffseted(queSchedule.value.shift_date + ' ' + queSchedule.value.shift_start).getTime() <= dateOffseted().getTime()) {
            alertNotif('Backdated Error', 'You cannot create a schedule set back in time.', 'danger', [], 1500);
            isModalOpened.value = false;
            return;
        }

        if (dateOffseted(queSchedule.value.shift_date + ' ' + queSchedule.value.shift_start).getTime() <= dateOffseted().getTime()) {
            alertNotif('Backdated Error', 'You cannot create a finished schedule.', 'danger', [], 1500);
            return;
        }

        if (queScheduleFuncs.checkIfIsOneDayOrMore(queSchedule.value.shift_date, queSchedule.value.shift_start, queSchedule.value.shift_end)) {
            alertNotif('Schedule Duration Exceeded', 'The scheduler may only handle schedules that does not exceed or equal to 24 hours.', 'danger', [], 2500);
            isModalOpened.value = false;
            return;
        }

        while (loopDate.getTime() <= endDate.getTime()) {
            if (iteration == 0 || queSchedule.value.repeatDays.includes(loopDate.getDay())) {
                let newSched = {};
                Object.keys(queSchedule.value).forEach(qs => newSched[qs] = queSchedule.value
                [qs])

                newSched.id =
                    (1000).toString(32) + '-' + //note: replace with user id of user adding the scheduke
                    midId + '-' +
                    iteration;

                newSched.shift_date = dateFormat('%y-%M-%D', loopDate.getTime());

                newSched.timeSlots.forEach((el, i) => {
                    let copyNewSched = JSON.parse(JSON.stringify(newSched))
                    copyNewSched.shift_start = el.time_start
                    copyNewSched.shift_end = el.time_end
                    copyNewSched.id = copyNewSched.id + '-' + i
                    schedules.value[copyNewSched.id] = copyNewSched;
                    editTracker.created.push(copyNewSched.id);
                })

                iteration++;
            }

            loopDate.setDate(loopDate.getDate() + 1);
        }


        isModalOpened.value = false;
        buildCalendar();
    },

    updateSchedule() { //update | create /
        let newSched = {};
        Object.keys(queSchedule.value).forEach(qs => newSched[qs] = queSchedule.value[qs])

        if (dateOffseted(queSchedule.value.shift_date + ' ' + queSchedule.value.shift_start).getTime() <= dateOffseted().getTime()) {
            //  
            alertNotif('Backdated Error', 'The schedule is set back in time.', 'danger', [], 1500);
            isModalOpened.value = false;
            return;
        }

        if (queScheduleFuncs.checkIfIsOneDayOrMore(queSchedule.value.shift_date, queSchedule.value.shift_start, queSchedule.value.shift_end)) {
            alertNotif('Schedule Duration Exceeded', 'The scheduler may only handle schedules that does not exceed or equal to 24 hours.', 'danger', [], 1500);
            isModalOpened.value = false;
            return;
        }


        let indexTrack = editTracker.created.indexOf(newSched.id);
        if (indexTrack === -1) editTracker.updated.push(newSched.id);


        for (let ns in newSched) schedules.value[queSchedule.value.id][ns] = newSched[ns];

        isModalOpened.value = false;
        buildCalendar()
    },

    deleteSchedule(e) {
        let ref = schedules.value[e];
        if (queScheduleFuncs.getScheduleEnd(ref.shift_date, ref.shift_start, ref.shift_end).getTime() <= dateOffseted().getTime()) {
            alertNotif('Completed Schedule Error', 'The schedule is already finished, therefore the schedule cannot be deleted.', 'danger', [], 3000);
            isModalOpened.value = false;
            resetQueSchedule();
            return;
        }

        let indexTrack = editTracker.created.indexOf(e);
        if (indexTrack === -1) editTracker.deleted.push(e);
        else editTracker.created.splice(indexTrack, 1)

        indexTrack = editTracker.updated.indexOf(e);
        if (indexTrack !== -1) editTracker.updated.splice(indexTrack, 1)

        delete schedules.value[e];
        isModalOpened.value = false;
        queScheduleFuncs.reset();
        buildCalendar();
    },

    repeatDays(day) {
        if (_repeatDays.value.includes(day)) _repeatDays.value = _repeatDays.value.filter(el => el != day)
        else _repeatDays.value.push(day)
    }
}

watch(() => _timeSlots.value, () => {
    if (_timeSlots.value == null || _timeSlots.value.length == 0) return
    let earliestTimeStart = ''
    let latestTimeEnd = '2020-01-01 00:00:00'

    _timeSlots.value.forEach(el => {
        if (el.time_start == '') return
        if (earliestTimeStart == '' || dateAdjusted('2020-01-01 ' + el.time_start).getTime() < dateAdjusted('2020-01-01 ' + earliestTimeStart).getTime()) earliestTimeStart = el.time_start
        if (el.time_end == '') return
        let realTimeEnd = dateAdjusted(queSchedule.value.shift_date + ' ' + el.time_end)
        if (dateAdjusted('2020-01-01 ' + el.time_end).getTime() < dateAdjusted('2020-01-01 ' + el.time_start).getTime())
            realTimeEnd.setDate(realTimeEnd.getDate() + 1)
        if (realTimeEnd.getTime() > dateAdjusted(latestTimeEnd).getTime())
            latestTimeEnd = dateFormat('%y-%M-%D %H:%I:%S', realTimeEnd.getTime())
    })

    _start.value = earliestTimeStart
    _end.value = latestTimeEnd.split(' ')[1]
}, {
    deep: true
})


function alertNotif(header, body, type, buttons = [], duration = 2000) {
    styledAlert.header = header;
    styledAlert.body = body;
    styledAlert.type = type;
    styledAlert.buttons = buttons;
    styledAlert.duration = duration;
    styledAlert.show = true;
}

function waitForConfirm(header, body, type, buttons = [], duration = 2000) {
    alertResult.value = null;
    alertNotif(header, body, type, buttons, duration);

    return new Promise(res => {
        let wait = setInterval(() => {
            if (alertResult.value == null) return;
            clearInterval(wait);
            res(alertResult.value);
        }, 100)
    })
}

function daySchedules(dateString) {
    let hitScheds = [];
    for (let ds in schedules.value) {
        let el = JSON.parse(JSON.stringify(schedules.value[ds]));
        if (el.shift_date != dateString) continue;
        hitScheds.push(el);
    }
    hitScheds.sort((a, b) => {
        return dateAdjusted(dateString + ' ' + a.shift_start).getTime() - dateAdjusted(dateString + ' ' + b.shift_start).getTime()
    })

    schedLengths.value[dateString] = hitScheds.length
    return hitScheds;
}

function fetchSchedulesFromServer() {
    let start = dateFormat('%y-%M-%D', dateAdjusted(cc.y, cc.m, -6).getTime())
    let end = dateFormat('%y-%M-%D', dateAdjusted(cc.y, cc.m + 1, 6).getTime())
    lastFetch.m = cc.m
    lastFetch.y = cc.y

    fetching.value = true



    axios.post(`schedules/fetch?book_schedule_date>=${start}&book_schedule_date<=${end}`).then(res => {
        if (res.data.success) {
            schedules.value = {}
            res.data.result.forEach(el => {
                if (schedules.value[el.book_schedule_id] != null && el != schedules.value[el.book_schedule_id]) return

                schedules.value[el.book_schedule_id] = {
                    id: el.book_schedule_id,
                    shift_date: el.book_schedule_date,
                    shift_start: el.book_schedule_timestart,
                    shift_end: el.book_schedule_timeend,
                    description: el.book_schedule_description,
                    service: el.book_schedule_service,
                    color: el.book_schedule_color,
                    max_appointments: el.book_schedule_maxappointment,
                    special_status: el.book_schedule_special_status,
                    appointee: el.book_schedule_appointee
                }
            })

        }

        fetching.value = false

    })
}

async function saveChanges() {
    let created = [];
    let updated = [];
    let completedCreate = 0;
    let completedUpdate = 0;
    let completedDelete = 0;

    function parseToRequestContent(schedule) {
        schedule = JSON.parse(JSON.stringify(schedule))
        let scheduleStartTime = dateAdjusted(schedule.shift_date + ' ' + schedule.shift_start);
        let scheduleEndTime = queScheduleFuncs.getScheduleEnd(schedule.shift_date, schedule.shift_start, schedule.shift_end);


        let sched = {
            book_schedule_id: schedule.id,
            book_schedule_date: schedule.shift_date,
            book_schedule_timestart: schedule.shift_start,
            book_schedule_timeend: schedule.shift_end,
            book_schedule_description: schedule.description,
            book_schedule_service: schedule.service,
            book_schedule_color: schedule.color,
            book_schedule_special_status: schedule.special_status,
            book_schedule_maxappointment: schedule.max_appointments,
            book_schedule_appointee: schedule.appointee
        };

        return sched;

    }



    if (editTracker.created.length > 0) editTracker.created.forEach(el => created.push(parseToRequestContent(schedules.value[el])))
    if (editTracker.updated.length > 0) editTracker.updated.forEach(el => updated.push(parseToRequestContent(schedules.value[el])))

    if (
        created.length == 0 &&
        updated.length == 0 &&
        editTracker.deleted.length == 0 &&
        Object.keys(editTracker.assignedChanges).length == 0
    ) {
        alertNotif('', 'No changes made...', 'warning', []);
        return;
    }

    let resp = await waitForConfirm('Save Changes?',
        `Changes you have made:
    <ul style="padding-left:15px">
    <li>Created <strong>${created.length}</strong> schedule${created.length > 1 ? 's' : ''}</li>
    <li>Updated <strong>${updated.length}</strong> schedule${updated.length > 1 ? 's' : ''}</li>
    <li>Deleted <strong>${editTracker.deleted.length}</strong> schedule${editTracker.deleted.length > 1 ? 's' : ''}</li>
    </ul>`
        , 'warning', [
        { label: 'Yes', data: true },
        { label: 'No', data: false },
    ], 3000);
    if (!resp) return;

    created.forEach(el => {

        axios.post('schedules/create', null, el).then(() => completedCreate++);
    });

    updated.forEach(el => {
        axios.post('schedules/update?id=' + el.book_schedule_id, null, el).then(() => completedUpdate++);
    });

    editTracker.deleted.forEach(el => {
        axios.post('schedules/delete?id=' + el, null).then(() => {
            completedDelete++;
        });
    });

    setInterval(() => {
        let conditions = [false, false, false];

        if (completedCreate == created.length) conditions[0] = true;
        if (completedUpdate == updated.length) conditions[1] = true;
        if (completedDelete == editTracker.deleted.length) conditions[2] = true;

        if (conditions[0] && conditions[1] && conditions[2]) window.location.reload();

    }, 500);

}


function buildCalendar() {
    let startMonth = dateAdjusted(cc.y, cc.m, 1)
    let endMonth = dateAdjusted(cc.y, cc.m + 1, 0)
    let offsetStart = dateAdjusted(cc.y, cc.m, 1).getDay()
    let offsetEnd = dateAdjusted(cc.y, cc.m + 1, 0).getDay()
    startMonth.setDate(startMonth.getDate() - offsetStart)
    endMonth.setDate(endMonth.getDate() + (6 - offsetEnd))
    calendarBoxes.value = []

    while (startMonth.getTime() <= endMonth.getTime()) {
        let dateString = dateFormat('%y-%M-%D', startMonth.getTime())
        let newDateBox = {
            date: dateString,
            dateNum: startMonth.getDate(),
            isCurrentMonth: startMonth.getMonth() == cc.m,
            // scheds:fetchScheds(dateString),
            onclick: (dateString, e) => {
                let date = dateAdjusted(dateString)
                qd.y = date.getFullYear()
                qd.m = date.getMonth()
                qd.d = date.getDate()
            }
        }
        calendarBoxes.value.push(newDateBox)
        startMonth.setDate(startMonth.getDate() + 1)
    }
    calendarTitle.value = dateFormat('%lm %y', dateAdjusted(cc.y, cc.m, cc.d).getTime())
}

function nextMonths(num) {
    if (fetching.value) return
    schedLengths.value = {}
    let date = dateAdjusted(cc.y, cc.m, cc.d)
    date.setMonth(date.getMonth() + num)
    cc.y = date.getFullYear()
    cc.m = date.getMonth()
    cc.d = date.getDate()
    qd.y = date.getFullYear()
    qd.m = date.getMonth()
    qd.d = date.getDate()
    showMoreScheds.value = false
    fetchSchedulesFromServer()
    buildCalendar()
}

function fetchServices() {
    axios.post('services/fetch', 'default').then(res => {
        serviceOpts.value = []
        if (res.data.msg == 'fetch failed') {
            // $emit('noServicesError')
            return;
        }
        if (!res.data.success) return;
        serviceOpts.value = res.data.result.map(el => {
            return {
                label: el.book_services_name,
                value: el.book_services_name
            }
        });
    })
}

//client


</script>

<template>
    <!-- {
    id:'',
    shift_date: '',
    shift_date_end:
    shift_start:'',
    shift_end:'',
    description:'',
    timeSlots:[{time_start:'00:00:00',time_end:'01:00:00'}],
    repeatDays:[],
    service:null,
    color:null,
    max_appointments:0
} -->


    <StyledAlertVue :header="styledAlert.header" :body="styledAlert.body" :buttons="styledAlert.buttons"
        :type="styledAlert.type" :duration="styledAlert.duration" :show="styledAlert.show"
        @dismiss="styledAlert.show = false" @onResult="e => alertResult = e" />


    <!-- editor modal -->
    <div class="fixed bg-[rgba(0,0,0,0.5)] w-screen h-screen top-0 left-0 z-[9] flex justify-center items-center"
        v-if="isModalOpened">
        <div class="bg-white max-w-[600px] w-full rounded-md overflow-hidden">
            <div class="bg-gray-900 text-white py-4 px-3 flex justify-between">
                <h2 class="font-semibold text-lg">
                    {{ queSchedule.id == '' ? 'Add' : 'Edit' }} Schedule
                </h2>
                <button
                    class="bg-white rounded-full w-[25px] h-[25px] flex justify-center items-center transition hover:scale-105 active:scale-95"
                    @click="isModalOpened = false">
                    <i v-html="icons.close" class="text-gray-900"></i>
                </button>
            </div>
            <div class="p-3">
                <div class="grid items-center gap-y-2 mb-3" style="grid-template-columns: 150px 1fr;">
                    <label>{{ queSchedule.id == '' ? 'Start ' : '' }}Date</label>
                    <input class="bg-gray-100 p-1" type="date" disabled v-model="_date">
                    <label v-if="_id == ''">End Date</label>
                    <input v-if="_id == ''" class="bg-gray-100 p-1" type="date" v-model="_date_end">
                    <label v-if="_id != ''">Start Time</label>
                    <input v-if="_id != ''" class="bg-gray-100 p-1" type="time" v-model="_start">
                    <label v-if="_id != ''">End Time</label>
                    <input v-if="_id != ''" class="bg-gray-100 p-1" type="time" v-model="_end">
                    <label v-if="_id == ''">Repeat Days</label>
                    <div class="flex flex-wrap gap-1 justify-start" v-if="_id == ''">
                        <label class="w-[70px] flex justify-between items-center gap-1 border p-1 rounded-md">Sun <input
                                :checked="_repeatDays.includes(0)" @click="queScheduleFuncs.repeatDays(0)"
                                type="checkbox" class="mt-[2px]"></label>
                        <label class="w-[70px] flex justify-between items-center gap-1 border p-1 rounded-md">Mon <input
                                :checked="_repeatDays.includes(1)" @click="queScheduleFuncs.repeatDays(1)"
                                type="checkbox" class="mt-[2px]"></label>
                        <label class="w-[70px] flex justify-between items-center gap-1 border p-1 rounded-md">Tue <input
                                :checked="_repeatDays.includes(2)" @click="queScheduleFuncs.repeatDays(2)"
                                type="checkbox" class="mt-[2px]"></label>
                        <label class="w-[70px] flex justify-between items-center gap-1 border p-1 rounded-md">Wed <input
                                :checked="_repeatDays.includes(3)" @click="queScheduleFuncs.repeatDays(3)"
                                type="checkbox" class="mt-[2px]"></label>
                        <label class="w-[70px] flex justify-between items-center gap-1 border p-1 rounded-md">Thu <input
                                :checked="_repeatDays.includes(4)" @click="queScheduleFuncs.repeatDays(4)"
                                type="checkbox" class="mt-[2px]"></label>
                        <label class="w-[70px] flex justify-between items-center gap-1 border p-1 rounded-md">Fri <input
                                :checked="_repeatDays.includes(5)" @click="queScheduleFuncs.repeatDays(5)"
                                type="checkbox" class="mt-[2px]"></label>
                        <label class="w-[70px] flex justify-between items-center gap-1 border p-1 rounded-md">Sat <input
                                :checked="_repeatDays.includes(6)" @click="queScheduleFuncs.repeatDays(6)"
                                type="checkbox" class="mt-[2px]"></label>
                    </div>
                    <label>Service</label>
                    <select class="bg-gray-100 p-1" @change="_service = $event.target.value">
                        <option value=""> - Please Select - </option>
                        <option v-for="so, i in serviceOpts" :key="i" :value="so.value">{{ so.label }}</option>
                    </select>
                    <label>Color</label>
                    <div class="flex gap-2 flex-wrap">
                        <button class="transition bg-[#8b9933] w-[30px] h-[20px]"
                            :class="{ 'border-2 border-solid border-gray-900': _color == '#8b9933' }"
                            @click="_color = '#8b9933'"></button>
                        <button class="transition bg-[#6d9933] w-[30px] h-[20px]"
                            :class="{ 'border-2 border-solid border-gray-900': _color == '#6d9933' }"
                            @click="_color = '#6d9933'"></button>
                        <button class="transition bg-[#4e9933] w-[30px] h-[20px]"
                            :class="{ 'border-2 border-solid border-gray-900': _color == '#4e9933' }"
                            @click="_color = '#4e9933'"></button>
                        <button class="transition bg-[#339936] w-[30px] h-[20px]"
                            :class="{ 'border-2 border-solid border-gray-900': _color == '#339936' }"
                            @click="_color = '#339936'"></button>
                        <button class="transition bg-[#339955] w-[30px] h-[20px]"
                            :class="{ 'border-2 border-solid border-gray-900': _color == '#339955' }"
                            @click="_color = '#339955'"></button>
                        <button class="transition bg-[#339974] w-[30px] h-[20px]"
                            :class="{ 'border-2 border-solid border-gray-900': _color == '#339974' }"
                            @click="_color = '#339974'"></button>
                        <button class="transition bg-[#339992] w-[30px] h-[20px]"
                            :class="{ 'border-2 border-solid border-gray-900': _color == '#339992' }"
                            @click="_color = '#339992'"></button>
                        <button class="transition bg-[#338199] w-[30px] h-[20px]"
                            :class="{ 'border-2 border-solid border-gray-900': _color == '#338199' }"
                            @click="_color = '#338199'"></button>
                        <button class="transition bg-[#336399] w-[30px] h-[20px]"
                            :class="{ 'border-2 border-solid border-gray-900': _color == '#336399' }"
                            @click="_color = '#336399'"></button>
                        <button class="transition bg-[#334499] w-[30px] h-[20px]"
                            :class="{ 'border-2 border-solid border-gray-900': _color == '#334499' }"
                            @click="_color = '#334499'"></button>
                        <button class="transition bg-[#413399] w-[30px] h-[20px]"
                            :class="{ 'border-2 border-solid border-gray-900': _color == '#413399' }"
                            @click="_color = '#413399'"></button>
                        <button class="transition bg-[#5f3399] w-[30px] h-[20px]"
                            :class="{ 'border-2 border-solid border-gray-900': _color == '#5f3399' }"
                            @click="_color = '#5f3399'"></button>
                        <button class="transition bg-[#7e3399] w-[30px] h-[20px]"
                            :class="{ 'border-2 border-solid border-gray-900': _color == '#7e3399' }"
                            @click="_color = '#7e3399'"></button>
                        <button class="transition bg-[#993396] w-[30px] h-[20px]"
                            :class="{ 'border-2 border-solid border-gray-900': _color == '#993396' }"
                            @click="_color = '#993396'"></button>
                        <button class="transition bg-[#993377] w-[30px] h-[20px]"
                            :class="{ 'border-2 border-solid border-gray-900': _color == '#993377' }"
                            @click="_color = '#993377'"></button>
                        <button class="transition bg-[#993358] w-[30px] h-[20px]"
                            :class="{ 'border-2 border-solid border-gray-900': _color == '#993358' }"
                            @click="_color = '#993358'"></button>
                        <button class="transition bg-[#99333a] w-[30px] h-[20px]"
                            :class="{ 'border-2 border-solid border-gray-900': _color == '#99333a' }"
                            @click="_color = '#99333a'"></button>
                        <button class="transition bg-[#994b33] w-[30px] h-[20px]"
                            :class="{ 'border-2 border-solid border-gray-900': _color == '#994b33' }"
                            @click="_color = '#994b33'"></button>
                        <button class="transition bg-[#996933] w-[30px] h-[20px]"
                            :class="{ 'border-2 border-solid border-gray-900': _color == '#996933' }"
                            @click="_color = '#996933'"></button>
                        <button class="transition bg-[#998833] w-[30px] h-[20px]"
                            :class="{ 'border-2 border-solid border-gray-900': _color == '#998833' }"
                            @click="_color = '#998833'"></button>
                    </div>
                    <label>Max Bookings</label>
                    <input type="number" class="bg-gray-100 p-1" min="1" v-model="_max_appointments">

                    <label>Special Label</label>
                    <select class="bg-gray-100 p-1" min="1" :value="_special_status"
                        @change="_special_status = $event.target.value">
                        <option value="0">None</option>
                        <option value="1">Reserved</option>
                        <option value="2">Closed</option>
                    </select>
                    <label v-if="_special_status == '1'">Appointee</label>
                    <input v-if="_special_status == '1'" class="bg-gray-100 p-1" v-model="_appointee"
                        placeholder="Name of Reservation Holder">
                    <label>Description/Notes</label>
                    <textarea class="resize-none bg-gray-100 p-1" v-model="_description"></textarea>
                </div>


                <div v-if="_id == ''" class="mb-4">
                    <h3 class="font-semibold mb-2">Time Slots</h3>
                    <div class="max-h-[150px] overflow-y-auto">
                        <div class="grid mb-2 gap-1" style="grid-template-columns: 1fr 15px 1fr 30px;"
                            v-for="ts, i in _timeSlots">
                            <input type="time" class="bg-gray-100 p-1" v-model="_timeSlots[i].time_start">
                            <p class="text-center">-</p>
                            <input type="time" class="bg-gray-100 p-1" v-model="_timeSlots[i].time_end">
                            <button
                                class="w-[30px] h-[30px] bg-red-500 text-white flex justify-center items-center rounded-md transition hover:scale-105 active:scale-95"
                                @click="_timeSlots.splice(i, 1)" v-if="_timeSlots.length > 1">
                                <i v-html="icons.close"></i>
                            </button>
                        </div>
                    </div>
                    <button class="flex gap-1 items-center"
                        @click="_timeSlots.push({ time_start: '00:00', time_end: '01:00' })"><i v-html="icons.add"></i> Add
                        Timeslot</button>
                </div>
                <div v-if="errorMsgModal != ''" v-html="errorMsgModal"
                    class="bg-red-100 p-2 mb-2 text-center text-red-900"></div>

                <div class="flex justify-end gap-1">
                    <button
                        class="bg-green-700 text-white rounded-md p-1 block transition hover:scale-105 active:scale-95"
                        @click="queScheduleFuncs.setSchedule()">Save Schedule</button>
                    <button v-if="queSchedule.id != ''"
                        class="bg-red-700 text-white rounded-md p-1 block transition hover:scale-105 active:scale-95"
                        @click="queScheduleFuncs.deleteSchedule(queSchedule.id)">Delete Schedule</button>
                </div>

            </div>
        </div>
    </div>
    <!-- calendar view -->
    <div class="p-2">
        <!-- calendar header -->
        <div class="border-b border-dashed border-gray-400 pb-4 mb-4 flex justify-between gap-1 items-center">
            <div class="flex items-stretch">
                <button @click="nextMonths(-1)"
                    class="bg-gray-900 text-white py-1 px-2 rounded-tl-full rounded-bl-full transition hover:scale-105 active:scale-95">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="3"
                        stroke="currentColor" class="w-4 h-4">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                    </svg>
                </button>
                <h2 class="text-xl min-w-[250px] text-center bg-gray-800 text-white p-1">{{ calendarTitle }}</h2>
                <button @click="nextMonths(1)"
                    class="bg-gray-900 text-white py-1 px-2 rounded-tr-full rounded-br-full transition hover:scale-105 active:scale-95">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="3"
                        stroke="currentColor" class="w-4 h-4">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                </button>
                <div class="mt-1 ml-3 transition" :class="{ 'opacity-0': !fetching }">
                    Fetching Schedules...
                </div>
            </div>

            <!-- <div class="flex gap-2">
        <button class="hover:scale-105 active:scale-95 py-1 px-3 rounded-full transition text-white" :class="{'bg-blue-600':dragMode=='move','bg-yellow-600':dragMode=='copy'}" @click="dragMode = dragMode == 'move' ? 'copy' : 'move'">Drag to: {{ dragMode.charAt(0).toUpperCase()+dragMode.substring(1) }}</button>
        <button class="hover:scale-105 transition active:scale-95 bg-red-500 py-1 px-3 rounded-full text-white">Advanced Delete</button>
    </div> -->

            <div>
                <button
                    class="hover:scale-105 transition active:scale-95 bg-green-700 py-1 px-3 rounded-full text-white"
                    @click="saveChanges">Save Changes</button>
            </div>

        </div>
        <!-- calendar dates -->
        <div class="grid grid-cols-7 gap-2">
            <div class="p-2 pb-3 text-gray-700">SUN</div>
            <div class="p-2 pb-3 text-gray-700">MON</div>
            <div class="p-2 pb-3 text-gray-700">TUE</div>
            <div class="p-2 pb-3 text-gray-700">WED</div>
            <div class="p-2 pb-3 text-gray-700">THU</div>
            <div class="p-2 pb-3 text-gray-700">FRI</div>
            <div class="p-2 pb-3 text-gray-700">SAT</div>

            <div class="p-2  border-gray-300 text-gray-700 border-t" v-for="cb, i in calendarBoxes" :key="cb.date"
                :class="{ 'border-solid': cb.isCurrentMonth, 'border-dotted text-stone-600': !cb.isCurrentMonth }"
                @click="cb.onclick(cb.date)">
                <h3 class="text-2xl mb-3">{{ cb.dateNum }}</h3>

                <div class="mb-2" v-for="ds, i in daySchedules(cb.date)" @click="queScheduleFuncs.set(ds)">
                    <div
                        v-if="i < 2 || (showMoreScheds && dateAdjusted(cb.date + ' 00:00:00').getTime() == dateAdjusted(qd.y, qd.m, qd.d).getTime())">
                        <h4 class="font-semibold text-md max-w-full">
                            <span class="">{{ ds.service }}</span>
                            <i class="ml-2 w-[10px] h-[10px] rounded-full mt-1 inline-block"
                                :style="{ background: ds.color }"></i>
                        </h4>
                        <p class="text-sm">
                            {{ dateFormat('%h1:%I%a', ds.shift_date + ' ' + ds.shift_start) }} -
                            {{ dateFormat('%h1:%I%a', ds.shift_date + ' ' + ds.shift_end) }}
                        </p>
                    </div>
                </div>
                <button class="text-sm mr-2" v-if="
                    (schedLengths[cb.date] > 2 && dateAdjusted(cb.date + ' 00:00:00').getTime() != dateAdjusted(qd.y, qd.m, qd.d).getTime() && schedLengths[cb.date] > 2) ||
                    (!showMoreScheds && dateAdjusted(cb.date + ' 00:00:00').getTime() == dateAdjusted(qd.y, qd.m, qd.d).getTime() && schedLengths[cb.date] > 2 && schedLengths[cb.date] > 2)
                " @click="showMoreScheds = true"> {{
            dateAdjusted(cb.date + ' 00:00:00').getTime() == dateAdjusted(qd.y, qd.m, qd.d).getTime() ?
                'Show ' + (schedLengths[cb.date] - 2) + ' more...' : '+' + (schedLengths[cb.date] - 2)+' more' }}</button>
                <button @click="queScheduleFuncs.set(); _date = cb.date; _date_end = cb.date;"
                    class="flex items-center gap-2 border-t mt-3 pt-1 text-sm w-full"
                    v-if="dateAdjusted(cb.date + ' 00:00:00').getTime() == dateAdjusted(qd.y, qd.m, qd.d).getTime()"><i
                        class="font-bold pb-1">+</i> Add Schedule</button>

            </div>
        </div>
    </div>
</template>