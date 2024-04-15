<script setup>
import MasterLayoutVue from "../components/MasterLayout.vue";
import icons from '../assets/icons';
import {onMounted, ref} from 'vue';
import {axios} from '../functions'
import router from "../router";
import CustomField from "../components/SchedulerComps/CustomField.vue";
let modal = ref({
  open:false,
  title: 'Add Location',
  placeholder: 'Enter Location',
  preference:'',
  id:''
});

let emailmodal = ref({
  open:false,
  queue:{}
});

let locations = ref([])
let services = ref([])
let workers = ref([])
let emails = ref([])
let forms = ref([])
let passwordShown = ref([false,false,false]);
let changePasswordObj = ref({
  id: 1,
  oldpassword: '',
  newpassword: '',
  cnfnewpassword: ''
});
let changePasswordErrMsg = ref({s:false,m:''});
let input = ref('')
let price = ref('')

onMounted(()=>{
  refetch();
})

function changePassword(){
  if(changePasswordObj.value.cnfnewpassword.length < 8) { changePasswordErrMsg.value = {s:false,m:'Password must be at least 8 characters long!'};return;}
  if(changePasswordObj.value.newpassword != changePasswordObj.value.cnfnewpassword) { changePasswordErrMsg.value = {s:false,m:'New Password and Confirm New Password must match!'};return;}
  axios.post('users/newpassword',null,changePasswordObj.value).then(res=>{
    if(res.data == null || res.data.success == null) { changePasswordErrMsg.value = {s:false,m:'Something went wrong! Please try to refresh the page!'};return;}
    if(res.data.success == false || res.data.success == 'false') { changePasswordErrMsg.value = {s:false,m:res.data.msg};return;}
    changePasswordErrMsg.value = {s:true,m:'Password updated successfuly!'};
  })
}

function openModal(title,placeholder,preference='',id=''){
  modal.value = {open:true,title:title,placeholder:placeholder, preference:preference, id:id}
}

function openEmailModal(e){
  emailmodal.value = {open:true,queue:JSON.parse(JSON.stringify(e))}
}

function refetch(){
  axios.post('location/fetch','default').then(res=>{
    if(!res.data.success) return;
    locations.value = res.data.result;
  })

  axios.post('notification/fetch','default').then(res=>{
    if(!res.data.success) return;
    emails.value = res.data.result;
  })

  axios.post('services/fetch','default').then(res=>{
    if(!res.data.success) return;
    services.value = res.data.result;
  })

  axios.post('worker/fetch','default').then(res=>{
    if(!res.data.success) return;
    workers.value = res.data.result;
  })
}

function saveChanges(){
  let modalInfo = JSON.parse(JSON.stringify(modal.value))
  modal.value.open = false;
  switch(modalInfo.preference){
    case 'location': saveLocation(input.value,modalInfo.id); break;
    case 'services': saveService(input.value,price.value,modalInfo.id); break;
    case 'worker': saveWorker(input.value,modalInfo.id); break;
  }
  input.value = '';
  price.value = '';
  modal.value.id = '';
}

function saveLocation(value,id){
  let objToAdd = {book_location_name:value}
  if(['0',0,'',null].includes(price)) delete objToAdd.book_services_price;

  if(id=='') {
    axios.post('location/create',null,objToAdd).then(res=>{
      if(!res.data.success) return;
      router.go('/preferences')
    });
  }else{
    axios.post('location/update?id='+id,null,objToAdd).then(res=>{
      if(!res.data.success) return;
      router.go('/preferences')
  });
  }
}

function saveWorker(value,id){
  let objToAdd = {book_worker_name:value}
  if(['0',0,'',null].includes(price)) delete objToAdd.book_services_price;

  if(id=='') {
    axios.post('worker/create',null,objToAdd).then(res=>{
      if(!res.data.success) return;
      router.go('/preferences')
    });
  }else{
    axios.post('worker/update?id='+id,null,objToAdd).then(res=>{
      if(!res.data.success) return;
      router.go('/preferences')
  });
  }
}

