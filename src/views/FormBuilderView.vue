<script setup>
import FormView from './FormView.vue'
import { formData, pageDefault, fieldDefault, formCSS } from '../defaults'
import router from '../router'
import CustomField from '../components/SchedulerComps/CustomField.vue'
import { ref, computed, watch } from 'vue'
import icons from '../assets/icons'
import CodeMirror from '../components/CodeMirror.vue'
import { axios } from '../functions'
import ConditionScriptor from '../components/ConditionScriptor.vue'
import JSEffects from '@/components/JSEffects.vue'


let form = ref(JSON.parse(JSON.stringify(formData)));
let emails = ref(form.value.declare.emails ?? []);
let currentPageIndex = ref(0)
let formRefresh = ref(false)
let addFieldMode = ref(false)
let addFieldType = ref('text')
let migrateFieldMode = ref(false)
let queCSS = ref(form.value.design.css)
let tempCSS = ref(form.value.design.css)
let modifyCSSMode = ref(false);
let modifyConditionalEffects = ref(false);
let queField = ref(null)
let targetFieldIndex = ref(0)
let targetPageIndex = ref(0)
let editId = null;

let manageExtensionsMode = ref(false);

const currentPage = computed(() => {
  return form.value.pages[currentPageIndex.value]
});

const fields = computed(() => {
  return currentPage.value.page_fields
});

const pagesSelect = computed(() => {
  let parsed = form.value.pages.map((el, i) => {
    return {
      label: el.page_title,
      value: i
    }
  });
  parsed.push({ label: 'Add New Page (+)', value: -1 })
  return parsed;
});

const pagesMigrateSelect = computed(() => {
  let parsed = form.value.pages.map((el, i) => {
    return {
      label: el.page_title,
      value: i
    }
  });
  return parsed;
});

function consoleLog(text) {
  console.log(text)
}

watch(() => form.value, (newVal, oldVal) => {
  refreshForm()
}, { deep: true })

function refreshForm() {
  formRefresh.value = true;
  setTimeout(() => formRefresh.value = false, 1)
}

function checkGetter() {

  let getparams = new URLSearchParams(window.location.search);
  if (getparams.get('form_id') == null) return;
  let id = getparams.get('form_id');
  editId = id;
  axios.post('forms/fetch?book_form_id=' + id).then(res => {
    if (res.data == null || !res.data.success) return;
    form.value = JSON.parse(res.data.result[0].book_form_json)
  });
}

axios.post('notification/fetch').then(res => {
  if (res.data == null || !res.data.success) return;
  emails.value = res.data.result.map(el => {
    return {
      label: el.book_email_address,
      value: el.book_email_address
    }
  })
});


checkGetter()

function selectPage(e) {
  if (e != -1) {
    currentPageIndex.value = e
    refreshForm();
    return
  }
  form.value.pages.push(JSON.parse(JSON.stringify(pageDefault)))
  currentPageIndex.value = form.value.pages.length - 1
  refreshForm();
}

function moveFieldUp(i) {
  let temp = currentPage.value.page_fields[i - 1];
  currentPage.value.page_fields[i - 1] = currentPage.value.page_fields[i]
  currentPage.value.page_fields[i] = temp;
  refreshForm();
}

function moveFieldDown(i) {
  let temp = currentPage.value.page_fields[i + 1];
  currentPage.value.page_fields[i + 1] = currentPage.value.page_fields[i]
  currentPage.value.page_fields[i] = temp;
  refreshForm();
}

function deleteField(i) {
  if (!confirm('Confirm Deletion?')) return;
  currentPage.value.page_fields.splice(i, 1)
}

function deletePage() {
  if (!confirm('Confirm Deletion?')) return;
  let pageToDelete = currentPageIndex.value
  currentPageIndex.value = 0;
  let pagefields = JSON.parse(JSON.stringify(form.value.pages[pageToDelete].page_fields));
  let containsSpecialFields = false;
  pagefields.forEach(el => {
    if (['rbfield', 'scheduler', 'ext'].includes(el.content_type)) containsSpecialFields = true;
  })
  if (containsSpecialFields) {
    alert('This page contains a RBField (Request Binded Field) or a Scheduler, both which are required fields. Please move it to the other page first before deleting the page.')
    return;
  }
  form.value.pages.splice(pageToDelete, 1);
}



function addField() {
  if (!addFieldMode.value) {
    addFieldMode.value = true;
    return;
  }

  let newId = (Date.now()).toString(36) + '-' + Math.random().toString(36)
  currentPage.value.page_fields.push(JSON.parse(JSON.stringify({ ...fieldDefault[addFieldType.value], id: newId })))
  addFieldMode.value = false;
}

