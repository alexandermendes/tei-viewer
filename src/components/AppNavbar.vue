<template>
    <b-navbar toggleable>
        <b-nav-toggle target="nav_collapse"></b-nav-toggle>
        <b-link class="navbar-brand" to="/">
          <span>TEI Viewer</span>
        </b-link>
        <b-collapse is-nav id="nav_collapse">
            <b-nav is-nav-bar>
                <!-- table buttons injected -->
            </b-nav>
            <b-nav is-nav-bar class="ml-auto">
                <b-nav-item-dropdown text="Format" right>
                    <!-- available formats injected -->
                </b-nav-item-dropdown>
                <b-form-input v-model="text" id="search" type="search" placeholder="Search"></b-form-input>
                <b-form-file multiple v-model="array" id="upload" choose-label="Add Files"></b-form-file>
            </b-nav>
        </b-collapse>
    </b-navbar>
</template>

<script>
export default {}
</script>

<style lang="scss">
@import
    "~bootstrap/scss/bootstrap",
    "~bootstrap-vue/dist/bootstrap-vue",
    "~style/_vars.scss"
;

.navbar {
    @extend .bg-faded;
    border-bottom: 1px solid $gray-lighter;

    .navbar-brand {
        font-weight: $font-weight-bold;
        text-transform: uppercase;
    }

    .nav-item {
        font-size: $font-size-xs;
        font-weight: $font-weight-bold;
        letter-spacing: 0.8px;
        text-transform: uppercase;
    }
}
</style>