import type { ActionTree } from 'vuex';
import axios from 'axios';
import type { FieldState, Field, FieldError } from './types';
import type { RootState } from '../types';
import MutationTypes from './mutations-type';
import ActionTypes from './action-types';
import config from '../../config'

export const actions: ActionTree<FieldState, RootState> = {
    [ActionTypes.GET_FIELDS]({ commit, state }): any {
        commit(MutationTypes.CHANGE_FIELDS_LOADING);
        axios({
            method: 'post',
            url: config.domain + '/fields',
            data: {
                limit: state.limit,
                skip: state.limit * ( state.page - 1 )
            }
        }).then((response)=>{
            const list: Field[] = response.data.list;
            const count: Field[] = response.data.count;
            commit(MutationTypes.SET_FIELDS, list);
            commit(MutationTypes.SET_FIELD_ASSOCIATIONS, list);
            commit(MutationTypes.SET_FIELDS_COUNT, count);
            commit(MutationTypes.CHANGE_FIELDS_LOADING);
        }, (error)=>{
            const err: FieldError = error;
            console.log(err)
            commit(MutationTypes.SET_FIELDS_ERROR, err);
            commit(MutationTypes.CHANGE_FIELDS_LOADING);
        })
    }
};