import { createStore, type StoreOptions } from "vuex";
import type { RootState } from './types'
import { requests } from "./requests";
import { fields } from "./fields";

const store = createStore<RootState>({
    state:{
        apiDomain: 'localhost'
    },
    modules: {
        requests,
        fields
    }
})

export default store