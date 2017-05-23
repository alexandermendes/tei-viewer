 <template>
    <div class="app">
        <app-navbar></app-navbar>
        <main>
        </main>
        <app-footer></app-footer>
  </div>
</template>

<script>
import AppNavbar from './AppNavbar.vue'
import AppFooter from './AppFooter.vue'

export default {
    name: 'app',
    components: { 
        AppNavbar, 
        AppFooter 
    }
}
</script>

<style lang="scss">
html {
	display: flex;
    
    body {
        min-height: 100vh;
        min-width: 100vw;
        display: flex;
        flex-direction: column;
        
        main {
            flex: 1 1 0;
            overflow-y: auto;
            position: relative;
        }
    }
}
</style>
