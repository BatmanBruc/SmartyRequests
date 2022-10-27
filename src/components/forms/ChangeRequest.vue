<template>
    <div>
        <edit-outlined :style="{cursor: 'pointer'}" @click="showModal" />
        <a-modal
        v-model:visible="visible"
        title="Новая заявка"
        :confirm-loading="confirmLoading"
        @ok="send"
        okText="Сохранить"
        cancelText="Отмена"
        v-if="formState"
        >
            <div v-if="!loading">
                <a-form-item has-feedback label="Название" name="name">
                    <a-input v-model:value="formState.name" type="text" autocomplete="off" />
                </a-form-item>
                <a-form-item has-feedback label="Описание" name="description">
                    <a-input v-model:value="formState.description" type="text" autocomplete="off" />
                </a-form-item>
                <a-form-item has-feedback label="Дата" name="date">
                    <a-date-picker v-model:value="date" />
                </a-form-item>
                <a-form-item v-for="field in fields" has-feedback :label="field.title" :name="field.name" v-bind:key="field.id">
                    <MultiField v-model:value="formState[field.name]" :options="getEnitySelectOptions(field.options)" :type="field.inputType" />
                </a-form-item>
            </div>
            <a-spin :style="{
                margin: 'auto',
                display: 'block'
            }" v-else />
        </a-modal>
    </div>
</template>
<script lang="ts">
import { defineComponent, computed, watch, ref, type PropType } from 'vue'
import { notification } from 'ant-design-vue';
import axios from 'axios'
import { useStore } from 'vuex'
import dayjs, { Dayjs} from 'dayjs';
import  { EditOutlined } from '@ant-design/icons-vue';
import type { Request } from '../../store/requests/types'
import ActionRequestTypes from '../../store/requests/action-types'
import config from '../../config'
import MultiField from './MultiField.vue'
import { getEnitySelectOptions } from './FieldTypesService'

export default defineComponent({
    name: "CreateRequest",
    components: {
        EditOutlined,
        MultiField
    },
    props: {
        id: { type: String, default: ()=>null }
    },
    setup(props){
        const store = useStore();

        const visible = ref<boolean>(false);
        watch(visible, ()=>{
            if(visible.value)
                get()
        })
        const confirmLoading = ref<boolean>(false);
        const showModal = () => {
            visible.value = true;
        };
        
        const data = ref<Request>({
            name: '',
            description: '',
            date: dayjs()
        })
        watch(data, ()=>{
            let obj: {
                [key:string]: any
            } = {}
            for (let field of store.state.fields.list) {
                if(field.inputType == 4)
                    obj[field.name] = dayjs(data.value[field.name])
                else
                    obj[field.name] = data.value[field.name]
            }
            formState.value = {
                name: data.value.name,
                description: data.value.description,
                date: dayjs(data.value.date),
                ...obj
            }
        })
        const date = ref<Dayjs>(dayjs())
        const fields = computed(()=> store.state.fields.list);
        const formState = ref<Request>({
            name: '',
            description: '',
            date: dayjs()
        })
        const fieldAssociations = computed(()=> store.state.fields.fieldAssociations);
        const loading = ref<boolean>(false)
        const get = () => {
            loading.value = true;
            axios({
                url: config.domain + '/request/' + props.id,
                method: 'get',
            }).then((response)=>{
                data.value = response.data
                loading.value = false;
            }).catch((error)=>{
                notification.error({
                    message: error.response.data.description,
                    description: error.response.data.extra.map((field: string)=>fieldAssociations.value[field]).join(', ')
                })
                loading.value = false;
            })
        };
        const send = () => {
            confirmLoading.value = true;
            axios({
                url: config.domain + '/request/' + props.id,
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
      date,
      fields,
      loading,
      getEnitySelectOptions
    };
    }
})
</script>
<style scoped>
</style>
   