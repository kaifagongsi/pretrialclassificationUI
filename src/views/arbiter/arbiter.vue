<template>
  <div class="app-container">

    <el-table
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange"
    >
      <el-table-column label="预审编号" prop="id" sortable="custom" align="center" width="200px" :class-name="getSortClass('id')">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
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
          <span>{{row.processingreasons}}</span>
        </template>
      </el-table-column>
      <el-table-column label="进入裁决时间" width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.rukuTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="400" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="small" @click="showDetail(row);dialogFormVisible =true">
            分类过程&保存分类号
          </el-button>
          <el-button v-if="row.status!='published'" size="small" type="success" @click="handleModifyStatus(row,'published')">
            添加裁决员
          </el-button>
          <el-button v-if="row.status!='deleted'" size="small" type="danger" @click="handleDelete(row,$index)">
            出案
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="80%">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="70px" style="margin-left:50px;">
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
          <el-form-item label="申请号" prop="sqh">
            <span>{{ temp.sqh }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="进案时间" prop="jinantime">
            <span>{{ temp.jinantime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="IPCMI" prop="ipcmi">
            <el-input v-model="temp.ipcmi"  placeholder="请输入主分类号" >
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="IPCOI" prop="ipcoi">
            <el-input type="textarea" v-model="temp.ipcoi" placeholder="请输入副分类号" ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="IPCA" prop="ipca">
            <el-input type="textarea" v-model="temp.ipca" placeholder="请输入附加信息号，切勿添加*，我们会为您自动添加" ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="CCI" prop="cci">
            <el-input v-model="temp.cci" :disabled="temp.type === 'XX'" placeholder="请输入cci号" ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="CCA" prop="cca">
            <el-input v-model="temp.cca" placeholder="请输入cca号" ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="CSETS" prop="csets">
            <el-input v-model="temp.csets" type="textarea" placeholder="请输入csets号" ></el-input>
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
        <el-table-column label="IPC" width="200px" align="center">
          <template slot-scope="{row}">
            <span>{{ row.ipci }}</span>
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
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          关闭
        </el-button>
         <el-button type="primary" @click="subClassification()">
            保存
          </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

import { findClassInfoByID } from '@/api/case-query'
import { getArbiterInitList, checkIpcServer, checkIpcCsetsServer } from '@/api/case-arbiter'
import Pagination from '@/components/Pagination'

export default {
  components: { Pagination },
  data() {
    var checkIpc = (rule, value, callback) => {
      if (value == null || value === '') {
        callback()
      } else {
        if (rule.field === 'ipcmi') {
          if (value.indexOf(',') !== -1) {
            callback(new Error('主分类有且只有一个'))
          }
        }
        value = value.toUpperCase()
        checkIpcServer(this.temp, rule.field).then(response => {
          if (response.success) {
            if (rule.field === 'ipcoi') {
              this.temp.ipcoi = response.queryResult.map.newClassification
            } else if (rule.field === 'ipca') {
              this.temp.ipca = response.queryResult.map.newClassification
            } else if (rule.field === 'ipcmi') {
              this.temp.ipcmi = response.queryResult.map.newClassification
            }
            callback()
          } else {
            callback(response.message)
          }
        })
      }
    }
    var checkCpc = (rule, value, callback) => {
      if (value == null || value === '') {
        callback()
      } else {
        debugger
        value = value.toUpperCase()
        checkIpcServer(this.temp, rule.field).then(response => {
          debugger
          if (response.success) {
            if (rule.field === 'cci') {
              this.temp.cci = response.queryResult.map.newClassification
            } else if (rule.field === 'cca') {
              this.temp.cca = response.queryResult.map.newClassification
            }
            callback()
          } else {
            callback(response.message)
          }
        })
      }
    }
    var checkCsets = (rule, value, callback) => {
      if (value == null || value === '') {
        callback()
      } else {
        debugger
        this.temp.csets = value.toUpperCase()
        checkIpcCsetsServer(this.temp).then(response => {
          debugger
          if (response.success) {
            this.temp.csets = response.queryResult.map.newClassification
            callback()
          } else {
            callback(response.message)
          }
        })
      }
    }
    return {
      listLoading: true,
      list: null,
      total: 0,
      listQuery: {
        page: 1,
        limit: 10
      },
      textMap: {
        show: '案件详情及分类信息'
      },
      dialogStatus: '',
      temp: {
        id: '',
        sqh: '',
        mingcheng: '',
        processingPerson: '',
        adjudicator: '',
        jinantime: '',
        processingreasons: '',
        rukuTime: '',
        ipca: '',
        ipcmi: '',
        ipcoi: '',
        cci: '',
        cca: '',
        csets: '',
        type: ''
      },
      dialogFormVisible: false,
      classInfoList: null,
      searchInfo: {
        id: ''
      },
      rules: {
        ipcmi: [{ required: true, trigger: 'blur', validator: checkIpc }],
        ipcoi: [{ required: true, trigger: 'blur', validator: checkIpc }],
        ipca: [{ required: true, trigger: 'blur', validator: checkIpc }],
        cci: [{ required: true, trigger: 'blur', validator: checkCpc }],
        cca: [{ required: true, trigger: 'blur', validator: checkCpc }],
        csets: [{ required: true, trigger: 'blur', validator: checkCsets }]
      }
    }
  },
  watch: {

  },
  created() {
    this.getList()
  },
  methods: {
    // 提交分类号
    subClassification: function() {
      alert('text1')
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          alert('submit!')
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 获取裁决数据
    getList: function() {
      this.listLoading = true
      getArbiterInitList(this.listQuery).then((response) => {
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
    },
    showDetail(row) {
      this.dialogStatus = 'show'
      this.temp = row
      this.searchInfo.id = row.id
      this.getClassficationList()
      console.log(row)
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 获取裁决案件的分类信息
    getClassficationList() {
      findClassInfoByID(this.searchInfo).then(response => {
        console.log(response)
        this.classInfoList = response.data
      })
    },
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
      }
    },
    getSortClass: function(key) {
      const sort = this.listQuery.sort
      return sort === `+${key}` ? 'ascending' : 'descending'
    }
  }
}
</script>
<style>

</style>
