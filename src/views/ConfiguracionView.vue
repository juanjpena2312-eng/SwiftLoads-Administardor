<template>
    <div class="configuracion-page">
        <div class="d-flex align-center justify-space-between flex-wrap ga-3 mb-6">
            <h1 class="text-h5 font-weight-bold">Configuración del Sistema</h1>
        </div>

        <v-alert
            v-if="mensaje"
            :type="mensaje.tipo"
            variant="tonal"
            closable
            class="mb-4"
            @click:close="mensaje = null"
        >
            {{ mensaje.texto }}
        </v-alert>

        <v-row>
            <!-- Ajustes Generales -->
            <v-col cols="12" md="8">
                <v-card rounded="lg" elevation="1" class="pa-5 tabla-card mb-6">
                    <v-card-title class="px-0 pt-0 text-subtitle-1 font-weight-bold">
                        Información General de SwiftLoad
                    </v-card-title>
                    <v-card-text class="px-0">
                        <v-form @submit.prevent="guardarConfiguracion">
                            <v-text-field
                                v-model="config.nombreApp"
                                label="Nombre de la Aplicación"
                                variant="outlined"
                                density="comfortable"
                                class="mb-3"
                            />
                            <v-text-field
                                v-model="config.correoSoporte"
                                label="Correo de Soporte Técnico"
                                type="email"
                                variant="outlined"
                                density="comfortable"
                                class="mb-3"
                            />
                            <v-text-field
                                v-model="config.costoEnvioBase"
                                label="Costo de Envío Base ($)"
                                type="number"
                                step="0.01"
                                variant="outlined"
                                density="comfortable"
                                class="mb-3"
                            />
                            <v-select
                                v-model="config.moneda"
                                :items="['USD ($)', 'EUR (€)']"
                                label="Moneda predeterminada"
                                variant="outlined"
                                density="comfortable"
                                class="mb-4"
                            />
                            <v-btn color="success" :loading="guardando" @click="guardarConfiguracion">
                                Guardar cambios
                            </v-btn>
                        </v-form>
                    </v-card-text>
                </v-card>
            </v-col>

            <!-- Panel lateral de Estado del Sistema -->
            <v-col cols="12" md="4">
                <v-card rounded="lg" elevation="1" class="pa-5 tabla-card">
                    <v-card-title class="px-0 pt-0 text-subtitle-1 font-weight-bold">
                        Estado del Servidor
                    </v-card-title>
                    <v-card-text class="px-0">
                        <div class="d-flex justify-space-between align-center mb-3">
                            <span class="text-medium-emphasis">API Backend:</span>
                            <v-chip color="success" size="small" variant="tonal">Conectada</v-chip>
                        </div>
                        <div class="d-flex justify-space-between align-center mb-3">
                            <span class="text-medium-emphasis">Base de datos:</span>
                            <v-chip color="success" size="small" variant="tonal">MySQL Activa</v-chip>
                        </div>
                        <div class="d-flex justify-space-between align-center mb-3">
                            <span class="text-medium-emphasis">Versión del sistema:</span>
                            <strong>v1.0.4</strong>
                        </div>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </div>
</template>

<script>
export default {
    name: 'ConfiguracionView',
    data() {
        return {
            guardando: false,
            mensaje: null,
            config: {
                nombreApp: 'SwiftLoad Delivery',
                correoSoporte: 'soporte@swiftload.com',
                costoEnvioBase: 2.50,
                moneda: 'USD ($)'
            }
        }
    },
    methods: {
        guardarConfiguracion() {
            this.guardando = true
            setTimeout(() => {
                this.guardando = false
                this.mensaje = {
                    tipo: 'success',
                    texto: 'Configuración actualizada correctamente.'
                }
            }, 800)
        }
    }
}
</script>

<style scoped>
.configuracion-page {
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