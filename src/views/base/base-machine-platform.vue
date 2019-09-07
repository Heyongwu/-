<template>
  <div>
    <row :gutter="16" style="margin-bottom: 20px;display:flex;font-size: 15px">
      <i-col span="3" class="label">编号：</i-col>
      <i-col span="4">
        <i-input   v-model="mac_sn" placeholder="请输入编号"/>
      </i-col>
      <i-col span="3" class="label">机台状态：</i-col>
      <i-col span="4">
        <i-select   v-model="is_active">
          <i-option v-for="item in is_actives" :value="item.code" :key="item.code">{{ item.name }}
          </i-option>
        </i-select>
      </i-col>
      <i-col span="3" class="label">&nbsp;</i-col>
      <i-col span="4">
      </i-col>
      <i-col span="3">
        <i-button type="primary" @click="initialiseIndex()">检索</i-button>
      </i-col>
    </row>
    <br>
    <row>
      <i-col span="3">
        <i-button type="primary" @click="addServiceProvider">新增</i-button>
      </i-col>
      <i-col span="21">&nbsp;</i-col>
    </row>
    <br>
    <row>
      <i-table border :height="tableHeight" :columns="columns" :data="machineList"></i-table>
    </row>
    <!--    <row>-->
    <!--      <i-col span="24" style="text-align: center">-->
    <!--        <Page :current="pageNum" :page-size="pageSize" :total="total" @on-change="pageChange" simple/>-->
    <!--      </i-col>-->
    <!--    </row>-->
    <Modal :title=title :mask-closable="false" v-model="machine" width=80 :loading="loading">
      <i-form :rules="checkRules" ref="refServiceProvider" :model="machinePlatform">
        <row>
          <i-col span="2">&nbsp;</i-col>
          <i-col span="9">
            <form-item label="机台编号：" prop="mac_sn">
              <i-input :maxlength="100" v-model="machinePlatform.mac_sn"/>
            </form-item>
          </i-col>
          <i-col span="2">&nbsp;</i-col>
          <i-col span="9">
            <form-item label="机台名称" prop="mac_name">
              <i-input :maxlength="100" v-model="machinePlatform.mac_name"/>
            </form-item>
          </i-col>
          <i-col span="2">&nbsp;</i-col>
        </row>
        <row>
          <i-col span="2">&nbsp;</i-col>
          <i-col span="9">
            <form-item label="每日产能：" prop="capacity">
              <i-input :maxlength="100" v-model="machinePlatform.capacity"/>
            </form-item>
          </i-col>
          <i-col span="2">&nbsp;</i-col>
          <i-col span="9">
            <form-item label="单位：" prop="unit">
              <i-input :maxlength="100" v-model="machinePlatform.unit"/>
            </form-item>
          </i-col>
          <i-col span="2">&nbsp;</i-col>
        </row>
        <row>
          <i-col span="2">&nbsp;</i-col>
          <i-col span="3">
            <form-item label="每日开始工作时间：" prop="work_begin">
              <TimePicker v-model="machinePlatform.work_begin" format="HH:mm" placeholder="请选择每日开始工作时间"
                          style="width: 250px"></TimePicker>
            </form-item>
          </i-col>
          <i-col span="2">&nbsp;</i-col>
          <i-col span="3">
            <form-item label="每日结束工作时间：" prop="work_end">
              <TimePicker v-model="machinePlatform.work_end" format="HH:mm" placeholder="请选择每日结束工作时间"
                          style="width: 250px"></TimePicker>
            </form-item>
          </i-col>
          <i-col span="3">&nbsp;</i-col>
          <i-col span="2">
            <form-item label="机台状态：" prop="is_active">
              <RadioGroup v-model="machinePlatform.is_active" size="large">
                <Radio v-for="item in machinePlatform.is_actives" :label='item.code' :key="item.code">{{item.name}}
                </Radio>
              </RadioGroup>
            </form-item>
          </i-col>
          <i-col span="2">&nbsp;</i-col>
        </row>
      </i-form>
      <div slot="footer">
        <i-button @click="machine = false">取消</i-button>
        <i-button type="primary" @click="addSaveServiceProvider()">保存</i-button>
      </div>
    </Modal>
    <Spin fix v-show="spinShow">
      <Icon type="load-c" size="30" class="demo-spin-icon-load"></Icon>
      <div>检索中，请稍侯...</div>
    </Spin>
  </div>
