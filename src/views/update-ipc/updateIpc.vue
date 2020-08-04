<template>
  <div class="tab-container">
    <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
      <el-tab-pane v-for="item in tabMapOptions" :key="item.key" :label="item.label" :name="item.key">
        <keep-alive>
          <!-- :type表示向子组件传递名称为type的变量-->
          <tab-pane v-if="activeName==item.key" :type="item.key" />
          <!--<tab-pane v-if="activeName==item.key" :type="item.key"  @tab-click="handleClick" />-->
        </keep-alive>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>

import tabPane from './components/TabPane'

export default {
  components: { tabPane },
  data() {
    return {
      activeName: '0',
      listQuery: {
        page: 1,
        limit: 10
      },
      tabMapOptions: [
        { label: '未审批', key: '0' },
        { label: '审批通过', key: '1' },
        { label: '审批未通过', key: '2' }
      ]
    }
  },
  watch: {
    activeName(val) {
      this.$router.push(`${this.$route.path}?tab=${val}`)
    }
  },
  created() {

  },
  methods: {
    handleClick(tab, event) {
      console.log(tab.name)
    }
  }
}
</script>
<style>
</style>
