 <template>
    <div class="app">
        <div class="container app-content">
        </div>
  </div>
</template>

<script>
import AppNav from './AppNav.vue'
import AppFooter from './AppFooter.vue'

export default {
    name: 'app',
    components: { 
        AppNav, 
        AppFooter 
    },
    data () {
        return {
            title: "Hello"
        }
    }
}
</script>

<style lang="scss">

</style>