</template>

<script>

  import {post} from '@/utils/http'
  import {baseURL} from '@/IPconfig'
  import {constant} from '@/constant/constant'
  import Common from "@/utils/common";

  export default {
    data() {
      return {
        // <--------------------          基础变量          -------------------->

        machine: false,
        spinShow: false,
        code: '',
        state: null,
        title: "新增机台",
        tableHeight: '',
        loading: true,
        // 每页显示条目个数
        pageSize: constant.pageSize,
        // 当前页数
        pageNum: 1,
        // 总个数
        total: 0,
        page: '',
        mac_sn: '',
        is_active: '',
        is_actives: [{code: 1, name: "启用"}, {code: 2, name: "停用"}],
        machinePlatform: {
          mac_id: '',
          mac_sn: '',
          mac_name: '',
          capacity: '',
          unit: '',
          work_begin: '',
          work_end: '',
          is_active: 1,
          is_actives: [{code: 1, name: "启用"}, {code: 2, name: "停用"}],
        },
        //<--------------------          表格头布局          -------------------->
        columns: [
          {
            title: '机台编号',
            key: 'mac_sn',
            align: 'center'
          },
          {
            title: '机台名称',
            key: 'mac_name',
            align: 'center'
          },
          {
            title: '每日产能',
            key: 'capacity',
            align: 'center'
          },
          {
            title: '工作开始时间',
            key: 'work_begin',
            align: 'center'
          },
          {
            title: '工作结束时间',
            key: 'work_end',
            align: 'center'
          },
          {
            title: '当前状态',
            key: 'is_active_name',
            align: 'center'
          },
          {
            title: '操作',
            align: 'center',
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'primary',
                    size: 'small',
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.enableMachinePlatform(params.row)
                    }
                  }
                }, '启用'),
                h('Button', {
                  props: {
                    type: 'error',
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      this.discontinueMachinePlatform(params.row)
                    }
                  }
                }, '停用')
              ]);
            }
          }
        ],
        machineList: [],
        //<--------------------          增改modal check          -------------------->
        checkRules: {
          mac_sn: [
            {required: true, message: "机台编号为必输项。", trigger: "blur"}
          ],
          mac_name: [
            {required: true, message: "机台名称为必输项。", trigger: "blur"}
          ],
          capacity: [
            {required: true, message: "每日产能为必输项。", trigger: "blur"}
          ],
          unit: [
            {required: true, message: "单位为必输项。", trigger: "blur"}
          ],
          work_begin: [
            {required: true, message: "每日开始工作时间为必输项。", trigger: "change"}
          ],
          work_end: [
            {required: true, message: "每日结束工作时间为必输项。", trigger: "change"}
          ]
        }
      }
    },
    mounted() {
      if (Common.isTokenUndefined(this) == false) {
        this.$router.push('/')
        return
      } else {
        this.tableHeight = document.documentElement.clientHeight - 315
        this.initialiseIndex()
      }
    },
    methods: {
      //<--------------------          增删改查翻页          -------------------->
      //初始化页面
      initialiseIndex() {
        this.spinShow = true
        let params = {}
        if (this.mac_sn) {
          params.mac_sn = this.mac_sn
        }
        if (this.is_active) {
          params.is_active = this.is_active
        }
        post('/index/BaseData/getMac', params).then((response) => {
          this.spinShow = false
          if (response === constant.distributorErrkCode1 || response === constant.distributorErrkCode2) {
            Common.errNotice(this, constant.distributorErrTitle2, constant.distributorErrTitle1)
          } else {
            for (let i = 0; i < response.length; i++) {
              if (response[i].is_active === 1) {
                response[i].is_active_name = "已启用"
              } else {
                response[i].is_active_name = "已停用"
              }
            }
            this.machineList = response
          }
        }, err => {
          Common.errNotice(this, err, constant.distributorErrTitle1)
        })
      },
      //新增保存
      addSaveServiceProvider() {
        this.loading = false;
        this.$nextTick(() => {
          this.loading = true;
        });
        this.$refs['refServiceProvider'].validate((valid) => {
          if (valid) {
            let serviceProviderModal = this.setServiceProviderModal()
            post('/index/BaseData/macInsert', serviceProviderModal).then((response) => {
              if (response === constant.distributorOkCode) {
                Common.infoNotice(this, this.machinePlatform.mac_name + ' 机台新增成功。', '新增机台')
                this.clearServiceProvider()
                this.machine = false
                this.initialiseIndex()
              } else {
                Common.errNotice(this, constant.distributorErrTitle2, constant.distributorErrTitle1)
              }
            }, err => {
              Common.errNotice(this, err, constant.distributorErrTitle1)
            })
          }
        })

      },
      pageChange(value) {
        this.getServiceProviders(value)
      },
      //<--------------------          清空取消和存储参数的modal          -------------------->
      //新增跳转
      addServiceProvider() {
        this.machine = true
        this.clearServiceProvider()
      },
      //新增时清空页面
      clearServiceProvider() {
        this.$refs['refServiceProvider'].resetFields();
        this.machinePlatform.mac_sn = ''
        this.machinePlatform.mac_name = ''
        this.machinePlatform.unit = ''
        this.machinePlatform.capacity = ''
        this.machinePlatform.work_begin = ''
        this.machinePlatform.work_end = ''
      },
      setServiceProviderModal() {
        let serviceProviderModal = {
          "mac_sn": this.machinePlatform.mac_sn,
          "mac_name": this.machinePlatform.mac_name,
          "capacity": this.machinePlatform.capacity,
          "unit": this.machinePlatform.unit,
          "work_begin": this.machinePlatform.work_begin,
          "work_end": this.machinePlatform.work_end,
          "is_active": this.machinePlatform.is_active
        }
        return serviceProviderModal
      },
      //启用
      enableMachinePlatform(val) {
        let params = {}
        params.mac_id = val.mac_id
        params.is_active = 1
        this.$Modal.confirm({
          title: '启用确认',
          content: '是否启用该机台？',
          okText: '确定',
          cancelText: '取消',
          onOk: () => {
            post('/index/BaseData/modStatus', params).then((response) => {
              if (response === 1) {
                Common.infoNotice(this, val.mac_name + ' 机台启用成功。', '启用机台')
                this.initialiseIndex()
              }else{
                Common.errNotice(this, "请勿重复启用", constant.distributorErrTitle1)
              }
            }, err => {
              Common.errNotice(this, err, constant.distributorErrTitle1)
            })
          }
        })

      },
      //停用
      discontinueMachinePlatform(val) {
        let params = {}
        params.mac_id = val.mac_id
        params.is_active = 2
        this.$Modal.confirm({
          title: '关闭确认',
          content: '是否关闭该机台？',
          okText: '确定',
          cancelText: '取消',
          onOk: () => {
            post('/index/BaseData/modStatus', params).then((response) => {
              if (response === 1) {
                Common.infoNotice(this, val.mac_name + ' 机台关闭成功。', '关闭机台')
                this.initialiseIndex()
              }else {
                Common.errNotice(this,"请勿重复禁用" , constant.distributorErrTitle1)
              }
            }, err => {
              Common.errNotice(this, err, constant.distributorErrTitle1)
            })
          }
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
