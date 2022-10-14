<template>
    <CreateField/>
    <a-table :loading="loading" :dataSource="list" :columns="columns" :pagination="pagination" @change="handleChangePage">
      <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'required'">
              <check-outlined v-if="record.required" />
          </template>
          <template v-if="column.key === 'inputType'">
            {{ FieldInputTypes[record.inputType] }}
          </template>
          <template v-if="column.key === 'edit'">
            <ChangeField :data="record"/>
          </template>
          <template v-if="column.key === 'del'">
            <a-popconfirm
              title="Sure to delete?"
              @confirm="deleteRequest(record.id)"
            >
              <delete-outlined/>
            </a-popconfirm>
          </template>
      </template>
    </a-table>  
</template>
<script lang="ts">
import { defineComponent, computed } from 'vue'
import  { CheckOutlined, DeleteOutlined } from '@ant-design/icons-vue';
import axios from 'axios'
import { useStore } from 'vuex'
import ActionFieldTypes from '../../store/fields/action-types'
import MutationFieldTypes from '../../store/fields/mutations-type'
import { FieldInputTypes } from '../../store/fields/types'
import CreateField from '../forms/CreateField.vue'
import ChangeField from '../forms/ChangeField.vue'
import config from '../../config'

export default defineComponent({
    name: "Fields",
    components: {
    CheckOutlined,
    DeleteOutlined,
    CreateField,
    ChangeField
},
    setup(){
        const store = useStore();

        store.dispatch(ActionFieldTypes.GET_FIELDS)
        const list = computed(()=> store.state.fields.list);

        const columns = computed(()=> [
          {
            title: 'Название',
            dataIndex: 'title',
            key: 'title',
          },
          {
            title: 'Ключ',
            dataIndex: 'name',
            key: 'name',
          },
          {
            title: 'Поле',
            dataIndex: 'inputType',
            key: 'inputType',
          },
          {
            title: 'Обязательное поле',
            dataIndex: 'required',
            key: 'required',
          },
          {
            title: 'Значение по умолчанию',
            dataIndex: 'default',
            key: 'default',
          },
          {
            dataIndex: 'edit',
            key: 'edit',
          },
          {
            dataIndex: 'del',
            key: 'del',
          },
        ]);
        const loading = computed(()=> store.state.fields.loading)
        const deleteRequest = (id: string)=>{
          axios({
              url: config.domain + '/field/' + id,
              method: 'delete'
          }).then((response)=>{
            store.dispatch(ActionFieldTypes.GET_FIELDS)
          })
        }
        
        const pagination = computed(()=>({
          total: store.state.fields.count,
          current: store.state.fields.page,
          pageSize: store.state.fields.limit
        }))
        const handleChangePage = (payload: Event & { current?: number })=>{
          store.commit(MutationFieldTypes.CHANGE_FIELDS_PAGE, payload.current)
          store.dispatch(ActionFieldTypes.GET_FIELDS)
        }
        return {
            list,
            loading,
            columns,
            pagination,
            handleChangePage,
            deleteRequest,
            FieldInputTypes
        }
    }
})
</script>
<style scoped>
</style>
   