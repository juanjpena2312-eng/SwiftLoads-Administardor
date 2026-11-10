<template>
    <div class="reportes-page">
        <div class="d-flex align-center justify-space-between flex-wrap ga-3 mb-6">
            <h1 class="text-h5 font-weight-bold">Reportes y Estadísticas</h1>
            <v-btn color="primary" prepend-icon="mdi-refresh" @click="cargarReportes" :loading="cargando">
                Actualizar datos
            </v-btn>
        </div>

        <v-alert
            v-if="error"
            type="error"
            variant="tonal"
            closable
            class="mb-4"
            @click:close="error = ''"
        >
            {{ error }}
        </v-alert>

        <!-- Tarjetas de resumen métrico -->
        <v-row class="mb-6">
            <v-col cols="12" sm="6" md="3">
                <v-card rounded="lg" elevation="1" class="pa-4 metric-card border-left-success">
                    <div class="text-subtitle-2 text-medium-emphasis">Ingresos Totales</div>
                    <div class="text-h4 font-weight-bold text-success mt-2">
                        ${{ Number(reportes.ingresos || 0).toFixed(2) }}
                    </div>
                </v-card>
            </v-col>

            <v-col cols="12" sm="6" md="3">
                <v-card rounded="lg" elevation="1" class="pa-4 metric-card border-left-primary">
                    <div class="text-subtitle-2 text-medium-emphasis">Pedidos Totales</div>
                    <div class="text-h4 font-weight-bold text-primary mt-2">
                        {{ reportes.total_pedidos || 0 }}
                    </div>
                </v-card>
            </v-col>

            <v-col cols="12" sm="6" md="3">
                <v-card rounded="lg" elevation="1" class="pa-4 metric-card border-left-info">
                    <div class="text-subtitle-2 text-medium-emphasis">Usuarios Registrados</div>
                    <div class="text-h4 font-weight-bold text-info mt-2">
                        {{ reportes.total_usuarios || 0 }}
                    </div>
                </v-card>
            </v-col>

            <v-col cols="12" sm="6" md="3">
                <v-card rounded="lg" elevation="1" class="pa-4 metric-card border-left-warning">
                    <div class="text-subtitle-2 text-medium-emphasis">Productos Activos</div>
                    <div class="text-h4 font-weight-bold text-warning mt-2">
                        {{ reportes.total_productos || 0 }}
                    </div>
                </v-card>
            </v-col>
        </v-row>

        <!-- Secciones secundarias -->
        <v-row>
            <!-- Pedidos por estado -->
            <v-col cols="12" md="6">
                <v-card rounded="lg" elevation="1" class="tabla-card h-100">
                    <v-card-title class="pa-4 text-subtitle-1 font-weight-bold">
                        Distribución de Pedidos por Estado
                    </v-card-title>
                    <v-divider />
                    <v-table>
                        <thead>
                            <tr>
                                <th>Estado</th>
                                <th class="text-right">Cantidad</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="item in reportes.pedidos_por_estado" :key="item.estado">
                                <td class="text-capitalize font-weight-medium">{{ item.estado }}</td>
                                <td class="text-right">
                                    <v-chip size="small" variant="tonal" color="primary">
                                        {{ item.cantidad }}
                                    </v-chip>
                                </td>
                            </tr>
                            <tr v-if="!reportes.pedidos_por_estado?.length">
                                <td colspan="2" class="text-center py-6 text-medium-emphasis">
                                    No hay datos de pedidos registrados.
                                </td>
                            </tr>
                        </tbody>
                    </v-table>
                </v-card>
            </v-col>

            <!-- Productos más vendidos -->
            <v-col cols="12" md="6">
                <v-card rounded="lg" elevation="1" class="tabla-card h-100">
                    <v-card-title class="pa-4 text-subtitle-1 font-weight-bold">
                        Productos más Vendidos
                    </v-card-title>
                    <v-divider />
                    <v-table>
                        <thead>
                            <tr>
                                <th>Producto</th>
                                <th class="text-right">Unidades Vendidas</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="prod in reportes.productos_mas_vendidos" :key="prod.nombre">
                                <td class="font-weight-medium">{{ prod.nombre }}</td>
                                <td class="text-right">
                                    <v-chip size="small" variant="tonal" color="success">
                                        {{ prod.total_vendidos }}
                                    </v-chip>
                                </td>
                            </tr>
                            <tr v-if="!reportes.productos_mas_vendidos?.length">
                                <td colspan="2" class="text-center py-6 text-medium-emphasis">
                                    Aún no hay ventas registradas.
                                </td>
                            </tr>
                        </tbody>
                    </v-table>
                </v-card>
            </v-col>
        </v-row>
    </div>
</template>

<script>
import api, { mensajeError } from '@/services/api'

export default {
    name: 'ReportesView',
    data() {
        return {
            cargando: false,
            error: '',
            reportes: {
                ingresos: 0,
                total_pedidos: 0,
                total_usuarios: 0,
                total_productos: 0,
                pedidos_por_estado: [],
                productos_mas_vendidos: []
            }
        }
    },
    mounted() {
        this.cargarReportes()
    },
    methods: {
        async cargarReportes() {
            this.cargando = true
            this.error = ''
            try {
                const { data } = await api.get('/admin/reportes')
                this.reportes = data
            } catch (err) {
                this.error = mensajeError(err)
            } finally {
                this.cargando = false
            }
        }
    }
}
</script>

<style scoped>
.reportes-page {
    width: 100%;
    padding: 24px;
    box-sizing: border-box;
    background: #f3f7fa;
    min-height: 100vh;
}
.tabla-card {
    border: 1px solid #e8edf2;
}
.metric-card {
    border: 1px solid #e8edf2;
    border-left: 4px solid #cbd5e1;
}
.border-left-success { border-left-color: #22c55e !important; }
.border-left-primary { border-left-color: #3b82f6 !important; }
.border-left-info { border-left-color: #06b6d4 !important; }
.border-left-warning { border-left-color: #f59e0b !important; }

@media (max-width: 600px) {
    .reportes-page {
        padding: 16px;
    }
}
</style>