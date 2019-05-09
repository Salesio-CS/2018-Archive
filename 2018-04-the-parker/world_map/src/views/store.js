import Vuex from "vuex"

export default new Vuex.Store({
    state: {
        wndStatuses: {},     //ウインドウの状態
        wndCount: 0,         //総ウインドウ数
        maxWndZIndex: 0,     //zIndex最大値
    },
    mutations: {
        setWndStatuses: (state, payload) => {
            //ウインドウの登録処理
            if( !state.wndStatuses[payload.wndID] ) {
                Vue.set(state.wndStatuses, payload.wndID, {
                    zIndex: state.wndCount,
                });
                state.maxWndZIndex = state.wndCount;
                state.wndCount = state.wndCount+1;
            }
        },
        moveWndToTop: (state, payload) => {
            //ウインドウの入れ替え処理
            let oldZIndex = state.wndStatuses[payload.wndID].zIndex;
            //ウインドウを最前面にする
            state.wndStatuses[payload.wndID].zIndex = state.maxWndZIndex;
            //最前面にしたウインドウより手前に表示されていたウインドウのzIndexをデクリメント
            for(let key in state.wndStatuses){
                if( (state.wndStatuses[key].zIndex > oldZIndex) && (key != payload.wndID) ) {
                    state.wndStatuses[key].zIndex -= 1;
                }
            }
        },
    },
    actions: {
        setWndStatuses(context, payload) {
            context.commit('setWndStatuses', payload);
        },
        moveWndToTop(context, payload) {
            context.commit('moveWndToTop', payload);
        }
    }
});
