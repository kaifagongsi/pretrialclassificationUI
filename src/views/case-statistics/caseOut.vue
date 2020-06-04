<template>
  <div class="app-container">
    <div class="filter-container">

      <el-form ref="searchForm" class="el-form-col search-form" :model="search">
        <el-form-item>
          <el-select  v-model="search.type"  filterable   class="filter-item"  placeholder="请选择主副分">
            <el-option value="主" label="主分"></el-option>
            <el-option value="副" label="副分"></el-option>
          </el-select>
          <el-date-picker v-model="search.beginTime" type="date" placeholder="出案开始日期" style="width: 200px;" class="filter-item" value-format="yyyy-MM-dd" />到
          <el-date-picker v-model="search.endTime" type="date" placeholder="出案截止日期" style="width: 200px;" class="filter-item" value-format="yyyy-MM-dd" />
          <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" :loading="searchLoading" plain native-type="submit" @click.prevent="searchFunc(search)">
            查询
          </el-button>
          <el-button v-waves class="filter-item" type="primary"   plain native-type="submit" @click.prevent="handleDownload()">
            导出
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%;" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55"/>
      <el-table-column label="分类员" prop="id" align="center" width="200">
        <template slot-scope="{row}">
          <span>{{ row.worker }}</span>
        </template>
      </el-table-column>
      <el-table-column label="部门" width="500px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.orgname }}</span>
        </template>
      </el-table-column>
      <el-table-column label="主分|副分" min-width="50px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.classtype }}</span>
        </template>
      </el-table-column>
      <el-table-column label="发明件数" width="200px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.fmCount }}</span>
        </template>
      </el-table-column>
      <el-table-column label="新型件数" width="100px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.xxCount }}</span>
        </template>
      </el-table-column>
      <el-table-column label="总数" width="180px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.totalCount }}</span>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="search.page" :limit.sync="search.limit" @pagination="getList" />

    <el-dialog :visible.sync="dialogPvVisible" title="Reading statistics">
      <el-table :data="pvData" border fit highlight-current-row style="width: 100%">
        <el-table-column prop="key" label="Channel" />
        <el-table-column prop="pv" label="Pv" />
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogPvVisible = false">Confirm</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { countCaseOut } from '@/api/case-statistics'
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
      listQuery: {
        page: 1,
        limit: 10,
        importance: undefined,
        title: undefined,
        type: undefined
      },
      search: {
        page: 1,
        limit: 10,
        beginTime: '',
        endTime: '',
        type:''
      },
      importanceOptions: [1, 2, 3],
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
      dialogFormVisible: false,
      dialogStatus: '',
      dialogPvVisible: false,
      pvData: [],
      downloadLoading: false,
      isLoadingTree: false, // 是否加载节点树
      setTree: '', // 节点树数据
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      defaultExpandKeys: [] // 默认展开节点列表
    }
  },
  created() {
    this.getList()
  },
  mounted() {
    console.log(api)
    this.initExpand()
  },
  methods: {
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    initExpand() { // 加载tree
      this.isLoadingTree = true
    },
    handleNodeClick(d, n, s) { // 点击节点
      this.temp.pdfPath = d.name
    },
    searchFunc(search) {
      if (this.search.beginTime === '' && this.search.endTime !== '') {
        alert('请选择出案开始日期')
      } else {
        this.getList()
      }
    },
    getList() { // 获取table表格数据
      this.listLoading = true
      countCaseOut(this.search).then(response => {
        debugger
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
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['分类员', '部门', '主分|副分', '发明件数', '新型件数', '总件数']
        const filterVal = ['worker', 'orgname', 'classtype', 'fmCount', 'xxCount', 'totalCount']
        const data = this.formatJson(filterVal)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: '出案量统计'
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
    },
    sendEmail() {
      console.log(this.multipleSelection)
      console.log(this.multipleSelection.length)
      const ids = []
      for (var i = 0; i < this.multipleSelection.length; i++) {
        ids.push(this.multipleSelection[i].id)
      }
      sendEmail(ids).then(response => {
        console.log(response)
      })
    }
  }
}
</script>
<style >
  .el-tree-node:focus > .el-tree-node__content {
    background-color: #c26a3e !important;
  }
</style>
