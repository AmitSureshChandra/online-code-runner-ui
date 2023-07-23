import { createApp } from 'vue'
import App from './App.vue'
import axios from 'axios'

axios.defaults.baseURL = process.env.VUE_APP_API_HOST_URL

createApp(App).mount('#app')
