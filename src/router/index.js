import { createRouter, createWebHistory } from 'vue-router'
import AdminLayout from '@/layouts/AdminLayout.vue'
import LoginView from '@/views/LoginView.vue'
import DashboardView from '@/views/DashboardView.vue'
import PedidosView from '@/views/PedidosView.vue'
import UsuariosView from '@/views/UsuariosView.vue'
import ProductosView from '@/views/ProductosView.vue'

const routes = [
  { path: '/login', name: 'Login', component: LoginView },
  {
    path: '/',
    component: AdminLayout,
    children: [
      { path: '', redirect: '/dashboard' },
      { path: 'dashboard', name: 'Dashboard', component: DashboardView },
      { path: 'pedidos', name: 'Pedidos', component: PedidosView },
      { path: 'usuarios', name: 'Usuarios', component: UsuariosView },
      { path: 'productos', name: 'Productos', component: ProductosView }
    ]
  },
  { path: '/:pathMatch(.*)*', redirect: '/dashboard' }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach(to => {
  const autenticado = !!localStorage.getItem('admin_token')

  if (to.path !== '/login' && !autenticado) return '/login'
  if (to.path === '/login' && autenticado) return '/dashboard'
})

export default router