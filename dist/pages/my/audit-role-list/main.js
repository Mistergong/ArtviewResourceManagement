require("../../../common/manifest.js");
require("../../../common/vendor.js");
global.webpackJsonp([14],{

/***/ 135:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__index__ = __webpack_require__(136);



var app = new __WEBPACK_IMPORTED_MODULE_0_vue___default.a(__WEBPACK_IMPORTED_MODULE_1__index__["a" /* default */]);
app.$mount();

/***/ }),

/***/ 136:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_mpvue_loader_lib_selector_type_script_index_0_index_vue__ = __webpack_require__(138);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_mpvue_loader_lib_template_compiler_index_id_data_v_9dd82f66_hasScoped_false_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_mpvue_loader_lib_selector_type_template_index_0_index_vue__ = __webpack_require__(139);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(137)
}
var normalizeComponent = __webpack_require__(1)
/* script */

/* template */

/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_mpvue_loader_lib_selector_type_script_index_0_index_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_mpvue_loader_lib_template_compiler_index_id_data_v_9dd82f66_hasScoped_false_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_mpvue_loader_lib_selector_type_template_index_0_index_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src\\pages\\my\\audit-role-list\\index.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] index.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-loader/node_modules/vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-9dd82f66", Component.options)
  } else {
    hotAPI.reload("data-v-9dd82f66", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ 137:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 138:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//


/* harmony default export */ __webpack_exports__["a"] = ({
  data: function data() {
    return {
      // 当前操作的权限
      roleKey: '',
      roleName: '',
      // 增加还是删除
      operateKey: '',
      // 待操作人员
      userListForSelect: '',
      // 选中的人员
      selectedUsers: []
    };
  },
  mounted: function mounted() {
    var paramsObj = this.$tool.getOptions();
    this.roleKey = paramsObj.rolekey;
    this.operateKey = paramsObj.operatekey;
    this.roleName = this.$tool.getRoleNameByRoleKey(this.$config.$DATA.ROLE_KEY_MAP, this.roleKey);
    this.updateTitle();
    this.getMulList();
  },

  methods: {
    /**
     * 更新页面导航文案
     */
    updateTitle: function updateTitle() {
      var navTitle = this.operateKey === 'add' ? '\u6388\u6743' + this.roleName : '\u53D6\u6D88' + this.roleName + '\u6388\u6743';
      wx.setNavigationBarTitle({
        title: navTitle
      });
    },

    /**
     * 获取当前页面的可多选的人员列表
     */
    getMulList: function getMulList() {
      var _this = this;

      var API = this.operateKey === 'add' ? '/wx/user/getUnUsersByRole.do' : '/wx/user/getUsersByRole.do';
      this.$http({
        url: API,
        method: 'get',
        data: {
          roleKey: this.roleKey
        },
        success: function success(res) {
          _this.userListForSelect = res.data;
        }
      });
    },

    /**
     * 多选框选中事件
     */
    selecteUserChange: function selecteUserChange(e) {
      this.selectedUsers = e.target.value;
    },

    /**
     * 点击确认授权或者确认取消授权按钮
     */
    ensureOperate: function ensureOperate() {
      var _this2 = this;

      console.log(this.selectedUsers);
      var API = this.operateKey === 'add' ? '/wx/role/batchAddUserRole.do' : '/wx/role/batchdelUserRole.do';
      var sendData = {
        roleKey: this.roleKey,
        uids: this.selectedUsers
      };
      this.$http({
        url: API,
        method: 'post',
        data: sendData,
        success: function success(res) {
          _this2.getMulList();
          wx.showToast({
            title: '操作成功！',
            duration: 2000
          });
          wx.navigateBack();
        }
      });
    }
  }
});

/***/ }),

/***/ 139:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', [_c('div', {
    staticClass: "zan-panel"
  }, [_c('button', {
    attrs: {
      "disabled": _vm.userListForSelect && !_vm.userListForSelect.length,
      "type": _vm.operateKey == 'add' ? 'primary' : 'warn',
      "eventid": '0'
    },
    on: {
      "click": _vm.ensureOperate
    }
  }, [_vm._v(_vm._s(_vm.operateKey === 'add' ? '授权' : '取消授权'))])], 1), _vm._v(" "), _c('div', {
    staticClass: "zan-panel"
  }, [_c('checkbox-group', {
    attrs: {
      "eventid": '1',
      "mpcomid": '0'
    },
    on: {
      "change": _vm.selecteUserChange
    }
  }, _vm._l((_vm.userListForSelect), function(item, index) {
    return _c('div', {
      key: index,
      staticClass: "zan-cell"
    }, [_c('div', {
      staticClass: "zan-cell__icon zan-icon zan-icon-contact",
      staticStyle: {
        "color": "#666"
      }
    }), _vm._v(" "), _c('div', {
      staticClass: "zan-cell__bd"
    }, [_vm._v(_vm._s(item.name))]), _vm._v(" "), _c('div', {
      staticClass: "zan-cell__ft"
    }, [_c('checkbox', {
      attrs: {
        "value": item.uid
      }
    })], 1)])
  }))], 1)])
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-loader/node_modules/vue-hot-reload-api").rerender("data-v-9dd82f66", esExports)
  }
}

/***/ })

},[135]);
//# sourceMappingURL=main.js.map