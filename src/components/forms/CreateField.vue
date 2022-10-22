<template>
    <div :style="{
        'margin': '20px'
    }">
        <a-button type="primary" @click="showModal">Создать поле</a-button>
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
            <a-form-item has-feedback label="Поле" name="inputType">
                <a-radio-group @change="changeInputType" v-model:value="formState.inputType">
                    <a-radio v-for="( type, index) in FieldInputTypes" v-bind:key="index" :value="index">{{type}}</a-radio>
                </a-radio-group>
            </a-form-item>
            <a-form-item label="Опции" v-if="formState.inputType == 3">
                <a-input v-model:value="newOption" type="text" autocomplete="off" style="width: calc(100% - 42px)" /><a-button type="primary" @click="addOption">+</a-button>
                <p :style="{
                    'margin-top': '15px',
                    'margin-bottom': '0px'
                }" v-for="( item, index )  in options" v-bind:key="index">{{ item }}<delete-outlined :style="{float: 'right'}" @click="deleteOption(index)" /></p>
            </a-form-item>
            <a-form-item has-feedback label="По умолчанию" name="default">
                <a-input v-if="formState.inputType == 0" v-model:value="formState.default" type="text" autocomplete="off" />
                <a-textarea v-if="formState.inputType == 1" v-model:value="formState.default" type="text" autocomplete="off" />
                <a-checkbox v-if="formState.inputType == 2" v-model:checked="formState.default" autocomplete="off" />
                <a-select v-if="formState.inputType == 3" v-model:value="formState.default" autocomplete="off">
                    <a-select-option v-for="option in options" :value="option" v-bind:key="option">{{ option }}</a-select-option>
                </a-select>
                <a-date-picker v-if="formState.inputType == 4" v-model:value="formState.default" />
            </a-form-item>
            <a-form-item v-if="formState.inputType != 2"  has-feedback label="Обязательное поле" name="required">
                <a-checkbox v-model:checked="formState.required" autocomplete="off" />
            </a-form-item>
        </a-modal>
    </div>
</template>
<script lang="ts">
import { defineComponent, ref, watch} from 'vue'
import { notification } from 'ant-design-vue';
import  { DeleteOutlined } from '@ant-design/icons-vue';
import axios from 'axios'
import { useStore } from 'vuex'
import type { Field } from '../../store/fields/types'
import { FieldInputTypes } from '../../store/fields/types'
import ActionFieldTypes from '../../store/fields/action-types'
import config from '../../config'

export default defineComponent({
    name: "CreateField",
    components: {
        DeleteOutlined
    },
    setup(){
        const store = useStore();

        const visible = ref<boolean>(false);
        const confirmLoading = ref<boolean>(false);
        const showModal = () => {
            visible.value = true;
        };
        
        const formState = ref<Field>({
            title: '',
            name: '',
            inputType: 1,
            required: false,
            default: '',
            options: []
        })
        const changeInputType = (event: any)=>{
            if(event.target.value == 3){
                formState.value.default = false
            }else{
                formState.value.default = null
            }
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
                url: config.domain + '/field',
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
    
        const newOption = ref<string>('')
        const options = ref<Array<string>>([])
        const addOption = ()=>{
            if(!newOption.value) return
            options.value.push(newOption.value)
            newOption.value = ''
            formState.value.options = options.value
        }
        const deleteOption = (index: number)=>{
            formState.value.default = null
            options.value.splice(index, 1);
            formState.value.options = options.value
        }
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
            changeInputType,
            FieldInputTypes
        };
    }
})
</script>
<style scoped>
</style>
   