<template>
    <div class="categorias-page">
        <div class="d-flex align-center justify-space-between flex-wrap ga-3 mb-6">
            <h1 class="text-h5 font-weight-bold">Gestión de Categorías</h1>
            <v-btn color="success" prepend-icon="mdi-plus" @click="abrirFormulario()">
                Nueva categoría
            </v-btn>
        </div>

        <v-card rounded="lg" elevation="1" class="tabla-card">
            <v-table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Descripción</th>
                        <th>Icono</th>
                        <th class="text-center">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="cat in categorias" :key="cat.id">
                        <td>{{ cat.id }}</td>
                        <td class="font-weight-medium">{{ cat.nombre }}</td>
                        <td>{{ cat.descripcion || 'Sin descripción' }}</td>
                        <td>
                            <v-chip size="small" variant="tonal" color="primary">
                                <!-- Se usa el icono directo o un icono por defecto si no viene mapeado -->
                                <v-icon start :icon="obtenerIconoMdi(cat.icono)" />
                                {{ cat.icono || 'Predeterminado' }}
                            </v-chip>
                        </td>
                        <td class="text-center text-no-wrap">
                            <v-btn
                                icon="mdi-pencil-outline"
                                variant="text"
                                size="small"
                                @click="abrirFormulario(cat)"
                            />
                            <v-btn
                                icon="mdi-trash-can-outline"
                                variant="text"
                                size="small"
                                color="error"
                                @click="categoriaAEliminar = cat"
                            />
                        </td>
                    </tr>
                    <tr v-if="categorias.length === 0">
                        <td colspan="5" class="text-center py-8 text-medium-emphasis">
                            {{ cargando ? 'Cargando categorías...' : 'No hay categorías registradas.' }}
                        </td>
                    </tr>
                </tbody>
            </v-table>
        </v-card>

        <!-- Diálogo Crear / Editar Categoría -->
        <v-dialog v-model="formulario.visible" max-width="500" persistent>
            <v-card rounded="lg">
                <v-card-title class="pa-5">
                    {{ formulario.id ? 'Editar categoría' : 'Nueva categoría' }}
                </v-card-title>
                <v-card-text>
                    <v-form @submit.prevent="guardar">
                        <v-text-field
                            v-model.trim="formulario.nombre"
                            label="Nombre de la categoría"
                            variant="outlined"
                            required
                        />
                        <v-textarea
                            v-model="formulario.descripcion"
                            label="Descripción"
                            variant="outlined"
                            rows="2"
                        />
                        <v-text-field
                            v-model.trim="formulario.icono"
                            label="Icono MDI (ej. mdi-store, mdi-gift)"
                            variant="outlined"
                            placeholder="mdi-storefront-outline"
                        />
                        <v-text-field
                            v-model.trim="formulario.color"
                            label="Color HEX (ej. #ec4899)"
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
    </div>
</template>

<script>
import api from '@/services/api'

export default {
    name: 'CategoriasView',
    data() {
        return {
            categorias: [],
            cargando: false,
            guardando: false,
            formulario: {
                visible: false,
                id: null,
                nombre: '',
                descripcion: '',
                icono: '',
                color: '#2563eb'
            },
            categoriaAEliminar: null
        }
    },
    mounted() {
        this.cargarCategorias()
    },
    methods: {
        async cargarCategorias() {
            this.cargando = true
            try {
                const { data } = await api.get('/admin/categorias')
                this.categorias = data
            } catch (err) {
                console.error('Error cargando categorías', err)
            } finally {
                this.cargando = false
            }
        },
        obtenerIconoMdi(nombreIcono) {
            if (!nombreIcono) return 'mdi-tag-outline'
            // Si ya viene con formato mdi-, lo devuelve directo; si no, lo adapta
            if (nombreIcono.startsWith('mdi-')) return nombreIcono
            return `mdi-${nombreIcono.replace('-outline', '')}-outline`
        },
        abrirFormulario(cat = null) {
            this.formulario = {
                visible: true,
                id: cat?.id ?? null,
                nombre: cat?.nombre ?? '',
                descripcion: cat?.descripcion ?? '',
                icono: cat?.icono ?? '',
                color: cat?.color ?? '#2563eb'
            }
        },
        async guardar() {
            this.guardando = true
            try {
                if (this.formulario.id) {
                    await api.put(`/admin/categorias/${this.formulario.id}`, this.formulario)
                } else {
                    await api.post('/admin/categorias', this.formulario)
                }
                this.formulario.visible = false
                this.cargarCategorias()
            } catch (err) {
                console.error('Error al guardar categoría', err)
            } finally {
                this.guardando = false
            }
        }
    }
}
</script>

<style scoped>
.categorias-page {
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