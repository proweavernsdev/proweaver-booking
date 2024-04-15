<script setup>
import {onMounted, ref,watch,computed,reactive} from 'vue'
import {axios,waitForCondition,dateFormat,dateFormatTimezone, elementLoad,debounce} from '../functions'
import TemplatedFields from '../components/TemplatedFields.vue'
import {formData,formCSS} from '../defaults'
import icons,{iconsSolid} from '../assets/icons'
import SchedulerSelect from '../components/SchedulerSelect.vue'
import RequestBindedFields from '../components/RequestBindedFields.vue'
import PayPalButtons from '../components/PayPalButtons.vue'
import ProweaverForms from '../components/ProweaverForms.vue'
import { Paypal } from '../functions'
import StyledAlertVue from '../components/SchedulerV2/StyledAlert.vue'
import { initFormFields, evalThis } from '@/JSEffectsEvalScope'

let props = defineProps({
    form:{type:Object},
    page:{default:0,type:Number}
})

let siteKey = ref(import.meta.env.VITE_SITEKEY);

let gRecaptchaOnExists =  setInterval(()=>{
    if(document.querySelector('.g-recaptcha') == null) return;

    try{
        clearInterval(gRecaptchaOnExists);
        grecaptcha.render("recaptcha", {
            sitekey: siteKey.value,
            callback: function() {}
        });
        
        window.parent.document.getElementById('pwform').style.height=document.body.offsetHeight+'px' 
    }catch(err){}
    
    if(form.value.declare.paypalClientID != '' && form.value.declare.paypalClientID != null)
        Paypal.init(form.value.declare.paypalClientID,form.value.declare.paypalCurrency,()=>{paypalLoaded.value = true},form.value.declare.paypalEmail)


},100)

let form = ref(null)
let currentPageIndex = ref(0)
let progressIndex = ref(0);
let formElement = ref(null)
let userInput = ref([]);
let requiredFields = ref([]);
let currentPageRequired = ref([]);
let currentPageRequiredLabels = ref([]);
let currentPageRequiredInvalids = ref([]);
let omittedRBFields = ref([]);
let pageColumnResponsive = ref(1);
let formSubmitted = ref(false);
let paypalLoaded = ref(false)  
let refreshPayPal = ref(false)
let userReceiver = ''
let selectedServiceFromScheduler = ref(null)
let indexFieldVals = ref({
    name:'',
    phone:''
})
let initialVals = ref({})
let propsToModify = ref({})
let isSubmitting = ref(false)
let styledAlert = reactive({
    header:'Scheduler Error',
    body:'asdsad',
    buttons:[],
    type:'neutral',
    duration:2000,
    show:false
})
let onlinePayment = reactive({
    opened: false,
    active:false,
    trans_id: ''
})


let allFields = computed(()=>{
    let pageFields = {}
    if(form.value == null) return
    form.value.pages.forEach(el2=>el2.page_fields.forEach(el=>pageFields[el.id] = el))
    return pageFields
})

//for JSEffects
function getField(id,property,value = undefined){
    if(value === undefined) return allFields.value[id][property]
    else allFields.value[id][property] = value
}



initFormFields(getField)

let allRequiredFields = computed(()=>{
    let pageFields = {}
    if(form.value == null) return
    form.value.pages.forEach(el2=>{
        el2.page_fields.forEach(el=>{
            if(el.content_type == 'text') return
            if(omittedRBFields.value.includes(el.id)) return
            if(el.required || (el.content_type == 'rbfield' && !omittedRBFields.value.includes(el.id)) || el.content_type == 'scheduler' || el.hidden === false){
                pageFields[el.id] = ['rbfield','scheduler'].includes(el.content_type) ? el.text : el.label
            }
        })
    })
    return pageFields
})

const currentPage = computed(()=>{
    pageColumnResponsive.value = form.value.pages[currentPageIndex.value].page_columns;
    return form.value.pages[currentPageIndex.value]
});

let currentRequiredFields = computed(()=>{
    let pageFields = {}
    if(form.value == null) return
    currentPage.value.page_fields.forEach(el=>{
        if(el.content_type == 'text') return
        if(omittedRBFields.value.includes(el.id)) return
        if(el.required || (el.content_type == 'rbfield' && !omittedRBFields.value.includes(el.id)) || el.content_type == 'scheduler' || el.hidden === false){
            pageFields[el.id] = ['rbfield','scheduler'].includes(el.content_type) ? el.text : el.label
        }
    })
    return pageFields
})






watch(()=>currentPageIndex.value,()=>{
    currentPageRequiredLabels.value = [];
    setCurrentPageRequired()

    elementLoad('#online_payment').then(el=>{
        el.onclick = ()=>{
            // onlinePayment.opened = true
            window.open(`${window.location.protocol}//${window.location.hostname}?page_id=425`)
        }
    })

    elementLoad('#online_payment_zelle').then(el=>{
        el.onclick = ()=>{
            let tooltip = document.getElementById('online_payment_zelle_tooltip')
            if(tooltip.classList.contains('shown')) tooltip.classList.remove('shown')
            else tooltip.classList.add('shown')
        }
    })

    elementLoad('#pwfv-first-next-button').then(el=>{
        el.onclick = ()=>{
            beforePageChange(1)
        }
    })

    // if(onlinePayment.trans_id != ''){
    //     allFields.value['ll2fs3gs-0.h5j1ryr6az'].required = false
    //     allFields.value['ll2fs3gs-0.h5j1ryr6az'].hidden = true
    //     allFields.value['ll2pjm04-0.fhn8mzlt3k'].styles = 'background:#bbf7d0;color:#064e3b;font-weight:bold;text-align:center;padding:5px 10px;margin:20px 0;'
    // }

})



