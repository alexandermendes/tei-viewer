 <template>
    <div class="app">
        <main>
            <h1 class="card-title">BL TEI Convertor</h1>
            <p class="lead">Convert TEI to Excel</p>
            <div class="card">
                <div class="card-block">

                    <ul class="list-unstyled m-0">
                        <li class="justify-content-between" v-for="f in files">
                            {{ f }}
                            <span class="close" v-on:click="removeFile(f)">&times;</span>
                        </li>
                    </ul>

                    <form>
                        <select class="custom-select">
                          <option disabled selected hidden>Choose Format</option>
                          <option v-for="fmt in formats">{{ fmt }}</option>
                        </select>
                        <span class="btn btn-primary btn-file" role="button">
                            Add Files <input type="file" accept="application/xml" @change="onFileChange" multiple>
                        </span>
                        <button type="button" role="button" class="btn btn-success" v-on:click="generate" :disabled="!filesAdded ">Generate</button>
                    </form>
                </div>
            </div>
        </main>
  </div>
</template>

<script>
import localForage from "localforage";
import xml2js from 'xml2js';

localForage.config({
    name        : 'TEI-Viewer',
    version     : 1.0,
    storeName   : 'teixml',
});

export default {
    name: 'app',

    data: function () {
        return {
            formats: [
                "bl-simple.xsl"
            ]
        }
    },
    methods: {
        onFileChange(e) {
            let files  = e.target.files || e.dataTransfer.files,
                reader = {};

            if (!files.length) {
                return;
            }

            for (let f of files) {
                reader = new FileReader();
                reader.onload = () => {
                    localForage.setItem(f.name, reader.result);
                };

                reader.readAsText(f);
            }
            this.$forceUpdate()
        },
        generate() {
            localForage.keys().then(function(keys) {
                for (let k of keys) {
                    localForage.getItem(k).then(function(item) {
                        console.log(item);
                    });
                }
            }).then(function() {
                localForage.clear();
            });
        },
        removeFile(f) {
            localForage.removeItem(f);
        }
    },
    asyncComputed: {
        filesAdded() {
            return localForage.length().then(function(l) {
                return l > 0;
            });
        },
        files() {
            return localForage.keys().then(function(keys) {
                return keys;
            })
        }
    }
}
</script>

<style lang="scss">
@import '~bootstrap/scss/bootstrap';

.app {
    height: 100vh;
    width: 100vw;
    display: flex;
    flex-direction: column;
}

main {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: $white;
    background-color: $brand-primary;
    flex: 1 1 0;
}

.card {
    color: $body-color;

    .card-block {
        display: flex;
        flex-direction: column;
        max-height: 50vh;
        overflow-y: auto;
    }
}

li {
    .close {
        visibility: hidden;
    }

    &:hover {
        .close {
            visibility: initial;
        }
    }
}

h1 {
    font-weight: $font-weight-bold;
    letter-spacing: 1.25px;
}

.btn-file {
    position: relative;
    overflow: hidden;
}
.btn-file input[type=file] {
    position: absolute;
    top: 0;
    right: 0;
    filter: alpha(opacity=0);
    opacity: 0;
    outline: none;
    cursor: inherit;
}
</style>
