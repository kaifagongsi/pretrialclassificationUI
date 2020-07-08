<template>
  <div class="tab-container">
    <div class="filter-container">
      <el-form ref="searchForm" class="el-form-col search-form" :model="search">
        <el-form-item>
          <!-- <el-input v-model="search.id" placeholder="预审申请号" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
          <el-input v-model="search.mingcheng" placeholder="发明名称" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
          <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" :loading="searchLoading" plain native-type="submit" @click.prevent="searchFunc(search)">
            Search
          </el-button> -->
          <el-row>
            <el-col :span="6">
              <el-button type="primary" class="filter-item" @click="transfercase();dialogFormVisible =false">
                转案
              </el-button>
              <el-button type="primary" class="filter-item" @click="finishcase();">
                出案
              </el-button>
            </el-col>
            <el-col :span="12" :offset="6">
              <el-date-picker v-model="search.beginTime" type="date" placeholder="出案开始日期" class="filter-item" value-format="yyyy-MM-dd" />
              <el-date-picker v-model="search.endTime" type="date" placeholder="出案截止日期" class="filter-item" value-format="yyyy-MM-dd" />
              <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" :loading="searchLoading" plain native-type="submit" @click.prevent="searchFunc(search)">
                Search
              </el-button>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
      <el-tabs v-model="activeName" style="margin-top:15px;" type="border-card" @tab-click="changeTab">
        <el-tab-pane v-for="item in tabMapOptions" :key="item.key" :label="item.label" :name="item.key">
          <!-- <keep-alive>
            <tab-pane v-if="activeName==item.key" :type="item.key" @create="showCreatedTimes" />
          </keep-alive> -->
        </el-tab-pane>
        <el-table
          v-loading="listLoading"
          :data="list"
          border
          fit
          highlight-current-row
          style="width: 100%;"
          @selection-change="handleSelectionChange"
        >
          <el-table-column
            type="selection"
            width="55"
          />
          <el-table-column label="预审申请号" prop="id" align="center" width="180px">
            <template slot-scope="{row}">
              <a target="_blank" class="buttonText">{{ row.id }}</a>
              <!-- <router-link to="">{{ row.id }}</router-link> -->
            </template>
          </el-table-column>
          <el-table-column label="发明名称" width="400px" align="center">
            <template slot-scope="{row}">
              <span>{{ row.mingcheng }}</span>
            </template>
          </el-table-column>
          <el-table-column label="申请人" width="200px" align="center">
            <template slot-scope="{row}">
              <span>{{ row.sqr }}</span>
            </template>
          </el-table-column>
          <el-table-column label="类型" min-width="50px" align="center">
            <template slot-scope="{row}">
              <span class="link-type">{{ row.type== 'FM' ? '发明' : '新型' }}</span>
            </template>
          </el-table-column>
          <el-table-column label="粗分号" width="100px" align="center">
            <template slot-scope="{row}">
              <span>{{ row.simpleclasscode }}</span>
            </template>
          </el-table-column>
          <el-table-column label="进案日期" width="180px" align="center">
            <template slot-scope="{row}">
              <span>{{ row.jinantime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="100px" class-name="small-padding fixed-width">
            <template slot-scope="{ row }">
              <el-button type="primary" size="mini" @click="showDetail(row);dialogFormVisible =true">
                详情
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <pagination v-show="total>0" :total="total" :page.sync="search.page" :limit.sync="search.limit" @pagination="getList" />
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
                <!-- <el-input v-model="temp.simpleclasscode" /> -->
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="进案时间" prop="jinantime">
                <!-- <el-input><span>{{ temp.jinantime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span></el-input> -->
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

        <el-dialog :title="textMap[dialogStatus]" :visible.sync="userDialogFormVisible">
          <div :model="transtemp">
            <div>
              <el-button type="info" style="float: right;" @click="handleChangeState">确认转案</el-button>
            </div>
            <div style="font-size: xx-large; text-align: center">
              <svg-icon icon-class="user" style="width: 60px; height: 60px" /><svg-icon icon-class="exchange" style="height: 60px;margin-left: 50px;margin-right: 50px;" /><svg-icon icon-class="user" style="width: 60px; height: 60px" />
            </div>
            <div style="font-size: large;padding-top: 5px;">
              <span style="width: 50px;margin-left: 200px;">{{ transtemp.worker }}</span> <span style="width: 50px;margin-left: 80px">{{ transtemp.pdfPath }}</span>
            </div>
            <div>
              <el-tree
                v-if="isLoadingTree"
                ref="expandMenuList"
                class="expand-tree"
                :data="setTree"
                node-key="name"
                highlight-current
                :props="defaultProps"
                :expand-on-click-node="false"
                center 
                @node-click="handleNodeClick"
              >
              </el-tree>
            </div>
          </div>
        </el-dialog>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import { findCaseByState, finishcase } from '@/api/case-classification'
import { findUserInfo, updateWorker } from '@/api/case-disposition'
import { findClassInfoByID } from '@/api/case-query'
import waves from '@/directive/waves' // waves directive
import { parseTime, param } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import api from '@/api/treeApi'

export default {
  name: 'Tab',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      tabMapOptions: [
        { label: '新分待审', key: '0' }, // 主分进案
        { label: '已分待出', key: '1' }, // 给了分类号
        { label: '转案待审', key: '2' }, // 作为副分
        { label: '已出案', key: '3' }, // 已出案
        { label: '更正列表', key: '4' }, // 分类号更正待审
        { label: '裁决列表', key: '5' } // 案件裁决待审
      ],
      activeName: '0',
      searchInfo: {
        id: ''
      },
      user: '',
      createdTimes: 0,
      list: null,
      classInfoList: null,
      total: 0,
      listLoading: true,
      search: {
        page: 1,
        limit: 5,
        state: this.$route.query.tab,
        beginTime: '',
        endTime: ''
      },
      temp: {
        id: undefined,
        mingcheng: '',
        type: '',
        sqr: '',
        sqh: '',
        simpleclasscode: '',
        jinantime: ''
      },
      dialogFormVisible: false,
      userDialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        show: '案件详情及分类信息',
        update: '转案',
      },
      transtemp: {
        id: undefined,
        mingcheng: '',
        type: '',
        simpleclasscode: '',
        jinantime: new Date(),
        message: '',
        worker: '',
        //transworker: ''
      },
      dialogPvVisible: false,
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
      multipleSelection: []// 多选
    }
  },
  resetTemp() {
    this.temp = {
      id: '',
      mingcheng: '',
      type: '',
      sqr: '',
      sqh: '',
      pdfPath: '',
      state: '',
      simpleclasscode: '',
      chuantime: '',
      jinantime: '',
      message: ''
    }
  },
  watch: {
    activeName(val) {
      this.$router.push(`${this.$route.path}?tab=${val}`)
    }
  },
  created() {
    // init the default selected tab
    const tab = this.$route.query.tab
    if (tab) {
      this.activeName = tab
    }
    this.getList()
  },
  mounted() {
    console.log(api)
    this.initExpand()
  },
  methods: {
    changeTab: function(tab, event) {
      this.search.state = this.activeName
      console.log(this.search.state)
      this.getList()
    },
    // 点击人员节点
    handleNodeClick(d, n, s) { // 点击节点
      // console.log(n)
      this.transtemp.pdfPath = d.name
    },
    initExpand() { // 加载tree
      findUserInfo().then(response => {
        this.setTree = response.treelist
        this.setTree.map(a => {
          this.defaultExpandKeys.push(a.id)
        })
      })
      this.isLoadingTree = true
    },
    handleChangeState() {
      this.$confirm(' ' + this.transtemp.id + '转案给：' + this.transtemp.pdfPath, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const tempData = Object.assign({}, this.transtemp)
        tempData.chuantime = +new Date(tempData.chuantime)
        tempData.jinantime = +new Date(tempData.jinantime)
        console.log(tempData)
        caseTransfer(tempData).then(response => {
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
    },
    // 获取选中行id
    handleSelectionChange(val) {
      this.finishIds = '';
      for (var i=0; i<val.length-1; i++) {
        var halo = val[i].id;
        this.finishIds += halo + ','
      }
      this.finishIds += val[i].id;
      this.multipleSelection = val
    },
    // 获取分类信息
    getClassficationList() {
      //console.log(this.searchInfo.id)
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
      console.log(row)
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
    getList() { // 获取table表格数据
      this.listLoading = true
      if(this.activeName !== '3'){
        this.search.beginTime = '',
        this.search.endTime = ''
      }
      findCaseByState(this.search).then(response => {
        console.log(response)
        // 返回的list
        this.list = response.data.items
        this.total = response.data.total
        this.user = response.user
        setTimeout(() => {
          this.listLoading = false
        }, 0.5 * 1000)
      })
    },
    transfercase() { //转案
      //已出案、更正、裁决案件不可进行转案
      /* if(this.activeName == '3'){
        alert('已出案案件不可进行转案')
        return
      } */
      if(this.activeName == '4'){
        alert('更正案件不可进行转案')
        return
      }
      if(this.activeName == '5'){
        alert('裁决案件不可进行转案')
        return
      }else if(this.multipleSelection.length === 0){
        alert('请选择需要转案的案件')
      }else if(this.multipleSelection.length > 1){
        alert('仅能选择一个案件转案')
      }else{
        //跳转转案界面
        //this.transtemp = this.multipleSelection[0]
        this.transtemp.id = this.multipleSelection[0].id
        this.transtemp.mingcheng = this.multipleSelection[0].mingcheng
        this.transtemp.worker = this.multipleSelection[0].worker
        this.transtemp.type = this.multipleSelection[0].type
        this.$router.push({
          path: '/anjianfenlei/caseTransfer',
          query:{
            transtemp:this.transtemp
          }
        });
      }
    },
    finishcase(){ // 出案
      alert("出案");
      console.log(this.finishIds,this.user)
      finishcase(this.finishIds,this.user).then(response => {
        console.log(response)
        this.finishIds = '';
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
