import{_ as Ne,o as r,c as d,z as T,d as g,a as u,A as ne,F as R,y as V,x as D,t as C,w as Q,v as Ge,p as Ke,f as Ze,J as Qe,g as J,q as K,K as Xe,H as De,C as et,L as tt,s as j,I as ee,r as O,m as oe,n as he,u as o,P as Be,j as Fe,k as se,M as qe,N as Re,E as lt,B as st,O as at}from"./index-cab8464d.js";import{i as re,a as it}from"./icons-3157046c.js";import{S as je}from"./StyledAlert-ea1e92ab.js";const nt={props:{type:String,name:String,placeholder:String,options:Object,columns:String,value:null,values:Object,select:Object,readonly:Boolean},emits:["onResult"],data(){return{valueC:"",selectC:[],selectedValue:"",error:"",largest:0,console,searchVal:"",loaded:!1,groupTypes:["checkbox-group","radio-group","select","datalist"],debounceTimer:null}},computed:{filteredDatalist(){let s=this.values.filter(n=>(n.label==this.selectedValue&&(this.valueC=this.value),!!(n.label.toLowerCase().includes(this.selectedValue.toLowerCase())||this.selectedValue=="")));return s.length==0&&(this.valueC=""),s}},watch:{value(){if(this.value==null&&(this.type=="select"||this.type=="datalist")){if(this.values.length==0)return;this.selectedValue=this.values[0].label,this.valueC=this.values[0].value,this.$emit("onResult",this.values[0].value);return}this.valueC=this.value,(this.type=="select"||this.type=="datalist")&&this.values.length>0&&this.value!=null&&this.value!=""&&this.values.filter(s=>s.value==this.value)!=null&&(this.selectedValue=this.values.filter(s=>s.value==this.value)[0].label)},values:{handler(s){if(this.type=="select"||this.type=="datalist"){if(this.loaded||this.values.length==0||this.value!=""&&this.value!=null||this.values.length==0)return;this.selectedValue=this.values[0].label,this.valueC=this.values[0].value,this.$emit("onResult",this.values[0].value),this.values.forEach(n=>this.largest=this.largest<n.label.length?n.label.length:this.largest)}},deep:!0},valueC(s){this.error==""&&this.$emit("onResult",this.valueC)},select:{handler(s){s!=null&&(this.selectC=s)},deep:!0},selectC:{handler(s){this.selectC!=this.select&&s!=null&&this.$emit("onResult",JSON.parse(JSON.stringify(this.selectC)))},deep:!0}},mounted(){if(this.valueC=this.value,this.json=JSON.stringify(this.form),this.type=="checkbox-group"&&(this.selectC=this.select??[]),this.type=="select"||this.type=="datalist"){if(this.values.length==0)return;this.value==null?(this.selectedValue=this.values.filter(s=>s.value==this.value)[0]?this.values.filter(s=>s.value==this.value)[0].label:"",this.valueC=this.values[0].value):(this.selectedValue=this.values.filter(s=>s.value==this.value)[0]?this.values.filter(s=>s.value==this.value)[0].label:"",this.valueC=this.value,this.values.forEach(s=>this.largest=this.largest<s.label.length?s.label.length:this.largest)),this.values.forEach(s=>this.largest=this.largest<s.label.length?s.label.length:this.largest)}},methods:{dataListTyping(){document.querySelector(`.pwfvf-select[data-pwfvf='${this.name}']`).classList.add("shown")},validate(s){let n=/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/g,a=/^[0-9+()]+[0-9.+()\- ]+[0-9.+()]+$/g,b=/^[0-9]+$|^[0-9]+.[0-9]+$/g,t=/^[0-9]+$|^[0-9]+$/g;if(this.error="",this.type=="email"&&s.match(n)==null&&s!=""){this.error="Email is not in valid format";return}else if(this.type=="telephone"&&s.match(a)==null&&s!=""){this.error="Phone is not in valid format";return}else if(this.type=="number"&&s.match(b)==null&&s!=""){this.error="Number is not in valid format";return}else if(this.type=="integer"&&s.match(t)==null&&s!=""){this.error="Integer must only contain numbers";return}this.error=""},closeAllOpenSelects(){if(this.readonly)return;document.querySelectorAll(".pwfvf-select").forEach(n=>{n.dataset.pwfvf!=this.name&&n.classList.remove("shown")});let s=document.querySelector(`.pwfvf-select[data-pwfvf="${this.name}"]`);s.classList.contains("shown")?s.classList.remove("shown"):s.classList.add("shown")},checkThis(s,n){if(this.options!=null&&this.options.maximum_checks!=0&&this.selectC.length>=this.options.maximum_checks&&n.target.checked){n.target.checked=!1;return}this.selectC.includes(s)?this.selectC.splice(this.selectC.indexOf(s),1):this.selectC.push(s)}}},Ve=s=>(Ke("data-v-c13c0494"),s=s(),Ze(),s),ot=["readonly","placeholder","type","value","name"],rt=["value","placeholder","checked"],dt=["id","checked"],ct=["for"],ut=["readonly","id","name","onChange","checked"],pt=["for"],ht=["readonly","id","name","checked","onChange"],ft=["data-pwfvf"],vt=["innerHTML"],mt=Ve(()=>u("i",{class:"pwfvf-select-caret-down"},"▼",-1)),yt=["onClick","innerHTML"],gt=["data-pwfvf"],bt=["placeholder"],_t=Ve(()=>u("i",{class:"pwfvf-select-caret-down"},"▼",-1)),wt=["onClick","innerHTML"],xt={key:7,class:"pwfvf-field-error"};function kt(s,n,a,b,t,y){return r(),d("div",{class:T(["pwfvf-custom-field",{"pwfvf-checkbox-input":a.type=="checkbox"}])},[!t.groupTypes.includes(a.type)&&a.type!="textarea"&&a.type!="paypal"&&a.type!="checkbox"?(r(),d("input",{key:0,readonly:a.readonly,placeholder:a.placeholder,type:a.type=="number"||a.type=="integer"?"text":a.type??"text",class:T("pwfvf-"+a.name),value:t.valueC,onBlur:n[0]||(n[0]=v=>{t.valueC=v.target.value,y.validate(t.valueC)}),name:a.name,onChange:n[1]||(n[1]=v=>{a.type=="checkbox"&&(t.valueC=v.target.checked)})},null,42,ot)):g("",!0),a.type=="textarea"?(r(),d("textarea",{key:1,value:t.valueC,placeholder:a.placeholder,class:T("pwfvf-"+a.type),onBlur:n[2]||(n[2]=v=>t.valueC=v.target.value),checked:t.valueC},null,42,rt)):g("",!0),a.type=="checkbox"?(r(),d("label",{key:2,class:T(["pwfvf-checkbox-main",{active:t.valueC==!0}])},[u("input",{id:a.name,type:"checkbox",hidden:"",checked:t.valueC==!0,onChange:n[3]||(n[3]=v=>t.valueC=v.target.checked)},null,40,dt)],2)):g("",!0),a.type=="checkbox-group"?(r(),d("div",{key:3,class:T(["pwfvf-checkbox-group",{"pwcf-readonly":a.readonly}]),style:ne({"grid-template-columns":a.columns})},[(r(!0),d(R,null,V(a.values,(v,p)=>(r(),d("label",{key:p,for:a.name+"_"+p,class:T({active:t.selectC!=null&&t.selectC.includes(v.value)})},[D(C(v.label)+" ",1),u("input",{style:{display:"none"},readonly:a.readonly,type:"checkbox",id:a.name+"_"+p,name:a.name+"_"+p,onChange:S=>{y.checkThis(v.value,S)},checked:t.selectC!=null&&t.selectC.includes(v.value)},null,40,ut)],10,ct))),128))],6)):g("",!0),a.type=="radio-group"?(r(),d("div",{key:4,class:T(["pwfvf-radio-group",{"pwcf-readonly":a.readonly}]),style:ne({"grid-template-columns":a.columns})},[(r(!0),d(R,null,V(a.values,(v,p)=>(r(),d("label",{key:p,for:a.name+"_"+p,class:T({active:t.valueC==v.value})},[u("input",{style:{display:"none"},readonly:a.readonly,id:a.name+"_"+p,type:"radio",name:a.name,checked:t.valueC==v.value,onChange:S=>{t.valueC=v.value}},null,40,ht),D(" "+C(v.label),1)],10,pt))),128))],6)):g("",!0),a.type=="select"?(r(),d("div",{key:5,class:T(["pwfvf-select","pwfvf-select-"+a.name]),onClick:n[4]||(n[4]=(...v)=>y.closeAllOpenSelects&&y.closeAllOpenSelects(...v)),"data-pwfvf":a.name,tabindex:"1"},[u("span",{innerHTML:t.selectedValue},null,8,vt),mt,u("div",{class:T(["pwfvf-select-menu",{"pwcf-readonly":a.readonly}])},[(r(!0),d(R,null,V(a.values,(v,p)=>(r(),d("div",{class:T([{active:t.valueC==v.value},"pwfvf-select-option"]),key:p,onClick:S=>{t.loaded=!0,t.valueC=v.value,t.selectedValue=v.label},innerHTML:v.label},null,10,yt))),128))],2)],10,ft)):g("",!0),a.type=="datalist"?(r(),d("div",{key:6,class:T(["pwfvf-select","pwfvf-select-"+a.name]),onClick:n[7]||(n[7]=(...v)=>y.closeAllOpenSelects&&y.closeAllOpenSelects(...v)),"data-pwfvf":a.name,tabindex:"1"},[Q(u("input",{class:"w-full bg-transparent outline-none","onUpdate:modelValue":n[5]||(n[5]=v=>t.selectedValue=v),placeholder:a.placeholder,onInput:n[6]||(n[6]=(...v)=>y.dataListTyping&&y.dataListTyping(...v))},null,40,bt),[[Ge,t.selectedValue]]),_t,u("div",{class:T(["pwfvf-select-menu",{"pwcf-readonly":a.readonly}])},[(r(!0),d(R,null,V(y.filteredDatalist,(v,p)=>(r(),d("div",{class:T([{active:t.valueC==v.value},"pwfvf-select-option"]),key:p,onClick:S=>{t.loaded=!0,t.valueC=v.value,t.selectedValue=v.label},innerHTML:v.label},null,10,wt))),128))],2)],10,gt)):g("",!0),t.error!=""?(r(),d("span",xt,C(t.error),1)):g("",!0)],2)}const ae=Ne(nt,[["render",kt],["__scopeId","data-v-c13c0494"]]),bs={text:{content_type:"text",text:"This is a sample text inside the form.",column:2,grid:"1fr 1fr",styles:"text-align:center"},field:{content_type:"field",type:"text",name:"sample_field",label:"Sample Field",value:"",column:2,grid:"1fr 1fr",readonly:!1,required:!0,placeholder:"This is a placeholder",values:[{label:"Sample Label",value:"Sample Value"}],select:[],options:{paypal_value_currency:"USD",paypal_value_basis:"fixed",paypal_value:1},index:"",styles:{}}},_s={page_title:"New Page",page_columns:1,page_fields:[{content_type:"text",text:"Sample Header",column:1,styles:"background-color:#eee;text-align:center;padding:5px;margin-bottom:10px;font-weight:700"},{content_type:"text",text:"This is a sample text inside the form.",column:2,grid:"1fr 1fr",styles:"text-align:center"},{content_type:"field",type:"text",name:"sample_field",label:"Sample Field",value:"",column:2,grid:"1fr 1fr",readonly:!1,required:!0,placeholder:"This is a placeholder",values:[{label:"1",value:1},{label:"1",value:2}],select:[],options:{maximum_checks:null},index:"",styles:{}}]},St={form_title:"Default Form",declare:{paypalClientID:"",paypalCurrency:"USD",notifEmails:[],paypalEmail:"",nameIndex:"default_name",phoneIndex:""},conditionals:"20 in_array {20,50,70,80} && 20 == 20 ? [default_gender].readonly = true",design:{primaryColor:"#446523",pagenavDesign:"row",css:null},pages:[{page_title:"Schedule Selection",page_columns:2,page_fields:[{content_type:"rbfield",id:"default_location",column:2,endpoint:"location/fetch",based:"book_location_name",type:"select",value:"",text:"Select Location"},{content_type:"rbfield",id:"default_worker",column:2,endpoint:"worker/fetch",based:"book_worker_name",type:"select",value:"",text:"Select Worker"},{content_type:"rbfield",id:"default_services",column:2,endpoint:"services/fetch",based:"book_services_name",type:"select",value:"",text:"Select Service"},{content_type:"scheduler",id:"default_scheduler",column:1,text:"Scheduler"}]},{page_title:"Personal Information",page_columns:1,page_fields:[{content_type:"field",id:"default_name",type:"text",name:"name",label:"Name",value:"",column:2,grid:"1fr 1fr",readonly:!1,required:!0,placeholder:"Enter your name here",values:[{label:"1",value:1},{label:"1",value:2}],select:[],options:{maximum_checks:null},index:"",styles:{}},{content_type:"field",id:"default_gender",type:"radio-group",name:"gender",label:"Gender",value:"",column:2,grid:"1fr 1fr",readonly:!1,required:!0,placeholder:"",values:[{label:"Male",value:1},{label:"Female",value:2}],select:[],options:{maximum_checks:null},index:"",styles:{}},{content_type:"field",id:"default_email",type:"email",name:"Email_Address",label:"Email Address",value:"",column:2,grid:"1fr 1fr",readonly:!1,required:!0,placeholder:"Enter your email",values:[{label:"Sample Label",value:"Sample Value"}],select:[],options:{paypal_value_currency:"USD",paypal_value_basis:"fixed",paypal_value:1},index:"",styles:{}}]}]};function G(s){return Qe(s).l>50?"#333333":"#ffffff"}function ie(s,n){let a=parseInt(s.substring(1,3),16),b=parseInt(s.substring(3,5),16),t=parseInt(s.substring(5,7),16);return a+=n,b+=n,t+=n,a=Math.min(a,255),b=Math.min(b,255),t=Math.min(t,255),"#"+a.toString(16)+b.toString(16)+t.toString(16)}const Me=(s,n)=>`:root{
    --pwcss-primary-color: ${s};
    --pwcss-lighter-color: ${ie(s,30)};
    --pwcss-lighter2-color: ${ie(s,50)};
    --pwcss-contra-color: ${G(s)};
    --pwcss-contra-lighter-color: ${ie(G(s),30)};
    --pwcss-contra-darker-color: ${ie(G(s),-30)};
    --pwcss-contra2-color: ${G(G(s))};
}

#pwfv-parent{
    width:100%;
    margin: 0 auto;
    border-radius: 7px 7px;
    background:#fff;
    max-width: 1200px;
    box-shadow: 0 0 2px #aaa;
}

.pwfv-header{
    border-radius: 7px 7px 0 0;
    padding: 15px;
    font-size: 24px;
    font-weight: 700;
    background: var(--pwcss-primary-color);
    color: var(--pwcss-contra-color);
}

.pwfv-navigation{
    width: ${n=="row"?"300px":"100%"};
    box-shadow: inset 0 0 10px -5px #777;
    padding: 10px;
    border-radius: 0 0 10px 10px;
    display: ${n=="row"?"block":"grid"};
    grid-template-columns: 1fr 1fr 1fr;
    gap:10px;
}

.pwfv-navigation-item{
    border-width: 1px;
    padding: 5px 10px;
    border-radius: 5px;
    display: flex;
    align-items: center;
    margin-bottom:5px;
    gap:10px;
}

.pwfv-navigation-item:hover{
    background:var(--pwcss-lighter-color);
    color: var(--pwcss-contra-color);
}

.pwfv-navigation-item.active{
    background:var(--pwcss-primary-color);
    color: var(--pwcss-contra-color);
}



.pwfv-navigation-item span{
    display: block;
    font-weight:bold;
    border-radius: 50%;
    background: var(--pwcss-primary-color);
    width: 24px;
    height: 24px;
    line-height: 22px;
    text-align: center;
    color:var(--pwcss-contra-color);
}

.pwfv-navigation-item.done{
    border: 1px solid var(--pwcss-lighter2-color);
}

.pwfv-navigation-item.active span{
    background: var(--pwcss-contra-color);
    color:var(--pwcss-primary-color);
}


.pwfv-body{
    display: flex;
    flex-direction:${n};
    flex-grow: 1;

}

.pwfv-maingrid{
    flex-grow:1;
    padding: 20px 20px;
    display:flex;
    flex-wrap:wrap;
    width:100%;
    gap:20px;
}

.pwfv-maingrid > div{
    width:100%;
}


.pwfv-fieldlabel{
    font-weight:bold;
}

.pwfv-maingrid.two-cols > div:not(.pwfv-finalfields):not(.pwfv-errormsg){
    width:48%;
}

.pwfv-finalfields{
    margin-top:20px;
    width:100%;
    display:flex;
    gap:10px;
    justify-content:center;
    align-items:center;
    flex-wrap: wrap;
}

.pwfv-finalfields button{
    padding:10px;
    min-width:100px;
    border-radius:5px;
    background: ${G(G(s))};
    color: var(--pwcss-contra-color);
    display:flex;
    justify-content:center;
    align-items:center;
    gap:10px;
    transition:0.2s;
    box-shadow: 0 2px 5px #777;
}

.pwfv-finalfields button:hover{scale:1.05}
.pwfv-finalfields button:active{scale:0.95}

.pwfv-finalfields button.pwfv-submit{
    color: var(--pwcss-contra-color);
    background:var(--pwcss-primary-color);
}

.pwfv-fielditem{
    margin:0 0 5px
}

.pwfv-fielditem > div > label span{
    color:#A00
}

.pwfv-fielditem >  div > label{
    margin-bottom:5px;
    display:block;
}

.pwfv-fielditem:not(:first-child) > div > label{
    margin-top:10px;
}

.pwfv-success{
	padding: 20px;
}

.pwfv-success-box{
	padding: 20px;
	text-align: center;
	box-shadow: 0 4px 8px #aaa;
	max-width: 500px;
	margin: 0 auto;
    animation-name: popSuccess;
    animation-duration: 0.4s;
}

@keyframes popSuccess{
    from{
        transform: scale(0)
    }
}

.pwfv-success-checkmark{
	width: 150px;
	height: 150px;
	background: var(--pwcss-primary-color);
	border-radius: 50%;
	color: var(--pwcss-contra-color);
	padding: 19px;
	margin: 0 auto 14px;
}

.pwfv-success-checkmark i {
	filter: drop-shadow(0 2px 3px rgba(0, 0, 0, 0.67));
}


*{font-size:15px}
input[class^='pwfvf-']:not([type="radio"]):not([type="checkbox"]),textarea{
    all:unset;
    width: calc(100% - 20px);
    padding: 5px 7px;
    border-bottom: 2px solid var(--pwcss-primary-color);
    font-size: 15px;
    background:#eee;
    box-shadow: 0 -1px 3px var(--pwcss-primary-color)33;
}


textarea{height: 150px;}


.pwfvf-checkbox-group,.pwfvf-radio-group{
    display: grid;
    gap:5px
}

.pwfv-fielditem > div > .pwfvf-checkbox-input{
    display:inline-block;
    margin-right:10px
}

.pwfv-fielditem > div > label.pwfvf-checkbox-label{
    display:inline;
}

.pwfv-fielditem > div label.pwfvf-checkbox-main::after{
    content:'';
    border: 2px solid var(--pwcss-primary-color);
    color:var(--pwcss-primary-color);
    width: 20px;
    height:20px;
    line-height:17px;
    font-size:15px;
    text-align:center;
    font-weight:700;
    display:block;
    margin-bottom: -4px;
}

.pwfv-fielditem > div  label.pwfvf-checkbox-main.active::after{
    content:'\\2713';
}


.pwfvf-checkbox-group label, .pwfvf-radio-group label{
    padding: 5px 7px;
    border-bottom: 2px solid var(--pwcss-primary-color);
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin:0;
    position:relative;
}

.pwfvf-checkbox-group label:after, .pwfvf-radio-group label:after{
    content:'';
    border: 2px solid var(--pwcss-primary-color);
    width: 20px;
    height:20px;
    line-height:17px;
    text-align:center;
    font-weight:700;
}

.pwfvf-radio-group label:after{
    border-radius:20px;
    content:'';
}


.pwfvf-checkbox-group label.active:after{
    content:'\\2713';
}

.pwfvf-checkbox-group label.active:after, .pwfvf-radio-group label.active:after{
    border: 2px solid var(--pwcss-contra-color);
}

.pwfvf-checkbox-group label.active, .pwfvf-radio-group label.active{
    background: var(--pwcss-lighter-color);
    color: var(--pwcss-contra-color)
}

.pwfvf-radio-group label.active:after{
    border: 5px solid var(--pwcss-contra-color);
}

.pwfv-paypalcont{
    background: #e5f2ff;
    padding: 20px;
    max-width: 600px;
    margin: 
    20px auto;
    border-radius: 5px;
    border: 1px solid #70b8ff;
}

.pwfv-paypalcontheader{
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
    font-weight: bold;
    gap:10px;
    align-items:center;
}

.pwfv-paypalcontheader label{
    border-right: 1px solid #000;
    flex-grow: 1;
    padding-right: 10px;
}

.pwfv-paypalcontheader label h2 small{display: block;}
.pwfv-paypalrequired{color:rgb(98, 25, 25);display: block;margin: 20px 0;}
.pwfv-paypalcont.pwfv-paypalsuccess{background: #cfffcf;border:1px solid #6ca86c}

.pwfvf-checkbox-group input, .pwfvf-radio-group input{
    float: right;
    outline: none;
}

.pwfvf-radio-group{
    display: grid;
}

.pwfvf-custom-field{padding: 0;}


.pwfvf-select{
    padding: 5px 7px;
    padding-right: 50px;
    border-bottom: 2px solid var(--pwcss-primary-color);
    position: relative;
    background:#eee;
    box-shadow: 0 -1px 3px var(--pwcss-primary-color)33;
}

.pwfvf-select-caret-down{
    position: absolute;
    top:5px;
    right:10px;
    transition: 0.2s;
}

.pwfvf-select.shown .pwfvf-select-caret-down{
    transform: scale(-1);
    user-select: none;
}


.pwfvf-select-menu{
    background: #fff;
    position: absolute;
    top:99%;
    left:0;
    width: 100%;
    overflow: hidden;
    border: 1px solid #ddd;

    border-radius: 0 0 5px 5px;
    z-index: 99;
    display: none;
    max-height: 200px;
    overflow: auto;
}


.pwfvf-select.shown .pwfvf-select-menu{display: block;}

.pwfvf-select-option{
    padding: 5px 7px;
}

.pwfvf-select-option:hover{
    background: #eee;
}

.pwfvf-field-error{
    padding: 5px;
    margin: 5px 0 10px;
    display: block;
    background: #fbcdcd;
    border: 1px solid #dfaeae;
    color: #773434;
}

textarea{white-space: pre-wrap;height:unset;min-height: 70px;}

.pwfv-errormsg{
    background: #fbb;
    padding: 10px;
    text-align: center;
}

/* scheduler */

.pwfvf-scheduler{
    background: #fafafa;
    box-shadow: inset 0 0 5px #ccc;
    padding: 10px;
    max-width: 600px;
    width: 100%;
    margin: 0 auto;
}

.pwfvf-scheduler-header{
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    border-bottom: 1px solid #ddd;
}

.pwfv-required-reminder{
    font-size: 13px;
    width: 100%;
    color: #A00;
}

.pwfvf-scheduler-header h2{
    font-weight: 700;
    font-size: 20px;
    color:#222
}

.pwfvf-scheduler-header h2 small{
    color: #777;
    font-weight: normal;
    text-transform: uppercase;
    font-size: 12px;
    display: block;
    text-align: center;
}



.pwfvf-scheduler-header button{
    background: var(--pwcss-primary-color);
    color: var(--pwcss-contra-lighter-color);
    width: 30px;
    height: 30px;
    border-radius: 50%;
    font-weight: 700;
    box-shadow: 0 0 3px #ccc;
    transition: 0.2s;
}

.pwfvf-scheduler-header button:hover{scale: 1.05;}
.pwfvf-scheduler-header button:active{scale: 0.95; color: var(--pwcss-primary-color);
    background: var(--pwcss-contra-color);}

.pwfvf-scheduler-dateboxes{
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
    text-align: center;
    color:#444;
    padding: 5px 0;
}

.pwfvf-scheduler-datebox{
    padding: 5px 3px 2px;
    border-radius: 5px;
    transition: 0.2s;
    display: flex;
    justify-content: center;
    align-items: center;
}

.pwfvf-scheduler-datebox:hover{
    background: #aaa;
    color:#fff
}

.pwfvf-scheduler-datebox.notCurrentMonth{
    color:#999;
}

.pwfvf-scheduler-datebox.active{
    background: var(--pwcss-primary-color);
    color: var(--pwcss-contra-color);
}

.pwfvf-scheduler-datebox span{
    padding: 5px;
    display: inline-block;
    border-radius: 50%;
}

.pwfvf-scheduler-availscheds{
    max-height: 200px;
    overflow: auto;
    padding: 10px;
    box-shadow: inset 0 0 4px #aaa;
    border-radius: 5px;
}

.pwfvf-scheduler-availscheds-empty{
    text-align: center;
    font-style: italic;
    color:#555
}

.pwfvf-scheduler-availscheds-item{
    color: #444;
    background: #fff;
    box-shadow: 0 0 5px #aaa;
    text-align: center;
    padding: 5px;
    transition:0.15s;
}

.pwfvf-scheduler-availscheds-item.active{
    background:var(--pwcss-lighter-color);
    color:var(--pwcss-contra-color);
}

.pwfvf-scheduler-availscheds-item:not(:first-child){
    margin-top: 7px;
}




.pwfvf-scheduler-availscheds-item:hover{
    scale:1.01;
}

.pwfvf-scheduler-availscheds-item:active{
    scale:0.99;
}


.pwfvf-scheduler-availscheds-item h2{
    font-weight:600;
    display: inline-block;
    margin-right: 10px;
    
}

.pwfvf-scheduler-availscheds-item small{
    display: inline-block;
    font-style: italic;
}


.pwfvf-scheduler-datebox.hasSchedule span{
    width: 25px;
    height: 25px;
    line-height: 15px;
    background: #fff;
    color:#222;
    background: var(--pwcss-primary-color);
    color: var(--pwcss-contra-color);
}

/* request binded fields */
.pwfvf-rbfields-select{
    padding: 5px 7px;
    padding-right: 50px;
    border-bottom: 2px solid var(--pwcss-primary-color);
    position: relative;
    background:#eee;
    box-shadow: 0 -1px 3px var(--pwcss-primary-color)33;
}

.pwfvf-rbfields-select-caret-down{
    position: absolute;
    top:5px;
    right:10px;
    transition: 0.2s;
}

.pwfvf-rbfields-select.shown .pwfvf-rbfields-select-caret-down{
    transform: scale(-1);
    user-select: none;
}


.pwfvf-rbfields-select-menu{
    background: #fff;
    position: absolute;
    top:99%;
    left:0;
    width: 100%;
    overflow: hidden;
    border: 1px solid #ddd;

    border-radius: 0 0 5px 5px;
    z-index: 99;
    display: none;
    max-height: 200px;
    overflow: auto;
}


.pwfvf-rbfields-select.shown .pwfvf-rbfields-select-menu{display: block;}

.pwfvf-rbfields-select-option{
    padding: 5px 7px;
}

.pwfvf-rbfields-select-option:hover{
    background: #eee;
}


.pwfvf-rbfields-radio{

}

.pwfvf-rbfields-radio-option{
    padding: 7px;
    color: #444;
    background: #fff;
    margin-bottom: 4px;
    border-radius: 5px;
    font-weight: 600;
    transition: 0.2s;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom:2px solid #bbb
}

.pwfvf-rbfields-radio-option::after{
    content:'';
    display: block;
    background: #777;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    transition: 0.2s;
    margin-right: 5px;
}

.pwfvf-rbfields-radio-option.active{
    background: var(--pwcss-lighter-color);
    color: var(--pwcss-contra-color)
}

.pwfvf-rbfields-radio-option.active::after{
    width: 20px;
    height: 20px;
    background: var(--pwcss-contra-color);
    margin-right: 0px;
    border: 5px solid var(--pwcss-primary-color)
}

.pwfvf-rbfields-radio-option-price{
    margin-left: 5px;
    font-style: italic;
    font-weight:400;
}


/* Guide To Form Responsiveness:
Form Responsiveness is based from the width of the form when 
the form is initially loaded and when it is resized, not based on the screen width.

So instead of using @media queries, we use:
#pwfv-parent[data-responsive*="rformWidth"]

Please add the selector code above before specifying any selector.
Substitute rformWidth with any of the breakpoints (e.g r1400 for 1400px form width)
The supported width breakpoints are: 400, 600, 800, 1000, 1200, 1400
*/

/* responsive - 1000px */
#pwfv-parent[data-responsive*="r1000"] .pwfv-recaptcha-parent{
    width: 100%;
    display:flex;
    justify-content:center;
    align-items:center;
}
#pwfv-parent[data-responsive*="r1000"] .pwfv-body{
    flex-wrap: wrap
}

#pwfv-parent[data-responsive*="r1000"] .pwfv-body{
    width: 100%;
}

#pwfv-parent[data-responsive*="r1000"] .pwfv-navigation{
    display: grid;
    grid-template-columns:1fr 1fr;
    width: 100%
}

#pwfv-parent[data-responsive*="r800"] .pwfv-navigation-item{
    margin-bottom:0
}

/* responsive - 800px */
#pwfv-parent[data-responsive*="r800"] .pwfv-maingrid.two-cols > div{
    width:100%
}

#pwfv-parent[data-responsive*="r800"] .pwfv-navigation{
    gap: 5px;
}

#pwfv-parent[data-responsive*="r800"] .pwfv-navigation-item{
    font-size: 14px
}

#pwfv-parent[data-responsive*="r800"] .pwfv-navigation-item span{
    width: 20px;
    height: 20px;
    font-size: 15px;
    line-height:20px;
}

/* responsive - 600px */

#pwfv-parent[data-responsive*="r600"] .pwfv-navigation{
    grid-template-columns: 1fr 1fr;
}

#pwfv-parent[data-responsive*="r600"] .pwfv-navigation{
    grid-template-columns: 1fr;
}




`;const Ct={emits:["onResult","onFetch","selectedService"],components:{StyledAlertVue:je},props:{schedule:{type:String},serviceSelect:{default:"",type:String}},data(){return{title:"",cc:{y:0,m:0,d:0},qd:{y:0,m:0,d:0},calendarBoxes:[],availDates:[],availableSchedules:[],fetching:!1,chosenSchedule:null,scheduleSelection:!1,service:null,styledAlert:{header:"Scheduler Error",body:"asdsad",buttons:[],type:"neutral",duration:2e3,show:!1}}},watch:{fetching(){this.$emit("onFetch",this.fetching)},async schedule(){["",null].includes(this.schedule)||(this.chosenSchedule=this.schedule)},serviceSelect(){this.service=this.serviceSelect,this.waitForCondition(()=>this.fetching==!1,()=>{this.fetchScheds()})}},async mounted(){this.service=this.serviceSelect;let s=this.dateTime().dateObj;if(this.cc.y=s.getUTCFullYear(),this.cc.m=s.getUTCMonth(),this.cc.d=s.getUTCDate(),this.qd.y=s.getUTCFullYear(),this.qd.m=s.getUTCMonth(),this.qd.d=s.getUTCDate(),this.buildCalendar(),this.chosenSchedule=this.schedule,["",null,void 0].includes(this.schedule)){this.fetchScheds().then(()=>this.buildCalendar());return}this.fetching=!0;let n="schedules/fetchAvailable?book_schedule_id="+this.schedule;this.service!=""&&this.service!=null&&(n+="&book_schedule_service="+this.service);let a=await J.post(n,"default");a.data==null||!a.data.success||(s=this.dateAdjusted(a.data.result[0].book_schedule_date),this.cc.y=s.getFullYear(),this.cc.m=s.getMonth(),this.cc.d=s.getDate(),this.qd.y=s.getFullYear(),this.qd.m=s.getMonth(),this.qd.d=s.getDate(),this.waitForCondition(()=>this.fetching==!1,()=>{this.fetchScheds().then(()=>{this.$emit("selectedService",a.data.result[0]),this.buildCalendar(),this.fetching=!1})}))},methods:{dateFormat:K,dateTime(s=null,n=null,a=null,b=0,t=0,y=0){return new Xe(s,n,a,b,t,y)},dateAdjusted:De,dateOffseted:et,alertNotif(s,n,a,b=[],t=2e3){this.styledAlert.header=s,this.styledAlert.body=n,this.styledAlert.type=a,this.styledAlert.buttons=b,this.styledAlert.duration=t,this.styledAlert.show=!0},waitForCondition(s,n){s()?n():setTimeout(()=>this.waitForCondition(s,n),100)},selectSchedule(s){if(this.dateTime(s.book_schedule_date+" "+s.book_schedule_timestart).dateObj.getTime()<=this.dateOffseted().getTime()){this.alertNotif("Schedule Done","You cannot select a finished schedule!","danger");return}if(s.is_full){this.alertNotif("Schedule Was Booked",'Your chosen time slot Appointment with Dr. Cecil Poe is no longer available. Please make a selection for another time and date of the month, note that selections are based on "First response". Thank you!',"danger");return}if(s.book_schedule_special_status==1){this.alertNotif("Schedule Unavailable: Reserved",'This schedule is already reserved. Please make a selection for another time and date of the month, note that selections are based on "First Response". Thank you!',"danger");return}if(s.book_schedule_special_status==2){this.alertNotif("Schedule Unavailable: Office Closed",'<strong>Dr. Cecil Poe</strong> is not in the office. Please make a selection for another time and date of the month, note that selections are based on "First Response". Thank you!',"danger");return}if(s.conflicts>0){this.alertNotif("Schedule Was Booked","Your chosen schedule is no longer available as it reached maximum number of bookings.","danger");return}this.chosenSchedule=s.book_schedule_id,this.scheduleSelection=!0,this.$emit("onResult",this.chosenSchedule),this.$emit("selectedService",s)},async fetchScheds(){if(this.fetching)return;this.fetching=!0;let s=De(this.qd.y,this.qd.m,this.qd.d);this.availDates=[];let n=this.service!=""&&this.service!=null?"&service="+this.service:"",a=await J.post(`schedules/availableSchedulesWithinMonth?month=${this.cc.m+1}&year=${this.cc.y}${n}`,"default");a.data!=null&&a.data.success&&a.data.result.forEach(b=>{this.availDates.push(b.book_schedule_date)}),n=this.service!=""&&this.service!=null?"&book_schedule_service="+this.service:"",a=await J.post("schedules/fetchAvailable?book_schedule_date="+K("%y-%M-%D",s.getTime())+n,"default"),this.availableSchedules=[],a.data!=null&&a.data.success&&(a.data.result.forEach(b=>{b.book_schedule_maxappointment<b.count_appointments?b.schedule_full=!0:b.schedule_full=!1,this.availableSchedules.push(b)}),this.value!=null&&(this.selectedSchedule=this.value)),this.availableSchedules.sort((b,t)=>this.dateAdjusted(b.book_schedule_date+" "+b.book_schedule_timestart).getTime()-this.dateAdjusted(b.book_schedule_date+" "+t.book_schedule_timestart).getTime()),this.fetching=!1},buildCalendar(){let s=this.dateAdjusted(this.cc.y,this.cc.m,1),n=this.dateAdjusted(this.cc.y,this.cc.m+1,0),a=this.dateAdjusted(this.cc.y,this.cc.m,1).getDay(),b=this.dateAdjusted(this.cc.y,this.cc.m+1,0).getDay();for(s.setDate(s.getDate()-a),n.setDate(n.getDate()+(6-b)),this.calendarBoxes=[];s.getTime()<=n.getTime();){let t=K("%y-%M-%D",s.getTime()),y={date:t,dateNum:s.getDate(),isCurrentMonth:s.getMonth()==this.cc.m,scheds:this.fetchScheds(t),onclick:async v=>{if(this.fetching)return;let p=this.dateAdjusted(v);if(this.qd.y=p.getFullYear(),this.qd.m=p.getMonth(),this.qd.d=p.getDate(),p.getMonth()!=this.cc.m){p=this.dateAdjusted(this.qd.y,this.qd.m,this.qd.d),this.cc.y=p.getFullYear(),this.cc.m=p.getMonth(),this.cc.d=p.getDate(),this.fetchScheds().then(()=>{this.buildCalendar(),this.fetching=!1});return}this.fetching=!0,this.availableSchedules=[];let S=this.service!=""&&this.service!=null?"&book_schedule_service="+this.service:"",P=await J.post("schedules/fetchAvailable?book_schedule_date="+K("%y-%M-%D",p.getTime())+S,"default");P.data!=null&&P.data.success&&(P.data.result.forEach(w=>{w.book_schedule_maxappointment<w.count_appointments?w.schedule_full=!0:w.schedule_full=!1,this.availableSchedules.push(w)}),this.value!=null&&(this.selectedSchedule=this.value)),this.availableSchedules.sort((w,M)=>this.dateAdjusted(w.book_schedule_date+" "+w.book_schedule_timestart).getTime()-this.dateAdjusted(w.book_schedule_date+" "+M.book_schedule_timestart).getTime()),this.fetching=!1}};this.calendarBoxes.push(y),s.setDate(s.getDate()+1)}this.title=K("%lm %y",this.dateAdjusted(this.cc.y,this.cc.m,this.cc.d).getTime())},nextMonths(s){if(this.fetching)return;let n=this.dateAdjusted(this.cc.y,this.cc.m,this.cc.d);n.setMonth(n.getMonth()+s),s>0&&this.dateAdjusted(this.cc.y,this.cc.m+2,0).getDate()<this.cc.d&&n.setMonth(n.getMonth()-1),s<0&&this.dateAdjusted(this.cc.y,this.cc.m-1,0).getDate()<this.cc.d&&n.setMonth(n.getMonth()+1),this.qd.y=this.cc.y=n.getFullYear(),this.qd.m=this.cc.m=n.getMonth(),this.qd.d=this.cc.d=n.getDate(),this.buildCalendar()}}},Et={class:"pwfvf-scheduler"},Ot={class:"pwfvf-scheduler-header"},Tt={class:"pwfvf-scheduler-dateboxes"},It=u("div",null,"SUN",-1),Dt=u("div",null,"MON",-1),Ft=u("div",null,"TUE",-1),qt=u("div",null,"WED",-1),Rt=u("div",null,"THU",-1),Mt=u("div",null,"FRI",-1),Pt=u("div",null,"SAT",-1),At=["onClick"],Lt={class:"pwfvf-scheduler-availscheds"},Nt={key:0,class:"spinner"},Bt={key:1,class:"pwfvf-scheduler-availscheds-empty"},jt=["onClick"],Vt={key:0},zt={key:1},Ht={key:2};function Jt(s,n,a,b,t,y){const v=tt("StyledAlertVue");return r(),d(R,null,[j(v,{header:t.styledAlert.header,body:t.styledAlert.body,buttons:t.styledAlert.buttons,type:t.styledAlert.type,duration:t.styledAlert.duration,show:t.styledAlert.show,onDismiss:n[0]||(n[0]=p=>t.styledAlert.show=!1),onOnResult:n[1]||(n[1]=p=>s.alertResult=p)},null,8,["header","body","buttons","type","duration","show"]),u("div",Et,[u("div",Ot,[u("button",{onClick:n[2]||(n[2]=p=>y.nextMonths(-1))},"❮"),u("h2",null,C(t.title),1),u("button",{onClick:n[3]||(n[3]=p=>y.nextMonths(1))},"❯")]),u("div",Tt,[It,Dt,Ft,qt,Rt,Mt,Pt,(r(!0),d(R,null,V(t.calendarBoxes,(p,S)=>(r(),d("div",{onClick:P=>p.onclick(p.date),class:T(["pwfvf-scheduler-datebox",{notCurrentMonth:!p.isCurrentMonth,active:this.dateAdjusted(p.date+" 00:00:00").getTime()==this.dateAdjusted(t.qd.y,t.qd.m,t.qd.d).getTime(),hasSchedule:t.availDates.includes(p.date)}])},[u("span",null,C(p.dateNum),1)],10,At))),256))]),u("div",Lt,[t.fetching?(r(),d("div",Nt)):g("",!0),!t.fetching&&t.availableSchedules.length==0?(r(),d("div",Bt,"No schedules for this date...")):g("",!0),(r(!0),d(R,null,V(t.availableSchedules,p=>Q((r(),d("div",{class:T(["pwfvf-scheduler-availscheds-item",{active:t.chosenSchedule==p.book_schedule_id}]),onClick:S=>y.selectSchedule(p)},[u("h2",null,[D(C(p.book_schedule_service)+" ",1),(p.conflicts>0||p.is_full)&&p.book_schedule_special_status==0?(r(),d("span",Vt,"Booked")):g("",!0),y.dateTime(p.book_schedule_date+" "+p.book_schedule_timestart).dateObj.getTime()<=y.dateOffseted().getTime()&&p.book_schedule_special_status==0?(r(),d("span",zt,"Done")):g("",!0),p.book_schedule_special_status!=0?(r(),d("span",Ht,C(["None","Reserved","Closed"][p.book_schedule_special_status]),1)):g("",!0)]),u("small",null,C(y.dateFormat("%h:%I%a",p.book_schedule_date+" "+p.book_schedule_timestart))+" - "+C(y.dateFormat("%h:%I%a",p.book_schedule_date+" "+p.book_schedule_timeend)),1)],10,jt)),[[ee,p.conflicts==0]])),256))])])],64)}const Pe=Ne(Ct,[["render",Jt]]),$t=["data-pwfvf"],Yt=["innerHTML"],Wt=u("i",{class:"pwfvf-rbfields-select-caret-down"},"▼",-1),Ut={class:"pwfvf-rbfields-select-menu"},Gt=["onClick"],Kt={key:1,class:"pwfvf-rbfields-radio"},Zt=["onClick"],Qt={key:0,class:"pwfvf-rbfields-radio-option-price"},Ae={__name:"RequestBindedFields",props:{endpoint:{default:"",type:String},based:{default:"",type:String},readonly:{default:!1,type:Boolean},type:{default:"",type:String},value:{default:"",type:String}},emits:["onResult","onEmpty","onResultInfo"],setup(s,{emit:n}){const a=s;let b=O(""),t=O(""),y=O(null),v=O([]),p=O(a.endpoint.split("/")[0]);oe(()=>a.value,()=>{let w=v.value.findIndex(M=>M[a.based]==a.value);if(w<0){t.value=" - Please Select - ",n("onResult","");return}t.value=v.value[w][a.based],b.value=v.value[w][a.based]}),oe(()=>b.value,()=>{t.value=b.value,n("onResult",b.value),n("onResultInfo",v.value.filter(w=>w[a.based]==b.value)[0])});function S(){document.querySelectorAll(".pwfvf-rbfields-select").forEach(M=>{M.dataset.pwfvf!=p.value&&M.classList.remove("shown")});let w=document.querySelector(`.pwfvf-rbfields-select[data-pwfvf="${p.value}"]`);w.classList.contains("shown")?w.classList.remove("shown"):w.classList.add("shown")}he(()=>{J.post(a.endpoint).then(w=>{if(w.data==null||!w.data.success){n("onEmpty");return}v.value=w.data.result,["",null].includes(a.value)?(t.value=" - Please Select - ",n("onResult","")):(b.value=a.value,n("onResultInfo",v.value.filter(M=>M[a.based]==b.value)[0]))})});function P(w){if(w==null){t.value=" - Please Select - ",n("onResult","");return}a.readonly||(b.value=w[a.based],t.value=w[a.based],y.value=w)}return(w,M)=>(r(),d(R,null,[s.type=="select"?(r(),d("div",{key:0,class:T(["pwfvf-rbfields-select","pwfvf-rbfields-select-"+o(p)]),onClick:S,"data-pwfvf":o(p)},[u("span",{innerHTML:o(t)},null,8,Yt),Wt,u("div",Ut,[u("div",{class:T([{active:o(b)==""},"pwfvf-rbfields-select-option"]),onClick:M[0]||(M[0]=I=>P(null))}," - Please Select - ",2),(r(!0),d(R,null,V(o(v),(I,z)=>(r(),d("div",{class:T([{active:o(b)==I[o(a).based]},"pwfvf-rbfields-select-option"]),key:z,onClick:U=>P(I)},C(I[o(a).based]),11,Gt))),128))])],10,$t)):g("",!0),s.type=="radio"?(r(),d("div",Kt,[(r(!0),d(R,null,V(o(v),(I,z)=>(r(),d("div",{class:T([{active:o(b)==I[o(a).based]},"pwfvf-rbfields-radio-option"]),key:z,onClick:U=>P(I)},[u("span",null,[D(C(I[o(a).based])+" ",1),I.book_services_price!=null?(r(),d("span",Qt,"("+C("$"+parseFloat(I.book_services_price).toFixed(2))+")",1)):g("",!0)])],10,Zt))),128))])):g("",!0)],64))}},Xt={key:0,class:"pwfv-paypalcont"},el={class:"pwfv-paypalcontheader"},tl={class:"pwfv-fieldlabel"},ll=u("small",null,"Payment For:",-1),sl={key:0,class:"pwfv-paypalrequired"},al={key:1,id:"pwfv-paypalparent"},il={key:1,class:"pwfv-paypalcont pwfv-paypalsuccess"},nl={class:"pwfv-paypalcontheader"},ol={class:"pwfv-fieldlabel"},rl=u("small",null,"Payment For:",-1),Le={__name:"PayPalButtons",props:{service:{default:"",type:String},paid:{default:"",type:String},paymentFunc:{type:Function},paymentFuncParams:{type:Array},currency:{default:"USD",type:String},fieldData:{type:Object}},emits:["onPayment","onLoaded","onEmpty"],setup(s,{emit:n}){const a=s;let b=O({}),t=O(null),y=O(!1);oe(()=>a.service,()=>{v()});function v(){a.service==""||a.service==null||t.value.options.paypal_value_basis=="fixed"||J.post("services/fetch?book_services_name="+a.service).then(S=>{if(b.value=S.data.result[0],console.log(t.value.options.paypal_value),t.value.options.paypal_value=b.value.book_services_price,console.log([0,"",null].includes(t.value.options.paypal_value)&&t.value.options.paypal_value_basis!="fixed"),[0,"",null].includes(t.value.options.paypal_value)&&t.value.options.paypal_value_basis!="fixed"){n("onEmpty");return}else console.log("test"),n("onLoaded");p()})}function p(){y.value=!0,setTimeout(()=>{y.value=!1;let S=t.value.options.paypal_value;Be.mountOn("#pwfv-paypalparent",S,a.currency).then(P=>{let w=a.paymentFuncParams;a.paymentFunc(w[0],w[1],S,w[2])}).catch(P=>{console.assert("Paypal Error:",P)})},10)}return he(()=>{t.value=JSON.parse(JSON.stringify(a.fieldData)),t.value!=null&&t.value.options.paypal_value_basis=="fixed"?p():v()}),(S,P)=>(r(),d(R,null,[["",null].includes(o(a).paid)&&o(t)!=null&&o(t).options.paypal_value!=null&&(o(t).options.paypal_value_basis=="fixed"||o(t).options.paypal_value_basis=="service-based"&&o(b).book_services_price!=null)?(r(),d("div",Xt,[u("div",el,[u("label",tl,[u("h2",null,[ll,D(" "+C(o(t).options.paypal_value_basis=="fixed"?o(t).label:o(a).service),1)])]),u("span",null,C(o(a).currency)+" "+C(parseFloat(o(t).options.paypal_value).toFixed(2)),1)]),o(t).required?(r(),d("span",sl,"Payment must be received before proceeding.")):g("",!0),o(y)?g("",!0):(r(),d("div",al))])):g("",!0),o(t)!=null&&!["",null].includes(o(a).paid)?(r(),d("div",il,[u("div",nl,[u("label",ol,[u("h2",null,[rl,D(" "+C(o(t).options.paypal_value_basis=="fixed"?o(t).label:o(a).service),1)])]),u("span",null,C(o(a).currency)+" "+C(parseFloat(o(t).options.paypal_value).toFixed(2)),1)]),D(" Thank you! Your payment is being processed. ")])):g("",!0)],64))}},dl={id:"bookapp-payment-iframe",class:"fixed top-0 left-0 bg-black bg-opacity-60 w-screen h-screen z-[100] flex justify-center items-center"},cl={class:"max-w-[600px] w-[90%] h-[80vh] bg-white outline"},ul={class:"h-[60px] justify-center items-center grid grid-cols-[1fr_30px] p-2 border-b"},pl=u("h2",{class:"text-2xl font-bold"},"Online Payment",-1),hl=["innerHTML"],fl=["src"],vl={key:1,class:"bg-emerald-200 text-emerald-900 p-2 m-2 rounded-lg flex items-center gap-2"},ml=["innerHTML"],yl={__name:"ProweaverForms",props:{value:{type:String},email:{type:String},phone:{type:String},service:{type:String},onsuccess:{type:Function},onclose:{type:Function}},setup(s){const n=s,a=O(!1),b=O(J.baseUrl.replace("/pw-bookingapp/api/","")+`/wp-content/plugins/proweaverforms/forms/bookingapp-payment.php?value=${n.value??""}&phone=${n.phone??""}&email=${n.email??""}&service=${n.service??""}`);function t(){n.onclose!=null&&n.onclose()}window.onmessage=v=>{if(!y(v.data))return;const p=JSON.parse(v.data);p.msg==null||p.msg!="bookingapp-payment-successful"||(a.value=!0,n.onsuccess!=null&&n.onsuccess(p.transaction_id))};function y(v){try{return JSON.parse(v),!0}catch{return!1}}return(v,p)=>(r(),d("div",null,[u("div",dl,[u("div",cl,[u("div",ul,[pl,u("button",{class:"bg-black text-white flex justify-center items-center h-[30px] rounded-full",onClick:t},[u("i",{innerHTML:o(re).close},null,8,hl)])]),a.value?(r(),d("div",vl,[u("i",{innerHTML:o(re).check},null,8,ml),D(" Payment Successful. You may now close this pop-up... ")])):(r(),d("iframe",{key:0,class:"w-full h-[calc(100%_-_60px)]",src:b.value},null,8,fl))])])]))}},gl=["data-page-index"],bl={class:"pwfv-header"},_l={key:0,class:"pwfv-body"},wl={key:0,class:"pwfv-navigation"},xl=["onClick"],kl=st('<div class="pwfv-holidays"><h2>Federal Holidays 2023</h2><div class="pwfv-holidays-table"><div>Date</div><div>Federal holiday</div><div>January 1, 2023</div><div>New Year&#39;s Day</div><div>January 2, 2023</div><div>New Year&#39;s Day (observed)</div><div>January 16, 2023 </div><div>Martin Luther King Day</div><div>February 20, 2023 </div><div>Presidents&#39; Day</div><div>May 29, 2023</div><div>Memorial Day</div><div>June 19, 2023</div><div>Juneteenth</div><div>July 4, 2023</div><div>Independence Day</div><div>September 4, 2023 </div><div>Labor Day</div><div>October 9, 2023</div><div>Columbus Day</div><div>November 10, 2023</div><div>Veterans Day (observed)</div><div>November 11, 2023</div><div>Veterans Day</div><div>November 23, 2023</div><div>Thanksgiving Day</div><div>December 25, 2023</div><div>Christmas Day</div></div></div>',1),Sl={key:0,class:"pwfv-required-reminder"},Cl={class:"pwfv-maingrid-1"},El={class:"pwfv-fielditem"},Ol={key:0},Tl={class:"pwfv-fieldlabel"},Il=u("span",null,"*",-1),Dl={key:1},Fl={class:"pwfv-fieldlabel"},ql=u("span",null,"*",-1),Rl=["innerHTML"],Ml={key:3},Pl={class:"pwfv-fieldlabel"},Al={key:0},Ll={key:4},Nl=["for"],Bl={key:0},jl={key:5},Vl={key:1,class:"pwfv-maingrid-2"},zl={key:0},Hl={class:"pwfv-fieldlabel"},Jl=u("span",null,"*",-1),$l={key:1},Yl={class:"pwfv-fieldlabel"},Wl=u("span",null,"*",-1),Ul=["innerHTML"],Gl={key:3},Kl={class:"pwfv-fieldlabel"},Zl={key:0},Ql={key:4},Xl=["for"],es={key:0},ts={key:5},ls={key:2,class:"pwfv-errormsg"},ss={class:"pwfv-finalfields"},as={class:"pwfv-recaptcha-parent hidden"},is=["data-sitekey"],ns=["innerHTML"],os={key:0,style:{"font-size":"inherit"}},rs={key:1,style:{"font-size":"inherit"}},ds=["innerHTML"],cs=["disabled"],us={key:1,class:"pwfv-success"},ps={class:"pwfv-success-box"},hs={class:"pwfv-success-checkmark"},fs=["innerHTML"],vs={__name:"FormView",props:{form:{type:Object},page:{default:0,type:Number}},setup(s){const n=s;let a=O("");function b(l){return window.location.hostname=="127.0.0.1"?`${window.location.protocol}//${window.location.hostname}:${window.location.port}/pw-bookingapp/admin/`:`${window.location.protocol}//${window.location.hostname}/pw-bookingapp/admin/`}J.get(b()+"/constants.json").then(l=>{a.value=l.data.recaptcha_sitekey;let i=setInterval(()=>{if(document.querySelector(".g-recaptcha")!=null){try{clearInterval(i),grecaptcha.render("recaptcha",{sitekey:a.value,callback:function(){}}),window.parent.document.getElementById("pwform").style.height=document.body.offsetHeight+"px"}catch{}t.value.declare.paypalClientID!=""&&t.value.declare.paypalClientID!=null&&Be.init(t.value.declare.paypalClientID,t.value.declare.paypalCurrency,()=>{ze.value=!0},t.value.declare.paypalEmail)}},100)});let t=O(null),y=O(0),v=O(0),p=O(null),S=O([]),P=O([]),w=O([]),M=O([]),I=O([]),z=O([]),U=O(1),de=O(!1),ze=O(!1),fe=O(!1),ve="",Z=O(null),te=O({name:"",phone:""}),$=O({}),Y=O({}),X=O(!1),A=Fe({header:"Scheduler Error",body:"asdsad",buttons:[],type:"neutral",duration:2e3,show:!1}),L=Fe({opened:!1,active:!1,trans_id:""}),k=se(()=>{let l={};if(t.value!=null)return t.value.pages.forEach(i=>i.page_fields.forEach(e=>l[e.id]=e)),l}),He=se(()=>{let l={};if(t.value!=null)return t.value.pages.forEach(i=>{i.page_fields.forEach(e=>{e.content_type!="text"&&(z.value.includes(e.id)||(e.required||e.content_type=="rbfield"&&!z.value.includes(e.id)||e.content_type=="scheduler"||e.hidden===!1)&&(l[e.id]=["rbfield","scheduler"].includes(e.content_type)?e.text:e.label))})}),l});const N=se(()=>(U.value=t.value.pages[y.value].page_columns,t.value.pages[y.value]));let me=se(()=>{let l={};if(t.value!=null)return N.value.page_fields.forEach(i=>{i.content_type!="text"&&(z.value.includes(i.id)||(i.required||i.content_type=="rbfield"&&!z.value.includes(i.id)||i.content_type=="scheduler"||i.hidden===!1)&&(l[i.id]=["rbfield","scheduler"].includes(i.content_type)?i.text:i.label))}),l});oe(()=>y.value,()=>{M.value=[],ce(),Re("#online_payment").then(l=>{l.onclick=()=>{L.opened=!0}}),L.trans_id!=""&&(k.value["ll2fs3gs-0.h5j1ryr6az"].required=!1,k.value["ll2fs3gs-0.h5j1ryr6az"].hidden=!0,k.value["ll2pjm04-0.fhn8mzlt3k"].styles="background:#bbf7d0;color:#064e3b;font-weight:bold;text-align:center;padding:5px 10px;margin:20px 0;")});function ce(){N.value.page_fields.forEach((l,i)=>{(l.content_type=="rbfield"||l.content_type=="scheduler"||l.required)&&(w.value.push(l.id),l.content_type=="rbfield"||l.content_type=="scheduler"?M.value.push(l.text):M.value.push(l.label),P.value.push({id:l.id,label:l.label??l.text}))})}function ye(l){let i=S.value.findIndex(e=>e.id=="default_services");if(k.value.default_services.value="",k.value.default_services.value=l.book_schedule_service,Z.value=l.book_schedule_service,k.value.default_scheduler_date==null?(t.value.pages[0].page_fields.unshift({id:"default_scheduler_date",content_type:"text",styles:"display:none",text:"Select Location",value:l.book_schedule_date,hidden:!0}),t.value.pages[0].page_fields.unshift({id:"default_scheduler_timestart",content_type:"text",styles:"display:none",text:"Select Location",value:l.book_schedule_timestart,hidden:!0}),t.value.pages[0].page_fields.unshift({id:"default_scheduler_timeend",content_type:"text",styles:"display:none",text:"Select Location",value:l.book_schedule_timeend,hidden:!0})):(k.value.default_scheduler_date.value=l.book_schedule_date,k.value.default_scheduler_timestart.value=l.book_schedule_timestart,k.value.default_scheduler_timeend.value=l.book_schedule_timeend),i==-1){S.value.push({id:"default_services",label:k.value.default_services.text,value:l.book_schedule_service});return}S.value[i]={id:"default_services",label:k.value.default_services.text,value:l.book_schedule_service}}function ge(l,i,e,c){W(l,i),c.options.paypal_value_basis=="service-based"&&t.value.pages.forEach((h,_)=>{let m=h.page_fields.findIndex(x=>x.content_type=="rbfield"&&x.endpoint.includes("services"));m!=-1&&(t.value.pages[_].page_fields[m].disabledByPayment=!0,t.value.pages[_].page_fields[m].readonly=!0)})}function Je(){let l=new URLSearchParams(window.location.search);if(l.get("form_id")==null||n.form!=null){n.form==null?t.value=St:t.value=n.form;let e=document.createElement("style");e.id="pwfv-customcss",e.textContent=t.value.design.css??Me(t.value.design.primaryColor,t.value.design.pagenavDesign),document.getElementById("pwfv-customcss")!=null&&document.getElementById("pwfv-customcss").remove(),document.body.appendChild(e),ce(),window.onresize=()=>le(),le(),be();return}let i=l.get("form_id");J.post("forms/fetch?book_form_id="+i).then(e=>{if(e.data==null||!e.data.success)return;t.value=JSON.parse(e.data.result[0].book_form_json);let c=document.createElement("style");c.id="pwfv-customcss",c.textContent=t.value.design.css??Me(t.value.design.primaryColor,t.value.design.pagenavDesign),document.getElementById("pwfv-customcss")!=null&&document.getElementById("pwfv-customcss").remove(),document.body.appendChild(c),ce(),window.onresize=()=>le(),le(),be()})}function be(){t.value.declare.notifEmails==null||t.value.declare.notifEmails.length==0||J.post("notification/fetch").then(l=>{let i=[];l.data.result!=null&&(i=l.data.result);let e=[];t.value.declare.notifEmails.forEach((c,h)=>{i.findIndex(m=>m.book_email_address==c)==-1&&e.push(h)}),e.forEach(c=>{t.value.declare.notifEmails.splice(c,1)})})}function _e(l){return U.value==1&&l==1?N.value.page_fields:U.value==1&&l==2?[]:N.value.page_fields.filter(i=>i.column==l)}function we(l){k.value[l].required=!1,z.value.push(l)}function xe(l){k.value[l.id].required=!1}function ke(l){k.value[l.id].required=!0}function F(l){return k.value[l].value}function $e(l,i,e,c=[],h=2e3){A.header=l,A.body=i,A.type=e,A.buttons=c,A.duration=h,A.show=!0}function W(l,i){let e=S.value.findIndex(_=>_.id==l.id);if(l.id=="default_services"){Z.value=i;return}l.value=i,t.value.declare.nameIndex==l.id?te.value.name=i:t.value.declare.phoneIndex==l.id&&(te.value.phone=i),l.content_type=="field"&&l.type=="email"&&(l.useemail==="true"||l.useemail===!0)&&!["",null].includes(i)&&(ve=i),l.id=="ll2fs3gs-0.h5j1ryr6az"&&i=="Yes"&&(L.opened=!0);function c(_,m){return m==""||m==null?m:_=="date"?K("%lm %d, %y",m):_=="time"?K("%h:%I%a","2023-05-01 "+m):m}e==-1?S.value.push({id:l.id,label:l.content_type=="field"?l.label:l.text,value:c(l.type,i)}):S.value[e]={id:l.id,label:l.content_type=="field"?l.label:l.text,value:c(l.type,i)},t.value.conditionals.split(" :break;").forEach(async _=>{if(_=_.trim(),_==""||_.match(/^\s+$/g))return;let m=Ce(await Oe(_.split("?")[0].trim())),x=Te(_.split("?")[1].trim().split(" :;").map(H=>H.trim()));_.split("?")[0].trim().includes(l.id)&&Ie(_.split("?")[0].trim(),x,Ee(m))}),setTimeout(()=>{const _=JSON.parse(JSON.stringify(Y.value));for(let m in _)for(let x in _[m]){if(x=="value"){let H=S.value.findIndex(E=>E.id==m);H==-1?S.value.push({id:m,label:k.value[m].content_type=="field"?k.value[m].label:k.value[m].text,value:_[m][x]}):S.value[H]={id:m,label:k.value[m].content_type=="field"?k.value[m].label:k.value[m].text,value:_[m][x]}}k.value[m][x]=_[m][x]}},10),Y.value={}}he(async()=>{Je(),n.page!=0&&(y.value=n.page),await qe(()=>k.value!=null),await qe(()=>Object.keys(k.value).length!=0),t.value.conditionals.split(" :break;").forEach(async i=>{if(i=i.trim(),i==""||i.match(/^\s+$/g))return;let e=Ce(await Oe(i.split("?")[0].trim())),c=Te(i.split("?")[1].trim().split(" :;").map(_=>_.trim())),h=i.split("?")[0].trim();$.value[h]==null&&($.value[h]={},c.forEach(_=>{$.value[h][_.field]==null&&($.value[h][_.field]={}),$.value[h][_.field][_.prop]=k.value[_.field][_.prop]})),Ie(i.split("?")[0].trim(),c,Ee(e))}),Re("#online_payment").then(i=>{i.onclick=()=>{L.opened=!0}})});function ue(l,i=null){if(I.value=[],Object.keys(me.value).length>0&&(l>=1||i!=null&&i>y.value))for(let e in me.value){let c=k.value[e];if(typeof c.value=="checkbox-group"){if(c.value=JSON.parse(JSON.stringify(c.value)),c.value==null||c.value.length==0){let h=c.content_type=="field"?c.label:c.text;I.value.push({id:c.id,label:h==" "?f.placeholder:h})}continue}if(["",null,[],void 0].includes(c.value)){let h=c.content_type=="field"?c.label:c.text;I.value.push({id:c.id,label:h==" "?c.placeholder:h})}}if(!I.value.length){if(i!=null){if(i>v.value+1)return;y.value=i,y.value>v.value&&(v.value=y.value);return}y.value+l>v.value+1||(y.value+=l,y.value>v.value&&(v.value=y.value))}}function Ye(){X.value=!0,I.value=[];for(let l in He.value){let i=k.value[l];if(typeof i.value=="checkbox-group")return i.value=JSON.parse(JSON.stringify(i.value)),!(i.value==null||i.value.length==0);if(["",null,[],void 0].includes(i.value)){let e=i.content_type=="field"?i.label:i.text;I.value.push({id:i.id,label:e==" "?i.placeholder:e})}}if(I.value.length>0){X.value=!1;return}if(k.value["ll2fs3gs-0.h5j1ryr6az"].value=="Yes"&&L.trans_id==""){$e("Online Payment Required","Please complete the payment to continue. Or you may close this window and select No to `Pay Ahead of Time    `","danger"),X.value=!1;return}L.trans_id!=""&&(S.value.push({id:"ll2fs3gs-0.h5j1ryr6az",label:`Payment Option Is Available!
            You can pay by clicking:
            "Yes" for Credit Card and Copay (Copayment)
            "Yes, thru Zelle" for Copay (Copayment)
            "No" when using Insurance Billing`,value:"Yes"}),S.value.push({id:"transaction-0.payment",label:"Payment Transaction ID",value:L.trans_id})),S.value.forEach((l,i)=>{l.id=="ll2fs3gs-0.h5j1ryr6az"&&(S.value[i].label=`Payment Option Is Available!
        You can pay by clicking:
        "Yes" for Credit Card and Copay (Copayment)
        "Yes, thru Zelle" for Copay (Copayment)
        "No" when using Insurance Billing`)}),J.post("appointments/create",null,{form_receivers:JSON.stringify(t.value.declare.notifEmails),book_appointment_locationname:F("default_location")??"",book_appointment_servicesname:F("default_services")??"",book_appointment_worker:F("default_worker")??"",book_appointment_scheduleid:F("default_scheduler")??"",book_appointment_name:te.value.name,book_appointment_phone:te.value.phone,book_appointment_email:ve,book_appointment_custominputs:JSON.stringify(S.value),book_appointment_status:1,book_appointment_created_at:at("%y-%M-%D %H:%I:%S")}).then(l=>{if(l.data==null||!l.data.success){alert("Something went wrong! You may contact the website admin and inform them about this problem. Your feedback will be appreciated!");return}X.value=!1,de.value=!0,window.location.reload()})}async function le(){U.value=N.value.page_columns;const l=()=>{document.getElementById("pwfv-parent").dataset.responsive="",document.getElementById("pwfv-parent").offsetWidth<=400&&(document.getElementById("pwfv-parent").dataset.responsive=document.getElementById("pwfv-parent").dataset.responsive+"r400 "),document.getElementById("pwfv-parent").offsetWidth<=600&&(document.getElementById("pwfv-parent").dataset.responsive=document.getElementById("pwfv-parent").dataset.responsive+"r600 "),document.getElementById("pwfv-parent").offsetWidth<=800&&(document.getElementById("pwfv-parent").dataset.responsive=document.getElementById("pwfv-parent").dataset.responsive+"r800 ",U.value=1),document.getElementById("pwfv-parent").offsetWidth<=1e3&&(document.getElementById("pwfv-parent").dataset.responsive=document.getElementById("pwfv-parent").dataset.responsive+"r1000 "),document.getElementById("pwfv-parent").offsetWidth<=1200&&(document.getElementById("pwfv-parent").dataset.responsive=document.getElementById("pwfv-parent").dataset.responsive+"r1200 "),document.getElementById("pwfv-parent").offsetWidth<=1400&&(document.getElementById("pwfv-parent").dataset.responsive=document.getElementById("pwfv-parent").dataset.responsive+"r1400 "),window.parent.document.getElementById("pwform")!=null&&new ResizeObserver(()=>{window.parent.document.getElementById("pwform").style.width="100%",window.parent.document.getElementById("pwform").style.overflow="hidden",window.parent.document.getElementById("pwform").style.border="none",window.parent.document.getElementById("pwform").style.height=document.body.offsetHeight<500?500:document.body.offsetHeight+"px"}).observe(document.body)};if(document.getElementById("pwfv-parent")==null){let i=setInterval(()=>{document.getElementById("pwfv-parent")!=null&&(clearInterval(i),l())},100);return}l()}function Se(l){let i=N.value.page_fields.findIndex(e=>e.content_type=="rbfield"&&e.endpoint.includes("services"));if(i!=-1){if(N.value.page_fields[i].disabledByPayment){N.value.page_fields[i].readonly=!0;return}l?N.value.page_fields[i].readonly=!0:N.value.page_fields[i].readonly=!1}}function Ce(l){if(["",null,void 0].includes(l))return;const i=[];let e=l.match(/\s+\|\|\s+|\s+&&\s+/g);l=l.split(/\s+\|\|\s+|\s+&&\s+/g);const c=/(==|!=|>|<|>=|<=|in_array)/g;for(let h=0;h<l.length;h++){let m=l[h].split(c),x=m[0].trim();const H=m[1].trim();let E=m[2].trim();x.startsWith("(")&&x.endsWith(")")&&(x=x.slice(1,-1),x=Number(x)),E.startsWith("(")&&E.endsWith(")")?(E=E.slice(1,-1),E=Number(E)):E.startsWith("{")&&E.endsWith("}")?E=E.slice(1,-1).split(",").map(q=>q.trim()):E=E.trim(),x.startsWith("[")&&x.endsWith("]")&&(x=x.slice(1,-1),x=k.value[x]!=null?k.value[x].value:""),i.push({leftOperand:x,operator:H,rightOperand:E})}return{conditions:i,logicalOperators:e}}function Ee(l){const{conditions:i,logicalOperators:e}=l;let c=null,h=0;for(const _ of i){const{leftOperand:m,operator:x,rightOperand:H}=_;let E=m;typeof E=="string"&&!isNaN(E)&&(E=Number(E));let q=H;typeof q=="string"&&!isNaN(q)&&(q=Number(q));let B;if(m!="")switch(x){case"!=":B=E!=q;break;case">":B=E>q;break;case"<":B=E<q;break;case">=":B=E>=q;break;case"<=":B=E<=q;break;case"==":B=E==q;break;case"in_array":let pe=m;typeof m!="string"&&(pe=String(pe)),B=q.includes(pe);break;default:B=!1;break}else B=!1;c!=null?(e[h]==" || "&&(c=c||B),e[h]==" && "&&(c=c&&B),h++):c=B}return c}async function Oe(l){return new Promise(i=>{setTimeout(()=>{i(l.replace(/\[(\w+)\]/g,(e,c)=>k.value[c].value))},10)})}function Te(l){function i(h){const _=["="];let m="";const x=[];for(let E=0;E<h.length;E++){const q=h[E];x.length===0?m.match(/\[[a-zA-Z0-9.\-_]+\]/g)?(x.push(m),m=""):m+=q:_.includes(q)?(m!==""&&(x.push(m.trim()),m=""),x.push(q)):m+=q}m!==""&&(x.push(m.trim()),m="");const H=h.slice(x.join("").length).trim();return H!==""&&x.push(H),x}function e(h){return i(h).filter(_=>_.trim()!=="")}let c=[];return l.forEach(h=>{let _=e(h),m=_[0].startsWith("[")&&_[0].endsWith("]")?_[0].slice(1,-1):_[0];c.push({field:m,prop:_[1].trim(),value:_[3].trim()})}),c}function We(l){return l.startsWith("[")&&l.endsWith("]")?k.value[l.substring(1,l.length-1)]==null?l:F(l.substring(1,l.length-1)):l==null||l==null?l:l.match(/^[0-9]+$/g)!=null?parseInt(l):l.match(/^[0-9]+.[0-9]+$/g)?parseFloat(l):l=="true"?!0:l=="false"?!1:l}function Ie(l,i,e){if(e)i.forEach(c=>{Y.value[c.field]==null&&(Y.value[c.field]={}),Y.value[c.field][c.prop]=We(c.value)});else for(let c in $.value[l])for(let h in $.value[l][c]){if(Y.value[c]==null&&(Y.value[c]={}),k.value[c][h]!=$.value[l][c][h])return;Y.value[c][h]==null&&(Y.value[c][h]=$.value[l][c][h])}}function Ue(){document.getElementById("online_payment")!=null&&(document.getElementById("online_payment").style.display="none")}return(l,i)=>(r(),d(R,null,[o(L).opened&&o(L).trans_id==""?(r(),lt(yl,{key:0,onclose:()=>{o(L).opened=!1},onsuccess:e=>{o(L).trans_id=e,o(L).active=!0,Ue()}},null,8,["onclose","onsuccess"])):g("",!0),j(je,{header:o(A).header,body:o(A).body,buttons:o(A).buttons,type:o(A).type,duration:o(A).duration,show:o(A).show,onDismiss:i[0]||(i[0]=e=>o(A).show=!1),onOnResult:i[1]||(i[1]=e=>l.alertResult=e)},null,8,["header","body","buttons","type","duration","show"]),o(t)!=null?(r(),d("div",{key:1,id:"pwfv-parent",ref_key:"formElement",ref:p,"data-responsive":"","data-page-index":o(y)},[u("div",bl,C(o(t).form_title),1),o(de)?g("",!0):(r(),d("div",_l,[o(t).pages.length>1?(r(),d("div",wl,[(r(!0),d(R,null,V(o(t).pages,(e,c)=>(r(),d("div",{class:T(["pwfv-navigation-item",{active:o(y)==c,done:o(v)>c}]),key:c,onClick:h=>ue(null,c)},[u("span",null,C(o(v)>c?"✓":c+1),1),D(" "+C(e.page_title),1)],10,xl))),128)),kl])):g("",!0),u("div",{class:T(["pwfv-maingrid",{"two-cols":o(N).page_columns==2}])},[o(w).length>0?(r(),d("p",Sl,"Required Fields are marked with (*)")):g("",!0),u("div",Cl,[(r(!0),d(R,null,V(_e(1),(e,c)=>Q((r(),d("div",El,[e.content_type=="rbfield"&&!o(z).includes(e.id)?(r(),d("div",Ol,[u("label",Tl,[D(C(e.text)+" ",1),Il]),j(Ae,{endpoint:e.endpoint,based:e.based,type:e.type,value:F(e.id),readonly:e.readonly,onOnResult:h=>W(e,h),onOnEmpty:h=>we(e.id)},null,8,["endpoint","based","type","value","readonly","onOnResult","onOnEmpty"])])):g("",!0),e.content_type=="scheduler"?(r(),d("div",Dl,[u("label",Fl,[D(C(e.text)+" ",1),ql]),j(Pe,{schedule:F(e.id),serviceSelect:o(Z),onOnFetch:i[2]||(i[2]=h=>Se(h)),onSelectedService:i[3]||(i[3]=h=>ye(h)),onOnResult:h=>W(e,h)},null,8,["schedule","serviceSelect","onOnResult"])])):g("",!0),e.content_type=="text"?(r(),d("div",{key:2,innerHTML:e.text,style:ne(e.styles)},null,12,Rl)):g("",!0),e.content_type=="field"&&!["checkbox","paypal"].includes(e.type)?(r(),d("div",Ml,[u("label",Pl,[D(C(e.label)+" ",1),e.required&&e.label!=" "?(r(),d("span",Al,"*")):g("",!0)]),j(ae,{type:e.type,name:e.name,columns:e.grid,readonly:e.readonly,required:e.required,placeholder:e.placeholder,values:e.values,select:e.type=="checkbox-group"?F(e.id):null,options:e.options,index:e.index,value:F(e.id),onOnResult:h=>W(e,h)},null,8,["type","name","columns","readonly","required","placeholder","values","select","options","index","value","onOnResult"])])):g("",!0),e.content_type=="field"&&e.type=="checkbox"?(r(),d("div",Ll,[j(ae,{type:e.type,name:e.name,columns:e.grid,readonly:e.readonly,required:e.required,placeholder:e.placeholder,values:e.values,select:e.type=="checkbox-group"?F(e.id):null,options:e.options,index:e.index,value:F(e.id),onOnResult:h=>W(e,h)},null,8,["type","name","columns","readonly","required","placeholder","values","select","options","index","value","onOnResult"]),u("label",{for:e.name,class:"pwfvf-checkbox-label"},[D(C(e.label)+" ",1),e.required?(r(),d("span",Bl,"*")):g("",!0)],8,Nl)])):g("",!0),e.content_type=="field"&&e.type=="paypal"&&!o(fe)?(r(),d("div",jl,[j(Le,{service:o(Z),fieldData:JSON.parse(JSON.stringify(e)),paid:F(e.id),currency:o(t).declare.paypalCurrency,paymentFunc:ge,paymentFuncParams:[e.name,e.label,e],onOnEmpty:()=>xe(e),onOnLoaded:()=>ke(e)},null,8,["service","fieldData","paid","currency","paymentFuncParams","onOnEmpty","onOnLoaded"])])):g("",!0)],512)),[[ee,e!=null&&(e.hidden==null||e.hidden==!1)]])),256))]),o(N).page_columns==2?(r(),d("div",Vl,[(r(!0),d(R,null,V(_e(2),(e,c)=>Q((r(),d("div",{class:"pwfv-fielditem",key:c},[e.content_type=="rbfield"&&!o(z).includes(e.id)?(r(),d("div",zl,[u("label",Hl,[D(C(e.text)+" ",1),Jl]),j(Ae,{endpoint:e.endpoint,based:e.based,type:e.type,value:F(e.id),readonly:e.readonly,onOnResult:h=>W(e,h),onOnEmpty:h=>we(e.id)},null,8,["endpoint","based","type","value","readonly","onOnResult","onOnEmpty"])])):g("",!0),e.content_type=="scheduler"?(r(),d("div",$l,[u("label",Yl,[D(C(e.text)+" ",1),Wl]),j(Pe,{schedule:F(e.id),service:o(Z),onOnFetch:i[4]||(i[4]=h=>Se(h)),onSelectedService:i[5]||(i[5]=h=>ye(h)),onOnResult:h=>W(e,h)},null,8,["schedule","service","onOnResult"])])):g("",!0),e.content_type=="text"?(r(),d("div",{key:2,innerHTML:e.text,style:ne(e.styles)},null,12,Ul)):g("",!0),e.content_type=="field"&&!["checkbox","paypal"].includes(e.type)?(r(),d("div",Gl,[u("label",Kl,[D(C(e.label)+" ",1),e.required?(r(),d("span",Zl,"*")):g("",!0)]),j(ae,{type:e.type,name:e.name,columns:e.grid,readonly:e.readonly,required:e.required,placeholder:e.placeholder,values:e.values,select:e.type=="checkbox-group"?F(e.id):null,options:e.options,index:e.index,value:F(e.id),onOnResult:h=>W(e,h)},null,8,["type","name","columns","readonly","required","placeholder","values","select","options","index","value","onOnResult"])])):g("",!0),e.content_type=="field"&&e.type=="checkbox"?(r(),d("div",Ql,[j(ae,{type:e.type,name:e.name,columns:e.grid,readonly:e.readonly,required:e.required,placeholder:e.placeholder,values:e.values,select:e.type=="checkbox-group"?F(e.id):null,options:e.options,index:e.index,value:F(e.id),onOnResult:h=>W(e,h)},null,8,["type","name","columns","readonly","required","placeholder","values","select","options","index","value","onOnResult"]),u("label",{for:e.name,class:"pwfvf-checkbox-label"},[D(C(e.label)+" ",1),e.required?(r(),d("span",es,"*")):g("",!0)],8,Xl)])):g("",!0),e.content_type=="field"&&e.type=="paypal"&&!o(fe)?(r(),d("div",ts,[j(Le,{service:o(Z),fieldData:JSON.parse(JSON.stringify(e)),paid:F(e.id),currency:o(t).declare.paypalCurrency,paymentFunc:ge,paymentFuncParams:[e.name,e.label,e],onOnEmpty:()=>xe(e),onOnLoaded:()=>ke(e)},null,8,["service","fieldData","paid","currency","paymentFuncParams","onOnEmpty","onOnLoaded"])])):g("",!0)])),[[ee,e!=null&&(e.hidden==null||e.hidden==!1)]])),128))])):g("",!0),o(I).length>0?(r(),d("div",ls,[D(" The following field/s are required before you proceed: "),(r(!0),d(R,null,V(o(I),(e,c)=>(r(),d("strong",{key:c},C(e.label)+C(c!=o(I).length-1?", ":" "),1))),128))])):g("",!0),u("div",ss,[Q(u("div",as,[Q(u("div",{id:"recaptcha",class:"g-recaptcha","data-sitekey":o(a)},null,8,is),[[ee,o(y)==o(t).pages.length-1]])],512),[[ee,!1]]),o(y)!=0?(r(),d("button",{key:0,onClick:i[6]||(i[6]=e=>ue(-1))},[u("i",{innerHTML:o(re).arrowLeft},null,8,ns),D(" Prev")])):g("",!0),o(y)!=o(t).pages.length-1?(r(),d("button",{key:1,onClick:i[7]||(i[7]=e=>ue(1))},[o(y)==0?(r(),d("span",os,"Click Here To Book Your Appointment With Dr. Cecil Poe")):(r(),d("span",rs,"Next")),o(y)!=0?(r(),d("i",{key:2,innerHTML:o(re).arrowRight},null,8,ds)):g("",!0)])):g("",!0),o(y)==o(t).pages.length-1?(r(),d("button",{key:2,onClick:i[8]||(i[8]=e=>Ye()),disabled:o(X),class:"pwfv-submit"},"Submit",8,cs)):g("",!0)])],2)])),o(de)?(r(),d("div",us,[u("div",ps,[u("div",hs,[u("i",{innerHTML:o(it).check},null,8,fs)]),D(" Your entry has been successfully submitted. ")])])):g("",!0)],8,gl)):g("",!0)],64))}},ws=Object.freeze(Object.defineProperty({__proto__:null,default:vs},Symbol.toStringTag,{value:"Module"}));export{ws as F,vs as _,bs as a,Me as b,St as f,_s as p};
