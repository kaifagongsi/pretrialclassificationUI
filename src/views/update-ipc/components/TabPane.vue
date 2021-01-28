<template>
  <div>
    <el-table :data="list"   style="width: 100%">
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="旧ipcmi">
              <span>{{ props.row.oldIpcmi }}</span>
            </el-form-item>
            <el-form-item label="新ipmi">
              <span>{{ props.row.ipcmi }}</span>
            </el-form-item>
            <el-form-item label="旧ipcoi">
              <span>{{ props.row.oldIpcoi }}</span>
            </el-form-item>
            <el-form-item label="新ipcoi">
              <span>{{ props.row.ipcoi }}</span>
            </el-form-item>
            <el-form-item label="旧ipca">
              <span>{{ props.row.oldIpca }}</span>
            </el-form-item>
            <el-form-item label="新ipca">
              <span>{{ props.row.ipca }}</span>
            </el-form-item>
            <el-form-item label="旧cci">
              <span>{{ props.row.oldCci }}</span>
            </el-form-item>
            <el-form-item label="新cci">
              <span>{{ props.row.cci }}</span>
            </el-form-item>
            <el-form-item label="旧cca">
              <span>{{ props.row.oldCca }}</span>
            </el-form-item>
            <el-form-item label="新cca">
              <span>{{ props.row.cca }}</span>
            </el-form-item>
            <el-form-item label="旧cset">
              <span>{{ props.row.oldCsets }}</span>
            </el-form-item>
            <el-form-item label="新csets">
              <span>{{ props.row.csets }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column label="案件编号" prop="id">
        <template slot-scope="{row}">
          <span>
             <a
               v-bind:href="'ftp://baohuUserT:123456@192.168.8.130/'+row.id+'/'+row.pdfPath"
               target="_blank"
               class="buttonText"
             >{{row.id}}</a>
          </span>
        </template>
      </el-table-column>
      <el-table-column
        label="提交人"
        prop="worker">
      </el-table-column>
      <el-table-column label="提交时间" prop="uploadtime">
        <template slot-scope="{row}">
          <span>{{ row.uploadtime | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" width="200" v-if="type=='0' " class-name="small-padding fixed-width" >
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="handleClickType(scope.row.id,'1',scope.row.worker)">
            通过
          </el-button>
          <el-button type="danger" size="small" @click="handleClickType(scope.row.id,'2',scope.row.worker)">
            驳回
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>

import { selectInitList, updateIpcState } from '@/api/updateIpc'

export default {
  // 接受父组件传递的参数 type为父组件传递的名称
  props: {
    type: {
      type: String,
      default: '0'
    }
  },
  data() {
    return {
      list: null,

      loading: false
    }
  },
  created() {
    this.getList()
  },
  watch:{
    $route: {
      // 深度观察监听
      deep: true
    }
  },
  methods: {
    getList() {
      this.loading = true
      // this.$emit('create') // 此处可能是向父组件传递参数
      selectInitList(this.type).then(response => {
        debugger
        console.log(response)
        if (response.success) {
          this.list = response.queryResult.list
        } else {
          this.list = null
        }
        this.loading = false
      })
    },
    handleClickType(id, type,worker) {
      console.log(id, type,worker)
      updateIpcState(id, type,worker).then(response => {
        debugger
        if (response.code === 20000) {
          this.$message({
            message: '操作成功',
            type: 'success'
          })
          this.getList()
        } else {
          this.$message({
            message: response.message,
            type: 'error'
          })
        }
      })
    }
  }
}
</script>
<style>
  .demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
</style>

