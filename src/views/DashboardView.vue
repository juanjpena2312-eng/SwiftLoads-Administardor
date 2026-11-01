<template>
    <div class="dashboard-content">
        <!-- Encabezado -->
        <div class="d-flex align-center justify-space-between flex-wrap ga-3 mb-6">
            <div>
                <h1 class="text-h5 font-weight-bold">Dashboard</h1>
                <p class="text-body-2 text-medium-emphasis">
                    Resumen general de SwiftLoad
                </p>
            </div>

            <v-chip prepend-icon="mdi-calendar" variant="outlined" color="grey-darken-2">
                Hoy · {{ new Date().toLocaleDateString('es-ES', {
                    weekday: 'long', day: 'numeric', month: 'long', year:
                        'numeric'
                }) }}
            </v-chip>

        </div>

        <!-- Tarjetas de estadísticas -->
        <v-row>
            <v-col v-for="stat in estadisticas" :key="stat.titulo" cols="12" sm="6" lg="3">
                <v-card rounded="lg" elevation="1" class="stat-card h-100">
                    <v-card-text class="d-flex align-center justify-space-between pa-5">
                        <div>
                            <p class="text-body-2 text-medium-emphasis mb-2">
                                {{ stat.titulo }}
                            </p>

                            <h2 class="text-h4 font-weight-bold">
                                {{ stat.valor }}
                            </h2>

                            <p class="text-caption mt-2" :class="stat.colorTexto">
                                <v-icon size="small">{{ stat.iconoCambio }}</v-icon>
                                {{ stat.cambio }}
                            </p>
                        </div>

                        <v-avatar :color="stat.color" size="52" rounded="lg">
                            <v-icon size="28" color="white">
                                {{ stat.icono }}
                            </v-icon>
                        </v-avatar>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>

        <!-- Gráficos -->
        <v-row class="mt-2">
            <!-- Ventas semanales -->
            <v-col cols="12" lg="7">
                <v-card rounded="lg" elevation="1" class="h-100">
                    <v-card-title class="text-subtitle-1 font-weight-bold pa-5">
                        Ventas semanales
                    </v-card-title>

                    <v-card-text class="pt-0">
                        <div class="chart-container">
                            <svg viewBox="0 0 600 260" class="sales-chart" role="img"
                                aria-label="Gráfico de ventas semanales">
                                <line v-for="y in [40, 90, 140, 190, 240]" :key="y" x1="40" :y1="y" x2="580" :y2="y"
                                    stroke="#e8edf2" stroke-width="1" />

                                <polyline :points="puntosVentas" fill="none" stroke="#16a085" stroke-width="4"
                                    stroke-linecap="round" stroke-linejoin="round" />

                                <circle v-for="(punto, i) in ventas" :key="punto.dia" :cx="40 + i * 90"
                                    :cy="240 - punto.valor * 2" r="5" fill="#16a085" />

                                <text v-for="(punto, i) in ventas" :key="`${punto.dia}-label`" :x="40 + i * 90" y="258"
                                    text-anchor="middle" fill="#64748b" font-size="12">
                                    {{ punto.dia }}
                                </text>
                            </svg>
                        </div>
                    </v-card-text>
                </v-card>
            </v-col>

            <!-- Pedidos por estado -->
            <v-col cols="12" lg="5">
                <v-card rounded="lg" elevation="1" class="h-100">
                    <v-card-title class="text-subtitle-1 font-weight-bold pa-5">
                        Pedidos por estado
                    </v-card-title>

                    <v-card-text class="d-flex flex-column align-center">
                        <div class="status-chart" role="img" aria-label="Distribución de pedidos por estado">
                            <div class="status-chart-center">
                                <strong>{{ totalPedidos }}</strong>
                                <span>Pedidos</span>
                            </div>
                        </div>

                        <div class="w-100 mt-5">
                            <div v-for="estado in estados" :key="estado.nombre"
                                class="d-flex align-center justify-space-between mb-3">
                                <div class="d-flex align-center ga-2">
                                    <span class="status-dot" :style="{ backgroundColor: estado.color }" />
                                    <span class="text-body-2">{{ estado.nombre }}</span>
                                </div>

                                <strong class="text-body-2">{{ estado.cantidad }}</strong>
                            </div>
                        </div>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </div>
</template>

<script>
import api from '@/services/api'

