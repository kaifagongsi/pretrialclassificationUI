<template>
  <div :class="classObj" class="app-wrapper">
    <div v-if="device==='mobile'&&sidebar.opened" class="drawer-bg" @click="handleClickOutside" />
    <sidebar class="sidebar-container" />
    <div :class="{hasTagsView:needTagsView}" class="main-container">
      <div :class="{'fixed-header':fixedHeader}">
        <navbar />
        <tags-view v-if="needTagsView" />
      </div>
      <app-main />
      <!--<right-panel v-if="showSettings">
        <settings />
      </right-panel>-->
    </div>
  </div>
</template>

<script>

import { AppMain, Navbar, Sidebar, TagsView } from './components'
import ResizeMixin from './mixin/ResizeHandler'
import { mapState } from 'vuex'
import { getToken, removeToken, getHeader } from '@/utils/auth'
export default {
  name: 'Layout',
  components: {
    AppMain,
    Navbar,
    Sidebar,
    TagsView
  },
  mixins: [ResizeMixin],
  computed: {
    ...mapState({
      sidebar: state => state.app.sidebar,
      device: state => state.app.device,
      showSettings: state => state.settings.showSettings,
      needTagsView: state => state.settings.tagsView,
      fixedHeader: state => state.settings.fixedHeader
    }),
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === 'mobile'
      }
    }
  },
  mounted() {
    window.addEventListener('beforeunload', e => this.beforeunloadHandler(e))
    window.addEventListener('unload', e => this.unloadHandler(e))
  },
  destroyed() {
    window.removeEventListener('beforeunload', e => this.beforeunloadHandler(e))
    window.removeEventListener('unload', e => this.unloadHandler(e))
  },
  methods: {
    handleClickOutside() {
      this.$store.dispatch('app/closeSideBar', { withoutAnimation: false })
    },
    beforeunloadHandler(){
      this._beforeUnload_time=new Date().getTime();
    },
     unloadHandler(e){


      this._gap_time=new Date().getTime()-this._beforeUnload_time;
      debugger
      //判断是窗口关闭还是刷新
      if(this._gap_time<=5) {
        //如果是登录状态，关闭窗口前，移除用户
        /*if(!this.showLoginButton){

        }*/
        console.log("----------------------------------------")
        console.log( process.env.VUE_APP_BASE_API + '/auth/logout')
        /*$.ajax({
          url: process.env.VUE_APP_BASE_API + '/auth/logout',
          type: 'post',
          async: false, //或false,是否异步
          beforeSend:function(){
            commit('SET_TOKEN', '')
            commit('SET_ROLES', [])
            removeToken()
            resetRouter()
            dispatch('tagsView/delAllViews', null, {root: true})
            resolve()
          },
          success:function(dt){
            console.log("success-----------------------")
            //  console.log(dt)
          },

          error:function(dt){
            console.log("error-----------------------")
          }
        })*/
        console.log(getToken())
        // 重要提示：此处的的请求一定是要同步的，axios在此处不可用，已经踩过坑了。直接使用原生js发请求。
        // 根据你的实际情况写请求地址，为了防止跨域此处使用了拼串，请你根据你的情况自定义。
        let url = process.env.VUE_APP_BASE_API + '/auth/logout';
        // 新建一个请求。
        var xhr = new XMLHttpRequest();
        // 参数1：请求方式，参数2：请求地址，参数3：false代表同步，true代表异步，一定要写false同步
        xhr.open("post", url, true);
        xhr.setRequestHeader("Authorization", getToken())
        // 请求发送的数据，数据太多可以放在变量中。请你根据你的情况自定义
        xhr.send();
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        removeToken()
        resetRouter()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "~@/styles/mixin.scss";
  @import "~@/styles/variables.scss";

  .app-wrapper {
    @include clearfix;
    position: relative;
    height: 100%;
    width: 100%;

    &.mobile.openSidebar {
      position: fixed;
      top: 0;
    }
  }

  .drawer-bg {
    background: #000;
    opacity: 0.3;
    width: 100%;
    top: 0;
    height: 100%;
    position: absolute;
    z-index: 999;
  }

  .fixed-header {
    position: fixed;
    top: 0;
    right: 0;
    z-index: 9;
    width: calc(100% - #{$sideBarWidth});
    transition: width 0.28s;
  }

  .hideSidebar .fixed-header {
    width: calc(100% - 54px)
  }

  .mobile .fixed-header {
    width: 100%;
  }
</style>
