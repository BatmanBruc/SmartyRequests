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
                <a-input v-if="field.inputType == 0" v-model:value="formState[field.name]" type="text" autocomplete="off" />
                <a-textarea v-if="field.inputType == 1" v-model:value="formState[field.name]" type="text" autocomplete="off" />
                <a-checkbox v-if="field.inputType == 2" v-model:checked="formState[field.name]" autocomplete="off" />
                <a-select
                    v-if="field.inputType == 3"
                    ref="select"
                    v-model:value="formState[field.name]"
                    style="width: 120px"
                    >
                    <a-select-option v-for="option in field.options" :value="option" v-bind:key="option">{{ option }}</a-select-option>
                </a-select>
                <a-date-picker v-if="field.inputType == 4" v-model:value="formState[field.name]" />
            </a-form-item>
        </a-modal>
    </div>
</template>
<script lang="ts">
import { defineComponent, computed, ref, type PropType } from 'vue'
import { notification } from 'ant-design-vue';
import axios from 'axios'
import { useStore } from 'vuex'
import dayjs, { Dayjs} from 'dayjs';
import  { EditOutlined } from '@ant-design/icons-vue';
import type { Request } from '../../store/requests/types'
import ActionRequestTypes from '../../store/requests/action-types'
import config from '../../config'

export default defineComponent({
    name: "CreateRequest",
    components: {
        EditOutlined
    },
    props: {
        data: { type: Object as PropType<Request>, default: ()=>{} }
    },
    setup(props){
        const store = useStore();

        const visible = ref<boolean>(false);
        const confirmLoading = ref<boolean>(false);
        const showModal = () => {
            visible.value = true;
        };
        
        const date = ref<Dayjs>(dayjs())
        const fields = computed(()=> store.state.fields.list);
        const fieldsData = computed(()=>{ 
            let obj: {
                [key:string]: any
            } = {}
            for (let field of store.state.fields.list) {
                obj[field.name] = props.data[field.name]
            } 
            return obj;
        });
        const formState = ref<Request>({
            name: props.data.name,
            description: props.data.description,
            date: props.data.date,
            ...fieldsData.value
        })
        const fieldAssociations = computed(()=> store.state.fields.fieldAssociations);
        const send = () => {
            confirmLoading.value = true;
            axios({
                url: config.domain + '/request/' + props.data.id,
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
    };
    }
})
</script>
<style scoped>
</style>
   