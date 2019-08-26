<template>
  <div>
    <row>
      <i-table   border ref="selection" @on-select-all="selectUnit" @on-select-cancel="selectUnit"
               @on-select="selectUnit" @on-select-all-cancel="selectUnit"
                height="350" :columns="columns" :data="serviceProviders"></i-table>
      <label v-if="isShow" style="color: #ff3660">已确认商品再次勾选会自动过滤</label>
      <br><br>
      <i-button v-if="isShow" @click="commodityConfirmation">商品确认</i-button>
    </row>
    <Modal title="安排生产计划" :mask-closable="false" v-model="productionPlanningFlag" width=50>
      <i-form>
        <row :gutter="16">
          <i-col span="2">&nbsp;</i-col>
          <i-col span="7">
            <form-item label="机台：" prop="mac">
              <i-select v-model="mac" @on-change="jurisdictionMenurChange">
                <i-option v-for="item in macs" :value="item.mac_sn" :key="item.mac_sn">
                  {{ item.mac_name }}
                </i-option>
              </i-select>
            </form-item>
          </i-col>
          <i-col span="4">&nbsp;</i-col>
          <i-col span="7">
            <form-item label="生产开始日期：" prop="start_date">
              <DatePicker type="date" v-model="start_date" placeholder="请选择生产开始日期"></DatePicker>
            </form-item>

          </i-col>
          <i-col span="2">&nbsp;</i-col>
        </row>
        <row :gutter="16">
          <i-col span="2">&nbsp;</i-col>
          <i-col span="7">
            <form-item label="生产结束日期：" prop="order_date">
              <DatePicker type="date" v-model="end_date" placeholder="请选择生产结束日期"></DatePicker>
            </form-item>
          </i-col>
          <i-col span="4">&nbsp;</i-col>
          <i-col span="7">
            <form-item label="本次生产数量：" prop="counts">
              <!--              <InputNumber v-model="counts" style="width: 188px"  @blur.native.capture="check_price()"/>-->
              <InputNumber v-model="counts" style="width: 188px" v-on:input="check_price()"/>
            </form-item>
          </i-col>
          <i-col span="2">&nbsp;</i-col>
        </row>
      </i-form>
      <div slot="footer">
        <i-button @click="productionPlanningFlag = false">关闭</i-button>
        <i-button type="primary" @click="createSubmit">保存</i-button>
      </div>
    </Modal>
  </div>
