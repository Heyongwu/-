<template>
  <div>
    <row :gutter="16" style="margin-bottom: 20px;display:flex;font-size: 15px">
      <i-col span="3" class="label">订单号编号：</i-col>
      <i-col span="4">
        <i-input clearable v-model="order_sn" placeholder="请输入采购订单号"/>
      </i-col>
      <i-col span="3" class="label">单据日期：</i-col>
      <i-col span="4">
        <DatePicker type="date" v-model="order_date" placeholder="请输入单据日期" style="width: 200px"></DatePicker>
      </i-col>
      <i-col span="3" class="label">&nbsp;</i-col>
      <i-col span="4">
      </i-col>
      <i-col span="3">
        <i-button type="primary" @click="initialiseIndex(0)">检索</i-button>
      </i-col>
    </row>
    <br>
    <row :gutter="16">
      <i-col span="3">
        <!--        <i-button type="primary" @click="addServiceProviders()">新增</i-button>-->
      </i-col>
    </row>
    <br>
    <br>
    <row>
      <i-table border :height="tableHeight" :columns="columns" :data="serviceProviders"></i-table>
    </row>
    <row>
      <i-col span="24" style="text-align: center">
        <Page :current="pageMax" :page-size="numMax" :total="totalMax" @on-change="pageChange" simple/>
      </i-col>
    </row>
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
        retrievalDeliverySingle: false,
        retrievalDeliveryNote: [],
        retrievalTableHeight: '',
        header: {token: ''},
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
        this.tableHeight = document.documentElement.clientHeight - 320
        this.initialiseIndex(0)
      }
    },
    methods: {
      //<--------------------          增删改查翻页          -------------------->
      //初始化页面
      initialiseIndex(page) {
        this.pageMax = page + 1
        let index = {
          "num": this.numMax,
          "page": page
        }
        if (this.order_sn) {
          index.order_sn = this.order_sn
        }
        if (this.order_date) {
          index.order_date = Common.formatDate(this.order_date, "yyyy-MM-dd")
        }
        post('/index/Order/getOrder', index).then((response) => {
          this.totalMax = response.count
          this.serviceProviders = response.data
        }, err => {
          Common.errNotice(this, err, constant.distributorErrTitle)
        })
      },
      pageChange(value) {
        this.initialiseIndex(value - 1)
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
