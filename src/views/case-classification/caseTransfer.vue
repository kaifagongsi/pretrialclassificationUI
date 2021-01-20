<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form ref="transtemp" class="el-form-col search-form">
        <el-form-item>
          <el-row :gutter="20">
              <el-col :span="6">
                <el-input v-model.trim="transtemp.id" placeholder="预审案件编号" class="filter-item" @keyup.enter.native="handleFilter" />
              </el-col>
              <el-col :span="6">
                <el-input v-model.trim="transtemp.worker" placeholder="分类员" class="filter-item" @keyup.enter.native="handleFilter" />
              </el-col>
              <el-col :span="6">
                <el-input v-model.trim="transtemp.mingcheng" placeholder="发明名称" class="filter-item" @keyup.enter.native="handleFilter" />
              </el-col>
          </el-row>
        </el-form-item>
      </el-form>
    </div> 
    <div>
      <div class="workerlist" style="width:45%;float:left;">
        <div>
          <el-button type="primary" style="float:right;" @click="getCheckedNodes">确定</el-button>
        </div>
        <div style="font-size: xx-large; text-align: center">
          <svg-icon icon-class="user" style="width: 60px; height: 60px" /><svg-icon icon-class="exchange" style="height: 60px;margin-left: 50px;margin-right: 50px;" /><svg-icon icon-class="user" style="width: 60px; height: 60px" />
        </div>
        <div style="font-size: large;padding-top: 5px;">
          <span style="width: 50px;margin-left: 100px;">{{ this.transtemp.worker }}</span> <span style="width: 50px;margin-left: 80px"></span>
        </div>
        <div class="isTree">
          <el-tree
            v-if="isLoadingTree"
            ref="expandMenuList"
            class="expand-tree"
            :data="setTree"
            show-checkbox
            node-key="name"
            highlight-current
            :props="defaultProps"
            :default-expanded-keys="openKeys"
            :expand-on-click-node="false"
            center
          />
        </div>
      </div>
      <div class="messagelist" style="width:50%;float:right;">
        <el-table
          :data="transworker"
          stripe
          border
          style="width: 100%">
          <el-table-column label="姓名" width="250px">
            <template slot-scope="scope">
              <span>{{scope.row.name}}</span>
            </template>
          </el-table-column>
          <el-table-column label="转案留言">
            <template slot-scope="scope">
              <el-input placeholder="若有留言，请输入" v-model="scope.row.message"></el-input>
            </template>
          </el-table-column>
        </el-table>
        <div style="margin:15px">
          <el-button type="primary" :disabled="isDisable" style="float:right;" @click="save($event)">确定转案</el-button>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import { searchByCondition, getTransWorkerList, caseTransfer } from '@/api/case-classification'
import { findUserInfo, updateWorker } from '@/api/case-disposition'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import api from '@/api/treeApi'

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
  components: { Pagination },
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
      isLoadingTree: false, // 是否加载节点树
      setTree: '', // 节点树数据
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      isDisable: false,
      dialogStatus: '',
      defaultExpandKeys: [], // 默认展开节点列表
      list: null,
      total: 0,
      classInfoList: null,
      listLoading: true,
      showDetail: false,
      calendarTypeOptions,
      textMap: {
        show: '查询结果'
      },
      dialogFormVisible: true,
      pvData: [],
      downloadLoading: false,
      //transtemp: '',
      transtemp: {
        id: '',
        mingcheng: '',
        type: '',
        simpleclasscode: '',
        jinantime: new Date(),
        message: '',
        worker: '',
      },
      transworker: [],
      workerlist: [],
      saveBtn: false,
    }
  },
  created() {
    // console.log(this.$route.query.transtemp)
    this.saveBtn = false;
    this.transtemp = this.$route.query.transtemp
    this.initExpand()
  },
  mounted() {
    //this.initExpand()
  },
  methods: {
    handleFilter() {
    },
    // 点击人员节点
    /* handleNodeClick(d, n, s) { // 点击节点
      this.transtemp.workertemp.name = d.name
    }, */
    getCheckedNodes() {
      this.transworker = []
      var list = this.$refs.expandMenuList.getCheckedNodes();
      if(list.length === 0) {
        alert("请至少选择一人进行转案")
      }else {
        for(var i=0;i<list.length;i++){
          if(list[i].children == null){
            //判断是否重复转案
            let workerid = list[i].name.substring(0,6)
            if(this.workerlist.indexOf(workerid) > -1){
              alert(list[i].name+'存在重复转案,请重新选择')
            } else {
              // 子节点
              this.saveBtn = true;
              let workertemp={
                id: this.transtemp.id,
                worker: this.transtemp.worker,
                name: list[i].name,
                message:''
              }
              this.transworker.push(workertemp)
            }
          }
        }
      }
    },
    save(event){
      if (!this.saveBtn){
        alert("请先确定转案人员");
        return;
      } else {
          // 被转案人员姓名和留言
          let formData = JSON.stringify(this.transworker)
          console.log(formData)
          this.$confirm('是否确定转案？','提示',{
            confirmButtonText: '是',
            cancelButtonText: '否',
            type: 'warning'
          }).then(() => {
              caseTransfer(formData).then(response => {
                if (response.success) {
                  this.transworker = [];
                  //this.isDisable = true;
                  this.$message({
                  type: 'success',
                  message: '转案成功!'
                });
                }else {
                  this.$message({
                    type: 'error',
                    message: '转案失败'
                  });
                }

              });
            }).catch(() => {
              this.$message({
                  type: 'info',
                  message: '已取消转案'
              });
            });
          }
      },
    
    initExpand() { // 加载tree
      findUserInfo().then(response => {
        this.setTree = response.treelist
        this.setTree.map(a => {
          this.defaultExpandKeys.push(a.id)
        })
      })
      getTransWorkerList(this.transtemp).then(response => {
        this.workerlist = response.workerlist
      })
      this.isLoadingTree = true
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
