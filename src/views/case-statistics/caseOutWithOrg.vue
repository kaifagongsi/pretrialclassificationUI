<template>
  <div class="app-container">

    <div class="filter-container">
      <el-form ref="searchForm" class="el-form-col search-form" :model="search">
        <el-form-item>
          <el-date-picker v-model="search.beginTime" type="date" placeholder="出案开始日期" style="width: 200px;" class="filter-item" value-format="yyyy-MM-dd" />到
          <el-date-picker v-model="search.endTime" type="date" placeholder="出案截止日期" style="width: 200px;" class="filter-item" value-format="yyyy-MM-dd" />
          <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" plain native-type="submit" @click.prevent="searchFunc(search)">
            查询
          </el-button>
          <el-button v-waves class="filter-item" type="primary"   plain native-type="submit" @click.prevent="handleDownload()">
            导出
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%;" @selection-change="handleSelectionChange">
      <el-table-column label="所属保护中心"  align="center" min-width="50px">
        <template slot-scope="{row}">
          <span>{{ row.oraginization }}</span>
        </template>
      </el-table-column>
      <el-table-column label="已完成发明件数" width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.fmCount }}</span>
        </template>
      </el-table-column>
      <el-table-column label="已完成新型件数" width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.xxCount }}</span>
        </template>
      </el-table-column>
      <el-table-column label="已完成总件数" width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.totalCount }}</span>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="search.page" :limit.sync="search.limit" @pagination="getList" />



  </div>
</template>

<script>
import { caseOutWithOrg } from '@/api/case-statistics'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination


const calendarTypeOptions = [
  { key: 'CN', display_name: 'China' },
  { key: 'US', display_name: 'USA' },
  { key: 'JP', display_name: 'Japan' },
  { key: 'EU', display_name: 'Eurozone' }
]

// arr to obj, such as { CN : "China", US : "USA" }
const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})
export default {
  name: 'ComplexTable',
  components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    },
    typeFilter(type) {
      return calendarTypeKeyValue[type]
    }
  },
  data() {
    return {
      openKeys: [],
      list: null,
      total: 0,
      listLoading: true,
      search: {
        page: 1,
        limit: 10,
        beginTime: '',
        endTime: ''
      },
      calendarTypeOptions,
      temp: {
        id: undefined,
        mingcheng: '',
        type: '',
        simpleclasscode: '',
        jinantime: new Date(),
        message: '',
        worker: ''
      },
      pvData: [],
      downloadLoading: false,
      isLoadingTree: false, // 是否加载节点树
      setTree: '', // 节点树数据
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      defaultExpandKeys: [], // 默认展开节点列表
      multipleSelection: []
    }
  },
  created() {
    this.getList()
  },
  mounted() {
  },
  methods: {
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    searchFunc(search) {
      if (this.search.beginTime === '' && this.search.endTime !== '') {
        alert('请选择进案开始日期')
      } else {
        this.getList()
      }
    },
    getList() { // 获取table表格数据
      this.listLoading = true
      caseOutWithOrg(this.search).then(response => {
        this.list = response.data.items
        this.total = response.data.total
        setTimeout(() => {
          this.listLoading = false
        }, 0.5 * 1000)
      })
    },
    handleFilter() {
      this.search.page = 1
      this.getList()
    },
    handleModifyStatus(row, status) {
      this.$message({
        message: '操作Success',
        type: 'success'
      })
      row.status = status
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['所属保护中心', '发明件数', '新型件数', '未分配件数', '未完成件数', '已完成件数', '裁决件数', '总件数']
        const filterVal = ['oraginization', 'fmCount', 'xxCount', 'wfpCount', 'wccCount', 'ywcCount', 'cjCount', 'totalCount']
        const data = this.formatJson(filterVal)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: '进案量统计'
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal) {
      //勾选导出数据，没有勾选默认导出全部
      if(this.multipleSelection.length > 0){
        return this.multipleSelection.map(v => filterVal.map(j => {
          return v[j]
        }))
      }else{
        return this.list.map(v => filterVal.map(j => {
          return v[j]
        }))
      }
    }
  }
}
</script>
<style >
  .el-tree-node:focus > .el-tree-node__content {
    background-color: #c26a3e !important;
  }
</style>
