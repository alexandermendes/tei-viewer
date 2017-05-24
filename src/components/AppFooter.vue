<template>
    <footer id="main-footer" class="hidden-print bg-faded text-xs-center">
        <div class="container-fluid">
            <div class="row">
                <div class="col-xs-12">
                    <span id="table-pagination"></span>
                    <span id="table-info"></span>
                </div>
            </div>
        </div>
    </footer>
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

footer {
    width: 100%;
    border-top: $border-light;
    bottom: 0;
}

footer .container-fluid {
    height: 100%;
}

footer .row {
    display: flex;
    align-items: center;
    height: 100%;
}

footer .pagination,
footer label {
    margin-top: 0;
    margin-bottom: 0;
}

footer .page-link {
    padding: 0.45rem 0.85rem;
}

footer .form-control {
    display: inline-block;
    width: auto;
    vertical-align: middle;
}

footer .fa {
    color: darken($grey, 35%);
}
</style>