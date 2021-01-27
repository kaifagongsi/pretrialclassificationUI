<template>
  <div class="app-container">

    <div class="filter-container">
      <el-form ref="searchForm" class="el-form-col search-form" :model="search">
        <el-form-item>
          <el-row :gutter="20">
              <el-col :span="6">
                <el-input v-model.trim="search.id" placeholder="预审案件编号" class="filter-item" @input="inputOnInput($event)"  />
              </el-col>
              <el-col :span="6">
                <el-input v-model.trim="search.sqr" placeholder="申请人" class="filter-item" @input="inputOnInput($event)" />
              </el-col>
              <el-col :span="6">
                <el-input v-model.trim="search.mingcheng" placeholder="发明名称" class="filter-item" @input="inputOnInput($event)" />
              </el-col>
              <el-col :span="4">
                <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" plain native-type="submit" @click.prevent="searchFunc(search)">
                    查询
                </el-button>
              </el-col>
          </el-row>
        </el-form-item>
      </el-form>
    </div>
    <div v-if="showDetail">
        <el-form ref="dataForm" :model="temp" label-position="left" label-width="70px" style="margin-left:50px;">
          <el-col :span="12">
            <el-form-item label="案件编号" prop="id">
              <span>{{ temp.id }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="发明名称" prop="mingcheng">
              <span>{{ temp.mingcheng }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="专利类型" prop="type">
              <span>{{ temp.type== 'FM' ? '发明' : '新型' }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="申请主体" prop="sqr">
              <span>{{ temp.sqr }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="申请号" prop="sqh">
              <span>{{ temp.sqh }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="粗分结果" prop="simpleclasscode">
              <span>{{ temp.simpleclasscode }}</span>
            </el-form-item>
          </el-col>
          <!-- <el-col :span="12">
            <el-form-item label="进案时间" prop="jinantime">
              <span>{{ temp.jinantime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
            </el-form-item>
          </el-col> -->
          <el-col :span="12">
            <el-form-item label="IPCI" prop="ipc">
              <span>{{ temp.ipci }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="CCI" prop="cci">
              <span>{{ temp.cci }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="CCA" prop="cca">
              <span>{{ temp.cca }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="CSETS" prop="csets">
              <span>{{ temp.csets }}</span>
            </el-form-item>
          </el-col>
        </el-form>
        <el-table
            :data="classInfoList"
            border
            fit
            highlight-current-row
            style="width: 100%;"
          >
            <el-table-column label="分类人员类型" align="center" width="120px">
              <template slot-scope="{row}">
                <a target="_blank" class="buttonText">{{ row.classtype }}</a>
              </template>
            </el-table-column>
            <el-table-column label="分类人员代码" width="120px" align="center">
              <template slot-scope="{row}">
                <span>{{ row.worker }}</span>
              </template>
            </el-table-column>
            <el-table-column label="当前状态" width="100px" align="center">
              <template slot-scope="{row}">
                <span>{{ row.state== '2' ? '已完成' : '未完成' }}</span>
              </template>
            </el-table-column>
            <el-table-column label="进案时间" width="150px" align="center">
              <template slot-scope="{row}">
                <span>{{ row.fenpeitime }}</span>
              </template>
            </el-table-column>
            <el-table-column label="进案来源" width="100px" align="center">
              <template slot-scope="{row}">
                <span>{{ row.fenpeiren }}</span>
              </template>
            </el-table-column>
            <el-table-column label="单一出案时间" width="150px" align="center">
              <template slot-scope="{row}">
                <span>{{ row.chuantime }}</span>
              </template>
            </el-table-column>
            <el-table-column label="IPCMI" width="200px" align="center">
              <template slot-scope="{row}">
                <span>{{ row.ipcmi }}</span>
              </template>
            </el-table-column>
            <el-table-column label="IPCOI" width="200px" align="center">
              <template slot-scope="{row}">
                <span>{{ row.ipcoi }}</span>
              </template>
            </el-table-column>
            <el-table-column label="IPCA" width="200px" align="center">
              <template slot-scope="{row}">
                <span>{{ row.ipca }}</span>
              </template>
            </el-table-column>
            <el-table-column label="CCI" width="100px" align="center">
              <template slot-scope="{row}">
                <span>{{ row.cci }}</span>
              </template>
            </el-table-column>
            <el-table-column label="CCA" width="100px" align="center">
              <template slot-scope="{row}">
                <span>{{ row.cca }}</span>
              </template>
            </el-table-column>
            <el-table-column label="C-Sets" width="100px" align="center">
              <template slot-scope="{row}">
                <span>{{ row.csets }}</span>
              </template>
            </el-table-column>
          </el-table>
    </div>
  </div>
</template>

<script>
import { searchByCondition } from '@/api/case-classification'
import waves from '@/directive/waves' // waves directive

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
      classInfoList: null,
      listLoading: true,
      showDetail: false,
      search: {
        id: '',
        sqr: '',
        mingcheng: ''
      },
      calendarTypeOptions,
      temp: {
        /* id: undefined,
        mingcheng: '',
        type: '',
        simpleclasscode: '',
        jinantime: '',
        message: '',
        worker: '' */
      },
      textMap: {
        show: '查询结果'
      },
      dialogFormVisible: true,
      pvData: [],
      downloadLoading: false,
      multipleSelection: []
    }
  },
  methods: {
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    searchFunc(search) {
      if (this.search.id === '' && this.search.sqh === '' && this.search.mingcheng === '') {
        alert('查询条件不可为空！')
      } else {
        searchByCondition(this.search).then(response => {
          console.log(response)
          if (response.case === null) {
            this.showDetail = false
            alert('无匹配结果，请重新搜索')
          } else {
            this.temp = response.case
            this.classInfoList = response.singleInfo
            this.showDetail = true
          }
        })
      }
    },

    // 解决input嵌套过深的问题
    inputOnInput: function(e) {
      this.$forceUpdate();
      this.showDetail = false
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
