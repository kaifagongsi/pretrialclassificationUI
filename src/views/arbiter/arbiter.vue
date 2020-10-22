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
          <span>{{ row.processingreasons }}</span>
        </template>
      </el-table-column>
      <el-table-column label="进入裁决时间" width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.rukuTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="400" class-name="small-padding fixed-width">
        <template slot-scope="{row}" >
          <el-button type="primary"  size="small" v-if=" row.state === '7'" @click="showDetail(row);dialogFormVisible =true">
            分类过程&保存分类号
          </el-button>
          <el-button  size="small" type="success" v-if=" row.state === '7'" @click="showArbiterPersons(row.id);dialogArbiterPerson=true">
            添加裁决员
          </el-button>
          <el-button size="small" type="danger" v-if=" row.state === '7'" @click="arbiterChuAn(row.id)">
            出案
          </el-button>
          <el-button type="primary" size="small" v-if=" row.state === '8'" @click="showDetail(row);dialogFormVisible =true">
            案件详细
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
    <!-- 案件信息以及填写裁决分类号 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="80%" top="5vh">
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
            <div v-if="temp.state === '8'">
              <el-input v-model="temp.ipcmi" :disabled="true"  placeholder="请输入主分类号" />
            </div>
            <div v-if="temp.state === '7'">
              <el-input v-model="temp.ipcmi"  placeholder="请输入主分类号" />
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="IPCOI" prop="ipcoi">
            <div  v-if="temp.state === '8'">
              <el-input v-model="temp.ipcoi" :disabled="true" type="textarea" placeholder="请输入副分类号" />
            </div>
            <div v-if="temp.state === '7'">
              <el-input v-model="temp.ipcoi" type="textarea" placeholder="请输入副分类号" />
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="IPCA" prop="ipca">
            <div v-if="temp.state === '8'">
              <el-input v-model="temp.ipca" :disabled="true" type="textarea" placeholder="请输入附加信息号，切勿添加*，我们会为您自动添加" />
            </div>
            <div v-if="temp.state === '7'">
              <el-input v-model="temp.ipca" type="textarea" placeholder="请输入附加信息号，切勿添加*，我们会为您自动添加" />
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="CCI" prop="cci">
            <div v-if="temp.state === '8'">
              <el-input v-model="temp.cci" :disabled="true" placeholder="请输入cci号" />
            </div>
            <div v-if="temp.state === '7'">
              <el-input v-model="temp.cci" :disabled="temp.type === 'XX'" placeholder="请输入cci号" />
            </div>
           </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="CCA" prop="cca">
            <div v-if="temp.state === '8'">
              <el-input v-model="temp.cca" :disabled="true" placeholder="请输入cca号" />
            </div>
            <div v-if="temp.state === '7'">
              <el-input v-model="temp.cca" :disabled="temp.type === 'XX'" placeholder="请输入cca号" />
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="CSETS" prop="csets">
            <div v-if="temp.state === '8'">
              <el-input v-model="temp.csets" type="textarea" :disabled="true" placeholder="请输入csets号" />
            </div>
            <div v-if="temp.state === '7'">
              <el-input v-model="temp.csets" type="textarea" :disabled="temp.type === 'XX'" placeholder="请输入csets号" />
            </div>
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
    <!-- 添加裁决员 -->
    <el-dialog :visible.sync="dialogArbiterPerson" width="60%" top="20vh" title="添加裁决员">
      <el-form ref="arbiterPersonFrom">
        <el-row>
          <el-col :span="7">
            <el-form-item label="部门">
              <el-select v-model="arbiterPerson.dep1" class="filter-item" placeholder="请选择部门">
                <el-option v-for="item in dep1s" :key="item.value" :label="item.label" :value="item.label" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="处室">
              <el-select v-model="arbiterPerson.dep2" class="filter-item" placeholder="请选择处室">
                <el-option v-for="item in dep2s" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="人员">
              <el-select v-model="arbiterPerson.person" class="filter-item" placeholder="请选择人员">
                <el-option v-for="item in persons" :key="item" :label="item" :value="item" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-button type="primary" round @click="addArbiterPerson()">添加人员</el-button>
          </el-col>
        </el-row>
        <el-row>
          <el-table :data="personTableData" border  style="width: 100%" title="裁决员列表">
            <el-table-column
              prop="dep1"
              label="部门"
              align="center"
              width="200px">
            </el-table-column>
            <el-table-column
              prop="dep2"
              label="处室"
              align="center"
              width="200px">
            </el-table-column>
            <el-table-column
              prop="person"
              label="姓名"
              align="center"
              width="240px">
            </el-table-column>
            <el-table-column
              fixed="right"
              label="操作"
              width="280px">
              <template slot-scope="scope">
                <el-button type="text" size="small" @click.native.prevent="deleteArbiterPersonRow(scope.$index, personTableData)">
                  移除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-row>
        <el-form-item align="right" style="margin-top: 15px">
          <el-button type="primary" @click="onSubmitArbiterPerson()">提交修改</el-button>
          <el-button>取消</el-button>
        </el-form-item>
        {{ personTableData }}， {{ arbiterPersonTempId }}
      </el-form>
    </el-dialog>
  </div>