function editField() {
  let field = JSON.parse(JSON.stringify(queField.value));
  let target = targetFieldIndex.value;

  if (field.content_type == 'field') {
    if (field.label == '') { alert('Some values under options are empty!'); return; }
    if (field.type == 'paypal' && (field.options.paypal_value == '' || field.options.paypal_value == '0')) { alert('Paypal value is empty/invalid!'); return; }
    if (field.type == "checkbox-group" && field.options.maximum_checks == null) {
      delete field.options.maximum_check;
    }
    field.name = field.label.replaceAll()
    fields.value.forEach(el => { if (el.name == field.name) field.name += '_'; });

    if (field.type == 'email' && field.useemail != null && ['true', true].includes(field.useemail)) {
      form.value.pages.forEach((el2, i2) => {
        el2.page_fields.forEach((el, i) => {
          if (el.useemail != null) delete form.value.pages[i2].page_fields[i].useemail;
        });
      })

      field.useemail = true;
    }


    if (['checkbox-group', 'radio-group', 'select', 'datalist'].includes(field.type)) {
      let flag = false;
      field.values.forEach(el => {
        if (typeof el.label != 'string') el.label = el.label.toString();
        if (typeof el.value != 'string') el.value = el.value.toString();
        if (el.label == '')
          flag = true;

        if (el.value == '' && field.type != 'select' && field.type != 'datalist')
          flag = true;
      })
      if (flag) { alert('Some values under options are empty!'); return; }

      console.log(field.alphOnSave)

      if (['select', 'datalist'].includes(field.type) && field.alphOnSave == true) {
        field.values = field.values.sort((a, b) => {
          let aLabel = a.label.toLowerCase()
          let bLabel = b.label.toLowerCase()
          if (aLabel < bLabel) return -1
          if (aLabel > bLabel) return 1;
          return 0
        })
      }
    }
  }


  form.value.pages[currentPageIndex.value].page_fields[target] = field
  queField.value = null;
  targetFieldIndex.value = 0;
}

function modifyCSS() {
  modifyCSSMode.value = true;
  queCSS.value = form.value.design.css ?? formCSS(form.value.design.primaryColor, form.value.design.pagenavDesign);
}

function defaultCSS() {
  if (!confirm('Your unsaved css code will be changed. Continue?')) return;
  queCSS.value = formCSS(form.value.design.primaryColor, form.value.design.pagenavDesign);
}

function previewFormCSS() {
  tempCSS.value = form.value.design.css
  form.value.design.css = queCSS.value
}

function cancelPreviewFormCSS() {
  form.value.design.css = tempCSS.value
}

function saveCSSChanges() {
  if (!confirm('Confirm saving?')) return;
  form.value.design.css = queCSS.value;
  modifyCSSMode.value = false;
  queCSS.value = '';
}

function cancelCSSChanges() {
  if (!confirm('Your changes will not be saved. Continue?')) return;
  modifyCSSMode.value = false;
  queCSS.value = '';
}

function discardCustomCSS() {
  if (!confirm('The Custom CSS code will be deleted. Continue?')) return;
  form.value.design.css = null;
  modifyCSSMode.value = false;
  queCSS.value = '';
}

function migrateField() {
  let field = JSON.parse(JSON.stringify(fields.value[targetFieldIndex.value]));
  form.value.pages[currentPageIndex.value].page_fields
    .splice(targetFieldIndex.value, 1);
  form.value.pages[targetPageIndex.value].page_fields.push(field);
  migrateFieldMode.value = false;
}

function saveChanges() {
  if (!confirm('Confirm saving?')) return;


  let createdIds = [];
  form.value.pages.forEach((el2, i2) => {
    el2.page_fields.forEach((el, i) => {
      if (el.id == null || el.id == '') {
        let id = '';
        for (let j = 0; j < 20; j++) {
          id = (Date.now()).toString(36) + '-' + Math.random().toString(36);
          if (createdIds.includes(id)) {
            j--;
            continue;
          }
          createdIds.push(id)
        }
        form.value.pages[i2].page_fields[i].id = id;
        console.log(id)
      }
    })
  })


  if (editId == null) {
    axios.post('forms/create', null, {
      book_form_name: form.value.form_title,
      book_form_json: JSON.stringify(form.value)
    }).then(() => window.location.reload())
  } else {
    axios.post('forms/update?id=' + editId, null, {
      book_form_name: form.value.form_title,
      book_form_json: JSON.stringify(form.value)
    }).then(() => window.location.reload())
  }
}

