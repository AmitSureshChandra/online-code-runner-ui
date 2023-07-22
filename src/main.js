import { createApp } from 'vue'
import App from './App.vue'
import axios from 'axios'

createApp(App).mount('#app')

axios.defaults.baseURL = "http://localhost:8010"