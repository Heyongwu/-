<template>
  <div>
    <row style="margin-bottom: 20px;display:flex;font-size: 15px">
      <i-col span="2" class="label">名称或编号：</i-col>
      <i-col span="3">
        <i-input v-model="strs" placeholder="请输入公司名称或编号" @on-enter="initialiseIndex(0)"/>
      </i-col>
      <i-col span="2" class="label">状态：</i-col>
      <i-col span="3">
        <!--        <i-input   v-model="company_name" placeholder="公司名称" @on-enter="initialiseIndex(0)"/>-->
        <i-select :clearable="false" v-model="is_active">
          <i-option v-for="item in is_actives" :value="item.code" :key="item.code">
            {{ item.name }}
          </i-option>
        </i-select>
      </i-col>

      <i-col span="2" class="label"></i-col>
      <i-col span="3">
      </i-col>
      <i-col span="6"></i-col>
      <i-col span="2" align="right">
        <i-button type="primary" @click="initialiseIndex(0)">检索</i-button>
      </i-col>
      <i-col span="1"></i-col>
    </row>
    <row style="margin-bottom: 8px;display:flex;font-size: 15px">
      <i-col span="1">
        <i-button type="primary" @click="addStaff">新增</i-button>
      </i-col>
      <i-col span="3" v-if="coopStatus">
        <i-button type="error" @click="stopCoop">禁用</i-button>
      </i-col>
      <i-col span="3" v-if="coopStatus == false">
        <i-button type="success" @click="continueCoop">启用</i-button>
      </i-col>
      <i-col span="18">&nbsp;</i-col>
    </row>
    <row>
      <i-table border :height="tableHeight"
               @on-select-all="selectUnit" @on-select-cancel="selectUnit"
               @on-select="selectUnit" @on-select-all-cancel="selectUnit" :row-class-name="rowClassName"
               :columns="columns" :data="staffs"></i-table>
    </row>
    <div style="text-align: center;padding-top: 5px">
      <Page :current="page" :page-size="num" :total="total" @on-change="pageChange" simple/>
    </div>
    <Modal :title=title :mask-closable="false" v-model="staffSingle" width=80 :loading="loading">
      <i-form ref="refStaff" :model="staff" :rules="checkRules">
        <row :gutter="16" style="margin-bottom: 20px;display:flex;font-size: 15px">
          <i-col span="2">&nbsp;</i-col>
          <i-col span="9">
            <form-item label="公司编号：" prop="company_sn">
              <i-input :maxlength="25" v-model="staff.company_sn"/>
            </form-item>
          </i-col>
          <i-col span="2">&nbsp;</i-col>
          <i-col span="9">
            <form-item label="公司名称：" prop="company_name">
              <i-input :maxlength="25" v-model="staff.company_name"/>
            </form-item>
          </i-col>
          <i-col span="2">&nbsp;</i-col>
        </row>
        <row :gutter="16" style="margin-bottom: 20px;display:flex;font-size: 15px">
          <i-col span="2">&nbsp;</i-col>
          <i-col span="9">
            <form-item label="公司简称：" prop="abbrname">
              <i-input :maxlength="25" v-model="staff.abbrname"/>
            </form-item>
          </i-col>
          <i-col span="2">&nbsp;</i-col>
          <i-col span="9">
            <form-item label="公司身份类别：" prop="company_type">
              <i-select v-model="staff.company_type">
                <i-option v-for="item in staff.company_types" :value="item.code" :key="item.code">{{ item.name }}
                </i-option>
              </i-select>
            </form-item>
          </i-col>
          <i-col span="2">&nbsp;</i-col>
        </row>
        <row :gutter="16" style="margin-bottom: 20px;display:flex;font-size: 15px">
          <i-col span="2">&nbsp;</i-col>
          <i-col span="9">
            <form-item label="公司地址：" prop="address">
              <i-input :maxlength="20" v-model="staff.address"/>
            </form-item>
          </i-col>
          <i-col span="2">&nbsp;</i-col>
          <i-col span="9">
            <form-item label="联系人：" prop="link_name">
              <i-input :maxlength="20" v-model="staff.link_name"/>
            </form-item>
          </i-col>
          <i-col span="2">&nbsp;</i-col>
        </row>
        <row :gutter="16" style="margin-bottom: 20px;display:flex;font-size: 15px">
          <i-col span="2">&nbsp;</i-col>
          <i-col span="9">
            <form-item label="联系方式：" prop="link_phone">
              <i-input :maxlength="20" v-model="staff.link_phone"/>
            </form-item>
          </i-col>
          <i-col span="2">&nbsp;</i-col>
          <i-col span="9">
          </i-col>
          <i-col span="2">&nbsp;</i-col>
        </row>

      </i-form>
      <div slot="footer">
        <i-button @click="staffSingle = false">取消</i-button>
        <i-button v-if="this.title === '新增公司'" type="primary" @click="createSubmit('add')">保存</i-button>
        <i-button v-else type="primary" @click="createSubmit('update')">保存</i-button>
      </div>
    </Modal>
    <Spin fix v-show="spinShow">
      <Icon type="load-c" size="30" class="demo-spin-icon-load"></Icon>
      <div>检索中，请稍侯...</div>
    </Spin>
  </div>
