<template>
    <div id="app">
        <div class="tags">
            <div
                class="tag"
                v-for="route in routes"
                :class="{ 'is-primary': route.path === $route.path }"
            >
                <router-link :to="route.path" style="color: black">{{
                    route.name
                }}</router-link>
            </div>
        </div>
        <div
            class="box"
            style="
                width: 100%;
                max-width: 540px;
                margin: auto;
                margin-bottom: 15px;
            "
        >
            <router-view></router-view>
        </div>
    </div>
</template>

<script>
import "bulma";

export default {
    computed: {
        routes() {
            return this.$router.getRoutes();
        },
    },
    mounted() {},
};
</script>

<style lang="scss">
html,
body {
    background: gray;
    overflow-x: hidden;
}

html {
    font-size: 14.5px !important;
}

#app {
    padding: 5px;
}

.is-horizontal {
    display: flex;
    label {
        min-width: 10ch;
    }
}

@media screen and (-webkit-min-device-pixel-ratio: 0) {
    select,
    textarea,
    input {
        font-size: 16px;
    }
}
</style>
