<template>
    <wnd-component caption="Window1"
                   @require-inner-item="setInnerElement"
                   :visible.sync="isVisibleWindow"></wnd-component>
    <div ref="windowInner" class="window-inner">
        Hello world!!
    </div>
</template>

<script>
    import wndComponent from "./wnd.vue"
    import store from "./store.js"

    export default {
        components: {
            wndComponent
        },
        data: function () {
            return {
                isVisibleWindow: true
            };
        }
        store,
        methods: {
            setInnerElement: function(callback){
                //ここでウインドウ内部に入れる要素を渡してあげる
                callback(this.$refs.windowInner);
            }
        }
    }
<script>

<style scoped>
.window-inner {
    width: 200px;
    height: 100px;
    color: white;
}
</style>
