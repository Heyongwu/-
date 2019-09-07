<template>
  <div>
    <row :gutter="16" style="margin-bottom: 20px;display:flex;font-size: 15px">
      <i-col span="3" class="label">送货单号：</i-col>
      <i-col span="4">
        <i-input   v-model="wuliu_sn" placeholder="请输入送货单号"/>
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
        <i-button type="primary" class="buttonPadding" @click="$refs.delivery.addServiceProvider()">新&nbsp;&nbsp;&nbsp;&nbsp;增</i-button>
      </i-col>
      <i-col span="2">
        <i-button type="info" class="buttonPadding" @click="printBarcode">打印条码</i-button>
      </i-col>
      <i-col span="2">
        <i-button type="warning" class="buttonPadding" @click="printDeliveryNote">
          打印送货单
        </i-button>
      </i-col>
      <i-col span="2" v-if="isSyncShow">
        <i-button type="success" class="buttonPadding" @click="synchronizationMES" :disabled="isSyncFlag">同步MES
        </i-button>
      </i-col>
      <i-col span="2">
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
    <div style="position : absolute;top: 3%;left: 38%;color: #ff3660;width: 450px;font-size: 20px"
         v-if="isSyncShow == false">
      注意：送货单打印只能按照单个送货单进行打印。被作废的打印条码，不能作为送货条码，进行送货，否则我们有权拒收。请勿重复使用条码。
    </div>
    <table-expand ref="delivery"></table-expand>

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
  import TableExpand from '@/views/delivery/delivery-table-expand';
  import Cookies from "js-cookie"
  import QRCode from 'qrcode'


  export default {
    components: {TableExpand},
    data() {
      return {
        // <--------------------          基础变量          -------------------->
        isSyncFlag: true,
        isSyncShow: true,
        spinShow: false,
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
        wuliu_sn: '',
        urls: '',
        // 每页显示条目个数
        numMain: constant.pageSize,
        // 当前页数
        pageMain: 1,
        // 总个数
        totalMain: 0,
        tableHeight: '',

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
            align: 'center',
            width:135
          },
          {
            title: '送货单位',
            key: 'company_name',
            align: 'center',
            width:110
          },
          {
            title: '同步',
            key: 'is_sync_name',
            align: 'center',
            width:95
          },
          {
            title: '送货单号',
            key: 'wuliu_sn',
            align: 'center',
            width:140
          },
          {
            title: '单据日期',
            key: 'order_date',
            align: 'center'
          },
          {
            title: '分卷条码',
            key: 'rec_sn',
            align: 'center',
            width:160
          },
          {
            title: '商品编号',
            key: 'goods_sn',
            align: 'center',
            width:110
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
            align: 'center',
            width:80
          },
          {
            title: '颜色',
            key: 'goods_color',
            align: 'center',
            width:90
          },
          {
            title: '条纹',
            key: 'remarks',
            align: 'center',
            width:80
          },
          {
            title: '送货数量',
            key: 'song_qty',
            align: 'center',
            width:90
          },
          {
            title: '单位',
            key: 'goods_unit',
            align: 'center',
            width:80
          },
          {
            title: '送货人',
            key: 'song_person',
            align: 'center'
          }
        ],
        columns2: [
          {
            type: 'selection',
            width: 60,
            align: 'center',
          },
          {
            title: '订单状态',
            key: 'is_del_name',
            align: 'center',
            width:140
          },
          {
            title: '送货单号',
            key: 'wuliu_sn',
            align: 'center',
            width:140
          },
          {
            title: '单据日期',
            key: 'order_date',
            align: 'center'
          },
          {
            title: '分卷条码',
            key: 'rec_sn',
            align: 'center',
            width:150
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
            align: 'center',
            width:90
          },
          {
            title: '颜色',
            key: 'goods_color',
            align: 'center',
            width:90
          },
          {
            title: '条纹',
            key: 'remarks',
            align: 'center',
            width:90
          },
          {
            title: '送货数量',
            key: 'song_qty',
            align: 'center',
            width:90
          },
          {
            title: '单位',
            key: 'goods_unit',
            align: 'center',
            width:90
          },
          {
            title: '送货人',
            key: 'song_person',
            align: 'center'
          }
        ],
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
        this.initialiseIndex(0, false)
      }
    },
    methods: {
      //<--------------------          增删改查翻页          -------------------->
      //初始化页面
      initialiseIndex(page, isFlage) {
        this.isSyncFlag = true
        this. spinShow = true
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
          this. spinShow = false
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
              response.data[i].is_del = parseInt(response.data[i].is_del) === 0 ? "正常" : "本单商品已注销"
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
              response.data[i].is_del_name = parseInt(response.data[i].is_del) === 0 ? "正常" : "本单商品已注销"
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
      //主页翻页
      pageChange(value) {
        this.initialiseIndex(value - 1, false)
      },
      rowClassName(row) {
        if (row.is_del === 1) {
          //去世
          return 'demo-table-info-row'
        }
        return ''
      },
      //<--------------------          逻辑          -------------------->
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
      //当前时间
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
      //同步MES
      synchronizationMES() {
        post('/index/SyncMes/handDeliverOrder').then((response) => {
          if (parseInt(response.code) === 1) {
            this.$Notice.success({
              title: '同步MES',
              desc: "同步MES成功",
            });
            this.initialiseIndex(this.page - 1)
          } else {
            this.$Notice.error({
              title: '同步MES',
              desc: "同步MES失败",
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
            title: '作废条码',
            desc: '请勾选要作废的条码',
          });
        } else {
          //删除
          this.$Modal.confirm({
            title: '作废确认',
            content: '确定作废选中产品吗？',
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
                    title: '产品作废',
                    desc: response.msg,
                  });
                  this.initialiseIndex(this.page - 1)
                } else {
                  this.$Notice.error({
                    title: '产品作废',
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

  .buttonPadding {
    width: 90px;
    text-align: center
  }

</style>
