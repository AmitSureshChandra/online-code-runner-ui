import { createApp } from 'vue'
import AppAsync from './AppAsync.vue'
import axios from 'axios'

axios.defaults.baseURL = process.env.VUE_APP_API_HOST_URL

createApp(AppAsync).mount('#app')
