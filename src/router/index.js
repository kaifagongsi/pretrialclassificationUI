import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/* Router Modules */
import componentsRouter from './modules/components'
import chartsRouter from './modules/charts'
import tableRouter from './modules/table'
import nestedRouter from './modules/nested'

import axios from 'axios';

Vue.prototype.$axios = axios;
/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  }/*,
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/auth-redirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        meta: { title: 'Dashboard', icon: 'dashboard', affix: true }
      }
    ]
  },
  {
    path: '/documentation',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/documentation/index'),
        name: 'Documentation',
        meta: { title: 'Documentation', icon: 'documentation', affix: true }
      }
    ]
  },
  {
    path: '/guide',
    component: Layout,
    redirect: '/guide/index',
    children: [
      {
        path: 'index',
        component: () => import('@/views/guide/index'),
        name: 'Guide',
        meta: { title: 'Guide', icon: 'guide', noCache: true }
      }
    ]
  },
  {
    path: '/profile',
    component: Layout,
    redirect: '/profile/index',
    hidden: true,
    children: [
      {
        path: 'index',
        component: () => import('@/views/profile/index'),
        name: 'Profile',
        meta: { title: 'Profile', icon: 'user', noCache: true }
      }
    ]
  }*/
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        meta: { title: 'Dashboard', icon: 'dashboard', affix: true }
      }
    ]
  },
 {
    path: '/case-query',
    component: Layout,
    alwaysShow: true, // will always show the root menu
    name: '案件检索',
    meta: {
      title: '案件检索',
      icon: 'search',
      roles: ['admin','arbiter'] // you can set roles in root nav
    },
    redirect: '/caseQuery',
    children: [
      {
        path: 'caseQuery',
        component: () => import('@/views/case-query/caseQuery'),
        name: '案件检索',
        meta: {
          title: '案件检索',
          roles: ['admin','arbiter'] // or you can only set roles in sub nav
        }
      }
    ]
  },
  {
    path: '/anjianfenlei',
    component: Layout,
    alwaysShow: true, // will always show the root menu
    name: '案件分类',
    meta: {
      title: '案件分类',
      icon: 'guide',
      //roles: ['user'] // you can set roles in root nav
    },
    redirect: '/caseClassification',
    children: [
      {
        path: 'caseClassification',
        component: () => import('@/views/case-classification/caseClassification'),
        name: '案件分类',
        meta: {
          title: '案件分类',
          //roles: ['admin'] // or you can only set roles in sub nav
        }
      },
      {
        path: 'caseSearch',
        component: () => import('@/views/case-classification/caseSearch'),
        name: '案件查询',
        meta: {
          title: '案件查询',
          //roles: ['admin'] // or you can only set roles in sub nav
        }
      },
      {
        path: 'caseTransfer',
        component: () => import('@/views/case-classification/caseTransfer'),
        name: '转案',
        hidden: true,
        meta: {
          title: '转案',
          //roles: ['admin'] // or you can only set roles in sub nav
        }
      }
    ]
  },
  {
    path: '/case-disposition',
    component: Layout,
    alwaysShow: true, // will always show the root menu
    name: '案件处理',
    meta: {
      title: '案件处理',
      icon: 'lock',
      roles: ['admin','arbiter'] // you can set roles in root nav
    },
    redirect: '/caseAllocation',
    children: [
      {
        path: 'caseAllocation',
        component: () => import('@/views/case-disposition/caseAllocation'),
        name: '案件调配',
        meta: {
          title: '案件调配',
          roles: ['admin','arbiter'] // or you can only set roles in sub nav
        }
      },
      {
        path: 'caseChangeAll',
        component: () => import('@/views/case-disposition/caseChangeAll'),
        name: '修改案件分类号',
        meta: {
          title: '修改案件分类号',
          roles: ['admin','arbiter'] // or you can only set roles in sub nav
        }
      }
    ]
  },
  {
    path: '/case-statistics',
    component: Layout,
    alwaysShow: true, // will always show the root menu
    name: '案件统计',
    meta: {
      title: '案件统计',
      icon: 'list',
      roles: ['admin'] // you can set roles in root nav
    },
    redirect: '/case-statistics/caseIn',
    children: [
      {
        path: 'caseOutWithOrg',
        component: () => import('@/views/case-statistics/caseOutWithOrg'),
        name: '各中心出案统计',
        meta: {
          title: '各中心出案统计',
          roles: ['admin'] // or you can only set roles in sub nav
        }
      },
      {
        path: 'caseOut',
        component: () => import('@/views/case-statistics/caseOut'),
        name: '出案统计',
        meta: {
          title: '出案统计',
          roles: ['admin'] // or you can only set roles in sub nav
        }
      },
      {
        path: 'caseAccountWork',
        component: () => import('@/views/case-statistics/caseAccountWork'),
        name: '出案工作量统计',
        meta: {
          title: '出案工作量统计',
          roles: ['admin'] // or you can only set roles in sub nav
        }
      }
    ]
  },
  /*{
    path: '/caseHandle',
    component: Layout,
    alwaysShow: true,
    name: '案件入库',
    meta: {
      title: '案件入库',
      icon: 'guide',
      roles: ['admin']
    },
    children: [
      {
        path: 'caseInput',
        component: () => import('@/views/caseHandle/caseInput'),
        name: '案件入库',
        meta: {
          title: '案件入库',
          roles: ['admin'] // or you can only set roles in sub nav
        }
      },
      {
        path: 'caseDistribute',
        component: () => import('@/views/caseHandle/caseDistribute'),
        name: '案件分配',
        meta: {
          title: '案件分配',
          roles: ['admin']
        }
      }
    ]
  },*/
  {
    path: '/userManager',
    component: Layout,
    redirect: '/userManager/userlist',
    alwaysShow: true,
    name: '人员管理',
    meta: {
      title: '人员管理',
      icon: 'user',
      roles: ['admin']
    },
    children: [
      {
        path: 'userlist',
        component: () => import('@/views/personnel-management/index'),
        name: '人员列表',
        meta: {
          title: '人员列表',
          roles: ['admin']
        }
      }/*,
      {
        path: 'postList',
        component: () => import('@/views/personnel-management/postIndex'),
        name: '岗位列表',
        meta: {
          title: '岗位列表',
          roles: ['admin']
        }
      }*/
    ]
  },
  {
    path: '/arbiter',
    component: Layout,
    alwaysShow: true,
    name: '裁决',
    meta: {
      title: '裁决',
      icon: 'arbiter',
      roles: ['admin','arbiter','user']
    },
    children: [
      {
        path: 'pageUser' ,
        component: () => import('@/views/arbiter/arbiterUser'),
        name: '需查看的裁决列表',
        meta: {
          title: '需查看的裁决列表',
          roles: ['admin','arbiter','user'] // or you can only set roles in sub nav
        }
      },
      {
        path: 'page',
        component: () => import('@/views/arbiter/arbiter'),
        name: '裁决列表',
        meta: {
          title: '裁决列表',
          roles: ['admin','arbiter'] // or you can only set roles in sub nav
        }
      }/*,
      {
        path: 'finishPage',
        component: () => import('@/views/arbiter/finishArbiter'),
        name: '裁决完成列表',
        meta: {
          title: '裁决完成列表',
          roles: ['admin','arviter'] // or you can only set roles in sub nav
        }
      }*/
    ]
  },
  {
    path: '/updateIpc',
    component: Layout,
    alwaysShow: true, // will always show the root menu
    name: '分类号更正',
    meta: {
      title: '分类号更正',
      icon: 'updateIpc',
      roles: ['admin','arbiter'] // you can set roles in root nav
    },
    children: [
      {
        path: 'page',
        component: () => import('@/views/update-ipc/updateIpc'),
        name: '分类号更正列表',
        meta: {
          title: '分类号更正列表',
          roles: ['admin','arbiter'] // or you can only set roles in sub nav
        }
      }
    ]
  },
  {
    path: '/searchlike',
    component: Layout,
    alwaysShow: true,
    name: 'fuzzyMatch',
    meta: { 
      title: '相似案件匹配', 
      icon: 'searchlike' ,
      roles: ['admin']
    },
    children: [
      {
        path: 'index',
        component: () => import('@/views/fuzzy-match/fuzzyMatch'),
        name: '相似案件匹配',
        meta: { title: '相似案件匹配' }
      }
    ]
  },
  /*{
    path: '/zip',
    component: Layout,
    redirect: '/zip/download',
    alwaysShow: true,
    name: 'Zip',
    meta: { title: 'Zip', icon: 'zip' },
    children: [
      {
        path: 'download',
        component: () => import('@/views/zip/index'),
        name: 'ExportZip',
        meta: { title: 'Export Zip' }
      }
    ]
  },
  */
  /*{
    path: '/tab',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/tab/index'),
        name: 'Tab',
        meta: { title: 'Tab', icon: 'tab' }
      }
    ]
  },*/
  /*{
    path: '/permission',
    component: Layout,
    redirect: '/permission/page',
    alwaysShow: true, // will always show the root menu
    name: 'Permission',
    meta: {
      title: 'Permission',
      icon: 'lock',
      roles: ['admin', 'editor'] // you can set roles in root nav
    },
    children: [
      {
        path: 'page',
        component: () => import('@/views/permission/page'),
        name: 'PagePermission',
        meta: {
          title: 'Page Permission',
          roles: ['admin'] // or you can only set roles in sub nav
        }
      },
      {
        path: 'directive',
        component: () => import('@/views/permission/directive'),
        name: 'DirectivePermission',
        meta: {
          title: 'Directive Permission'
          // if do not set roles, means: this page does not require permission
        }
      },
      {
        path: 'role',
        component: () => import('@/views/permission/role'),
        name: 'RolePermission',
        meta: {
          title: 'Role Permission',
          roles: ['admin']
        }
      }
    ]
  },

  {
    path: '/icon',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/icons/index'),
        name: 'Icons',
        meta: { title: 'Icons', icon: 'icon', noCache: true }
      }
    ]
  },
  /!** 树形组件 **!/
  {
    path: '/treeMen22',
    component: Layout,
    children: [
      {
        path: 'treeMen111',
        component: () => import('@/views/tree/treeMen'),
        name: 'treeMen-demo',
        meta: { title: 'treeMen333', icon: 'treeMean', noCache: true }
      }
    ]
  },
  /!**  测试list  **!/
  {
    path: '/testList1111',
    component: Layout,
    children: [
      {
        path: 'testList2222',
        component: () => import('@/views/testList/complex-table'),
        name: 'testList',
        meta: { title: 'testList333', icon: 'treeMean', noCache: true }
      }
    ]
  },
  /!** when your routing map is too long, you can split it into small modules **!/
  componentsRouter,
  chartsRouter,
  nestedRouter,
  tableRouter,

  {
    path: '/example',
    component: Layout,
    redirect: '/example/list',
    name: 'Example',
    meta: {
      title: 'Example',
      icon: 'example'
    },
    children: [
      {
        path: 'create',
        component: () => import('@/views/example/create'),
        name: 'CreateArticle',
        meta: { title: 'Create Article', icon: 'edit' }
      },
      {
        path: 'edit/:id(\\d+)',
        component: () => import('@/views/example/edit'),
        name: 'EditArticle',
        meta: { title: 'Edit Article', noCache: true, activeMenu: '/example/list' },
        hidden: true
      },
      {
        path: 'list',
        component: () => import('@/views/example/list'),
        name: 'ArticleList',
        meta: { title: 'Article List', icon: 'list' }
      }
    ]
  },

  {
    path: '/tab',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/tab/index'),
        name: 'Tab',
        meta: { title: 'Tab', icon: 'tab' }
      }
    ]
  },

  {
    path: '/error',
    component: Layout,
    redirect: 'noRedirect',
    name: 'ErrorPages',
    meta: {
      title: 'Error Pages',
      icon: '404'
    },
    children: [
      {
        path: '401',
        component: () => import('@/views/error-page/401'),
        name: 'Page401',
        meta: { title: '401', noCache: true }
      },
      {
        path: '404',
        component: () => import('@/views/error-page/404'),
        name: 'Page404',
        meta: { title: '404', noCache: true }
      }
    ]
  },

  {
    path: '/error-log',
    component: Layout,
    children: [
      {
        path: 'log',
        component: () => import('@/views/error-log/index'),
        name: 'ErrorLog',
        meta: { title: 'Error Log', icon: 'bug' }
      }
    ]
  },

  {
    path: '/excel',
    component: Layout,
    redirect: '/excel/export-excel',
    name: 'Excel',
    meta: {
      title: 'Excel',
      icon: 'excel'
    },
    children: [
      {
        path: 'export-excel',
        component: () => import('@/views/excel/export-excel'),
        name: 'ExportExcel',
        meta: { title: 'Export Excel' }
      },
      {
        path: 'export-selected-excel',
        component: () => import('@/views/excel/select-excel'),
        name: 'SelectExcel',
        meta: { title: 'Export Selected' }
      },
      {
        path: 'export-merge-header',
        component: () => import('@/views/excel/merge-header'),
        name: 'MergeHeader',
        meta: { title: 'Merge Header' }
      },
      {
        path: 'upload-excel',
        component: () => import('@/views/excel/upload-excel'),
        name: 'UploadExcel',
        meta: { title: 'Upload Excel' }
      }
    ]
  },

  ,

  {
    path: '/pdf',
    component: Layout,
    redirect: '/pdf/index',
    children: [
      {
        path: 'index',
        component: () => import('@/views/pdf/index'),
        name: 'PDF',
        meta: { title: 'PDF', icon: 'pdf' }
      }
    ]
  },
  {
    path: '/pdf/download',
    component: () => import('@/views/pdf/download'),
    hidden: true
  },

  {
    path: '/theme',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/theme/index'),
        name: 'Theme',
        meta: { title: 'Theme', icon: 'theme' }
      }
    ]
  },

  {
    path: '/clipboard',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/clipboard/index'),
        name: 'ClipboardDemo',
        meta: { title: 'Clipboard', icon: 'clipboard' }
      }
    ]
  },

  {
    path: 'external-link',
    component: Layout,
    children: [
      {
        path: 'https://github.com/PanJiaChen/vue-element-admin',
        meta: { title: 'External Link', icon: 'link' }
      }
    ]
  },*/

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