</template>

<script>
  import {post, setAxiosbaseURL} from '../../utils/http'
  import {baseURL} from '../../IPconfig'
  import {constant} from '../../constant/constant'
  import Common from '../../utils/common'
  import Cookies from 'js-cookie'

  export default {
    data() {
      const validatePhone = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('联系方式不能为空'));
        } else if (!/^1[34578]\d{9}$/.test(value)) {
          callback('联系方式格式不正确');
        } else {
          callback();
        }
      };
      return {
        coopStatus: true,
        spinShow: false,
        lc_seats: '',
        strs: '',
        restPassword: false,
        resetPassword: false,
        seats_flag: true,
        name: '',
        sex: '',
        loading: true,
        staffSingle: false,
        company_type: '',
        company_value: '',
        company_types: [{
          "code": 1, "name": "采购商"
        }, {
          "code": 2, "name": "供应商"
        }],
        tableHeight: '',
        is_active: 1,
        is_actives: [{
          "code": 1, "name": "已启用"
        }, {
          "code": 0, "name": "已禁用"
        }],
        columns: [
          {
            type: 'selection',
            width: 60,
            align: 'center',
          },
          {
            title: '公司id',
            key: 'company_id',
            align: 'center',
          },
          {
            title: '公司编号',
            key: 'company_sn',
            align: 'center',
          },
          {
            title: '公司名称',
            key: 'company_name',
            align: 'center',
          },
          {
            title: '公司类型',
            key: 'company_value',
            align: 'center',
          },
          {
            title: '公司地址',
            key: 'address',
            align: 'center',
          },
          {
            title: '联系人姓名',
            key: 'link_name',
            align: 'center'
          },
          {
            title: '联系人方式',
            key: 'link_phone',
            align: 'center'
          }, {
            title: '操作',
            align: 'center',
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.updateAuth(params.row)
                    }
                  }
                }, '修改'),
                h('Button', {
                  props: {
                    type: 'error',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.deleteAuth(params.row)
                    }
                  }
                }, '删除'),
              ]);
            }
          },
        ],
        page: 0,
        num: constant.pageSize,
        total: 0,
        staff: {
          company_id: '',
          company_sn: '',
          company_name: '',
          abbrname: '',
          company_type: '',
          company_value: '',
          company_types: [{
            "code": 1, "name": "采购商"
          }, {
            "code": 2, "name": "供应商"
          }],
          address: '',
          link_name: '',
          link_phone: ''
        },
        staffs: [],
        allList: [],
        title: '',
        checkRules: {
          company_sn: [
            {required: true, message: "公司编号为必须输入项。", trigger: "blur"}
          ],
          company_name: [
            {required: true, message: "公司名称为必须输入项。", trigger: "blur"},
          ],
          address: [
            {required: true, message: "公司地址为必须输入项。", trigger: "blur"}
          ],
          link_name: [
            {required: true, message: "联系人为必须输入项。", trigger: "blur"}
          ],
          link_phone: [
            {required: true, validator: validatePhone, trigger: 'blur'}
          ]
        },
      }
    },
    mounted() {
      if (Common.isTokenUndefined(this) == false) {
        this.$router.push('/')
        return
      } else {
        this.tableHeight = document.documentElement.clientHeight - 290
        this.initialiseIndex(0)
      }
    },
    methods: {
      //新增保存
      insertStaff() {
        let staffModal = this.setStaffModal()
        if (Common.isNullOrUndefined(staffModal.company_type) == false) {
          this.$Notice.error({
            title: '请选择公司类型',
          });
          return
        }
        post('/index/Company/insertCompany', staffModal).then((response) => {
          if (response > 0) {
            this.$Notice.success({
              title: '公司新增',
              desc: this.staff.company_name + " 公司新增成功！ "
            });
            this.staffSingle = false
            this.initialiseIndex(0)
          }
        }, err => {
          Common.errNotice(this, err, constant.distributorErrTitle)
        })
      },
      //修改保存
      updateStaff() {
        let staffModal = this.setStaffModal()
        staffModal.company_id = this.staff.company_id
        if (Common.isNullOrUndefined(staffModal.company_type) == false) {
          this.$Notice.error({
            title: '请选择公司类型',
          });
          return
        }
        post('/index/Company/updateCompany', staffModal).then((response) => {
          if (response > 0) {
            this.$Notice.success({
              title: '公司修改',
              desc: this.staff.company_name + " 公司修改成功！ "
            });
            this.staffSingle = false
            this.initialiseIndex(this.page)
          }
        }, err => {
          Common.errNotice(this, err, constant.distributorErrTitle)
        })
      },
      createSubmit(flag) {
        //再次校验身份证是否合规
        this.loading = false;
        this.$nextTick(() => {
          this.loading = true;
        });
        this.$refs['refStaff'].validate((valid) => {
          if (valid) {
            if (flag === 'add') {
              this.insertStaff()
            }else{
              this.updateStaff()
            }
          }
        })
      },
      initialiseIndex(page) {
        this.spinShow = true
        this.page = page + 1
        let index = {
          "num": this.num,
          "page": page
        }
        if (this.strs) {
          index.strs = this.strs
        }
        if (this.is_active) {
          index.is_active = this.is_active
        }
        post('/index/Company/getCompany?str=' + this.strs + "&is_active=" + this.is_active).then((response) => {
          // console.log(JSON.stringify(response))
          this.spinShow = false
          for (let i = 0; i < response.length; i++) {
            if (response[i].company_type == 0) {
              response[i].company_value = "测试账号"
            } else if (response[i].company_type == 1) {
              response[i].company_value = "采购商"
            } else {
              response[i].company_value = "供应商"
            }
          }
          this.staffs = response
        }, err => {
          Common.errNotice(this, err, constant.distributorErrTitle)
        })
      },
      pageChange(value) {
        this.initialiseIndex(value - 1)
      },
      addStaff() {
        this.resetPassword = false
        this.staffSingle = true
        this.restPassword = false
        this.title = '新增公司'
        this.clearStaff()
      },
      clearStaff() {
        this.$refs['refStaff'].resetFields();
        this.staff.company_id = ''
        this.staff.company_sn = ''
        this.staff.company_name = ''
        this.staff.company_type = ''
        this.staff.user_sn = ''
        this.staff.user_name = ''
        this.staff.user_mobile = ''
        // this.staff.user_type = ''
        this.staff.password = ''
      },
      setStaffModal() {
        let staffModal = {
          // 'company_id': this.staff.company_id,
          'company_sn': this.staff.company_sn,
          'company_name': this.staff.company_name,
          'company_type': this.staff.company_type,
          'link_name': this.staff.link_name,
          'abbrname': this.staff.abbrname,
          'address': this.staff.address,
          'link_phone': this.staff.link_phone,
        }
        return staffModal
      },
      updateAuth(val) {
        this.title = "修改公司"
        this.staffSingle = true
        this.staff.company_id = val.company_id
        this.staff.company_sn = val.company_sn
        this.staff.company_name = val.company_name
        this.staff.abbrname = val.abbrname
        this.staff.company_type = val.company_type
        this.staff.address = val.address
        this.staff.link_name = val.link_name
        this.staff.link_phone = val.link_phone
      },
      deleteAuth(val) {
        this.$Modal.confirm({
          title: '删除确认',
          content: '确定删除该公司吗？',
          okText: '确定',
          cancelText: '取消',
          onOk: () => {
            let params = {
              "company_id":val.company_id
            }
            post('/index/Company/modStatus',params).then((response) => {
              if (response > 0) {
                this.$Notice.success({
                  title: '公司删除',
                  desc: "公司删除成功。",
                });
                this.initialiseIndex(this.page)
              } else {
                this.$Notice.error({
                  title: '公司删除',
                  desc: '公司删除失败。',
                });
              }
            }, err => {
              Common.errNotice(this, err, constant.distributorErrTitle)
            })
          }
        })
      },
      stopCoop() {
        if (this.allList.length === 1) {
          this.$Modal.confirm({
            title: '禁用确认',
            content: '确定禁用该公司吗？',
            okText: '确定',
            cancelText: '取消',
            onOk: () => {
              let params = {
                "company_id":this.allList[0].company_id,
                "is_active":0
              }
              post('/index/Company/modStatus',params).then((response) => {
                if (response > 0) {
                  this.$Notice.success({
                    title: '公司禁用',
                    desc: "公司禁用成功。",
                  });
                  this.initialiseIndex(this.page)
                } else {
                  this.$Notice.error({
                    title: '公司禁用',
                    desc: '公司禁用失败。',
                  });
                }
              }, err => {
                Common.errNotice(this, err, constant.distributorErrTitle)
              })
            }
          })
        } else {
          this.$Notice.error({
            title: '禁用',
            desc: "请单选禁用公司。",
          });
        }
      },
      continueCoop() {
        if (this.allList.length === 1) {
          this.$Modal.confirm({
            title: '启用确认',
            content: '确定启用该公司吗？',
            okText: '确定',
            cancelText: '取消',
            onOk: () => {
              let params = {
                "company_id":this.allList[0].company_id,
                "is_active":1
              }
              post('/index/Company/modStatus',params).then((response) => {
                if (response > 0) {
                  this.$Notice.success({
                    title: '公司启用',
                    desc: "公司启用成功。",
                  });
                  this.initialiseIndex(this.page)
                } else {
                  this.$Notice.error({
                    title: '公司启用',
                    desc: '公司启用失败。',
                  });
                }
              }, err => {
                Common.errNotice(this, err, constant.distributorErrTitle)
              })
            }
          })
        } else {
          this.$Notice.error({
            title: '启用',
            desc: "请单选启用公司。",
          });
        }
      },
      //初始化  当勾选完毕取值
      selectUnit(selection) {
        this.allList = selection
      },
    },
    watch: {
      //监听按钮
      is_active() {
        if (this.is_active === 1) {
          this.coopStatus = true
          this.initialiseIndex(0)
        } else {
          this.coopStatus = false
          this.initialiseIndex(0)
        }
      },
    }
  }
</script>

<style scoped>
  .label {
    text-align: right;
    margin: auto;
  }
</style>
