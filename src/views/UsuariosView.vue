<template>
    <div class="usuarios-page">
        <!-- Encabezado -->
        <div class="d-flex align-center justify-space-between flex-wrap ga-3 mb-6">
            <h1 class="text-h5 font-weight-bold">Usuarios</h1>

            <v-btn class="d-sm-none" color="success" prepend-icon="mdi-plus" @click="nuevoUsuario">
                Nuevo usuario
            </v-btn>
        </div>

        <!-- Buscador, filtro y botón -->
        <v-row align="center" class="mb-2">
            <v-col cols="12" sm="5" md="4">
                <v-text-field v-model="busqueda" label="Buscar usuarios" placeholder="Nombre o correo..."
                    prepend-inner-icon="mdi-magnify" variant="outlined" density="compact" hide-details clearable />
            </v-col>

            <v-col cols="12" sm="4" md="3">
                <v-select v-model="rolSeleccionado" :items="roles" label="Rol" variant="outlined" density="compact"
                    hide-details />
            </v-col>

            <v-spacer />

            <v-col cols="12" sm="3" md="3" class="text-sm-right">
                <v-btn class="d-none d-sm-inline-flex" color="success" prepend-icon="mdi-plus" @click="nuevoUsuario">
                    Nuevo usuario
                </v-btn>
            </v-col>
        </v-row>

        <!-- Tabla -->
        <v-card rounded="lg" elevation="1" class="users-card">
            <v-table>
                <thead>
                    <tr>
                        <th class="text-left">Usuario</th>
                        <th class="text-left sortable-header" @click="ordenarPor('nombre')">
                            Nombre
                            <v-icon size="small">{{ iconoOrden('nombre') }}</v-icon>
                        </th>
                        <th class="text-left sortable-header" @click="ordenarPor('correo')">
                            Correo
                            <v-icon size="small">{{ iconoOrden('correo') }}</v-icon>
                        </th>
                        <th class="text-left sortable-header" @click="ordenarPor('rol')">
                            Rol
                            <v-icon size="small">{{ iconoOrden('rol') }}</v-icon>
                        </th>
                        <th class="text-left sortable-header" @click="ordenarPor('estado')">
                            Estado
                            <v-icon size="small">{{ iconoOrden('estado') }}</v-icon>
                        </th>
                        <th class="text-center">Acciones</th>
                    </tr>
                </thead>

                <tbody>
                    <tr v-for="usuario in usuariosFiltrados" :key="usuario.id">
                        <td>
                            <v-avatar color="blue-grey-lighten-4" size="42">
                                <v-icon color="blue-grey-darken-3" size="30">
                                    mdi-account
                                </v-icon>
                            </v-avatar>
                        </td>

                        <td class="text-no-wrap font-weight-medium">
                            {{ usuario.nombre }}
                        </td>

                        <td>{{ usuario.correo }}</td>

                        <td class="text-no-wrap">{{ usuario.rol }}</td>

                        <td>
                            <v-chip :color="usuario.estado === 'Activo' ? 'success' : 'error'"
                                :variant="usuario.estado === 'Activo' ? 'tonal' : 'tonal'" size="small"
                                class="font-weight-medium">
                                {{ usuario.estado }}
                            </v-chip>
                        </td>

                        <td class="text-center text-no-wrap">
                            <v-tooltip text="Editar usuario">
                                <template #activator="{ props }">
                                    <v-btn v-bind="props" icon="mdi-pencil-outline" variant="text" size="small"
                                        aria-label="Editar usuario" @click="editarUsuario(usuario)" />
                                </template>
                            </v-tooltip>

                            <v-tooltip text="Eliminar usuario">
                                <template #activator="{ props }">
                                    <v-btn v-bind="props" icon="mdi-trash-can-outline" variant="text" size="small"
                                        color="error" aria-label="Eliminar usuario"
                                        @click="confirmarEliminacion(usuario)" />
                                </template>
                            </v-tooltip>
                        </td>
                    </tr>

                    <tr v-if="usuariosFiltrados.length === 0">
                        <td colspan="6" class="text-center py-8 text-medium-emphasis">
                            {{ cargando ? 'Cargando usuarios...' : (errorCarga || 'No se encontraron usuarios.') }}
                        </td>
                    </tr>
                </tbody>
            </v-table>
        </v-card>

        <!-- Diálogo provisional para las acciones -->
        <v-dialog v-model="dialogo.visible" max-width="450">
            <v-card rounded="lg">
                <v-card-title class="pa-5">
                    {{ dialogo.titulo }}
                </v-card-title>

                <v-card-text>
                    {{ dialogo.mensaje }}
                    <div v-if="dialogo.usuario" class="mt-3">
                        <strong>{{ dialogo.usuario.nombre }}</strong>
                        <div>{{ dialogo.usuario.correo }}</div>
                    </div>
                </v-card-text>

                <v-card-actions class="pa-4">
                    <v-spacer />

                    <v-btn v-if="dialogo.tipo === 'eliminar'" variant="text" @click="dialogo.visible = false">
                        Cancelar
                    </v-btn>

                    <v-btn v-if="dialogo.tipo === 'eliminar'" color="error" @click="eliminarUsuario">
                        Eliminar
                    </v-btn>

                    <v-btn v-else color="primary" @click="dialogo.visible = false">
                        Cerrar
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
import api, { mensajeError } from '@/services/api'

