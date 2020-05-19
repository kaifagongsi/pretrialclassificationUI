<template>
  <div class="tab-container">
    <div class="filter-container">
      <el-form ref="searchForm" class="el-form-col search-form" :model="search">
        <el-form-item>
          <el-input v-model="search.id" placeholder="预审申请号" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
          <el-input v-model="search.mingcheng" placeholder="发明名称" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
          <el-input v-model="search.sqr" placeholder="申请主体" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
          <el-input v-model="search.sqh" placeholder="申请号" style="width: 150px;" class="filter-item" @keyup.enter.native="handleFilter" />
          <el-date-picker v-model="search.beginTime" type="date" placeholder="出案日期" style="width: 200px;" class="filter-item" value-format="yyyy-MM-dd" picker-options="pickerBeginDateBefore"/>到
          <el-date-picker v-model="search.endTime" type="date" placeholder="出案日期" style="width: 200px;" class="filter-item" value-format="yyyy-MM-dd" picker-options="pickerBeginDateBefore" />
          <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" :loading="searchLoading" plain native-type="submit" @click.prevent="searchFunc(search)">
            Search
          </el-button>
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
        >
          <el-table-column
            type="selection"
            width="55"
          />
          <el-table-column label="预审申请号" prop="id" align="center" width="200">
            <template slot-scope="{row}">
              <a target="_blank" class="buttonText">{{ row.id }}</a>
            </template>
          </el-table-column>
          <el-table-column label="申请主体" width="200px" align="center">
            <template slot-scope="{row}">
              <span>{{ row.sqr }}</span>
            </template>
          </el-table-column>
          <el-table-column label="发明名称" width="500px" align="center">
            <template slot-scope="{row}">
              <span>{{ row.mingcheng }}</span>
            </template>
          </el-table-column>
          <el-table-column label="发明类型" min-width="50px" align="center">
            <template slot-scope="{row}">
              <span class="link-type">{{ row.type== 'FM' ? '发明' : '新型' }}</span>
            </template>
          </el-table-column>
          <el-table-column label="所属保护中心" min-width="50px" align="center">
            <template slot-scope="{row}">
              <span>{{ row.oraginization }}</span>
            </template>
          </el-table-column>
          <el-table-column label="申请号" width="150px" align="center">
            <template slot-scope="{row}">
              <span>{{ row.sqh }}</span>
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
          <el-table-column label="分类号" width="100px" align="center">
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
            <!-- <el-form-item label="pdf路径" prop="pdfPath">
                <el-input v-model="temp.pdfPath" />
              </el-form-item> -->
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
          </el-table>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">
              关闭
            </el-button>
            <!-- <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
                Confirm
              </el-button> -->
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
      </el-tabs>
    </div>
  </div>
</template>

<script>
import tabPane from './components/TabPane'
import { findAllCase, findClassInfoByID } from '@/api/case-query'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'Tab',
  components: { Pagination, tabPane },
  directives: { waves },
  data() {
    return {
      tabMapOptions: [
        { label: '全部案件', key: 'all' },
        { label: '未分配案件', key: '0' },
        { label: '未完成案件', key: '1' },
        { label: '已完成案件', key: '2' }
      ],
      activeName: 'all',
      searchInfo: {
        id: ''
      },
      createdTimes: 0,
      list: null,
      classInfoList: null,
      total: 0,
      listLoading: true,
      search: {
        page: 1,
        limit: 10,
        state: this.$route.query.tab,
        id: '',
        name: '',
        sqr: '',
        sqh: '',
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
      dialogStatus: '',
      textMap: {
        show: '案件详情及分类信息'
        /* update: '详情',
        create: 'Create' */
      },
      dialogPvVisible: false,
      pvData: [],
      downloadLoading: false,
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      defaultExpandKeys: [],
      pickerBeginDateBefore: {
        disabledDate(time) {
          return time.getTime() > Date.now() - 8.64e6
        }
      },
      
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
  methods: {
    changeTab: function(tab, event) {
      /* console.log(this.activeName)
      this.search.state = event.target.getAttribute('id') */
      this.search.state = this.activeName
      console.log(this.search.state)
      this.getList()
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
      console.log(row)
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    searchFunc(search) {
      if(this.search.beginTime == "" && this.search.endTime != ""){
        alert("请选择出案开始日期")
      }else{
        this.getList()
      }
    },
    getList() { // 获取table表格数据
      this.listLoading = true
      console.log(this.activeName)
      debugger
      findAllCase(this.search).then(response => {
        debugger
        console.log(response)
        // 返回的list
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
    /* showCreatedTimes() {
      this.createdTimes = this.createdTimes + 1
    } */
  }
}
</script>

<style scoped>
  .tab-container {
    margin: 30px;
  }
</style>
