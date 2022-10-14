import type {  Module } from 'vuex';
import { actions } from './actions';
import { mutations } from './mutations';
import type { FieldState } from './types';
import type { RootState } from '../types';

export const state: FieldState = {
    list: [],
    fieldAssociations: {},
    count: 0,
    limit: 5,
    page: 1,
    loading: false,
    error: false,
};

export const fields: Module<FieldState, RootState> = {
    state,
    actions,
    mutations
};