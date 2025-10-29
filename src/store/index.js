import {createStore} from 'vuex'
import {initAuth} from '../utils/auth'

const store = createStore({
    state: {
        auth: null
    },
    mutations: {
        setAuth(state, auth) {
            state.auth = auth
        },
        removeAuth(state) {
            state.auth = null
        }
    },
    actions: {
        setAuth(context, auth) {
            context.commit("setAuth", auth)
        },
        removeAuth(context) {
            context.commit("removeAuth")
        },
        initAuth(context) {
            try {
                const auth = initAuth()
                context.commit("setAuth", auth)
            } catch (error) {
                console.error('初始化認證狀態失敗:', error)
                context.commit("setAuth", null)
            }
        }
    }
})

// 初始化認證狀態
store.dispatch('initAuth')

export default store