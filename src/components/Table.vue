<template>
    <div class="hot-table">
        {{ $route.params.id }}
        <HotTable :root="root" :settings="settings"></HotTable>
    </div>
</template>

<script>
import moment from 'moment';
import numbro from 'numbro';
import pikaday from 'pikaday';
import Zeroclipboard from 'zeroclipboard';
import Handsontable from 'handsontable';
import HotTable from 'vue-handsontable-official';

export default {
    data: function() {
        return {
            settings: {
                minCols: 100,
                minRows: 100,
                colHeaders: true,
                rowHeaders: true,
                manualColumnResize: true,
                manualRowResize: true,
                manualColumnMove: true,
                manualRowMove: true,
                persistentState: true,
                undo: true,
                columnSorting: true
            }
        }
    },
    components: {
        HotTable
    }
}
</script>

<style lang="scss">
@import
    "~bootstrap/scss/bootstrap",
    "~style/_vars.scss"
;
</style>