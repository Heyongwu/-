<template>
  <div>
    <row style="margin-bottom: 20px;display:flex;font-size: 15px">
      <i-col span="2" class="label">公司名称或编号：</i-col>
      <i-col span="3">
        <i-input   v-model="strs" placeholder="请输入公司名称或编号"/>
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
<!--        <i-button type="primary" @click="addStaff">新增</i-button>-->
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
        <row :gutter="16" style="margin-bottom: 20px;display:flex;font-size: 15px">
          <i-col span="2">&nbsp;</i-col>
          <i-col span="9">
            <form-item label="公司id：" prop="company_id">
              <i-input :maxlength="25" v-model="staff.company_id" disabled/>
            </form-item>
          </i-col>
          <i-col span="2">&nbsp;</i-col>
          <i-col span="9">
            <form-item label="公司编号：" prop="company_sn">
              <i-input :maxlength="25" v-model="staff.company_sn"/>
            </form-item>
          </i-col>
          <i-col span="2">&nbsp;</i-col>
        </row>
        <row :gutter="16" style="margin-bottom: 20px;display:flex;font-size: 15px">
          <i-col span="2">&nbsp;</i-col>
          <i-col span="9">
            <form-item label="公司名称：" prop="company_name">
              <i-input :maxlength="25" v-model="staff.company_name"/>
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
        columns: [
          // {
          //   title: '编号',
          //   key: 'code',
          //   align: 'left',
          //   width: 160
          // },
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
          }
        ],
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
          address: '',
          link_name: '',
          link_phone: ''
        },
        staffs: [],
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
        if(Common.isNullOrUndefined(staffModal.company_type) == false){
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
        if(this.strs){
          index.strs = this.strs
        }
        post('/index/Company/getCompany', index).then((response) => {
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
          'address': this.staff.address,
          'link_phone': this.staff.link_phone,
        }
        return staffModal
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