function setCurrentPageRequired(){
    currentPage.value.page_fields.forEach((el,i)=>{
        if(el.content_type=='rbfield' || el.content_type == 'scheduler' || el.required){
            currentPageRequired.value.push(el.id)
            if(el.content_type=='rbfield' || el.content_type == 'scheduler') currentPageRequiredLabels.value.push(el.text)
            else currentPageRequiredLabels.value.push(el.label)
            requiredFields.value.push({
                id: el.id,
                label: el.label ?? el.text
            })
        }
    });
}

function selectedService(e){
    let index = userInput.value.findIndex(el=>el.id == 'default_services');
    allFields.value.default_services.value = ''
    allFields.value.default_services.value = e.book_schedule_service
    selectedServiceFromScheduler.value = e.book_schedule_service
    // console.log(e.book_schedule_service,allFields.value.default_services.value)

    if(allFields.value['default_scheduler_date'] == null){
        form.value.pages[0].page_fields.unshift({
            "id": "default_scheduler_date",
            "content_type": "text",
            "styles": "display:none",
            "text": "Select Location",
            "value":e.book_schedule_date,
            "hidden":true,
        })


        form.value.pages[0].page_fields.unshift({
            "id": "default_scheduler_timestart",
            "content_type": "text",
            "styles": "display:none",
            "text": "Select Location",
            "value":e.book_schedule_timestart,
            "hidden":true,
        })

        form.value.pages[0].page_fields.unshift({
            "id": "default_scheduler_timeend",
            "content_type": "text",
            "styles": "display:none",
            "text": "Select Location",
            "value":e.book_schedule_timeend,
            "hidden":true,
        })
    }else{
        allFields.value['default_scheduler_date'].value = e.book_schedule_date
        allFields.value['default_scheduler_timestart'].value = e.book_schedule_timestart
        allFields.value['default_scheduler_timeend'].value = e.book_schedule_timeend
    }
    
    if(index == -1){
        userInput.value.push({
            id:'default_services',
            label: allFields.value.default_services.text,
            value: e.book_schedule_service
        })
        return;
    }

    userInput.value[index] = {
        id:'default_services',
        label: allFields.value.default_services.text,
        value: e.book_schedule_service
    }

}

function paidPaypal(f,fieldValue,value){
    
    organizeInput(f,fieldValue);
    organizeInput({...f,id:f.id+'_value', label:f.label+' (Amount)'}, form.declare.paypalCurrency+' '+parseFloat(value).toFixed(2));

    if(f.options.paypal_value_basis != 'service-based') return;
    form.value.pages.forEach((el2,i)=>{
        let index = el2.page_fields.findIndex(el=>el.content_type == 'rbfield' && el.endpoint.includes('services'))
        if(index == -1) return
        form.value.pages[i].page_fields[index].disabledByPayment = true
        form.value.pages[i].page_fields[index].readonly = true
    })
    
}

function checkGetter(){
    let getparams = new URLSearchParams(window.location.search);
    if(getparams.get('form_id') == null || props.form != null) {
        if(props.form == null) form.value = formData;
        else form.value = props.form
        let newStyle = document.createElement('style');
        newStyle.id = "pwfv-customcss";
        newStyle.textContent = form.value.design.css ?? formCSS(form.value.design.primaryColor,form.value.design.pagenavDesign)
        if(document.getElementById('pwfv-customcss') != null) document.getElementById('pwfv-customcss').remove()
        document.body.appendChild(newStyle)
        setCurrentPageRequired()
        window.onresize = ()=>checkResponsive()
        checkResponsive()
        removeUnlistedEmails()
        return;
    }
    let id = getparams.get('form_id');
    axios.post('forms/fetch?book_form_id='+id).then(res=>{
        if(res.data == null || !res.data.success) return;
        form.value = JSON.parse(res.data.result[0].book_form_json)
        let newStyle = document.createElement('style');
        newStyle.id = "pwfv-customcss";
        newStyle.textContent = form.value.design.css ?? formCSS(form.value.design.primaryColor,form.value.design.pagenavDesign)
        if(document.getElementById('pwfv-customcss') != null) document.getElementById('pwfv-customcss').remove()
        document.body.appendChild(newStyle)
        setCurrentPageRequired()
        window.onresize = ()=>checkResponsive()
        checkResponsive()
        removeUnlistedEmails()
    });
}
function removeUnlistedEmails(){
    if(form.value.declare.notifEmails == null || form.value.declare.notifEmails.length == 0) return;
    axios.post('notification/fetch').then(res=>{
        let result = [];
        if(res.data.result != null) result = res.data.result;
        let indexesToRemove = [];
        form.value.declare.notifEmails.forEach((el,i)=>{
            let index = result.findIndex(el2=>el2.book_email_address == el)
            if(index == -1) indexesToRemove.push(i)
        })
        
        indexesToRemove.forEach(el=>{
            form.value.declare.notifEmails.splice(el,1)
        })
    })
}


