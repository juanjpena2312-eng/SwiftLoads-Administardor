<template>
    <div class="pedidos-page">
        <!-- Encabezado -->
        <div class="d-flex align-center justify-space-between flex-wrap ga-3 mb-6">
            <div>
                <h1 class="text-h5 font-weight-bold">Pedidos</h1>
                <p class="text-body-2 text-medium-emphasis">
                    Administra y consulta los pedidos de SwiftLoad
                </p>
            </div>

            <v-btn color="success" prepend-icon="mdi-plus" @click="nuevoPedido">
                Nuevo pedido
            </v-btn>
        </div>

        <!-- Buscador y filtros -->
        <v-row align="center" class="mb-2">
            <v-col cols="12" md="4">
                <v-text-field v-model="busqueda" label="Buscar pedidos" placeholder="Orden o cliente..."
                    prepend-inner-icon="mdi-magnify" variant="outlined" density="compact" hide-details clearable />
            </v-col>

            <v-col cols="12" sm="6" md="3">
                <v-select v-model="estadoSeleccionado" :items="opcionesEstado" label="Estado" variant="outlined"
                    density="compact" hide-details />
            </v-col>

            <v-col cols="12" sm="6" md="2">
                <v-text-field v-model="fechaInicio" label="Desde" type="date" variant="outlined" density="compact"
                    hide-details />
            </v-col>

            <v-col cols="12" md="2">
                <v-text-field v-model="fechaFin" label="Hasta" type="date" variant="outlined" density="compact"
                    hide-details />
            </v-col>

            <v-col cols="12" md="1">
                <v-btn block variant="tonal" color="primary" icon="mdi-filter-remove" aria-label="Limpiar filtros"
                    @click="limpiarFiltros" />
            </v-col>
        </v-row>

        <!-- Tabla de pedidos -->
        <v-card rounded="lg" elevation="1" class="orders-card">
            <div class="d-flex align-center justify-space-between pa-4">
                <div>
                    <h2 class="text-subtitle-1 font-weight-bold">
                        Lista de pedidos
                    </h2>
                    <p class="text-caption text-medium-emphasis">
                        {{ pedidosFiltrados.length }} pedidos encontrados
                    </p>
                </div>

                <v-btn icon="mdi-download" variant="text" aria-label="Exportar pedidos" title="Exportar pedidos"
                    @click="exportarPedidos" />
            </div>

            <v-divider />

            <v-table>
                <thead>
                    <tr>
                        <th class="text-left">N.º orden</th>
                        <th class="text-left">Cliente</th>
                        <th class="text-left">Fecha</th>
                        <th class="text-left">Total</th>
                        <th class="text-left">Estado</th>
                        <th class="text-center">Acciones</th>
                    </tr>
                </thead>

                <tbody>
                    <tr v-for="pedido in pedidosFiltrados" :key="pedido.id">
                        <td class="text-no-wrap font-weight-medium">
                            {{ pedido.id }}
                        </td>

                        <td>
                            <div class="d-flex align-center ga-2 py-2">
                                <v-avatar color="blue-grey-lighten-4" size="36">
                                    <span class="text-body-2 font-weight-bold">
                                        {{ iniciales(pedido.cliente) }}
                                    </span>
                                </v-avatar>

                                <span class="text-no-wrap">{{ pedido.cliente }}</span>
                            </div>
                        </td>

                        <td class="text-no-wrap">
                            {{ formatearFecha(pedido.fecha) }}
                        </td>

                        <td class="text-no-wrap font-weight-medium">
                            {{ formatearTotal(pedido.total) }}
                        </td>

                        <td>
                            <v-chip :color="colorEstado(pedido.estado)" size="small" variant="flat">
                                {{ pedido.estado }}
                            </v-chip>
                        </td>

                        <td class="text-center text-no-wrap">
                            <v-tooltip text="Ver pedido">
                                <template #activator="{ props }">
                                    <v-btn v-bind="props" icon="mdi-eye-outline" variant="text" size="small"
                                        aria-label="Ver pedido" @click="verPedido(pedido)" />
                                </template>
                            </v-tooltip>

                            <v-tooltip text="Editar pedido">
                                <template #activator="{ props }">
                                    <v-btn v-bind="props" icon="mdi-pencil-outline" variant="text" size="small"
                                        aria-label="Editar pedido" @click="editarPedido(pedido)" />
                                </template>
                            </v-tooltip>

                            <v-tooltip text="Ver ubicación">
                                <template #activator="{ props }">
                                    <v-btn v-bind="props" icon="mdi-map-marker-outline" variant="text" size="small"
                                        aria-label="Ver ubicación" @click="verUbicacion(pedido)" />
                                </template>
                            </v-tooltip>
                        </td>
                    </tr>

                    <tr v-if="pedidosFiltrados.length === 0">
                        <td colspan="6" class="text-center py-8 text-medium-emphasis">
                            No se encontraron pedidos con esos filtros.
                        </td>
                    </tr>
                </tbody>
            </v-table>
        </v-card>

        <!-- Ventana de información -->
        <v-dialog v-model="dialogo.visible" max-width="480">
            <v-card rounded="lg">
                <v-card-title class="pa-5">
                    {{ dialogo.titulo }}
                </v-card-title>

                <v-card-text>
                    <template v-if="dialogo.pedido">
                        <p><strong>Orden:</strong> {{ dialogo.pedido.id }}</p>
                        <p><strong>Cliente:</strong> {{ dialogo.pedido.cliente }}</p>
                        <p><strong>Fecha:</strong> {{ formatearFecha(dialogo.pedido.fecha) }}</p>
                        <p><strong>Total:</strong> {{ formatearTotal(dialogo.pedido.total) }}</p>
                        <p><strong>Estado:</strong> {{ dialogo.pedido.estado }}</p>
                    </template>

                    <p v-else>{{ dialogo.mensaje }}</p>
                </v-card-text>

                <v-card-actions class="pa-4">
                    <v-spacer />
                    <v-btn color="primary" @click="dialogo.visible = false">
                        Cerrar
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
export default {
    name: 'PedidosView',

    data() {
        return {
            busqueda: '',
            estadoSeleccionado: 'Todos los estados',
            fechaInicio: '',
            fechaFin: '',

            opcionesEstado: [
                'Todos los estados',
                'Pendiente',
                'En preparación',
                'En camino',
                'Entregado',
                'Cancelado'
            ],

            pedidos: [
                { id: '#SW4S879', cliente: 'Ana López', fecha: '2026-10-12T10:30:00', total: 45.80, estado: 'En camino' },
                { id: '#SW4S878', cliente: 'Carlos Rivera', fecha: '2026-10-12T09:15:00', total: 122.50, estado: 'Entregado' },
                { id: '#SW4S877', cliente: 'María Gómez', fecha: '2026-10-12T08:40:00', total: 82.20, estado: 'En preparación' },
                { id: '#SW4S876', cliente: 'Luis Martínez', fecha: '2026-10-11T17:20:00', total: 115.00, estado: 'Pendiente' },
                { id: '#SW4S875', cliente: 'Sofía Ramírez', fecha: '2026-10-11T14:10:00', total: 6.30, estado: 'Cancelado' }
            ],

            dialogo: {
                visible: false,
                titulo: '',
                mensaje: '',
                pedido: null
            }
        }
    },

    computed: {
        pedidosFiltrados() {
            const termino = (this.busqueda || '').trim().toLowerCase()

            return this.pedidos.filter(pedido => {
                const coincideBusqueda =
                    pedido.id.toLowerCase().includes(termino) ||
                    pedido.cliente.toLowerCase().includes(termino)

                const coincideEstado =
                    this.estadoSeleccionado === 'Todos los estados' ||
                    pedido.estado === this.estadoSeleccionado

                const fecha = pedido.fecha.slice(0, 10)

                const coincideInicio =
                    !this.fechaInicio || fecha >= this.fechaInicio

                const coincideFin =
                    !this.fechaFin || fecha <= this.fechaFin

                return (
                    coincideBusqueda &&
                    coincideEstado &&
                    coincideInicio &&
                    coincideFin
                )
            })
        }
    },

    methods: {
        iniciales(nombre) {
            return nombre
                .split(' ')
                .map(parte => parte[0])
                .slice(0, 2)
                .join('')
                .toUpperCase()
        },

        formatearFecha(fecha) {
            const [dia, hora] = fecha.split('T')
            const [anio, mes, numeroDia] = dia.split('-')

            return `${numeroDia}/${mes}/${anio}, ${hora}`
        },

        formatearTotal(total) {
            return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD'
            }).format(total)
        },

        colorEstado(estado) {
            const colores = {
                'En camino': 'blue',
                'Entregado': 'success',
                'En preparación': 'amber-darken-2',
                'Pendiente': 'orange-darken-1',
                'Cancelado': 'red'
            }

            return colores[estado] || 'grey'
        },

        limpiarFiltros() {
            this.busqueda = ''
            this.estadoSeleccionado = 'Todos los estados'
            this.fechaInicio = ''
            this.fechaFin = ''
        },

        mostrarDialogo(titulo, mensaje, pedido = null) {
            this.dialogo = {
                visible: true,
                titulo,
                mensaje,
                pedido
            }
        },

        nuevoPedido() {
            this.mostrarDialogo(
                'Nuevo pedido',
                'El formulario para registrar pedidos se implementará en el siguiente paso.'
            )
        },

        verPedido(pedido) {
            this.mostrarDialogo('Detalle del pedido', '', pedido)
        },

        editarPedido(pedido) {
            this.mostrarDialogo(
                'Editar pedido',
                'El formulario de edición se implementará posteriormente.',
                pedido
            )
        },

        verUbicacion(pedido) {
            this.mostrarDialogo(
                'Ubicación del pedido',
                'La ubicación estará disponible cuando conectemos los datos de entrega.',
                pedido
            )
        },

        exportarPedidos() {
            const encabezado = ['Orden', 'Cliente', 'Fecha', 'Total', 'Estado']

            const filas = this.pedidosFiltrados.map(pedido => [
                pedido.id,
                pedido.cliente,
                this.formatearFecha(pedido.fecha),
                pedido.total.toFixed(2),
                pedido.estado
            ])

            const escapar = valor =>
                `"${String(valor).replace(/"/g, '""')}"`

            const csv = [encabezado, ...filas]
                .map(fila => fila.map(escapar).join(','))
                .join('\r\n')

            const archivo = new Blob(
                ['\uFEFF' + csv],
                { type: 'text/csv;charset=utf-8;' }
            )

            const url = URL.createObjectURL(archivo)
            const enlace = document.createElement('a')

            enlace.href = url
            enlace.download = 'pedidos-swiftload.csv'
            enlace.click()

            URL.revokeObjectURL(url)
        }
    }
}
</script>

<style scoped>
.pedidos-page {
    width: 100%;
    padding: 24px;
    box-sizing: border-box;
    background: #f3f7fa;
}

.orders-card {
    border: 1px solid #e8edf2;
}

@media (max-width: 600px) {
    .pedidos-page {
        padding: 16px;
    }
}
</style>