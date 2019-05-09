<transition v-on:enter="enter">
    <div class="wnd_outer"
         v-show="visible"
         v-bind:style="{
            width: this._width,
            height: this._height,
            left: this._x,
            top: this._y,
            zIndex: this.zIndex,
         }"
    >
           ...(省略)...
    </div>
</transition>

<script>
export default {
  data: function () {
      return {
          x: null,
          y: null,
          width: this.initialWidth,
          height: this.initialHeight,
          //...(省略)...
      }
  },

  //...(省略)...
  mounted: function(){
      this.$emit('require-inner-item', el => {
          this.$refs.wndInner.appendChild(el);
          //（v-show=falseの時は要素の高さが取れないので初期化しない）
          if( this.visible && this.$el ){
              this.setInitialState();
          }
      });
  },
  props: {
      visible: Boolean,
      initialPosition: {
          type: Array,
          default: null,
      },
      initialWidth: {
          type: Number,
          default: 0,
      },
      initialHeight: {
          type: Number,
          default: 0,
      },
      // ...（省略）...
  }
  methods: {
      enter: function() {
          this.setInitialState();
      },
      setInitialState: function() {
          //v-ifなどで要素自体が取れない場合は処理を中断
          if( !this.$el || !this.$refs.wndInner ) return;

          //...（一部省略）...

          let innerItemRect = this.$refs.wndInner.getBoundingClientRect();
          this.width = this.initialWidth || innerItemRect.width;
          this.height = this.initialHeight || innerItemRect.height;

          //初期化が済んでいれば処理を終了
          if( (this.x !== null) && (this.y !== null) ) return;
          if( this.initialPosition && this.initialPosition.length === 2 ){
              //initialPositionに値が設定されていれば初期位置とする
              this.x = this.initialPosition[0];
              this.y = this.initialPosition[1];
          } else {
              //初期位置が与えられていなければ画面中央に表示
              this.x = (window.innerWidth / 2) - (this.$el.clientWidth / 2);
              this.y = (window.innerHeight / 2) - (this.$el.clientHeight / 2);
          }
      },
      ...(省略)...
      }
      }
</script>
