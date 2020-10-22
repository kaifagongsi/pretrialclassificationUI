<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select v-model="listQuery.dep1" placeholder="部门" clearable style="width: 150px" class="filter-item">
        <el-option v-for="item in dep1s" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
      <el-select v-model="listQuery.dep2" placeholder="处室" clearable class="filter-item" style="width: 130px">
        <el-option v-for="item in dep2s" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
      <el-select v-model="listQuery.isOnline" placeholder="是否在岗" clearable class="filter-item" style="width: 130px">
        <el-option  value="all" label="全部" >全部</el-option>
        <el-option  value="1" label="在岗" >在岗</el-option>
        <el-option  value="0"  label="不在岗">不在岗</el-option>
      </el-select>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleSearch">
        搜索
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        新增
      </el-button>
      <el-button class="filter-item" type="primary" icon="el-icon-refresh" style="float: right;" @click="changeDepartmentRotation">
        修改部门轮换
      </el-button>
      <el-select v-model="departmentRotation" placeholder="修改部门轮换" clearable class="filter-item" style="width: 130px;float: right">
        <el-option v-for="item in departmentRotations" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
    </div>
    <el-table v-loading="listLoading" :data="userList" border fit highlight-current-row style="width: 100%;">
      <el-table-column type="index" >
      </el-table-column>
      <el-table-column prop="loginname" label="用户名" width="180">
      </el-table-column>
      <el-table-column prop="name" label="姓名" width="180">
      </el-table-column>
      <el-table-column prop="dep1" label="部门">
      </el-table-column>
      <el-table-column prop="dep2" label="处室">
      </el-table-column>
      <el-table-column prop="type" label="权限">
      </el-table-column>
      <el-table-column label="Actions" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button  size="mini" type="danger" @click="handleDelete(row,$index)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="100px" style="width: 75%; margin-left:50px;">
        <el-row>
          <el-col :span="12">
            <el-form-item label="登录名称" prop="loginname"  >
              <el-input v-model="temp.loginname" placeholder="登录名称"/>
            </el-form-item>
          </el-col>
          <el-col :span="12" >
            <el-form-item label="姓名" prop="name"   >
              <el-input v-model="temp.name" placeholder="姓名"  />
            </el-form-item>
          </el-col>
          <el-col :span="12" >
            <el-form-item label="密码" prop="password"   >
              <el-input v-model="temp.password" placeholder="密码" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="部门">
              <el-select v-model="temp.dep1" class="filter-item" placeholder="请选择部门">
                <el-option v-for="item in dep1s" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="处室">
              <el-select  v-model="temp.dep2" class="filter-item" placeholder="请选择处室">
                <el-option v-for="item in dep2s" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="A角，B角">
              <el-select  v-model="temp.classlevel" class="filter-item" placeholder="角色">
                <el-option value="A" >A</el-option>
                <el-option value="B" >B</el-option>
                <el-option value="导师" >导师</el-option>
                <el-option value="专家" >专家</el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否在岗">
              <el-radio v-model="temp.isOnline" label="1" >在岗</el-radio>
              <el-radio v-model="temp.isOnline" label="2" >不在岗</el-radio>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="权限">
              <el-radio v-model="temp.type" label="admin" >管理员</el-radio>
              <el-radio v-model="temp.type" label="user" >用户</el-radio>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="个人邮箱" prop="email" >
              <el-input v-model="temp.email"  placeholder="邮箱" >
                <template slot="append">@cnipa.gov.cn</template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="领域" prop="areaname" >
              <el-input v-model="temp.areaname" placeholder="19计算机" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="ipcs" prop="ipcs">
              <el-input v-model="temp.ipcs" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="fields" prop="fields" >
              <el-input v-model="temp.fields" placeholder="计算机;计算机G07;计算机H03;机动A47G;计算机H04R;计算机G11" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          Cancel
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          Confirm
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import Pagination from '@/components/Pagination'
import waves from '@/directive/waves'
import { userList, createUserinfo, checkRepeatLoginName, getUserInfoByLoginName, deleteUserByLoginname, departmentRotation } from '@/api/user'
export default {
  components: { Pagination },
  directives: { waves },
  data() {
    var checkLoginName = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('登录账户不可为空'))
      }
      checkRepeatLoginName(value).then(response => {
        if (!response.queryResult.map.flag) {
          callback('登录账户已存在')
        } else {
          callback()
        }
      })
    }
    return {
      listLoading: false,
      total: 0,
      listQuery: {
        page: 1,
        limit: 10,
        dep1: undefined,
        dep2: undefined,
        isOnline: undefined
      },
      userList: undefined,
      departmentRotation: undefined,
      departmentRotations: [{
        value: 'FL',
        label: '分类审查部'
      }, {
        value: 'JG',
        label: '数据加工部'
      }],
      temp: {
        loginname: undefined,
        name: undefined,
        password: undefined,
        dep1: [],
        dep2: [],
        areaname: undefined,
        classlevel: undefined,
        email: undefined,
        type: undefined,
        ipcs: undefined,
        fields: undefined,
        last_time: undefined,
        last_ipc: undefined,
        isOnline: '1'
      },
      dialogStatus: '',
      dep1s: [{
        value: 'FL',
        label: '分类审查部'
      }, {
        value: 'JG',
        label: '数据加工部'
      }],
      dep2s: undefined,
      dialogFormVisible: false,
      textMap: {
        update: '编辑用户',
        create: '新增用户'
      },
      rules: {
        loginname: [{ required: true, trigger: 'blur', validator: checkLoginName }],
        name: [{ required: true, message: '姓名不能为空', trigger: 'blur' }],
        password: [{ required: true, message: '密码不能为空', trigger: 'blur' }],
        email: [{ required: true, message: '邮箱不能为空', trigger: 'blur' }],
        areaname: [{ required: true, message: '领域名称不能为空', trigger: 'blur' }],
        fields: [{ required: true, message: '领域不能为空', trigger: 'blur' }],
        ipcs: [{ required: true, message: 'ipcs不能为空', trigger: 'blur' }]
      },
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
      }, {
        value: '专家',
        label: '专家'
      }, {
        value: '导师',
        label: '导师'
      }]
    }
  },
  watch: {
    'temp.dep1': {
      handler(newValue, oldValue) {
        if (newValue === 'JG') {
          this.dep2s = this.dep2JG
        } else if (newValue === 'FL') {
          this.dep2s = this.dep2FL
        } else {
          this.dep2s = null
        }
      }
    },
    'listQuery.dep1': {
      handler(newValue, oldValue) {
        if (newValue === 'JG') {
          this.dep2s = this.dep2JG
        } else if (newValue === 'FL') {
          this.dep2s = this.dep2FL
        } else {
          this.dep2s = null
        }
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    handleSearch() {
      this.listQuery.page = 1
      this.getList()
    },
    getList() {
      this.listLoading = true
      userList(this.listQuery).then(response => {
        console.log(response)
        this.userList = response.queryResult.map.items
        this.total = response.queryResult.map.total
        this.listLoading = false
      })
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    resetTemp() {
      this.temp = {
        loginname: undefined,
        name: undefined,
        password: undefined,
        dep1: [],
        dep2: [],
        areaname: undefined,
        classlevel: 'A',
        email: undefined,
        type: 'user',
        ipcs: undefined,
        fields: undefined,
        last_time: undefined,
        last_ipc: undefined,
        isOnline: '1'
      }
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          createUserinfo(this.temp).then(() => {
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleUpdate(row) {
      // 1.获取当前用户的详细信息
      getUserInfoByLoginName(row.loginname).then(response => {
        // 2.设置到临时变量上
        this.temp = response.queryResult.map.item
      })
      // 3.dialog显示
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
        }
      })
    },
    handleDelete(row, index) {
      this.$confirm('此操作将永久删除用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteUserByLoginname(row.loginname).then(response => {
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
    changeDepartmentRotation() {
      if (this.departmentRotation === null || this.departmentRotation === '' || this.departmentRotation === undefined) {
        this.$message({
          message: '请选择轮转的部门',
          center: true,
          type: 'warning'
        })
      } else {
        alert('点击了部门轮换,准备修改为：' + this.departmentRotation)
        departmentRotation(this.departmentRotation).then(response => {
          if (response.success) {
            this.$message({
              message: '设置部门轮换成功，请稍候重新访问，时间大约10S左右。',
              center: true,
              type: 'warning'
            })
          } else {
            this.$message({
              message: '设置部门轮换失败，请稍候尝试',
              center: true,
              type: 'error'
            })
          }
        })
      }
    }
  }
}
</script>
<style>

</style>