function filteredByColumn(col){
    if(pageColumnResponsive.value == 1 && col ==1) return currentPage.value.page_fields
    else if (pageColumnResponsive.value == 1 && col ==2) return [];
    else return currentPage.value.page_fields.filter(el=>el.column == col) 
}


function deleteRBField(id){
    allFields.value[id].required = false
    omittedRBFields.value.push(id)
}

function deletePaypalAsPayment(f){
    allFields.value[f.id].required = false
}

function addPaypalAsPayment(f){
    allFields.value[f.id].required = true
}

function getFieldValue(fId){
    return allFields.value[fId].value
}

function alertNotif(header,body,type,buttons=[],duration=2000){
    styledAlert.header = header;
    styledAlert.body = body;
    styledAlert.type = type;
    styledAlert.buttons = buttons;
    styledAlert.duration = duration;
    styledAlert.show = true;
}

function organizeInput(f,e){
    let index = userInput.value.findIndex(el=>el.id == f.id);

    if(f.id == 'default_services') {
        selectedServiceFromScheduler.value = e;
        return
    }
    f.value = e
    

    if(form.value.declare.nameIndex == f.id){
        indexFieldVals.value.name = e
    }else if(form.value.declare.phoneIndex == f.id){
        indexFieldVals.value.phone = e
    }

    if(f.content_type == 'field' && f.type == 'email' && (f.useemail === 'true' || f.useemail === true) && !['',null].includes(e)){
        userReceiver = e;
    }

    // if(f.id == 'll2fs3gs-0.h5j1ryr6az' && e == 'Yes'){
    //     onlinePayment.opened = true
    // }

    function formatInput(type,value){
        if(value == '' || value == null) return value

        if(type == 'date'){
            return dateFormat('%lm %d, %y', value)
        }else if(type == 'time'){
            return dateFormat('%h:%I%a', '2023-05-01 '+value)
        }

        return value
    }

    
    if(index == -1){
        userInput.value.push({
            id:f.id,
            label: (f.content_type == 'field') ? f.label : f.text,
            value: formatInput(f.type,e)
        })
    }else{
        userInput.value[index] = {
            id:f.id,
            label: (f.content_type == 'field') ? f.label : f.text,
            value: formatInput(f.type,e)
        }
    }

    

    // conditional effects
    // let textRules = form.value.conditionals.split(' :break;')

    // textRules.forEach(async el=>{
    //     el = el.trim()  
    //     if(el == '' || el.match(/^\s+$/g)) return
    //     let condition = parseConditions(await substituteFieldPlaceholders(el.split('?')[0].trim()))
    //     let effect = tokenizeEffects(el.split('?')[1].trim().split(' :;').map(effel=>effel.trim()))

    //     // console.log(evaluateConditions(condition),condition)
    //     if(el.split('?')[0].trim().includes(f.id)) 
    //         effectsToggler(el.split('?')[0].trim(),effect,evaluateConditions(condition))
    // })

    // setTimeout(()=>{
    //     const objPTM = JSON.parse(JSON.stringify(propsToModify.value))
    //     for(let ptm in objPTM){
    //         for(let ptmp in objPTM[ptm]){
    //             if(ptmp == 'value'){
    //                 let index = userInput.value.findIndex(el=>el.id == ptm);
    //                 if(index == -1){
    //                     userInput.value.push({
    //                         id:ptm,
    //                         label: (allFields.value[ptm].content_type == 'field') ? allFields.value[ptm].label : allFields.value[ptm].text,
    //                         value: objPTM[ptm][ptmp]
    //                     })
    //                 }else{
    //                     userInput.value[index] = {
    //                         id: ptm,
    //                         label: (allFields.value[ptm].content_type == 'field') ? allFields.value[ptm].label : allFields.value[ptm].text,
    //                         value: objPTM[ptm][ptmp]
    //                     }
    //                 }
    //             }
    //             allFields.value[ptm][ptmp] = objPTM[ptm][ptmp]
    //         }
    //     }
    // },10)

    // propsToModify.value = {}
            
    // end of conditional effects

    evalThis(f, form.value.conditionals)

}


