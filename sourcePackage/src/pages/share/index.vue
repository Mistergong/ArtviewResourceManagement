﻿<template>
  <div class="resourcelist-wrap">
    <div class="clearfix pt-10 pb-10 pr-pl-15">
      <div class="fl">选择模版：</div>
      <div class="fr">
        <picker @change="tPickerChange" :value="tIndex" :range="tArray" range-key="tempName">
          <view class="picker">
            <span class="" v-if="tIndex === -1">请选择</span>
            <span v-else>{{tArray[tIndex].tempName}}</span>
          </view>
        </picker>
      </div>
    </div>
    <div class="function-btn-box">
      <span class="function-btn for-select-template" @click="creatShareBitmap()">生成二维码</span>
      <span class="space"></span>
      <span class="function-btn for-create-page" @click="PreviewSharePage()">预览分享页面</span>
      <!-- <span class="function-btn for-create-page" @click="createSharePage()">生成分享页面</span> -->
    </div>
    <template v-for="(item, index) in shRsList">
      <div class="resourcelist-item-wrap" :key='index'>
        <div class="icon-group-box">
          <img  class="rs-icon" src="../../assets/images/delete.png" alt="" @click="delResource(index)">
          <span class="space"></span>
          <img  class="rs-icon" src="../../assets/images/up.png" alt="" @click="upResource(index)">
          <img  class="rs-icon" src="../../assets/images/down.png" alt="" @click="downResource(index)">
        </div>
        <div class="item-box">
          <template v-for="(ss, inx) in item">
            <div v-if="ss.attrType == 'picture'" class="content-item" :key="'pic' + inx">
              <img  class="resource-image" :src="ss.attrValue" alt="">
            </div>
            <div v-else-if="ss.attrType == 'video'" class="content-item" :key="'vdo' + inx">
              <video :src="ss.attrValue" controls="controls" width="100%" height="180"></video>
            </div>
            <div v-else class="content-item" :key="'ctt' + inx">
              <span class="item-title">{{ss.attrName}}：</span>
              <span class="item-value">{{ss.attrValue}}</span>
            </div>
          </template>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
