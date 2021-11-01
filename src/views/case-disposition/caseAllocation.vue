<template>
  <div class="app-container">

    <div class="filter-container">
      <el-form ref="searchForm" class="el-form-col search-form" >
        <el-row>
          <el-col :span="6">
            <el-form-item label="部门">
              <el-select v-model="listQuery.dep1" class="filter-item" placeholder="请选择部门">
                <el-option v-for="item in dep1s" :key="item.value" :label="item.label" :value="item.label" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="处室">
              <el-select v-model="listQuery.dep2" class="filter-item" placeholder="请选择处室">
                <el-option v-for="item in dep2s" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" plain native-type="submit" @click.prevent="searchFunc(listQuery)">
              查询
            </el-button>
          </el-col>
          <el-col :span="6">
            <el-button class="filter-item" type="primary" icon="el-icon-s-promotion" style="float: right" @click="sendEmail">
              发送邮件
            </el-button>
          </el-col>
        </el-row>
      </el-form>
     <!-- <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" plain native-type="submit" @click.prevent="searchFunc(listQuery)">
        查询
      </el-button>
      <el-button class="filter-item" type="primary" icon="el-icon-s-promotion" style="float: right" @click="sendEmail">
        发送邮件
      </el-button>-->
    </div>
    <el-table
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @selection-change="handleSelectionChange"
    >
      >
      <el-table-column
        type="selection"
        width="55"
        :default-sort="{prop: 'worker', order: 'descending'}"
      />
      <el-table-column label="ID" prop="id" align="center" width="200">
        <template slot-scope="{row}">
          <span class="link-type">{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="名称" width="500px" prop="mingcheng" align="center">
        <template slot-scope="{row}">
          <span>{{ row.mingcheng }}</span>
        </template>
      </el-table-column>
      <el-table-column label="类型" min-width="50px" prop="type" align="center">
        <template slot-scope="{row}">
          <span>{{ row.type=== 'FM' ? '发明' : '新型' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="粗分结果" width="200px" prop="simpleclasscode" align="center">
        <template slot-scope="{row}">
          <span>{{ row.simpleclasscode }}</span>
        </template>
      </el-table-column>
      <el-table-column label="分配人员" width="100px" prop="worker" align="center" sortable>
        <template slot-scope="{row}">
          <span>{{ row.worker }}</span>
        </template>
      </el-table-column>
      <el-table-column label="进案日期" width="180px" prop="jinantime" align="center" sortable>
        <template slot-scope="{row}">
          <span>{{ row.jinantime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>

      <el-table-column label="Actions" align="center" width="150" class-name="small-padding fixed-width">
        <template slot-scope="{ row }">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            调配
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <div :model="temp">
        <div>
          <el-button type="info" style="float: right;" @click="handleChangeState">确认调配</el-button>
        </div>
        <div style="font-size: xx-large; text-align: center">
          <svg-icon icon-class="user" style="width: 60px; height: 60px" /><svg-icon icon-class="exchange" style="height: 60px;margin-left: 50px;margin-right: 50px;" /><svg-icon icon-class="user" style="width: 60px; height: 60px" />
        </div>
        <div style="font-size: large;padding-top: 5px;">
          <span style="width: 50px;margin-left: 200px;">{{ temp.worker }}</span> <span style="width: 50px;margin-left: 80px">{{ temp.pdfPath }}</span>
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
            :default-expanded-keys="openKeys"
            :expand-on-click-node="false"
            center
            @node-click="handleNodeClick"
          />
        </div>
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
</template>

<script>
import { findMainByState, findUserInfo, updateWorker, sendEmail, getInitDep1s, getDep2sByDep1 } from '@/api/case-disposition'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

const calendarTypeOptions = [
  { key: 'CN', display_name: 'China' },
  { key: 'US', display_name: 'USA' },
  { key: 'JP', display_name: 'Japan' },
  { key: 'EU', display_name: 'Eurozone' }
]

// arr to obj, such as { CN : "China", US : "USA" }
const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name;
  return acc
}, {});
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
      };
      return statusMap[status]
    },
    typeFilter(type) {
      return calendarTypeKeyValue[type]
    }
  },
  watch: {
    'listQuery.dep1': {
      handler(newValue, oldValue) {
        debugger
        if(newValue != null && newValue != ''){
          this.dep2s = []
          this.listQuery.dep2 = ''
          getDep2sByDep1(newValue).then(response =>{
            let arr =  response.queryResult.list
            for(let i = 0; i < arr.length; i++) {
              this.dep2s.push({value: arr[i],label: arr[i]})
            }
          })
        }
      }
    },
    'listQuery.dep2': {
      handler(newValue, oldValue) {
        if (newValue !== oldValue && newValue!= null && newValue!='') {
          // 触发查询函数
          this.searchFunc(this.listQuery)
        }
      }
    }
  },
  data() {
    return {
      openKeys: [],
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 100,
        importance: undefined,
        title: undefined,
        type: undefined,
        dep1: undefined,
        dep2: undefined,
      },
      importanceOptions: [1, 2, 3],
      calendarTypeOptions,
      temp: {
        id: undefined,
        mingcheng: '',
        type: '',
        simpleclasscode: '',
        jinantime: new Date(),
        message: '',
        worker: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '调配',
        create: 'Create'
      },
      dialogPvVisible: false,
      pvData: [],
      downloadLoading: false,
      isLoadingTree: false, // 是否加载节点树
      setTree: '', // 节点树数据
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      defaultExpandKeys: [], // 默认展开节点列表
      multipleSelection: [],
     /* arbiterPerson: { // 部门数据
        dep1: '',
        dep2: '',
        person: ''
      },*/
      dep1s: [],
      dep2s: undefined,
      dep2JG: []
    }
  },
  created() {
    this.getList()
  },
  mounted() {
    //console.log(api);
    this.initExpand()
    this.initdep()
  },
  methods: {
    searchFunc() {
      this.listLoading = true;
      findMainByState(this.listQuery).then(response => {
        this.list = response.data.items;
        this.total = response.data.total;
        setTimeout(() => {
          this.listLoading = false
        }, 0.5 * 1000)
      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    initdep() {
      getInitDep1s().then(response => {
        let arr =  response.queryResult.list
        for(let i = 0; i < arr.length; i++) {
          this.dep1s.push({value: arr[i],label: arr[i]})
        }
      })
    },
    initExpand() { // 加载tree
      findUserInfo().then(response => {
        this.setTree = response.treelist;
        this.setTree.map(a => {
          this.defaultExpandKeys.push(a.id)
        })
      });
      this.isLoadingTree = true
    },
    handleNodeClick(d, n, s) { // 点击节点
      this.temp.pdfPath = d.name
    },
    getList() { // 获取table表格数据
      this.listLoading = true;
      findMainByState(this.listQuery).then(response => {
        this.list = response.data.items;
        this.total = response.data.total;
        setTimeout(() => {
          this.listLoading = false
        }, 0.5 * 1000)
      })
    },
    handleFilter() {
      this.listQuery.page = 1;
      this.getList()
    },
    handleModifyStatus(row, status) {
      this.$message({
        message: '操作Success',
        type: 'success'
      });
      row.status = status
    },
    handleUpdate(row) { // 点击调配触发事件
      // 重新加载tree 否则上次记录依然存在
      this.initExpand();
      this.openKeys = [];
      this.temp = Object.assign({}, row);// copy obj
      console.info(this.temp);
      this.temp.chuantime = new Date(this.temp.chuantime);
      this.temp.jinantime = new Date(this.temp.jinantime);
      this.dialogStatus = 'update';
      this.dialogFormVisible = true;
      this.openKeys.push(this.temp.areaname);
    },
    handleChangeState() {
      this.$confirm(' ' + this.temp.id + '调配到：' + this.temp.pdfPath, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const tempData = Object.assign({}, this.temp);
        console.log(tempData);
        tempData.chuantime = +new Date(tempData.chuantime);
        tempData.jinantime = +new Date(tempData.jinantime);
        updateWorker(tempData).then(response => {
          debugger;
          this.$message({
            type: 'success',
            message: '调配成功！'
          });
          this.dialogFormVisible = false
          this.getList()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消调配'
        })
      })
    },
    handleDownload() {
      this.downloadLoading = true;
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['timestamp', 'title', 'type', 'importance', 'status'];
        const filterVal = ['timestamp', 'title', 'type', 'importance', 'status'];
        const data = this.formatJson(filterVal);
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'table-list'
        });
        this.downloadLoading = false
      })
    },
    formatJson(filterVal) {
      return this.list.map(v => filterVal.map(j => {
        if (j === 'chuantime') {
          return parseTime(v[j])
        } else if (j === 'chuantime') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    },
    sendEmail() {
      const ids = [];
      if (this.multipleSelection.length !== 0) {
        for (var i = 0; i < this.multipleSelection.length; i++) {
          ids.push(this.multipleSelection[i].id)
        }
        sendEmail(ids).then(response => {
          console.log(response);
          if (response.code === 20101) {
            alert(response.message)
          }
        })
      } else {
        alert('请勾选邮件发送人员')
      }
    },
    getSortClass: function(key) {
      const sort = this.listQuery.sort;
      return sort === `+${key}` ? 'ascending' : 'descending'
    }
  }
}
</script>
<style >
  .el-tree-node:focus > .el-tree-node__content {
    background-color: #c26a3e !important;
  }
</style>
