<template>
  <div>
    <Modal :title=title :mask-closable="false" v-model="deliverySingle" width=80 :styles="{top: '40px'}">
      <i-form :rules="checkRules" ref="Delivery" :model="addAlls">
        <row :gutter="16" style="margin-bottom: 20px;display:flex;font-size: 15px">
          <i-col span="4">
            <form-item label="送货单号：" prop="wuliu_sn">
              <i-input v-model="addAlls.wuliu_sn" placeholder="请输入送货单号" disabled/>
            </form-item>
          </i-col>
          <i-col span="4">&nbsp;</i-col>
          <i-col span="4">
            <form-item label="送货人：" prop="song_person">
              <i-input :maxlength="100" v-model="addAlls.song_person" placeholder="请输入送货人"/>
            </form-item>
          </i-col>
          <i-col span="4">&nbsp;</i-col>
          <i-col span="5">
            <form-item label="送货日期：　　　　　　　　　　　　　　　　" prop="song_date">
              <DatePicker type="date" placeholder="请选择送货日期" v-model="addAlls.song_date"></DatePicker>
            </form-item>
          </i-col>
          <i-col span="4">&nbsp;</i-col>
        </row>
        <row>
          <i-col span="1">
            <i-button @click="openSeacher()" type="primary" :disabled="preservationDisabled == false">导入订单</i-button>
          </i-col>
          <i-col span="1" style="margin-left: 35px">
            <i-button v-if="preservationDisabled == false" type="info" @click="commodityConfirmation">打印条码</i-button>
          </i-col>
          <i-col span="1" style="margin-left: 35px">
            <i-button v-if="preservationDisabled == false" type="warning" @click="commoditySongHuodan">打印送货单</i-button>
          </i-col>
        </row>
        <row :gutter="16" style="margin-bottom: 20px;display:flex;font-size: 15px">
          <i-col span="24">
            <!--            @on-current-change="deliveryChecked"-->
            <i-table border highlight-row ref="currentRowTable" v-if="preservationDisabled"
                     @on-row-click="selectUnit1"
                     :height="tableHeight2" :columns="deliveryColumns" :data="deliveryNote"></i-table>
            <i-table border highlight-row ref="currentRowTable" v-if="preservationDisabled == false"
                     @on-select-all="selectAlls" @on-select-cancel="selectAlls"
                     @on-select="selectAlls" @on-select-all-cancel="selectAlls"
                     :height="tableHeight2" :columns="deliveryColumns" :data="deliveryNote"></i-table>
          </i-col>
        </row>
        <p style="padding-left: 80%;font-weight: bold">卷数总和：{{singleCOUNT}}</p>
        <br>
        <row :gutter="16" style="display:flex">
          <i-col span="1">&nbsp;</i-col>
          <i-col span="1" class="label">分卷：</i-col>
          <i-col span="2">
            <i-input v-model="subsectionNumber" placeholder="请输入分卷"/>
          </i-col>
          <i-col span="2" class="label">单卷数量：</i-col>
          <i-col span="2">
            <i-input v-model="singleVolumeNumber" placeholder="请输入单卷数量"/>
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
        <i-button v-if="preservationDisabled" type="primary" @click="addSaveServiceProvider" :disabled="detailsFlag"
                  v-preventReClick>
          保存
        </i-button>
      </div>
    </Modal>
    <Modal :title=title :mask-closable="false" v-model="retrievalDeliverySingle" width=70>
      <i-form>
        <row :gutter="16" style="margin-bottom: 20px;display:flex;font-size: 15px">
          <i-col span="2" class="label">采购单号：</i-col>
          <i-col span="3">
            <i-input v-model="order_sn" placeholder="请输入采购单号"/>
          </i-col>
          <i-col span="2" class="label">规格型号：</i-col>
          <i-col span="3">
            <i-input v-model="goods_spec" placeholder="请输入规格型号"/>
          </i-col>
          <i-col span="2" class="label">
            日期：
          </i-col>
          <i-col span="4">
            <DatePicker v-model="order_date" :clearable="false" @on-change="sss" type="daterange"
                        placeholder="请选择日期"></DatePicker>
          </i-col>
          <i-col span="2"></i-col>
          <i-col span="2">
            <i-button @click="searchOrder(1,false)">检索</i-button>
          </i-col>
          <i-col span="8"></i-col>
        </row>
        <br>
        <row :gutter="16" style="margin-bottom: 20px;display:flex;font-size: 15px">
          <i-col span="24">
            <i-table border :height="retrievalTableHeight" :columns="retrievalDeliveryColumns"
                     :data="retrievalDeliveryNote"></i-table>
          </i-col>
        </row>
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
    <Spin fix v-show="spinShow">
      <Icon type="load-c" size="30" class="demo-spin-icon-load"></Icon>
      <div>检索中，请稍侯...</div>
    </Spin>
  </div>
