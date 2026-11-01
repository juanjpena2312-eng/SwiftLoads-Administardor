<template>
    <v-container fluid class="login-page pa-0">
        <v-row no-gutters class="fill-height">

            <!-- Panel de marca -->
            <v-col cols="12" md="6" class="brand-panel">
                <div class="brand-content">
                    <div class="brand-logo">
                        <v-icon size="64" color="white">
                            mdi-truck-fast
                        </v-icon>

                        <div class="brand-name">
                            <span>Swift</span><strong>Load</strong>
                        </div>
                    </div>

                    <h2>Todo lo que necesitas, en un solo lugar</h2>

                    <p class="brand-description">
                        Compras, envíos y mucho más, desde una sola plataforma.
                    </p>

                    <v-row class="services mt-8" justify="center">
                        <v-col cols="4" class="text-center">
                            <v-icon size="36">mdi-cart-outline</v-icon>
                            <div>Compras</div>
                        </v-col>

                        <v-col cols="4" class="text-center">
                            <v-icon size="36">mdi-package-variant-closed</v-icon>
                            <div>Envíos</div>
                        </v-col>

                        <v-col cols="4" class="text-center">
                            <v-icon size="36">mdi-lightning-bolt-outline</v-icon>
                            <div>Servicios</div>
                        </v-col>
                    </v-row>

                    <v-card class="delivery-card mt-10" flat>
                        <v-card-text class="d-flex align-center ga-4">
                            <v-icon size="40" color="green-darken-1">
                                mdi-map-marker-radius
                            </v-icon>

                            <div>
                                <strong>Entregas rápidas</strong>
                                <div class="text-body-2">
                                    Todo llega a su destino
                                </div>
                            </div>
                        </v-card-text>
                    </v-card>
                </div>

                <div class="brand-footer">
                    SwiftLoad · Panel Administrativo
                </div>
            </v-col>

            <!-- Panel de inicio de sesión -->
            <v-col cols="12" md="6" class="form-panel">
                <div class="admin-label">
                    <v-icon color="success" size="28">
                        mdi-truck-fast
                    </v-icon>
                    <span>Panel Administrativo</span>
                </div>

                <v-card class="login-card" flat>
                    <v-card-text>
                        <div class="eyebrow">SWIFTLOAD</div>

                        <h1 class="login-title">
                            Bienvenido de nuevo
                        </h1>

                        <p class="subtitle">
                            Ingresa tus credenciales para acceder al
                            panel administrativo.
                        </p>

                        <v-form ref="loginForm" v-model="formValido" @submit.prevent="iniciarSesion">
                            <label class="field-label">
                                Correo electrónico
                            </label>

                            <v-text-field v-model.trim="email" placeholder="admin@swiftload.com"
                                prepend-inner-icon="mdi-email-outline" type="email" variant="outlined"
                                density="comfortable" :rules="emailRules" autocomplete="username" required />

                            <label class="field-label">
                                Contraseña
                            </label>

                            <v-text-field v-model="password" placeholder="Ingresa tu contraseña"
                                prepend-inner-icon="mdi-lock-outline" :append-inner-icon="mostrarPassword ? 'mdi-eye-off' : 'mdi-eye'
                                    " :type="mostrarPassword ? 'text' : 'password'"
                                @click:append-inner="mostrarPassword = !mostrarPassword" variant="outlined"
                                density="comfortable" :rules="passwordRules" autocomplete="current-password" required />

                            <div class="form-options">
                                <v-checkbox v-model="recordarme" label="Recordarme" color="success" density="compact"
                                    hide-details />

                                <v-btn variant="text" color="success" size="small" type="button"
                                    @click="mostrarRecuperacion">
                                    ¿Olvidaste tu contraseña?
                                </v-btn>
                            </div>

                            <v-alert v-if="mensaje" type="error" variant="tonal" density="compact" class="mb-4">
                                {{ mensaje }}
                            </v-alert>

                            <v-btn type="submit" color="success" block size="large" rounded="lg" class="login-button">
                                Iniciar sesión
                                <v-icon end>mdi-arrow-right</v-icon>
                            </v-btn>
                        </v-form>

                        <v-card class="security-notice mt-8" color="green-lighten-5" flat>
                            <v-card-text class="d-flex align-start ga-3">
                                <v-icon color="success" size="30">
                                    mdi-shield-check
                                </v-icon>

                                <div>
                                    <strong>
                                        Acceso exclusivo para personal autorizado
                                    </strong>

                                    <p class="security-text">
                                        El acceso al sistema está reservado para
                                        los administradores de SwiftLoad.
                                    </p>
                                </div>
                            </v-card-text>
                        </v-card>
                    </v-card-text>
                </v-card>
            </v-col>

        </v-row>
    </v-container>
