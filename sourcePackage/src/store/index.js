// https://vuex.vuejs.org/zh-cn/intro.html
// make sure to call Vue.use(Vuex) if using a module system
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    third_session: '', // 后台返回自定义登录态
    userInfo: {}, // 保存后台login接口返回的userInfo
    // ifAutherized: false, // 是否授权：方便随时调起授权页
    wxUserInfo: {}, // 用户授权后获取到的用户敏感信息，用户微信基础信息
    encryptedObj: { // 用户敏感信息之加密码，用户授权才能拿到
      iv: '',
      encryptedData: ''
    },
    userRoleList: [],
    userAuditStatus: 1, // 用户审核状态 1:未注册 2：审核中 3:被拒绝 4: 已通过
    accessTree: {}, // 角色权限树
    myShareBag: [],//待分享的资源列表
    HOSTurl: 'https://www.hwyst.net/ttzy',
  },
  mutations: {
    updateCustomLoginStatus (state, val) {
      state.third_session = val;
    },
    updateUserAuditStatus (state, val) {
      state.userAuditStatus = val;
    },
    // 根据roleList更新角色权限树
    updateRoleAuthTree (state, val) {
      console.log('从后台获取到的权限列表数组');
      console.log(val);
      /**
       * 通过用户角色列表，返回用户每个页面的权限数组，再遍历生成最终的权限树
       */
      let roleList = val; // 获取到用户的角色列表 用户角色列表 eg: ['root', 'admin']
      let pageArr = ['my']; // 一起有多少个页面参与权限，若有增加的话，需要与accessItem，accessTree, itemTotal同步
      // 同步用户的角色权限树
      let accessItem = { // 五种角色状态，在不同的页面拥有不同的权限
        unregister: {
          my: ['myMessages', 'personalPage', 'about', 'register']
        },
        root: {
          my: ['myMessages', 'personalPage', 'about', 'userManagement', 'enpowerAdmins']
        },
        admin: {
          my: ['myMessages', 'personalPage', 'about', 'userManagement', 'logPage', 'powerForInputRes', 'powerForAuditRes']
        },
        checker: {
          my: ['myMessages', 'personalPage', 'about', 'auditResourse']
        },
        writer: {
          my: ['myMessages', 'personalPage', 'about']
        },
        common: {
          my: ['myMessages', 'personalPage', 'about']
        },
        visitor: {
          my: ['myMessages', 'personalPage', 'about']
        }
      };
      let accessTree = {
        my:{
          myMessages: false, // common
          register: false, // unregister
          userManagement: false, // root admin 
          enpowerAdmins: false, // 管理员授权 root
          logPage: false, // 查看日志 admin
          powerForInputRes: false, // 资源录入授权 admin
          powerForAuditRes: false, // 资源审核授权 admin
          auditResourse: false, // 资源审核 资源审核组成员
          // inputResourse: false, // 资源录入 资源录入组成员
          personalPage: false, // common
          about: false, // common
        }
      }
      // 1. 权限数组合并
      let itemTotal = { // 配置对象
        my: []
      };
      // 先拼接
      for (let i = 0, len1 = roleList.length; i < len1; i++) {
        for (let j = 0, len2 = pageArr.length; j < len2; j++) {
          let page = pageArr[j];
          // ['myMessages', 'personalPage', 'about', 'register'] 拼接 ['myMessages', 'personalPage', 'about', 'userManagement', 'enpowerAdmins']
          itemTotal[page] = itemTotal[page].concat(accessItem[roleList[i]][page]);
        }
      }
      console.log('拼接后的权限数配置对象');
      /* eg:itemTotal = {
        my: ["myMessages", "personalPage", "about", "userManagement", "enpowerAdmins", "myMessages", "personalPage", "about", "userManagement"]
      } */
      console.log(itemTotal);
      // 再去重
      function DeleteRepeat(array){
        var temp = []; //一个新的临时数组
        for(var i = 0; i < array.length; i++){
            if(temp.indexOf(array[i]) == -1){
                temp.push(array[i]);
            }
        }
        return temp;
      }
      for (let pageKey in itemTotal) {
        // 去重
        itemTotal[pageKey] = DeleteRepeat(itemTotal[pageKey]);
        // 遍历同步更新权限树
        for (let i = 0, len = itemTotal[pageKey].length; i < len; i ++) {
          let pageAuthItem = itemTotal[pageKey][i];
          accessTree[pageKey][pageAuthItem] = true;
        }
      }
      /* eg:itemTotal = {
        my: ["myMessages", "personalPage", "about", "userManagement", "enpowerAdmins", "userManagement"]
      } */
      console.log('去重后的权限数配置对象');
      console.log(itemTotal);
      /* accessTree = {
        my:{
          myMessages: true, // common
          register: false, // unregister
          userManagement: true, // root admin 
          enpowerAdmins: false, // 管理员授权 root
          logPage: false, // 查看日志 admin
          powerForInputRes: true, // 资源录入授权 admin
          powerForAuditRes: false, // 资源审核授权 admin
          auditResourse: false, // 资源审核 资源审核组成员
          inputResourse: false, // 资源录入 资源录入组成员
          personalPage: false, // common
          about: false, // common
        }
      } */
      console.log('配置对象配置后的权限树');
      console.log(accessTree);
      state.accessTree = accessTree;
    },
    updateUserInfo (state, val) {
      state.userInfo = val
    },
    updateEncryptedObj (state, val) {
      state.encryptedObj = val
    },
    updateWxUserInfo (state, val) {
      state.wxUserInfo = val
    },
    updateUserRoleList (state, val) {
      state.userRoleList = val
    },
  }
})

export default store