<template>
    <div>
        <edit-outlined :style="{cursor: 'pointer'}" @click="showModal" />
        <a-modal
        v-model:visible="visible"
        title="Новое поле"
        :confirm-loading="confirmLoading"
        @ok="send"
        okText="Отправить"
        cancelText="Отмена"
        >
            <a-form-item has-feedback label="Название" name="title">
                <a-input v-model:value="formState.title" type="text" autocomplete="off" />
            </a-form-item>
            <a-form-item has-feedback label="Ключ" name="name">
                <a-input v-model:value="formState.name" type="text" autocomplete="off" />
            </a-form-item>
            <a-form-item has-feedback label="По умолчанию" name="default">
                <a-input v-if="formState.inputType == 0" v-model:value="formState.default" type="text" autocomplete="off" />
                <a-textarea v-if="formState.inputType == 1" v-model:value="formState.default" type="text" autocomplete="off" />
                <a-checkbox v-if="formState.inputType == 2" v-model:checked="formState.default" autocomplete="off" />
                <a-select v-if="formState.inputType == 3" v-model:value="formState.default" autocomplete="off">
                    <a-select-option v-for="option in options" :value="option">{{ option }}</a-select-option>
                </a-select>
                <a-date-picker v-if="formState.inputType == 4" v-model:value="formState.default" />
            </a-form-item>
            <a-form-item has-feedback label="Обязательное поле" name="required">
                <a-checkbox v-model:checked="formState.required" autocomplete="off" />
            </a-form-item>
        </a-modal>
    </div>
</template>
<script lang="ts">
import { defineComponent, ref, type PropType } from 'vue'
import { notification } from 'ant-design-vue';
import  { EditOutlined, DeleteOutlined } from '@ant-design/icons-vue';
import axios from 'axios'
import { useStore } from 'vuex'
import type { Field } from '../../store/fields/types'
import ActionFieldTypes from '../../store/fields/action-types'
import config from '../../config'

export default defineComponent({
    name: "ChangeField",
    components: {
        DeleteOutlined,
        EditOutlined
    },
    props: {
        data: { type: Object as PropType<Field>, default: {} }
    },
    setup(props){
        const store = useStore();

        const visible = ref<boolean>(false);
        const confirmLoading = ref<boolean>(false);
        const showModal = () => {
            visible.value = true;
        };
        
    
        const newOption = ref<string>('')
        const options = ref<Array<string>>([])
        const addOption = ()=>{
            if(!newOption.value) return
            options.value.push(newOption.value)
            newOption.value = ''
        }
        const deleteOption = (index: number)=>{
            formState.value.default = null
            options.value.splice(index, 1);
        }
        const formState = ref<Field>( { ...props.data, options: options.value })
        const changeInputType = (event: any)=>{
            formState.value.default = null
        }
        const fieldAssociations: {
            [key:string]: string
        } = {
            title: 'Название',
            name: 'Ключ',
        }
        const send = () => {
            confirmLoading.value = true;
            axios({
                url: config.domain + '/field/' + props.data.id,
                method: 'post',
                data: formState.value
            }).then((response)=>{
                store.dispatch(ActionFieldTypes.GET_FIELDS)
                notification.success({
                    message: response.data.description
                })
                visible.value = false;
                confirmLoading.value = false;
            }).catch((error)=>{
                notification.error({
                    message: error.response.data.description,
                    description: error.response.data.extra.map((field: string)=>fieldAssociations[field]).join(', ')
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
            newOption,
            addOption,
            deleteOption,
            options,
            changeInputType
        };
    }
})
</script>
<style scoped>
</style>
   