import type { MutationTree } from "vuex";
import type { FieldState, Field, FieldError } from "./types";
import MutationTypes from "./mutations-type";

export const mutations: MutationTree<FieldState> = {
    [MutationTypes.SET_FIELDS](state, payload: Array<Field>){
        state.error = false;
        state.list = payload;
    },
    [MutationTypes.SET_FIELDS_COUNT](state, payload: number){
        state.error = false;
        state.count = payload;
    },
    [MutationTypes.SET_FIELDS_ERROR](state, payload: FieldError){
        state.error = payload;
        state.list = [];
    },
    [MutationTypes.CHANGE_FIELDS_PAGE](state, payload: number){
        state.page = payload;
    },
    [MutationTypes.CHANGE_FIELDS_LOADING](state, payload: number){
        state.loading = !state.loading;
    },
    [MutationTypes.SET_FIELD_ASSOCIATIONS](state, payload: Array<Field>){
        let associations: {
            [key: string]: string
        } = {
            name: 'Имя',
            description: 'Описание',
            date: 'Дата'
        }
        for (let field of payload) {
            associations[field.name] = field.title
        }
        console.log(associations)
        state.fieldAssociations = associations;
    }
}