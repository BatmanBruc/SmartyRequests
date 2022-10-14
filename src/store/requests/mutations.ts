import type { MutationTree } from "vuex";
import type { RequestsState, Request, RequestError } from "./types";
import MutationTypes from "./mutations-type";

export const mutations: MutationTree<RequestsState> = {
    [MutationTypes.SET_REQUESTS](state, payload: Array<Request>){
        state.error = false;
        state.list = payload;
    },
    [MutationTypes.SET_REQUESTS_COUNT](state, payload: number){
        state.error = false;
        state.count = payload;
    },
    [MutationTypes.SET_REQUESTS_ERROR](state, payload: RequestError){
        state.error = payload;
        state.list = [];
    },
    [MutationTypes.CHANGE_REQUESTS_PAGE](state, payload: number){
        state.page = payload;
    },
    [MutationTypes.CHANGE_REQUESTS_LOADING](state){
        state.loading = !state.loading;
    },
    [MutationTypes.SET_REQUEST](state, payload: Request){
        state.item = payload;
    }
}