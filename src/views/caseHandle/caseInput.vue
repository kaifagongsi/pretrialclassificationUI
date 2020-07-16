<template>
  <div class="app-container">

    <el-tabs type="border-card">
      <el-tab-pane label="导入案件清单">
        <el-form ref="form" :model="form1" label-width="120px">

          <el-form-item label="添加Excel文件">
            <el-upload
              class="upload-demo"
              accept=".xls, .xlsx"
              ref="uploadForm"
              action="https://localhost:9100/caseHandle"
              :http-request="uploadFile"
              :before-upload="beforeUpload"
              :limit="1"
              :file-list="fileList"
              :auto-upload="false"
              v-on
            >
              <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
              <div
                slot="tip"
                class="el-upload__tip"
                style="color:red;font-size:15px;"
              >支持文件类型：xls、 xlsx</div>
              <div
                slot="tip"
                class="el-upload__tip"
                style="color:red;font-size:15px;"
              >请确认Excel格式 ： A：预审申请号 B：申请主体 C：发明名称 D：发明类型</div>
            </el-upload>
          </el-form-item>
          <el-form-item label="所属保护中心">
            <el-select v-model="form1.region" placeholder="请选择保护中心">
              <el-option label="广州" value="广州"></el-option>
              <el-option label="南京" value="南京"></el-option>
              <el-option label="佛山" value="佛山"></el-option>
              <el-option label="武汉" value="武汉"></el-option>
              <el-option label="深圳" value="深圳"></el-option>
              <el-option label="长沙" value="长沙"></el-option>
              <el-option label="苏州" value="苏州"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="上传文件类型">
            <el-select v-model="form1.type" placeholder="请选择文件类型">
              <el-option label="XML" value="xml"></el-option>
              <el-option label="PDF" value="pdf"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="insertData">上传</el-button>
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
      <el-table-column label="Actions" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button  size="mini" type="danger" @click="handleDelete(row)">
            删除
          </el-button>
          <el-button type="primary" size="mini" @click="handleEdit(row)">
            编辑
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="form1.page" :limit.sync="form1.limit" @pagination="getList" />

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
import { deleteDataByID, updateSimpleclasscode } from '@/api/case-handle'
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
      form1: {
        page: 1,
        limit: 10,
        region: '',
        type: ''
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
      let list = new FormData();
      //添加参数
      list.append("page", this.form1.page);
      list.append("limit", this.form1.limit);
      this.refreshData(list);
    },
    handleFilter() {
      this.form1.page = 1
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
      filelist.append("page", this.form1.page);
      filelist.append("limit", this.form1.limit);
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
    handleDelete(row) {
      this.$confirm('此操作将永久删除数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteDataByID(row.id).then(response => {
          if (response.success) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.getList()
          }
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '后台服务异常,请稍候重试'
          })
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
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
