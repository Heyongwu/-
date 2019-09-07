<template>
  <div>
    <row :gutter="16" style="margin-bottom: 20px;display:flex;font-size: 15px">
      <i-col span="3" class="label">商品编号：</i-col>
      <i-col span="4">
        <i-input   v-model="goods_sn" placeholder="请输入编号"/>
      </i-col>
      <i-col span="3" class="label">&nbsp;</i-col>
      <i-col span="4">
      </i-col>
      <i-col span="3" class="label">&nbsp;</i-col>
      <i-col span="4">
      </i-col>
      <i-col span="3">
        <i-button type="primary" @click="initialiseIndex(0)">检索</i-button>
      </i-col>
    </row>
    <br>
    <row>
      <i-col span="3">
        <!--        <i-button type="primary" @click="addServiceProvider">新增</i-button>-->
      </i-col>
      <i-col span="21">&nbsp;</i-col>
    </row>
    <br>
    <row>
      <i-table border :height="tableHeight" :columns="columns"
               :data="serviceProviders"></i-table>
    </row>
    <row>
      <i-col span="24" style="text-align: center">
        <Page :current="pageNum" :page-size="pageSize" :total="total" @on-change="pageChange" simple/>
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
  import {baseURL} from '@/IPconfig'
  import {constant} from '@/constant/constant'
  import Common from "@/utils/common";
  import VueUeditorWrap from 'vue-ueditor-wrap'
  import TableExpand from '@/views/warehouse/warehouse-table-expand'

  export default {
    name: 'Ueditor',
    components: {VueUeditorWrap},
    data() {
      return {
        // <--------------------          基础变量          -------------------->
        header: {token: ''},
        goods_sn: '',
        loading: true,
        spinShow: true,
        // 每页显示条目个数
        pageSize: constant.pageSize,
        // 当前页数
        pageNum: 0,
        // 总个数
        total: 0,
        serviceProviderSingle: false,
        retrievalDeliverySingle: false,
        tableHeight: '',
        page: '',
        title: '',
        files: '',
        serverUrl: baseURL.releaseIP + '/common/picture_temp_oss',
        fileUploadURLS: '//jsonplaceholder.typicode.com/posts/',

        //<--------------------          表格头布局          -------------------->
        columns: [
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
            title: '库存所属',
            key: 'company_name',
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
            title: '单位',
            key: 'goods_unit',
            align: 'center'
          },
          {
            title: '库存数量',
            key: 'in_num',
            align: 'center'
          },
          {
            title: '已出库数量',
            key: 'out_num',
            align: 'center',
          }
        ],
        serviceProviders: [],
        retrievalDeliveryColumns: [
          {
            title: '订单号编号',
            key: 'order_id',
            align: 'center'
          },
          {
            title: '单据日期',
            key: 'order_date',
            align: 'center'
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
                }
              }, "查看")
            }
          }
        ],
      }
    },
    mounted() {
      // Common.isTokenUndefined(this)
      if (Common.isTokenUndefined(this) == false) {
        this.$router.push('/')
        return
      } else {
        this.tableHeight = document.documentElement.clientHeight - 310
        this.initialiseIndex(0)
      }
    },
    methods: {

      //<--------------------          增删改查翻页          -------------------->
      //初始化页面
      initialiseIndex(page) {
        this.spinShow = true
        this.pageSize = page + 1
        let index = {
          "page_size": page,
          "page_no": this.pageNum
        }
        if (this.goods_sn) {
          index.goods_sn = this.goods_sn
        }
        post('/index/Depot/getDepot', index).then((response) => {
          this.spinShow = false
          this.total = response.count
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

<style>
  .label {
    text-align: right;
    margin: auto;
  }

  .ivu-table .demo-table-count1-row td {
    background-color: #8a84ff;
    color: #fff;
  }

  .ivu-table .demo-table-count2-row td {
    background-color: #4687ff;
    color: #fff;
  }

  .ivu-table .demo-table-count3-row td {
    background-color: #9441ff;
    color: #fff;
  }

  .ivu-table .demo-table-count4-row td {
    background-color: #6d9eff;
    color: #fff;
  }

  .ivu-table .demo-table-count5-row td {
    background-color: #ffbb6b;
    color: #fff;
  }

  .ivu-table .demo-table-count6-row td {
    background-color: #ff66a6;
    color: #fff;
  }
</style>
