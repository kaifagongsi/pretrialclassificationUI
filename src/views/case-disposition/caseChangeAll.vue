<template>
    <div class="app-container">
      <div class="filter-container">
        <el-form ref="searchForm" class="el-form-col search-form" :model="search">
          <el-form-item>
            <el-row :gutter="20">
                <el-col :span="6">
                  <el-input v-model.trim="search.id" placeholder="预审案件编号" class="filter-item" @input="inputOnInput($event)"  />
                </el-col>
                <el-col :span="4">
                    <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" plain native-type="submit" @click.prevent="searchFunc(search)">
                        查询
                    </el-button>
                </el-col>
                <el-col :span="4">
                    <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" plain native-type="submit" @click.prevent="anJianChuAn">
                        执行出案流程
                    </el-button>
                </el-col>
                <el-col :span="10">
                    <span >在修改某个分类号后，请及时<strong>保存</strong>，并<strong>确认修改完毕以后</strong>，点击<span style="color:red">执行出案流程按钮</span></span>
                </el-col>
            </el-row>
          </el-form-item>
        </el-form>
      </div>
      <div v-if="showDetail">
          <el-form ref="dataForm" :model="temp" label-position="left" label-width="70px" style="margin-left:50px;">
            <el-col :span="8">
              <el-form-item label="案件编号" prop="id">
                <a
                  v-bind:href="'ftp://baohuUserT:123456@192.168.8.130/'+temp.id+'/'+temp.pdfPath"
                  target="_blank"
                  class="link-type"
                >{{ temp.id }}</a>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="发明名称" prop="mingcheng">
                <span>{{ temp.mingcheng }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="专利类型" prop="type">
                <span>{{ temp.type== 'FM' ? '发明' : '新型' }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="申请主体" prop="sqr">
                <span>{{ temp.sqr }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="申请号" prop="sqh">
                <span>{{ temp.sqh }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="粗分结果" prop="simpleclasscode">
                <span>{{ temp.simpleclasscode }}</span>
              </el-form-item>
            </el-col>
            <!-- <el-col :span="12">
              <el-form-item label="进案时间" prop="jinantime">
                <span>{{ temp.jinantime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
              </el-form-item>
            </el-col> -->
            <el-col :span="24">
              <el-form-item label="IPCI" prop="ipc">
                <span>{{ temp.ipci }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="CCI" prop="cci">
                <span>{{ temp.cci }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="CCA" prop="cca">
                <span>{{ temp.cca }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="CSETS" prop="csets">
                <span>{{ temp.csets }}</span>
              </el-form-item>
            </el-col>
          </el-form>
          <el-table
              :data="classInfoList"
              border
              fit
              highlight-current-row
              style="width: 100%;"
            >
              <!-- <el-table-column label="分类人员类型" align="center" width="120px">
                <template slot-scope="{row}">
                  <a target="_blank" class="buttonText">{{ row.classtype }}</a>
                </template>
              </el-table-column> -->
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
              <el-table-column label="IPCMI" width="200px" align="center">
                <template slot-scope="{row}">
                  <el-input :disabled="row.edit" v-model="row.ipcmi"></el-input>
                </template>
              </el-table-column>
              <el-table-column label="IPCOI" width="200px" align="center">
                <template slot-scope="{row}">
                    <el-input :disabled="row.edit" v-model="row.ipcoi" type="textarea"></el-input>
                </template>
              </el-table-column>
              <el-table-column label="IPCA" width="180px" align="center">
                <template slot-scope="{row}">
                    <el-input :disabled="row.edit" v-model="row.ipca" type="textarea"></el-input>
                </template>
              </el-table-column>
              <el-table-column label="CCI" width="180px" align="center">
                <template slot-scope="{row}">
                    <el-input :disabled="row.edit" v-model="row.cci" type="textarea"></el-input>
                </template>
              </el-table-column>
              <el-table-column label="CCA" width="160px" align="center">
                <template slot-scope="{row}">
                    <el-input :disabled="row.edit" v-model="row.cca" type="textarea"></el-input>
                </template>
              </el-table-column>
              <el-table-column label="C-Sets" width="160px" align="center">
                <template slot-scope="{row}">
                    <el-input :disabled="row.edit" v-model="row.csets" type="textarea"></el-input>
                </template>
              </el-table-column>
              <el-table-column label="操作" align="center" width="140">
                     <template slot-scope="scope">
                        <el-button v-if="scope.row.edit" type="text" size="small" @click.native.prevent="handleEdit(scope.$index, scope.row)">编辑</el-button>
                        <el-button v-if="!scope.row.edit" type="text" size="small" @click.native.prevent="handleUpdate(scope.row)">保存</el-button>
                        <el-button v-if="!scope.row.edit" type="text" size="small" @click.native.prevent="handleCancel(scope.row)">取消</el-button>
                        <el-button v-if="scope.row.edit" type="text" size="small" @click.native.prevent="handleDelete(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
      </div>
    </div>
  </template>
  
  <script>
  import { searchByCondition } from '@/api/case-classification'
  import waves from '@/directive/waves' // waves directive
  import { checkIpcServer, checkIpcCsetsServer } from '@/api/case-arbiter'
  import { changOneResult, deleteOne, caseFinishAllByAdmin } from '@/api/case-disposition'

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
        list: null,
        total: 0,
        classInfoList: null,
        listLoading: true,
        showDetail: false,
        search: {
          id: ''
        },
        calendarTypeOptions,
        temp: {
        }
      }
    },
    methods: {
        searchFunc(search) {
            if (this.search.id === '' ) {
                alert('查询条件不可为空！')
            } else {
                searchByCondition(this.search).then(response => {
                  if(response.not_rule){
                    alert('当前账号暂无权限')
                  }else{
                    if (response.case === null) {
                        this.showDetail = false
                        alert('无匹配结果，请重新搜索')
                    } else {
                        this.temp = response.case
                        this.classInfoList = response.singleInfo
                        this.showDetail = true
                    }
                  }
                })
            }
        },
        // 解决input嵌套过深的问题
        inputOnInput: function(e) {
            this.$forceUpdate();
            this.showDetail = false
        },
        // 编辑
        handleEdit(index, row) {
            for (const i of this.classInfoList) {
                if (i.setSet) return this.$message.warning('请先保存当前编辑项')
            }
            row.edit = !true
            row.setSet = true
         },
        // 取消
        handleCancel(row) {
            row.edit = false
            row.setSet = false
            this.searchFunc(this.search)
        },
        // 保存
        // value验证
        async validBytype(row) {
            debugger
            let valid = true
            this.loadlFuncationRplaceSpaceForTemp(row)
            let model = {
                'ipcmi':row.ipcmi,
                'ipcoi':row.ipcoi,
                'ipca':row.ipca,
                'cci':row.cci,
                'cca':row.cca,
                'csets':row.csets,
            }
            valid =  await this.checkIpc(row.ipcmi,row,'ipcmi',model);
            if(valid){
                valid = await this.checkIpc(row.ipcoi,row,'ipcoi',model);
                if(!valid){
                    this.$message({
                        type: 'error',
                        message: 'ipcoi，分类号校验不通过'
                    })
                }
            }
            if(valid){
                valid = await this.checkIpc(row.ipca,row,'ipca',model);
                if(!valid){
                    this.$message({
                        type: 'error',
                        message: 'ipca，分类号校验不通过'
                    })
                }
            }
            if(valid){
                valid = await this.checkCpc(row.cci,row,'cci',model);
                if(!valid){
                    this.$message({
                        type: 'error',
                        message: 'cci，分类号校验不通过'
                    })
                }
            }
            if(valid){
                valid = await this.checkCpc(row.cca,row,'cca',model);
                if(!valid){
                    this.$message({
                        type: 'error',
                        message: 'cca，分类号校验不通过'
                    })
                }
            }
            if(valid){
                valid = await this.checkCsets(row.csets,row,'csets',model);
                if(!valid){
                    this.$message({
                        type: 'error',
                        message: 'csets，分类号校验不通过'
                    })
                }
            }
            return valid
        },
        checkIpc(value,row,field,model) {
            return new Promise((resolve, reject) => {
                if (value == null || value === '') {
                    resolve(true)
                } else {
                    if (field === 'ipcmi') {
                        if (value.indexOf(',') !== -1 || value.indexOf('，') !== -1 || value.indexOf('；') !== -1 || value.indexOf(';') !== -1 || value.indexOf('、') !== -1) {
                            resolve(false)
                        }
                    }
                    checkIpcServer(model, field).then((response) => {
                        if (response.success) {
                            if (field === 'ipcoi') {
                                if (response.queryResult.map.newClassification === '') {
                                    value = null
                                } else {
                                    row.ipcoi = response.queryResult.map.newClassification
                                }
                            } else if (field === 'ipca') {
                                if (response.queryResult.map.newClassification === '') {
                                    value = null
                                } else {
                                    row.ipca = response.queryResult.map.newClassification
                                }
                            } else if (field === 'ipcmi') {
                                if (response.queryResult.map.newClassification === '') {
                                    value = null
                                } else {
                                    row.ipcmi = response.queryResult.map.newClassification
                                }
                            }
                            resolve(true)
                        } else {
                            resolve(false)
                        }
                    })
                }
            })
            
        },
        checkCpc (value,row,field,model) {
            return new Promise((resolve, reject) => {
                if (value == null || value === '') {
                    resolve(true)
                } else {
                    checkIpcServer(model, field).then((response) => {
                        if (response.success) {
                            if (field === 'cci') {
                                if (response.queryResult.map.newClassification === '') {
                                    row.cci = null
                                } else {
                                    row.cci = response.queryResult.map.newClassification
                                }
                            } else if (field === 'cca') {
                                if (response.queryResult.map.newClassification === '') {
                                    row.cca = null
                                } else {
                                    row.cca = response.queryResult.map.newClassification
                                }
                            }
                            resolve(true)
                        } else {
                            resolve(response.message)
                        }
                    })
                }
            })
            
        },
        checkCsets (value,row,field,model) {
            return new Promise((resolve, reject) => {
                if (value == null || value === '') {
                    resolve(true)
                } else {
                    model.csets = value.toUpperCase()
                    checkIpcCsetsServer(model).then((response) => {
                        if (response.success) {
                            row.csets = response.queryResult.map.newClassification
                            resolve(true)
                        } else {
                            resolve(response.message)
                        }
                    })
                }
            })
        },
        loadlFuncationRplaceSpaceForTemp(row) {
            if (row.ipcmi != null) {
                row.ipcmi = row.ipcmi.replace(/\s+/g, '')
            }
            if (row.ipcoi != null) {
                row.ipcoi = row.ipcoi.replace(/\s+/g, '')
            }
            if (row.ipca != null) {
                row.ipca = row.ipca.replace(/\s+/g, '')
            }
            if (row.cci != null) {
                row.cci = row.cci.replace(/\s+/g, '')
            }
            if (row.cca != null) {
                row.cca = row.cca.replace(/\s+/g, '')
            }
            if (row.cset != null) {
                row.csets = row.csets.replace(/\s+/g, '')
            }
        },
        //更新
        async handleUpdate(row) {
            if ( await this.validBytype(row)) {
                changOneResult(row).then(response => {
                    if(response.success){
                        row.setSet = false
                        row.edit = !false
                        console.log(row)
                        this.$message({
                            type: 'success',
                            message: '保存成功'
                        })
                    }
                })
            }else{
              this.$message({
                  type: 'error',
                  message: '分类号校验不通过'
              })
            }
        },
        // 删除
        handleDelete(index, row) {
            for (const i of this.classInfoList) {
                if (i.setSet) return this.$message.warning('请先保存当前编辑项')
            }
            this.$confirm('此操作将永久删除该行, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
                center: true
            }).then(() => {
                // deleteConfig(row.id)
                // this.classInfoList.splice(index, 1)
                // this.$message({
                //     type: 'success',
                //     message: '删除成功!'
                // })
                deleteOne(row).then(response =>{
                  if(response.success){
                    this.classInfoList.splice(index, 1)
                    this.$message({
                      type: 'success',
                      message: '删除成功!'
                    })
                  }
                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                })
            })
        },
        anJianChuAn(){
          for (const i of this.classInfoList) {
                if (i.setSet) return this.$message.warning('请先保存当前编辑项')
          }
          console.log(this.classInfoList)
          caseFinishAllByAdmin(this.classInfoList).then(response =>{
            console.log(response)
            if(response.success){
              this.$message({
                    type: 'info',
                    message: response.message
              })
              this.searchFunc(this.search)
            }
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
  