<template>
    <component :is="currentComponent"></component>
</template>
<script lang="ts">
import { defineComponent, computed, toRef } from 'vue'
import  { DeleteOutlined } from '@ant-design/icons-vue';
import { getFieldTypesElements } from './FieldTypesService'



export default defineComponent({
    name: "CreateField",
    props: {
        type: { type: Number, default: 0 }
    },
    components: {
        DeleteOutlined
    },
    setup(props){
        const type = toRef(props, 'type')
        const currentComponent = computed(()=>{
            return getFieldTypesElements()[type.value]
        })
        return {
            currentComponent
        };
    }
})
</script>
<style scoped>
</style>
   