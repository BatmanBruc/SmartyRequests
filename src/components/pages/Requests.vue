<template>
    <CreateRequest/>
    <a-table :loading="loading" :dataSource="list" :columns="columns" :pagination="pagination" @change="handleChangePage">
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'edit'">
          <ChangeRequest :id="record.id"/>
        </template>
        <template v-if="column.key === 'type_2'">
            <check-outlined v-if="record[column.dataIndex]" />
        </template>
        <template v-if="column.dataIndex === 'del'">
          <a-popconfirm
            title="Вы уверены?"
            @confirm="deleteRequest(record._id)"
          >
            <delete-outlined/>
          </a-popconfirm>
        </template>
      </template>
    </a-table>  
</template>
<script lang="ts">
import { defineComponent, computed, ref } from 'vue'
import axios from 'axios'
import { useStore } from 'vuex'
import ActionRequestTypes from '../../store/requests/action-types'
import ActionFieldTypes from '../../store/fields/action-types'
import MutationRequestTypes from '../../store/requests/mutations-type'
import type { Field } from '../../store/fields/types'
import CreateRequest from '../forms/CreateRequest.vue'
import ChangeRequest from '../forms/ChangeRequest.vue'
import  { DeleteOutlined, CheckOutlined } from '@ant-design/icons-vue';
import config from '../../config'

export default defineComponent({
    name: "RequestsPage",
    components: {
      CreateRequest,
      ChangeRequest,
      DeleteOutlined,
      CheckOutlined
    },
    setup(){
        const store = useStore();

        store.dispatch(ActionRequestTypes.GET_REQUESTS)
        store.dispatch(ActionFieldTypes.GET_FIELDS)
        const list = computed(()=> store.state.requests.list);

        const defaultColumns = [
          {
            title: 'Название',
            dataIndex: 'name',
            key: 'name',
          },
          {
            title: 'Описание',
            dataIndex: 'description',
            key: 'description',
          },
          {
            title: 'Дата',
            dataIndex: 'date',
            key: 'date',
          },
        ];
        const columns = computed(()=> {
          let extraColumns = store.state.fields.list.map((field: Field)=> { 
            return {
              title: field.title,
              dataIndex: field.name,
              key: 'type_' + field.inputType,
            }
          })
          return [
            ...defaultColumns,
            ...extraColumns,
            {
              dataIndex: 'edit',
              key: 'edit',
            },
            {
              dataIndex: 'del',
              key: 'del',
            },
          ]
        });
        const deleteRequest = (id: string)=>{
          axios({
              url: config.domain + '/request/' + id,
              method: 'delete'
          }).then(()=>{
            store.dispatch(ActionRequestTypes.GET_REQUESTS)
          })
        }
        const loading = computed(()=> store.state.requests.loading)
        
        const pagination = computed(()=>({
          total: store.state.requests.count,
          current: store.state.requests.page,
          pageSize: store.state.requests.limit
        }))
        const handleChangePage = (payload: Event & { current?: number })=>{
          store.commit(MutationRequestTypes.CHANGE_REQUESTS_PAGE, payload.current)
          store.dispatch(ActionRequestTypes.GET_REQUESTS)
        }

        const visibleChange = ref<boolean>(false)
        return {
            list,
            loading,
            columns,
            pagination,
            handleChangePage,
            deleteRequest,
            visibleChange
        }
    }
})
</script>
<style scoped>
</style>
   