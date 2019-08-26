<template>
  <div>
    <row>
      <i-col span="2">
        <i-button type="primary" @click="addService">新增菜单</i-button>
      </i-col>
      <i-col span="2">
        <i-button type="primary" @click="delService">删除菜单</i-button>
      </i-col>
      <i-col span="2">
        <i-button type="primary" @click="updateService">修改菜单</i-button>
      </i-col>
      <i-col span="21">&nbsp;</i-col>
    </row>
    <row>
      <Tree :data="jurisdiction" :height="tableHeight" @on-select-change="selectChange" ref="tree4" show-checkbox ></Tree>
    </row>
    <br><br>
    <Modal :title=title :mask-closable="false" v-model="jurisdictionSingle" width=80 :loading="loading">
      <i-form :rules="checkRules" ref="refJurisdictionSingle" :model="jurisdictionMenu">
        <row :gutter="16" style="margin-bottom: 20px;display:flex;font-size: 15px">
          <i-col span="1">&nbsp;</i-col>
          <i-col span="6">
            <form-item label="级别：" prop="menuLevel">
              <i-select v-model="jurisdictionMenu.menuLevel"
                        :disabled="menuLevelDisabled"
                        @on-change="jurisdictionMenurChange(jurisdictionMenu.menuLevel)">
                <i-option v-for="item in jurisdictionMenu.menuLevels" :value="item.code" :key="item.code">
                  {{ item.name }}
                </i-option>
              </i-select>
            </form-item>
          </i-col>
          <i-col span="1">&nbsp;</i-col>
          <i-col span="6">
            <form-item label="是否叶子节点：　　　　　　　　　　　　　　　　" prop="menuLevel">
              <i-select v-model="jurisdictionMenu.is_leaf">
                <i-option v-for="item in jurisdictionMenu.is_leafs" :value="item.code" :key="item.code">
                  {{ item.name }}
                </i-option>
              </i-select>
            </form-item>
          </i-col>
          <i-col span="1" v-show="icon_String === 'true'">&nbsp;</i-col>
          <i-col span="6" v-show="icon_String === 'true'">
            <form-item label="ICON地址：" prop="menuTwo">
              <i-input :maxlength="50" v-model="jurisdictionMenu.icon_string"/>
            </form-item>
          </i-col>
          <i-col span="1" v-show="jump_urlShow==='true'">&nbsp;</i-col>
          <i-col span="6" v-show="jump_urlShow==='true'">
            <form-item label="跳转地址：" prop="menuOne">
              <i-input :maxlength="250" v-model="jurisdictionMenu.jump_url"/>
            </form-item>
          </i-col>　　　　
          <i-col span="1" v-show="iconUrl === 'true'">&nbsp;&nbsp;&nbsp;</i-col>
          <i-col span="6" v-show="iconUrl === 'true'">
            <Upload ref="upload"
                    :show-upload-list="false"
                    :default-file-list="defaultList"
                    :on-success="handleSuccess"
                    :format="['jpg','jpeg','png']"
                    :max-size="2000"
                    :on-format-error="handleFormatError"
                    :on-exceeded-size="handleMaxSize"
                    type="select"
                    :action="photoUploadURL">
              <form-item label="　　　　　　　　" prop="photo_upload">
                <Button icon="ios-cloud-upload-outline" class="sizeFont">上传图片</Button>
              </form-item>
            </Upload>
          </i-col>
        </row>
        <row :gutter="16" style="margin-bottom: 20px;display:flex;font-size: 15px">
          <i-col span="1" v-show="showOne === 'true'">&nbsp;</i-col>
          <i-col span="6" v-show="showOne === 'true'">
            <form-item label="一级菜单：" prop="menuOne">
              <i-select v-model="jurisdictionMenu.menuOne"
                        :disabled="menuOneDisabled"
                        @on-change="menuOneChange(jurisdictionMenu.menuOne)">
                <i-option v-for="item in jurisdictionMenu.menuOnes"
                          :value="item.code" :key="item.code">
                  {{ item.name }}
                </i-option>
              </i-select>
            </form-item>
          </i-col>
          <i-col span="1" v-show="showTwo === 'true'">&nbsp;</i-col>
          <i-col span="6" v-show="showTwo === 'true'">
            <form-item label="二级菜单：" prop="menuTwo">
              <i-select v-model="jurisdictionMenu.menuTwo"
                        :disabled="menuTwoDisabled">
                <i-option v-for="item in jurisdictionMenu.menuTwos" :value="item.code" :key="item.code">
                  {{ item.name }}
                </i-option>
              </i-select>
            </form-item>
          </i-col>
          <i-col span="1">&nbsp;</i-col>
          <i-col span="6">
            <form-item label="名称	：" prop="menuName">
              <i-input :maxlength="8" v-model="jurisdictionMenu.menuName"/>
            </form-item>
          </i-col>
          <i-col span="1" v-show="jump_urlShow==='false'">&nbsp;</i-col>
          <i-col span="6" v-show="jump_urlShow==='false'">
            <form-item label="跳转地址：" prop="menuOne">
              <i-input :maxlength="250" v-model="jurisdictionMenu.jump_url"/>
            </form-item>
          </i-col>
          <i-col span="1" v-show="iconUrl === 'true'">&nbsp;</i-col>
          <i-col span="6" v-show="iconUrl === 'true'">
              <form-item label="一级菜单图标：">
                <div style="max-widpth:100px; max-width:100px">
                  <img :src="src" style="width:100%; height:100%; "/>
                </div>
              </form-item>
          </i-col>
        </row>
      </i-form>
      <div slot="footer">
        <i-button @click="cancelSubmit()">取消</i-button>
        <i-button v-if="this.title === '新增菜单'" type="primary" @click="createSubmit('add')">保存</i-button>
        <i-button v-else type="primary" @click="createSubmit('update')">保存</i-button>
      </div>
    </Modal>
  </div>
