<template>
    <div class="productos-page">
        <div class="d-flex align-center justify-space-between flex-wrap ga-3 mb-6">
            <h1 class="text-h5 font-weight-bold">Productos</h1>

            <v-btn color="success" prepend-icon="mdi-plus" @click="abrirFormulario()">
                Nuevo producto
            </v-btn>
        </div>

        <v-row class="mb-2">
            <v-col cols="12" sm="6" md="4">
                <v-text-field v-model="busqueda" label="Buscar productos" prepend-inner-icon="mdi-magnify"
                    variant="outlined" density="compact" hide-details clearable />
            </v-col>
        </v-row>

        <v-alert v-if="aviso" :type="aviso.tipo" variant="tonal" closable class="mb-4" @click:close="aviso = null">
            {{ aviso.texto }}
        </v-alert>

        <v-card rounded="lg" elevation="1" class="tabla-card">
            <v-table>
                <thead>
                    <tr>
                        <th class="text-left sortable-header" @click="ordenarPor('id')">
                            ID <v-icon size="small">{{ iconoOrden('id') }}</v-icon>
                        </th>
                        <th class="text-left sortable-header" @click="ordenarPor('nombre')">
                            Nombre <v-icon size="small">{{ iconoOrden('nombre') }}</v-icon>
                        </th>
                        <th class="text-right sortable-header" @click="ordenarPor('precio')">
                            Precio <v-icon size="small">{{ iconoOrden('precio') }}</v-icon>
                        </th>
                        <th class="text-right sortable-header" @click="ordenarPor('stock')">
                            Stock <v-icon size="small">{{ iconoOrden('stock') }}</v-icon>
                        </th>
                        <th class="text-center">Acciones</th>
                    </tr>
                </thead>

                <tbody>
                    <tr v-for="producto in productosFiltrados" :key="producto.id">
                        <td>{{ producto.id }}</td>
                        <td class="font-weight-medium">{{ producto.nombre }}</td>
                        <td class="text-right text-no-wrap">${{ producto.precio.toFixed(2) }}</td>
                        <td class="text-right">
                            <v-chip :color="colorStock(producto.stock)" variant="tonal" size="small">
                                {{ producto.stock }}
                            </v-chip>
                        </td>
                        <td class="text-center text-no-wrap">
                            <v-btn icon="mdi-pencil-outline" variant="text" size="small"
                                aria-label="Editar producto" @click="abrirFormulario(producto)" />
                            <v-btn icon="mdi-trash-can-outline" variant="text" size="small" color="error"
                                aria-label="Eliminar producto" @click="productoAEliminar = producto" />
                        </td>
                    </tr>

                    <tr v-if="productosFiltrados.length === 0">
                        <td colspan="5" class="text-center py-8 text-medium-emphasis">
                            {{ cargando ? 'Cargando productos...' : (errorCarga || 'No se encontraron productos.') }}
                        </td>
                    </tr>
                </tbody>
            </v-table>
        </v-card>

        <!-- Crear / editar -->
        <v-dialog v-model="formulario.visible" max-width="480" persistent>
            <v-card rounded="lg">
                <v-card-title class="pa-5">
                    {{ formulario.id ? 'Editar producto' : 'Nuevo producto' }}
                </v-card-title>

                <v-card-text>
                    <v-form ref="formRef" @submit.prevent="guardar">
                        <v-text-field v-model.trim="formulario.nombre" label="Nombre" variant="outlined"
                            :rules="reglas.nombre" :disabled="guardando" />
                        <v-text-field v-model="formulario.precio" label="Precio" type="number" min="0" step="0.01"
                            prefix="$" variant="outlined" :rules="reglas.precio" :disabled="guardando" />
                        <v-text-field v-model="formulario.stock" label="Stock" type="number" min="0" step="1"
                            variant="outlined" :rules="reglas.stock" :disabled="guardando" />

                        <v-alert v-if="formulario.error" type="error" variant="tonal" density="compact">
                            {{ formulario.error }}
                        </v-alert>
                    </v-form>
                </v-card-text>

                <v-card-actions class="pa-4">
                    <v-spacer />
                    <v-btn variant="text" :disabled="guardando" @click="formulario.visible = false">Cancelar</v-btn>
                    <v-btn color="success" :loading="guardando" @click="guardar">Guardar</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <!-- Confirmar eliminación -->
        <v-dialog :model-value="!!productoAEliminar" max-width="420" @update:model-value="productoAEliminar = null">
            <v-card rounded="lg">
                <v-card-title class="pa-5">Eliminar producto</v-card-title>
                <v-card-text>
                    ¿Seguro que deseas eliminar <strong>{{ productoAEliminar?.nombre }}</strong>?
                    Esta acción no se puede deshacer.
                </v-card-text>
                <v-card-actions class="pa-4">
                    <v-spacer />
                    <v-btn variant="text" @click="productoAEliminar = null">Cancelar</v-btn>
                    <v-btn color="error" :loading="eliminando" @click="eliminar">Eliminar</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
