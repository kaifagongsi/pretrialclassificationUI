<template>
  <div class="app-container">
    <el-button @click="taskdistribution">重跑库中所有相似案件匹配</el-button>
    <el-progress :percentage="percentage" :color="customColors"></el-progress>
    <el-button >上传文件对比</el-button>
  </div>
</template>

<script>
  import {matchAll, matchAllState} from '@/api/fuzzymactch.js'
  import {getUserInfoByLoginName} from '@/api/user.js'
  import Cookies from "js-cookie";

  export default {
    name: "fuzzyMatch",
    data() {
      return {
        percentage: 0,
        customColor: '#409eff',
        customColors: [
          {color: '#f56c6c', percentage: 20},
          {color: '#e6a23c', percentage: 40},
          {color: '#5cb87a', percentage: 60},
          {color: '#1989fa', percentage: 80},
          {color: '#6f7ad3', percentage: 100}
        ],
        shouldSearchState: false,
        timer: ''
      }
    },
    watch: {

    },
    methods: {
      async taskdistribution(){
        let flage = await this.getUserinfo()
        if(flage){
          matchAll().then((response) => {
            if(response.code == 20000){
              this.$message({
                  message: response.message,
                  type: 'success'
              })
              debugger
              this.startInter()
            }else{
              this.$message({
                message: response.message,
                type: 'error'
              })
              this.startInter()
            }
          })
        }else{
          this.$message({
            message: '暂无权限执行此操作',
            type: 'error'
          })
        }
      },
      startInter: function(){
        this.timer = setInterval(() => {
          matchAllState().then((resp) => {
            this.percentage = resp
            console.log(resp)
            debugger
            if(parseInt(resp) == 100){
              debugger
              clearInterval(this.timer)
              this.timer = null
            }
          })
        },5000)
      },
      
      getUserinfo: function(){
        return new Promise( (resolve, reject) =>{
          let loginname = Cookies.get('loginname')
          getUserInfoByLoginName(loginname).then(response => {
            if(response.success){
              if(response.queryResult.map.item.dep1 === '系统建设与运维部'){
                resolve(true)
              }else{
                resolve(false)
              }
            }else{
              resolve(false)
            }
          })
        })
      }
    }
  }
    

</script>

<style scoped>

</style>
