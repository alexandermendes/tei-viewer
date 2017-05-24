 <template>
    <div class="app">
        <app-navbar></app-navbar>
        <main>
        <router-view></router-view>
        </main>
        <app-footer></app-footer>
  </div>
</template>

<script>
import AppNavbar from './components/AppNavbar.vue'
import AppFooter from './components/AppFooter.vue'

export default {
    name: 'app',
    components: {
        AppNavbar,
        AppFooter
    }
}
</script>

<style lang="scss">
.app {
    height: 100vh;
    width: 100vw;
    display: flex;
    flex-direction: column;
    width: 100%;
}

main {
    flex: 1 1 0;
    overflow-y: auto;
    position: relative;
}
</style>
