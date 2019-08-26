<template>
  <div>
    <row>
      <i-table border ref="selection" @on-select-all="selectUnit" @on-select-cancel="selectUnit"
               @on-select="selectUnit" @on-select-all-cancel="selectUnit"
               :height="tableHeight" :columns="columns" :data="serviceProviders"></i-table>
<!--      <label v-if="isShow" style="color: #ff3660">已确认商品再次勾选会自动过滤</label>-->
<!--      <br><br>-->
<!--      <i-button v-if="isShow" @click="commodityConfirmation">商品确认</i-button>-->
    </row>
<!--  -->
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
        counts: 0,
        start_date: '',
        end_date: '',
        order_id: '',
        rec_id: '',
        mac_id: '',
        mac_sn: '',
        mac: '',
        macs: [],
        //<--------------------          表格头布局          -------------------->
        serviceProviders: [],
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
        columns:[]
      }
    },
    mounted() {
      //根据状态判断显示那个表头
        this.columns = this.columns2
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
        let difference =  row.amount_qty - row.plan_qty
        if(difference == 0){
          this.$Notice.error({
            title: '安排生产',
            desc: "您的订单数量已经全部安排！",
          });
        }else{
          this.order_id = row.order_id
          this.rec_id = row.rec_id
          this.counts = 0
          this.mac = ''
          this.start_date = ''
          this.end_date = ''
          this.titleNumber = row.amount_qty
          this.titlePlan = row.plan_qty
          this.productionPlanningFlag = true
        }

      },
      check_price() {
        let difference =  this.titleNumber - this.titlePlan
        if (this.counts > difference) {
          this.counts = this.titleNumber - this.titlePlan
          this.$Notice.error({
            title: '生产数量超出',
            desc: "本次计划数量不能超出总数！ "+ '<br>'+ " 当前可计划总数："+difference
          });

        }
      },
      //保存生产计划
      productionPlanningSave() {
        let params = {}
        params.order_id = this.order_id
        params.rec_id = this.rec_id
        params.order_sn = this.order_sn
        params.order_id = this.order_id
        params.plan_qty = this.counts
        params.plan_begin =  Common.formatDate(this.start_date, "yyyy-MM-dd")
        params.plan_end =  Common.formatDate(this.end_date, "yyyy-MM-dd")
        params.mac_id = this.mac_id
        params.mac_sn = this.mac_sn
        let difference =  this.titleNumber - this.titlePlan
        if(this.counts > difference){
          this.$Notice.error({
            title: '生产数量超出',
            desc: "本次计划数量不能超出总数！ "+ '<br>'+ " 当前可计划总数："+difference
          });
        }else{
          post('/index/Produce/insertPlan', params).then((response) => {
            if(response>0){
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
    }
  };
</script>
<style>
  .widthLess {
    width: 265px;
  }
</style>