</template>
<script>
  import {post} from '@/utils/http'
  import Common from "@/utils/common";
  import {constant} from '@/constant/constant'

  export default {
    props: {
      row: Number,
      type: Number,
      order_sn: String
    },
    data() {
      return {
        // <--------------------          基础变量          -------------------->
        tableHeight: '',
        selectList: [],
        isShow: false,
        productionPlanningFlag: false,
        titleNumber: 0,
        titlePlan: 0,
        order_id: '',
        rec_id: '',
        mac_id: '',
        mac_sn: '',
        mac: '',
        macs: [],
        start_date: '',
        end_date: '',
        counts: 0,
        //<--------------------          表格头布局          -------------------->
        serviceProviders: [],
        columns1: [
          {
            type: 'selection',
            width: 60,
            align: 'center',
          },
          {
            title: '商品编码',
            key: 'goods_sn',
            align: 'center'
          },
          {
            title: '商品名称',
            key: 'goods_name',
            align: 'center'
          },
          {
            title: '规格型号',
            key: 'goods_spec',
            align: 'center'
          },
          {
            title: '幅宽',
            key: 'goods_width',
            align: 'center'
          },
          {
            title: '颜色',
            key: 'goods_color',
            align: 'center'
          },
          {
            title: '布纹',
            key: 'money',
            align: 'center'
          },
          {
            title: '单位',
            key: 'goods_unit',
            align: 'center'
          },
          {
            title: '订单数量',
            key: 'amount_qty',
            align: 'center'
          },
          {
            title: '计划数量',
            key: 'plan_qty',
            align: 'center'
          },
          {
            title: '商品状态',
            key: 'confirm_status',
            align: 'center',
            render: (h, params) => {
              if (params.row.confirm_status == 0) {
                return h('div', [
                  h(
                    "span", {
                      props: {
                        value: params.row.taxprice,
                        transfer: true,  //select不受body显示，以免显示不出来
                      }
                    },
                  ), "未确认"]);
              } else if (params.row.confirm_status == 1) {
                return h('div', [
                  h(
                    "span", {
                      props: {
                        value: params.row.taxprice,
                        transfer: true,  //select不受body显示，以免显示不出来
                      }
                    },
                  ), "已驳回"]);
              } else {
                return h('div', [
                  h(
                    "span", {
                      props: {
                        value: params.row.taxprice,
                        transfer: true,  //select不受body显示，以免显示不出来
                      }
                    },
                  ), "已确认"]);
              }
            }
          },
          {
            title: '操作',
            align: 'center',
            render: (h, params) => {
              if (params.row.confirm_status == 2) {
                return h('div', [
                  h('Button', {
                    props: {
                      type: 'warning',
                      size: 'small'
                    },
                    on: {
                      click: () => {
                        this.productionPlanning(params.index, params.row)
                      }
                    }
                  }, '安排生产计划')
                ]);
              } else {
                return h('div', [
                  h('Button', {
                    props: {
                      type: 'warning',
                      size: 'small',
                      disabled: true
                    },
                  }, '安排生产计划')
                ]);
              }
            }
          }
        ],
        columns2: [
          {
            title: '商品编码',
            key: 'goods_sn',
            align: 'center'
          },
          {
            title: '商品名称',
            key: 'goods_name',
            align: 'center'
          },
          {
            title: '规格型号',
            key: 'goods_spec',
            align: 'center'
          },
          {
            title: '幅宽',
            key: 'goods_width',
            align: 'center'
          },
          {
            title: '颜色',
            key: 'goods_color',
            align: 'center'
          },
          {
            title: '布纹',
            key: 'money',
            align: 'center'
          },
          {
            title: '单位',
            key: 'goods_unit',
            align: 'center'
          },
          {
            title: '订单数量',
            key: 'amount_qty',
            align: 'center'
          },
          {
            title: '计划数量',
            key: 'plan_qty',
            align: 'center'
          },
          {
            title: '商品状态',
            key: 'confirm_status',
            align: 'center',
            render: (h, params) => {
              if (params.row.confirm_status == 0) {
                return h('div', [
                  h(
                    "span", {
                      props: {
                        value: params.row.taxprice,
                        transfer: true,  //select不受body显示，以免显示不出来
                      }
                    },
                  ), "未确认"]);
              } else if (params.row.confirm_status == 1) {
                return h('div', [
                  h(
                    "span", {
                      props: {
                        value: params.row.taxprice,
                        transfer: true,  //select不受body显示，以免显示不出来
                      }
                    },
                  ), "已驳回"]);
              } else {
                return h('div', [
                  h(
                    "span", {
                      props: {
                        value: params.row.taxprice,
                        transfer: true,  //select不受body显示，以免显示不出来
                      }
                    },
                  ), "已确认"]);
              }
            }
          }
        ],
        columns: [],
        // checkRules: {
        //   mac: [
        //     {required: true, message: '机台为必输项。', trigger: 'blur'}
        //   ],
        //   counts: [
        //     {required: true, message: '本次生产数量为必输项。', trigger: 'blur'}
        //   ],
        //   start_date: [
        //     {required: true, type: 'date', message: '生产开始日期为必选项', trigger: 'change'}
        //   ],
        //   order_date: [
        //     {required: true, type: 'date', message: '生产结束日期为必选项', trigger: 'change'}
        //   ]
        // }
      }
    },
    mounted() {
      //根据状态判断显示那个表头
      if (this.type === 1) {
        this.isShow = true
        this.columns = this.columns1
      } else {
        this.isShow = false
        this.columns = this.columns2
      }
      //初始化
      this.initialiseIndex()
      this.getMac();
    },
    methods: {
      initialiseIndex() {
        post('/index/Order/getOrderGoods?order_id=' + this.row).then((response) => {
          this.serviceProviders = response
        }, err => {
          Common.errNotice(this, err, constant.distributorErrTitle)
        })
      },
      //获取机台
      getMac() {
        post('/index/BaseData/getMac').then((response) => {
          if (response === constant.distributorErrkCode1 || response === constant.distributorErrkCode2) {
            Common.errNotice(this, constant.distributorErrTitle2, constant.distributorErrTitle1)
          } else {
            this.macs = response
          }
        }, err => {
          Common.errNotice(this, err, constant.distributorErrTitle1)
        })
      },
      //商品确认
      commodityConfirmation() {
        if (this.selectList.length === 0) {
          this.$Notice.error({
            title: '商品确认',
            desc: '请勾选您要确认的商品！',
          });
        } else {
          let params = this.selectList
          let goods_id = []
          for (let i = 0; i < params.length; i++) {
            if (params[i].confirm_status !== 2)
              goods_id.push(params[i].goods_id)
          }
          if (goods_id.length === 0) {
            this.$Notice.error({
              title: '商品重复确认',
              desc: '请勾选未确认的商品！',
            });
          } else {
            let index = {
              "order_id": this.row,
              "goods_ids": goods_id.join(",")
            }
            post('/index/Order/confirmOrder', index).then((response) => {
              if (response > 0) {
                this.$Notice.success({
                  title: '商品确认',
                  desc: '商品确认成功！',
                });
                this.initialiseIndex()
              }
            }, err => {
              Common.errNotice(this, err, constant.distributorErrTitle)
            })
          }
        }
      },
      //当勾选完毕取值
      selectUnit(selection) {
        this.selectList = selection
      },
      //打开model
      productionPlanning(index, row) {
        let difference = row.amount_qty - row.plan_qty
        if (difference == 0) {
          this.$Notice.error({
            title: '安排生产',
            desc: "您的订单数量已经全部安排！",
          });
        } else {
          this.order_id = row.order_id
          this.rec_id = row.rec_id
          this.titleNumber = row.amount_qty
          this.titlePlan = row.plan_qty
          this.clearRefConfigTable()
          this.productionPlanningFlag = true
        }

      },
      check_price() {
        let difference = this.titleNumber - this.titlePlan
        if (this.counts > difference) {
          this.counts = this.titleNumber - this.titlePlan
          this.$Notice.error({
            title: '生产数量超出',
            desc: "本次计划数量不能超出总数！ " + '<br>' + " 当前可计划总数：" + difference
          });

        }
      },
      createSubmit() {
        if(this.mac == ''){
          this.$Notice.error({
            title: '请选择机台',
          });
          return
        }
        if(this.start_date == ''){
          this.$Notice.error({
            title: '请选择生产开始日期',
          });
          return
        }
        if(this.end_date == ''){
          this.$Notice.error({
            title: '请选择生产结束日期',
          });
          return
        }
        if(this.counts == ''){
          this.$Notice.error({
            title: '请输入本次生产数量',
          });
          return
        }
        this.productionPlanningSave()
      },
      //保存生产计划
      productionPlanningSave() {

        let params = {}
        params.order_id = this.order_id
        params.rec_id = this.rec_id
        params.order_sn = this.order_sn
        params.order_id = this.order_id
        params.plan_qty = this.counts
        params.plan_begin = Common.formatDate(this.start_date, "yyyy-MM-dd")
        params.plan_end = Common.formatDate(this.end_date, "yyyy-MM-dd")
        params.mac_id = this.mac_id
        params.mac_sn = this.mac_sn
        let difference = this.titleNumber - this.titlePlan
        if (this.counts > difference) {
          this.$Notice.error({
            title: '生产数量超出',
            desc: "本次计划数量不能超出总数！ " + '<br>' + " 当前可计划总数：" + difference
          });
        } else {
          post('/index/Produce/insertPlan', params).then((response) => {
            if (response > 0) {
              this.$Notice.success({
                title: '安排生产计划',
                desc: "本次安排生产计划成功！",
              });
              this.productionPlanningFlag = false
              this.initialiseIndex()
            }
          }, err => {
            Common.errNotice(this, err, constant.distributorErrTitle)
          })
        }
      },
      //机台传参
      jurisdictionMenurChange(val) {
        let params = this.macs
        for (let i = 0; i < params.length; i++) {
          if (params[i].mac_sn == val) {
            this.mac_id = params[i].mac_id
            this.mac_sn = params[i].mac_sn
          }
        }
      },
      clearRefConfigTable() {
        // this.$refs['refConfigTable'].resetFields();
        this.mac = ''
        this.start_date = ''
        this.end_date = ''
        this.counts = 0

      }
    }
  };
</script>


<style scoped>
  * {
    margin: 0;
    padding: 0;
  }

</style>