</template>
<script>
  import {post} from '@/utils/http'
  import Common from "@/utils/common";
  import BigImg from '@/views/delivery/delivery-image-small';
  import {constant} from '@/constant/constant'
  import Cookies from 'js-cookie'
  import QRCode from 'qrcode'

  export default {
    props: {
      spinShow: false,
      row: Object,
      isExpand: Boolean,
      detailsFlag: Boolean,
      wuliu_id: Number,
      // wuliu_sn: String,
      // song_person: String,
      // song_date: Date,
    },
    components: {
      'big-img': BigImg,
    },
    data() {
      return {
        // <--------------------          基础变量          -------------------->
        isSyncFlag: true,
        isSyncShow: true,
        clickBj: false,
        singleCOUNT: 0,
        addTotalList: {
          "info": [],
        },
        allGetSeachOrderList: [],
        indexClick: -1,
        appendSuccessAllList: [],
        singleList: {},
        DeliveryNotes: [],
        temporaryList: [],
        wuliu_sn: '',
        urls: '',
        order_sn: '',
        goods_spec: '',
        order_date: [new Date(), new Date()],
        detailsFlag: false,
        tedayNum: 0,
        countNumber: 0,
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
        addAlls: {
          wuliu_sn: '',
          song_person: '',
          song_date: '',
        },
        allList: [],
        //<--------------------          增改modal check          -------------------->
        deliveryColumns: [],
        deliveryColumns1: [
          {
            title: '采购单号',
            key: 'order_sn',
            align: 'center'
          }, {
            title: '下单日期',
            key: 'order_date',
            align: 'center'
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
            width: 90
          },
          {
            title: '颜色',
            key: 'goods_color',
            align: 'center',
            width: 90
          },
          {
            title: '布纹',
            key: 'goods_type',
            align: 'center',
            width: 90
          },
          {
            title: '单位',
            key: 'goods_unit',
            align: 'center',
            width: 90
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
          }, {
            title: '待送数量',
            key: 'Dy',
            align: 'center',
            // width:75
          },
          {
            title: '单卷数量',
            key: 'song_qty',
            align: 'center',
            render: (h, params) => {
              let _this = this;
              return h('div', [
                h(
                  "InputNumber", {
                    props: {
                      value: params.row.song_qty,
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
                        params.row.song_qty = e
                        _this.deliveryNote[params.index] = params.row
                        _this.updateData() // 改变的时候触发一下改变数据时事件,这样只要编辑了就会获取里面的值
                        _this.updateSingleNumber() // 单卷数据计算
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
                    disabled: this.preservationDisabled ? false : true
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
            align: 'center'
          }, {
            title: '下单日期',
            key: 'order_date',
            align: 'center'
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
            align: 'center'
          },
          {
            title: '颜色',
            key: 'goods_color',
            align: 'center',
            width: 90
          },
          {
            title: '布纹',
            key: 'goods_type',
            align: 'center'
          },
          {
            title: '单位',
            key: 'goods_unit',
            align: 'center'
          },
          {
            title: '单卷数量',
            key: 'song_qty',
            align: 'center',
            render: (h, params) => {
              let _this = this;
              return h('div', [
                h(
                  "InputNumber", {
                    props: {
                      value: params.row.song_qty,
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
                        params.row.song_qty = e
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
                    disabled: this.preservationDisabled ? false : true
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
            align: 'center'
          }, {
            title: '下单日期',
            key: 'order_date',
            align: 'center'
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
            width: 90
          },
          {
            title: '颜色',
            key: 'goods_color',
            align: 'center',
            width: 90
          },
          {
            title: '布纹',
            key: 'goods_type',
            align: 'center',
            width: 90
          },
          {
            title: '单位',
            key: 'goods_unit',
            align: 'center',
            width: 90
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
            align: 'center'
          },
          {
            title: '可送数量',
            key: 'depot_qty',
            align: 'center',
            // width:75
          },
          {
            title: '待送数量',
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
        deliverySingle: false,
        retrievalDeliverySingle: false,
        deliveryIsChecked: false,
        preservationDisabled: true,
        page: 1,
        num: constant.pageSize,
        total: 0,
        checkRules: {
          contract_name: [
            {required: true, message: "送货人为必输项。", trigger: "blur"}
          ],
        }
      }
    },
    mounted() {
      this.tableHeight2 = document.documentElement.clientHeight - 420
      this.retrievalTableHeight = document.documentElement.clientHeight - 390
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
      sss() {
        let start_date = Common.formatDate(this.order_date[0], "yyyy-MM-dd")
        let end_date = Common.formatDate(this.order_date[1], "yyyy-MM-dd")
        var day1 = new Date(start_date);
        var day2 = new Date(end_date);
        var pL = (day2 - day1) / (1000 * 60 * 60 * 24)
        if (pL > 7) {
          this.$Notice.error({
            title: '日期跨度不可以超过一周',
          });
          var now = new Date();
          this.order_date = [now, now]
        }
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
      openSeacher() {
        this.order_sn = ''
        this.goods_spec = ''
        this.searchOrder(1, false)
      },
      //新增保存
      addSaveServiceProvider() {
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
            listLarge.song_person = this.addAlls.song_person
            listLarge.song_date = Common.formatDate(this.addAlls.song_date, "yyyy-MM-dd")
            listLarge.wuliu_sn = this.addAlls.wuliu_sn
            small.rec_sn = ''
            small.song_qty = listSamll[i].song_qty
            small.depot_qty = listSamll[i].depot_qty
            listLarge.data.push(small)
            listAll.info.push(listLarge)
          } else {
            let Flag = true
            for (let j = 0; j < listAll.info.length; j++) {
              if (listSamll[i].goods_spec === listAll.info[j].goods_spec && listSamll[i].order_sn === listAll.info[j].order_sn) {
                small.rec_sn = ''
                small.song_qty = listSamll[i].song_qty
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
              listLarge.song_person = this.addAlls.song_person
              listLarge.song_date = Common.formatDate(this.addAlls.song_date, "yyyy-MM-dd")
              listLarge.wuliu_sn = this.addAlls.wuliu_sn
              small.rec_sn = ''
              small.song_qty = listSamll[i].song_qty
              small.depot_qty = listSamll[i].depot_qty
              listLarge.data.push(small)
              listAll.info.push(listLarge)
            }
          }
        }
        post('/index/Order/getRowno').then((responseRown) => {
          //判断保存的时候传来的数量与是否对的上
          if (parseInt(responseRown.song_rowno) === parseInt(this.tedayNum)) {
            for (let i = 0; i < listAll.info.length; i++) {
              for (let j = 0; j < listAll.info[i].data.length; j++) {
                listAll.info[i].data[j].rec_sn = Common.generationNumber(this.tedayNum)
                this.tedayNum++;
              }
            }
          } else {
            //对不上的话使用重新获取的数量
            this.tedayNum = responseRown.song_rowno
            for (let i = 0; i < listAll.info.length; i++) {
              for (let j = 0; j < listAll.info[i].data.length; j++) {
                listAll.info[i].data[j].rec_sn = Common.generationNumber(this.tedayNum)
                this.tedayNum++;
              }
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
              let totalCount = parseFloat(total) + parseFloat(listAll.info[i].receiv_qty) + parseFloat(listAll.info[i].deliver_qty)
              if (totalCount > listAll.info[i].amount_qty * 1.2) {
                this.$Notice.error({
                  title: '保存异常',
                  desc: "采购单号：" + listAll.info[i].order_sn + "   " + "型号：" + listAll.info[i].goods_spec + " 送货数量大于采购订单数量的限定超额，请更换采购订单或者请作废无法送货的送货条码。"
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

            post('/index/Depot/outDepot', listAll).then((response) => {
              if (parseInt(response.code) === 1) {
                this.$Notice.success({
                  title: '保存送货单',
                  desc: this.addAlls.wuliu_sn + response.msg,
                });

                this.preservationDisabled = false
                this.deliveryColumns = this.deliveryColumns2
                // let tedayNum = parseInt(this.tedayNum - this.deliveryNote.length)
                // for (let i = 0; i < this.deliveryNote.length; i++) {
                //   this.deliveryNote[i].rec_sn = Common.generationNumber(tedayNum)
                //   tedayNum++;
                // }
                let index = {
                  "num": 150,
                  "page": 1,
                  "count": 0,
                  "wuliu_sn": this.addAlls.wuliu_sn,
                  "status": 0
                }
                post('/index/Depot/getNewWuliu', index).then((responseWuliu) => {
                  this.deliveryNote = responseWuliu.data
                })
              } else {
                this.$Notice.error({
                  title: '保存送货单',
                  desc: this.addAlls.wuliu_sn + response.msg,
                });
              }
            }, err => {
              Common.errNotice(this, err, constant.distributorErrTitle)
            })
          } else {
            this.$Notice.error({
              title: '商品单卷数量有误',
              desc: '请输入所有商品单卷数量！',
            });
          }
        }, err => {
          Common.errNotice(this, err, constant.distributorErrTitle)
        })
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
      //选择商品翻页
      pageChangeTetrieval(value) {
        this.searchOrder(value, true)
      },
      //<--------------------          清取消和存储参数的modal          -------------------->
      //新增跳转
      addServiceProvider() {
        this.preservationDisabled = true
        this.deliverySingle = true
        this.detailsFlag = false
        this.singleCOUNT = 0
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
        this.addAlls.song_date = myDate
      },
      //新增时清空页面
      clearServiceProvider() {
        this.addAlls.wuliu_sn = ''
        this.addAlls.song_date = ''
        this.addAlls.song_person = ''
        this.deliveryNote = []
        this.countNumber = 0
        constant.successfulPreservation = []
      },
      //<--------------------          逻辑          -------------------->
      //将选中的订单添加到送货单表格中
      appendDeliveryList(val) {
        if (parseFloat(val.deliver_qty) + parseFloat(val.receiv_qty) > (parseFloat(val.amount_qty) * 1.2)) {
          this.$Notice.error({
            title: '商品添加',
            desc: '在途数量和已确认数量总和超出订单米数限定。',
          });
          return
        }
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
          list.song_qty = this.singleVolumeNumber
          this.deliveryNote.splice(this.indexClick + 1, 0, list)
        }
        this.deliveryNote.splice(this.indexClick, 1)
        this.$Notice.success({
          title: '商品分卷',
          desc: '分卷成功！',
        });
        this.updateSingleNumber()
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
      //检索商品
      searchOrder(page, isFlag) {
        this.spinShow = true
        this.retrievalDeliveryNote = []
        this.page = page
        let index = {}
        let flag = true
        if (this.order_sn) {
          index.order_sn = this.order_sn
          flag = false
        }

        if (this.goods_spec) {
          flag = false
          index.goods_spec = this.goods_spec
        }

        if (isFlag) {
          let response = this.allGetSeachOrderList
          this.retrievalDeliverySingle = true
          if (response.length == 0) {
            this.retrievalDeliveryNote = response.data
            this.tedayNum = response.song_rowno
            this.total = 1
          } else {
            for (let i = 0; i < response.data.length; i++) {
              let Dy = response.data[i].amount_qty - response.data[i].deliver_qty - response.data[i].receiv_qty
              response.data[i].Dy = Dy.toFixed(2)
              response.data[i].song_num = 0
              response.data[i].song_total_num = 0
              response.data[i].song_qty = 0
              response.data[i].order_date = response.data[i].order_date.substring(0, 10);
            }
            this.retrievalDeliveryNote = response.data.slice(page * constant.pageSize - constant.pageSize, page * constant.pageSize);
            this.total = response.data.length
            if (this.tedayNum === 0) {
              this.tedayNum = response.song_rowno
            }
          }
          this.spinShow = false
        } else {
          if (flag) {
            if (Common.isNullOrUndefined(this.order_date[0])) {
              index.start_date = Common.formatDate(this.order_date[0], "yyyy-MM-dd")
              index.end_date = Common.formatDate(this.order_date[1], "yyyy-MM-dd")
            }
          }
          post('/index/Order/searchOrder', index).then((response) => {
            this.allGetSeachOrderList = response
            this.retrievalDeliverySingle = true
            if (response.length == 0) {
              this.retrievalDeliveryNote = response.data
              this.tedayNum = response.song_rowno
              this.total = 1
            } else {
              for (let i = 0; i < response.data.length; i++) {
                let Dy = response.data[i].amount_qty - response.data[i].deliver_qty - response.data[i].receiv_qty
                response.data[i].Dy = Dy.toFixed(2)
                response.data[i].song_num = 0
                response.data[i].song_total_num = 0
                response.data[i].song_qty = 0
                response.data[i].order_date = response.data[i].order_date.substring(0, 10);
              }
              this.retrievalDeliveryNote = response.data.slice(page * constant.pageSize - constant.pageSize, page * constant.pageSize);
              this.total = response.data.length
              if (this.tedayNum === 0) {
                this.tedayNum = response.song_rowno
              }
            }
            this.spinShow = false
          }, err => {
            Common.errNotice(this, err, constant.distributorErrTitle)
          })
        }
      },
      //保存成功 当勾选完毕取值
      selectAlls(selection) {
        console.log(JSON.stringify(selection))
        this.appendSuccessAllList = selection
      },
      //单击某个条目改变当前状态
      selectUnit1(val, index) {
        this.indexClick = index
      },
      //当前时间
      newDate() {
        var myDate = new Date()
        let year = myDate.getFullYear()
        let month = (myDate.getMonth() + 1) < 10 ? "0" + (myDate.getMonth() + 1) : (myDate.getMonth() + 1)
        let day = myDate.getDate() < 10 ? "0" + (myDate.getDate()) : myDate.getDate()
        let makeDate = year + month + day
        return makeDate
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
            this.appendSuccessAllList[i].maker_date = Common.formatDate(new Date(), "yyyyMMdd")
            this.appendSuccessAllList[i].song_qty = this.appendSuccessAllList[i].song_qty
            this.appendSuccessAllList[i].company_name = Cookies.get("company_name")
            this.appendSuccessAllList[i].song_date = Common.formatDate(this.addAlls.song_date, "yyyy-MM-dd");
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
              lists.IMG = this.qrcode(this.addAlls.wuliu_sn)
              lists.PuCode = this.addAlls.wuliu_sn
              lists.dDate = o[i].order_date
              lists.nowdate = Common.formatDate(new Date(), "yyyy-MM-dd");
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
            } else {
              let FlagSmall = false
              let KK = 0
              for (let j = 0; j < list[0].data.length; j++) {
                if( o[i].goods_spec == list[0].data[j].cInvStd) {
                  FlagSmall = true
                  KK = j
                  break;
                }
              }
              if(FlagSmall){
                list[0].data[KK].iQuantity = parseFloat(o[i].song_qty) + parseFloat(list[0].data[KK].iQuantity)
              }else{
                listssmall.cInvCode = o[i].goods_sn
                listssmall.cInvName = o[i].goods_name
                listssmall.cComUnitName = o[i].goods_unit
                listssmall.cInvStd = o[i].goods_spec
                listssmall.iQuantity = o[i].song_qty
                listssmall.OrderSn = o[i].order_sn
                list[0].data.push(listssmall)
              }
            }
          }
          Common.fnPrint(list)
        }
      },

      updateSingleNumber() {
        this.singleCOUNT = 0
        let list = this.deliveryNote
        for (let i = 0; i < list.length; i++) {
          this.singleCOUNT += parseFloat(list[i].song_qty)
        }
      }
    }
  }
  ;
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

  .buttonPadding {
    width: 90px;
    text-align: center
  }

</style>
