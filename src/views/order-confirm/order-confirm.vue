<template>
  <div>
    <row :gutter="16" style="margin-bottom: 20px;display:flex;font-size: 15px">
      <i-col span="3" class="label">订单号编号：</i-col>
      <i-col span="4">
        <i-input v-model="order_sn" placeholder="请输入采购订单号"/>
      </i-col>
      <i-col span="3" class="label">单据日期：</i-col>
      <i-col span="4">
        <DatePicker type="daterange" v-model="order_date" placeholder="请输入单据日期" style="width: 200px"></DatePicker>
      </i-col>
      <i-col span="3" class="label">确认状态：</i-col>
      <i-col span="4">
        <i-select clearable v-model="confirm_status">
          <i-option v-for="item in confirm_statuss" :value="item.code" :key="item.code">{{ item.name }}
          </i-option>
        </i-select>
      </i-col>
      <i-col span="3">
      </i-col>
    </row>
    <br>
    <row :gutter="16" style="margin-bottom: 20px;display:flex;font-size: 15px">
      <i-col span="3" class="label">排产状态：</i-col>
      <i-col span="4">
        <i-select  clearable  v-model="plan_status">
          <i-option v-for="item in plan_statuss" :value="item.code" :key="item.code">{{ item.name }}
          </i-option>
        </i-select>
      </i-col>
      <i-col span="3" class="label"></i-col>
      <i-col span="4">
      </i-col>
      <i-col span="3" class="label"></i-col>
      <i-col span="4">
      </i-col>
      <i-col span="3">
        <i-button type="primary" @click="initialiseIndex(0)">检索</i-button>
      </i-col>
    </row>
    <br>
    <row>
      <i-table border :height="tableHeight" :columns="columns" :data="serviceProviders"></i-table>
    </row>
    <row>
      <i-col span="24" style="text-align: center">
        <Page :current="pageMax" :page-size="numMax" :total="totalMax" @on-change="pageChange" simple/>
      </i-col>
    </row>
    <Spin fix v-show="spinShow">
      <Icon type="load-c" size="30" class="demo-spin-icon-load"></Icon>
      <div>检索中，请稍侯...</div>
    </Spin>
  </div>
</template>

<script>

  import {post} from '@/utils/http'
  import {constant} from '@/constant/constant'
  import Common from "@/utils/common";
  import TableExpand from '@/views/order-confirm/confirm-table-expand'

  export default {
    name: 'Ueditor',
    inject: ['reload'],
    data() {
      return {
        // <--------------------          基础变量          -------------------->
        confirm_status: '',
        confirm_statuss: [{
          "code": 1, "name": "未确认"
        }, {
          "code": 2, "name": "部分确认"
        }, {
          "code": 3, "name": "完成确认"
        }],
        plan_status: '',
        plan_statuss: [{
          "code": 1, "name": "未排产"
        }, {
          "code": 2, "name": "部分排产"
        }, {
          "code": 3, "name": "完成排产"
        }],
        spinShow: false,
        retrievalDeliverySingle: false,
        retrievalDeliveryNote: [],
        retrievalTableHeight: '',
        order_sn: '',
        order_date: '',
        other_party_name: '',
        contract_name: '',
        name: '',
        goods_sn: '',
        goods_name: '',
        loading: true,
        // 每页显示条目个数
        numMax: constant.pageSize,
        // 当前页数
        pageMax: 1,
        // 总个数
        totalMax: 0,
        tableHeight: '',
        //<--------------------          表格头布局          -------------------->
        columns: [
          {
            title: '行号',
            key: 'order_id',
            align: 'center'
          }, {
            title: '订单编号',
            key: 'order_sn',
            align: 'center'
          },
          {
            title: '单据日期',
            key: 'order_date',
            align: 'center',
            render: function (h, params) {
              return h('div', Common.formatDate(new Date(this.row.order_date), 'yyyy-MM-dd'))
            }
          },
          {
            title: '供应商编码',
            key: 'company_sn',
            align: 'center'
          },
          {
            title: '供应商名称',
            key: 'company_name',
            align: 'center'
          },
          {
            title: '操作',
            type: 'expand',
            align: 'center',
            render: (h, params) => {
              return h(TableExpand, {
                props: {
                  row: params.row.order_id,
                  type: 1,
                  order_sn: params.row.order_sn
                },
              }, "查看")
            }
          }
        ],
        serviceProviders: [],
      }
    },
    mounted() {
      // Common.isTokenUndefined(this)
      if (Common.isTokenUndefined(this) == false) {
        this.$router.push('/')
        return
      } else {
        this.tableHeight = document.documentElement.clientHeight - 340
        this.initialiseIndex(0)
      }
    },
    methods: {
      //<--------------------          增删改查翻页          -------------------->
      //初始化页面
      initialiseIndex(page) {
        this.spinShow = true
        this.pageMax = page + 1
        let index = {
          "num": this.numMax,
          "page": page
        }
        if (this.order_sn) {
          index.order_sn = this.order_sn
        }
        if (this.plan_status) {
          index.is_plan = this.plan_status
        }
        if (this.confirm_status) {
          index.is_confirm = this.confirm_status
        }
        if (this.order_date != ',') {
          index.start_date = Common.formatDate(this.order_date[0], "yyyy-MM-dd")
          index.end_date = Common.formatDate(this.order_date[1], "yyyy-MM-dd")
        }
        post('/index/Order/getOrder', index).then((response) => {
          this.spinShow = false
          this.totalMax = response.count
          this.serviceProviders = response.data
        }, err => {
          Common.errNotice(this, err, constant.distributorErrTitle)
        })
      },
      pageChange(value) {
        this.initialiseIndex(value - 1)
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
