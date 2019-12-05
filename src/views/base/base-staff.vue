<template>
  <div>
    <row style="margin-bottom: 20px;display:flex;font-size: 15px">
      <i-col span="2" class="label">用户姓名：</i-col>
      <i-col span="3">
        <i-input   v-model="user_name" placeholder="用户姓名"/>
      </i-col>
      <!--      <i-col span="2" class="label">公司名称：</i-col>-->
      <i-col span="2" class="label">&nbsp;</i-col>
      <i-col span="3">
        <!--        <i-input   v-model="company_name" placeholder="公司名称" @on-enter="initialiseIndex(0)"/>-->
      </i-col>

      <!--      <i-col span="2" class="label">公司类别：</i-col>-->
      <i-col span="2" class="label"></i-col>
      <i-col span="3">
        <!--        <i-select   v-model="company_type">-->
        <!--          <i-option v-for="item in company_types" :value="item.code" :key="item.code">{{ item.name }}</i-option>-->
        <!--        </i-select>-->
      </i-col>
      <i-col span="6"></i-col>
      <i-col span="2" align="right">
        <i-button type="primary" @click="initialiseIndex(0)">检索</i-button>
      </i-col>
      <i-col span="1"></i-col>
    </row>
    <row style="margin-bottom: 8px;display:flex;font-size: 15px">
      <i-col span="3">
        <i-button type="primary" @click="addStaff">新增</i-button>
      </i-col>
      <i-col span="21">&nbsp;</i-col>
    </row>
    <row>
      <i-table border :height="tableHeight" :columns="columns" :data="staffs"></i-table>
    </row>
    <div style="text-align: center;padding-top: 5px">
      <Page :current="page" :page-size="num" :total="total" @on-change="pageChange" simple/>
    </div>
    <Modal :title=title :mask-closable="false" v-model="staffSingle" width=80 :loading="loading">
      <i-form ref="refStaff" :model="staff" :rules="checkRules">
        <!--        <row :gutter="16" style="margin-bottom: 20px;display:flex;font-size: 15px">-->
        <!--          <i-col span="2">&nbsp;</i-col>-->
        <!--          <i-col span="9">-->
        <!--            <form-item label="公司id：" prop="company_id">-->
        <!--              <i-input :maxlength="25" v-model="staff.company_id"/>-->
        <!--            </form-item>-->
        <!--          </i-col>-->
        <!--          <i-col span="2">&nbsp;</i-col>-->
        <!--          <i-col span="9">-->
        <!--            <form-item label="公司编号：" prop="company_sn">-->
        <!--              <i-input :maxlength="25" v-model="staff.company_sn"/>-->
        <!--            </form-item>-->
        <!--          </i-col>-->
        <!--          <i-col span="2">&nbsp;</i-col>-->
        <!--        </row>-->
        <!--        <row :gutter="16" style="margin-bottom: 20px;display:flex;font-size: 15px">-->
        <!--          <i-col span="2">&nbsp;</i-col>-->
        <!--          <i-col span="9">-->
        <!--            <form-item label="公司名称：" prop="company_name">-->
        <!--              <i-input :maxlength="25" v-model="staff.company_name"/>-->
        <!--            </form-item>-->
        <!--          </i-col>-->
        <!--          <i-col span="2">&nbsp;</i-col>-->
        <!--          <i-col span="9">-->
        <!--            <form-item label="公司身份类别：" prop="company_type">-->
        <!--              <i-select v-model="staff.company_type">-->
        <!--                <i-option v-for="item in staff.company_types" :value="item.code" :key="item.code">{{ item.name }}-->
        <!--                </i-option>-->
        <!--              </i-select>-->
        <!--            </form-item>-->
        <!--          </i-col>-->
        <!--          <i-col span="2">&nbsp;</i-col>-->
        <!--        </row>-->

        <row :gutter="16" style="margin-bottom: 20px;display:flex;font-size: 15px">
          <i-col span="2">&nbsp;</i-col>
          <i-col span="9">
            <form-item label="公司：" prop="supplier">
              <i-select v-model="staff.supplier"
                        @on-change="jurisdictionMenurChange" :disabled="company_disabled">
                <i-option v-for="item in staff.suppliers" :value="item.company_sn" :key="item.id">
                  {{ item.company_name }}
                </i-option>
              </i-select>
            </form-item>
          </i-col>
          <i-col span="2">&nbsp;</i-col>
          <i-col span="9">
            <form-item label="用户编号：" prop="user_sn">
              <i-input :maxlength="20" v-model="staff.user_sn"/>
            </form-item>
          </i-col>
          <i-col span="2">&nbsp;</i-col>
        </row>
        <row :gutter="16" style="margin-bottom: 20px;display:flex;font-size: 15px">
          <i-col span="2">&nbsp;</i-col>
          <i-col span="9">

            <form-item label="用户：" prop="user_name">
              <i-input :maxlength="20" v-model="staff.user_name"/>
            </form-item>
          </i-col>
          <i-col span="2">&nbsp;</i-col>
          <i-col span="9">
            <form-item label="联系方式：" prop="user_mobile">
              <i-input :maxlength="25" v-model="staff.user_mobile"/>
            </form-item>
          </i-col>
          <i-col span="2">&nbsp;</i-col>
        </row>
        <row :gutter="16" style="margin-bottom: 20px;display:flex;font-size: 15px">
          <i-col span="2">&nbsp;</i-col>
          <i-col span="9">
            <form-item label="权限类别：" prop="user_type">
              <i-select v-model="staff.user_type" :disabled="true">
                <i-option v-for="item in staff.user_types" :value="item.code" :key="item.code">{{ item.name }}
                </i-option>
              </i-select>
            </form-item>
          </i-col>
          <i-col span="2">&nbsp;</i-col>
          <i-col span="9">
            <form-item label="登录密码：" prop="password">
              <i-input :maxlength="25" v-model="staff.password"/>
            </form-item>
          </i-col>
          <i-col span="2">&nbsp;</i-col>
        </row>
      </i-form>
      <div slot="footer">
        <i-button @click="staffSingle = false">取消</i-button>
        <i-button v-if="this.title === '新增公司'" type="primary" @click="createSubmit('add')" v-preventReClick>保存</i-button>
        <i-button v-else type="primary" @click="createSubmit('update')" v-preventReClick>保存</i-button>
      </div>
    </Modal>
    <Spin fix v-show="spinShow">
      <Icon type="load-c" size="30" class="demo-spin-icon-load"></Icon>
      <div>检索中，请稍侯...</div>
    </Spin>
  </div>
