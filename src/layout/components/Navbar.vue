<template>
  <div class="navbar">
    <hamburger id="hamburger-container" :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />

    <breadcrumb id="breadcrumb-container" class="breadcrumb-container" />

    <div class="right-menu">
      <el-dropdown class="avatar-container right-menu-item hover-effect" trigger="click">
        <div class="avatar-wrapper">
          <img src="./profilePicture.gif" class="user-avatar">
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item divided @click.native="resetPassword">
            <span style="display:block;">修改密码</span>
          </el-dropdown-item>
          <el-dropdown-item divided @click.native="logout">
            <span style="display:block;">退出</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>

    <el-dialog title="修改密码" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp">
        <el-form-item label="登录名" prop="loginname">
          <el-input v-model="temp.loginname" placeholder="登录名称" :disabled="true"/>
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="temp.name" placeholder="姓名" :disabled="true"/>
        </el-form-item>
        <el-form-item label="新密码" prop="password" >
          <el-input v-model="temp.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="再次确认密码" prop="repassword">
          <el-input v-model="temp.repassword" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="updatepassword">确 定</el-button>
      </div>
    </el-dialog>

  </div>

</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import ErrorLog from '@/components/ErrorLog'
import Screenfull from '@/components/Screenfull'
import SizeSelect from '@/components/SizeSelect'
import Search from '@/components/HeaderSearch'
import {checkRepeatLoginName, checkUserInfoEmail, getInfo, getUserInfoByLoginName,updateUserInfo,changePssword} from "@/api/user";
import Cookies from "js-cookie";

export default {
  components: {
    Breadcrumb,
    Hamburger,
    ErrorLog,
    Screenfull,
    SizeSelect,
    Search
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar',
      'device'
    ])
  },
  data() {
    var checkPassWord = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('密码不可为空'))
      }
      var passwordreg = /(?=.*\d)(?=.*[a-zA-Z])(?=.*[^a-zA-Z0-9]).{8,12}/
      var isValid = passwordreg.test(value);
      if(isValid != true){
        callback(new Error("密码必须是大小写字母，数字，特殊字符组成，且长度为8到12位"))
        return;
      } else {
        callback()
      }
    }
    var checkrePassWord = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请再次输入密码'))
      } else
      if (value !== this.temp.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      temp: {
        loginname: undefined,
        name: undefined,
        password: undefined,
        repassword: undefined
      },
      dialogStatus: '',
      dialogFormVisible: false,
      userOldPassword: '',
      rules: {
        loginname: [{ required: true, trigger: 'blur',}],
        name: [{ required: true, message: '姓名不能为空', trigger: 'blur' }],
        password: [{ required: true, validator: checkPassWord, trigger: 'blur', }],
        repassword: [{ required: true, validator: checkrePassWord, trigger: 'blur', }]
      }
    }
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      debugger
      //this.$router.push(`/login?redirect=${this.$route.fullPath}`)
      this.$router.push(`/login`)
    },
    updatepassword() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          changePssword(this.userOldPassword,this.temp.repassword,this.temp.loginname).then( response =>{
            if ( response.success){
              this.dialogFormVisible = false
              //this.getList()
              this.$notify({
                title: '成功',
                message: '修改成功',
                type: 'success',
                duration: 2000
              })
            } else {
              this.$notify.error({
                title: '失败',
                message: response.message
              })
            }
          })
        }
      })
    },
    resetPassword() {
      // 1.获取当前用户的详细信息
      var a = Cookies.get('loginname')
      getUserInfoByLoginName(a).then(response => {
        // 2.设置到临时变量上
        this.temp = response.queryResult.map.item
        this.userOldPassword = response.queryResult.map.item.password
        //})

        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