function deleteItem(endpoint,id){
  if(!confirm('Are you sure you want to delete this item?')) return;
  console.log(endpoint+'/delete?id='+id)
  axios.post(endpoint+'/delete?id='+id,null).then(res=>{
    if(!res.data.success) return;
      router.go('/preferences')
  });
}

function saveEmailChanges(){
  if(emailmodal.value.queue.book_email_id == null){
    axios.post('notification/create',null,{
      book_email_address: emailmodal.value.queue.book_email_address
    }).then(res=>{
      if(!res.data.success) return;
      router.go('/preferences')
    });
  }else{
    axios.post('notification/update?id='+emailmodal.value.queue.book_email_id,null,{
      book_email_address: emailmodal.value.queue.book_email_address
    }).then(res=>{
      if(!res.data.success) return;
      router.go('/preferences')
    });
  }
}

function saveService(value,price='',id=''){
  console.log(price)
  let objToAdd = {
      book_services_id:id,
      book_services_name:value,
      book_services_price:price
  }
  if(['',null].includes(price)) objToAdd.book_services_price = null;
  if(id=='') {
    axios.post('services/create',null,objToAdd).then(res=>{
      if(!res.data.success) return;
      router.go('/preferences')  
    });
  }else{
    axios.post('services/update?id='+id,null,objToAdd).then(res=>{
      if(!res.data.success) return;
      router.go('/preferences')  
  });
  }
  
}

</script>

