<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form ref="transtemp" class="el-form-col search-form">
        <el-form-item>
          <el-row :gutter="20">
              <el-col :span="6">
                <el-input v-model.trim="transtemp.id" placeholder="预审案件编号" class="filter-item" @keyup.enter.native="handleFilter" />
              </el-col>
              <el-col :span="6">
                <el-input v-model.trim="transtemp.worker" placeholder="分类员" class="filter-item" @keyup.enter.native="handleFilter" />
              </el-col>
              <el-col :span="6">
                <el-input v-model.trim="transtemp.mingcheng" placeholder="发明名称" class="filter-item" @keyup.enter.native="handleFilter" />
              </el-col>
          </el-row>
        </el-form-item>
      </el-form>
      <div>
        
      </div>
    </div> 
  </div>
</template>

<script>
import { searchByCondition, getTransWorkerList, caseTransfer } from '@/api/case-classification'
import { findUserInfo, updateWorker } from '@/api/case-disposition'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import api from '@/api/treeApi'

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
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      dialogStatus: '',
      list: null,
      total: 0,
      classInfoList: null,
      listLoading: true,
      showDetail: false,
      calendarTypeOptions,
      textMap: {
        show: '查询结果'
      },
      dialogFormVisible: true,
      pvData: [],
      downloadLoading: false,
      //transtemp: '',
      transtemp: {
        id: '',
        mingcheng: '',
        type: '',
        simpleclasscode: '',
        jinantime: new Date(),
        message: '',
        worker: '',
      },
      transworker: [],
      workerlist: []
    }
  },
  created() {
    console.log(this.$route.query.transtemp)
    this.transtemp = this.$route.query.transtemp
    this.initExpand()
  },
  mounted() {
    //this.initExpand()
  },
  methods: {
    handleFilter() {
    },
    
    initExpand() { // 加载tree
      findUserInfo().then(response => {
        this.setTree = response.treelist
        this.setTree.map(a => {
          this.defaultExpandKeys.push(a.id)
        })
      })
      getTransWorkerList(this.transtemp).then(response => {
        this.workerlist = response.workerlist
      })
      this.isLoadingTree = true
    },
    handleModifyStatus(row, status) {
      this.$message({
        message: '操作Success',
        type: 'success'
      })
      row.status = status
    }
  }
}
</script>
<style >
  .el-tree-node:focus > .el-tree-node__content {
    background-color: #c26a3e !important;
  }

</style>