import api, { mensajeError } from '@/services/api'

export default {
    name: 'ProductosView',

    data() {
        return {
            productos: [],
            cargando: false,
            errorCarga: '',
            aviso: null,

            busqueda: '',
            ordenCampo: 'id',
            ordenAscendente: false,

            formulario: { visible: false, id: null, nombre: '', precio: '', stock: '', error: '' },
            guardando: false,

            productoAEliminar: null,
            eliminando: false,

            reglas: {
                nombre: [v => !!v?.trim() || 'El nombre es obligatorio'],
                precio: [
                    v => v !== '' && v !== null || 'El precio es obligatorio',
                    v => Number(v) >= 0 || 'El precio no puede ser negativo'
                ],
                stock: [
                    v => v !== '' && v !== null || 'El stock es obligatorio',
                    v => Number.isInteger(Number(v)) && Number(v) >= 0 || 'Debe ser un entero mayor o igual a 0'
                ]
            }
        }
    },

    computed: {
        productosFiltrados() {
            const termino = (this.busqueda || '').trim().toLowerCase()

            return this.productos
                .filter(p => p.nombre.toLowerCase().includes(termino))
                .sort((a, b) => {
                    const x = a[this.ordenCampo]
                    const y = b[this.ordenCampo]
                    const r = typeof x === 'number'
                        ? x - y
                        : String(x).localeCompare(String(y), 'es')
                    return this.ordenAscendente ? r : -r
                })
        }
    },

    mounted() {
        this.cargarProductos()
    },

    methods: {
        async cargarProductos() {
            this.cargando = true
            this.errorCarga = ''

            try {
                const { data } = await api.get('/admin/productos')
                this.productos = data
            } catch (error) {
                this.errorCarga = mensajeError(error)
            } finally {
                this.cargando = false
            }
        },

        colorStock(stock) {
            if (stock === 0) return 'error'
            return stock <= 5 ? 'warning' : 'success'
        },

        iconoOrden(campo) {
            if (this.ordenCampo !== campo) return 'mdi-unfold-more-horizontal'
            return this.ordenAscendente ? 'mdi-arrow-up' : 'mdi-arrow-down'
        },

        ordenarPor(campo) {
            if (this.ordenCampo === campo) {
                this.ordenAscendente = !this.ordenAscendente
            } else {
                this.ordenCampo = campo
                this.ordenAscendente = true
            }
        },

        abrirFormulario(producto = null) {
            this.formulario = {
                visible: true,
                id: producto?.id ?? null,
                nombre: producto?.nombre ?? '',
                precio: producto ? String(producto.precio) : '',
                stock: producto ? String(producto.stock) : '',
                error: ''
            }
        },

        async guardar() {
            const { valid } = await this.$refs.formRef.validate()
            if (!valid) return

            const cuerpo = {
                nombre: this.formulario.nombre,
                precio: Number(this.formulario.precio),
                stock: Number(this.formulario.stock)
            }

            this.guardando = true
            this.formulario.error = ''

            try {
                if (this.formulario.id) {
                    const { data } = await api.put(`/admin/productos/${this.formulario.id}`, cuerpo)
                    this.productos = this.productos.map(p => (p.id === data.id ? data : p))
                    this.aviso = { tipo: 'success', texto: 'Producto actualizado.' }
                } else {
                    const { data } = await api.post('/admin/productos', cuerpo)
                    this.productos = [data, ...this.productos]
                    this.aviso = { tipo: 'success', texto: 'Producto creado.' }
                }

                this.formulario.visible = false
            } catch (error) {
                this.formulario.error = mensajeError(error)
            } finally {
                this.guardando = false
            }
        },

        async eliminar() {
            const producto = this.productoAEliminar
            if (!producto) return

            this.eliminando = true

            try {
                await api.delete(`/admin/productos/${producto.id}`)
                this.productos = this.productos.filter(p => p.id !== producto.id)
                this.aviso = { tipo: 'success', texto: 'Producto eliminado.' }
            } catch (error) {
                this.aviso = { tipo: 'error', texto: mensajeError(error) }
            } finally {
                this.eliminando = false
                this.productoAEliminar = null
            }
        }
    }
}
</script>

<style scoped>
.productos-page {
    width: 100%;
    padding: 24px;
    box-sizing: border-box;
    background: #f3f7fa;
}

.tabla-card {
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
    .productos-page {
        padding: 16px;
    }
}
</style>