export default {
    name: 'DashboardView',

    data() {
        return {
            estadisticas: [
                {
                    titulo: 'Pedidos',
                    valor: '125',
                    cambio: '+12% respecto al mes anterior',
                    color: '#16a085',
                    colorTexto: 'text-success',
                    icono: 'mdi-clipboard-list',
                    iconoCambio: 'mdi-trending-up'
                },
                {
                    titulo: 'Usuarios',
                    valor: '342',
                    cambio: '+8% respecto al mes anterior',
                    color: '#3984e8',
                    colorTexto: 'text-success',
                    icono: 'mdi-account-group',
                    iconoCambio: 'mdi-trending-up'
                },
                {
                    titulo: 'Productos',
                    valor: '86',
                    cambio: 'Inventario registrado',
                    color: '#f39c36',
                    colorTexto: 'text-medium-emphasis',
                    icono: 'mdi-package-variant-closed',
                    iconoCambio: 'mdi-package-variant'
                },
                {
                    titulo: 'Repartidores',
                    valor: '12',
                    cambio: 'Personal registrado',
                    color: '#8e64d9',
                    colorTexto: 'text-medium-emphasis',
                    icono: 'mdi-moped',
                    iconoCambio: 'mdi-account-check'
                }
            ],

            ventas: [
                { dia: 'Lun', valor: 45 },
                { dia: 'Mar', valor: 65 },
                { dia: 'Mié', valor: 50 },
                { dia: 'Jue', valor: 85 },
                { dia: 'Vie', valor: 70 },
                { dia: 'Sáb', valor: 100 },
                { dia: 'Dom', valor: 80 }
            ],

            estados: [
                { nombre: 'Entregados', cantidad: 55, color: '#16a085' },
                { nombre: 'En proceso', cantidad: 35, color: '#3984e8' },
                { nombre: 'Pendientes', cantidad: 20, color: '#f39c36' },
                { nombre: 'Cancelados', cantidad: 15, color: '#e74c3c' }
            ]
        }
    },

    mounted() {
        this.cargarEstadisticas()
    },

    methods: {
        async cargarEstadisticas() {
            try {
                const { data } = await api.get('/admin/estadisticas')
                const valores = {
                    Usuarios: data.usuarios,
                    Productos: data.productos,
                    Repartidores: data.repartidores
                }

                this.estadisticas.forEach(stat => {
                    if (stat.titulo in valores) stat.valor = String(valores[stat.titulo])
                })
            } catch (error) {
                console.error('No se pudieron cargar las estadísticas', error)
            }
        }
    },

    computed: {
        puntosVentas() {
            return this.ventas
                .map((punto, i) => `${40 + i * 90},${240 - punto.valor * 2}`)
                .join(' ')
        },

        totalPedidos() {
            return this.estados.reduce(
                (total, estado) => total + estado.cantidad,
                0
            )
        },

        gradienteEstados() {
            const total = this.totalPedidos
            let inicio = 0

            const segmentos = this.estados.map(estado => {
                const fin = inicio + (estado.cantidad / total) * 100
                const segmento = `${estado.color} ${inicio}% ${fin}%`
                inicio = fin
                return segmento
            })

            return `conic-gradient(${segmentos.join(', ')})`
        }
    }
}
</script>

<style scoped>
.dashboard-content {
    width: 100%;
    max-width: none;
    margin: 0;
    padding: 24px;
    box-sizing: border-box;
    background: #f3f7fa;
}

.stat-card {
    border: 1px solid #e8edf2;
}

.chart-container {
    width: 100%;
    overflow: hidden;
}

.sales-chart {
    display: block;
    width: 100%;
    overflow: visible;
}

.status-chart {
    display: grid;
    width: 190px;
    aspect-ratio: 1;
    place-items: center;
    border-radius: 50%;
    background: v-bind(gradienteEstados);
}

.status-chart-center {
    display: flex;
    width: 115px;
    aspect-ratio: 1;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    background: white;
}

.status-chart-center strong {
    font-size: 25px;
    color: #17252c;
}

.status-chart-center span {
    font-size: 12px;
    color: #64748b;
}

.status-dot {
    width: 10px;
    height: 10px;
    flex-shrink: 0;
    border-radius: 50%;
}

@media (max-width: 600px) {
    .dashboard-content {
        padding: 16px;
    }
}
</style>