onMounted(async ()=>{
    checkGetter()
    if(props.page != 0) currentPageIndex.value = props.page;

    await waitForCondition(()=>allFields.value != null)
    await waitForCondition(()=>Object.keys(allFields.value).length != 0)


    evalThis(allFields.value['default_scheduler'], form.value.conditionals ?? "")

    // // conditional effects
    // let textRules = form.value.conditionals.split(' :break;')

    // textRules.forEach(async el=>{
    //     el = el.trim()  
    //     if(el == '' || el.match(/^\s+$/g)) return
    //     let condition = parseConditions(await substituteFieldPlaceholders(el.split('?')[0].trim()))
    //     let effect = tokenizeEffects(el.split('?')[1].trim().split(' :;').map(effel=>effel.trim()))

    //     let condText = el.split('?')[0].trim();

    //     if(initialVals.value[condText] == null){
    //         initialVals.value[condText] = {}
    //         effect.forEach(el=>{
    //             if(initialVals.value[condText][el.field] == null){
    //                 initialVals.value[condText][el.field] = {}
    //             }

    //             initialVals.value[condText][el.field][el.prop] = allFields.value[el.field][el.prop]
    //         })
    //     }

    //     // console.log(evaluateConditions(condition),condition)
    //     effectsToggler(el.split('?')[0].trim(),effect,evaluateConditions(condition))
    // })

    // // end of conditional effects

    elementLoad('#pwfv-first-next-button').then(el=>{
        el.onclick = ()=>{
            beforePageChange(1)
        }
    })

    elementLoad('#online_payment').then(el=>{
        el.onclick = ()=>{
            window.open(`${window.location.protocol}//${window.location.hostname}?page_id=425`)
        }
    })
    
    elementLoad('#online_payment_zelle').then(el=>{
        el.onclick = ()=>{
            let tooltip = document.getElementById('online_payment_zelle_tooltip')
            if(tooltip.classList.contains('shown')) tooltip.classList.remove('shown')
            else tooltip.classList.add('shown')
        }
    })

    return;
})


function beforePageChange(add,jumpTo=null){
    currentPageRequiredInvalids.value = [];
    if(Object.keys(currentRequiredFields.value).length > 0 && (add >= 1 || (jumpTo != null && jumpTo > currentPageIndex.value)) ){
        for(let crf in currentRequiredFields.value){
            let field = allFields.value[crf]
            
            if(typeof field.value == 'checkbox-group'){
                field.value = JSON.parse(JSON.stringify(field.value));  
                if(field.value == null || field.value.length == 0) {
                    let fieldLabel = (field.content_type == 'field') ? field.label : field.text
                    currentPageRequiredInvalids.value.push({
                        id: field.id,
                        label: fieldLabel == ' ' ? f.placeholder : fieldLabel
                    }) 
                }

                continue
            } 

            if(['',null,[],undefined].includes(field.value)){
                let fieldLabel = (field.content_type == 'field') ? field.label : field.text
                currentPageRequiredInvalids.value.push({
                    id: field.id,
                    label: fieldLabel == ' ' ? field.placeholder : fieldLabel
                })
            }
        }
    }

    if(currentPageRequiredInvalids.value.length){
        if(currentPageIndex.value == 0 && add != null){
            elementLoad('#pwfv-booking-steps').then(el=>{
                el.classList.add('shown')
            })
        }
        return
    }

    if(jumpTo != null){
        if(jumpTo > progressIndex.value+1) return;
        currentPageIndex.value = jumpTo;
        if(currentPageIndex.value > progressIndex.value) progressIndex.value = currentPageIndex.value;
        return;
    }
    
    if(currentPageIndex.value + add > progressIndex.value+1) return;
    currentPageIndex.value+=add;
    if(currentPageIndex.value > progressIndex.value) progressIndex.value = currentPageIndex.value;
}

function submit(){
    isSubmitting.value = true;
    currentPageRequiredInvalids.value = []
    for(let crf in allRequiredFields.value){
        let field = allFields.value[crf]
        
        if(typeof field.value == 'checkbox-group'){
            field.value = JSON.parse(JSON.stringify(field.value));  
            if(field.value == null || field.value.length == 0) return false;
            else return true;
        } 

        if(['',null,[],undefined].includes(field.value)){
            let fieldLabel = (field.content_type == 'field') ? field.label : field.text
            currentPageRequiredInvalids.value.push({
                id: field.id,
                label: fieldLabel == ' ' ? field.placeholder : fieldLabel
            }) 
        }
    }

    if(currentPageRequiredInvalids.value.length > 0) {
        isSubmitting.value = false;
        return
    }

    // if(allFields.value['ll2fs3gs-0.h5j1ryr6az'].value == 'Yes' && onlinePayment.trans_id == ''){
    //     alertNotif('Online Paymennt Required', 'Please complete the payment to continue. Or you may close this window and select No to `Pay Ahead of Time    `','danger')
    //     isSubmitting.value = false;
    //     return
    // }

    
    // if(onlinePayment.trans_id != ''){
        
    //     userInput.value.push({
    //         id: 'transaction-0.payment',
    //         label: 'Payment Transaction ID',
    //         value: onlinePayment.trans_id
    //     });
    // }
    
    axios.post('appointments/create',null,{
        form_receivers: JSON.stringify(form.value.declare.notifEmails),
        book_appointment_locationname:getFieldValue('default_location') ?? '',
        book_appointment_servicesname:getFieldValue('default_services') ?? '',
        book_appointment_worker:getFieldValue('default_worker') ?? '',
        book_appointment_scheduleid:getFieldValue('default_scheduler') ?? '',
        book_appointment_name: indexFieldVals.value.name,
        book_appointment_phone: indexFieldVals.value.phone,
        book_appointment_email : userReceiver,
        book_appointment_custominputs: JSON.stringify(userInput.value),
        book_appointment_status: 0,
        book_appointment_created_at: dateFormatTimezone('%y-%M-%D %H:%I:%S'),
    }).then(res=>{
        if(res.data == null || !res.data.success){
            alert('Something went wrong! You may contact the website admin and inform them about this problem. Your feedback will be appreciated!')
            return;
        }

        isSubmitting.value = false
        formSubmitted.value = true;

        window.location.reload()
    });
}



