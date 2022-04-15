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
      <el-table
        v-loading="listLoading"
        v-show="total>0" :total="total"
        :data="list"
        :row-key="getRowKey"
        border
        fit
        highlight-current-row
        style="width: 100%;"
        ref="multipleTables"
      >
        <el-table-column
          type="selection"
          :reserve-selection="true"
          width="55"
        />
        <el-table-column label="预审申请号" prop="id" align="center" width="200">
          <template slot-scope="{row}">
            <a
              v-bind:href="'ftp://baohuUserT:123456@192.168.8.130/'+row.id+'/'+row.pdfPath"
              target="_blank"
              class="buttonText"
            >{{row.id}}</a>
          </template>
        </el-table-column>
        <el-table-column label="申请主体" width="150px" align="center">
          <template slot-scope="{row}">
            <span>{{ row.sqr }}</span>
          </template>
        </el-table-column>
        <el-table-column label="发明名称" min-width="180px" align="center">
          <template slot-scope="{row}">
            <span>{{ row.mingcheng }}</span>
          </template>
        </el-table-column>
        <el-table-column label="发明类型" max-width="50px" align="center">
          <template slot-scope="{row}">
            <span class="link-type">{{ row.type== 'FM' ? '发明' : '新型' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="所属保护中心" width="110px" align="center">
          <template slot-scope="{row}">
            <span>{{ row.oraginization }}</span>
          </template>
        </el-table-column>
        <el-table-column label="粗分号" width="110px" align="center">
          <template slot-scope="{row}">
            <span>{{ row.simpleclasscode }}</span>
          </template>
        </el-table-column>
        <el-table-column label="预审申请日" width="180px" align="center">
          <template slot-scope="{row}">
            <span id="jinan">{{ row.jinantime | parseTime('{y}{m}{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="分类号" min-width="180px" align="center">
          <template slot-scope="{row}">
            <span>{{ row.ipci }}</span>
          </template>
        </el-table-column>
        <el-table-column label="CCI" min-width="180px" align="center">
          <template slot-scope="{row}">
            <span>{{ row.cci }}</span>
          </template>
        </el-table-column>
        <el-table-column label="CCA" min-width="180px" align="center">
          <template slot-scope="{row}">
            <span>{{ row.cca }}</span>
          </template>
        </el-table-column>
        <el-table-column label="C-Sets" min-width="100px" align="center">
          <template slot-scope="{row}">
            <span>{{ row.csets }}</span>
          </template>
        </el-table-column>
        <el-table-column label="主分类员" width="100px" align="center">
          <template slot-scope="{row}">
            <span>{{ row.mainworker }}</span>
          </template>
        </el-table-column>
        <el-table-column label="副分类员" width="100px" align="center">
          <template slot-scope="{row}">
            <span>{{ row.assworker }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="150" class-name="small-padding fixed-width">
          <template slot-scope="{ row }">
            <el-button type="primary" size="mini" @click="showDetail(row);dialogFormVisible =true">
              详情
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="total>0" :total="total" :page.sync="search.page" :limit.sync="search.limit" @pagination="searchFunc" />
      <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="75%">
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
              <span>{{ temp.type }}</span>
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
          <el-col :span="12">
            <el-form-item label="进案时间" prop="jinantime">
              <span>{{ temp.jinantime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="IPC" prop="ipc">
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
          v-loading="listLoading"
          :data="classInfoList"
          border
          fit
          highlight-current-row
          style="width: 100%;"
        >
          <el-table-column label="分类人员类型" align="center" width="120px">
            <template slot-scope="{row}">
              <a target="_blank" class="buttonText">{{ row.classtype == '主' ? '主分进案':'转案' }}</a>
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
          <el-table-column label="进案时间" width="160px" align="center">
            <template slot-scope="{row}">
              <span>{{ row.fenpeitime | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
            </template>
          </el-table-column>
          <el-table-column label="进案来源" width="100px" align="center">
            <template slot-scope="{row}">
              <span>{{ row.fenpeiren }}</span>
            </template>
          </el-table-column>
          <el-table-column label="单一出案时间" width="160px" align="center">
            <template slot-scope="{row}">
              <span>{{ row.chuantime | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
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
          <el-table-column label="转案留言" width="100px" align="center">
            <template slot-scope="{row}">
              <span>{{ row.message }}</span>
            </template>
          </el-table-column>
        </el-table>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">
            关闭
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
  </div>
</template>

<script>
import { searchByVagueCondition } from '@/api/case-classification'
import {  findClassInfoByID } from '@/api/case-query'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'

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
  components: { Pagination },
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
      listLoading: false,
      dialogPvVisible: false,
      dialogStatus: '',
      search: {
        page: 1,
        limit: 100,
        id: '',
        sqr: '',
        mingcheng: ''
      },
      searchInfo: {
        id: ''
      },
      calendarTypeOptions,
      temp: {
      },
      textMap: {
        show: '查询结果'
      },
      dialogFormVisible: false,
      pvData: [],
      downloadLoading: false,
      multipleSelection: []
    }
  },
  methods: {
    // 指定一个key标识一行的数据
    getRowKey(row) {
      return row.id
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    searchFunc(search) {
      if (this.search.id === '' && this.search.sqr === '' && this.search.mingcheng === '') {
        alert('查询条件不可为空！')
      } else {
        this.listLoading = true
        searchByVagueCondition(this.search).then(response => {
          this.list = response.data.items
          console.log(this.list)
          this.total = response.data.total
          setTimeout(() => {
            this.listLoading = false
        }, 0.5 * 1000)
        })
      }
    },
    // 获取分类信息
    getClassficationList() {
      console.log(this.searchInfo.id)
      findClassInfoByID(this.searchInfo).then(response => {
        console.log(response)
        this.classInfoList = response.data
      })
    },
    showDetail(row) {
      // this.resetTemp()
      this.dialogStatus = 'show'
      this.temp = row
      this.searchInfo.id = row.id
      this.getClassficationList()
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 解决input嵌套过深的问题
    inputOnInput: function(e) {
      this.$forceUpdate();
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