<template>
  <!-- -z-10 opacity-0 -->
  <div id="modal_parent" class="transition w-screen h-screen fixed top-0 left-0" style="background: rgb(0,0,0,0.3);" :class="(modal.open) ? '' : 'opacity-0'" :style="modal.open ? 'z-index:999' :'z-index:-10'">
    <div id="modal_box" class="absolute max-w-[500px] w-10/12 bg-white top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] rounded-md">
      <div id="modal_header" class="p-5 bg-gray-900 rounded-md rounded-b-none text-white grid" style="grid-template-columns: 1fr 30px;">
        <h2 class="font-bold">{{modal.title}}</h2>
        <button class="transition hover:scale-105 active:scale-95" @click="modal.open = false;input = '';input='';price='';">&#10006;</button>
      </div>
      <form id="modal_body" class="p-5" @submit.prevent="saveChanges">
        <input class="border border-gray-300 w-full rounded-[3px] p-[5px] outline-none mb-2" :placeholder="modal.placeholder" required v-model="input">
        <input class="border border-gray-300 w-full rounded-[3px] p-[5px] outline-none mb-2" type="number" min="0" placeholder="Enter Service Price (e.g. $10) [optional]" v-if="modal.preference=='services'" v-model="price">
        <button class="transition hover:scale-105 active:scale-95 bg-green-700 text-white p-1.5 rounded-[3px] ml-auto mr-0 block" style="width: max-content;">Submit</button>
      </form>
    </div>
  </div>
  <div id="modal_parent_email" class="transition w-screen h-screen fixed top-0 left-0" style="background: rgb(0,0,0,0.3);" :style="emailmodal.open ? 'z-index:999;opacity:1' :'z-index:-10;opacity:0'">
    <div id="modal_box_email" class="absolute max-w-[500px] w-10/12 bg-white top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] rounded-md">
      <div id="modal_header_email" class="p-5 bg-gray-900 rounded-md rounded-b-none text-white grid" style="grid-template-columns: 1fr 30px;">
        <h2 class="font-bold text-ellipsis overflow-hidden whitespace-pre">Email: {{ emailmodal.queue.book_email_address }}</h2>
        <button class="transition hover:scale-105 active:scale-95" @click="emailmodal={open:false,queue:{}}">&#10006;</button>
      </div>
      <form id="modal_body_email" class="p-5" @submit.prevent="saveEmailChanges()">
        <label for="pwprf-emailedit" class="mb-2 block">Email Address</label>
        <CustomField
          type="email"
          name="pwprf-emailedit"
          placeholder="Enter your email"
          :value="emailmodal.queue.book_email_address"
          :values="forms"
          @on-result="e=>emailmodal.queue.book_email_address = e"
        />
        <button class="mt-2 transition hover:scale-105 active:scale-95 bg-green-700 text-white p-1.5 rounded-[3px] ml-auto mr-0 block" style="width: max-content;">Submit</button>
      </form>
    </div>
  </div>
  <MasterLayoutVue>
    <h1 class="text-3xl font-bold border-b pb-3">Preferences</h1>
    <div id="change_access" class="mb-3 pb-3">
      <h2 class="text-xl font-bold mt-2">Update Admin Access</h2>
      <div class="flex gap-2 mt-3">
          <label class="relative"><input v-model="changePasswordObj.oldpassword" :type="!passwordShown[0] ? 'password' : 'text'" class="outline-none border border-gray-400 rounded py-1 px-2 focus:border-gray-700 transition" placeholder="Current Password"><i @click="passwordShown[0] = !passwordShown[0]" v-html="passwordShown[0] ? icons.eyeSlash: icons.eye" class="absolute top-[50%] translate-y-[-50%] right-[5px]"></i></label>
          <label class="relative"><input v-model="changePasswordObj.newpassword" :type="!passwordShown[1] ? 'password' : 'text'" class="outline-none border border-gray-400 rounded py-1 px-2 focus:border-gray-700 transition" placeholder="New Password"><i @click="passwordShown[1] = !passwordShown[1]" v-html="passwordShown[1] ? icons.eyeSlash: icons.eye" class="absolute top-[50%] translate-y-[-50%] right-[5px]"></i></label>
          <label class="relative"><input v-model="changePasswordObj.cnfnewpassword" :type="!passwordShown[2] ? 'password' : 'text'" class="outline-none border border-gray-400 rounded py-1 px-2 focus:border-gray-700 transition" placeholder="Confirm New Password"><i @click="passwordShown[2] = !passwordShown[2]" v-html="passwordShown[2] ? icons.eyeSlash: icons.eye" class="absolute top-[50%] translate-y-[-50%] right-[5px]"></i></label>
          <button class="bg-gray-900 transition text-white rounded py-1 px-2" @click="changePassword">Change Password</button>
      </div>
      <p class="bg-red-100 w-max min-w-[200px] mt-2 text-red-900 px-2 py-1 rounded border-red-200 border" v-if="changePasswordErrMsg.m != '' && changePasswordErrMsg.s == false">{{ changePasswordErrMsg.m }}</p>
      <p class="bg-green-100 w-max min-w-[200px] mt-2 text-green-900 px-2 py-1 rounded border-green-200 border" v-if="changePasswordErrMsg.m != '' && changePasswordErrMsg.s == true">{{ changePasswordErrMsg.m }}</p>
      
    </div>
    <div id="notif_receivers" class="mb-3 pb-3">
      <div class="flex justify-between items-center mb-1"> 
          <h2 class="text-xl font-bold">Email Notification</h2>
          <button class="flex items-center r -[3px] rounded-md border-gray-200 hover:scale-105 active:scale-95 active:bg-gray-900 active:text-white active:border-gray-900 transition" @click="openEmailModal({book_email_address:'',book_email_id:null})"><i class="block mr-1" v-html="icons.add"></i>Add Email</button>
        </div>
      <p class="mb-2">Get notified when a customer/client submits an entry.</p>
      <ul v-if="emails.length > 0">
        <li class="bg-white grid border mx-[-0.25rem] py-1 px-2 rounded-[4px] border-gray-200 items-center mb-1" style="grid-template-columns: 1fr 30px 30px;" v-for="em,i in emails" :key="i">
            <p>{{ em.book_email_address }}</p>
            <button class="hover:scale-105 active:scale-95 transition" @click="openEmailModal(em)"><i v-html="icons.pencil"></i></button>
            <button class="hover:scale-105 active:scale-95 transition"><i v-html="icons.trash" @click="deleteItem('notification',em.book_email_id)"></i></button>
          </li>
      </ul>
      <p v-if="emails.length == 0">No emails added...</p>
    </div>

    <div id="main_grid" class="y-5 grid xl:grid-cols-2 grid-cols-1 gap-5 ">
      <div class="xl:border-r xl:pr-3"> <!-- preference boxes-->
        <div class="flex justify-between items-center mb-5"> <!-- preference headers-->
          <h2 class="text-lg font-bold">Locations</h2>
          <button class="flex items-center r -[3px] rounded-md border-gray-200 hover:scale-105 active:scale-95 active:bg-gray-900 active:text-white active:border-gray-900 transition" @click="openModal('Add Location', 'Enter Location','location')"><i class="block mr-1" v-html="icons.add"></i>Add Location</button>
        </div>
        <ul>
          <li class="bg-white grid border m-1 py-1 px-2 rounded-[4px] border-gray-200" style="grid-template-columns: 1fr 30px 30px;" v-for="l,i in locations" :key="i">
            <p>{{ l.book_location_name }}</p>
            <button class="hover:scale-105 active:scale-95 transition" @click="openModal('Edit Location', 'Enter Location Name','location',l.book_location_id);input=l.book_location_name;"><i v-html="icons.pencil"></i></button>
            <button class="hover:scale-105 active:scale-95 transition"><i v-html="icons.trash" @click="deleteItem('location',l.book_location_id)"></i></button>
          </li>
        </ul>
      </div>
  
      <div class=""> <!-- preference boxes-->
        <div class="flex justify-between items-center mb-5"> <!-- preference headers-->
          <h2 class="text-lg font-bold">Workers</h2>
          <button class="flex items-center  p-[3px] rounded-md border-gray-200 hover:scale-105 active:scale-95 active:bg-gray-900 active:text-white active:border-gray-900 transition" @click="openModal('Add Worker', 'Enter Worker','worker')"><i class="block mr-1" v-html="icons.add"></i>Add Worker</button>
        </div>
        <ul>
          <li class="bg-white grid border m-1 py-1 px-2 rounded-[4px] border-gray-200" style="grid-template-columns: 1fr 30px 30px;" v-for="w,i in workers" :key="i">
            <p>{{ w.book_worker_name }}</p>
            <button class="hover:scale-105 active:scale-95 transition" @click="openModal('Edit Worker', 'Enter Worker Name','worker',w.book_worker_id);input=w.book_worker_name;"><i v-html="icons.pencil"></i></button>
            <button class="hover:scale-105 active:scale-95 transition"><i v-html="icons.trash" @click="deleteItem('worker',w.book_worker_id)"></i></button>
          </li>
        </ul>
      </div>

      <div class=""> <!-- preference boxes-->
        <div class="flex justify-between items-center mb-5"> <!-- preference headers-->
          <h2 class="text-lg font-bold">Services</h2>
          <button class="flex items-center p-[3px] rounded-md border-gray-200 hover:scale-105 active:scale-95 active:bg-gray-900 active:text-white active:border-gray-900 transition" @click="openModal('Add Services', 'Enter Services','services')"><i class="block mr-1" v-html="icons.add"></i>Add Services</button>
        </div>
        <ul>
          <li class="bg-white grid border m-1 py-1 px-2 rounded-[4px] border-gray-200" style="grid-template-columns: 1fr 30px 30px;" v-for="s,i in services" :key="i">
            <p>{{ s.book_services_name }} <span v-if="s.book_services_price" class="inline-block relative pl-3 ml-2 italic before:content-[''] before:bg-gray-900 before:w-1 before:h-1 before:absolute before:top-[10px] before:rounded-full before:left-0">${{ s.book_services_price }}</span></p>
            <button class="hover:scale-105 active:scale-95 transition" @click="openModal('Edit Service', 'Enter Service','services',s.book_services_id);input=s.book_services_name;price=s.book_services_price"><i v-html="icons.pencil"></i></button>
            <button class="hover:scale-105 active:scale-95 transition"><i v-html="icons.trash" @click="deleteItem('services',s.book_services_id)"></i></button>
          </li>
        </ul>
      </div>
    </div>

  </MasterLayoutVue>
</template>
