<template>
  <div class="tab-container">
    <div class="filter-container">
      <el-form ref="searchForm" class="el-form-col search-form" :model="search">
        <el-form-item>
          <!-- <el-input v-model="search.id" placeholder="预审申请号" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
          <el-input v-model="search.mingcheng" placeholder="发明名称" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
          <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" :loading="searchLoading" plain native-type="submit" @click.prevent="searchFunc(search)">
            Search
          </el-button>-->
          <el-row>
            <el-col :span="24" :offset="0">
              <el-date-picker v-model="search.beginTime" type="date" placeholder="出案开始日期" class="filter-item" value-format="yyyy-MM-dd" />
              <el-date-picker v-model="search.endTime" type="date" placeholder="出案截止日期" class="filter-item" value-format="yyyy-MM-dd" />
              <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" plain native-type="submit" @click.prevent="searchFunc(search)">Search</el-button>
              <el-button v-waves class="filter-item" type="primary"  plain native-type="submit" @click.prevent="exportToExcel()">
                导出
              </el-button>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
      <el-button
          type="primary"
          v-show="this.activeName == '2'"
          @click="finishcaseAll();"
          size="mini"
        >一键出案</el-button>
      <el-tabs v-model="activeName" style="margin-top:15px;" type="border-card" @tab-click="changeTab">
        <el-tab-pane v-for="item in tabMapOptions" :key="item.key" :label="item.label" :name="item.key"></el-tab-pane>
        <el-table
          v-loading="listLoading"
          :data="list"
          @selection-change="handleSelectionChange"
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
          <el-table-column fixed label="预审申请号" prop="id" align="center" width="165px">
            <template slot-scope="{row}">
              <a
                v-bind:href="'ftp://baohuUserT:123456@192.168.8.130/'+row.id+'/'+row.pdfPath"
                target="_blank"
                class="link-type"
              >{{ row.id }}</a>
              <!-- <router-link to="">{{ row.id }}</router-link> -->
            </template>
          </el-table-column>
          <el-table-column label="发明名称" width="280px" align="center">
            <template slot-scope="{row}">
              <span>{{ row.mingcheng }}</span>
            </template>
          </el-table-column>
          <el-table-column label="申请人" width="180px" align="center">
            <template slot-scope="{row}">
              <span>{{ row.sqr }}</span>
            </template>
          </el-table-column>
          <el-table-column label="类型" min-width="50px" align="center">
            <template slot-scope="{row}">
              <span>{{ row.type== 'FM' ? '发明' : '新型' }}</span>
            </template>
          </el-table-column>
          <el-table-column v-if="this.activeName == '3'" key="row.chuantype" label="出案类型" width="100px" align="center" >
            <template slot-scope="{row}">
              <span>{{ row.chuantype }}</span>
            </template>
          </el-table-column>
          <el-table-column label="进案类型" width="80px" align="center">
            <template slot-scope="{row}">
              <span>{{ row.maintype == '主' ? '主分进案' : '转案' }}</span>
            </template>
          </el-table-column>
          <el-table-column label="进案日期" width="160px" align="center">
            <template slot-scope="{row}">
              <span>{{ row.jinantime | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
            </template>
          </el-table-column>
          <el-table-column v-if="this.activeName == '3'" key="row.chuantime | parseTime('{y}-{m}-{d} {h}:{i}:{s}')" label="出案日期" width="180px" align="center" >
            <template slot-scope="{row}">
              <span>{{ row.chuantime | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
            </template>
          </el-table-column>
          <el-table-column label="粗分号" width="100px" align="center">
            <template slot-scope="{row}">
              <span>{{ row.simpleclasscode }}</span>
            </template>
          </el-table-column>
          <el-table-column
            fixed="right"
            label="操作"
            align="center"
            width="250px"
            class-name="small-padding fixed-width"
          >
            <template slot-scope="{ row }">
              <el-button
                type="primary"
                size="mini"
                @click="showDetail(row);dialogFormVisible =true"
              >详情</el-button>
              <el-button
                type="warning"
                size="mini"
                :disabled="transBtn"
                @click="transfercase(row);dialogFormVisible =false"
              >转案</el-button>
              <el-button
                type="success"
                size="mini"
                :disabled="finishsBtn"
                @click="finishonecase(row);"
              >出案</el-button>
            </template>
          </el-table-column>
        </el-table>
        <pagination
          v-show="total>0"
          :total="total"
          :page.sync="search.page"
          :limit.sync="search.limit"
          @pagination="getList"
        />

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
                <span>{{ temp.jinantime | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
              </el-form-item>
            </el-col>
            <el-form-item label="IPCMI" prop="ipcmi">
              <div v-if="activeName === '4'">
                <el-input v-model="temp.ipcmi" :disabled="true" placeholder="请输入主分类号" :validate-event="false" />
              </div>
              <div v-else-if="activeName === '5'">
                <el-input v-model="temp.ipcmi" :disabled="true" placeholder="请输入主分类号" :validate-event="false" />
              </div>
              <div v-else>
                <el-input v-model="temp.ipcmi" placeholder="请输入主分类号" :validate-event="false" />
              </div>
            </el-form-item>
            <el-form-item label="IPCOI" prop="ipcoi">
              <div v-if="activeName === '4'">
                <el-input v-model="temp.ipcoi" type="textarea" :disabled="true" placeholder="请输入副分类号" :validate-event="false" />
              </div>
              <div v-else-if="activeName === '5'">
                <el-input v-model="temp.ipcoi" type="textarea" :disabled="true" placeholder="请输入副分类号" :validate-event="false" />
              </div>
              <div v-else>
                <el-input v-model="temp.ipcoi" type="textarea" placeholder="请输入副分类号" :validate-event="false" />
              </div>
            </el-form-item>

            <el-form-item label="IPCA" prop="ipca">
              <div v-if="activeName === '4'">
                <el-input v-model="temp.ipca" type="textarea" :disabled="true" placeholder="请输入附加信息号，切勿添加*，我们会为您自动添加" :validate-event="false" />
              </div>
              <div v-else-if="activeName === '5'">
                <el-input v-model="temp.ipca" type="textarea" :disabled="true" placeholder="请输入附加信息号，切勿添加*，我们会为您自动添加" :validate-event="false" />
              </div>
              <div v-else>
                <el-input v-model="temp.ipca" type="textarea" placeholder="请输入附加信息号，切勿添加*，我们会为您自动添加" :validate-event="false" />
              </div>
            </el-form-item>
            <el-form-item label="CCI" prop="cci" :inline="true">
              <div v-if="activeName === '4'">
                <el-input v-model="temp.cci" :disabled="true" placeholder="请输入cci号" :validate-event="false" />
              </div>
              <div v-else-if="activeName === '5'">
                <el-input v-model="temp.cci" :disabled="true" placeholder="请输入cci号" :validate-event="false" />
              </div>
              <div v-else>
                <el-row>
                  <el-col :span="18">
                    <el-input v-model="temp.cci" :disabled="temp.type === 'XX'" placeholder="请输入cci号" :validate-event="false" />
                  </el-col>
                </el-row>
              </div>
            </el-form-item>
            <el-form-item label="CCA" prop="cca">
              <div v-if="activeName === '4'">
                <el-input v-model="temp.cca" :disabled="true" placeholder="请输入cca号" :validate-event="false" />
              </div>
              <div v-else-if="activeName === '5'">
                <el-input v-model="temp.cca" :disabled="true" placeholder="请输入cca号" :validate-event="false" />
              </div>
              <div v-else>
                <el-row>
                  <el-col :span="18">
                    <el-input v-model="temp.cca" :disabled="temp.type === 'XX'" placeholder="请输入cca号" :validate-event="false" />
                  </el-col>
                  <el-col :span="6">
                    <el-button type="primary" round size="medium" style="margin-left: 20px" @click="cpc2ipc()">CPC转ICP</el-button>
                  </el-col>
                </el-row>
              </div>
            </el-form-item>
            <el-form-item label="CSETS" prop="csets">
              <div v-if="activeName === '4'">
                <el-input v-model="temp.csets" type="textarea" :disabled="true" placeholder="请输入csets号" :validate-event="false" />
              </div>
              <div v-else-if="activeName === '5'">
                <el-input v-model="temp.csets" type="textarea" :disabled="true" placeholder="请输入csets号" :validate-event="false" />
              </div>
              <div v-else>
                <el-input v-model="temp.csets" type="textarea" :disabled="temp.type === 'XX'" placeholder="请输入csets号" :validate-event="false" />
              </div>
            </el-form-item>
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
                <span>{{ row.state == '2'|| row.state == '7' ? '已完成' : '未完成' }}</span>
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
            <!-- <el-table-column label="IPCI" width="200px" align="center">
              <template slot-scope="{row}">
                <span>{{ row.ipci }}</span>
              </template>
            </el-table-column> -->
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
            <el-button @click="dialogFormVisible = false">关闭</el-button>
            <el-button type="primary" :disabled="saveBtn" @click="subClassification()">保存</el-button>
            <el-button type="primary" :disabled="correctBtn" @click="subClassification()">更正</el-button>
            <el-button type="primary" :disabled="finishsBtn" @click="finishcase(temp)">出案</el-button>
            <!-- <el-button type="primary" :disabled="finishsBtn" @click="finishonecase(temp)">出案</el-button> -->
          </div>
        </el-dialog>


      </el-tabs>
    </div>
  </div>
</template>

<script>
import {
  findCaseByState,
  finishcase,
  caseOutInBulk,
  updateClassificationInfo,
  correctCase,
  judgeMoreIpcmi,
  cpcToIpc
} from '@/api/case-classification'
import { checkIpcServer, checkIpcCsetsServer } from '@/api/case-arbiter'
import { findUserInfo } from '@/api/case-disposition'
import { findClassInfoByID, findUpdateInfoByID } from '@/api/case-query'
import { parseTime } from '@/utils'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'Tab',
  components: { Pagination },
  directives: { waves },
  data() {
    var checkIpc = (rule, value, callback) => {
      // 空格替换
      this.loadlFuncationRplaceSpaceForTemp()
      if (value == null || value === '') {
        callback()
      } else {
        if (rule.field === 'ipcmi') {
          if (value.indexOf(',') !== -1 || value.indexOf('，') !== -1 || value.indexOf('；') !== -1 || value.indexOf(';') !== -1 || value.indexOf('、') !== -1) {
            callback(new Error('主分类有且只有一个'))
          }
        }
        checkIpcServer(this.temp, rule.field).then((response) => {
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
        checkIpcServer(this.temp, rule.field).then((response) => {
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
        checkIpcCsetsServer(this.temp).then((response) => {
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
      tabMapOptions: [
        { label: '新分待审', key: '0' }, // 主分进案
        { label: '转案待审', key: '1' }, // 作为副分
        { label: '已分待出', key: '2' }, // 给了分类号
        { label: '已出案', key: '3' }, // 已出案
        { label: '更正列表', key: '4' }, // 分类号更正待审
        { label: '裁决列表', key: '5' } // 案件裁决待审
      ],
      activeName: '0',
      searchInfo: {
        id: '',
        worker: ''
      },
      excelData: '',
      user: '',
      createdTimes: 0,
      list: null,
      classInfoList: null,
      total: 0,
      listLoading: true,
      search: {
        page: 1,
        limit: 10,
        state: this.$route.query.tab,
        beginTime: '',
        endTime: ''
      },
      rules: {
        ipcmi: [{ required: true, validator: checkIpc }],
        ipcoi: [{ required: true, validator: checkIpc }],
        ipca: [{ required: true, validator: checkIpc }],
        cci: [{ required: true, validator: checkCpc }],
        cca: [{ required: true, validator: checkCpc }],
        csets: [{ required: true, validator: checkCsets }]
      },
      temp: {
        id: undefined,
        mingcheng: '',
        type: '',
        sqr: '',
        sqh: '',
        simpleclasscode: '',
        jinantime: '',
        classtype: '',
        cci: '',
        cca: '',
        csets: '',
        ipci: '',
        ipca: '',
        ipcmi: '',
        ipcoi: '',
        chuantype: ''
      },
      dialogFormVisible: false,
      userDialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        show: '案件详情及分类信息',
        update: '转案'
      },
      transtemp: {
        id: undefined,
        mingcheng: '',
        type: '',
        simpleclasscode: '',
        jinantime: new Date(),
        message: '',
        worker: ''
      },
      // dialogPvVisible: false,  2021-11-23 15:20:02  看起来没用的样子，去掉了 李晓亮
      pvData: [],
      finishIds: '',
      downloadLoading: false,
      isLoadingTree: false, // 是否加载节点树
      setTree: '', // 节点树数据
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      defaultExpandKeys: [], // 默认展开节点列表
      multipleSelection: [], // 多选
      finishCases: [], // 批量出案案件id
      finishsBtn: true, // 出案按钮显示
      transBtn: false, // 转案按钮
      saveBtn: false, // 保存按钮
      correctBtn: true // 更正按钮
    }
  },
  watch: {
    activeName(val) {
      this.$router.push(`${this.$route.path}?tab=${val}`)
      if (this.activeName === '3') {
        // 已出案案件不可转案及出案
        this.finishsBtn = true
        this.saveBtn = true
        this.transBtn = true
        this.correctBtn = false
      } else if (this.activeName === '4' || this.activeName === '5') {
        // 更正和裁决列表不可操作
        this.saveBtn = true
        this.transBtn = true
        this.finishsBtn = true
        this.correctBtn = true
      } else if (this.activeName === '0' || this.activeName === '1') {
        // 新分待审和转案待审案件不可直接出案
        this.finishsBtn = true
        this.correctBtn = true
        this.saveBtn = false
        this.transBtn = false
      } else {
        this.finishsBtn = false
        this.correctBtn = true
        this.saveBtn = false
        this.transBtn = false
      }
    }
  },
  created() {
    // init the default selected tab
    const tab = this.$route.query.tab
    if (tab) {
      this.activeName = tab
      this.finishsBtn = true
    }
    this.getList()
  },
  mounted() {
    // console.log(api);
    // this.initExpand();
  },
  methods: {
    getRowKey(row) {
      return row.id
    },
    // 操作多选
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    // 2021.12.20 新增导出
    // 前端直接导出Excel
    exportToExcel() {
      if (this.activeName !== '3') {
        this.$alert('仅允许已出案案件导出', '提示', {
          confirmButtonText: '确定'
        })
        return
      }
      this.excelData = this.multipleSelection
      if (this.multipleSelection === [] || this.multipleSelection.length === 0) {
        this.$alert('请先选择要导出的案件', '提示', {
          confirmButtonText: '确定'
        })
        return
      }
      this.excelData.forEach(element => {
        element.jinantime = parseTime(element.jinantime, '{y}{m}{d}')
        element.chuantime = parseTime(element.chuantime, '{y}{m}{d}')
        console.log('element.maintype' + element.maintype)
        if(element.maintype == '副') {
          element.maintype = "转案"
        }else{
          element.maintype = "主分进案"
        }
      })
      // console.log(this.excelData)
      var that = this
      require.ensure([], () => {
        const {
          export_json_to_excel
        } = require('../../excel/Export2Excel')
        const tHeader = ['预审申请号', '发明名称', '申请人', '进案类型', '出案类型', '发明类型', '粗分号', '进案日期','出案日期'] // excel文档第一行显示的标题
        const filterVal = ['id', 'mingcheng', 'sqr', 'maintype', 'chuantype', 'type', 'simpleclasscode', 'jinantime','chuantime']
        const list = that.excelData
        const data = this.formatJson(filterVal, list)
        export_json_to_excel(tHeader, data, 'bhzx')
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
    },
    // cpc转变为ipc
    cpc2ipc() {
      cpcToIpc(this.temp.cci, this.temp.cca).then((response) => {
        if (response.success) {
          this.temp.ipcmi = response.queryResult.map.ipcmi
          this.temp.ipcoi = response.queryResult.map.ipcoi
          this.temp.ipca = response.queryResult.map.ipca
          this.$message({
            message: '转换成功',
            type: 'success'
          })
        } else {
          this.$message({
            message: '转换失败，请自行核验',
            type: 'error'
          })
        }
      })
    },
    changeTab: function(tab, event) {
      this.search.state = this.activeName
      this.getList()
    },
    // 点击人员节点
    handleNodeClick(d, n, s) {
      // 点击节点
      // console.log(n)
      this.transtemp.pdfPath = d.name
    },
    initExpand() {
      // 加载tree
      findUserInfo().then((response) => {
        this.setTree = response.treelist
        this.setTree.map((a) => {
          this.defaultExpandKeys.push(a.id)
        })
      })
      this.isLoadingTree = true
    },
    /*
    handleChangeState() {
      this.$confirm(' ' + this.transtemp.id + '转案给：' + this.transtemp.pdfPath, '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(() => {
        const tempData = Object.assign({}, this.transtemp)
        tempData.chuantime = +new Date(tempData.chuantime)
        tempData.jinantime = +new Date(tempData.jinantime)
        console.log(tempData)
        caseTransfer(tempData).then((response) => {
          this.$message({
            type: 'success',
            message: '转案成功！'
          })
          this.userDialogFormVisible = false
          this.getList()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消转案'
        })
      })
    },*/
    // 获取选中行id
    // handleSelectionChange(val) {
    //   this.finishIds = ''
    //   for (var i = 0; i < val.length - 1; i++) {
    //     var halo = val[i].id
    //     this.finishIds += halo + ','
    //   }
    //   this.finishIds += val[i].id
    //   this.multipleSelection = val
    // },
    // 一键出案,2021.11/24 lsy
    finishcaseAll() {
      this.$confirm('对已选中的案件批量出案，请确认', '一键出案', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'success',
        callback: action => {
          if (action === 'confirm') {
            if (this.multipleSelection === [] || this.multipleSelection.length === 0) {
              this.$alert('请先选择要出案的案件', '提示', {
                confirmButtonText: '确定'
              })
              return
            } else {
              this.worker = this.multipleSelection[0].worker
              // 批量出案
              for (var i = 0; i < this.multipleSelection.length; i++) {
                this.finishCases.push(this.multipleSelection[i].id)
              }
              const bulkData = JSON.stringify(this.finishCases)
              caseOutInBulk(bulkData, this.worker).then((response) => {
                if (response.success) {
                  this.$message({
                    message: '出案成功',
                    type: 'success'
                  })
                  this.getList()
                } else {
                  this.$message({
                    showClose: true,
                    message: response.message,
                    type: 'error'
                  })
                  this.getList()
                }
                this.finishCases = []
                this.$refs.multipleTables.clearSelection()
              })
            }
          } else {
            alert('已取消')
          }
        }
      })
    },
    // 获取分类信息
    getClassficationList() {
      findClassInfoByID(this.searchInfo).then((response) => {
        this.classInfoList = response.data
      })
    },
    showDetail(row) {
      this.dialogStatus = 'show'
      this.temp = row
      this.searchInfo.id = row.id
      if (this.activeName === '4') {
        // 更正案件显示更正后的号
        this.searchInfo.worker = this.user
        findUpdateInfoByID(this.searchInfo).then((response) => {
          // console.log(response.data[0])
          this.temp.ipcmi = response.data[0].ipcmi
          this.temp.ipcoi = response.data[0].ipcoi
          this.temp.ipca = response.data[0].ipca
          this.temp.cci = response.data[0].cci
          this.temp.cca = response.data[0].cca
          this.temp.csets = response.data[0].csets
        })
      }
      this.getClassficationList()
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    searchFunc(search) {
      if (this.search.beginTime === '' && this.search.endTime !== '') {
        alert('请选择出案开始日期')
      } else {
        this.activeName = '3'
        this.search.state = '3'
        this.getList()
      }
    },
    getList() {
      // 获取table表格数据
      this.listLoading = true
      if (this.activeName !== '3') {
        this.search.beginTime = ''
        this.search.endTime = ''
      }
      findCaseByState(this.search).then((response) => {
        console.log(response)
        // 返回的list
        this.list = response.data
        this.total = response.data.length
        this.user = response.user
        this.multipleSelection = []
        this.finishCases = []
        setTimeout(() => {
          this.listLoading = false
        }, 0.5 * 1000)
      })
    },
    // 验证分类号是否正确
    vaildateClassification() {
      return new Promise((resolve, reject) => {
        this.$nextTick(() => {
          this.$refs['dataForm']
        })
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            // ipc 与cpc 同在校验
            if (
              (this.temp.ipcmi !== null || this.temp.ipcmi !== '') &&
              (this.temp.ipcoi === null || this.temp.ipcoi === '') &&
              (this.temp.cci === null || this.temp.cci === '') &&
              (this.temp.type !== 'XX')
            ) {
              // 主分不为空，副分为空，cci 为空
              this.$confirm('检测到您的cci为空，是否继续保存', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                // 此处执行保存操作
                // this.saveClassification();
                resolve(true)
              }).catch(() => {
                // 取消操作
                resolve(false)
              })
            } else if (
              (this.temp.ipcmi === null || this.temp.ipcmi === '') &&
              (this.temp.ipcoi === null || this.temp.ipcoi === '') &&
              (this.temp.cci !== null || this.temp.cci !== '')
            ) {
              // 主，副分为空，cci不为空
              this.$confirm('检测到您的cci不为空，ipcmi/ipcoi为空，是否继续保存', '提示',
                {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                }
              ).then(() => {
                // 此处执行出案操作
                // this.saveClassification();
                resolve(true)
              }).catch(() => {
                // 取消操作
                resolve(false)
              })
            } else {
              // 一切正常的情况下
              // this.saveClassification();
              resolve(true)
            }
          } else {
            this.correctBtn = false
            this.$alert('分类号校验不通过', '错误', {})
            console.log('error submit!!')
            resolve(false)
          }
        })
      })
    },
    // 分类号逻辑判断
    async subClassification() {
      if (this.activeName === '3') {
        this.correctBtn = true
      }
      const flag = await this.vaildateClassification();
      if (flag) {
        // 执行保存和更正操作
        this.saveClassification()
      } else {
        // 取消操作
      }
    },
    // 逻辑判断通过后，进行后台保存：保存或更正
    saveClassification: function() {
      if (this.activeName === '3') {
        // 进行更正操作
        this.$confirm('提交更正后不可撤销，请确认是否提交？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          correctCase(this.temp).then((response) => {
            if (response.success) {
              this.dialogFormVisible = false;
              this.$message({
                message: '已提交更正，等待管理员审核',
                type: 'success'
              })
            } else {
              this.$message({
                showClose: true,
                message: '发生错误,请稍后重试',
                type: 'error'
              })
              this.correctBtn = false
            }
          })
        }).catch(() => {
          // 取消操作
          this.correctBtn = false
        })
      } else {
        // 进行保存操作
        this.doSaveClassificationInfo(1)
      }
    },
    doSaveClassificationInfo(type) {
      if (type === 1) {
        updateClassificationInfo(this.temp).then((response) => {
          if (response.success) {
            this.dialogFormVisible = false;
            this.$message({
              message: '保存成功',
              type: 'success'
            })
            this.getList()
          } else {
            this.$message({
              showClose: true,
              message: response.message,
              type: 'error'
            })
          }
        })
      } else {
        return new Promise((resolve, reject) => {
          updateClassificationInfo(this.temp).then((response) => {
            if (response.success) {
              resolve(true)
            } else {
              reject(false)
            }
          })
        })
      }
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
    },
    transfercase(row) {
      // 转案
      // 已出案、更正、裁决案件不可进行转案
      if (this.activeName === '3') {
        alert('已出案案件不可进行转案');
        return
      }
      if (this.activeName === '4') {
        alert('更正案件不可进行转案');
        return
      }
      if (this.activeName === '5') {
        alert('裁决案件不可进行转案');
        return
      } else {
        // 跳转转案界面
        this.transtemp.id = row.id;
        this.transtemp.mingcheng = row.mingcheng;
        this.transtemp.worker = row.worker;
        this.transtemp.type = row.type;
        this.$router.push({
          path: '/anjianfenlei/caseTransfer',
          query: {
            transtemp: this.transtemp
          }
        })
      }
    },
    // 判断是否可以正常出案
    judgeMoreIpcmi(id) {
      return new Promise((resolve, reject) => {
        judgeMoreIpcmi(id).then((response) => {
          if (!response.success) {
            console.log('没有多余1');
            resolve(true)
          } else {
            console.log('有别人给出主分');
            this.$confirm('检测到有其他人员给出主分，您也同时填写主分，是否继续出案', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              console.log('坚持出案');
              resolve(true)
            }).catch(() => {
              console.log('放弃出案');
              resolve(false)
            })
          }
        })
      })
    },
    // 现在再写一个async 函数，从而可以使用await 关键字， await 后面放置的就是返回promise对象的一个表达式，所以它后面可以写上 judgeMoreIpcmi 函数的调用
    async finishcase(row) {
      if (row.ipcmi === '' || row.ipcmi === undefined) {
        // 正常出案
        this.dofinishcase(row)
      } else {
        // 1.验证分类号
        const vaildateFlag = await this.vaildateClassification()
        if (vaildateFlag) {
          // 2.保存分类号
          const saveResult = await this.doSaveClassificationInfo(2)
          if (saveResult) {
            // 3.判断可以正常出案
            // 3.1 有主分，自己也写了主分，任然坚持出案或者无主分自己出案
            const result = await this.judgeMoreIpcmi(row.id)
            if (result) {
              // 坚持出案
              this.finishonecase(row)
            } else {
              this.$message({
                showClose: true,
                message: '您已放弃出案，可以重新填写',
                type: 'error'
              })
            }
          } else {
            this.$message({
              showClose: true,
              message: '出案之前，自动保存分类号失败，请稍候重试',
              type: 'error'
            })
            this.getList()
          }
        } else {
          // 取消操作
          console.log('验证没通过')
        }
      }
    },
    // 单一（直接）出案，默认不用校验
    finishonecase(row) {
      this.finishIds = row.id
      this.user = row.worker
      finishcase(this.finishIds, this.user).then((response) => {
        if (response.success) {
          this.$message({
            message: response.message,
            type: 'success'
          })
          this.getList()
        } else {
          this.$message({
            message: response.message,
            type: 'error'
          })
          this.getList()
        }
      })
    },
    handleFilter() {
      this.search.page = 1
      this.getList()
    }
  }
}
</script>

<style scoped>
.tab-container {
  margin: 30px;
}
</style>