export default {
    name: 'UsuariosView',

    data() {
        return {
            busqueda: '',
            rolSeleccionado: 'Todos los roles',
            ordenCampo: 'nombre',
            ordenAscendente: true,

            roles: [
                'Todos los roles',
                'Administrador',
                'Cliente',
                'Repartidor'
            ],

            usuarios: [],
            cargando: false,
            errorCarga: '',

            dialogo: {
                visible: false,
                titulo: '',
                mensaje: '',
                tipo: '',
                usuario: null
            }
        }
    },

    computed: {
        usuariosFiltrados() {
            const termino = (this.busqueda || '').trim().toLowerCase()

            return this.usuarios
                .filter(usuario => {
                    const coincideBusqueda =
                        usuario.nombre.toLowerCase().includes(termino) ||
                        usuario.correo.toLowerCase().includes(termino)

                    const coincideRol =
                        this.rolSeleccionado === 'Todos los roles' ||
                        usuario.rol === this.rolSeleccionado

                    return coincideBusqueda && coincideRol
                })
                .sort((a, b) => {
                    const valorA = a[this.ordenCampo]
                    const valorB = b[this.ordenCampo]

                    const resultado = String(valorA).localeCompare(String(valorB), 'es')

                    return this.ordenAscendente ? resultado : -resultado
                })
        }
    },

    mounted() {
        this.cargarUsuarios()
    },

    methods: {
        async cargarUsuarios() {
            this.cargando = true
            this.errorCarga = ''

            try {
                const { data } = await api.get('/admin/usuarios')
                this.usuarios = data
            } catch (error) {
                this.errorCarga = mensajeError(error)
            } finally {
                this.cargando = false
            }
        },

        iconoOrden(campo) {
            if (this.ordenCampo !== campo) return 'mdi-unfold-more-horizontal'

            return this.ordenAscendente
                ? 'mdi-arrow-up'
                : 'mdi-arrow-down'
        },

        ordenarPor(campo) {
            if (this.ordenCampo === campo) {
                this.ordenAscendente = !this.ordenAscendente
            } else {
                this.ordenCampo = campo
                this.ordenAscendente = true
            }
        },

        mostrarDialogo(titulo, mensaje, tipo = '', usuario = null) {
            this.dialogo = {
                visible: true,
                titulo,
                mensaje,
                tipo,
                usuario
            }
        },

        nuevoUsuario() {
            this.mostrarDialogo(
                'Nuevo usuario',
                'El formulario de registro se implementará posteriormente.'
            )
        },

        editarUsuario(usuario) {
            this.mostrarDialogo(
                'Editar usuario',
                'El formulario de edición se implementará posteriormente.',
                '',
                usuario
            )
        },

        confirmarEliminacion(usuario) {
            this.mostrarDialogo(
                'Eliminar usuario',
                '¿Estás seguro de que deseas eliminar este usuario?',
                'eliminar',
                usuario
            )
        },

        async eliminarUsuario() {
            const id = this.dialogo.usuario?.id

            if (id === undefined || id === null) return

            try {
                await api.delete(`/admin/usuarios/${id}`)
                this.usuarios = this.usuarios.filter(usuario => usuario.id !== id)
                this.dialogo.visible = false
            } catch (error) {
                this.dialogo.mensaje = mensajeError(error)
                this.dialogo.tipo = ''
            }
        }
    }
}
</script>

<style scoped>
.usuarios-page {
    width: 100%;
    padding: 24px;
    box-sizing: border-box;
    background: #f3f7fa;
}

.users-card {
    border: 1px solid #e8edf2;
}

.sortable-header {
    cursor: pointer;
    white-space: nowrap;
}

.sortable-header:hover {
    background: #f3f7fa;
}

@media (max-width: 600px) {
    .usuarios-page {
        padding: 16px;
    }
}
</style>
