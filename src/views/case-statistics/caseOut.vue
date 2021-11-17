<template>
  <div class="app-container">
    <div class="filter-container">

      <el-form ref="searchForm" class="el-form-col search-form" :model="search">
        <el-form-item>
          <el-date-picker v-model="search.beginTime" type="date" placeholder="出案开始日期" style="width: 200px;" class="filter-item" value-format="yyyy-MM-dd" />到
          <el-date-picker v-model="search.endTime" type="date" placeholder="出案截止日期" style="width: 200px;" class="filter-item" value-format="yyyy-MM-dd" />
          <el-select  v-model="search.dept1"  filterable   class="filter-item"  placeholder="请选择部门">
            <el-option v-for="item in dep1s" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
          <el-select  v-model="search.dept2"  filterable   class="filter-item"  placeholder="请选择处室">
            <el-option v-for="item in dep2s" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
          <el-button v-waves class="filter-item" type="primary" icon="el-icon-search"  plain native-type="submit" @click.prevent="searchFunc(search)">
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
      <el-table-column label="分类代码" prop="id" align="center" width="80">
        <template slot-scope="{row}">
          <span>{{ row.fldm }}</span>
        </template>
      </el-table-column>
      <el-table-column label="姓名" prop="id" align="center" width="80">
        <template slot-scope="{row}">
          <span>{{ row.workerName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="分类部门" prop="id" align="center" >
        <template slot-scope="{row}">
          <span>{{ row.dep1 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="分类领域" prop="id" align="center" >
        <template slot-scope="{row}">
          <span>{{ row.areaName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="发明主分出案数" prop="id" align="center" width="100">
        <template slot-scope="{row}">
          <span>{{ row.fmzfNumCount }}</span>
        </template>
      </el-table-column>
      <el-table-column label="发明副分出案数" prop="id" align="center" width="100">
        <template slot-scope="{row}">
          <span>{{ row.fmffNumCount }}</span>
        </template>
      </el-table-column>
      <el-table-column label="发明未给号出案数" prop="id" align="center" width="130">
        <template slot-scope="{row}">
          <span>{{ row.fmNoNumCount }}</span>
        </template>
      </el-table-column>
      <el-table-column label="新型主分出案数" prop="id" align="center" width="100">
        <template slot-scope="{row}">
          <span>{{ row.xxzfNumCount }}</span>
        </template>
      </el-table-column>
      <el-table-column label="新型副分出案数" prop="id" align="center" width="100">
        <template slot-scope="{row}">
          <span>{{ row.xxffNumCount }}</span>
        </template>
      </el-table-column>
      <el-table-column label="新型未给号出案数" prop="id" align="center" width="130">
        <template slot-scope="{row}">
          <span>{{ row.xxNoNumCount }}</span>
        </template>
      </el-table-column>
      <el-table-column label="主裁决案件数" prop="id" align="center" width="100">
        <template slot-scope="{row}">
          <span>{{ row.cjNum }}</span>
        </template>
      </el-table-column>
      <el-table-column label="副裁决案件数" prop="id" align="center" width="100">
        <template slot-scope="{row}">
          <span>{{ row.cjyNum }}</span>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="search.page" :limit.sync="search.limit" @pagination="getList" />


  </div>
</template>

<script>
import { countCaseOut } from '@/api/case-statistics'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import api from '@/api/treeApi'
import { getInitDep1s, getDep2sByDep1 } from  '@/api/user'

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
      search: {
        page: 1,
        limit: 10,
        beginTime: '',
        endTime: '',
        dept1: undefined,
        dept2: undefined
      },
      dep1s: [],
      dep2s: [],
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
    this.initDept()
  },
  watch: {
    'search.dept1': {
      handler(newValue, oldValue) {
        if(newValue != null && newValue != ''){
          debugger
          this.dep2s = []
          this.search.dept2 = ''
          getDep2sByDep1(newValue).then(response =>{
            let arr =  response.queryResult.list
            for(let i = 0; i < arr.length; i++) {
              this.dep2s.push({value: arr[i],label: arr[i]})
            }
          })
        }
      }
    }
  },
  mounted() {
    console.log(api)
    this.initExpand()
  },
  methods: {
    initDept() {
      getInitDep1s().then(response => {
        let arr =  response.queryResult.list
        for(let i = 0; i < arr.length; i++) {
          this.dep1s.push({value: arr[i],label: arr[i]})
        }
      })
    },
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
        const tHeader = ['分类代码','姓名', '分类部门', '分类领域', '发明主分出案数', '发明副分出案数', '发明未给号出案数', '新型主分出案数', '新型副分出案数', '新型未给号出案数', '主裁决案件数', '副裁决案件数']
        const filterVal = ['fldm', 'workerName', 'dep1', 'areaName', 'fmzfNumCount', 'fmffNumCount', 'fmNoNumCount', 'xxzfNumCount', 'xxffNumCount', 'xxNoNumCount', 'cjNum', 'cjyNum']
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
    }
  }
}
</script>
<style >
  .el-tree-node:focus > .el-tree-node__content {
    background-color: #c26a3e !important;
  }
</style>
