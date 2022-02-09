import { createApp } from 'vue'
import App from './App.vue'
import {createWebHashHistory, createRouter} from 'vue-router';
import BallSpherometer from './BallSpherometer.vue';
import BaaderMpcc from './BaaderMpcc.vue';
import Home from './Home.vue';

const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        {
            path: '/',
            name: 'Home',
            component: Home,
        },
        {
            path: '/sphero',
            name: 'Spherometer',
            component: BallSpherometer,
        },
        {
            path: '/mpcc_hyperbolic',
            name: 'Baader MPCCIII Hyperbola',
            component: BaaderMpcc,
        }
    ],
});

createApp(App).use(router).mount('#app')