export default {
  data () {
    return {
      shRsList: [], //待分享资源列表
      srTypeName: '',
      tIndex: -1,
      tArray: [
        {
          tId: 'io394riw3brw8h837rhw3briwu1',
          name: '模版一'
        },
        {
          tId: 'io394riw3brw8h837rhw3briwu2',
          name: '模版二'
        },
        {
          tId: 'io394riw3brw8h837rhw3briwu3',
          name: '模版三'
        },
        {
          tId: 'io394riw3brw8h837rhw3briwu4',
          name: '模版四'
        }
      ]
    }
  },

  mounted () {
    let paramsObj = this.$tool.getOptions();
    this.rsTypeName = paramsObj.rsTypeName;
    this.shRsList = this.$store.state.myShareBag;
    // 获取可用的模版列表
    let templateList = this.getTemplateList();
  },

  methods: {
    tPickerChange (e) {
      this.tIndex = e.target.value;
    },
    creatShareBitmap(){
      if (this.checkTemplateSelect()) {
        var tUrl = "https://www.hwyst.net/ttzy/pages/share/template/template0.jsp";
        wx.navigateTo({url: "/pages/share/erweima/main?shareUrl=" + tUrl + "&rsTypeName=" + this.rsTypeName});
      }
    },
    PreviewSharePage () {
      if (this.checkTemplateSelect()) {
        wx.navigateTo({
          url: "/pages/share/sharePage/main"
        });
      }
    },
    /* createSharePage () {
      wx.navigateTo({
        url: "/pages/share/resTemplate/main?rsTypeName=" + this.rsTypeName
      });
    }, */
    checkTemplateSelect () {
      let res = true;
      if (this.tIndex === -1) {
        res = false;
        wx.showToast({
          icon: 'none',
          title: '请先选择模版',
          mask: true
        });
      } else if (!(this.shRsList.length > 0)) {
        res = false;
        wx.showToast({
          icon: 'none',
          title: '资源不能为空',
          mask: true
        });
      }
      return res;
    },
    searchResourceBtn(){
      
    },
    addSearchConditions(){
      
    },
    /*
    *从资源包里删除一条资源
    */
    delResource(index){
      this.shRsList.splice(index, 1);
      this.$store.state.myShareBag = this.shRsList;
    },

    /*
     *把资源包里的这条资源向前移动一个位置
     */
    upResource(index){
       if(index == 0){
         wx.showToast({title: '到顶了'});
         return;
       }
       this.shRsList.splice(index + 1, 0, this.shRsList[index - 1]);
       this.shRsList.splice(index - 1, 1);
      this.$store.state.myShareBag = this.shRsList;
    },
    downResource(index){
       if((index + 1) >= this.shRsList.length){
         wx.showToast({title: '到底了'});
         return;
       }
       this.shRsList.splice(index + 2, 0, this.shRsList[index]);
       this.shRsList.splice(index, 1);
      this.$store.state.myShareBag = this.shRsList;
    },

    /**
     * 将当前资源加入分享包
     */
    addShareBagBtn(index) {
      var add = true;
      for(var i=0; i<this.shRsList.length; i++){
        var flag = 0;
        for(var j=0; j<this.shRsList[i].length; j++){
          if(this.rsList[index].length < ( j+1 ) )break;
          if(this.shRsList[i][j] == this.rsList[index][j] ) flag++;
        }
        if(flag == this.shRsList[i].length){
          add = false;
          break;
        }
      }
      if(add){
        this.shRsList.push(this.rsList[index]);
        this.shCount = this.shRsList.length;
      }
      else{
        wx.showToast({title: '重复选择'});
      }
    },
    /**
     * 获取更多待资源条目
     */
    getMoreListBtn(){
      this.requestCount = 0;
      for(var i=0; i<this.rsTypeList.length; i++){
         this.getrsTypevalue(this.typeKey);
      }
    },
    /**
     * 获取模版列表
     */
    getTemplateList () {
      let url = '/rs/sharetemp/getall.do'
      this.$http({
        url: url,
        method: 'get',
        success: res => {
          // tempFilePath:"template0.jsp", tempKey:"RSTdefault", tempName:"default模板"
          console.log(res);
          this.tArray = res.data;
        }
      });
    }
  }
}
</script>

<style  lang="scss" rel="stylesheet/scss" scope>
  
  page{
   width:100%;
    background-color: #fff;
  }
  .line-block{
    width: 100%;
    margin: 16px 0;
  }
  .line-fill{
    width: 100%;
    padding: 8px 0px;
  }
  .icon-group-box{
    padding-top: 8px;
    width: 20px;
    display: inline-block;
  }
  .rs-icon{
    width: 20px;
    height: 20px;
  }
  .content-item{
    width: 100%;
    display: flex;
    padding: 8px 0px;
    font-size: 15px;
  }
  .item-title{
    display: inline-block;
    width: 15%;
    text-align: right;
    word-break: break-all;
  }
  .item-value{
    display: inline-block;
    width: 85%;
    text-align: left;
    word-break: break-all;
    margin: 0 8px;
  }
  .resourcelist-wrap {
    width: 100%;
    margin-bottom: 12px;
  }
  .resourcelist-item-wrap{
    display: flex;
    width:90%;
    padding-top: 16px;
    border-top: 1px solid #f56c6c;
    margin-left: 20px;
  }
  .item-box{
    width:100%;
    padding-left: 8px;
  }
  .attr-type{
    padding: 8px 0px;
    font-size: 16px;
    color: #E64340;
  }
  .resource-image{
    width: 100%;
    height: 180px;
  }
  .sh-count{
    color: #ff0000;
  }
</style>