</template>

<script>
  import {post} from '../../utils/http'
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
        spinShow: false,
        lc_seats: '',
        user_name: '',
        restPassword: false,
        resetPassword: false,
        seats_flag: true,
        company_disabled: false,
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
        columns: [
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
            title: '用户编号',
            key: 'user_sn',
            align: 'center',
          },
          {
            title: '用户姓名',
            key: 'user_name',
            align: 'center'
          },
          {
            title: '联系方式',
            key: 'user_mobile',
            align: 'center'
          },
          {
            title: '身份类型',
            key: 'user_value',
            align: 'center'
          }
        ],
        is_active: 1,
        page: 0,
        num: constant.pageSize,
        total: 0,
        staff: {
          company_id: '',
          company_sn: '',
          company_name: '',
          company_type: '',
          company_value: '',
          company_types: [{
            "code": 1, "name": "采购商"
          }, {
            "code": 2, "name": "供应商"
          }],
          supplier: '',
          suppliers: [],
          user_sn: '',
          user_name: '',
          user_mobile: '',
          password: '',
          user_type: 2,
          user_value: '',
          user_types: [{
            "code": 1, "name": "管理员"
          }, {
            "code": 2, "name": "普通用户"
          }],
        },
        staffs: [],
        title: '',
        checkRules: {
          company_id: [
            {required: true, message: "公司id为必须输入项。", trigger: "blur"}
          ],
          company_sn: [
            {required: true, message: "公司编号为必须输入项。", trigger: "blur"}
          ],
          company_name: [
            {required: true, message: "公司名称为必须输入项。", trigger: "blur"},
          ],
          // company_type: [
          //   {required: true, message: "公司身份类别为必须选择项。", trigger: "blur"}
          // ],
          user_sn: [
            {required: true, message: "用户编号必须输入项。", trigger: "blur"}
          ],
          user_name: [
            {required: true, message: "用户为必须输入项。", trigger: "blur"}
          ],
          // user_type: [
          //   {required: true, message: "权限类别为必须选择项。", trigger: "blur"}
          // ],
          password: [
            {required: true, message: "登录密码为必须输入项。", trigger: "blur"}
          ],
          user_mobile: [
            { required: true,validator:validatePhone,trigger:'blur'}
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
        post('/index/User/insertUser', staffModal).then((response) => {
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
        if (this.user_name) {
          index.user_name = this.user_name
        }
        post('/index/User/getUser', index).then((response) => {
          this.spinShow = false
          for (let i = 0; i < response.data.length; i++) {
            if (response.data[i].company_type == 0) {
              response.data[i].company_value = "测试账号"
            } else if (response.data[i].company_type == 1) {
              response.data[i].company_value = "采购商"
            } else {
              response.data[i].company_value = "供应商"
            }
            if (response.data[i].user_type == 0) {
              response.data[i].user_value = "测试账号"
            } else if (response.data[i].user_type == 1) {
              response.data[i].user_value = "管理员"
            } else {
              response.data[i].user_value = "普通用户"
            }
          }
          this.staffs = response.data
          this.total = response.count

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
        this.selectAllCompany()
      },

      clearStaff() {
        this.$refs['refStaff'].resetFields();
        this.staff.user_sn = ''
        this.staff.user_name = ''
        this.staff.user_mobile = ''
        // this.staff.user_type = ''
        this.staff.password = ''
      },
      setStaffModal() {
        let staffModal = {
          'company_id': this.staff.company_id,
          'company_sn': this.staff.company_sn,
          'company_name': this.staff.company_name,
          'company_type': this.staff.company_type,
          'user_sn': this.staff.user_sn,
          'user_name': this.staff.user_name,
          'user_mobile': this.staff.user_mobile,
          'user_type': this.staff.user_type,
          'password': this.staff.password,
        }
        return staffModal
      },
      //供应商传参
      jurisdictionMenurChange(val) {
        let params = this.staff.suppliers
        for (let i = 0; i < params.length; i++) {
          if (params[i].company_sn == val) {
            this.staff.company_id = params[i].company_id
            this.staff.company_sn = params[i].company_sn
            this.staff.company_name = params[i].company_name
            this.staff.company_type = params[i].company_type
          }
        }
      },
      selectAllCompany(){
        post('/index/Company/getCompany?is_active=' + this.is_active).then((response) => {
          this.staff.suppliers =response
          //   [{
          //   "company_id": 1,
          //   "company_sn": "010010245",
          //   "company_name": "\u6d59\u6c5f\u8212\u51e1\u7eba\u7ec7\u6709\u9650\u516c\u53f8",
          //   "company_type": 2,
          //   "abbrname": null,
          //   "address": null,
          //   "link_name": "",
          //   "link_phone": "",
          //   "is_active": 1
          // }, {
          //   "company_id": 2,
          //   "company_sn": "010020101",
          //   "company_name": "\u676d\u5dde\u76db\u6cf0\u5bb6\u7eba\u6709\u9650\u516c\u53f8",
          //   "company_type": 2,
          //   "abbrname": null,
          //   "address": null,
          //   "link_name": "",
          //   "link_phone": "",
          //   "is_active": 1
          // }, {
          //   "company_id": 3,
          //   "company_sn": "010010001",
          //   "company_name": "\u6d77\u5b81\u5e02\u65b0\u7a7a\u95f4\u5e03\u4e1a\u6709\u9650\u516c\u53f8",
          //   "company_type": 2,
          //   "abbrname": null,
          //   "address": null,
          //   "link_name": "",
          //   "link_phone": "",
          //   "is_active": 1
          // }, {
          //   "company_id": 4,
          //   "company_sn": "010020014",
          //   "company_name": "\u7ecd\u5174\u5e02\u67ef\u6865\u533a\u9ec4\u96ef\u82f1\u5bbe\u9986\u9152\u5e97\u7528\u54c1\u6709\u9650\u516c\u53f8",
          //   "company_type": 2,
          //   "abbrname": null,
          //   "address": null,
          //   "link_name": "",
          //   "link_phone": "",
          //   "is_active": 1
          // }, {
          //   "company_id": 5,
          //   "company_sn": "010020022",
          //   "company_name": "\u8bf8\u66a8\u5e02\u4e09\u5343\u7eba\u7ec7\u79d1\u6280\u6709\u9650\u516c\u53f8",
          //   "company_type": 2,
          //   "abbrname": null,
          //   "address": null,
          //   "link_name": "",
          //   "link_phone": "",
          //   "is_active": 1
          // }, {
          //   "company_id": 6,
          //   "company_sn": "010020119",
          //   "company_name": "\u6d59\u6c5f\u8c6a\u5e03\u601d\u7eba\u7ec7\u6709\u9650\u516c\u53f8",
          //   "company_type": 1,
          //   "abbrname": null,
          //   "address": null,
          //   "link_name": "",
          //   "link_phone": "",
          //   "is_active": 1
          // }]
          if (parseInt(Cookies.get("company_type")) == 2) {
            let Flag = true
            for (let i = 0; i < this.staff.suppliers.length; i++) {
              if (parseInt(Cookies.get("company_id")) === parseInt(this.staff.suppliers[i].company_id)) {
                Flag = false
                // console.log(this.staff.suppliers[i].company_sn)
                this.company_disabled = true
                this.staff.supplier = this.staff.suppliers[i].company_sn
                this.staff.company_sn = this.staff.suppliers[i].company_sn
                this.staff.company_id = this.staff.suppliers[i].company_id
                this.staff.company_name = this.staff.suppliers[i].company_name
                this.staff.company_type = this.staff.suppliers[i].company_type
              }
            }
            if(Flag){
              this.staff.company_id = ''
              this.staff.company_sn = ''
              this.staff.company_name = ''
              this.staff.company_type = ''
              this.company_disabled = false
            }
          }
        }, err => {
          Common.errNotice(this, err, constant.distributorErrTitle)
        })
      }
    }
  }
</script>

<style scoped>
  .label {
    text-align: right;
    margin: auto;
  }
</style>
