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
      <el-select v-model="listQuery.sort" style="width: 140px" class="filter-item" @change="handleFilter">
        <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key" />
      </el-select>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        Search
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        Add
      </el-button>
      <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">
        Export
      </el-button>
      <el-checkbox v-model="showReviewer" class="filter-item" style="margin-left:15px;" @change="tableKey=tableKey+1">
        reviewer
      </el-checkbox>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange"
    >
      <el-table-column label="ID" prop="id" align="center" width="160">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="名称" width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.mingcheng }}</span>
        </template>
      </el-table-column>
      <el-table-column label="类型" min-width="50px">
        <template slot-scope="{row}">
          <span class="link-type" @click="handleUpdate(row)">{{ row.type=== 'FM' ? '发明' : '新型' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="申请人" width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.sqr }}</span>
        </template>
      </el-table-column>
      <el-table-column label="申请号" width="150px" align="center">
        <template slot-scope="{row}">
          <span style="color:red;">{{ row.sqh }}</span>
        </template>
      </el-table-column>
      <el-table-column label="pdf路径" width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.pdfPath }}</span>
        </template>
      </el-table-column>
      <el-table-column label="案件状态" width="50px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.state }}</span>
        </template>
      </el-table-column>
      <el-table-column label="粗分结果" width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.simpleclasscode }}</span>
        </template>
      </el-table-column>
      <el-table-column label="出案日期" width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.chuantime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="进案日期" width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.jinantime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>

      <el-table-column label="转案留言" width="110px" align="center">
        <template slot-scope="{row}">
          <span style="white-space: nowrap;overflow:hidden;text-overflow:ellipsis;">{{ row.message }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Actions" align="center" width="150" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            Edit
          </el-button>
          <el-button v-if="row.status!='deleted'" size="mini" type="danger" @click="handleDelete(row,$index)">
            Delete
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
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
        <el-form-item label="申请人" prop="sqr">
          <el-input v-model="temp.sqr" />
        </el-form-item>
        <el-form-item label="申请号" prop="sqh">
          <el-input v-model="temp.sqh" />
        </el-form-item>
        <el-form-item label="pdf路径" prop="pdfPath">
          <el-input v-model="temp.pdfPath" />
        </el-form-item>
        <el-form-item label="粗分结果" prop="simpleclasscode">
          <el-input v-model="temp.simpleclasscode" />
        </el-form-item>
        <el-form-item label="出案时间" prop="chuantime">
          <el-date-picker v-model="temp.chuantime" type="datetime" placeholder="Please pick a date" />
        </el-form-item>
        <el-form-item label="进按时间" prop="chuantime">
          <el-date-picker v-model="temp.jinantime" type="datetime" placeholder="Please pick a date" />
        </el-form-item>
        <el-form-item label="消息" prop="message">
          <el-input v-model="temp.message" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          Cancel
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          Confirm
        </el-button>
      </div>
    </el-dialog>

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
import { fetchList, fetchPv, createArticle, updateArticle, deleteTest } from '@/api/test'
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
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        importance: undefined,
        title: undefined,
        type: undefined,
        sort: '+id'
      },
      importanceOptions: [1, 2, 3],
      calendarTypeOptions,
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      statusOptions: ['published', 'draft', 'deleted'],
      showReviewer: false,
      temp: {
        id: undefined,
        mingcheng: '',
        type: '',
        sqr: '',
        sqh: '',
        pdfPath: '',
        state: '',
        simpleclasscode: '',
        chuantime: new Date(),
        jinantime: new Date(),
        message: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        chuantime: [{ type: 'date', required: true, message: '出案时间 is required', trigger: 'change' }],
        jinantime: [{ type: 'date', required: true, message: '进案时间 is required', trigger: 'change' }],
        simpleclasscode: [{ required: true, message: 'simpleclasscode is required', trigger: 'change' }],
        mingcheng: [{ required: true, message: 'title is required', trigger: 'blur' }]
      },
      downloadLoading: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    formatter(time) {
      return time.substring(0, 4) + '/' + time.substring(4, 6) + '/' + time.substring(6, 8) + '/' + time.substring(8, 10) + ':' + time.substring(10, 12) + ':' + time.substring(12, 14)
    },
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.total

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
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
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
      }
    },
    sortByID(order) {
      if (order === 'ascending') {
        this.listQuery.sort = '+id'
      } else {
        this.listQuery.sort = '-id'
      }
      this.handleFilter()
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        mingcheng: '',
        type: '',
        sqr: '',
        sqh: '',
        pdfPath: '',
        state: '',
        simpleclasscode: '',
        chuantime: new Date(),
        jinantime: new Date(),
        message: ''
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.temp.chuantime = +new Date(this.temp.chuantime)
          this.temp.jinantime = +new Date(this.temp.jinantime)
          createArticle(this.temp).then(() => {
            this.list.unshift(this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: 'Created Successfully',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.temp.chuantime = new Date(this.temp.chuantime)
      this.temp.jinantime = new Date(this.temp.jinantime)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      debugger
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          debugger
          const tempData = Object.assign({}, this.temp)
          tempData.chuantime = +new Date(tempData.chuantime)
          tempData.jinantime = +new Date(tempData.jinantime) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          updateArticle(tempData).then(() => {
            const index = this.list.findIndex(v => v.id === this.temp.id)
            this.list.splice(index, 1, this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: 'Update Successfully',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleDelete(row, index) {
      debugger
      const tempData = Object.assign({}, row)
      deleteTest(tempData).then((response) => {
        this.$notify({
          title: 'Success',
          message: 'Update Successfully',
          type: 'success',
          duration: 2000
        })
        this.getList()
      })
    },
    handleFetchPv(pv) {
      fetchPv(pv).then(response => {
        this.pvData = response.data.pvData
        this.dialogPvVisible = true
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