async function checkResponsive(){
    pageColumnResponsive.value = currentPage.value.page_columns
    const responsiveClasser = ()=>{
        document.getElementById('pwfv-parent').dataset.responsive=""
        if(document.getElementById('pwfv-parent').offsetWidth <= 400)
            document.getElementById('pwfv-parent').dataset.responsive = document.getElementById('pwfv-parent').dataset.responsive + "r400 ";

        if(document.getElementById('pwfv-parent').offsetWidth <= 600)
            document.getElementById('pwfv-parent').dataset.responsive = document.getElementById('pwfv-parent').dataset.responsive + "r600 ";
        if(document.getElementById('pwfv-parent').offsetWidth <= 800){
            document.getElementById('pwfv-parent').dataset.responsive= document.getElementById('pwfv-parent').dataset.responsive + "r800 ";
            pageColumnResponsive.value = 1;
        }
        if(document.getElementById('pwfv-parent').offsetWidth <= 1000)
            document.getElementById('pwfv-parent').dataset.responsive = document.getElementById('pwfv-parent').dataset.responsive + "r1000 ";
        if(document.getElementById('pwfv-parent').offsetWidth <= 1200)
            document.getElementById('pwfv-parent').dataset.responsive = document.getElementById('pwfv-parent').dataset.responsive + "r1200 ";
        if(document.getElementById('pwfv-parent').offsetWidth <= 1400)
            document.getElementById('pwfv-parent').dataset.responsive = document.getElementById('pwfv-parent').dataset.responsive + "r1400 ";

        if(window.parent.document.getElementById('pwform') != null){
            new ResizeObserver(()=>{
                window.parent.document.getElementById('pwform').style.width='100%' 
                window.parent.document.getElementById('pwform').style.overflow='hidden' 
                window.parent.document.getElementById('pwform').style.border='none' 
                window.parent.document.getElementById('pwform').style.height=(document.body.offsetHeight < 500) ? 500 : document.body.offsetHeight+'px'

                
            }).observe(document.body)
        }
        
    }
    if(document.getElementById('pwfv-parent') == null){
        let parentChecker =  setInterval(()=>{
            if(document.getElementById('pwfv-parent') == null) return;
            clearInterval(parentChecker);
            
            responsiveClasser();
        },100)
        return;
    }
    responsiveClasser();
}

function reactivateButtons(){
    elementLoad('#online_payment').then(el=>{
        el.onclick = ()=>{
            // onlinePayment.opened = true
            window.open(`${window.location.protocol}//${window.location.hostname}?page_id=425`)
        }
    })

    elementLoad('#online_payment_zelle').then(el=>{
        el.onclick = ()=>{
            let tooltip = document.getElementById('online_payment_zelle_tooltip')
            if(tooltip.classList.contains('shown')) tooltip.classList.remove('shown')
            else tooltip.classList.add('shown')
        }
    })

    elementLoad('#pwfv-first-next-button').then(el=>{
        el.onclick = ()=>{
            beforePageChange(1)
        }
    })
}

window.addEventListener('resize', () => {
    reactivateButtons()
})

function fetchingSchedules(e){
    let index = currentPage.value.page_fields.findIndex(el=>el.content_type == 'rbfield' && el.endpoint.includes('services'))
    if(index == -1) return
    if(currentPage.value.page_fields[index].disabledByPayment) {
        currentPage.value.page_fields[index].readonly = true
        return
    }
    if(e) currentPage.value.page_fields[index].readonly = true
    else currentPage.value.page_fields[index].readonly = false
}

function parseConditions(text) {   
    if(['',null,undefined].includes(text)) return
    const conditions = [];
    let logicalOperators = text.match(/\s+\|\|\s+|\s+&&\s+/g)
    text = text.split(/\s+\|\|\s+|\s+&&\s+/g)

    const regex = /(==|!=|>|<|>=|<=|in_array)/g;

    for(let i = 0 ; i < text.length; i++){
        let el = text[i]
        let match = el.split(regex)

        let leftOperand = match[0].trim();
        const operator = match[1].trim();
        let rightOperand = match[2].trim();

        if(leftOperand.startsWith("(") && leftOperand.endsWith(")")){
            leftOperand = leftOperand.slice(1, -1);
            leftOperand = Number(leftOperand);
        }
            
        if (rightOperand.startsWith("(") && rightOperand.endsWith(")")) {
            rightOperand = rightOperand.slice(1, -1);
            rightOperand = Number(rightOperand); // Typecast as number
        } else if (rightOperand.startsWith("{") && rightOperand.endsWith("}")) {
            rightOperand = rightOperand.slice(1, -1).split(',').map(item => item.trim());
        }else{
            rightOperand = rightOperand.trim()
        }

        

        if(leftOperand.startsWith("[") && leftOperand.endsWith("]")){
            leftOperand = leftOperand.slice(1, -1);
            leftOperand = allFields.value[leftOperand] != null ? allFields.value[leftOperand].value : '';
        }

        conditions.push({
            leftOperand,
            operator,
            rightOperand
        });
    }
    
    return {
        conditions,
        logicalOperators
    };
}