</template>
<script>
  import {post, setAxiosbaseURL} from '../../utils/http'
  import {baseURL} from '../../IPconfig'
  import {constant} from '../../constant/constant'
  import Common from "../../utils/common";
  import defaultPhoto from '../../static/images/defaultPhoto.jpg'

  export default {
    data() {
      return {
        menuLevelDisabled: false,
        menuOneDisabled: false,
        menuTwoDisabled: false,
        name: '',
        code: '',
        defaultList: [
          {
            'name': '',
            'url': ''
          }
        ],
        photoUploadURL: baseURL.releaseIP + '/common/picture_temp',
        loading: true,
        // 每页显示条目个数
        pageSize: constant.pageSize,
        // 当前页数
        pageNum: 1,
        // 总个数
        total: 0,
        src: defaultPhoto,
        photoURL: '',
        showOne: 'false',
        showTwo: 'false',
        iconUrl: 'false',
        icon_String: 'false',
        jump_urlShow: 'false',
        jurisdiction: [],
        jurisdictionMenu: {
          version: '',
          menuLevel: '',
          icon_string: '',
          jump_url: '',
          is_leaf: '',
          is_leafs: [

            {code: 1, name: "是"},
            {code: 0, name: "否"}
          ],
          menuLevels: [
            {code: 1, name: "一级菜单"},
            {code: 2, name: "二级菜单"}
          ],
          menuOne: '',
          menuOnes: [],
          menuTwo: '',
          menuTwos: [],
          menuName: ''
        },
        jurisdictionSingle: false,
        tableHeight: '',
        conditionsTemp: {
          name: '',
          main_body_type_category: ''
        },
        page: '',
        title: '',
        checkRules: {
          name: [
            {required: true, message: "服务商名称为必须输入项。", trigger: "blur"}
          ],
          main_body_type_category:
            [
              {required: true, message: "兴办主体类型为必须输入项。", trigger: "blur"}
            ],
          contact_number:
            [
              {required: false, pattern: /(^.{0,25}$)/, message: "服务商联系电话最多只能输入25位。", trigger: "blur"}
            ]
        }
      }
    }
    ,
    mounted() {
      this.tableHeight = document.documentElement.clientHeight + 500;
      this.initialiseIndex()
    }
    ,
    methods: {
      selectChange(data) {
        if (data[0] === undefined) {
          this.code = ''
        }
        if (data.length !== 1 && data.length !== 0) {
          let config = {
            title: '菜单不能多选',
            content: '请选择要修改的菜单。'
          };
          this.$Modal.warning(config)
        }
        if (data.length === 1) {
          this.code = data[0].code
        }
      },
      //点击关闭
      cancelSubmit() {
        this.jurisdictionSingle = false;
      },
      handleSuccess(res) {
        this.photoURL = res.retData
        this.src = baseURL.releaseIP + res.retData
      },
      handleFormatError(file) {
        this.$Notice.warning({
          title: '文件格式不正确',
          desc: '文件 ' + file.name + ' 格式不正确，请上传 jpg 或 png 格式的图片。'
        })
      },
      handleMaxSize(file) {
        this.$Notice.warning({
          title: '超出文件大小限制',
          desc: '文件 ' + file.name + ' 太大，不能超过 500K。'
        })
      },
      jurisdictionMenurChange(val) {
        if (val === 1) {
          this.showOne = 'false';
          this.showTwo = 'false'
          this.iconUrl = 'true'
          this.icon_String = 'false'
          this.jump_urlShow = 'false'
        } else if (val === 2) {
          this.showOne = 'true';
          this.showTwo = 'false'
          this.iconUrl = 'false'
          this.icon_String = 'true'
          this.jump_urlShow = 'false'
        } else if (val === 3) {
          this.showOne = 'true';
          this.showTwo = 'true'
          this.iconUrl = 'false'
          this.icon_String = 'false'
          this.jump_urlShow = 'true'
        }
      },
      menuOneChange(val, callback) {
        post('/sysMenu/searchLevelTwo?code=' + val).then((response) => {
          if (response.retCode === constant.changzhouServerOkCode) {
            this.jurisdictionMenu.menuTwos = response.retData
            if (callback) {
              callback(this)
            } else {
              this.jurisdictionMenu.menuTwo = ''
            }
          } else {
            Common.errNotice(this, response.retMsg, constant.distributorErrTitle)
          }
        }, err => {
          Common.errNotice(this, err, constant.distributorErrTitle)
        })

      },
      addService() {
        this.clearJurisdiction()
        this.jurisdictionSingle = true;
        this.title = '新增菜单';
        this.showOne = 'false';
        this.showTwo = 'false'
        this.jump_urlShow = 'false'
      },
      delService() {
        if (this.code == null || this.code == '' || this.code == undefined) {
          let config = {
            title: '菜单不能为空',
            content: '请选择要删除的菜单。'
          };
          this.$Modal.warning(config)
        } else {
          this.$Modal.confirm({
            title: '删除确认',
            content: '是否删除该菜单？',
            okText: '确定',
            cancelText: '取消',
            onOk: () => {
              //逻辑删除
              post('/sysMenu/deleteMenu?code=' + this.code).then((response) => {
                if (response.retCode === constant.changzhouServerOkCode) {
                  Common.infoNotice(this, '[' + this.code + ']编号的菜单已删除。', '菜单删除成功');
                  this.code = ''
                  this.initialiseIndex()
                } else {
                  Common.errNotice(this, response.retMsg, constant.distributorErrTitle)
                }
              }, err => {
                Common.errNotice(this, err, constant.distributorErrTitle)
              })
            }
          })
        }
      },
      updateService() {
        this.clearJurisdiction();
        if (this.code == null || this.code == '' || this.code == undefined) {
          let config = {
            title: '菜单不能为空',
            content: '请选择要修改的菜单。'
          }
          this.$Modal.warning(config)
        } else {
          this.title = '修改菜单';
          this.jurisdictionSingle = true;
          post('/sysMenu/getMenuByCode?code=' + this.code).then((response) => {
            if (response.retCode === constant.changzhouServerOkCode) {
              this.menuLevelDisabled = true
              this.menuOneDisabled = true
              this.menuTwoDisabled = true
              if (response.retData.menu_level === 1) {
                this.showOne = 'false';
                this.showTwo = 'false'
                this.iconUrl = 'true'
                this.icon_String = 'false'
                this.jump_urlShow = 'false'
                this.src = baseURL.releaseIP +  response.retData.icon_url
              } else if (response.retData.menu_level === 2) {
                this.showOne = 'true';
                this.showTwo = 'false'
                this.iconUrl = 'false'
                this.icon_String = 'true'
                this.jump_urlShow = 'false'
                this.jurisdictionMenu.menuOne = response.retData.parent_node_code
              } else if (response.retData.menu_level === 3) {
                post('/sysMenu/getMenuByCode?code=' + response.retData.parent_node_code).then((data) => {
                  if (data.retCode === constant.changzhouServerOkCode) {
                    this.showOne = 'true';
                    this.showTwo = 'true'
                    this.iconUrl = 'false'
                    this.icon_String = 'false'
                    this.jump_urlShow = 'true'
                    this.menuOneChange(data.retData.parent_node_code, function (that) {
                      that.jurisdictionMenu.menuOne = data.retData.parent_node_code
                      that.jurisdictionMenu.menuTwo = response.retData.parent_node_code
                    })
                  }
                })
              }
              this.jurisdictionMenu.code = response.retData.code
              this.jurisdictionMenu.icon_string = response.retData.icon_string
              this.jurisdictionMenu.menuName = response.retData.name
              this.jurisdictionMenu.jump_url = response.retData.jump_url
              this.jurisdictionMenu.is_leaf = response.retData.is_leaf
              this.jurisdictionMenu.menuLevel = response.retData.menu_level
              this.jurisdictionMenu.version = response.retData.version
            } else {
              Common.errNotice(this, response.retMsg, constant.distributorErrTitle)
            }
          }, err => {
            Common.errNotice(this, err, constant.distributorErrTitle)
          })

        }

      },
      createSubmit(flag) {
        this.loading = false;
        this.$nextTick(() => {
          this.loading = true;
        });
        this.$refs['refJurisdictionSingle'].validate((valid) => {
          if (valid) {
            if (flag === 'add') {
              this.addJurisdictionSingle()
            } else {
              this.updateJurisdictionSingle()
            }
          }
        })
      },
      //初始化页面
      initialiseIndex() {
        post('/sysMenu/getMenuTree').then((response) => {
          if (response.retCode === constant.changzhouServerOkCode) {
            this.jurisdiction = response.retData.treeList
            this.jurisdictionMenu.menuOnes = response.retData.levelOneList
          } else {
            Common.errNotice(this, response.retMsg, constant.distributorErrTitle)
          }
        }, err => {
          Common.errNotice(this, err, constant.distributorErrTitle)
        })
      },

      //新增保存
      addJurisdictionSingle() {
        let params = {};
        params.menu_level = this.jurisdictionMenu.menuLevel
        params.is_leaf = this.jurisdictionMenu.is_leaf
        params.jump_url = this.jurisdictionMenu.jump_url
        params.name = this.jurisdictionMenu.menuName
        if (parseInt(this.jurisdictionMenu.menuLevel) === 2) {
          params.parent_node_code = this.jurisdictionMenu.menuOne
          params.icon_string = this.jurisdictionMenu.icon_string
        } else if (parseInt(this.jurisdictionMenu.menuLevel) === 3) {
          params.parent_node_code = this.jurisdictionMenu.menuTwo
        } else if (parseInt(this.jurisdictionMenu.menuLevel) === 1) {
          params.icon_url = this.photoURL
        }
        post('/sysMenu/saveOrUpdateMenu', params).then((response) => {
          if (response.retCode === constant.changzhouServerOkCode) {
            Common.infoNotice(this, ' 菜单增加成功。', '新增菜单')
            this.jurisdictionMenu.length = 0;
            this.jurisdictionSingle = false
            this.initialiseIndex()
          } else {
            Common.errNotice(this, response.retMsg, constant.distributorErrTitle)
          }
        }, err => {
          Common.errNotice(this, err, constant.distributorErrTitle)
        })
      },
      //修改保存
      updateJurisdictionSingle() {
        let params = {};
        params.menu_level = this.jurisdictionMenu.menuLevel
        params.is_leaf = this.jurisdictionMenu.is_leaf
        params.jump_url = this.jurisdictionMenu.jump_url
        params.name = this.jurisdictionMenu.menuName
        if (parseInt(this.jurisdictionMenu.menuLevel) === 2) {
          params.parent_node_code = this.jurisdictionMenu.menuOne
          params.icon_string = this.jurisdictionMenu.icon_string
        } else if (parseInt(this.jurisdictionMenu.menuLevel) === 3) {
          params.parent_node_code = this.jurisdictionMenu.menuTwo
        } else if (parseInt(this.jurisdictionMenu.menuLevel) === 1) {
          params.icon_url = this.photoURL
        }
        params["code"] = this.jurisdictionMenu.code
        params["version"] = this.jurisdictionMenu.version
        // console.log("修改  "+JSON.stringify(params))
        post('/sysMenu/saveOrUpdateMenu', params).then((response) => {
          if (response.retCode === constant.changzhouServerOkCode) {
            Common.infoNotice(this, this.jurisdictionMenu.menuName + ' 菜单修改成功。', '修改菜单')
            this.jurisdictionSingle = false
            this.code = ''
            this.initialiseIndex()
          } else {
            Common.errNotice(this, response.retMsg, constant.distributorErrTitle)
          }
        }, err => {
          Common.errNotice(this, err, constant.distributorErrTitle)
        })
      },
      clearJurisdiction() {
        this.jurisdictionMenu.menuLevel = ''
        this.jurisdictionMenu.is_leaf = ''
        this.jurisdictionMenu.jump_url = ''
        this.jurisdictionMenu.menuOne = ''
        this.jurisdictionMenu.menuName = ''
        this.jurisdictionMenu.icon_string = ''
        this.src = defaultPhoto
        this.photoURL = ''
        this.menuLevelDisabled = false
        this.menuOneDisabled = false
        this.menuTwoDisabled = false
      }
    },
  }
</script>

<style scoped>
  .label {
    text-align: right;
    margin: auto;
  }
</style>
<style scoped>
  .home .ivu-card-body{
    height: 1700px;
  }
</style>