</template>
<script>

import { getArbiterInitList, checkIpcServer, checkIpcCsetsServer, saveAribiterClassfication, findClassInfoByID, getArbiterPersonList, updateAribiterPerson, findAdjudicatorWorker, arbiterChuAn, beforeTheCaseOfTheChiefJudge } from '@/api/case-arbiter'
import Pagination from '@/components/Pagination'

export default {
  components: { Pagination },
  data() {
    var checkIpc = (rule, value, callback) => {
      // 空格替换
      this.loadlFuncationRplaceSpaceForTemp()
      if (value == null || value === '') {
        callback()
      } else {
        if (rule.field === 'ipcmi') {
          if (value.indexOf(',') !== -1) {
            callback(new Error('主分类有且只有一个'))
          }
        }
        checkIpcServer(this.temp, rule.field).then(response => {
          if (response.success) {
            if (rule.field === 'ipcoi') {
              if (response.queryResult.map.newClassification === '') {
                this.temp.ipcoi = null
              } else {
                this.temp.ipcoi = response.queryResult.map.newClassification
              }
            } else if (rule.field === 'ipca') {
              if (response.queryResult.map.newClassification === '') {
                this.temp.ipca = null
              } else {
                this.temp.ipca = response.queryResult.map.newClassification
              }
            } else if (rule.field === 'ipcmi') {
              if (response.queryResult.map.newClassification === '') {
                this.temp.ipcmi = null
              } else {
                this.temp.ipcmi = response.queryResult.map.newClassification
              }
            }
            callback()
          } else {
            callback(response.message)
          }
        })
      }
    }
    var checkCpc = (rule, value, callback) => {
      this.loadlFuncationRplaceSpaceForTemp()
      if (value == null || value === '') {
        callback()
      } else {
        checkIpcServer(this.temp, rule.field).then(response => {
          if (response.success) {
            if (rule.field === 'cci') {
              if (response.queryResult.map.newClassification === '') {
                this.temp.cci = null
              } else {
                this.temp.cci = response.queryResult.map.newClassification
              }
            } else if (rule.field === 'cca') {
              if (response.queryResult.map.newClassification === '') {
                this.temp.cca = null
              } else {
                this.temp.cca = response.queryResult.map.newClassification
              }
            }
            callback()
          } else {
            callback(response.message)
          }
        })
      }
    }
    var checkCsets = (rule, value, callback) => {
      this.loadlFuncationRplaceSpaceForTemp()
      if (value == null || value === '') {
        callback()
      } else {
        this.temp.csets = value.toUpperCase()
        checkIpcCsetsServer(this.temp).then(response => {
          if (response.success) {
            debugger
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
      dialogArbiterPerson: false,
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
      },
      arbiterPerson: {
        dep1: '',
        dep2: '',
        person: ''
      },
      dep1s: [{
        value: 'FL',
        label: '分类审查部'
      }, {
        value: 'JG',
        label: '数据加工部'
      }],
      dep2s: undefined,
      dep2JG: [{
        value: '一室',
        label: '一室'
      }, {
        value: '二室',
        label: '二室'
      }, {
        value: '三室',
        label: '三室'
      }, {
        value: '四室',
        label: '四室'
      }, {
        value: '五室',
        label: '五室'
      }, {
        value: '六室',
        label: '六室'
      }, {
        value: '七室',
        label: '七室'
      }, {
        value: '八室',
        label: '八室'
      }, {
        value: '九室',
        label: '九室'
      }, {
        value: '十室',
        label: '十室'
      }],
      dep2FL: [{
        value: '一室',
        label: '一室'
      }, {
        value: '二室',
        label: '二室'
      }, {
        value: '三室',
        label: '三室'
      }, {
        value: '四室',
        label: '四室'
      }, {
        value: '五室',
        label: '五室'
      }],
      // 人员下拉框的list
      persons: null,
      // 用于保存已添加人员
      personTableData: [],
      // 用于传递当前案件的id
      arbiterPersonTempId: null
    }
  },
  watch: {
    'arbiterPerson.dep1': {
      handler(newValue, oldValue) {
        if (newValue === '数据加工部') {
          this.dep2s = this.dep2JG
        } else if (newValue === '分类审查部') {
          this.dep2s = this.dep2FL
        } else {
          this.dep2s = null
        }
      }
    },
    'arbiterPerson.dep2': {
      handler(newValue, oldValue) {
        if (newValue !== oldValue) {
          // 触发查询函数
          this.selectArbiterPerson()
        }
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    // 裁决组长出案 之前判断这个案子有无主分类号 该方法需要同步执行
    beforeTheCaseOfTheChiefJudge:  function(id) {
      return beforeTheCaseOfTheChiefJudge(id)
    },
    //裁决组长出案 此方法需要同步执行（按顺序执行）
    arbiterChuAn:  function(id) {
      debugger
       let promiseObject =  this.beforeTheCaseOfTheChiefJudge(id);
        promiseObject.then( response => {
          if(response){
            arbiterChuAn(id).then(response => {
              if (response.success) {
                this.$message({
                  message: '出案成功',
                  type: 'success'
                })
                this.getList()
              } else {
                this.$message({
                  message: '出案失败',
                  type: 'error'
                })
              }
            }).catch(() => {
              this.$message({
                message: '出案失败，请稍后重试',
                type: 'error'
              })
            })
          } else {
            this.$message({
              message: '该案件没有主分类号，无法出案',
              type: 'error'
            })
          }
        })
    },
    // 删除裁决员dialog框中列表的人员
    deleteArbiterPersonRow: function(index, rows) {
      rows.splice(index, 1)
    },
    // 向后台提交修改裁决员
    onSubmitArbiterPerson: function() {
      updateAribiterPerson(this.personTableData, this.arbiterPersonTempId).then(response => {
        if (response.success) {
          this.dialogArbiterPerson = false
          this.getList()
          // 清空下拉框
          this.arbiterPerson.dep1 = null
          this.arbiterPerson.dep2 = null
          this.arbiterPerson.person = null
          // 清空table
          this.personTableData = []
        } else {
          this.$message({
            message: '保存失败，请稍后重试',
            type: 'error'
          })
        }
      })
    },
    // 向裁决人员table中添加裁决员
    addArbiterPerson: function() {
      this.personTableData.push(JSON.parse(JSON.stringify(this.arbiterPerson)))
    },
    // 查询某个部门下某个室的裁决人员列表
    selectArbiterPerson: function() {
      getArbiterPersonList(this.arbiterPerson).then(response => {
        this.persons = response.queryResult.list
      })
    },
    // 裁决员dialog的展示，并查询当前的裁决员
    showArbiterPersons: function(id) {
      this.arbiterPersonTempId = id
      // 查询当前案件的裁决员
      findAdjudicatorWorker(id).then(response => {
        this.personTableData = response.queryResult.list
      })
    },
    // 分类号逻辑判断
    subClassification: function() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          // ipc 与cpc 同在校验
          if ((this.temp.ipcmi !== null || this.temp.ipcmi !== '') && (this.temp.ipcoi === null || this.temp.ipcoi === '') && (this.temp.cci === null || this.temp.cci === '')) {
            // 主分不为空，副分为空，cci 为空
            this.$confirm('检测到您的cci为空，是否继续出案', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              // 此处执行出案操作
              this.saveClassification()
            }).catch(() => {
              // 取消操作
            })
          } else if ((this.temp.ipcmi === null || this.temp.ipcmi === '') && (this.temp.ipcoi === null || this.temp.ipcoi === '') && (this.temp.cci !== null || this.temp.cci !== '')) {
            // 主，副分为空，cci不为空
            this.$confirm('检测到您的cci不为空，ipcmi/ipcoi为空，是否继续出案', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              // 此处执行出案操作
              this.saveClassification()
            }).catch(() => {
              // 取消操作
            })
          } else {
            // 一切正常的情况下
            this.saveClassification()
          }
        } else {
          console.log('有部分输入不合规')
          return false
        }
      })
    },
    // 逻辑判断通过后，进行后台保存
    saveClassification: function() {
      saveAribiterClassfication(this.temp).then((response) => {
        if (response.success) {
          this.$message({
            message: '保存成功',
            type: 'success'
          })
          this.dialogFormVisible = false
          this.getList()
        } else {
          this.$message({
            showClose: true,
            message: '保存失败，请稍后重试',
            type: 'error'
          })
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
      findClassInfoByID(this.searchInfo.id).then(response => {
        this.classInfoList = response.queryResult.map.data
        this.temp.ipcmi = response.queryResult.map.ipcmi
        this.temp.ipcoi = response.queryResult.map.ipcoi
        this.temp.ipca = response.queryResult.map.ipca
        this.temp.cci = response.queryResult.map.cci
        this.temp.cca = response.queryResult.map.cca
        this.temp.csets = response.queryResult.map.csets
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
    },
    loadlFuncationRplaceSpaceForTemp: function() {
      if (this.temp.ipcmi != null) {
        this.temp.ipcmi = this.temp.ipcmi.replace(/\s+/g, '')
      }
      if (this.temp.ipcoi != null) {
        this.temp.ipcoi = this.temp.ipcoi.replace(/\s+/g, '')
      }
      if (this.temp.ipca != null) {
        this.temp.ipca = this.temp.ipca.replace(/\s+/g, '')
      }
      if (this.temp.cci != null) {
        this.temp.cci = this.temp.cci.replace(/\s+/g, '')
      }
      if (this.temp.cca != null) {
        this.temp.cca = this.temp.cca.replace(/\s+/g, '')
      }
      if (this.temp.cset != null) {
        this.temp.csets = this.temp.csets.replace(/\s+/g, '')
      }
    }
  }
}
</script>
<style>

</style>
