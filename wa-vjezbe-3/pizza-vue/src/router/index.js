import { createRouter, createWebHistory } from 'vue-router'
import PizzaList from '../components/PizzaList.vue'
import PizzaDetalji from '../components/PizzaDetalji.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'pizze', component: PizzaList },
    { path: '/pizze/:naziv', name: 'pizza-detalji', component: PizzaDetalji },
  ],
  scrollBehavior() {
    return { top: 0 }
  },
})

export default router