function cancelEdit() {
  if (!confirm('Any unsaved changes will disappear. Confirm?')) return;
  router.push('/forms');
}

</script>

<template>
  <div class="p-5">
    <div class="fixed w-screen h-screen bg-black bg-opacity-50 z-[999] flex items-center justify-center top-0 left-0"
      v-if="queField != null">
      <div class="w-[400px] bg-white rounded-lg max-h-[80vh] overflow-auto">
        <div class="p-3 py-5 text-white bg-gray-900 rounded-t-lg">
          <h2 class="text-lg font-bold">Edit {{
            queField.content_type.charAt(0).toUpperCase() + queField.content_type.substring(1) }}</h2>
        </div>

        <div class="p-3 pb-0 rounded-b-lg"
          v-if="queField.content_type == 'rbfield' || queField.content_type == 'scheduler'">
          <label for="pwfb-editfield-type" v-if="queField.content_type == 'rbfield'" class="block mb-1">Type</label>
          <CustomField v-if="queField.content_type == 'rbfield'" name="pwfb-editfield-type" type="select"
            placeholder="e.g. Book Form" columns="1fr 1fr" :value="queField.type" :values="[
              { label: 'Radio Group', value: 'radio' },
              { label: 'Select', value: 'select' },
            ]" @onResult="e => { queField.type = e; }" />
          <label for="pwfb-editfield-label" class="block mt-2 mb-1">Label</label>
          <CustomField name="pwfb-editfield-label" type="text" placeholder="Enter field label" :value="queField.text"
            @onResult="e => { queField.text = e; }" />
        </div>
        <div class="p-3 pb-0 rounded-b-lg">
          <label v-if="currentPage.page_columns > 1" for="pwfb-editfield-column" class="block mt-2 mb-1">Column
            Placement</label>
          <CustomField v-if="currentPage.page_columns > 1" name="pwfb-editfield-column" type="radio-group"
            placeholder="Tooltip to help your users what to input" columns="1fr 1fr" :value="queField.column" :values="[
              { label: 1, value: 1 },
              { label: 2, value: 2 }
            ]" @onResult="e => { queField.column = e; }" />
        </div>



        <div class="p-3 rounded-b-lg"
          v-if="!['field', 'text'].includes(queField.content_type) && currentPage.page_columns > 1">

          <div class="flex justify-end w-[max-content] ml-auto gap-1 mt-4">
            <button @click="editField"
              class="block p-2 text-white transition bg-green-800 rounded-md hover:scale-105 active:scale-95">Save</button>
            <button @click="queField = null"
              class="block p-2 text-white transition bg-red-800 rounded-md hover:scale-105 active:scale-95">Cancel</button>
          </div>
        </div>
        <div class="p-3 rounded-b-lg" v-if="queField.content_type == 'field'">
          <label for="pwfb-editfield-type" class="block mb-1">Type</label>
          <CustomField name="pwfb-editfield-type" type="select" placeholder="e.g. Book Form" columns="1fr 1fr"
            :value="queField.type" :values="[
              { label: 'Text', value: 'text' },
              { label: 'Checkbox', value: 'checkbox' },
              { label: 'Date', value: 'date' },
              { label: 'Time', value: 'time' },
              { label: 'Integer', value: 'integer' },
              { label: 'Floating Point', value: 'number' },
              { label: 'Telephone', value: 'telephone' },
              { label: 'Email', value: 'email' },
              { label: 'Checkbox Group', value: 'checkbox-group' },
              { label: 'Radio Group', value: 'radio-group' },
              { label: 'Select', value: 'select' },
              { label: 'Input Select', value: 'datalist' },
              { label: 'Multi-line Text', value: 'textarea' },
              { label: 'PayPal', value: 'paypal' },
            ]" @onResult="e => { queField.type = e; }" />
          <label for="pwfb-editfield-label" class="block mt-2 mb-1">Label</label>
          <CustomField name="pwfb-editfield-label" type="text" placeholder="Enter field label" :value="queField.label"
            @onResult="e => { queField.label = e; }" />
          <label for="pwfb-editfield-paypaltype" class="block mt-2 mb-1" v-if="queField.type == 'paypal'">Type</label>
          <CustomField v-if="queField.type == 'paypal'" name="pwfb-editfield-paypaltype" type="radio-group"
            placeholder="Enter field label" columns="1fr 1fr" :values="[
              { label: 'Fixed', value: 'fixed' },
              { label: 'Service-Based', value: 'service-based' }
            ]" :value="queField.options.paypal_value_basis"
            @onResult="e => { queField.options.paypal_value_basis = e; }" />
          <label for="pwfb-editfield-paypalvalue" class="block mt-2 mb-1"
            v-if="queField.type == 'paypal' && queField.options.paypal_value_basis == 'fixed'">Value</label>
          <CustomField v-if="queField.type == 'paypal' && queField.options.paypal_value_basis == 'fixed'"
            name="pwfb-editfield-paypalvalue" type="number" placeholder="Enter PayPal Value (e.g. 20.00)"
            columns="1fr 1fr" :values="[
              { label: 'Fixed', value: 'fixed' },
              { label: 'Service-Based', value: 'service-based' }
            ]" :value="queField.options.paypal_value" @onResult="e => { queField.options.paypal_value = e; }" />
          <label
            v-if="['text', 'integer', 'number', 'telephone', 'email', 'textarea', 'datalist'].includes(queField.type)"
            for="pwfb-editfield-label" class="block mt-2 mb-1">Placeholder</label>
          <CustomField
            v-if="['text', 'integer', 'number', 'telephone', 'email', 'textarea', 'datalist'].includes(queField.type)"
            name="pwfb-editfield-placeholder" type="text" placeholder="Tooltip to help your users what to input"
            :value="queField.placeholder" @onResult="e => { queField.placeholder = e; }" />
          <label v-if="['checkbox-group', 'radio-group'].includes(queField.type)" for="pwfb-editfield-grid"
            class="block mt-2 mb-1">Columns</label>
          <CustomField v-if="['checkbox-group', 'radio-group'].includes(queField.type)" name="pwfb-editfield-grid"
            type="radio-group" :value="queField.grid" columns="1fr 1fr 1fr 1fr" :values="[
              { label: '1', value: '1fr' },
              { label: '2', value: '1fr 1fr' },
              { label: '3', value: '1fr 1fr 1fr' },
              { label: '4', value: '1fr 1fr 1fr 1fr' },
              { label: '5', value: '1fr 1fr 1fr 1fr 1fr' },
              { label: '6', value: '1fr 1fr 1fr 1fr 1fr 1fr' },
              { label: '7', value: '1fr 1fr 1fr 1fr 1fr 1fr 1fr' },
              { label: '8', value: '1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr' },
            ]" @onResult="e => { queField.grid = e; }" />
          <label v-if="queField.type == 'checkbox-group'" for="pwfb-editfield-maxchecks" class="block mt-2 mb-1">Max no.
            of checks</label>
          <CustomField v-if="queField.type == 'checkbox-group'" name="pwfb-editfield-maxchecks" type="integer"
            placeholder="Maximum number of checks allowed (optional)" columns="1fr 1fr"
            :value="queField.options.maximum_checks" :values="[
              { label: 'Yes', value: true },
              { label: 'No', value: false }
            ]" @onResult="e => { queField.options.maximum_checks = e; }" />
          <label for="pwfb-editfield-required" class="block mt-2 mb-1">Required?</label>
          <CustomField name="pwfb-editfield-required" type="radio-group"
            placeholder="Tooltip to help your users what to input" columns="1fr 1fr" :value="queField.required" :values="[
              { label: 'Yes', value: true },
              { label: 'No', value: false }
            ]" @onResult="e => { queField.required = e; }" />
          <div class="flex items-center gap-2" v-if="queField.type == 'email'">
            <CustomField name="pwfb-editfield-useemail" type="checkbox"
              placeholder="Tooltip to help your users what to input" columns="1fr 1fr" :value="queField.useemail"
              @onResult="e => { queField.useemail = e; }" />
            <label for="pwfb-editfield-useemail" class="block mt-2 mb-1">Use this email to notify user about the status
              of their booking?</label>
          </div>

          <div v-if="['select', 'datalist'].includes(queField.type)" class="flex items-center gap-2 mt-2">
            <input type="checkbox" :checked="queField.alphOnSave" @click="queField.alphOnSave = !queField.alphOnSave">
            <label for="pwfb-editfield-label" class="block mt-2 mb-1">Alphabetize On Save?</label>
          </div>


          <label for="pwfb-editfield-required" class="block mt-3 mb-1"
            v-if="['checkbox-group', 'radio-group', 'select', 'datalist'].includes(queField.type)">Field Options</label>
          <div id="pwfb-editfield-valueslist" class=""
            v-if="['checkbox-group', 'radio-group', 'select', 'datalist'].includes(queField.type)">
            <div v-for="qfv, i in queField.values" :key="i" :style="{ gridTemplateColumns: '1fr 1fr 30px' }"
              class="grid mb-1">
              <CustomField :name="'pwfb-editfield-valuesitem-label' + i" type="text" placeholder="Label"
                columns="1fr 1fr" :value="qfv.label" @onResult="e => { queField.values[i].label = e; }" />
              <CustomField :name="'pwfb-editfield-valuesitem-value' + i" type="text" placeholder="Value"
                :value="qfv.value" @onResult="e => { queField.values[i].value = e; }" />
              <button @click="queField.values.splice(i, 1)" class="font-black text-white bg-red-800 rounded-md"
                v-if="queField.values.length > 1">&#10005;</button>
            </div>
            <button @click="queField.values.push({ label: '', value: '' })"
              class="p-1 mt-1 text-white bg-green-800 rounded-md">Add Option</button>
          </div>

          <div class="flex items-center gap-2" v-if="queField.content_type == 'field' && queField.type == 'text'">
            <CustomField class="mt-1" name="pwfb-editfield-index-name" type="checkbox" placeholder="Index as Name"
              columns="1fr 1fr" :value="form.declare.nameIndex == queField.id" :values="[
                { label: 'Yes', value: true },
                { label: 'No', value: false }
              ]" @onResult="e => form.declare.nameIndex = e ? queField.id : form.declare.nameIndex" />
            <label for="pwfb-editfield-required" class="block mt-2 mb-1">Index field as Name field</label>
          </div>

          <div class="flex items-center gap-2" v-if="queField.content_type == 'field' && queField.type == 'telephone'">
            <CustomField class="mt-1" name="pwfb-editfield-index-phone" type="checkbox" placeholder="Index as Name"
              columns="1fr 1fr" :value="form.declare.phoneIndex == queField.id" :values="[
                { label: 'Yes', value: true },
                { label: 'No', value: false }
              ]" @onResult="e => form.declare.phoneIndex = e ? queField.id : form.declare.phoneIndex" />
            <label for="pwfb-editfield-required" class="block mt-2 mb-1">Index field as Phone field</label>
          </div>



          <div class="flex justify-end w-[max-content] ml-auto gap-1 mt-4">
            <button @click="editField"
              class="block p-2 text-white transition bg-green-800 rounded-md hover:scale-105 active:scale-95">Save</button>
            <button @click="queField = null"
              class="block p-2 text-white transition bg-red-800 rounded-md hover:scale-105 active:scale-95">Cancel</button>
          </div>
        </div>
        <div class="p-3 rounded-b-lg" v-if="queField.content_type == 'text'">
          <label for="pwfb-editfield-text" class="block mt-2 mb-1">Content</label>
          <CustomField name="pwfb-editfield-text" type="text" placeholder="Enter text content" :value="queField.text"
            @onResult="e => { queField.text = e; }" />
          <label for="pwfb-editfield-textcss" class="block mt-2 mb-1">Inline CSS Styling</label>
          <CustomField name="pwfb-editfield-textcss" type="text" placeholder="Enter text content"
            :value="queField.styles" @onResult="e => { queField.styles = e; }" />

          <div class="flex justify-end w-[max-content] ml-auto gap-1 mt-4">
            <button @click="editField"
              class="block p-2 text-white transition bg-green-800 rounded-md hover:scale-105 active:scale-95">Save</button>
            <button @click="queField = null"
              class="block p-2 text-white transition bg-red-800 rounded-md hover:scale-105 active:scale-95">Cancel</button>
          </div>
        </div>
      </div>
    </div>

    <div class="fixed w-screen h-screen bg-black bg-opacity-50 z-[999] flex items-center justify-center top-0 left-0"
      v-if="migrateFieldMode">
      <div class="w-[400px] bg-white rounded-lg max-h-[80vh]">
        <div class="p-3 py-5 text-white bg-gray-900 rounded-t-lg">
          <h2 class="text-lg font-bold">Move Content</h2>
        </div>
        <div class="p-3">
          <label for="pwfb-pagetitle" class="block mb-2">Move To Page</label>
          <CustomField name="pwfb-formnavplacement" type="select" placeholder="e.g. Book Form" columns="1fr 1fr"
            :values="pagesMigrateSelect" :value="currentPageIndex" @onResult="e => targetPageIndex = e" />
          <button
            class="p-1 px-2 mt-2 mr-1 text-white transition bg-green-800 rounded-md hover:scale-105 active:scale-95"
            @click="migrateField">Move</button>
          <button class="p-1 px-2 mt-2 mr-1 text-white transition bg-red-800 rounded-md hover:scale-105 active:scale-95"
            @click="migrateFieldMode = false">Cancel</button>
        </div>
      </div>

    </div>
    <h1 class="pb-3 text-3xl font-bold border-b">Form Builder</h1>
    <div id="main_grid" class="grid h-full gap-3 mt-5 bg-gray-100"
      style="grid-template-columns: 400px 1fr;grid-template-rows: 70px 1fr;">
      <div class="flex col-span-2 gap-3 p-3 bg-white shadow-md"> <!-- builder header -->
        <div class="flex items-center gap-2">
          Form Title
          <CustomField name="pwfb-formtitle" :value="form.form_title" @onResult="e => form.form_title = e"
            placeholder="e.g. Book Form" />
          <div class="flex items-center gap-2">
            Select Page
            <CustomField type="select" :value="currentPageIndex" :values="pagesSelect" name="pwfb-pageselect"
              placeholder="e.g. Book Form" @onResult="e => selectPage(e)" :styles="{ input: 'p-[5px] border-none' }" />
          </div>
          <div>
            <button class="p-2 mr-2 text-white transition bg-blue-700 rounded-md hover:scale-105 active:scale-95"
              @click="manageExtensionsMode = !manageExtensionsMode">Third-Party Credentials</button>
            <button class="p-2 mr-2 text-white transition bg-teal-700 rounded-md hover:scale-105 active:scale-95"
              @click="modifyConditionalEffects = !modifyConditionalEffects">Conditional Effects</button>
            <button class="p-2 mr-2 text-white transition bg-yellow-600 rounded-md hover:scale-105 active:scale-95"
              @click="modifyCSS">Modify CSS</button>
            <button class="p-2 mr-2 text-white transition bg-green-600 rounded-md hover:scale-105 active:scale-95"
              @click="saveChanges">Save Changes</button>
            <button class="p-2 text-white transition bg-red-600 rounded-md hover:scale-105 active:scale-95"
              @click="cancelEdit">Cancel</button>
          </div>
        </div>
      </div><!-- /builder header -->

      <div class="p-5 bg-white shadow-md"> <!-- builder aside -->
        <h2 for="pwfb-pagecolumns" class="block mt-5 mb-2 text-lg font-bold text-gray-700">Form Layout</h2>
        <label for="pwfb-formcolor" class="block mb-2">Accent Color</label>
        <input type="color" class="w-full p-2 overflow-hidden rounded-md" id="pwfb-formcolor"
          :value="form.design.primaryColor" @change="form.design.primaryColor = $event.target.value">
        <label for="pwfb-formnavplacement" class="block mt-3 mb-2">Navigation Placement</label>
        <CustomField name="pwfb-formnavplacement" type="radio-group" placeholder="e.g. Book Form" columns="1fr 1fr"
          :values="[
            { label: 'Top', value: 'column' },
            { label: 'Left', value: 'row' }
          ]" :value="form.design.pagenavDesign" @onResult="e => { form.design.pagenavDesign = e; }" />
        <h2 class="block mt-5 mb-2 text-lg font-bold text-gray-700">Notifications</h2>
        <p class="mb-2">Check the email addresses where you want to receive a notification about a client's submission:
        </p>
        <p v-if="emails.length == 0" class="italic">No emails added...</p>
        <div class="max-h-[200px] overflow-y-auto">
          <CustomField type="checkbox-group" :select="form.declare.notifEmails" :values="emails"
            @onResult="e => form.declare.notifEmails = e" />
        </div>
        <h2 for="pwfb-pagecolumns" class="block mt-5 mb-2 text-lg font-bold text-gray-700">Page Settings</h2>
        <label for="pwfb-pagetitle" class="block mb-2">Page Title</label>
        <CustomField name="pwfb-pagetitle" :value="currentPage.page_title" @onResult="e => currentPage.page_title = e"
          placeholder="e.g. Pick Your Schedule" :styles="{ input: 'p-[5px] border-none' }" />
        <label for="pwfb-pagecolumns" class="block mt-3 mb-2">Columns</label>
        <CustomField name="pwfb-pagecolumns" type="radio-group" placeholder="e.g. Book Form" columns="1fr 1fr" :values="[
          { label: '1', value: 1 },
          { label: '2', value: 2 }
        ]" :value="currentPage.page_columns" @onResult="e => { currentPage.page_columns = e; }" />
        <button @click="deletePage"
          class="transition bg-red-700 text-white p-1.5 rounded-md mt-2 hover:scale-105 active:scale-95"
          v-if="form.pages.length > 1">Delete Page</button>

        <h2 for="pwfb-pagecolumns" class="block mt-5 mb-2 text-lg font-bold text-gray-700">Content</h2>
        <div class="">
          <div class="flex items-center justify-between gap-1 p-1 py-1 mb-1 border border-gray-300 rounded-md"
            v-for="f, i in fields" :key="i">
            <span class="truncate grow">{{ f.content_type == 'field' ? f.label : f.text }} <span
                v-if="['rbfield', 'scheduler'].includes(f.content_type)" class="text-red-700">*</span></span>
            <div class="flex">
              <button title="Move Content Up" @click="moveFieldUp(i)"
                class="transition bg-gray-900 text-white mx-[1px] p-[2px] py-[5px] rounded-sm hover:scale-105 active:scale-95"
                v-if="i != 0"><i v-html="icons.arrowUpSmall"></i></button>
              <button title="Move Content Down" @click="moveFieldDown(i)"
                class="transition bg-gray-900 text-white mx-[1px] p-[2px] py-[5px] rounded-sm hover:scale-105 active:scale-95"
                v-if="i != fields.length - 1"><i v-html="icons.arrowDownSmall"></i></button>
              <button title="Edit" @click="queField = JSON.parse(JSON.stringify(f)); targetFieldIndex = i"
                class="transition bg-yellow-600 text-gray-900 mx-[1px] p-[2px] py-[5px] rounded-sm hover:scale-105 active:scale-95"><i
                  v-html="icons.pencil"></i></button>
              <button title="Move To Page" @click="targetFieldIndex = i; migrateFieldMode = true"
                class="transition bg-yellow-600 text-gray-900 mx-[1px] p-[2px] py-[5px] rounded-sm hover:scale-105 active:scale-95"><i
                  v-html="icons.arrowTopRightBox"></i></button>
              <button title="Delete" @click="deleteField(i)"
                v-if="fields.length > 1 && !['rbfield', 'scheduler'].includes(f.content_type)"
                class="transition bg-red-600 text-gray-900 mx-[1px] p-[2px] py-[5px] rounded-sm hover:scale-105 active:scale-95"><i
                  v-html="icons.trash"></i></button>
            </div>
          </div>
        </div>
        <div id="fieldTypeToAdd" v-if="addFieldMode" class="mt-5">
          <h2 for="pwfb-pagecolumns" class="block mt-5 mb-2 font-bold text-gray-700 text-md">What type of content?</h2>
          <CustomField name="pwfb-fieldtype" type="radio-group" placeholder="e.g. Book Form" columns="1fr 1fr"
            value="text" :values="[
              { label: 'Text', value: 'text' },
              { label: 'Field', value: 'field' }
            ]" @onResult="e => { addFieldType = e; }" />
        </div>

        <button @click="addField"
          class="transition bg-green-700 text-white p-1.5 rounded-md mt-2 mr-1 hover:scale-105 active:scale-95">{{
            addFieldMode ? 'Confirm' : 'Add Content' }}</button>
        <button @click="addFieldMode = false"
          class="transition bg-red-700 text-white p-1.5 rounded-md mt-2 hover:scale-105 active:scale-95"
          v-if="addFieldMode">Cancel</button>

        <p class="mt-2 text-sm"><strong class="text-sm">Note:</strong> If content has an (*) symbol after its label, it
          is required to have in any page and cannot be deleted. If you did not add any service, worker or location, it
          will automatically be hidden from the form.</p>

      </div> <!-- builder aside -->
      <div> <!-- builder form view -->
        <!-- <div class="p-5 mb-5 bg-white">
          <h2 class="mb-2 text-xl font-bold">Extensions</h2>
          PayPal
        </div> -->
        <div class="p-5 mb-5 text-gray-800 bg-white" v-if="manageExtensionsMode">
          <h2 class="mb-2 text-xl font-bold">Third-Party Credentials</h2>
          <div class="grid" style="grid-template-columns: 1fr 1fr 370px;">
            <div>
              <label for="pwfbtpc-paypal" class="block mb-1">PayPal Client ID</label>
              <CustomField name="pwfbtpc-paypal" placeholder="Paste your PayPal Client ID here"
                :value="form.declare.paypalClientID" @onResult="e => form.declare.paypalClientID = e" />
            </div>
            <div>
              <label for="pwfbtpc-paypal" class="block mb-1">PayPal Client ID</label>
              <CustomField name="pwfbtpc-paypal" placeholder="Enter your Paypal Email" :value="form.declare.paypalEmail"
                @onResult="e => form.declare.paypalEmail = e" />
            </div>
            <div>
              <label for="pwfbtpc-paypal" class="block mb-1">Currency</label>
              <CustomField name="pwfbtpc-paypalcurrency" type="select" :value="form.declare.paypalCurrency"
                @onResult="e => form.declare.paypalCurrency = e" :values="[
                  { label: 'Australian Dollar (AUD)', value: 'AUD' },
                  { label: 'Brazilian Real (BRL)', value: 'BRL' },
                  { label: 'Canadian Dollar (CAD)', value: 'CAD' },
                  { label: 'Swiss Franc (CHF)', value: 'CHF' },
                  { label: 'Czech Koruna (CZK)', value: 'CZK' },
                  { label: 'Danish Krone (DKK)', value: 'DKK' },
                  { label: 'Euro (EUR)', value: 'EUR' },
                  { label: 'British Pound (GBP)', value: 'GBP' },
                  { label: 'Hong Kong Dollar (HKD)', value: 'HKD' },
                  { label: 'Hungarian Forint (HUF)', value: 'HUF' },
                  { label: 'Israeli New Shekel (ILS)', value: 'ILS' },
                  { label: 'Japanese Yen (JPY)', value: 'JPY' },
                  { label: 'Malaysian Ringgit (MYR)', value: 'MYR' },
                  { label: 'Mexican Peso (MXN)', value: 'MXN' },
                  { label: 'Norwegian Krone (NOK)', value: 'NOK' },
                  { label: 'New Zealand Dollar (NZD)', value: 'NZD' },
                  { label: 'Philippine Peso (PHP)', value: 'PHP' },
                  { label: 'Polish Zloty (PLN)', value: 'PLN' },
                  { label: 'Russian Ruble (RUB)', value: 'RUB' },
                  { label: 'Swedish Krona (SEK)', value: 'SEK' },
                  { label: 'Singapore Dollar (SGD)', value: 'SGD' },
                  { label: 'Thai Baht (THB)', value: 'THB' },
                  { label: 'Taiwan New Dollar (TWD)', value: 'TWD' },
                  { label: 'United States Dollar (USD)', value: 'USD' }
                ]" />
            </div>
          </div>


        </div>

        <div class="p-5 mb-5 text-gray-800 bg-white" v-if="modifyConditionalEffects">
          <h2 class="text-xl font-bold ">Conditional Effects <small class="italic font-normal ">(for developers only,
              proceed with caution)</small></h2>
          <!-- <p class="mb-2">This area is at its experimental stage and uses text-based ruling which may require you to learn its proper syntax.</p> -->
          <!-- <ConditionScriptor :form="form" @onInterpret="e =>form.conditionals = e"/> -->

          <JSEffects :form="form" :js="form.conditionals" @changeCode="e =>{form.conditionals = e}"  />
        </div>

        <div class="p-5 mb-5 bg-white" v-if="modifyCSSMode">
          <h2 class="mb-2 text-xl font-bold">Custom CSS <small class="italic font-normal ">(for developers only, proceed
              with caution)</small></h2>
          <strong>Note:</strong> Modifying the CSS code below overrides <em
            class="font-bold text-slate-700 bg-slate-200">'Form Layout'</em> settings. Click <em
            class="font-bold text-slate-700 bg-slate-200">'Discard Custom CSS'</em> to restore default layout.
          Discarding custom CSS deletes code changes and cannot be undone
          <div>
            <code-mirror :css="queCSS" @change="e => queCSS = e"></code-mirror>
          </div>
          <button class="p-2 mr-2 transition bg-gray-200 rounded-md hover:scale-105 active:scale-95"
            @click="defaultCSS">Default CSS</button>
          <button class="p-2 mr-2 text-white transition bg-blue-600 rounded-md hover:scale-105 active:scale-95"
            @mousedown="previewFormCSS" @mouseup="cancelPreviewFormCSS">Hold to Preview</button>
          <button class="p-2 mr-2 text-white transition bg-green-700 rounded-md hover:scale-105 active:scale-95"
            @click="saveCSSChanges">Save</button>
          <button class="p-2 mr-2 text-white transition bg-red-700 rounded-md hover:scale-105 active:scale-95"
            @click="cancelCSSChanges">Cancel</button>
          <button class="p-2 mr-2 text-white transition bg-red-900 rounded-md hover:scale-105 active:scale-95"
            @click="discardCustomCSS">Discard Custom CSS</button>
        </div>
        <form-view v-if="!formRefresh" :form="JSON.parse(JSON.stringify(form))" :page="currentPageIndex"></form-view>
      </div> <!-- builder form view -->
    </div>
  </div>
</template>