function evaluateConditions(parsed) {
    const {conditions, logicalOperators} = parsed
    

    let lastResult = null;
    let logOptIndex = 0
    for (const condition of conditions) {
        const { leftOperand, operator, rightOperand } = condition;

        let leftValue = leftOperand;
        if (typeof leftValue === 'string' && !isNaN(leftValue)) {
        leftValue = Number(leftValue);
        }

        let rightValue = rightOperand;
        if (typeof rightValue === 'string' && !isNaN(rightValue)) {
        rightValue = Number(rightValue);
        }

        let result;

        if(leftOperand != ''){
            switch (operator) {
                case '!=':
                    result = leftValue != rightValue;
                    break;
                case '>':
                    result = leftValue > rightValue;
                    break;
                case '<':
                    result = leftValue < rightValue;
                    break;
                case '>=':
                    result = leftValue >= rightValue;
                    break;
                case '<=':
                    result = leftValue <= rightValue;
                    break;
                case '==':
                    result = leftValue == rightValue;
                    break;  
                case 'in_array':
                    let val = leftOperand
                    if(typeof leftOperand != 'string') val = String(val)
                    result = rightValue.includes(val)
                    break;
                default:
                    result = false;
                    break;
            }
        }else{
            result = false
        }
        
        
        if(lastResult != null){
            if(logicalOperators[logOptIndex] == ' || ')
            lastResult = lastResult || result
        if(logicalOperators[logOptIndex] == ' && ')
            lastResult = lastResult && result
        logOptIndex++
        }else{
            lastResult = result
        }
    }
    
    return lastResult

}

async function substituteFieldPlaceholders(text){
    return new Promise(res=>{
        setTimeout(()=>{
            res(text.replace(/\[(\w+)\]/g, (match, id) => allFields.value[id].value))
        },10)
    })
}

function tokenizeEffects(effectsArray) {
    function customEffectsSplitter(text) {
  const delimiters = ['='];
  let currentToken = '';
  const tokens = [];

  for (let i = 0; i < text.length; i++) {
    const currentChar = text[i];

    if (tokens.length === 0) {
      if (currentToken.match(/\[[a-zA-Z0-9.\-_]+\]/g)) {
        tokens.push(currentToken);
        currentToken = '';
      } else {
        currentToken += currentChar;
      }
    } else {
      if (delimiters.includes(currentChar)) {
        if (currentToken !== '') {
          tokens.push(currentToken.trim());
          currentToken = '';
        }
        tokens.push(currentChar);
      } else {
        currentToken += currentChar;
      }
    }
  }

  if (currentToken !== '') {
    tokens.push(currentToken.trim());
    currentToken = '';
  }

  const remainingText = text.slice(tokens.join('').length).trim();
  if (remainingText !== '') {
    tokens.push(remainingText);
  }

  return tokens;
}




    function tokenizeString(inputString) {
        const regex = /\s+|\[([^[\]]+)\](?=\s|$)|([.=])(?=\s|$)|"([^"]*)"(?=\s|$)/g
        return customEffectsSplitter(inputString).filter((token) => token.trim() !== '');
    }

  let effects = [];
  effectsArray.forEach(el => {
    let tokenized = tokenizeString(el);
    let field = tokenized[0].startsWith('[') && tokenized[0].endsWith(']')
      ? tokenized[0].slice(1, -1)
      : tokenized[0];
      
    effects.push({
      field: field,
      prop: tokenized[1].trim(),
      value: tokenized[3].trim(), // Remove the quotes around the value
    });
  });
  return effects;
}


function parseValue(value){
    if(value.startsWith('[') && value.endsWith(']')){
        if(allFields.value[value.substring(1,value.length - 1)] == null) return value
        return getFieldValue(value.substring(1,value.length - 1))
    }

    if(value == null || value == undefined) return value
    if(value.match(/^[0-9]+$/g) != null){ //match integer
       return parseInt(value);
    }else if(value.match(/^[0-9]+.[0-9]+$/g)){
       return parseFloat(value);
    }else if(value == 'true'){
       return true;
    }else if(value == 'false'){
       return false;
    }else{
        return value
    }
}

function effectsToggler(conditionText,effects,evaluation){
    
    if(evaluation){
        effects.forEach(el=>{

            if(propsToModify.value[el.field] == null)
                propsToModify.value[el.field] = {}
    
            // if(el.prop == 'required' || el.prop == 'hidden'){
            //     if(el.prop == 'hidden' && parseValue(el.value) == false) return
            //     if(el.prop == 'required' && parseValue(el.value) == true) return
            // }

            propsToModify.value[el.field][el.prop] = parseValue(el.value)

            
        })

        
    }else{
        for(let field in initialVals.value[conditionText]){
            for(let prop in initialVals.value[conditionText][field]){
                if(propsToModify.value[field] == null)
                    propsToModify.value[field] = {}

                if(allFields.value[field][prop] != initialVals.value[conditionText][field][prop]) return
                // console.log(propsToModify.value)
                if(propsToModify.value[field][prop] == null)
                    propsToModify.value[field][prop] = initialVals.value[conditionText][field][prop]
                
            }
        }

        
    }
}

