<template>
    <div>
        <div class="text-center mb-6">
            <p class="text-sm text-gray-600">Mobile-friendly collection of tools for Amateur Telescope Makers</p>
        </div>
        
        <div class="grid gap-3">
            <div class="card bg-base-200 p-3">
                <h2 class="text-sm font-semibold mb-2">Available Tools</h2>
                <div class="grid grid-cols-1 gap-2">
                    <router-link 
                        v-for="route in routes.filter(r => r.path !== '/')" 
                        :key="route.path" 
                        :to="route.path" 
                        class="btn btn-outline btn-sm justify-start text-xs"
                    >
                        {{ route.name }}
                    </router-link>
                </div>
            </div>
            
            <div class="card bg-base-200 p-3">
                <h2 class="text-sm font-semibold mb-2">About</h2>
                <p class="text-xs text-gray-600">
                    This application provides specialized calculators and reference tools for Amateur Telescope Makers (ATMs). 
                    All calculations are performed client-side and work offline after initial load.
                </p>
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
};
</script>
<style></style>