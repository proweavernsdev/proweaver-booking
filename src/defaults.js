import {hexToHsl} from './functions'


export const fieldDefault = {
    text: {
        "content_type" : "text",
        "text": "This is a sample text inside the form.",
        "column": 2,
        "grid": '1fr 1fr',
        "styles": "text-align:center"
    },
    field: {
        content_type : "field",
        type: "text",
        name: "sample_field",
        label: "Sample Field",
        value: "",
        column: 2,
        grid: '1fr 1fr',
        readonly: false,
        required: true,
        placeholder: "This is a placeholder",
        values: [{label:'Sample Label',value:'Sample Value'}],
        select: [],
        options: {paypal_value_currency:'USD',paypal_value_basis:'fixed',paypal_value:1},
        index: "",
        styles: {}
    }
}

//Acr8x9sWvKkPBzfz5wqmwPcP3yGiq6qGoTn63WhUmbogdEtWG5-H-Cu0VH7WjGXoEuOuRFdHoBRQC61x

export const pageDefault = {
    "page_title" : "New Page",
    "page_columns" : 1,
    "page_fields" : [
        {
            "content_type" : "text",
            "text": "Sample Header",
            "column": 1,
            "styles": "background-color:#eee;text-align:center;padding:5px;margin-bottom:10px;font-weight:700"
        },
        {
            "content_type" : "text",
            "text": "This is a sample text inside the form.",
            "column": 2,
            "grid": '1fr 1fr',
            "styles": "text-align:center"
        },
        {
            "content_type" : "field",
            "type": "text",
            "name": "sample_field",
            "label": "Sample Field",
            "value": "",
            "column": 2,
            "grid": '1fr 1fr',
            "readonly": false,
            "required": true,
            "placeholder": "This is a placeholder",
            "values": [{label:'1',value:1},{label:'1',value:2}],
            "select": [],
            "options": {maximum_checks: null},
            "index": "",
            "styles": {}
        },
    ]
};

export const formData = {
    "form_title": "Default Form",
    "declare": { "paypalClientID": "", "paypalCurrency": "USD","notifEmails":[],paypalEmail:'',nameIndex:'default_name',phoneIndex:''},
    "conditionals": '20 in_array {20,50,70,80} && 20 == 20 ? [default_gender].readonly = true',
    "design": { "primaryColor": "#446523", "pagenavDesign": "row", "css": null },
    "pages": [
        {
            "page_title": "Schedule Selection",
            "page_columns": 2,
            "page_fields": [
                { "content_type": "rbfield","id":"default_location", "column": 2, "endpoint": "location/fetch", "based": "book_location_name", "type": "select", "value": "", "text": "Select Location" },
                { "content_type": "rbfield","id":"default_worker", "column": 2, "endpoint": "worker/fetch", "based": "book_worker_name", "type": "select", "value": "", "text": "Select Worker" },
                { "content_type": "rbfield","id":"default_services", "column": 2, "endpoint": "services/fetch", "based": "book_services_name", "type": "select", "value": "", "text": "Select Service" },
                { "content_type": "scheduler", "id":"default_scheduler", "column": 1, "text": "Scheduler" }
            ]
        },
        {
            "page_title": "Personal Information",
            "page_columns": 1,
            "page_fields": [
                {
                    "content_type": "field",
                    "id":"default_name",
                    "type": "text",
                    "name": "name",
                    "label": "Name",
                    "value": "",
                    "column": 2,
                    "grid": "1fr 1fr",
                    "readonly": false,
                    "required": true,
                    "placeholder": "Enter your name here",
                    "values": [
                        { "label": "1", "value": 1 },
                        { "label": "1", "value": 2 }
                    ],
                    "select": [],
                    "options": { "maximum_checks": null },
                    "index": "",
                    "styles": {}
                },
                {
                    "content_type": "field",
                    "id":"default_gender",
                    "type": "radio-group",
                    "name": "gender",
                    "label": "Gender",
                    "value": "",
                    "column": 2,
                    "grid": "1fr 1fr",
                    "readonly": false,
                    "required": true,
                    "placeholder": "",
                    "values": [
                        { "label": "Male", "value": 1 },
                        { "label": "Female", "value": 2 }
                    ],
                    "select": [],
                    "options": { "maximum_checks": null },
                    "index": "",
                    "styles": {}
                },
                {
                    "content_type": "field",
                    "id":"default_email",
                    "type": "email",
                    "name": "Email_Address",
                    "label": "Email Address",
                    "value": "",
                    "column": 2,
                    "grid": "1fr 1fr",
                    "readonly": false,
                    "required": true,
                    "placeholder": "Enter your email",
                    "values": [{ "label": "Sample Label", "value": "Sample Value" }],
                    "select": [],
                    "options": { "paypal_value_currency": "USD", "paypal_value_basis": "fixed", "paypal_value": 1 },
                    "index": "",
                    "styles": {}
                }
            ]
        }
    ]
}



function fgColor(color) {
    const hslColor = hexToHsl(color);
    if(hslColor.l > 50) return '#333333';
    else return '#ffffff';
}

function getColorRelativeLightness(color,amount) {
    let r = parseInt(color.substring(1,3),16);
    let g = parseInt(color.substring(3,5),16);
    let b = parseInt(color.substring(5,7),16);
    r+=amount
    g+=amount
    b+=amount
    r = Math.min(r,255)
    g = Math.min(g,255)
    b = Math.min(b,255)

    return '#'+r.toString(16)+g.toString(16)+b.toString(16)
}

export const formCSS = (primaryColor,navPlacement)=>{
return `:root{
    --pwcss-primary-color: ${primaryColor};
    --pwcss-lighter-color: ${getColorRelativeLightness(primaryColor, 30)};
    --pwcss-lighter2-color: ${getColorRelativeLightness(primaryColor, 50)};
    --pwcss-contra-color: ${fgColor(primaryColor)};
    --pwcss-contra-lighter-color: ${getColorRelativeLightness(fgColor(primaryColor),30)};
    --pwcss-contra-darker-color: ${getColorRelativeLightness(fgColor(primaryColor),-30)};
    --pwcss-contra2-color: ${fgColor(fgColor(primaryColor))};
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
    width: ${navPlacement == 'row' ? '300px' : '100%'};
    box-shadow: inset 0 0 10px -5px #777;
    padding: 10px;
    border-radius: 0 0 10px 10px;
    display: ${navPlacement == 'row' ? 'block':'grid'};
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
    flex-direction:${navPlacement};
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
    background: ${fgColor(fgColor(primaryColor))};
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




`};