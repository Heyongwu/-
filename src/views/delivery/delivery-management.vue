<template>
  <div>
    <row :gutter="16" style="margin-bottom: 20px;display:flex;font-size: 15px">
      <i-col span="3" class="label">送货单号：</i-col>
      <i-col span="4">
        <i-input clearable v-model="wuliu_sn" placeholder="请输入送货单号"/>
      </i-col>
      <i-col span="3" class="label"></i-col>
      <i-col span="4">
      </i-col>
      <i-col span="3" class="label"></i-col>
      <i-col span="4">
      </i-col>
      <i-col span="3">
        <i-button type="primary" @click="initialiseIndex(0,true)">检索</i-button>
      </i-col>
    </row>
    <br>
    <row :gutter="16" type="flex">
      <i-col span="2">
        <i-button type="primary" class="buttonPadding" @click="addServiceProvider">新&nbsp;&nbsp;&nbsp;&nbsp;增</i-button>
      </i-col>
      <i-col span="2"  >
        <i-button type="info" class="buttonPadding" @click="printBarcode">打印条码</i-button>
      </i-col>
      <i-col span="2" >
        <i-button type="warning" class="buttonPadding"  @click="printDeliveryNote">
          打印送货单
        </i-button>
      </i-col>
      <i-col span="2" v-if="isSyncShow">
        <i-button type="success" class="buttonPadding" @click="synchronizationMES" :disabled="isSyncFlag">同步MES</i-button>
      </i-col>
      <i-col span="2" >
        <i-button type="error" class="buttonPadding" @click="deleteAllGoods">条码作废</i-button>
      </i-col>
      <i-col span="14">&nbsp;</i-col>
    </row>
    <br>
    <row>
      <i-table border :height="tableHeight" @on-select-all="selectUnit" @on-select-cancel="selectUnit"
               @on-select="selectUnit" @on-select-all-cancel="selectUnit" :row-class-name="rowClassName"
               :columns="columns" :data="serviceProviders"></i-table>
    </row>
    <row>
      <i-col span="24" style="text-align: center">
        <Page :current="pageMain" :page-size="numMain" :total="totalMain" @on-change="pageChange" simple/>
      </i-col>
    </row>
    <Modal :title=title :mask-closable="false" fullscreen v-model="deliverySingle" width=80>
      <i-form :rules="checkRules" ref="Delivery" :model="addAlls">
        <row :gutter="16" style="margin-bottom: 20px;display:flex;font-size: 15px">
          <i-col span="1">&nbsp;</i-col>
          <i-col span="4">
            <form-item label="送货单号：" prop="wuliu_sn">
              <i-input v-model="addAlls.wuliu_sn" placeholder="请输入送货单号" disabled/>
            </form-item>
          </i-col>
          <i-col span="3">&nbsp;</i-col>
          <i-col span="4">
            <form-item label="送货人：" prop="song_person">
              <i-input :maxlength="100" v-model="addAlls.song_person" placeholder="请输入送货人" :disabled="addClick"/>
            </form-item>
          </i-col>
          <i-col span="3">&nbsp;</i-col>
          <i-col span="5">
            <form-item label="送货日期：　　　　　　　　　　　　　　　　" prop="song_date">
              <DatePicker type="date" placeholder="请选择送货日期" v-model="addAlls.song_date"
                          :disabled="addClick"></DatePicker>
            </form-item>
          </i-col>
          <i-col span="4">&nbsp;</i-col>
        </row>
        <row>
          <i-col span="1">&nbsp;</i-col>
          <i-col span="1">
            <i-button @click="searchOrder(1)" type="primary" :disabled="preservationDisabled == false">导入订单</i-button>
          </i-col>
          <i-col span="1" style="padding-left: 10px">
            <i-button v-if="preservationDisabled == false" type="info" @click="commodityConfirmation">打印条码</i-button>
          </i-col>
          <i-col span="1" style="padding-left: 10px">
            <i-button v-if="preservationDisabled == false" type="warning" @click="commoditySongHuodan">打印送货单</i-button>
          </i-col>
        </row>
        <row :gutter="16" style="margin-bottom: 20px;display:flex;font-size: 15px">
          <i-col span="1">&nbsp;</i-col>
          <i-col span="22">
            <!--            @on-current-change="deliveryChecked"-->
            <i-table border highlight-row ref="currentRowTable" v-if="preservationDisabled"
                     @on-row-click="selectUnit1"
                     :row-class-name="rowClassName"
                     :height="tableHeight2" :columns="deliveryColumns" :data="deliveryNote"></i-table>
            <i-table border highlight-row ref="currentRowTable" v-if="preservationDisabled == false"
                     @on-select-all="selectAlls" @on-select-cancel="selectAlls"
                     @on-select="selectAlls" @on-select-all-cancel="selectAlls"
                     :height="tableHeight2" :columns="deliveryColumns" :data="deliveryNote"></i-table>
          </i-col>
          <i-col span="1">&nbsp;</i-col>
        </row>
        <br>
        <row :gutter="16" style="display:flex">
          <i-col span="1">&nbsp;</i-col>
          <i-col span="1" class="label">分卷：</i-col>
          <i-col span="2">
            <i-input clearable v-model="subsectionNumber" placeholder="请输入分卷"/>
          </i-col>
          <i-col span="1" class="label">单卷数量：</i-col>
          <i-col span="2">
            <i-input clearable v-model="singleVolumeNumber" placeholder="请输入单卷数量"/>
          </i-col>
          <i-col span="1" class="label">
            <i-button @click="setSubsection()">确定分卷</i-button>
          </i-col>
          <i-col span="1" class="label">
            <i-button @click="($refs.currentRowTable.clearCurrentRow())">清除选中商品</i-button>
          </i-col>
          <i-col span="12"></i-col>
        </row>
      </i-form>
      <div slot="footer">
        <i-button @click="deliverySingle = false">关闭</i-button>
        <i-button v-if="preservationDisabled" type="primary" @click="addSaveServiceProvider" :disabled="detailsFlag">
          保存
        </i-button>
      </div>
    </Modal>
    <Modal :title=title :mask-closable="false" v-model="retrievalDeliverySingle" width=70>
      <i-form>
        <row :gutter="16" style="margin-bottom: 20px;display:flex;font-size: 15px">
          <i-col span="2" class="label">编号：</i-col>
          <i-col span="10">
            <i-input clearable v-model="order_sn" placeholder="请输入送货单号"/>
          </i-col>
          <i-col span="2" class="label">
            日期：
          </i-col>
          <i-col span="6">
            <DatePicker type="date" v-model="order_date" placeholder="请选择日期"></DatePicker>
          </i-col>
          <i-col span="2">
            <i-button @click="searchOrder(1)">检索</i-button>
          </i-col>
        </row>
        <br>
        <row :gutter="16" style="margin-bottom: 20px;display:flex;font-size: 15px">
          <i-col span="24">
            <i-table border :height="retrievalTableHeight" :columns="retrievalDeliveryColumns"
                     :data="retrievalDeliveryNote"></i-table>
          </i-col>
        </row>
        <br>
        <row>
          <i-col span="24" style="text-align: center">
            <Page :current="page" :page-size="num" :total="total" @on-change="pageChangeTetrieval" simple/>
          </i-col>
        </row>
      </i-form>
      <div slot="footer">
        <i-button @click="retrievalDeliverySingle = false">关闭</i-button>
      </div>
    </Modal>
    <div style="position : absolute;top: 3%;left: 38%;color: #ff3660;width: 450px;font-size: 20px" v-if="isSyncShow == false">
      注意：送货单打印只能按照单个送货单进行打印。被作废的打印条码，不能作为送货条码，进行送货，否则我们有权拒收。请勿重复使用条码。
    </div>

  </div>
