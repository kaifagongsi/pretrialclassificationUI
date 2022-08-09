<template>
  <div class="app-container">
    <el-button @click="taskdistribution">重跑库中所有相似案件匹配</el-button>
    <el-progress :percentage="percentage" :color="customColors"></el-progress>
     <el-upload
        accept=".xls,.xlsx,csv"
        class="upload-demo"
        action="uploadFile"
        :show-file-list="showFileList"
        :before-upload="beforeAvatarUpload"
        :file-list="fileList"
        :http-request="uploadFile"
        >
        <el-button   type="primary">点击上传</el-button>
        <div slot="tip" class="el-upload__tip">只能上传xls/xlsx文件</div>
     </el-upload>
  </div>
</template>

<script>
  import {matchAll, matchAllState, uploadFileApi} from '@/api/fuzzymactch.js'
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
        timer: '',
        // fileUrl: process.env.VUE_APP_BASE_API+'/fuzzymactch/uploadFile', //上传文件的域名地址
				fileList: [], //文件列表
				showFileList: true //文件列表是否显示,默认不显示
        
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
      },
      //文件上传之前的钩子,可以做一些验证或限制
      beforeAvatarUpload(file){
        const regExp = file.name.replace(/.+\./, '');
				const lower = regExp.toLowerCase(); //把大写字符串全部转为小写字符串
				const suffix = ['xls', 'xlsx'];
        const isExcel =  suffix.indexOf(lower) !== -1
        if (!isExcel) {
            this.$message.error('请上传后缀名为 xls、xlsx 的格式!');
        }
        const isLt2M = file.size / 1024 / 1024 < 50;
        if (!isLt2M) {
          this.$message.error('文件大小不可超过 50MB!');
        }
        return isExcel && isLt2M;
      },
      uploadFile(param){
        const loading = this.$loading({
          lock: true,
          text: '处理中，请稍后',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        const {file} = param;
        var formData = new FormData();
         formData.append("file", file); 
         uploadFileApi(formData).then(res => {
          let blob = new Blob([res],{type: "application/vnd.ms-excel",});
          let fileName = param.file.name;
          fileName = fileName.substring(0, fileName.lastIndexOf(".")) + "_匹配后文件.xlsx"
          let link = document.createElement("a");
          let href = window.URL.createObjectURL(blob);
          link.href = href;
          link.download = fileName;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(href); //释放该URL
          loading.close();
        })
      }
    }
  }
    

</script>

<style scoped>
 
</style>
