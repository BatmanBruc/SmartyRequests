<template>
    <div :style="{
        'margin': '20px'
    }">
        <a-button type="primary" @click="showModal">Создать заявку</a-button>
        <a-modal
        v-model:visible="visible"
        title="Новая заявка"
        :confirm-loading="confirmLoading"
        @ok="send"
        okText="Отправить"
        cancelText="Отмена"
        >
            <a-form-item has-feedback label="Название" name="name">
                <a-input v-model:value="formState.name" type="text" autocomplete="off" />
            </a-form-item>
            <a-form-item has-feedback label="Описание" name="description">
                <a-input v-model:value="formState.description" type="text" autocomplete="off" />
            </a-form-item>
            <a-form-item has-feedback label="Дата" name="date">
                <a-date-picker v-model:value="formState.date" />
            </a-form-item>
            <a-form-item v-for="field in fields" has-feedback :label="field.title" :name="field.name" v-bind:key="field.id">
                <a-input v-if="field.inputType == 1" v-model:value="formState[field.name]" type="text" autocomplete="off" />
                <a-textarea v-if="field.inputType == 2" v-model:value="formState[field.name]" type="text" autocomplete="off" />
                <a-checkbox v-if="field.inputType == 3" v-model:checked="formState[field.name]" autocomplete="off" />
                <a-select
                    v-if="field.inputType == 4"
                    ref="select"
                    v-model:value="formState[field.name]"
                    style="width: 120px"
                    >
                    <a-select-option v-for="option in field.options" :value="option" v-bind:key="option">{{ option }}</a-select-option>
                </a-select>
                <a-date-picker v-if="field.inputType == 5" v-model:value="formState[field.name]" />
            </a-form-item>
        </a-modal>
    </div>
</template>
<script lang="ts">
import { defineComponent, computed, ref, watch } from 'vue'
import { notification } from 'ant-design-vue';
import axios from 'axios'
import { useStore } from 'vuex'
import dayjs from 'dayjs';
import ActionRequestTypes from '../../store/requests/action-types'
import type { Request } from '../../store/requests/types'
import config from '../../config'

export default defineComponent({
    name: "CreateRequest",
    setup(){
        const store = useStore();

        const visible = ref<boolean>(false);
        const confirmLoading = ref<boolean>(false);
        const showModal = () => {
            visible.value = true;
        };
        
        const fields = computed(()=> store.state.fields.list);
        const fieldsData = computed(()=>{ 
            let obj: {
                [key:string]: any
            } = {}
            for (let field of store.state.fields.list) {
                obj[field.name] = field.default
            } 
            return obj;
        });
        watch(fieldsData, ()=>{
            formState.value = {
                ...formState.value,
                ...fieldsData.value
            }
        })
        const formState = ref<Request>({
            name: '',
            description: '',
            date: dayjs(),
            ...fieldsData.value
        })
        const fieldAssociations = computed(()=> store.state.fields.fieldAssociations);
        const send = () => {
            confirmLoading.value = true;
            axios({
                url: config.domain + '/request',
                method: 'post',
                data: formState.value
            }).then((response)=>{
                notification.success({
                    message: response.data.description,
                    description: `
                        Название: ${response.data.content.name}
                        Описание: ${response.data.content.description}
                        Дата: ${response.data.content.date}
                    `
                })
                visible.value = false;
                confirmLoading.value = false;
                store.dispatch(ActionRequestTypes.GET_REQUESTS)
            }).catch((error)=>{
                notification.error({
                    message: error.response.data.description,
                    description: error.response.data.extra.map((field: string)=>fieldAssociations.value[field]).join(', ')
                })
                confirmLoading.value = false;
            })
        };
    return {
      visible,
      confirmLoading,
      showModal,
      send,
      formState,
      fields,
      fieldsData
    };
    }
})
</script>
<style scoped>
</style>
   