</template>

<script>

  import {post} from '@/utils/http'
  import {constant} from '@/constant/constant'
  import Common from "@/utils/common";
  import Cookies from "js-cookie"
  import QRCode from 'qrcode'


  export default {
    // components: {TableExpand},
    data() {
      return {
        // <--------------------          基础变量          -------------------->
        isSyncFlag: true,
        isSyncShow: true,
        clickBj: false,
        addTotalList: {
          "info": [],
        },
        indexClick: -1,
        allList: [],
        appendSuccessAllList: [],
        singleList: {},
        DeliveryNotes: [],
        temporaryList: [],
        addClick: false,
        isDaying: false,
        printBarcodeFlag: false,
        header: {token: ''},
        wuliu_sn: '',
        urls: '',
        tedayNum: 0,
        countNumber: 0,
        order_sn: '',
        order_date: '',
        other_party_name: '',
        contract_name: '',
        song_date: '',
        name: '',
        addAlls: {
          wuliu_sn: '',
          song_person: '',
          song_date: '',
        },
        main_body_type_category: '',
        main_body_type_categorys: [],
        station_area_code: '',
        station_area_codes: [],
        service_providers_type: '',
        service_providers_types: [],
        serviceProvider: [],
        loading: true,
        detailsFlag: false,
        // 每页显示条目个数
        num: constant.pageSize,
        numMain: constant.pageSize,
        // 当前页数
        page: 1,
        pageMain: 1,
        // 总个数
        total: 0,
        totalMain: 0,
        deliverySingle: false,
        retrievalDeliverySingle: false,
        deliveryIsChecked: false,
        preservationDisabled: true,
        tableHeight: '',
        tableHeight2: '',
        retrievalTableHeight: '',
        title: '',
        subsectionNumber: '',
        singleVolumeNumber: '',
        isOpens: true,
        selectData: [],
        // fileUploadURLS: baseURL.releaseIP + '/elderFood/excel_foodOrder_input',
        serviceProviders: [],
        deliveryNote: [],
        retrievalDeliveryNote: [],
        //<--------------------          表格头布局          -------------------->
        columns: [],
        columns1: [
          {
            type: 'selection',
            width: 60,
            align: 'center',
          },
          {
            title: '送货单位编号',
            key: 'company_sn',
            align: 'center'
          },
          {
            title: '送货单位',
            key: 'company_name',
            align: 'center'
          },
          {
            title: '同步',
            key: 'is_sync_name',
            align: 'center'
          },
          {
            title: '送货单号',
            key: 'wuliu_sn',
            align: 'center'
          },
          {
            title: '单据日期',
            key: 'order_date',
            align: 'center'
          },
          {
            title: '分卷条码',
            key: 'rec_sn',
            align: 'center'
          },
          {
            title: '商品编号',
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
            title: '门幅',
            key: 'goods_width',
            align: 'center'
          },
          {
            title: '颜色',
            key: 'goods_color',
            align: 'center'
          },
          {
            title: '条纹',
            key: 'remarks',
            align: 'center'
          },
          {
            title: '送货数量',
            key: 'song_qty',
            align: 'center'
          },
          {
            title: '单位',
            key: 'goods_unit',
            align: 'center'
          },
          {
            title: '送货人',
            key: 'song_person',
            align: 'center'
          },

          {
            title: '',
            key: 'wuliu_id',
            align: 'center',
            width: 1,
          },
        ],
        columns2: [
          {
            type: 'selection',
            width: 60,
            align: 'center',
          },
          {
            title: '送货单号',
            key: 'wuliu_sn',
            align: 'center'
          },
          {
            title: '单据日期',
            key: 'order_date',
            align: 'center'
          },
          {
            title: '分卷条码',
            key: 'rec_sn',
            align: 'center'
          },
          {
            title: '商品编号',
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
            title: '门幅',
            key: 'goods_width',
            align: 'center'
          },
          {
            title: '颜色',
            key: 'goods_color',
            align: 'center'
          },
          {
            title: '条纹',
            key: 'remarks',
            align: 'center'
          },
          {
            title: '送货数量',
            key: 'song_qty',
            align: 'center'
          },
          {
            title: '单位',
            key: 'goods_unit',
            align: 'center'
          },
          {
            title: '送货人',
            key: 'song_person',
            align: 'center'
          },

          {
            title: '',
            key: 'wuliu_id',
            align: 'center',
            width: 1,
          },
        ],
        deliveryColumns: [],
        deliveryColumns1: [
          // {
          //   align: 'center',
          //   title: '选项',
          //   key: 'flag',
          //   render: (h, params) => {
          //     return h('selection', {
          //       props: {
          //         value: params.row.flag,
          //         // disabled:true
          //       }
          //     })
          //   }
          // },
          {
            title: '采购单号',
            key: 'order_sn',
            align: 'center',
            width: 100
          }, {
            title: '下单日期',
            key: 'order_date',
            align: 'center',
            // width:99
          },
          {
            title: '产品名称',
            key: 'goods_name',
            align: 'center'
          },
          {
            title: '规格型号',
            key: 'goods_spec',
            align: 'center'
          },
          {
            title: '门幅',
            key: 'goods_width',
            align: 'center',
            // width:65
          },
          {
            title: '颜色',
            key: 'goods_color',
            align: 'center',
            // width:65
          },
          {
            title: '布纹',
            key: 'goods_type',
            align: 'center',
            // width:75
          },
          {
            title: '单位',
            key: 'goods_unit',
            align: 'center',
            // width:65
          },
          {
            title: '订单米数',
            key: 'amount_qty',
            align: 'center',
            // width:65
          },
          {
            title: '可送货数量',
            key: 'depot_qty',
            align: 'center',
            // width:65
          },
          {
            title: '单卷数量',
            key: 'song_single_qty',
            align: 'center',
            render: (h, params) => {
              let _this = this;

              return h('div', [
                h(
                  "InputNumber", {
                    props: {
                      value: params.row.song_single_qty,
                      transfer: true,  //select不受body显示，以免显示不出来
                      disabled: params.row.fenjuan ? true : false,
                    },
                    style: {
                      clickBj: true
                    },
                    on: {
                      // 编辑数量的时候,触发的事件
                      'on-change': e => {
                        this.clickBj = true
                        params.row.song_single_qty = e
                        _this.deliveryNote[params.index] = params.row
                        _this.updateData() // 改变的时候触发一下改变数据时事件,这样只要编辑了就会获取里面的值
                      }
                    }
                  },
                )]);
            }
          },
          {
            title: '操作',
            align: 'center',
            width: 150,
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'error',
                    size: 'small',
                    disabled: params.row.delete ? true : false
                  },
                  on: {
                    click: () => {
                      this.removeDelivery(params.index, params.row)
                    }
                  }
                }, '删除')
              ]);
            }
          },
        ],
        deliveryColumns2: [
          {
            type: 'selection',
            width: 60,
            align: 'center',
          },
          {
            title: '采购单号',
            key: 'order_sn',
            align: 'center',
            width: 100
          }, {
            title: '下单日期',
            key: 'order_date',
            align: 'center',
            // width:99
          },
          {
            title: '产品名称',
            key: 'goods_name',
            align: 'center'
          },
          {
            title: '规格型号',
            key: 'goods_spec',
            align: 'center'
          },
          {
            title: '门幅',
            key: 'goods_width',
            align: 'center',
            // width:65
          },
          {
            title: '颜色',
            key: 'goods_color',
            align: 'center',
            // width:65
          },
          {
            title: '布纹',
            key: 'goods_type',
            align: 'center',
            // width:75
          },
          {
            title: '单位',
            key: 'goods_unit',
            align: 'center',
            // width:65
          },
          {
            title: '订单米数',
            key: 'amount_qty',
            align: 'center',
            // width:65
          },
          {
            title: '可送货数量',
            key: 'depot_qty',
            align: 'center',
            // width:65
          },
          {
            title: '单卷数量',
            key: 'song_single_qty',
            align: 'center',
            render: (h, params) => {
              let _this = this;

              return h('div', [
                h(
                  "InputNumber", {
                    props: {
                      value: params.row.song_single_qty,
                      transfer: true,  //select不受body显示，以免显示不出来
                      disabled: params.row.fenjuan ? true : false,
                    },
                    style: {
                      clickBj: true
                    },
                    on: {
                      // 编辑数量的时候,触发的事件
                      'on-change': e => {
                        this.clickBj = true
                        params.row.song_single_qty = e
                        _this.deliveryNote[params.index] = params.row
                        _this.updateData() // 改变的时候触发一下改变数据时事件,这样只要编辑了就会获取里面的值
                      }
                    }
                  },
                )]);
            }
          },
          {
            title: '操作',
            align: 'center',
            width: 150,
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'error',
                    size: 'small',
                    disabled: params.row.delete ? true : false
                  },
                  on: {
                    click: () => {
                      this.removeDelivery(params.index, params.row)
                    }
                  }
                }, '删除')
              ]);
            }
          },
        ],
        retrievalDeliveryColumns: [
          {
            title: '采购单号',
            key: 'order_sn',
            align: 'center',
            width: 100
          }, {
            title: '下单日期',
            key: 'order_date',
            align: 'center',
            // width:99
          },
          {
            title: '产品名称',
            key: 'goods_name',
            align: 'center'
          },
          {
            title: '规格型号',
            key: 'goods_spec',
            align: 'center'
          },
          {
            title: '门幅',
            key: 'goods_width',
            align: 'center',
            // width:65
          },
          {
            title: '颜色',
            key: 'goods_color',
            align: 'center',
            // width:65
          },
          {
            title: '布纹',
            key: 'goods_type',
            align: 'center',
            // width:75
          },
          {
            title: '单位',
            key: 'goods_unit',
            align: 'center',
            // width:65
          },
          {
            title: '订单米数',
            key: 'amount_qty',
            align: 'center',
            // width:65
          },
          {
            title: '在途数量',
            key: 'deliver_qty',
            align: 'center',
            // width:65
          },
          {
            title: '已确认数量',
            key: 'receiv_qty',
            align: 'center',
            // width:75
          },
          {
            title: '可送货数量',
            key: 'depot_qty',
            align: 'center',
            // width:75
          },
          {
            title: '待送货数量',
            key: 'Dy',
            align: 'center',
            // width:75
          },
          {
            title: '加入订单',
            align: 'center',
            // width:65,
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {
                    size: 'small',
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.appendDeliveryList(params.row)
                    }
                  }
                }, '添加')
              ]);
            }
          }
        ],
        //<--------------------          增改modal check          -------------------->
        checkRules: {
          contract_name: [
            {required: true, message: "送货人为必输项。", trigger: "blur"}
          ],
        }
      }
    },
    mounted() {
      Cookies.set("isFlage", true)
      if (Common.isTokenUndefined(this) == false) {
        this.$router.push('/')
        return
      } else {
        this.columns = parseInt(Cookies.get("company_type")) === 1 ? this.columns1 : this.columns2
        this.isSyncShow = parseInt(Cookies.get("company_type")) === 1 ? true : false
        this.tableHeight = document.documentElement.clientHeight - 340
        this.tableHeight2 = document.documentElement.clientHeight - 390
        this.retrievalTableHeight = document.documentElement.clientHeight - 390
        this.initialiseIndex(0, false)
      }
    },
    methods: {
      //永不重复随机编号
      getRandomCode(length) {
        if (length > 0) {
          var data = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
          var nums = "";
          for (var i = 0; i < length; i++) {
            var r = parseInt(Math.random() * 61);
            nums += data[r];
          }
          return nums;
        } else {
          return false;
        }
      },
      //<--------------------          增删改查翻页          -------------------->
      //初始化页面
      initialiseIndex(page, isFlage) {
        this.isSyncFlag = true
        if (isFlage) {
          Cookies.set("count", '')
          if (this.wuliu_sn) {
            this.numMain = 500000
          } else {
            this.numMain = constant.pageSize
          }
        } else {
          this.numMain = constant.pageSize
        }
        if (page === 0) {
          this.pageMain = 1
        }
        let index = {
          "num": this.numMain,
          "page": page,
          "count": Cookies.get("count") === undefined ? '' : Cookies.get("count")
        }

        post('/index/Depot/getNewGoods', index).then((response) => {
          let isFlages = true
          Cookies.set("isFlage", true)
          let list = []
          if (this.wuliu_sn) {
            for (let i = 0; i < response.data.length; i++) {
              if (parseInt(response.data[i].is_sync) === 0) {
                isFlages = false
                response.data[i].is_sync_name = "未同步"
              } else if (parseInt(response.data[i].is_sync) === 1) {
                isFlages = false
                response.data[i].is_sync_name = "同步失败"
              } else {
                response.data[i].is_sync_name = parseInt(response.data[i].is_del) === 0 ? "同步成功" : "本单商品已注销"
              }
              response.data[i]._disabled = parseInt(response.data[i].is_del) === 0 ? false : true
              if (this.wuliu_sn == response.data[i].wuliu_sn) {
                list.push(response.data[i])
              }
            }
          } else {
            for (let i = 0; i < response.data.length; i++) {
              if (parseInt(response.data[i].is_sync) === 0) {
                isFlages = false
                response.data[i].is_sync_name = "未同步"
              } else if (parseInt(response.data[i].is_sync) === 1) {
                isFlages = false
                response.data[i].is_sync_name = "同步失败"
              } else {
                response.data[i].is_sync_name = parseInt(response.data[i].is_del) === 0 ? "同步成功" : "本单商品已注销"
              }
              response.data[i]._disabled = parseInt(response.data[i].is_del) === 0 ? false : true

            }
            list = response.data
          }
          this.isSyncFlag = isFlages
          this.serviceProviders = list
          if (isFlage) {
            if (this.wuliu_sn) {
              this.totalMain = 1
            } else {
              this.totalMain = response.count
            }
          } else {
            this.totalMain = response.count
          }
          Cookies.set("count", response.count)
        }, err => {
          Common.errNotice(this, err, constant.distributorErrTitle)
        })
      },

      //新增保存
      addSaveServiceProvider() {
        let listAll = {
          "info": []
        }
        let listSamll = this.deliveryNote
        for (let i = 0; i < listSamll.length; i++) {
          let listLarge = {
            "data": []
          }
          let small = {}
          if (listAll.info.length == 0) {
            listLarge.order_id = listSamll[i].order_id
            listLarge.order_sn = listSamll[i].order_sn
            listLarge.order_date = listSamll[i].order_date
            listLarge.rec_id = listSamll[i].rec_id
            listLarge.goods_id = listSamll[i].goods_id
            listLarge.goods_sn = listSamll[i].goods_sn
            listLarge.goods_name = listSamll[i].goods_name
            listLarge.goods_spec = listSamll[i].goods_spec
            listLarge.goods_color = listSamll[i].goods_color
            listLarge.goods_width = listSamll[i].goods_width
            listLarge.goods_unit = listSamll[i].goods_unit
            listLarge.goods_type = listSamll[i].goods_type
            listLarge.amount_qty = listSamll[i].amount_qty
            listLarge.deliver_qty = listSamll[i].deliver_qty
            listLarge.receiv_qty = listSamll[i].receiv_qty
            listLarge.depot_qty = listSamll[i].depot_qty
            listLarge.song_num = listSamll[i].song_num
            listLarge.song_total_num = listSamll[i].song_total_num
            listLarge.song_total_qty = listSamll[i].song_total_qty
            listLarge.song_person = listSamll[i].song_person
            listLarge.song_date = listSamll[i].song_date
            listLarge.wuliu_sn = listSamll[i].wuliu_sn
            small.rec_sn = ''
            small.song_qty = listSamll[i].song_single_qty
            small.depot_qty = listSamll[i].depot_qty
            listLarge.data.push(small)
            listAll.info.push(listLarge)
          } else {
            let Flag = true
            for (let j = 0; j < listAll.info.length; j++) {
              if (listSamll[i].goods_spec === listAll.info[j].goods_spec) {
                small.rec_sn = ''
                small.song_qty = listSamll[i].song_single_qty
                small.depot_qty = listSamll[i].depot_qty
                listAll.info[j].data.push(small)
                Flag = false
              }
            }
            if (Flag) {
              listLarge.order_id = listSamll[i].order_id
              listLarge.order_sn = listSamll[i].order_sn
              listLarge.order_date = listSamll[i].order_date
              listLarge.rec_id = listSamll[i].rec_id
              listLarge.goods_id = listSamll[i].goods_id
              listLarge.goods_sn = listSamll[i].goods_sn
              listLarge.goods_name = listSamll[i].goods_name
              listLarge.goods_spec = listSamll[i].goods_spec
              listLarge.goods_color = listSamll[i].goods_color
              listLarge.goods_width = listSamll[i].goods_width
              listLarge.goods_unit = listSamll[i].goods_unit
              listLarge.goods_type = listSamll[i].goods_type
              listLarge.amount_qty = listSamll[i].amount_qty
              listLarge.deliver_qty = listSamll[i].deliver_qty
              listLarge.receiv_qty = listSamll[i].receiv_qty
              listLarge.depot_qty = listSamll[i].depot_qty
              listLarge.song_num = listSamll[i].song_num
              listLarge.song_total_num = listSamll[i].song_total_num
              listLarge.song_total_qty = listSamll[i].song_total_qty
              listLarge.song_person = listSamll[i].song_person
              listLarge.song_date = listSamll[i].song_date
              listLarge.wuliu_sn = listSamll[i].wuliu_sn
              small.rec_sn = ''
              small.song_qty = listSamll[i].song_single_qty
              small.depot_qty = listSamll[i].depot_qty
              listLarge.data.push(small)
              listAll.info.push(listLarge)
            }
          }
        }

        for (let i = 0; i < listAll.info.length; i++) {
          for (let j = 0; j < listAll.info[i].data.length; j++) {
            listAll.info[i].data[j].rec_sn = Common.generationNumber(this.tedayNum)
            this.tedayNum++;
          }
        }
        if (this.isPreservation(listAll)) {
          for (let i = 0; i < listAll.info.length; i++) {
            let total = 0
            for (let j = 0; j < listAll.info[i].data.length; j++) {
              total += parseFloat(listAll.info[i].data[j].song_qty)
            }
            listAll.info[i].song_total_qty = total
            listAll.info[i].song_total_num = listAll.info[i].data.length
            let totalCount = parseFloat(total) + parseFloat(listAll.info[i].receiv_qty) +  parseFloat(listAll.info[i].deliver_qty)
            if (totalCount > listAll.info[i].amount_qty * 1.2) {
              this.$Notice.error({
                title: '保存异常',
                desc: "型号" + listAll.info[i].goods_spec + " 送货数量大于采购订单数量的限定超额，请更换采购订单或者请作废无法送货的送货条码。"
              });
              return
            }
          }
          if (listAll.info.length == 0) {
            this.$Notice.error({
              title: '请选择商品',
            });
            return
          }

          // post('/index/Depot/outDepot', listAll).then((response) => {
          //   if (parseInt(response.code) === 1) {
          //     this.$Notice.success({
          //       title: '保存送货单',
          //       desc: this.addAlls.wuliu_sn + response.msg,
          //     });
          //     this.preservationDisabled = false
          //     this.deliveryColumns = this.deliveryColumns2
          //     let tedayNum = parseInt(this.tedayNum - this.deliveryNote.length)
          //     for (let i = 0; i < this.deliveryNote.length; i++) {
          //       this.deliveryNote[i].rec_sn = Common.generationNumber(tedayNum)
          //       tedayNum++;
          //     }
          //   } else {
          //     this.$Notice.error({
          //       title: '保存送货单',
          //       desc: this.addAlls.wuliu_sn + response.msg,
          //     });
          //   }
          // }, err => {
          //   Common.errNotice(this, err, constant.distributorErrTitle)
          // })
        } else {
          this.$Notice.error({
            title: '商品单卷数量有误',
            desc: '请输入所有商品单卷数量！',
          });
        }
      },
      //删除
      removeDelivery(index, row) {
        this.$Modal.confirm({
          title: '删除确认',
          content: '确定删除该件商品吗？',
          okText: '确定',
          cancelText: '取消',
          onOk: () => {
            //逻辑删除
            this.deliveryNote.splice(index, 1)
            this.$Notice.success({
              title: '商品删除',
              desc: row.goods_name + '删除成功！',
            });
          }
        })
      },
      //主页翻页
      pageChange(value) {
        this.initialiseIndex(value - 1, false)
      },     //翻页
      pageChangeTetrieval(value) {
        this.searchOrder(value)
      },
      //<--------------------          清取消和存储参数的modal          -------------------->
      //新增跳转
      addServiceProvider() {
        this.preservationDisabled = true
        this.deliverySingle = true
        this.detailsFlag = false
        this.addClick = false
        this.title = '新增送货单'
        this.deliveryColumns = this.deliveryColumns1
        Cookies.set("isFlage", false)
        this.clearServiceProvider()
        var myDate = new Date();
        var year = myDate.getYear()
        year = year < 2000 ? year + 1900 : year
        var yy = year.toString().substr(2, 2);
        var month = myDate.getMonth();
        month = month + 1
        month = month < 10 ? "0" + month : month
        var Dates = myDate.getDate();
        var Hours = myDate.getHours(); //获取当前小时数(0-23)
        Hours = Hours < 10 ? "0" + Hours : Hours
        var Minutes = myDate.getMinutes(); //获取当前分钟数(0-59)
        Minutes = Minutes < 10 ? "0" + Minutes : Minutes
        var Seconds = myDate.getSeconds();
        Seconds = Seconds < 10 ? "0" + Seconds : Seconds
        this.addAlls.wuliu_sn = "L" + yy + "" + month + "" + Dates + "" + Hours + "" + Minutes + "" + Seconds + this.getRandomCode(2)

      },
      rowClassName(row) {
        if (row.is_del === 1) {
          //去世
          return 'demo-table-info-row'
        }
        return ''
      },
      //新增时清空页面
      clearServiceProvider() {
        this.addAlls.wuliu_sn = ''
        this.addAlls.song_date = ''
        this.addAlls.song_person = ''
        this.deliveryNote = []
        this.countNumber = 0
        constant.successfulPreservation = []
      }
      ,
      //<--------------------          逻辑          -------------------->
      //将选中的订单添加到送货单表格中
      appendDeliveryList(val) {
        if (Common.isNullOrUndefined(this.addAlls.wuliu_sn) == false) {
          this.$Notice.error({
            title: '送货单号不能为空',
            desc: '请先输入送货单号！',
          });
          return
        }
        if (Common.isNullOrUndefined(this.addAlls.song_person) == false) {
          this.$Notice.error({
            title: '送货人不能为空',
            desc: '请先输入送货人！',
          });
          return
        }
        if (Common.isNullOrUndefined(this.addAlls.song_date) == false) {
          this.$Notice.error({
            title: '送货人日期',
            desc: '请选择送货日期！',
          });
          return
        }
        if (this.addClick) {
          this.addClick = true
          val.song_person = this.addAlls.song_person
          val.song_date = Common.formatDate(this.addAlls.song_date, "yyyy-MM-dd")
          val.wuliu_sn = this.addAlls.wuliu_sn
          val.song_total_qty = val.song_total_num * val.song_single_qty
          val._disableExpand = true
          val._expanded = false
          val.isExpand = false
          val.fenjuan = false
          val.index = null
          val.flag = false
          val.data = []
          this.deliveryNote.push(this.cloneObjectFn(val))
          this.$Notice.success({
            title: '商品添加',
            desc: val.goods_name + '添加送货单成功！',
          });
        } else {
          this.$Modal.confirm({
            title: '确认生成',
            content: '条码一旦生产送货单号，送货人，送货日期将不可修改。',
            okText: '确定',
            cancelText: '取消',
            onOk: () => {
              this.addClick = true
              val.song_person = this.addAlls.song_person
              val.song_date = Common.formatDate(this.addAlls.song_date, "yyyy-MM-dd")
              val.wuliu_sn = this.addAlls.wuliu_sn
              val.song_total_qty = val.song_total_num * val.song_single_qty
              val._disableExpand = true
              val._expanded = false
              val.isExpand = false
              val.fenjuan = false
              val.index = null
              val.flag = false
              val.data = []
              this.deliveryNote.push(this.cloneObjectFn(val))
              this.$Notice.success({
                title: '商品添加',
                desc: val.goods_name + '添加送货单成功！',
              });
            }
          })
        }
      },
      cloneObjectFn(obj) { // 对象复制
        return JSON.parse(JSON.stringify(obj))
      },
      //分卷设置
      setSubsection() {
        if (Common.isNullOrUndefined(this.subsectionNumber) == false) {
          this.$Notice.error({
            title: '请输入分卷卷数',
          });
          return
        }
        if (Common.isNullOrUndefined(this.singleVolumeNumber) == false) {
          this.$Notice.error({
            title: '请输入单卷数量',
          });
          return
        }
        if (Common.isNullOrUndefined(this.indexClick) == false || this.indexClick == -1) {
          this.$Notice.error({
            title: '请选择要分卷的商品',
          });
          return;
        }
        for (let i = 0; i < this.subsectionNumber; i++) {
          let list = {}
          list.flag = false
          list.order_id = this.deliveryNote[this.indexClick].order_id
          list.order_sn = this.deliveryNote[this.indexClick].order_sn
          list.order_date = this.deliveryNote[this.indexClick].order_date
          list.rec_id = this.deliveryNote[this.indexClick].rec_id
          list.goods_id = this.deliveryNote[this.indexClick].goods_id
          list.goods_sn = this.deliveryNote[this.indexClick].goods_sn
          list.goods_name = this.deliveryNote[this.indexClick].goods_name
          list.goods_spec = this.deliveryNote[this.indexClick].goods_spec
          list.goods_color = this.deliveryNote[this.indexClick].goods_color
          list.goods_width = this.deliveryNote[this.indexClick].goods_width
          list.goods_unit = this.deliveryNote[this.indexClick].goods_unit
          list.goods_type = this.deliveryNote[this.indexClick].goods_type
          list.amount_qty = this.deliveryNote[this.indexClick].amount_qty
          list.deliver_qty = this.deliveryNote[this.indexClick].deliver_qty
          list.receiv_qty = this.deliveryNote[this.indexClick].receiv_qty
          list.depot_qty = this.deliveryNote[this.indexClick].depot_qty
          list.Dy = this.deliveryNote[this.indexClick].Dy
          list.song_num = this.deliveryNote[this.indexClick].song_num
          list.song_total_num = this.deliveryNote[this.indexClick].song_total_num
          list.song_person = this.deliveryNote[this.indexClick].song_person
          list.song_date = this.deliveryNote[this.indexClick].song_date
          list.wuliu_sn = this.deliveryNote[this.indexClick].wuliu_sn
          list.song_single_qty = this.singleVolumeNumber
          this.deliveryNote.splice(this.indexClick + 1, 0, list)
        }
        this.deliveryNote.splice(this.indexClick, 1)
        this.$Notice.success({
          title: '商品分卷',
          desc: '分卷成功！',
        });
      },
      //判断保存是否可用点击
      isPreservation(list) {
        let flag = true
        for (let i = 0; i < list.info.length; i++) {
          if (list.info[i].data.length === 0) {
            flag = false
            return flag
          }
          for (let j = 0; j < list.info[i].data.length; j++) {
            if (list.info[i].data[j].song_qty === 0) {
              flag = false
              return flag
            }
          }
        }
        return flag
      },
      // 更新选中的数据
      updateData(val = this.selectData) {
        this.clickBj = false
        if (val.length) {
          let obj = {}
          val.forEach(v => { // 先循环选中的值,找到id,与所有data里的id进行比对
            obj[v.id] = v
          })
          // this.ProductFormList.data是这个表格里面所有的数据,过滤所有的数据跟选中的数据进行对比
          //因为表格里面的数据是实时更改的,
          this.selectData = this.deliveryNote.data.filter(v => {
            if (obj[v.id]) { // 循环data,如果里面有id跟选中的id一样,把这条数据赋值给this.selectData
              return v
            }
          })
        }
      },
      searchOrder(page) {
        this.retrievalDeliveryNote = []
        this.page = page
        let index = {}
        if (this.order_sn) {
          index.order_sn = this.order_sn
        }
        if (this.order_date) {
          index.order_date = this.order_date
        }
        post('/index/Order/searchOrder', index).then((response) => {
          this.retrievalDeliverySingle = true
          if (response.length == 0) {
            this.retrievalDeliveryNote = response.data
            this.total = 1
          } else {
            for (let i = 0; i < response.data.length; i++) {
              let Dy = response.data[i].amount_qty - response.data[i].deliver_qty - response.data[i].receiv_qty
              response.data[i].Dy = Dy.toFixed(2)
              response.data[i].song_num = 0
              response.data[i].song_total_num = 0
              response.data[i].song_single_qty = 0
            }
            this.retrievalDeliveryNote = response.data.slice(page * constant.pageSize - constant.pageSize, page * constant.pageSize);
            this.total = response.data.length
            if (this.tedayNum === 0) {
              this.tedayNum = response.song_rowno
            }
          }
        }, err => {
          Common.errNotice(this, err, constant.distributorErrTitle)
        })
      },
      //打印方法
      qrcode(contractValue) {
        let _this = this
        _this.urls = ''
        const opts = {
          errorCorrectionLevel: 'H',
          type: 'image/jpeg',
          rendererOpts: {
            quality: 0.3
          }
        }
        QRCode.toDataURL(contractValue, opts, function (err, url) {
          if (err) throw err
          _this.urls = url
        })
        return this.urls
      },
      //初始化  当勾选完毕取值
      selectUnit(selection) {
        this.allList = selection
      },
      //保存成功 当勾选完毕取值
      selectAlls(selection) {
        this.appendSuccessAllList = selection
      }
      ,
      //单击某个条目改变当前状态
      selectUnit1(val, index) {
        this.indexClick = index
      },
      //初始化的打印
      printBarcode() {
        if (this.allList.length == 0) {
          this.$Notice.error({
            title: '请选择要打印的条码',
          });
        } else {

          for (let i = 0; i < this.allList.length; i++) {
            this.allList[i].img = this.qrcode(this.allList[i].rec_sn)
            this.allList[i].maker_date = this.newDate()
          }
          Common.clickPrint(this.allList)
        }
      },
      newDate() {
        var myDate = new Date()
        let year = myDate.getFullYear()
        let month = (myDate.getMonth() + 1) < 10 ? "0" + (myDate.getMonth() + 1) : (myDate.getMonth() + 1)
        let day = myDate.getDate() < 10 ? "0" + (myDate.getDate()) : myDate.getDate()
        let makeDate = year + month + day
        return makeDate
      },
      //打印
      printDeliveryNote() {
        let list = []
        if (this.allList.length == 0) {
          this.$Notice.error({
            title: '请选择要打印的送货单',
          });
        } else {
          let o = this.allList
          for (let i = 0; i < o.length; i++) {
            let lists = {}
            let listsmall = []
            let listssmall = {}
            if (list.length == 0) {
              lists.Puid = o[i].wuliu_id
              lists.IMG = this.qrcode(o[i].wuliu_sn)
              lists.PuCode = o[i].wuliu_sn
              lists.dDate = o[i].order_date
              lists.nowdate = Common.formatDate(new Date(), "yyyy:MM:hh");
              lists.shPerson = o[i].song_person
              lists.shDate = o[i].song_date
              listssmall.cInvCode = o[i].goods_sn
              listssmall.OrderSn = o[i].order_sn
              listssmall.cInvName = o[i].goods_name
              listssmall.cComUnitName = o[i].goods_unit
              listssmall.cInvStd = o[i].goods_spec
              listssmall.iQuantity = o[i].song_qty
              listsmall.push(listssmall)
              lists.data = listsmall
              list.push(lists)
            } else {
              let Flag = true
              for (let j = 0; j < list.length; j++) {
                if (o[i].wuliu_sn === list[j].PuCode) {
                  Flag = false
                  list[j].data[0].iQuantity = parseFloat(o[i].song_qty) + parseFloat(list[j].data[0].iQuantity)
                }
              }
              if (Flag) {
                lists.Puid = o[i].wuliu_id
                lists.IMG = this.qrcode(o[i].wuliu_sn)
                lists.PuCode = o[i].wuliu_sn
                lists.dDate = o[i].order_date
                lists.nowdate = Common.formatDate(new Date(), "yyyy:MM:hh");
                lists.shPerson = o[i].song_person
                lists.shDate = o[i].song_date
                listssmall.cInvCode = o[i].goods_sn
                listssmall.cInvName = o[i].goods_name
                listssmall.cComUnitName = o[i].goods_unit
                listssmall.cInvStd = o[i].goods_spec
                listssmall.iQuantity = o[i].song_qty
                listssmall.OrderSn = o[i].order_sn
                listsmall.push(listssmall)
                lists.data = listsmall
                list.push(lists)
              }
            }
          }
          Common.fnPrint(list)
        }
      },
      //保存成功的时候进行打印
      //打印条码
      commodityConfirmation() {
        if (this.appendSuccessAllList.length === 0) {
          this.$Notice.error({
            title: '打印条码',
            desc: '请勾选您要打印的商品！',
          });
        } else {
          for (let i = 0; i < this.appendSuccessAllList.length; i++) {
            this.appendSuccessAllList[i].img = this.qrcode(this.appendSuccessAllList[i].rec_sn)
            this.appendSuccessAllList[i].maker_date = this.newDate
            this.appendSuccessAllList[i].song_qty = this.appendSuccessAllList[i].song_single_qty
          }
          Common.clickPrint(this.appendSuccessAllList)
        }
      },
      //打印送货单
      commoditySongHuodan() {
        let o = this.appendSuccessAllList
        if (o.length === 0) {
          this.$Notice.error({
            title: '打印送货单',
            desc: '请勾选您要打印的商品！',
          });
        } else {
          let list = []
          for (let i = 0; i < o.length; i++) {
            let lists = {}
            let listsmall = []
            let listssmall = {}
            if (list.length == 0) {
              lists.IMG = this.qrcode(o[i].wuliu_sn)
              lists.PuCode = o[i].wuliu_sn
              lists.dDate = o[i].order_date
              lists.nowdate = Common.formatDate(new Date(), "yyyy:MM:hh");
              lists.shPerson = o[i].song_person
              lists.shDate = o[i].song_date

              listssmall.cInvCode = o[i].goods_sn
              listssmall.cInvName = o[i].goods_name
              listssmall.cComUnitName = o[i].goods_unit
              listssmall.cInvStd = o[i].goods_spec
              listssmall.iQuantity = o[i].song_single_qty
              listssmall.OrderSn = o[i].order_sn
              listsmall.push(listssmall)
              lists.data = listsmall
              list.push(lists)
            } else {
              for (let j = 0; j < list.length; j++) {
                list[j].data[0].iQuantity = parseFloat(o[i].song_single_qty) + parseFloat(list[j].data[0].iQuantity)
              }
            }
          }
          Common.fnPrint(list)
        }
      },
      //同步MES
      synchronizationMES() {
        post('/index/SyncMes/handDeliverOrder').then((response) => {
          if (parseInt(response.code) === 1) {
            this.$Notice.success({
              title: '同步MES',
              desc: response.msg,
            });
            this.initialiseIndex(this.page - 1)
          } else {
            this.$Notice.error({
              title: '同步MES',
              desc: response.msg,
            });
          }
        }, err => {
          Common.errNotice(this, err, constant.distributorErrTitle)
        })
      },
      //商品删除多选删除
      deleteAllGoods() {
        if (this.allList.length === 0) {
          this.$Notice.error({
            title: '删除订单',
            desc: '请勾选要删除的订单',
          });
        } else {
          //删除
          this.$Modal.confirm({
            title: '删除确认',
            content: '确定删除选中商品吗？',
            okText: '确定',
            cancelText: '取消',
            onOk: () => {
              let rec_ids = ''
              for (let i = 0; i < this.allList.length; i++) {
                rec_ids += (this.allList[i].rec_id + ",")
              }
              rec_ids = rec_ids.substring(0, rec_ids.length - 1)
              let params = {
                rec_ids: rec_ids
              }
              post('/index/Depot/delRecsn', params).then((response) => {
                if (parseInt(response.code) === 1) {
                  this.$Notice.success({
                    title: '删除操作',
                    desc: response.msg,
                  });
                  this.initialiseIndex(this.page - 1)
                } else {
                  this.$Notice.error({
                    title: '删除操作',
                    desc: response.msg,
                  });
                }
              }, err => {
                Common.errNotice(this, err, constant.distributorErrTitle)
              })
            }
          })
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


<style>
  .label {
    text-align: right;
    margin: auto;
  }

  .total {
    text-align: left;
    margin: auto;
    font-size: 20px;
    font-weight: bolder;
  }

  .ivu-table .demo-table-error-row td {
    background-color: #ff6600;
    color: #fff;
  }

  .ivu-table .demo-table-info-row td {
    background-color: #D2D2D2;
    color: #fff;
  }

  .demo-upload-list img {
    width: 100%;
    height: 100%;
  }

  .demo-upload-list:hover .demo-upload-list-cover {
    display: block;
  }

  .demo-upload-list-cover i {
    color: #fff;
    font-size: 20px;
    cursor: pointer;
    margin: 0 2px;
  }

  .i-table-show > :first-child {
    font-size: 20px;
  }

  .buttonPadding{
    width: 90px;text-align: center
  }

</style>