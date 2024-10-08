import { createRouter, createWebHistory } from 'vue-router'
import { lStore } from '../functions'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect:'/scheduler'
    },
    {
      path: '/form',
      name: 'form',
      component: ()=> import('../views/FormView.vue')
    },
    {
      path: '/login',
      name: 'Login',
      component: ()=> import('../views/LoginView.vue')
    },
    {
      path: '/scheduler',
      name: 'Scheduler',
      component: ()=> import('../views/SchedulerView.vue')
    },
    {
      path: '/appointments',
      name: 'Appointments',
      component: ()=> import('../views/AppointmentsView.vue')
    },
    {
      path: '/form-builder',
      name: 'FormBuilder',
      component: ()=> import('../views/FormBuilderView.vue')
    },
    {
      path: '/forms',
      name: 'FormsView',
      component: ()=> import('../views/FormsView.vue')
    },
    {
      path: '/preferences',
      name: 'Preferences',
      component: ()=> import('../views/PreferencesView.vue')
    },
    {
      path: '/test',
      name: 'test',
      component: ()=> import('../views/TestView.vue')
    },
    {
      path: '/print',
      name: 'print',
      component: ()=> import('../views/PrintContent.vue')
    },
  ]
})

export default router
