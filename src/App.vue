<template>
    <div id="app" class="min-h-screen bg-gray-100">
        <div class="container mx-auto px-2 py-3">
            <div class="card bg-white shadow-lg max-w-2xl mx-auto">
                <div class="card-body p-4 pb-24">
                    <div class="text-center mb-4">
                        <router-link to="/"
                            ><h1
                                class="text-lg font-light text-gray-500 tracking-wide"
                            >
                                🔭 ATM Buddy
                            </h1></router-link
                        >
                    </div>
                    <router-view></router-view>
                </div>
            </div>
        </div>

        <!-- Floating Menu Button -->
        <div class="fixed bottom-4 left-4 z-50">
            <div class="dropdown dropdown-top">
                <div
                    tabindex="0"
                    role="button"
                    class="btn btn-circle btn-primary shadow-lg"
                >
                    <svg
                        class="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M4 6h16M4 12h16M4 18h16"
                        ></path>
                    </svg>
                </div>
                <ul
                    tabindex="0"
                    class="menu dropdown-content bg-white rounded-box shadow-xl p-2 w-64 mb-2"
                >
                    <li v-for="route in routes" :key="route.path">
                        <router-link
                            :to="route.path"
                            :class="{
                                'active bg-blue-100 text-blue-800':
                                    route.path === $route.path,
                            }"
                            class="text-gray-800 text-xs py-2"
                        >
                            {{ route.name }}
                        </router-link>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    computed: {
        routes() {
            return this.$router.getRoutes();
        },
    },
    mounted() {},
};
</script>

<style scoped>
.menu li > a.active {
    background-color: rgba(59, 130, 246, 0.1);
    color: #3b82f6;
}
</style>
