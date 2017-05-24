<template>
    <form id="upload-form" class="dropzone" enctype="multipart/form-data">
        <div class="dz-message">
                <div class="container">
                    <p><span class="fa fa-upload fa-3x"></span></p>
                    <p>Drag & drop XML documents here</p>
                    <p>or</p>
                    <button class="btn btn-primary btn-lg add-files">Choose XML documents</button>
                </div>
            </div>
        </form>
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
        display: flex;
        align-items: center;
        font-size: $font-size-xs;
        font-weight: $font-weight-bold;
        letter-spacing: 0.8px;
        text-transform: uppercase;
    }
}
</style>