function hideClickHere(){
    if(document.getElementById('online_payment') != null) {document.getElementById('online_payment').style.display = 'none';}
}

</script>
<template>
<ProweaverForms v-if="onlinePayment.opened && onlinePayment.trans_id == ''" :onclose="()=>{onlinePayment.opened = false}" :onsuccess="transId=>{
    onlinePayment.trans_id = transId;
    onlinePayment.active = true;
    hideClickHere()
}"/>
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

   <div id="pwfv-parent" ref="formElement" v-if="form != null" data-responsive="" :data-page-index="currentPageIndex">
        <div class="pwfv-header">
            {{ form.form_title }} 
        </div>
        <div class="pwfv-body" v-if="!formSubmitted">
            <div class="pwfv-navigation" v-if="form.pages.length > 1">
                <div class="pwfv-navigation-item" :class="{active:currentPageIndex == i,done:progressIndex > i}" v-for="p,i in form.pages" :key="i" @click="beforePageChange(null,i)">
                    <span>{{progressIndex > i ? '&check;' : i+1}}</span>
                    {{ p.page_title }}
                </div>
            </div>
            <div class="pwfv-maingrid " :class="{'two-cols':currentPage.page_columns == 2}">
                <p class="pwfv-required-reminder" v-if="currentPageRequired.length > 0">Required Fields are marked with (*)</p>
                <div class="pwfv-maingrid-1">
                    
                    <div class="pwfv-fielditem" v-for="f,i in filteredByColumn(1)" v-show="f != null && (f.hidden == undefined || f.hidden == false)">
                        <!-- field renderer start-->
                        <!-- v-if="f != null && " -->
                        
                        
                        <div v-if="f.content_type == 'rbfield' && !omittedRBFields.includes(f.id)">
                            
                            <label class="pwfv-fieldlabel">{{ f.text }} <span>*</span></label>
                            <RequestBindedFields
                                :endpoint="f.endpoint"
                                :based="f.based"
                                :type="f.type"
                                :value="getFieldValue(f.id)"
                                :readonly="f.readonly"
                                @onResult="e=>organizeInput(f,e)"
                                @onEmpty="deleteRBField(f.id)"
                            />
                        </div>
                        <div v-if="f.content_type == 'scheduler'">
                            
                            <label class="pwfv-fieldlabel">{{ f.text }} <span>*</span></label>
                            <SchedulerSelect
                                :schedule="getFieldValue(f.id)"
                                :serviceSelect="selectedServiceFromScheduler"
                                @onFetch="e=>fetchingSchedules(e)"
                                @selectedService="e=>selectedService(e)"
                                @onResult="e=>organizeInput(f,e)"
                            />
                        </div>
                        <div v-if="f.content_type == 'text'" v-html="f.text" :style="f.styles"></div>
                        <div v-if="f.content_type == 'field' && !['checkbox','paypal'].includes(f.type)">
                            <label class="pwfv-fieldlabel">{{ f.label }} <span v-if="f.required && f.label != ' '">*</span></label>
                            <TemplatedFields 
                            :type="f.type"
                            :name="f.name"
                            :columns="f.grid"
                            :readonly="f.readonly"
                            :required="f.required"
                            :placeholder="f.placeholder"
                            :values="f.values"
                            :select="f.type=='checkbox-group' ? getFieldValue(f.id) : null"
                            :options="f.options"
                            :index="f.index"
                            :value="getFieldValue(f.id)"
                            @onResult="e=>organizeInput(f,e)"
                            />
                        </div>
                        <div v-if="f.content_type == 'field' && f.type == 'checkbox'">
                            <TemplatedFields 
                            :type="f.type"
                            :name="f.name"
                            :columns="f.grid"
                            :readonly="f.readonly"
                            :required="f.required"
                            :placeholder="f.placeholder"
                            :values="f.values"
                            :select="f.type=='checkbox-group' ? getFieldValue(f.id) : null"
                            :options="f.options"
                            :index="f.index"
                            :value="getFieldValue(f.id)"
                            @onResult="e=>organizeInput(f,e)"
                            />
                            <label :for="f.name" class="pwfvf-checkbox-label">{{ f.label }} <span v-if="f.required">*</span></label>
                        </div>
                        <div v-if="f.content_type == 'field' && f.type == 'paypal' && !refreshPayPal">
                            
                            <PayPalButtons
                                :service="selectedServiceFromScheduler"
                                :fieldData="JSON.parse(JSON.stringify(f))"
                                :paid="getFieldValue(f.id)"
                                :currency="form.declare.paypalCurrency"
                                :paymentFunc="paidPaypal"
                                :paymentFuncParams="[f]"
                                @onEmpty="()=>deletePaypalAsPayment(f)"
                                @onLoaded="()=>addPaypalAsPayment(f)"
                            />
                        </div>
                        <!-- field renderer end-->
                    </div>
                </div>
                <div class="pwfv-maingrid-2" v-if="currentPage.page_columns == 2">
                    <div class="pwfv-fielditem " v-for="f,i in filteredByColumn(2)" v-show="f != null && (f.hidden == undefined || f.hidden == false)" :key="i">
                        <!-- field renderer start-->
                        <div v-if="f.content_type == 'rbfield' && !omittedRBFields.includes(f.id)">
                            
                            <label class="pwfv-fieldlabel">{{ f.text }} <span>*</span></label>
                            <RequestBindedFields
                                :endpoint="f.endpoint"
                                :based="f.based"
                                :type="f.type"
                                :value="getFieldValue(f.id)"
                                :readonly="f.readonly"
                                @onResult="e=>organizeInput(f,e)"
                                @onEmpty="deleteRBField(f.id)"
                            />
                        </div>
                        <div v-if="f.content_type == 'scheduler'">
                            
                            <label class="pwfv-fieldlabel">{{ f.text }} <span>*</span></label>
                            <SchedulerSelect
                                :schedule="getFieldValue(f.id)"
                                :service="selectedServiceFromScheduler"
                                @onFetch="e=>fetchingSchedules(e)"
                                @selectedService="e=>selectedService(e)"
                                @onResult="e=>organizeInput(f,e)"
                            />
                        </div>
                        <div v-if="f.content_type == 'text'" v-html="f.text" :style="f.styles"></div>
                        <div v-if="f.content_type == 'field' && !['checkbox','paypal'].includes(f.type)">
                            <label class="pwfv-fieldlabel">{{ f.label }} <span v-if="f.required">*</span></label>
                            <TemplatedFields 
                            :type="f.type"
                            :name="f.name"
                            :columns="f.grid"
                            :readonly="f.readonly"
                            :required="f.required"
                            :placeholder="f.placeholder"
                            :values="f.values"
                            :select="f.type=='checkbox-group' ? getFieldValue(f.id) : null"
                            :options="f.options"
                            :index="f.index"
                            :value="getFieldValue(f.id)"
                            @onResult="e=>organizeInput(f,e)"
                            />
                        </div>
                        <div v-if="f.content_type == 'field' && f.type == 'checkbox'">
                            <TemplatedFields 
                            :type="f.type"
                            :name="f.name"
                            :columns="f.grid"
                            :readonly="f.readonly"
                            :required="f.required"
                            :placeholder="f.placeholder"
                            :values="f.values"
                            :select="f.type=='checkbox-group' ? getFieldValue(f.id) : null"
                            :options="f.options"
                            :index="f.index"
                            :value="getFieldValue(f.id)"
                            @onResult="e=>organizeInput(f,e)"
                            />
                            <label :for="f.name" class="pwfvf-checkbox-label">{{ f.label }} <span v-if="f.required">*</span></label>
                        </div>
                        <div v-if="f.content_type == 'field' && f.type == 'paypal' && !refreshPayPal">
                            <PayPalButtons
                                :service="selectedServiceFromScheduler"
                                :fieldData="JSON.parse(JSON.stringify(f))"
                                :paid="getFieldValue(f.id)"
                                :currency="form.declare.paypalCurrency"
                                :paymentFunc="paidPaypal"
                                :paymentFuncParams="[f]"
                                @onEmpty="()=>deletePaypalAsPayment(f)"
                                @onLoaded="()=>addPaypalAsPayment(f)"
                            />
                        </div>
                        <!-- field renderer end-->
                    </div>
                </div>
                <div class="pwfv-errormsg" v-if="currentPageRequiredInvalids.length > 0">
                    The following field/s are required before you proceed:
                    <strong v-for="cpri,i in currentPageRequiredInvalids" :key="i">
                        {{ cpri.label }}{{ i != currentPageRequiredInvalids.length - 1 ? ', ' : ' ' }}
                    </strong>
                </div>    
                <div class="pwfv-finalfields">
                    <div class="hidden pwfv-recaptcha-parent" v-show="false">                        
                        <div id="recaptcha" v-show="currentPageIndex == form.pages.length -1" class="g-recaptcha" :data-sitekey="siteKey"></div>
                    </div>
                    <button @click="beforePageChange(-1)" v-if="currentPageIndex != 0"><i v-html="icons.arrowLeft"></i> Prev</button>
                    <button @click="beforePageChange(1)" v-if="currentPageIndex != form.pages.length -1">
                        <span style="font-size: inherit;">Next</span>

                         <i v-if="currentPageIndex != 0" v-html="icons.arrowRight"></i>
                    </button>
                    <button @click="submit()" :disabled="isSubmitting" v-if="currentPageIndex == form.pages.length -1 " class="pwfv-submit">Submit</button>
                </div>
            </div>
        </div>
        <div class="pwfv-success" v-if="formSubmitted">
            <div class="pwfv-success-box">
                <div class="pwfv-success-checkmark"><i v-html="iconsSolid.check"></i></div>
                Your entry has been successfully submitted.
            </div>
            
        </div>
    </div>
</template>
<style scoped>



</style>