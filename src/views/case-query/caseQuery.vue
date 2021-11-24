
<template>
  <div class="tab-container">
    <div class="filter-container">
      <el-form ref="searchForm" class="el-form-col search-form" :model="search">
        <el-form-item>
          <el-row :gutter="10">
            <el-col :span="5">
              <el-input v-model="search.id" placeholder="预审申请号" class="filter-item" @keyup.enter.native="handleFilter" />
            </el-col>
            <el-col :span="5">
              <el-input v-model="search.mingcheng" placeholder="发明名称" class="filter-item" @keyup.enter.native="handleFilter" />
            </el-col>
            <el-col :span="5">
              <el-input v-model="search.sqr" placeholder="申请主体" class="filter-item" @keyup.enter.native="handleFilter" />
            </el-col>
            <el-col :span="5">
              <el-input v-model="search.sqh" placeholder="申请号" class="filter-item" @keyup.enter.native="handleFilter" />
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="5">
              <el-input v-model="search.worker" placeholder="分类员" class="filter-item" @keyup.enter.native="handleFilter" />
            </el-col>
            <el-col :span="5">
              <el-input v-model="search.oraginization" placeholder="案件所属保护中心" class="filter-item" @keyup.enter.native="handleFilter" />
            </el-col>
            <el-col :span="5">
              <el-date-picker v-model="search.beginTime" type="date" placeholder="出案开始日期" class="filter-item" value-format="yyyy-MM-dd" />
            </el-col>
            <el-col :span="5">
              <el-date-picker v-model="search.endTime" type="date" placeholder="出案截止日期" class="filter-item" value-format="yyyy-MM-dd" />
            </el-col>
            
            <el-col :span="10">
              <el-button v-waves class="filter-item" type="primary" icon="el-icon-search"  plain native-type="submit" @click.prevent="searchFunc(search)">
                Search
              </el-button>
              <el-button v-waves class="filter-item" type="primary"  plain native-type="submit" @click.prevent="exportToExcel()">
                导出详情
              </el-button>
              <el-button v-waves class="filter-item" type="primary"  plain native-type="submit" @click.prevent="exportToZip()">
                下载Excel
              </el-button>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
      <el-tabs v-model="activeName" style="margin-top:15px;" type="border-card" @tab-click="changeTab">
        <el-tab-pane v-for="item in tabMapOptions" :key="item.key" :label="item.label" :name="item.key">
        </el-tab-pane>
        <el-table
          v-loading="listLoading"
          :data="list"
          @selection-change="handleSelectionChange"
          :row-key="getRowKey"
          border
          fit
          highlight-current-row
          style="width: 100%;"
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
        <!--</div> -->
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
            <!-- <el-table-column label="IPC" width="200px" align="center">
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
import { findAllCase, findClassInfoByID, exportExcelToZip } from '@/api/case-query'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'Tab',
  components: { Pagination },
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
      multipleSelection: [],
      exportID: [],
      excelData:'',
      createdTimes: 0,
      list: null,
      classInfoList: null,
      total: 0,
      listLoading: true,
      search: {
        page: 1,
        limit: 100,
        state: this.$route.query.tab,
        id: '',
        mingcheng: '',
        oraginization: '',
        sqr: '',
        sqh: '',
        worker: '',
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
      },
      dialogPvVisible: false,
      pvData: [],
      downloadLoading: false,
      defaultProps: {
        children: 'children',
        label: 'name'
      }
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
    // 指定一个key标识一行的数据
    getRowKey (row) {
      return row.id
    },
    changeTab: function(tab, event) {
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
      if (this.search.beginTime === '' && this.search.endTime !== '') {
        alert('请选择出案开始日期')
      } else {
        this.getList()
      }
    },
    getList() { // 获取table表格数据
      this.listLoading = true
      // console.log(this.search)
      findAllCase(this.search).then(response => {
        // console.log(response)
        // 返回的list
        this.list = response.data.items
        console.log(this.list)
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
    //操作多选
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    //前端直接导出Excel
    exportToExcel() {
      if ('admin' != this.$store.state.user.roles){
        this.$alert('您当前没有该权限', '提示', {
          confirmButtonText: '确定'
        })
        return
      }
      if (this.activeName != '2'){
        this.$alert('仅限制已出案案件导出', '提示', {
          confirmButtonText: '确定'
        })
        return
      }
      this.excelData = this.multipleSelection
      this.excelData.forEach(element => {
        element.jinantime = parseTime(element.jinantime,'{y}{m}{d}')
      });
      //console.log(this.excelData)
      var that = this;
      require.ensure([], () => {
        const {
          export_json_to_excel
        } = require("../../excel/Export2Excel")
        const tHeader = ["预审申请号","申请主体","发明名称","发明类型","所属保护中心","预审申请日","分类号","CCI","CCA","C-Sets","主分类员","副分类员"]; // excel文档第一行显示的标题
        const filterVal = ["id","sqr","mingcheng","type","oraginization","jinantime","ipci","cci","cca","csets","mainworker","assworker"];
        const list = that.excelData;
        const data = this.formatJson(filterVal,list);
        export_json_to_excel(tHeader,data,"bhzx");
      })
    },
    formatJson(filterVal,jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
    },
    
    //后台打包导出Excel压缩文件
    exportToZip() {
      if ('admin' != this.$store.state.user.roles){
        this.$alert('您当前没有该权限', '提示', {
          confirmButtonText: '确定'
        })
        return
      }
      if (this.activeName != '2'){
        this.$alert('仅允许已完成案件导出', '提示', {
          confirmButtonText: '确定'
        })
        return
      }
      if (this.multipleSelection === [] || this.multipleSelection.length === 0) {
        this.$alert('请先选择要导出的案件','提示', {
          confirmButtonText: '确定'
        })
        return
      }
      for (var i=0;i<this.multipleSelection.length;i++) {
        this.exportID.push(this.multipleSelection[i].id)
      }
      // this.excelData = this.multipleSelection
      // console.log(this.exportID)
      let formData = JSON.stringify(this.exportID)
      
      exportExcelToZip(formData).then((response) => {
        this.downloadFile(response);
        this.exportID = [];
      })
    },
    //文件导出
    downloadFile(data) {
      if (!data) {
        return
      }
      let url = window.URL.createObjectURL(new Blob([data]));
      let link = document.createElement('a');
      link.style.display = 'none';
      link.href = url;
      link.setAttribute('download','bhzx.zip');
      document.body.appendChild(link);
      link.click();
    },

  }
}
</script>

<style scoped>
  .tab-container {
    margin: 30px;
  }
</style>

