<template>
    <div class="repartidores-page">
        <div class="d-flex align-center justify-space-between flex-wrap ga-3 mb-6">
            <h1 class="text-h5 font-weight-bold">Gestión de Repartidores</h1>
            <v-btn color="success" prepend-icon="mdi-plus" @click="abrirFormulario()">
                Nuevo repartidor
            </v-btn>
        </div>

        <v-alert
            v-if="aviso"
            :type="aviso.tipo"
            variant="tonal"
            closable
            class="mb-4"
            @click:close="aviso = null"
        >
            {{ aviso.texto }}
        </v-alert>

        <v-card rounded="lg" elevation="1" class="tabla-card">
            <v-table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Correo</th>
                        <th>Teléfono</th>
                        <th>Vehículo</th>
                        <th>Estado</th>
                        <th class="text-center">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="rep in repartidores" :key="rep.id">
                        <td>{{ rep.id }}</td>
                        <td class="font-weight-medium">{{ rep.nombre }}</td>
                        <td>{{ rep.correo }}</td>
                        <td>{{ rep.telefono }}</td>
                        <td>
                            <v-chip size="small" variant="tonal" color="info">
                                {{ rep.vehiculo }}
                            </v-chip>
                        </td>
                        <td>
                            <v-chip
                                :color="rep.estado === 'activo' ? 'success' : 'error'"
                                variant="tonal"
                                size="small"
                            >
                                {{ rep.estado === 'activo' ? 'Activo' : 'Inactivo' }}
                            </v-chip>
                        </td>
                        <td class="text-center text-no-wrap">
                            <v-btn
                                icon="mdi-pencil-outline"
                                variant="text"
                                size="small"
                                @click="abrirFormulario(rep)"
                            />
                            <v-btn
                                icon="mdi-trash-can-outline"
                                variant="text"
                                size="small"
                                color="error"
                                @click="repartidorAEliminar = rep"
                            />
                        </td>
                    </tr>
                    <tr v-if="repartidores.length === 0">
                        <td colspan="7" class="text-center py-8 text-medium-emphasis">
                            {{ cargando ? 'Cargando repartidores...' : 'No hay repartidores registrados.' }}
                        </td>
                    </tr>
                </tbody>
            </v-table>
        </v-card>

        <!-- Diálogo Crear / Editar Repartidor -->
        <v-dialog v-model="formulario.visible" max-width="500" persistent>
            <v-card rounded="lg">
                <v-card-title class="pa-5">
                    {{ formulario.id ? 'Editar repartidor' : 'Nuevo repartidor' }}
                </v-card-title>
                <v-card-text>
                    <v-form @submit.prevent="guardar">
                        <v-text-field
                            v-model.trim="formulario.nombre"
                            label="Nombre completo"
                            variant="outlined"
                            required
                        />
                        <v-text-field
                            v-model.trim="formulario.correo"
                            label="Correo electrónico"
                            type="email"
                            variant="outlined"
                            required
                        />
                        <v-text-field
                            v-model.trim="formulario.telefono"
                            label="Teléfono"
                            variant="outlined"
                            required
                        />
                        <v-select
                            v-model="formulario.vehiculo"
                            :items="['Motocicleta', 'Bicicleta', 'Automóvil', 'A pie']"
                            label="Tipo de vehículo"
                            variant="outlined"
                        />
                        <v-select
                            v-model="formulario.estado"
                            :items="[
                                { title: 'Activo', value: 'activo' },
                                { title: 'Inactivo', value: 'inactivo' }
                            ]"
                            item-title="title"
                            item-value="value"
                            label="Estado"
                            variant="outlined"
                        />
                    </v-form>
                </v-card-text>
                <v-card-actions class="pa-4">
                    <v-spacer />
                    <v-btn variant="text" @click="formulario.visible = false">Cancelar</v-btn>
                    <v-btn color="success" :loading="guardando" @click="guardar">Guardar</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <!-- Diálogo Eliminar -->
        <v-dialog :model-value="!!repartidorAEliminar" max-width="400" @update:model-value="repartidorAEliminar = null">
            <v-card rounded="lg">
                <v-card-title class="pa-5">Eliminar repartidor</v-card-title>
                <v-card-text>
                    ¿Estás seguro de eliminar a <strong>{{ repartidorAEliminar?.nombre }}</strong>?
                </v-card-text>
                <v-card-actions class="pa-4">
                    <v-spacer />
                    <v-btn variant="text" @click="repartidorAEliminar = null">Cancelar</v-btn>
                    <v-btn color="error" :loading="eliminando" @click="eliminar">Eliminar</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
import api, { mensajeError } from '@/services/api'

export default {
    name: 'RepartidoresView',
    data() {
        return {
            repartidores: [],
            cargando: false,
            guardando: false,
            eliminando: false,
            aviso: null,
            repartidorAEliminar: null,
            formulario: {
                visible: false,
                id: null,
                nombre: '',
                correo: '',
                telefono: '',
                vehiculo: 'Motocicleta',
                estado: 'activo'
            }
        }
    },
    mounted() {
        this.cargarRepartidores()
    },
    methods: {
        async cargarRepartidores() {
            this.cargando = true
            try {
                const { data } = await api.get('/admin/repartidores')
                this.repartidores = data
            } catch (err) {
                this.aviso = { tipo: 'error', texto: mensajeError(err) }
            } finally {
                this.cargando = false
            }
        },
        abrirFormulario(rep = null) {
            this.formulario = {
                visible: true,
                id: rep?.id ?? null,
                nombre: rep?.nombre ?? '',
                correo: rep?.correo ?? '',
                telefono: rep?.telefono ?? '',
                vehiculo: rep?.vehiculo ?? 'Motocicleta',
                estado: rep?.estado ?? 'activo'
            }
        },
        async guardar() {
            this.guardando = true
            try {
                if (this.formulario.id) {
                    await api.put(`/admin/repartidores/${this.formulario.id}`, this.formulario)
                    this.aviso = { tipo: 'success', texto: 'Repartidor actualizado correctamente.' }
                } else {
                    await api.post('/admin/repartidores', this.formulario)
                    this.aviso = { tipo: 'success', texto: 'Repartidor registrado correctamente.' }
                }
                this.formulario.visible = false
                this.cargarRepartidores()
            } catch (err) {
                this.aviso = { tipo: 'error', texto: mensajeError(err) }
            } finally {
                this.guardando = false
            }
        },
        async eliminar() {
            if (!this.repartidorAEliminar) return
            this.eliminando = true
            try {
                await api.delete(`/admin/repartidores/${this.repartidorAEliminar.id}`)
                this.aviso = { tipo: 'success', texto: 'Repartidor eliminado.' }
                this.repartidorAEliminar = null
                this.cargarRepartidores()
            } catch (err) {
                this.aviso = { tipo: 'error', texto: mensajeError(err) }
            } finally {
                this.eliminando = false
            }
        }
    }
}
</script>

<style scoped>
.repartidores-page {
    width: 100%;
    padding: 24px;
    box-sizing: border-box;
    background: #f3f7fa;
    min-height: 100vh;
}
.tabla-card {
    border: 1px solid #e8edf2;
}
</style>