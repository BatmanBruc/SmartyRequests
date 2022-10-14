import type { ActionTree } from 'vuex';
import axios from 'axios';
import type { RequestsState, Request, RequestError } from './types';
import type { RootState } from '../types';
import MutationTypes from './mutations-type';
import ActionTypes from './action-types';
import config from '../../config'

export const actions: ActionTree<RequestsState, RootState> = {
    [ActionTypes.GET_REQUESTS]({ commit, state }): any {
        commit(MutationTypes.CHANGE_REQUESTS_LOADING);
        axios({
            method: 'post',
            url: config.domain + '/requests',
            data: {
                limit: state.limit,
                skip: state.limit * ( state.page - 1 )
            }
        }).then((response)=>{
            const list: Request[] = response.data.list;
            const count: Request[] = response.data.count;
            commit(MutationTypes.SET_REQUESTS, list);
            commit(MutationTypes.SET_REQUESTS_COUNT, count);
            commit(MutationTypes.CHANGE_REQUESTS_LOADING);
        }, (error)=>{
            const err: RequestError = error;
            console.log(err)
            commit(MutationTypes.SET_REQUESTS_ERROR, err);
            commit(MutationTypes.CHANGE_REQUESTS_LOADING);
        })
    }
};