<template>
  <div>
    <row :gutter="16" style="margin-bottom: 20px;display:flex;font-size: 15px">
      <i-col span="2" class="label">送货单号：</i-col>
      <i-col span="3">
        <i-input clearable v-model="wuliu_sn" placeholder="请输入送货单号"/>
      </i-col>
      <i-col span="2" class="label">采购单号：</i-col>
      <i-col span="3">
        <i-input clearable v-model="order_sn" placeholder="请输入采购单号"/>
      </i-col>
      <i-col span="2" class="label">单据日期：</i-col>
      <i-col span="3">
        <DatePicker :clearable="false" :options="options3" type="daterange" v-model="maker_date" @on-change="sss"
                    placeholder="请选择日期"></DatePicker>
      </i-col>
      <i-col span="2" class="label">当前状态：</i-col>
      <i-col span="3">
        <i-select v-model="status">
          <i-option v-for="item in statuss" :value="item.code" :key="item.code">
            {{ item.name }}
          </i-option>
        </i-select>
      </i-col>
      <i-col span="4"></i-col>
    </row>
    <row :gutter="16" style=" display:flex;font-size: 15px">
      <i-col span="2" class="label">产品名称：</i-col>
      <i-col span="3">
        <i-input clearable v-model="goods_name" placeholder="请输入产品名称"/>
      </i-col>
      <i-col span="2" class="label">产品编号：</i-col>
      <i-col span="3">
        <i-input clearable v-model="goods_sn" placeholder="请输入产品编号"/>
      </i-col>
      <i-col span="2" class="label">产品规格：</i-col>
      <i-col span="3">
        <i-input clearable v-model="goods_spec" placeholder="请输入产品规格"/>
      </i-col>
      <i-col span="2" class="label"></i-col>
      <i-col span="3">
      </i-col>
      <i-col span="4">
        <i-button type="primary" @click="initialiseIndex(1,true)">检索</i-button>
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
      <i-col span="2">
        <i-button type="success" class="buttonPadding" @click="updateGoods" v-show="disabledUpdate">修&nbsp;&nbsp;&nbsp;&nbsp;改</i-button>
      </i-col>
      <i-col span="12">&nbsp;</i-col>
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
    <table-expand ref="delivery"></table-expand>
    <div style="position : absolute;top: 91%;left: 1%;color: #ff3660;width: 450px;font-size: 10px"
         v-if="isSyncShow == false">
      注意：送货单打印只能按照单个送货单进行打印。被作废的打印条码，不能作为送货条码，进行送货，否则我们有权拒收。请勿重复使用条码。
    </div>
    <Spin fix v-show="spinShow">
      <Icon type="load-c" size="30" class="demo-spin-icon-load"></Icon>
      <div>检索中，请稍侯...</div>
    </Spin>
    <Modal title="修改送货米数" :mask-closable="false" v-model="updateShow" width=50>
      <i-form>
        <row :gutter="16" style="margin-bottom: 20px;display:flex;font-size: 15px">
          <i-col span="4">
            <form-item label="送货单号：" prop="wuliu_sn">
              <i-input v-model="updateDate.wuliu_sn" placeholder="请输入送货单号" disabled/>
            </form-item>
          </i-col>
          <i-col span="4">&nbsp;</i-col>
          <i-col span="4">
            <form-item label="分卷条码：" prop="song_person">
              <i-input :maxlength="100" v-model="updateDate.rec_sn" disabled/>
            </form-item>
          </i-col>
          <i-col span="4">&nbsp;</i-col>
          <i-col span="5">
            <form-item label="采购单号：" prop="song_date">
              <i-input :maxlength="100" v-model="updateDate.order_sn" disabled/>
            </form-item>
          </i-col>
          <i-col span="4">&nbsp;</i-col>
        </row>
        <row :gutter="16" style="margin-bottom: 20px;display:flex;font-size: 15px">
          <i-col span="4">
            <form-item label="商品编号：" prop="goods_sn">
              <i-input v-model="updateDate.goods_sn" placeholder="请输入送货单号" disabled/>
            </form-item>
          </i-col>
          <i-col span="4">&nbsp;</i-col>
          <i-col span="4">
            <form-item label="商品名称：" prop="song_person">
              <i-input :maxlength="100" v-model="updateDate.goods_name" placeholder="请输入送货人" disabled/>
            </form-item>
          </i-col>
          <i-col span="4">&nbsp;</i-col>
          <i-col span="5">
            <form-item label="送货数量：" prop="song_date">
              <i-input :maxlength="100" v-model="updateDate.song_qty" placeholder="请输入送货数量"/>
            </form-item>
          </i-col>
          <i-col span="4">&nbsp;</i-col>
        </row>
        <br>
      </i-form>
      <div slot="footer">
        <i-button @click="closeUpdate">关闭</i-button>
        <i-button type="info" @click="songQtyClick">保存</i-button>
      </div>
    </Modal>
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
        updateShow: false,
        disabledUpdate: true,
        status: 0,
        statuss: [
          {
            "code": 0, "name": "未入库"
          }, {
            "code": 1, "name": "已删除"
          }, {
            "code": 2, "name": "已入库"
          },
        ],
        isSyncFlag: true,
        isSyncShow: true,
        spinShow: false,
        clickBj: false,
        addTotalList: {
          "info": [],
        },
        indexClick: -1,
        allList: [],
        serviceProviders: [],
        appendSuccessAllList: [],
        singleList: {},
        DeliveryNotes: [],
        temporaryList: [],
        addClick: false,
        wuliu_sn: '',
        order_sn: '',
        goods_name: '',
        goods_sn: '',
        goods_spec: '',
        urls: '',
        maker_date: [new Date(), new Date()],
        // 每页显示条目个数
        numMain: constant.pageSize,
        // 当前页数
        pageMain: 1,
        // 总个数
        totalMain: 0,
        tableHeight: '',
        updateDate: {
          wuliu_sn: "",
          rec_sn: "",
          order_sn: "",
          goods_sn: "",
          goods_name: "",
          song_qty: "",
          rec_id: "",
        },
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
            width: 135
          },
          {
            title: '送货单位',
            key: 'company_name',
            align: 'center',
            width: 110
          },
          {
            title: '同步',
            key: 'is_sync_name',
            align: 'center',
            width: 90
          },
          {
            title: '送货单号',
            key: 'wuliu_sn',
            align: 'center',
            width: 140
          },
          {
            title: '采购单号',
            key: 'order_sn',
            align: 'center',
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
          },
          {
            title: '商品编号',
            key: 'goods_sn',
            align: 'center',
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
            width: 80
          },
          {
            title: '颜色',
            key: 'goods_color',
            align: 'center',
            width: 90
          },
          {
            title: '条纹',
            key: 'remarks',
            align: 'center',
            width: 80
          },
          {
            title: '送货数量',
            key: 'song_qty',
            align: 'center',
            width: 90
          },
          {
            title: '单位',
            key: 'goods_unit',
            align: 'center',
            width: 80
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
            width: 140
          },
          {
            title: '送货单号',
            key: 'wuliu_sn',
            align: 'center',
            width: 140
          },
          {
            title: '采购单号',
            key: 'order_sn',
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
            title: '条纹',
            key: 'remarks',
            align: 'center',
            width: 90
          },
          {
            title: '送货数量',
            key: 'song_qty',
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
        this.tableHeight = document.documentElement.clientHeight - 350
        var now = new Date();
        var nowTime = now.getTime();
        // var day = now.getDay();
        var oneDayLong = 24 * 60 * 60 * 1000;
        var MondayTime = nowTime - (7) * oneDayLong;
        // var SundayTime = nowTime + (7 - day) * oneDayLong;
        var monday = new Date(MondayTime);
        // var sunday = new Date(SundayTime);
        this.maker_date = [monday, now]
        this.initialiseIndex(1, false)
      }
    },
    methods: {
      //判断日期是否超出
      sss() {
        let start_date = Common.formatDate(this.maker_date[0], "yyyy-MM-dd")
        let end_date = Common.formatDate(this.maker_date[1], "yyyy-MM-dd")
        var day1 = new Date(start_date);
        var day2 = new Date(end_date);
        var pL = (day2 - day1) / (1000 * 60 * 60 * 24)
        if (pL > 7) {
          this.$Notice.error({
            title: '日期跨度不可以超过一周',
          });
          var now = new Date();
          var nowTime = now.getTime();
          // var day = now.getDay();
          var oneDayLong = 24 * 60 * 60 * 1000;
          var MondayTime = nowTime - (7) * oneDayLong;
          // var SundayTime = nowTime + (7 - day) * oneDayLong;
          var monday = new Date(MondayTime);
          // var sunday = new Date(SundayTime);
          this.maker_date = [monday, now]
        }
      },
      onTimeChange: function (isTime) {
        this.options3 = {
          disabledDate(date) {
            return date && date.valueOf() < 604800 || date && date.valueOf() < isTime - 604800 || date && date.valueOf() > isTime + 604800;
          }
        }
      },
      //<--------------------          增删改查翻页          -------------------->
      initialiseIndex(page, isFlage) {
        let flag = true
        this.spinShow = true
        let index = {
          "num": this.numMain,
          "page": page,
          "count": Cookies.get("count") === undefined ? '' : Cookies.get("count")
        }

        if (this.order_sn) {
          flag = false
          index.order_sn = this.order_sn
        }
        if (this.wuliu_sn) {
          flag = false
          index.wuliu_sn = this.wuliu_sn
        }

        if (this.goods_name) {
          flag = false
          index.goods_name = this.goods_name
        }
        if (this.goods_sn) {
          flag = false
          index.goods_sn = this.goods_sn
        }
        if (this.goods_spec) {
          flag = false
          index.goods_spec = this.goods_spec
        }
        if (flag) {
          index.start_date = Common.formatDate(this.maker_date[0], "yyyyMMdd")
          index.end_date = Common.formatDate(this.maker_date[1], "yyyyMMdd")
        }
        index.status = this.status
        let isFlages = true
        post('/index/Depot/getNewWuliu', index).then((response) => {
          this.spinShow = false
          Cookies.set("isFlage", true)
          let lists = []
          for (let i = 0; i < response.data.length; i++) {
            if (parseInt(response.data[i].is_sync) === 0) {
              response.data[i].is_sync_name = "未同步"
              isFlages = false
            } else if (parseInt(response.data[i].is_sync) === 1) {
              response.data[i].is_sync_name = "同步失败"
              isFlages = false
            } else {
              response.data[i].is_sync_name = parseInt(response.data[i].is_del) === 0 ? "同步成功" : "本单商品已注销"
            }
            response.data[i].is_del_name = parseInt(response.data[i].is_del) === 0 ? "正常" : "本单商品已注销"
            response.data[i]._disabled = parseInt(response.data[i].is_del) === 0 ? false : true

          }
          this.isSyncFlag = isFlages
          lists = response.data

          this.totalMain = response.data.length
          this.pageMain = page
          this.serviceProviders = lists.slice(page * this.numMain - this.numMain, page * this.numMain);
          Cookies.set("count", lists.length)
        }, err => {
          Common.errNotice(this, err, constant.distributorErrTitle)
        })
      },
      unique1(arr) {
        var hash = [];
        for (var i = 0; i < arr.length; i++) {
          if (hash.indexOf(arr[i].wuliu_id) == -1) {
            hash.push(arr[i]);
          }
        }
        return hash;
      },
      //主页翻页
      pageChange(value) {
        this.initialiseIndex(value, false)
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
        let _this = this
        if (_this.allList.length == 0) {
          _this.$Notice.error({
            title: '请选择要打印的条码',
          });
        } else {
          for (let i = 0; i < _this.allList.length; i++) {
            this.allList[i].img = _this.qrcode(_this.allList[i].rec_sn)
            this.allList[i].maker_date = _this.newDate()
          }
          Common.clickPrint(_this.allList)
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
        let _this = this
        let list = []
        if (_this.allList.length == 0) {
          _this.$Notice.error({
            title: '请选择要打印的送货单',
          });
        } else {
          let o = _this.allList
          for (let i = 0; i < o.length; i++) {
            console.log(JSON.stringify(list))
            let lists = {}
            let listsmall = []
            let listssmall = {}
            if (list.length == 0) {
              lists.IMG = _this.qrcode(o[i].wuliu_sn)
              lists.PuCode = o[i].wuliu_sn
              lists.dDate = o[i].order_date
              lists.nowdate = Common.formatDate(new Date(),"yyyy-MM-dd");
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
                  let FlagSmall = false
                  let KK = 0
                  for (let k = 0; k < list[j].data.length; k++) {
                    if( o[i].goods_spec == list[j].data[k].cInvStd) {
                      FlagSmall = true
                      KK = k
                      break;
                    }
                  }
                  if(FlagSmall){
                    list[j].data[KK].iQuantity = parseFloat(o[i].song_qty) + parseFloat(list[j].data[KK].iQuantity)
                  }else{
                    listssmall.cInvCode = o[i].goods_sn
                    listssmall.cInvName = o[i].goods_name
                    listssmall.cComUnitName = o[i].goods_unit
                    listssmall.cInvStd = o[i].goods_spec
                    listssmall.iQuantity = o[i].song_qty
                    listssmall.OrderSn = o[i].order_sn
                    list[j].data.push(listssmall)
                  }
                  Flag = false
                }
              }
              if (Flag) {
                lists.IMG = _this.qrcode(o[i].wuliu_sn)
                lists.PuCode = o[i].wuliu_sn
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
            this.initialiseIndex(this.pageMain)
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
      //修改
      updateGoods() {
        if (this.allList.length == 1) {
          this.updateShow = true
          this.updateDate.wuliu_sn = this.allList[0].wuliu_sn
          this.updateDate.rec_sn = this.allList[0].rec_sn
          this.updateDate.order_sn = this.allList[0].order_sn
          this.updateDate.goods_sn = this.allList[0].goods_sn
          this.updateDate.goods_name = this.allList[0].goods_name
          this.updateDate.rec_id = this.allList[0].rec_id
          this.updateDate.song_qty = ''
        } else {
          this.$Notice.error({
            title: '修改送货数量',
            desc: '请单选送货单',
          });
        }
      },
      //修改后保存
      songQtyClick() {
        if (this.updateDate.song_qty) {
          let params = {
            "rec_id": this.updateDate.rec_id,
            "song_qty": this.updateDate.song_qty,
          }
          post('/index/Depot/modQty', params).then((response) => {
            if (response > 0) {
              this.$Notice.success({
                title: '修改送货数量',
                desc: '修改成功',
              });
              this.updateShow = false
              this.allList = []
              this.initialiseIndex(this.pageMain)
            } else {
              this.$Notice.error({
                title: '修改送货数量',
                desc: '修改失败',
              });
            }

          }, err => {
            Common.errNotice(this, err, constant.distributorErrTitle)
          })
        }

      },
      closeUpdate() {
        this.updateShow = false
        this.allList = []
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
                  this.initialiseIndex(this.pageMain)
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
    },
    watch: {
      //监听按钮
      status() {
        if (this.status === 0) {
          this.disabledUpdate = true
          this.initialiseIndex(1, true)
        } else {
          this.disabledUpdate = false
          this.initialiseIndex(1, true)
        }
      },
    },
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
