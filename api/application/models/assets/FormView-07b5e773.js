import{_ as Me,o as d,c,n as F,d as h,a as f,x as le,F as B,k as N,j as q,t as w,p as Ne,f as Ve,H as ze,g as L,D as U,r as S,C as oe,B as de,u,P as Re,G as Z,I as Ee,w as Q,E as X,q as V}from"./index-703faf11.js";import{i as qe,a as He}from"./icons-937f4540.js";const $e={props:{type:String,name:String,placeholder:String,options:Object,columns:String,value:null,values:Object,select:Object,readonly:Boolean},emits:["onResult"],data(){return{valueC:"",selectC:[],selectedValue:"",error:"",largest:0,console,loaded:!1,groupTypes:["checkbox-group","radio-group","select"],debounceTimer:null}},watch:{value(){if(this.value==null&&this.type=="select"){if(this.values.length==0)return;this.selectedValue=this.values[0].label,this.valueC=this.values[0].value,this.$emit("onResult",this.values[0].value);return}this.valueC=this.value,this.type=="select"&&this.values.length>0&&this.value!=null&&this.value!=""&&this.values.filter(a=>a.value==this.value)!=null&&(this.selectedValue=this.values.filter(a=>a.value==this.value)[0].label)},values:{handler(a){if(this.type=="select"){if(this.loaded||this.values.length==0||this.value!=""&&this.value!=null||this.values.length==0)return;this.selectedValue=this.values[0].label,this.valueC=this.values[0].value,this.$emit("onResult",this.values[0].value),this.values.forEach(n=>this.largest=this.largest<n.label.length?n.label.length:this.largest)}},deep:!0},valueC(a){this.error==""&&this.$emit("onResult",this.valueC)},select:{handler(a){a!=null&&(this.selectC=a)},deep:!0},selectC:{handler(a){this.selectC!=this.select&&a!=null&&this.$emit("onResult",JSON.parse(JSON.stringify(this.selectC)))},deep:!0}},mounted(){if(this.valueC=this.value,this.json=JSON.stringify(this.form),this.type=="checkbox-group"&&(this.selectC=this.select??[]),this.type=="select"){if(this.values.length==0)return;this.value==null?(this.selectedValue=this.values[0].label,this.valueC=this.values[0].value):(this.selectedValue=this.values.filter(a=>a.value==this.value)[0].label,this.valueC=this.value,this.values.forEach(a=>this.largest=this.largest<a.label.length?a.label.length:this.largest)),this.values.forEach(a=>this.largest=this.largest<a.label.length?a.label.length:this.largest)}},methods:{validate(a){let n=/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/g,s=/^[0-9+()]+[0-9.+()\- ]+[0-9.+()]+$/g,y=/^[0-9]+$|^[0-9]+.[0-9]+$/g,t=/^[0-9]+$|^[0-9]+$/g;if(this.error="",this.type=="email"&&a.match(n)==null&&a!=""){this.error="Email is not in valid format";return}else if(this.type=="telephone"&&a.match(s)==null&&a!=""){this.error="Phone is not in valid format";return}else if(this.type=="number"&&a.match(y)==null&&a!=""){this.error="Number is not in valid format";return}else if(this.type=="integer"&&a.match(t)==null&&a!=""){this.error="Integer must only contain numbers";return}this.error=""},closeAllOpenSelects(){if(this.readonly)return;document.querySelectorAll(".pwfvf-select").forEach(n=>{n.dataset.pwfvf!=this.name&&n.classList.remove("shown")});let a=document.querySelector(`.pwfvf-select[data-pwfvf="${this.name}"]`);a.classList.contains("shown")?a.classList.remove("shown"):a.classList.add("shown")},checkThis(a,n){if(this.options!=null&&this.options.maximum_checks!=0&&this.selectC.length>=this.options.maximum_checks&&n.target.checked){n.target.checked=!1;return}this.selectC.includes(a)?this.selectC.splice(this.selectC.indexOf(a),1):this.selectC.push(a)}}},je=a=>(Ne("data-v-0ec58fa2"),a=a(),Ve(),a),We=["readonly","placeholder","type","value","name"],Ae=["value","placeholder","checked"],Je=["id","checked"],Ye=["for"],Ue=["readonly","id","name","onChange","checked"],Ge=["for"],Ke=["readonly","id","name","checked","onChange"],Ze=["data-pwfvf"],Qe=["innerHTML"],Xe=je(()=>f("i",{class:"pwfvf-select-caret-down"},"▼",-1)),et=["onClick","innerHTML"],tt={key:6,class:"pwfvf-field-error"};function lt(a,n,s,y,t,m){return d(),c("div",{class:F(["pwfvf-custom-field",{"pwfvf-checkbox-input":s.type=="checkbox"}])},[!t.groupTypes.includes(s.type)&&s.type!="textarea"&&s.type!="paypal"&&s.type!="checkbox"?(d(),c("input",{key:0,readonly:s.readonly,placeholder:s.placeholder,type:s.type=="number"||s.type=="integer"?"text":s.type??"text",class:F("pwfvf-"+s.name),value:t.valueC,onBlur:n[0]||(n[0]=p=>{t.valueC=p.target.value,m.validate(t.valueC)}),name:s.name,onChange:n[1]||(n[1]=p=>{s.type=="checkbox"&&(t.valueC=p.target.checked)})},null,42,We)):h("",!0),s.type=="textarea"?(d(),c("textarea",{key:1,value:t.valueC,placeholder:s.placeholder,class:F("pwfvf-"+s.type),onBlur:n[2]||(n[2]=p=>t.valueC=p.target.value),checked:t.valueC},null,42,Ae)):h("",!0),s.type=="checkbox"?(d(),c("label",{key:2,class:F(["pwfvf-checkbox-main",{active:t.valueC==!0}])},[f("input",{id:s.name,type:"checkbox",hidden:"",checked:t.valueC==!0,onChange:n[3]||(n[3]=p=>t.valueC=p.target.checked)},null,40,Je)],2)):h("",!0),s.type=="checkbox-group"?(d(),c("div",{key:3,class:F(["pwfvf-checkbox-group",{"pwcf-readonly":s.readonly}]),style:le({"grid-template-columns":s.columns})},[(d(!0),c(B,null,N(s.values,(p,b)=>(d(),c("label",{key:b,for:s.name+"_"+b,class:F({active:t.selectC!=null&&t.selectC.includes(p.value)})},[q(w(p.label)+" ",1),f("input",{style:{display:"none"},readonly:s.readonly,type:"checkbox",id:s.name+"_"+b,name:s.name+"_"+b,onChange:x=>{m.checkThis(p.value,x)},checked:t.selectC!=null&&t.selectC.includes(p.value)},null,40,Ue)],10,Ye))),128))],6)):h("",!0),s.type=="radio-group"?(d(),c("div",{key:4,class:F(["pwfvf-radio-group",{"pwcf-readonly":s.readonly}]),style:le({"grid-template-columns":s.columns})},[(d(!0),c(B,null,N(s.values,(p,b)=>(d(),c("label",{key:b,for:s.name+"_"+b,class:F({active:t.valueC==p.value})},[q(w(p.label)+" ",1),f("input",{style:{display:"none"},readonly:s.readonly,id:s.name+"_"+b,type:"radio",name:s.name,checked:t.valueC==p.value,onChange:x=>{t.valueC=p.value}},null,40,Ke)],10,Ge))),128))],6)):h("",!0),s.type=="select"?(d(),c("div",{key:5,class:F(["pwfvf-select","pwfvf-select-"+s.name]),onClick:n[4]||(n[4]=(...p)=>m.closeAllOpenSelects&&m.closeAllOpenSelects(...p)),"data-pwfvf":s.name},[f("span",{innerHTML:t.selectedValue},null,8,Qe),Xe,f("div",{class:F(["pwfvf-select-menu",{"pwcf-readonly":s.readonly}])},[(d(!0),c(B,null,N(s.values,(p,b)=>(d(),c("div",{class:F([{active:t.valueC==p.value},"pwfvf-select-option"]),key:b,onClick:x=>{t.loaded=!0,t.valueC=p.value,t.selectedValue=p.label},innerHTML:p.label},null,10,et))),128))],2)],10,Ze)):h("",!0),t.error!=""?(d(),c("span",tt,w(t.error),1)):h("",!0)],2)}const ee=Me($e,[["render",lt],["__scopeId","data-v-0ec58fa2"]]),Ol={text:{content_type:"text",text:"This is a sample text inside the form.",column:2,grid:"1fr 1fr",styles:"text-align:center"},field:{content_type:"field",type:"text",name:"sample_field",label:"Sample Field",value:"",column:2,grid:"1fr 1fr",readonly:!1,required:!0,placeholder:"This is a placeholder",values:[{label:"Sample Label",value:"Sample Value"}],select:[],options:{paypal_value_currency:"USD",paypal_value_basis:"fixed",paypal_value:1},index:"",styles:{}}},Il={page_title:"New Page",page_columns:1,page_fields:[{content_type:"text",text:"Sample Header",column:1,styles:"background-color:#eee;text-align:center;padding:5px;margin-bottom:10px;font-weight:700"},{content_type:"text",text:"This is a sample text inside the form.",column:2,grid:"1fr 1fr",styles:"text-align:center"},{content_type:"field",type:"text",name:"sample_field",label:"Sample Field",value:"",column:2,grid:"1fr 1fr",readonly:!1,required:!0,placeholder:"This is a placeholder",values:[{label:"1",value:1},{label:"1",value:2}],select:[],options:{maximum_checks:null},index:"",styles:{}}]},at={form_title:"Default Form",declare:{paypalClientID:"",paypalCurrency:"USD",notifEmails:[],paypalEmail:"",nameIndex:"default_name",phoneIndex:""},conditionals:"20 in_array {20,50,70,80} && 20 == 20 ? [default_gender].readonly = true",design:{primaryColor:"#446523",pagenavDesign:"row",css:null},pages:[{page_title:"Schedule Selection",page_columns:2,page_fields:[{content_type:"rbfield",id:"default_location",column:2,endpoint:"location/fetch",based:"book_location_name",type:"select",value:"",text:"Select Location"},{content_type:"rbfield",id:"default_worker",column:2,endpoint:"worker/fetch",based:"book_worker_name",type:"select",value:"",text:"Select Worker"},{content_type:"rbfield",id:"default_services",column:2,endpoint:"services/fetch",based:"book_services_name",type:"select",value:"",text:"Select Service"},{content_type:"scheduler",id:"default_scheduler",column:1,text:"Scheduler"}]},{page_title:"Personal Information",page_columns:1,page_fields:[{content_type:"field",id:"default_name",type:"text",name:"name",label:"Name",value:"",column:2,grid:"1fr 1fr",readonly:!1,required:!0,placeholder:"Enter your name here",values:[{label:"1",value:1},{label:"1",value:2}],select:[],options:{maximum_checks:null},index:"",styles:{}},{content_type:"field",id:"default_gender",type:"radio-group",name:"gender",label:"Gender",value:"",column:2,grid:"1fr 1fr",readonly:!1,required:!0,placeholder:"",values:[{label:"Male",value:1},{label:"Female",value:2}],select:[],options:{maximum_checks:null},index:"",styles:{}},{content_type:"field",id:"default_email",type:"email",name:"Email_Address",label:"Email Address",value:"",column:2,grid:"1fr 1fr",readonly:!1,required:!0,placeholder:"Enter your email",values:[{label:"Sample Label",value:"Sample Value"}],select:[],options:{paypal_value_currency:"USD",paypal_value_basis:"fixed",paypal_value:1},index:"",styles:{}}]}]};function A(a){return ze(a).l>50?"#333333":"#ffffff"}function te(a,n){let s=parseInt(a.substring(1,3),16),y=parseInt(a.substring(3,5),16),t=parseInt(a.substring(5,7),16);return s+=n,y+=n,t+=n,s=Math.min(s,255),y=Math.min(y,255),t=Math.min(t,255),"#"+s.toString(16)+y.toString(16)+t.toString(16)}const De=(a,n)=>`:root{
    --pwcss-primary-color: ${a};
    --pwcss-lighter-color: ${te(a,30)};
    --pwcss-lighter2-color: ${te(a,50)};
    --pwcss-contra-color: ${A(a)};
    --pwcss-contra-lighter-color: ${te(A(a),30)};
    --pwcss-contra-darker-color: ${te(A(a),-30)};
    --pwcss-contra2-color: ${A(A(a))};
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
    background: ${A(A(a))};
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




`;const st={emits:["onResult","onFetch","selectedService"],props:{schedule:{type:String},service:{default:"",type:String}},data(){return{title:"",cc:{y:0,m:0,d:0},qd:{y:0,m:0,d:0},calendarBoxes:[],availDates:[],availableSchedules:[],fetching:!1,chosenSchedule:null,scheduleSelection:!1}},watch:{fetching(){this.$emit("onFetch",this.fetching)},async schedule(){if(["",null].includes(this.schedule))return;this.fetching=!0,this.chosenSchedule=this.schedule;let a="schedules/fetchAvailable?book_schedule_id="+this.schedule;this.service!=""&&this.service!=null&&(a+="&book_schedule_service="+this.service);let n=await L.post(a,"default");if(this.scheduleSelection=!1,n.data==null||!n.data.success)return;let s=new Date(n.data.result[0].book_schedule_date);this.cc.y=s.getFullYear(),this.cc.m=s.getMonth(),this.cc.d=s.getDate(),this.qd.y=s.getFullYear(),this.qd.m=s.getMonth(),this.qd.d=s.getDate(),this.fetching=!1,this.fetchScheds().then(()=>{this.buildCalendar()})},service(){this.waitForCondition(()=>this.fetching==!1,()=>{this.fetchScheds()})}},async mounted(){let a=new Date;if(this.cc.y=a.getFullYear(),this.cc.m=a.getMonth(),this.cc.d=a.getDate(),this.qd.y=a.getFullYear(),this.qd.m=a.getMonth(),this.qd.d=a.getDate(),this.buildCalendar(),this.waitForCondition(()=>![void 0,null,""].includes(this.service),()=>this.fetchScheds().then(()=>this.buildCalendar())),this.chosenSchedule=this.schedule,["",null].includes(this.schedule))return;this.fetching=!0;let n="schedules/fetchAvailable?book_schedule_id="+this.schedule;this.service!=""&&this.service!=null&&(n+="&book_schedule_service="+this.service);let s=L.post(n,"default");s.data==null||!s.data.success||(a=new Date(s.data.result[0].book_schedule_date),this.cc.y=a.getFullYear(),this.cc.m=a.getMonth(),this.cc.d=a.getDate(),this.qd.y=a.getFullYear(),this.qd.m=a.getMonth(),this.qd.d=a.getDate(),this.fetching=!1)},methods:{dateFormat:U,waitForCondition(a,n){a()?n():setTimeout(()=>this.waitForCondition(a,n),100)},selectSchedule(a){if(new Date(a.book_schedule_date+" "+a.book_schedule_timestart).getTime()<=new Date().getTime()){alert("Cannot select a finished schedule!");return}if(a.is_full){alert("Your chosen schedule is no longer available as it reached maximum number of bookings.");return}this.chosenSchedule=a.book_schedule_id,this.scheduleSelection=!0,this.$emit("onResult",this.chosenSchedule),this.$emit("selectedService",a.book_schedule_service)},async fetchScheds(){if(this.fetching)return;this.fetching=!0;let a=new Date(this.qd.y,this.qd.m,this.qd.d);this.availDates=[],this.availableSchedules=[];let n=this.service!=""&&this.service!=null?"&service="+this.service:"",s=await L.post(`schedules/availableSchedulesWithinMonth?month=${this.cc.m+1}&year=${this.cc.y}${n}`,"default");s.data!=null&&s.data.success&&s.data.result.forEach(y=>{this.availDates.push(y.book_schedule_date)}),n=this.service!=""&&this.service!=null?"&book_schedule_service="+this.service:"",s=await L.post("schedules/fetchAvailable?book_schedule_date="+U("%y-%M-%D",a.getTime())+n,"default"),s.data!=null&&s.data.success&&(s.data.result.forEach(y=>{y.book_schedule_maxappointment<y.count_appointments?y.schedule_full=!0:y.schedule_full=!1,this.availableSchedules.push(y)}),this.value!=null&&(this.selectedSchedule=this.value)),this.fetching=!1},buildCalendar(){let a=new Date(this.cc.y,this.cc.m,1),n=new Date(this.cc.y,this.cc.m+1,0),s=new Date(this.cc.y,this.cc.m,1).getDay(),y=new Date(this.cc.y,this.cc.m+1,0).getDay();for(a.setDate(a.getDate()-s),n.setDate(n.getDate()+(6-y)),this.calendarBoxes=[];a.getTime()<=n.getTime();){let t=U("%y-%M-%D",a.getTime()),m={date:t,dateNum:a.getDate(),isCurrentMonth:a.getMonth()==this.cc.m,scheds:this.fetchScheds(t),onclick:async p=>{if(this.fetching)return;let b=new Date(p);if(this.qd.y=b.getFullYear(),this.qd.m=b.getMonth(),this.qd.d=b.getDate(),b.getMonth()!=this.cc.m){b=new Date(this.qd.y,this.qd.m,this.qd.d),this.cc.y=b.getFullYear(),this.cc.m=b.getMonth(),this.cc.d=b.getDate(),this.fetchScheds().then(()=>{this.buildCalendar(),this.fetching=!1});return}this.fetching=!0,this.availableSchedules=[];let x=this.service!=""&&this.service!=null?"&book_schedule_service="+this.service:"",C=await L.post("schedules/fetchAvailable?book_schedule_date="+U("%y-%M-%D",b.getTime())+x,"default");C.data!=null&&C.data.success&&(C.data.result.forEach(D=>{D.book_schedule_maxappointment<D.count_appointments?D.schedule_full=!0:D.schedule_full=!1,this.availableSchedules.push(D)}),this.value!=null&&(this.selectedSchedule=this.value)),this.fetching=!1}};this.calendarBoxes.push(m),a.setDate(a.getDate()+1)}this.title=U("%lm %y",new Date(this.cc.y,this.cc.m,this.cc.d).getTime())},nextMonths(a){if(this.fetching)return;let n=new Date(this.cc.y,this.cc.m,this.cc.d);n.setMonth(n.getMonth()+a),a>0&&new Date(this.cc.y,this.cc.m+2,0).getDate()<this.cc.d&&n.setMonth(n.getMonth()-1),a<0&&new Date(this.cc.y,this.cc.m-1,0).getDate()<this.cc.d&&n.setMonth(n.getMonth()+1),this.qd.y=this.cc.y=n.getFullYear(),this.qd.m=this.cc.m=n.getMonth(),this.qd.d=this.cc.d=n.getDate(),this.buildCalendar()}}},it={class:"pwfvf-scheduler"},nt={class:"pwfvf-scheduler-header"},rt={class:"pwfvf-scheduler-dateboxes"},ot=["onClick"],dt={class:"pwfvf-scheduler-availscheds"},ct={key:0,class:"spinner"},ut={key:1,class:"pwfvf-scheduler-availscheds-empty"},pt=["onClick"],ft={key:0},ht={key:1};function vt(a,n,s,y,t,m){return d(),c("div",it,[f("div",nt,[f("button",{onClick:n[0]||(n[0]=p=>m.nextMonths(-1))},"❮"),f("h2",null,w(t.title),1),f("button",{onClick:n[1]||(n[1]=p=>m.nextMonths(1))},"❯")]),f("div",rt,[(d(!0),c(B,null,N(t.calendarBoxes,(p,b)=>(d(),c("div",{onClick:x=>p.onclick(p.date),class:F(["pwfvf-scheduler-datebox",{notCurrentMonth:!p.isCurrentMonth,active:new Date(p.date+" 00:00:00").getTime()==new Date(t.qd.y,t.qd.m,t.qd.d).getTime(),hasSchedule:t.availDates.includes(p.date)}])},[f("span",null,w(p.dateNum),1)],10,ot))),256))]),f("div",dt,[t.fetching?(d(),c("div",ct)):h("",!0),!t.fetching&&t.availableSchedules.length==0?(d(),c("div",ut,"No schedules for this date...")):h("",!0),(d(!0),c(B,null,N(t.availableSchedules,p=>(d(),c("div",{class:F(["pwfvf-scheduler-availscheds-item",{active:t.chosenSchedule==p.book_schedule_id}]),onClick:b=>m.selectSchedule(p)},[f("h2",null,[q(w(p.book_schedule_service)+" ",1),p.is_full?(d(),c("span",ft," FULL")):h("",!0),new Date(p.book_schedule_date+" "+p.book_schedule_timestart).getTime()<=new Date().getTime()?(d(),c("span",ht," DONE")):h("",!0)]),f("small",null,w(m.dateFormat("%h:%I%a",p.book_schedule_date+" "+p.book_schedule_timestart))+" - "+w(m.dateFormat("%h:%I%a",p.book_schedule_date+" "+p.book_schedule_timeend)),1)],10,pt))),256))])])}const Oe=Me(st,[["render",vt]]),mt=["data-pwfvf"],gt=["innerHTML"],yt=f("i",{class:"pwfvf-rbfields-select-caret-down"},"▼",-1),wt={class:"pwfvf-rbfields-select-menu"},bt=["onClick"],_t={key:1,class:"pwfvf-rbfields-radio"},xt=["onClick"],kt={key:0,class:"pwfvf-rbfields-radio-option-price"},Ie={__name:"RequestBindedFields",props:{endpoint:{default:"",type:String},based:{default:"",type:String},readonly:{default:!1,type:Boolean},type:{default:"",type:String},value:{default:"",type:String}},emits:["onResult","onEmpty","onResultInfo"],setup(a,{emit:n}){const s=a;let y=S(""),t=S(null),m=S([]),p=S(s.endpoint.split("/")[0]);oe(()=>y.value,()=>{n("onResult",y.value),n("onResultInfo",m.value.filter(C=>C[s.based]==y.value)[0])});function b(){document.querySelectorAll(".pwfvf-rbfields-select").forEach(D=>{D.dataset.pwfvf!=p.value&&D.classList.remove("shown")});let C=document.querySelector(`.pwfvf-rbfields-select[data-pwfvf="${p.value}"]`);C.classList.contains("shown")?C.classList.remove("shown"):C.classList.add("shown")}de(()=>{L.post(s.endpoint).then(C=>{if(C.data==null||!C.data.success){n("onEmpty");return}m.value=C.data.result,["",null].includes(s.value)?(y.value=m.value[0][s.based],t.value=m.value[0]):(y.value=s.value,n("onResultInfo",m.value.filter(D=>D[s.based]==y.value)[0]))})});function x(C){s.readonly||(y.value=C[s.based],t.value=C)}return(C,D)=>(d(),c(B,null,[a.type=="select"?(d(),c("div",{key:0,class:F(["pwfvf-rbfields-select","pwfvf-rbfields-select-"+u(p)]),onClick:b,"data-pwfvf":u(p)},[f("span",{innerHTML:u(y)},null,8,gt),yt,f("div",wt,[(d(!0),c(B,null,N(u(m),(R,M)=>(d(),c("div",{class:F([{active:u(y)==R[u(s).based]},"pwfvf-rbfields-select-option"]),key:M,onClick:z=>x(R)},w(R[u(s).based]),11,bt))),128))])],10,mt)):h("",!0),a.type=="radio"?(d(),c("div",_t,[(d(!0),c(B,null,N(u(m),(R,M)=>(d(),c("div",{class:F([{active:u(y)==R[u(s).based]},"pwfvf-rbfields-radio-option"]),key:M,onClick:z=>x(R)},[f("span",null,[q(w(R[u(s).based])+" ",1),R.book_services_price!=null?(d(),c("span",kt,"("+w("$"+parseFloat(R.book_services_price).toFixed(2))+")",1)):h("",!0)])],10,xt))),128))])):h("",!0)],64))}},St={key:0,class:"pwfv-paypalcont"},Ct={class:"pwfv-paypalcontheader"},Et={class:"pwfv-fieldlabel"},qt=f("small",null,"Payment For:",-1),Dt={key:0,class:"pwfv-paypalrequired"},Ot={key:1,id:"pwfv-paypalparent"},It={key:1,class:"pwfv-paypalcont pwfv-paypalsuccess"},Ft={class:"pwfv-paypalcontheader"},Mt={class:"pwfv-fieldlabel"},Rt=f("small",null,"Payment For:",-1),Fe={__name:"PayPalButtons",props:{service:{default:"",type:String},paid:{default:"",type:String},paymentFunc:{type:Function},paymentFuncParams:{type:Array},currency:{default:"USD",type:String},fieldData:{type:Object}},emits:["onPayment","onLoaded","onEmpty"],setup(a,{emit:n}){const s=a;let y=S({}),t=S(null),m=S(!1);oe(()=>s.service,()=>{p()});function p(){s.service==""||s.service==null||t.value.options.paypal_value_basis=="fixed"||L.post("services/fetch?book_services_name="+s.service).then(x=>{if(y.value=x.data.result[0],console.log(t.value.options.paypal_value),t.value.options.paypal_value=y.value.book_services_price,console.log([0,"",null].includes(t.value.options.paypal_value)&&t.value.options.paypal_value_basis!="fixed"),[0,"",null].includes(t.value.options.paypal_value)&&t.value.options.paypal_value_basis!="fixed"){n("onEmpty");return}else console.log("test"),n("onLoaded");b()})}function b(){m.value=!0,setTimeout(()=>{m.value=!1;let x=t.value.options.paypal_value;Re.mountOn("#pwfv-paypalparent",x,s.currency).then(C=>{let D=s.paymentFuncParams;s.paymentFunc(D[0],D[1],x,D[2])}).catch(C=>{console.assert("Paypal Error:",C)})},10)}return de(()=>{t.value=JSON.parse(JSON.stringify(s.fieldData)),t.value!=null&&t.value.options.paypal_value_basis=="fixed"?b():p()}),(x,C)=>(d(),c(B,null,[["",null].includes(u(s).paid)&&u(t)!=null&&u(t).options.paypal_value!=null&&(u(t).options.paypal_value_basis=="fixed"||u(t).options.paypal_value_basis=="service-based"&&u(y).book_services_price!=null)?(d(),c("div",St,[f("div",Ct,[f("label",Et,[f("h2",null,[qt,q(" "+w(u(t).options.paypal_value_basis=="fixed"?u(t).label:u(s).service),1)])]),f("span",null,w(u(s).currency)+" "+w(parseFloat(u(t).options.paypal_value).toFixed(2)),1)]),u(t).required?(d(),c("span",Dt,"Payment must be received before proceeding.")):h("",!0),u(m)?h("",!0):(d(),c("div",Ot))])):h("",!0),u(t)!=null&&!["",null].includes(u(s).paid)?(d(),c("div",It,[f("div",Ft,[f("label",Mt,[f("h2",null,[Rt,q(" "+w(u(t).options.paypal_value_basis=="fixed"?u(t).label:u(s).service),1)])]),f("span",null,w(u(s).currency)+" "+w(parseFloat(u(t).options.paypal_value).toFixed(2)),1)]),q(" Thank you! Your payment is being processed. ")])):h("",!0)],64))}},Bt={class:"pwfv-header"},Tt={key:0,class:"pwfv-body"},Pt={key:0,class:"pwfv-navigation"},Lt=["onClick"],Nt={key:0,class:"pwfv-required-reminder"},Vt={class:"pwfv-maingrid-1"},zt={class:"pwfv-fielditem"},Ht={key:0},$t={class:"pwfv-fieldlabel"},jt=f("span",null,"*",-1),Wt={key:1},At={class:"pwfv-fieldlabel"},Jt=f("span",null,"*",-1),Yt=["innerHTML"],Ut={key:3},Gt={class:"pwfv-fieldlabel"},Kt={key:0},Zt={key:4},Qt=["for"],Xt={key:0},el={key:5},tl={key:1,class:"pwfv-maingrid-2"},ll={key:0},al={class:"pwfv-fieldlabel"},sl=f("span",null,"*",-1),il={key:1},nl={class:"pwfv-fieldlabel"},rl=f("span",null,"*",-1),ol=["innerHTML"],dl={key:3},cl={class:"pwfv-fieldlabel"},ul={key:0},pl={key:4},fl=["for"],hl={key:0},vl={key:5},ml={key:2,class:"pwfv-errormsg"},gl={class:"pwfv-finalfields"},yl={class:"pwfv-recaptcha-parent hidden"},wl=["data-sitekey"],bl=["innerHTML"],_l=["innerHTML"],xl={key:1,class:"pwfv-success"},kl={class:"pwfv-success-box"},Sl={class:"pwfv-success-checkmark"},Cl=["innerHTML"],El={__name:"FormView",props:{form:{type:Object},page:{default:0,type:Number}},setup(a){const n=a;let s=S("");function y(l){return window.location.hostname=="127.0.0.1"?`${window.location.protocol}//${window.location.hostname}:${window.location.port}/pw-bookingapp/admin/`:`${window.location.protocol}//${window.location.hostname}/pw-bookingapp/admin/`}L.get(y()+"/constants.json").then(l=>{s.value=l.data.recaptcha_sitekey;let i=setInterval(()=>{if(document.querySelector(".g-recaptcha")!=null){try{clearInterval(i),grecaptcha.render("recaptcha",{sitekey:s.value,callback:function(){}}),window.parent.document.getElementById("pwform").style.height=document.body.offsetHeight+"px"}catch{}t.value.declare.paypalClientID!=""&&t.value.declare.paypalClientID!=null&&Re.init(t.value.declare.paypalClientID,t.value.declare.paypalCurrency,()=>{Be.value=!0},t.value.declare.paypalEmail)}},100)});let t=S(null),m=S(0),p=S(0),b=S(null),x=S([]),C=S([]),D=S([]),R=S([]),M=S([]),z=S([]),Y=S(1),ae=S(!1),Be=S(!1),ce=S(!1),ue="",J=S(null),G=S({name:"",phone:""}),H=S({}),$=S({}),E=Z(()=>{let l={};if(t.value!=null)return t.value.pages.forEach(i=>i.page_fields.forEach(e=>l[e.id]=e)),l}),Te=Z(()=>{let l={};if(t.value!=null)return t.value.pages.forEach(i=>{i.page_fields.forEach(e=>{e.content_type!="text"&&(z.value.includes(e.id)||(e.required||e.content_type=="rbfield"&&!z.value.includes(e.id)||e.content_type=="scheduler"||e.hidden===!1)&&(l[e.id]=["rbfield","scheduler"].includes(e.content_type)?e.text:e.label))})}),l});const T=Z(()=>(Y.value=t.value.pages[m.value].page_columns,t.value.pages[m.value]));let pe=Z(()=>{let l={};if(t.value!=null)return T.value.page_fields.forEach(i=>{i.content_type!="text"&&(z.value.includes(i.id)||(i.required||i.content_type=="rbfield"&&!z.value.includes(i.id)||i.content_type=="scheduler"||i.hidden===!1)&&(l[i.id]=["rbfield","scheduler"].includes(i.content_type)?i.text:i.label))}),l});oe(()=>m.value,()=>{R.value=[],se()});function se(){T.value.page_fields.forEach((l,i)=>{(l.content_type=="rbfield"||l.content_type=="scheduler"||l.required)&&(D.value.push(l.id),l.content_type=="rbfield"||l.content_type=="scheduler"?R.value.push(l.text):R.value.push(l.label),C.value.push({id:l.id,label:l.label??l.text}))})}function fe(l){let i=x.value.findIndex(e=>e.id=="default_services");if(E.value.default_services.value=l,J.value=l,i==-1){x.value.push({id:"default_services",label:E.value.default_services.text,value:l});return}x.value[i]={id:"default_services",label:E.value.default_services.text,value:l}}function he(l,i,e,r){j(l,i),r.options.paypal_value_basis=="service-based"&&t.value.pages.forEach((o,v)=>{let g=o.page_fields.findIndex(k=>k.content_type=="rbfield"&&k.endpoint.includes("services"));g!=-1&&(t.value.pages[v].page_fields[g].disabledByPayment=!0,t.value.pages[v].page_fields[g].readonly=!0)})}function Pe(){let l=new URLSearchParams(window.location.search);if(l.get("form_id")==null||n.form!=null){n.form==null?t.value=at:t.value=n.form;let e=document.createElement("style");e.id="pwfv-customcss",e.textContent=t.value.design.css??De(t.value.design.primaryColor,t.value.design.pagenavDesign),document.getElementById("pwfv-customcss")!=null&&document.getElementById("pwfv-customcss").remove(),document.body.appendChild(e),se(),window.onresize=()=>K(),K(),ve();return}let i=l.get("form_id");L.post("forms/fetch?book_form_id="+i).then(e=>{if(e.data==null||!e.data.success)return;t.value=JSON.parse(e.data.result[0].book_form_json);let r=document.createElement("style");r.id="pwfv-customcss",r.textContent=t.value.design.css??De(t.value.design.primaryColor,t.value.design.pagenavDesign),document.getElementById("pwfv-customcss")!=null&&document.getElementById("pwfv-customcss").remove(),document.body.appendChild(r),se(),window.onresize=()=>K(),K(),ve()})}function ve(){t.value.declare.notifEmails==null||t.value.declare.notifEmails.length==0||L.post("notification/fetch").then(l=>{let i=[];l.data.result!=null&&(i=l.data.result);let e=[];t.value.declare.notifEmails.forEach((r,o)=>{i.findIndex(g=>g.book_email_address==r)==-1&&e.push(o)}),e.forEach(r=>{t.value.declare.notifEmails.splice(r,1)})})}function me(l){return Y.value==1&&l==1?T.value.page_fields:Y.value==1&&l==2?[]:T.value.page_fields.filter(i=>i.column==l)}function ge(l){E.value[l].required=!1,z.value.push(l)}function ye(l){E.value[l.id].required=!1}function we(l){E.value[l.id].required=!0}function O(l){return E.value[l].value}function j(l,i){let e=x.value.findIndex(o=>o.id==l.id);if(l.id=="default_services"){J.value=i;return}l.value=i,t.value.declare.nameIndex==l.id?G.value.name=i:t.value.declare.phoneIndex==l.id&&(G.value.phone=i),l.content_type=="field"&&l.type=="email"&&(l.useemail==="true"||l.useemail===!0)&&!["",null].includes(i)&&(ue=i),e==-1?x.value.push({id:l.id,label:l.content_type=="field"?l.label:l.text,value:i}):x.value[e]={id:l.id,label:l.content_type=="field"?l.label:l.text,value:i},t.value.conditionals.split(" :break;").forEach(async o=>{if(o=o.trim(),o==""||o.match(/^\s+$/g))return;let v=_e(await ke(o.split("?")[0].trim())),g=Se(o.split("?")[1].trim().split(" :;").map(k=>k.trim()));o.split("?")[0].trim().includes(l.id)&&Ce(o.split("?")[0].trim(),g,xe(v))}),setTimeout(()=>{const o=JSON.parse(JSON.stringify($.value));for(let v in o)for(let g in o[v]){if(g=="value"){let k=x.value.findIndex(W=>W.id==v);k==-1?x.value.push({id:v,label:E.value[v].content_type=="field"?E.value[v].label:E.value[v].text,value:o[v][g]}):x.value[k]={id:v,label:E.value[v].content_type=="field"?E.value[v].label:E.value[v].text,value:o[v][g]}}E.value[v][g]=o[v][g]}},10),$.value={}}de(async()=>{Pe(),n.page!=0&&(m.value=n.page),await Ee(()=>E.value!=null),await Ee(()=>Object.keys(E.value).length!=0),t.value.conditionals.split(" :break;").forEach(async i=>{if(i=i.trim(),i==""||i.match(/^\s+$/g))return;let e=_e(await ke(i.split("?")[0].trim())),r=Se(i.split("?")[1].trim().split(" :;").map(v=>v.trim())),o=i.split("?")[0].trim();H.value[o]==null&&(H.value[o]={},r.forEach(v=>{H.value[o][v.field]==null&&(H.value[o][v.field]={}),H.value[o][v.field][v.prop]=E.value[v.field][v.prop]})),Ce(i.split("?")[0].trim(),r,xe(e))})});function ie(l,i=null){if(M.value=[],Object.keys(pe.value).length>0&&(l>=1||i!=null&&i>m.value))for(let e in pe.value){let r=E.value[e];if(typeof r.value=="checkbox-group"){r.value=JSON.parse(JSON.stringify(r.value)),(r.value==null||r.value.length==0)&&M.value.push({id:r.id,label:r.content_type=="field"?r.label:r.text});continue}["",null,[],void 0].includes(r.value)&&M.value.push({id:r.id,label:r.content_type=="field"?r.label:r.text})}if(!M.value.length){if(i!=null){if(i>p.value+1)return;m.value=i,m.value>p.value&&(p.value=m.value);return}m.value+l>p.value+1||(m.value+=l,m.value>p.value&&(p.value=m.value))}}function Le(){M.value=[];for(let l in Te.value){let i=E.value[l];if(typeof i.value=="checkbox-group")return i.value=JSON.parse(JSON.stringify(i.value)),!(i.value==null||i.value.length==0);["",null,[],void 0].includes(i.value)&&M.value.push({id:i.id,label:i.content_type=="field"?i.label:i.text})}M.value.length>0||L.post("appointments/create",null,{form_receivers:JSON.stringify(t.value.declare.notifEmails),book_appointment_locationname:O("default_location")??"",book_appointment_servicesname:O("default_services")??"",book_appointment_worker:O("default_worker")??"",book_appointment_scheduleid:O("default_scheduler")??"",book_appointment_name:G.value.name,book_appointment_phone:G.value.phone,book_appointment_email:ue,book_appointment_custominputs:JSON.stringify(x.value)}).then(l=>{if(l.data==null||!l.data.success){alert("Something went wrong! You may contact the website admin and inform them about this problem. Your feedback will be appreciated!");return}ae.value=!0})}async function K(){Y.value=T.value.page_columns;const l=()=>{document.getElementById("pwfv-parent").dataset.responsive="",document.getElementById("pwfv-parent").offsetWidth<=400&&(document.getElementById("pwfv-parent").dataset.responsive=document.getElementById("pwfv-parent").dataset.responsive+"r400 "),document.getElementById("pwfv-parent").offsetWidth<=600&&(document.getElementById("pwfv-parent").dataset.responsive=document.getElementById("pwfv-parent").dataset.responsive+"r600 "),document.getElementById("pwfv-parent").offsetWidth<=800&&(document.getElementById("pwfv-parent").dataset.responsive=document.getElementById("pwfv-parent").dataset.responsive+"r800 ",Y.value=1),document.getElementById("pwfv-parent").offsetWidth<=1e3&&(document.getElementById("pwfv-parent").dataset.responsive=document.getElementById("pwfv-parent").dataset.responsive+"r1000 "),document.getElementById("pwfv-parent").offsetWidth<=1200&&(document.getElementById("pwfv-parent").dataset.responsive=document.getElementById("pwfv-parent").dataset.responsive+"r1200 "),document.getElementById("pwfv-parent").offsetWidth<=1400&&(document.getElementById("pwfv-parent").dataset.responsive=document.getElementById("pwfv-parent").dataset.responsive+"r1400 "),window.parent.document.getElementById("pwform")!=null&&new ResizeObserver(()=>{window.parent.document.getElementById("pwform").style.width="100%",window.parent.document.getElementById("pwform").style.overflow="hidden",window.parent.document.getElementById("pwform").style.border="none",window.parent.document.getElementById("pwform").style.height=document.body.offsetHeight<500?500:document.body.offsetHeight+"px"}).observe(document.body)};if(document.getElementById("pwfv-parent")==null){let i=setInterval(()=>{document.getElementById("pwfv-parent")!=null&&(clearInterval(i),l())},100);return}l()}function be(l){let i=T.value.page_fields.findIndex(e=>e.content_type=="rbfield"&&e.endpoint.includes("services"));if(i!=-1){if(T.value.page_fields[i].disabledByPayment){T.value.page_fields[i].readonly=!0;return}l?T.value.page_fields[i].readonly=!0:T.value.page_fields[i].readonly=!1}}function _e(l){if(["",null,void 0].includes(l))return;const i=[];let e=l.match(/\s+\|\|\s+|\s+&&\s+/g);l=l.split(/\s+\|\|\s+|\s+&&\s+/g);const r=/(==|!=|>|<|>=|<=|in_array)/g;for(let o=0;o<l.length;o++){let g=l[o].split(r),k=g[0].trim();const W=g[1].trim();let _=g[2].trim();k.startsWith("(")&&k.endsWith(")")&&(k=k.slice(1,-1),k=Number(k)),_.startsWith("(")&&_.endsWith(")")?(_=_.slice(1,-1),_=Number(_)):_.startsWith("{")&&_.endsWith("}")?_=_.slice(1,-1).split(",").map(I=>I.trim()):_=_.trim(),i.push({leftOperand:k,operator:W,rightOperand:_})}return{conditions:i,logicalOperators:e}}function xe(l){const{conditions:i,logicalOperators:e}=l;let r=null,o=0;for(const v of i){const{leftOperand:g,operator:k,rightOperand:W}=v;let _=g;typeof _=="string"&&!isNaN(_)&&(_=Number(_));let I=W;typeof I=="string"&&!isNaN(I)&&(I=Number(I));let P;if(g!="")switch(k){case"!=":P=_!=I;break;case">":P=_>I;break;case"<":P=_<I;break;case">=":P=_>=I;break;case"<=":P=_<=I;break;case"==":P=_==I;break;case"in_array":let re=g;typeof g!="string"&&(re=String(re)),P=I.includes(re);break;default:P=!1;break}else P=!1;r!=null?(e[o]==" || "&&(r=r||P),e[o]==" && "&&(r=r&&P),o++):r=P}return r}async function ke(l){return new Promise(i=>{setTimeout(()=>{i(l.replace(/\[(\w+)\]/g,(e,r)=>E.value[r].value))},10)})}function Se(l){function i(o){const v=["="];let g="";const k=[];for(let _=0;_<o.length;_++){const I=o[_];k.length===0?g.match(/\[[a-zA-Z0-9.\-_]+\]/g)?(k.push(g),g=""):g+=I:v.includes(I)?(g!==""&&(k.push(g.trim()),g=""),k.push(I)):g+=I}g!==""&&(k.push(g.trim()),g="");const W=o.slice(k.join("").length).trim();return W!==""&&k.push(W),k}function e(o){return i(o).filter(v=>v.trim()!=="")}let r=[];return l.forEach(o=>{let v=e(o),g=v[0].startsWith("[")&&v[0].endsWith("]")?v[0].slice(1,-1):v[0];r.push({field:g,prop:v[1].trim(),value:v[3].trim()})}),r}function ne(l){return l==null||l==null?l:l.match(/^[0-9]+$/g)!=null?parseInt(l):l.match(/^[0-9]+.[0-9]+$/g)?parseFloat(l):l=="true"?!0:l=="false"?!1:l}function Ce(l,i,e){if(e)i.forEach(r=>{$.value[r.field]==null&&($.value[r.field]={}),!((r.prop=="required"||r.prop=="hidden")&&(r.prop=="hidden"&&ne(r.value)==!1||r.prop=="required"&&ne(r.value)==!0))&&($.value[r.field][r.prop]=ne(r.value))});else for(let r in H.value[l])for(let o in H.value[l][r]){if($.value[r]==null&&($.value[r]={}),E.value[r][o]!=H.value[l][r][o])return;$.value[r][o]==null&&($.value[r][o]=H.value[l][r][o])}}return(l,i)=>u(t)!=null?(d(),c("div",{key:0,id:"pwfv-parent",ref_key:"formElement",ref:b,"data-responsive":""},[f("div",Bt,w(u(t).form_title),1),u(ae)?h("",!0):(d(),c("div",Tt,[u(t).pages.length>1?(d(),c("div",Pt,[(d(!0),c(B,null,N(u(t).pages,(e,r)=>(d(),c("div",{class:F(["pwfv-navigation-item",{active:u(m)==r,done:u(p)>r}]),key:r,onClick:o=>ie(null,r)},[f("span",null,w(u(p)>r?"✓":r+1),1),q(" "+w(e.page_title),1)],10,Lt))),128))])):h("",!0),f("div",{class:F(["pwfv-maingrid",{"two-cols":u(T).page_columns==2}])},[u(D).length>0?(d(),c("p",Nt,"Required Fields are marked with (*)")):h("",!0),f("div",Vt,[(d(!0),c(B,null,N(me(1),(e,r)=>Q((d(),c("div",zt,[e.content_type=="rbfield"&&!u(z).includes(e.id)?(d(),c("div",Ht,[f("label",$t,[q(w(e.text)+" ",1),jt]),V(Ie,{endpoint:e.endpoint,based:e.based,type:e.type,value:O(e.id),readonly:e.readonly,onOnResult:o=>j(e,o),onOnEmpty:o=>ge(e.id)},null,8,["endpoint","based","type","value","readonly","onOnResult","onOnEmpty"])])):h("",!0),e.content_type=="scheduler"?(d(),c("div",Wt,[f("label",At,[q(w(e.text)+" ",1),Jt]),V(Oe,{schedule:O(e.id),service:u(J),onOnFetch:i[0]||(i[0]=o=>be(o)),onSelectedService:i[1]||(i[1]=o=>fe(o)),onOnResult:o=>j(e,o)},null,8,["schedule","service","onOnResult"])])):h("",!0),e.content_type=="text"?(d(),c("div",{key:2,innerHTML:e.text,style:le(e.styles)},null,12,Yt)):h("",!0),e.content_type=="field"&&!["checkbox","paypal"].includes(e.type)?(d(),c("div",Ut,[f("label",Gt,[q(w(e.label)+" ",1),e.required?(d(),c("span",Kt,"*")):h("",!0)]),V(ee,{type:e.type,name:e.name,columns:e.grid,readonly:e.readonly,required:e.required,placeholder:e.placeholder,values:e.values,select:e.type=="checkbox-group"?O(e.id):null,options:e.options,index:e.index,value:O(e.id),onOnResult:o=>j(e,o)},null,8,["type","name","columns","readonly","required","placeholder","values","select","options","index","value","onOnResult"])])):h("",!0),e.content_type=="field"&&e.type=="checkbox"?(d(),c("div",Zt,[V(ee,{type:e.type,name:e.name,columns:e.grid,readonly:e.readonly,required:e.required,placeholder:e.placeholder,values:e.values,select:e.type=="checkbox-group"?O(e.id):null,options:e.options,index:e.index,value:O(e.id),onOnResult:o=>j(e,o)},null,8,["type","name","columns","readonly","required","placeholder","values","select","options","index","value","onOnResult"]),f("label",{for:e.name,class:"pwfvf-checkbox-label"},[q(w(e.label)+" ",1),e.required?(d(),c("span",Xt,"*")):h("",!0)],8,Qt)])):h("",!0),e.content_type=="field"&&e.type=="paypal"&&!u(ce)?(d(),c("div",el,[V(Fe,{service:u(J),fieldData:JSON.parse(JSON.stringify(e)),paid:O(e.id),currency:u(t).declare.paypalCurrency,paymentFunc:he,paymentFuncParams:[e.name,e.label,e],onOnEmpty:()=>ye(e),onOnLoaded:()=>we(e)},null,8,["service","fieldData","paid","currency","paymentFuncParams","onOnEmpty","onOnLoaded"])])):h("",!0)],512)),[[X,e!=null&&(e.hidden==null||e.hidden==!1)]])),256))]),u(T).page_columns==2?(d(),c("div",tl,[(d(!0),c(B,null,N(me(2),(e,r)=>Q((d(),c("div",{class:"pwfv-fielditem",key:r},[e.content_type=="rbfield"&&!u(z).includes(e.id)?(d(),c("div",ll,[f("label",al,[q(w(e.text)+" ",1),sl]),V(Ie,{endpoint:e.endpoint,based:e.based,type:e.type,value:O(e.id),readonly:e.readonly,onOnResult:o=>j(e,o),onOnEmpty:o=>ge(e.id)},null,8,["endpoint","based","type","value","readonly","onOnResult","onOnEmpty"])])):h("",!0),e.content_type=="scheduler"?(d(),c("div",il,[f("label",nl,[q(w(e.text)+" ",1),rl]),V(Oe,{schedule:O(e.id),service:u(J),onOnFetch:i[2]||(i[2]=o=>be(o)),onSelectedService:i[3]||(i[3]=o=>fe(o)),onOnResult:o=>j(e,o)},null,8,["schedule","service","onOnResult"])])):h("",!0),e.content_type=="text"?(d(),c("div",{key:2,innerHTML:e.text,style:le(e.styles)},null,12,ol)):h("",!0),e.content_type=="field"&&!["checkbox","paypal"].includes(e.type)?(d(),c("div",dl,[f("label",cl,[q(w(e.label)+" ",1),e.required?(d(),c("span",ul,"*")):h("",!0)]),V(ee,{type:e.type,name:e.name,columns:e.grid,readonly:e.readonly,required:e.required,placeholder:e.placeholder,values:e.values,select:e.type=="checkbox-group"?O(e.id):null,options:e.options,index:e.index,value:O(e.id),onOnResult:o=>j(e,o)},null,8,["type","name","columns","readonly","required","placeholder","values","select","options","index","value","onOnResult"])])):h("",!0),e.content_type=="field"&&e.type=="checkbox"?(d(),c("div",pl,[V(ee,{type:e.type,name:e.name,columns:e.grid,readonly:e.readonly,required:e.required,placeholder:e.placeholder,values:e.values,select:e.type=="checkbox-group"?O(e.id):null,options:e.options,index:e.index,value:O(e.id),onOnResult:o=>j(e,o)},null,8,["type","name","columns","readonly","required","placeholder","values","select","options","index","value","onOnResult"]),f("label",{for:e.name,class:"pwfvf-checkbox-label"},[q(w(e.label)+" ",1),e.required?(d(),c("span",hl,"*")):h("",!0)],8,fl)])):h("",!0),e.content_type=="field"&&e.type=="paypal"&&!u(ce)?(d(),c("div",vl,[V(Fe,{service:u(J),fieldData:JSON.parse(JSON.stringify(e)),paid:O(e.id),currency:u(t).declare.paypalCurrency,paymentFunc:he,paymentFuncParams:[e.name,e.label,e],onOnEmpty:()=>ye(e),onOnLoaded:()=>we(e)},null,8,["service","fieldData","paid","currency","paymentFuncParams","onOnEmpty","onOnLoaded"])])):h("",!0)])),[[X,e!=null&&(e.hidden==null||e.hidden==!1)]])),128))])):h("",!0),u(M).length>0?(d(),c("div",ml,[q(" The following field/s are required before you proceed: "),(d(!0),c(B,null,N(u(M),(e,r)=>(d(),c("strong",{key:r},w(e.label)+w(r!=u(M).length-1?", ":" "),1))),128))])):h("",!0),f("div",gl,[Q(f("div",yl,[Q(f("div",{id:"recaptcha",class:"g-recaptcha","data-sitekey":u(s)},null,8,wl),[[X,u(m)==u(t).pages.length-1]])],512),[[X,!1]]),u(m)!=0?(d(),c("button",{key:0,onClick:i[4]||(i[4]=e=>ie(-1))},[f("i",{innerHTML:u(qe).arrowLeft},null,8,bl),q(" Prev")])):h("",!0),u(m)!=u(t).pages.length-1?(d(),c("button",{key:1,onClick:i[5]||(i[5]=e=>ie(1))},[q("Next "),f("i",{innerHTML:u(qe).arrowRight},null,8,_l)])):h("",!0),u(m)==u(t).pages.length-1?(d(),c("button",{key:2,onClick:i[6]||(i[6]=e=>Le()),class:"pwfv-submit"},"Submit")):h("",!0)])],2)])),u(ae)?(d(),c("div",xl,[f("div",kl,[f("div",Sl,[f("i",{innerHTML:u(He).check},null,8,Cl)]),q(" Your entry has been successfully submitted. We will process it and update you as soon as possible. ")])])):h("",!0)],512)):h("",!0)}},Fl=Object.freeze(Object.defineProperty({__proto__:null,default:El},Symbol.toStringTag,{value:"Module"}));export{Fl as F,El as _,Ol as a,De as b,at as f,Il as p};
