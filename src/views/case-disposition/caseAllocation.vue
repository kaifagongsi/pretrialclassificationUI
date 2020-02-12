<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.title" placeholder="Title" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.importance" placeholder="Imp" clearable style="width: 90px" class="filter-item">
        <el-option v-for="item in importanceOptions" :key="item" :label="item" :value="item" />
      </el-select>
      <el-select v-model="listQuery.type" placeholder="Type" clearable class="filter-item" style="width: 130px">
        <el-option v-for="item in calendarTypeOptions" :key="item.key" :label="item.display_name+'('+item.key+')'" :value="item.key" />
      </el-select>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        Search
      </el-button>
      <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">
        Export
      </el-button>
    </div>
    <el-table
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column label="ID" prop="id" align="center" width="200">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="名称" width="500px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.mingcheng }}</span>
        </template>
      </el-table-column>
      <el-table-column label="类型" min-width="50px" align="center">
        <template slot-scope="{row}">
          <span class="link-type" >{{ row.type=== 'FM' ? '发明' : '新型' }}</span>
        </template>
      </el-table-column>
      <el-table-column   label="粗分结果" width="200px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.simpleclasscode }}</span>
        </template>
      </el-table-column>
      <el-table-column   label="分配人员" width="100px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.worker }}</span>
        </template>
      </el-table-column>
      <el-table-column  label="进案日期"  width="180px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.jinantime  | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>

      <el-table-column label="Actions" align="center" width="150" class-name="small-padding fixed-width">
        <template slot-scope="{ row }">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            调配
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <div :model="temp">
        <div>
          <el-button type="info" style="float: right;" @click="handleChangeState">确认调配</el-button>
        </div>
        <div style="font-size: xx-large; text-align: center">
          <svg-icon icon-class="user" style="width: 60px; height: 60px"  /><svg-icon icon-class="exchange" style="height: 60px;margin-left: 50px;margin-right: 50px;" /><svg-icon icon-class="user" style="width: 60px; height: 60px" />
        </div>
        <div style="font-size: large;padding-top: 5px;">
          <span style="width: 50px;margin-left: 200px;" >{{temp.worker}}</span> <span style="width: 50px;margin-left: 80px">{{temp.pdfPath}}</span>
        </div>
        <div>
          <el-tree
            v-if="isLoadingTree"
            ref="expandMenuList"
            class="expand-tree"
            :data="setTree"
            node-key="id"
            highlight-current
            :props="defaultProps"
            :expand-on-click-node="false"
            @node-click="handleNodeClick"
            center
          />
        </div>
      </div>
    </el-dialog>

    <!--<el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
        <el-form-item label="ID" prop="id">
          <el-input v-model="temp.id" />
        </el-form-item>
        <el-form-item label="名称" prop="mingcheng">
          <el-input v-model="temp.mingcheng" />
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-input v-model="temp.type" />
        </el-form-item>
        <el-form-item label="粗分结果" prop="simpleclasscode">
          <el-input v-model="temp.simpleclasscode" />
        </el-form-item>
        <el-form-item label="进案时间" prop="chuantime">
          <el-date-picker type="datetime" v-model="temp.jinantime" placeholder="Please pick a date" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          Cancel
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData()">
          Confirm
        </el-button>
      </div>
    </el-dialog>-->

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
import { findMainByState, findUserInfo, updateWorker } from '@/api/case-disposition'

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
      textMap: {
        update: '调配',
        create: 'Create'
      },
      dialogPvVisible: false,
      pvData: [],
      downloadLoading: false,
      maxexpandId: api.maxexpandId, // 新增节点开始id
      non_maxexpandId: api.maxexpandId, // 新增节点开始id(不更改)
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
    initExpand() {
      findUserInfo().then(response => {
        this.setTree = response.treelist
        this.setTree.map(a => {
          this.defaultExpandKeys.push(a.id)
        })
      })
      this.isLoadingTree = true
    },
    handleNodeClick(d, n, s) { // 点击节点
      this.temp.pdfPath = d.name
    },
    getList() {
      this.listLoading = true
      findMainByState(this.listQuery).then(response => {
        debugger
        this.list = response.data.items
        this.total = response.data.total
        setTimeout(() => {
          this.listLoading = false
        }, 0.5 * 1000)
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleModifyStatus(row, status) {
      this.$message({
        message: '操作Success',
        type: 'success'
      })
      row.status = status
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.temp.chuantime = new Date(this.temp.chuantime)
      this.temp.jinantime = new Date(this.temp.jinantime)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
    },
    handleChangeState() {
      this.$confirm(' ' + this.temp.id + '调配到：' + this.temp.pdfPath, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const tempData = Object.assign({}, this.temp)
        console.log(tempData)
        tempData.chuantime = +new Date(tempData.chuantime)
        tempData.jinantime = +new Date(tempData.jinantime)
        updateWorker(tempData).then(response => {
          debugger
          this.$message({
            type: 'success',
            message: '调配成功！'
          })
          this.dialogFormVisible = false
          this.getList()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消调配'
        })
      })
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['timestamp', 'title', 'type', 'importance', 'status']
        const filterVal = ['timestamp', 'title', 'type', 'importance', 'status']
        const data = this.formatJson(filterVal)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'table-list'
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal) {
      return this.list.map(v => filterVal.map(j => {
        if (j === 'chuantime') {
          return parseTime(v[j])
        } else if (j === 'chuantime') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    }
  }
}
</script>
<style >
  .el-tree-node:focus > .el-tree-node__content {
    background-color: #c26a3e !important;
  }
</style>
