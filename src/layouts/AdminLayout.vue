<template>
  <vlayout class="admin-layout">
    <!-- Menú lateral -->
    <v-navigation-drawer v-model="drawer" :permanent="!esMovil" :temporary="esMovil" width="220" color="#17252c"
      theme="dark">
      <div class="sidebar-brand d-flex align-center ga-2">
        <v-icon size="34" color="success">
          mdi-truck-fast
        </v-icon>
        <span>SwiftLoad</span>
      </div>

      <v-list nav density="comfortable" class="px-3 py-2">
        <v-list-item v-for="item in menu" :key="item.title" :to="item.to" :prepend-icon="item.icon" :title="item.title"
          :active="$route.path === item.to" active-color="white" rounded="lg" class="menu-item mb-2" />
      </v-list>

      <template #append>
        <div class="pa-3 pb-5">
          <v-divider color="white" class="mb-3" />

          <v-btn block variant="text" color="red-lighten-2" prepend-icon="mdi-logout" @click="cerrarSesion">
            Cerrar sesión
          </v-btn>
        </div>
      </template>
    </v-navigation-drawer>

    <!-- Barra superior -->
    <v-app-bar flat color="white" class="topbar px-4">
      <v-app-bar-nav-icon v-if="esMovil" @click="drawer = !drawer" />

      <v-spacer />

      <v-btn icon variant="text" aria-label="Notificaciones">
        <v-badge color="error" content="1" floating>
          <v-icon>mdi-bell-outline</v-icon>
        </v-badge>
      </v-btn>

      <v-menu>
        <template #activator="{ props }">
          <v-btn v-bind="props" variant="text" class="profile-button">
            <v-avatar color="blue" size="38" class="mr-2">
              <span class="text-white">A</span>
            </v-avatar>

            <div class="profile-text">
              <strong>Administrador</strong>
              <small>Administrador</small>
            </div>

            <v-icon class="ml-2">
              mdi-chevron-down
            </v-icon>
          </v-btn>
        </template>

        <v-list>
          <v-list-item title="Mi perfil" prepend-icon="mdi-account-outline" @click="$router.push('/configuracion')" />

          <v-list-item title="Cerrar sesión" prepend-icon="mdi-logout" @click="cerrarSesion" />
        </v-list>
      </v-menu>
    </v-app-bar>

    <!-- Contenido de la ruta activa -->
    <v-main class="admin-main">
      <router-view />
    </v-main>
  </vlayout>
</template>

<script>
export default {
  name: 'AdminLayout',

  data() {
    return {
      drawer: true,
      esMovil: false,

      menu: [
        { title: 'Dashboard', icon: 'mdi-view-dashboard', to: '/dashboard' },
        { title: 'Pedidos', icon: 'mdi-clipboard-list', to: '/pedidos' },
        { title: 'Usuarios', icon: 'mdi-account-group', to: '/usuarios' },
        { title: 'Productos', icon: 'mdi-package-variant-closed', to: '/productos' },
        { title: 'Categorías', icon: 'mdi-tag-multiple', to: '/categorias' },
        { title: 'Repartidores', icon: 'mdi-moped', to: '/repartidores' },
        { title: 'Reportes', icon: 'mdi-chart-box-outline', to: '/reportes' },
        { title: 'Configuración', icon: 'mdi-cog-outline', to: '/configuracion' }
      ]
    }
  },

  mounted() {
    this.actualizarAncho()
    window.addEventListener('resize', this.actualizarAncho)
  },

  beforeUnmount() {
    window.removeEventListener('resize', this.actualizarAncho)
  },

  methods: {
    actualizarAncho() {
      this.esMovil = window.innerWidth < 960
      this.drawer = !this.esMovil
    },

    cerrarSesion() {
      localStorage.removeItem('admin_token')
      localStorage.removeItem('admin_usuario')
      this.$router.push('/login')
    }
  }
}
</script>

<style scoped>
.admin-layout {
  min-height: 100vh;
  width: 100%;
  background: #f3f7fa;
}

.sidebar-brand {
  padding: 24px 18px;
  font-size: 23px;
  font-weight: 800;
  font-style: italic;
}

.menu-item {
  font-size: 14px;
}

.topbar {
  border-bottom: 1px solid #e8edf2;
}

.profile-button {
  height: 60px;
  text-transform: none;
}

.profile-text {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  line-height: 1.5;
}

.profile-text strong {
  font-size: 13px;
}

.profile-text small {
  color: #64748b;
  font-size: 11px;
}

.admin-main {
  min-width: 0;
  background: #f3f7fa;
}

@media (max-width: 600px) {
  .topbar {
    padding-inline: 4px !important;
  }

  .profile-text {
    display: none;
  }
}
</style>