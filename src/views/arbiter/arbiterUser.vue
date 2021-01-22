<template>
  <div class="app-container">
    <el-table
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column label="预审编号" prop="id" sortable="custom" align="center" width="200px" >
        <template slot-scope="{row}">
          <span>
            <a
              v-bind:href="'ftp://baohuUserT:123456@192.168.8.130/'+row.id+'/'+row.path"
              target="_blank"
              class="buttonText"
            >{{row.id}}</a>
          </span>
        </template>
      </el-table-column>
      <el-table-column label="申请号" prop="sqh" width="130px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.sqh }}</span>
        </template>
      </el-table-column>
      <el-table-column label="发明名称" prop="sqh" width="180px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.mingcheng }}</span>
        </template>
      </el-table-column>
      <el-table-column label="类型" width="100px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.type }}</span>
        </template>
      </el-table-column>
      <el-table-column label="裁决组长" width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.processingPerson }}</span>
        </template>
      </el-table-column>
      <el-table-column label="裁决人员" width="250px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.adjudicator }}</span>
        </template>
      </el-table-column>
      <el-table-column label="进入保护中心系统时间" min-width="180px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.jinantime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="进入裁决的原因" min-width="250px">
        <template slot-scope="{row}">
          <span>{{ row.processingreasons }}</span>
        </template>
      </el-table-column>
      <el-table-column label="进入裁决时间" width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.rukuTime }}</span>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
  </div>
</template>
<script>
import { getArbiterPersonInitList } from '@/api/case-arbiter'

import Pagination from '@/components/Pagination'

export default {
  components: { Pagination },
  data() {
    return{
      listLoading : false,
      list: null,
      total: 0,
      listQuery: {
        page: 1,
        limit: 10
      }
    }
  },
  watch: {

  },
  created() {
    this.getList()
  },
  methods: {
    getList: function () {
      this.listLoading = true
      getArbiterPersonInitList(this.listQuery).then((response) => {
        console.log(response)
        this.list = response.queryResult.list
        this.total = response.queryResult.total
        this.listLoading = false
      }).catch(() => {
        this.$message({
          message: '服务正忙，请稍候重试',
          type: 'warning'
        })
      })
    }
  }
}
</script>
<style>

</style>
