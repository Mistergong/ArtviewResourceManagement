<template>
  <div class="container">
    <div class="resource-warp clearfix">
      <template v-for="(item, index) in resList">
        <div class="res-item fl" :key="'res_items_' + index">
          <img v-if="isVisitor" class="res-item__headimg" src="../../assets/images/resourcebk.png" alt="" @click="clickVisitorTap()">
          <img v-else-if="item.logoUrl" class="res-item__headimg" :src="item.logoUrl" alt="" @click="clickResourceTap(item.typeKey, item.name)">
          <img v-else class="res-item__headimg" src="../../assets/images/resourcebk.png" alt="">
          <div class="res-name">{{item.name}}</div>
        </div>
      </template>
    </div>
  </div>
</template>

<script>

export default {
  data () {
    return {
      // 用户审核状态
      userAuditStatus: 1,
      // 用户角色列表
      userRoleList: [],

      isVisitor: true,
      resList: []
    }
  },
  computed: {

  },
  mounted () {
    /*
  主页启动逻辑：
  1. 拿code换取：
    1. 自定义登录态，储存到公共状态管理，后面接口调用都要带上；
    2. 用户注册信息：
      1. 已注册用户
        1. 审核中/被拒绝：页面一进来就toast提示
        2. 审核已通过：拿到用户的角色信息，配置全局的权限对象
      2. 用户未注册：
  2. 
  */
    wx.showLoading(this.$config.LOADING_PARAM_OBJ);
    // 登录
    wx.login({
      success: res => {
        wx.hideLoading();
        this.$http({
          url: '/wx/login.do',
          method: 'post',
          data: {
            code: res.code
          },
          success: res => {
            //公共状态管理自定义登录态
            this.$store.commit('updateCustomLoginStatus', res.third_session);
            //拿到识别码后，获取用户审核状态值 1:未注册 2：审核中 3:被拒绝 4: 已通过
            this.updateUserRole(res.status);
            // 如果已注册
            if(this.userAuditStatus != 1){
              // 本地储存用户基础信息
              this.$store.commit('updateUserInfo', res.userInfo);              
            }
            if (this.userAuditStatus === 4) {
              // 拿用户的用户角色列表
              this.updateRoleList(res.userInfo.roles);
              // 更新用户权限树
              this.$store.commit('updateRoleAuthTree', this.userRoleList);
              this.$store.commit('updateUserRoleList', this.userRoleList);
              console.log(this.userRoleList, this.$store);
            } else { // 其他三种状态的页面结构一样
              // 同步公共状态管理
              this.$store.commit('updateRoleAuthTree', ['unregister']); // 游客 == 未注册
            }
             // 请求资源列表
            this.getResourseListData();
            this.isRoleVisitor();
          },
          fail: () => {
            wx.showToast({title: '用户登录失败！', icon: 'none'});
          }
        });
      },
      fail: res => {
        wx.hideLoading();
        console.log(res);
        wx.showModal({title: '错误', content: res.errMsg, showCancel: false});
      }
    });
  },
  methods: {
    updateUserRole (status) {
      let userAuditStatus;
      // 存储格式化为前端自定义用户审核状态 1:未注册 2：审核中 3:被拒绝 4: 已通过
      switch (status) {
        case -1:
          userAuditStatus = 1;
          break;
        case 0:
          userAuditStatus = 2;
          break;
        case 1:
          userAuditStatus = 4;
          break;
        case 2:
          userAuditStatus = 3;
          break;
      }
      // 同步公共状态管理
      this.$store.commit('updateUserAuditStatus', userAuditStatus);
      this.userAuditStatus = userAuditStatus;
    },
    updateRoleList (roles) {
      // 遍历用户角色列表，本地储存
      let roleList = [];
      let roleListData = roles;
      for (let i = 0, len = roleListData.length; i < len; i ++) {
        roleList.push(roleListData[i].roleKey);
      }
      this.userRoleList = roleList;
    },

    //判断访问用户是不是游客
    isRoleVisitor() {
      if(this.$store.state.userAuditStatus == 4){
        this.isVisitor = false;
      }
    },
    getResourseListData () {
      this.$http({
        url: '/rs/def/getall.do',
        method: 'get',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: res => {
          console.log(res);
          this.resList = res.data;
          for(var i=0; i<this.resList.length; i++){
            if(this.resList[i].logoUrl)this.resList[i].logoUrl = this.$store.state.HOSTurl + this.resList[i].logoUrl;
            else this.resList[i].logoUrl = "../../assets/images/resourcebk.png";
          }
        }
      });
    },
    clickResourceTap(typeKey, name){
      wx.navigateTo({url: "resourceView/main?typeKey=" + typeKey+"&typeName="+name})
    },
    clickVisitorTap(){
      if(this.$store.state.userAuditStatus == 1 || this.$store.state.userAuditStatus == 3){
        var ctent = '你还没有进行实名注册，不能查看资源内容！现在注册？';
        if(this.$store.state.userAuditStatus == 3)ctent = '你的注册被管理员拒绝，不能查看资源内容！可以到我的消息查看原因，也可以重新注册，现在注册？';
        wx.showModal({
          title: '提示', 
          content: ctent,
          success: res =>{
            if(res.confirm){//有两个注册入口，这里是其中之一
              // 由于微信用户要与PC用户互通，这里注册需要得到用户授权获取高级信息
              this.$tool.checkUserInfoAuth().then(() => {
              // 用户未授权，进到授权页
                console.log('已授权');
                wx.navigateTo({url: "../my/register/main"});
              }, () => {
                this.$tool.goToAuthPage();
              });
            }
          }
        });
      }
      else if(this.$store.state.userAuditStatus == 2){
        wx.showModal({title: '提示', content: '你的注册申请管理员还没有审批，不能查看资源！', showCancel: false});
      }
    }
  }
}
</script>

<style lang="scss">
page {
  background-color: #fff;
}
.counter-warp {
  text-align: center;
  margin-top: 100px;
}
.home {
  display: inline-block;
  margin: 100px auto;
  padding: 5px 10px;
  color: blue;
  border: 1px solid blue;
}
.container {
  padding: 15px;
}
.resource-warp {
  margin-left: -7.5px;
  margin-right: -7.5px;
}
.res-item {
  width: 33.3333333%;
  padding: 0 7.5px 10px;
  text-align: center;
  .res-item__headimg {
    width: 105px;
    height: 105px;
    vertical-align: bottom;
  }
  .res-name {
    font-size: 15px;
  }
}
</style>
