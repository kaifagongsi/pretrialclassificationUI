<template>
  <div class="app-container">

    <el-tabs type="border-card">
      <el-tab-pane label="案件分配">
        <el-form ref="form" label-width="250px">
          <el-form-item label="第一步：有PDF，下载pdf后OCR识别">
            <el-button type="primary" @click="downloadPDF">下载PDF</el-button>
            <el-button type="primary" @click="insertData">OCR合并</el-button>
          </el-form-item>
          <el-form-item label-width="170px" label="第二步：批量分配粗分号">
            <el-button type="primary" @click="insertData">分配粗分号</el-button>
          </el-form-item>
          <el-form-item label-width="295px" label="第三步：粗分号全不为空，案件分配给分类员">
            <el-button type="primary" @click="insertData">案件分配</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="粗分号查询">
        <el-form ref="form" :model="form" label-width="80px">
          <el-form-item label="标题">
            <el-input v-model="form.title"></el-input>
          </el-form-item>
          <el-form-item label="摘要">
            <el-input type="textarea" v-model="form.abstract"></el-input>
          </el-form-item>
          <el-form-item label="权利要求">
            <el-input type="textarea" v-model="form.claims"></el-input>
          </el-form-item>
          <el-form-item label="说明书">
            <el-input type="textarea" v-model="form.description"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="querySimpleCode">查询粗分号</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>

    <el-table stripe v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%;"  @selection-change="handleSelectionChange">
      <el-table-column label="预审申请号"  align="center" min-width="50px">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="申请主体"  align="center">
        <template slot-scope="{row}">
          <span>{{ row.sqr }}</span>
        </template>
      </el-table-column>
      <el-table-column label="发明名称"  align="center">
        <template slot-scope="{row}">
          <span>{{ row.mingcheng }}</span>
        </template>
      </el-table-column>
      <el-table-column label="发明类型" width="100px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.type }}</span>
        </template>
      </el-table-column>
      <el-table-column label="粗分号" width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.simpleclasscode }}</span>
        </template>
      </el-table-column>
      <el-table-column label="所属保护中心" width="120px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.oraginization }}</span>
        </template>
      </el-table-column>
      <el-table-column label="进案日期" width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.jinantime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="主分类员" width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.mainworker }}</span>
        </template>
      </el-table-column>
      <el-table-column label="副分类员" width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.assworker }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Actions" align="center" width="150" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleEdit(row)">
            编辑
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="search.page" :limit.sync="search.limit" @pagination="getList" />

    <el-dialog title="编辑粗分号" :visible.sync="editFormVisible" :close-on-click-modal="false"
               class="edit-form" :before-close="handleClose">
      <el-form :model="editForm" label-width="80px"  ref="editForm">
        <el-form-item label="粗分号" prop="Name">
          <el-input v-model="editForm.simpleclasscode" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="handleCancel('editForm')">取消</el-button>
        <el-button type="primary" @click.native="handleUpdate('editForm')">更新</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import { updateSimpleclasscode, getUnfinishedList, downloadPDF } from '@/api/case-handle'
  import waves from '@/directive/waves' // waves directive
  import Pagination from '@/components/Pagination' // secondary package based on el-pagination

  export default {
    name: 'ComplexTable',
    components: {Pagination },
    directives: {waves},
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
        listLoading: true,
        form: {
          title: '',
          abstract: '',
          description: '',
          claims: ''
        },
        search: {
          page: 1,
          limit: 10
        },
        editForm: {
          id: undefined,
          simpleclasscode: ''
        },
        editFormVisible: false,//默认不显示编辑弹层
        downloadLoading: false,
        isLoadingTree: false, // 是否加载节点树
        setTree: '', // 节点树数据
        defaultProps: {
          children: 'children',
          label: 'name'
        },
        defaultExpandKeys: [], // 默认展开节点列表
        multipleSelection: [],
        fileList:[]
      }
    },
    created() {
      this.getList()
    },
    mounted() {
      this.initExpand()
    },
    methods: {
      handleSelectionChange(val) {
        this.multipleSelection = val
      },
      initExpand() { // 加载tree
        this.isLoadingTree = true
      },
      getList() { // 获取table表格数据
        this.listLoading = true
        getUnfinishedList(this.search).then(response => {
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
      insertData() {
        this.$refs.uploadForm.submit();
      },
      // 上传前对文件的大小的判断
      beforeUpload (file) {
        const extension = file.name.split('.')[1] === 'xls'
        const extension2 = file.name.split('.')[1] === 'xlsx'
        const isLt2M = file.size / 1024 / 1024 < 10
        if (!extension && !extension2 && !extension3 && !extension4) {
          console.log('上传模板只能是 xls、xlsx 格式!')
        }
        if (!isLt2M) {
          console.log('上传模板大小不能超过 10MB!')
        }
        return extension || extension2 && isLt2M
      },
      uploadFile(file) {
        let filelist = new FormData();
        //添加参数
        filelist.append("file", file.file);
        filelist.append("region", this.form1.region);
        filelist.append("type", this.form1.type);
        filelist.append("page", this.search.page);
        filelist.append("limit", this.search.limit);
        this.refreshData(filelist);
        this.fileList = [];
      },
      refreshData(filelist){
        const  _this = this
        this.$axios.post(process.env.VUE_APP_BASE_API + '/caseHandle/insertData',filelist,{ headers: { "Content-Type": "multipart/form-data" }}).then(response => {
          this.list = response.data.data.items
          this.total = response.data.data.total
          setTimeout(() => {
            this.listLoading = false
          }, 0.5 * 1000)
        })
      },
      //点击编辑
      handleEdit(row) {
        this.editFormVisible = true;
        this.editForm = Object.assign({}, row); //这句是关键！！！
      },
      //点击关闭dialog
      handleClose(done) {
        this.editFormVisible = false;
      },
      //点击取消
      handleCancel(formName) {
        this.editFormVisible = false;
      },
      querySimpleCode(){

      },
      downloadPDF(){
        downloadPDF().then(response => {
          this.$message({
            type: 'success',
            message: '下载PDF成功!'
          })
        })
      },
      //点击更新
      handleUpdate(forName) {
        //这里再向后台发个post请求重新渲染表格数据
        this.editFormVisible = false;
        //更新的时候就把弹出来的表单中的数据写到要修改的表格中
        var postData = {
          id: this.editForm.id,
          simpleclasscode: this.editForm.simpleclasscode
        }
        updateSimpleclasscode(postData).then(response => {
          if (response.success) {
            this.$message({
              type: 'success',
              message: '更新粗分号成功!'
            })
            this.getList()
          }
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '后台服务异常,请稍候重试'
          })
        })
      }
    }
  }
</script>
<style >
  .el-tree-node:focus > .el-tree-node__content {
    background-color: #c26a3e !important;
  }
</style>
