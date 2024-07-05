import { createRouter, createWebHistory } from 'vue-router'
import TripList from '../components/TripList.vue'
import TripDetail from '../components/TripDetail.vue'

const routes = [
  { path: '/', component: TripList },
  { path: '/detail', name: 'TripDetail', component: TripDetail }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
