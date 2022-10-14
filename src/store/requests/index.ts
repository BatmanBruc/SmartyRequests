import type {  Module } from 'vuex';
import { actions } from './actions';
import { mutations } from './mutations';
import type { RequestsState } from './types';
import type { RootState } from '../types';

export const state: RequestsState = {
    list: [],
    item: null,
    count: 0,
    limit: 5,
    page: 1,
    loading: false,
    error: false
};

export const requests: Module<RequestsState, RootState> = {
    state,
    actions,
    mutations
};