</template>

<script>
import api, { mensajeError } from '@/services/api'

export default {
    name: 'LoginView',

    data() {
        return {
            email: '',
            password: '',
            recordarme: false,
            mostrarPassword: false,
            formValido: false,
            mensaje: '',

            emailRules: [
                v => !!v || 'El correo electrónico es obligatorio',
                v => /.+@.+\..+/.test(v) || 'Ingresa un correo válido'
            ],

            passwordRules: [
                v => !!v || 'La contraseña es obligatoria'
            ]
        }
    },

    methods: {
        async iniciarSesion() {
            const resultado = await this.$refs.loginForm.validate()
            if (!resultado.valid) return

            this.mensaje = ''

            try {
                const { data } = await api.post('/admin/login', {
                    correo: this.email,
                    contrasena: this.password
                })

                localStorage.setItem('admin_token', data.token)
                localStorage.setItem('admin_usuario', JSON.stringify(data.usuario))
                this.$router.push('/dashboard')
            } catch (error) {
                this.mensaje = mensajeError(error)
            }
        },

        mostrarRecuperacion() {
            this.mensaje =
                'La recuperación de contraseña se implementará posteriormente.'
        }
    }
}
</script>

<style scoped>
.login-page {
    width: 100%;
    min-height: 100vh;
    min-height: 100dvh;
    background: #f8fafc;
    color: #0f172a;
}

.login-page>.v-row {
    min-height: 100vh;
    min-height: 100dvh;
}

.brand-panel {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 64px;
    overflow: hidden;
    color: white;
    background: linear-gradient(145deg, #022f2b, #047857, #059669);
}

.brand-content {
    position: relative;
    z-index: 1;
    width: 100%;
    max-width: 520px;
    margin: auto;
}

.brand-logo {
    margin-bottom: 28px;
}

.brand-name {
    font-size: 48px;
    font-weight: 800;
    font-style: italic;
    letter-spacing: -2px;
}

.brand-name span {
    color: #34d399;
}

.brand-name strong {
    color: white;
}

.brand-content h2 {
    max-width: 440px;
    font-size: 28px;
    line-height: 1.4;
}

.brand-description {
    margin-top: 14px;
    color: #d1fae5;
    line-height: 1.8;
}

.services {
    max-width: 430px;
}

.services .v-col {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
}

.delivery-card {
    max-width: 350px;
    border: 1px solid #ffffff30;
    border-radius: 14px;
    background: #ffffff15;
    color: white;
}

.brand-footer {
    position: absolute;
    bottom: 24px;
    left: 64px;
    color: #d1fae5;
    font-size: 13px;
}

.form-panel {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 100px 7% 50px;
    background: white;
}

.admin-label {
    position: absolute;
    top: 30px;
    right: 30px;
    display: flex;
    align-items: center;
    gap: 10px;
    color: #334155;
    font-size: 14px;
}

.login-card {
    width: 100%;
    max-width: 480px;
}

.eyebrow {
    color: #059669;
    font-size: 13px;
    font-weight: 800;
    letter-spacing: 2px;
}

.login-title {
    margin-top: 14px;
    font-size: clamp(30px, 3vw, 42px);
    font-weight: 700;
    letter-spacing: -1.3px;
}

.subtitle {
    margin: 12px 0 32px;
    color: #64748b;
    line-height: 1.7;
}

.field-label {
    display: block;
    margin-bottom: 8px;
    font-size: 14px;
    font-weight: 600;
}

.form-options {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 8px;
    margin: 0 0 20px;
}

.login-button {
    min-height: 54px;
    font-weight: 700;
}

.security-notice {
    border-radius: 12px;
}

.security-text {
    margin-top: 8px;
    color: #64748b;
    font-size: 13px;
    line-height: 1.6;
}

@media (max-width: 960px) {
    .brand-panel {
        padding: 40px 30px;
    }

    .form-panel {
        padding-right: 30px;
        padding-left: 30px;
    }

    .brand-footer {
        left: 30px;
    }
}

@media (max-width: 600px) {
    .brand-panel {
        min-height: 240px;
        padding: 28px;
    }

    .brand-name {
        font-size: 36px;
    }

    .brand-content h2 {
        font-size: 22px;
    }

    .brand-description,
    .services,
    .delivery-card,
    .brand-footer {
        display: none;
    }

    .form-panel {
        padding: 95px 20px 30px;
    }

    .admin-label {
        top: 25px;
        left: 25px;
        right: auto;
    }
}
</style>
