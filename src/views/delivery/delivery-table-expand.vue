<!--<template>-->
<!--  <div>-->
<!--    <row>-->
<!--      <i-table border @on-select-all="selectUnit" @on-select-cancel="selectUnit"-->
<!--               @on-select="selectUnit" @on-select-all-cancel="selectUnit"-->
<!--               :height="tableHeight" :columns="columns2" :data="serviceProviders"></i-table>-->
<!--    </row>-->
<!--    <br><br>-->
<!--    <i-button @click="commodityConfirmation">打印条码</i-button>-->
<!--    <i-button @click="commoditySongHuodan">打印送货单</i-button>-->


<!--  </div>-->
<!--</template>-->
<!--<script>-->
<!--  import {post} from '@/utils/http'-->
<!--  import Common from "@/utils/common";-->
<!--  import BigImg from '@/views/delivery/delivery-image-small';-->
<!--  import {constant} from '@/constant/constant'-->
<!--  import Cookies from 'js-cookie'-->
<!--  import QRCode from 'qrcode'-->
<!--  import $ from "jquery";-->
<!--  // import $ from 'jquery'-->

<!--  export default {-->
<!--    props: {-->
<!--      row: Object,-->
<!--      tedayNum: Number,-->
<!--      isExpand: Boolean,-->
<!--      detailsFlag: Boolean,-->
<!--      wuliu_id: Number,-->
<!--      // wuliu_sn: String,-->
<!--      // song_person: String,-->
<!--      // song_date: Date,-->
<!--    },-->
<!--    components: {-->
<!--      'big-img': BigImg,-->
<!--    },-->
<!--    data() {-->
<!--      return {-->
<!--        // <&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;          基础变量          &#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&ndash;&gt;-->
<!--        isNulls: false,-->
<!--        currentDate: Common.formatDate(new Date(), "yyyy-MM-dd"),-->
<!--        // song_total_qty:0,-->
<!--        allTotalAll: [],-->
<!--        tableHeight: '',-->
<!--        selectList: [],-->
<!--        studentData: [],-->
<!--        studentDatas: [],-->
<!--        isShow: Cookies.get('isFlage'),-->
<!--        productionPlanningFlag: false,-->
<!--        isDaying: false,-->
<!--        titleNumber: 0,-->
<!--        titlePlan: 0,-->
<!--        counts: 0,-->
<!--        start_date: '',-->
<!--        end_date: '',-->
<!--        order_id: '',-->
<!--        rec_id: '',-->
<!--        rec_sn: '',-->
<!--        mac_id: '',-->
<!--        mac_sn: '',-->
<!--        mac: '',-->
<!--        macs: [],-->
<!--        showImg: false,-->
<!--        //<&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;          表格头布局          &#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&ndash;&gt;-->
<!--        serviceProviders: [],-->
<!--        columns: [],-->
<!--        columns1: [-->
<!--          {-->
<!--            title: '分卷条码',-->
<!--            key: 'rec_sn',-->
<!--            align: 'center'-->
<!--          },-->
<!--          {-->
<!--            title: '送货数量',-->
<!--            key: 'song_qty',-->
<!--            align: 'center',-->
<!--            render: (h, params) => {-->
<!--              let _this = this;-->
<!--              return h('div', [-->
<!--                h(-->
<!--                  "InputNumber", {-->
<!--                    props: {-->
<!--                      value: params.row.song_qty,-->
<!--                      transfer: true,  //select不受body显示，以免显示不出来-->
<!--                    },-->
<!--                    on: {-->
<!--                      // 编辑数量的时候,触发的事件-->
<!--                      'on-change': e => {-->
<!--                        params.row.song_qty = e-->
<!--                        _this.serviceProviders[params.index] = params.row-->
<!--                        this.$emit('getVal', _this.serviceProviders, false);-->
<!--                      }-->
<!--                    }-->
<!--                  },-->
<!--                )]);-->
<!--            }-->
<!--          }],-->
<!--        columns2: [-->
<!--          {-->
<!--            type: 'selection',-->
<!--            width: 60,-->
<!--            align: 'center',-->
<!--          },-->
<!--          {-->
<!--            title: '分卷条码',-->
<!--            key: 'rec_sn',-->
<!--            align: 'center'-->
<!--          },-->
<!--          {-->
<!--            title: '送货数量',-->
<!--            key: 'song_qty',-->
<!--            align: 'center',-->
<!--            render: (h, params) => {-->
<!--              let _this = this;-->
<!--              return h('div', [-->
<!--                h(-->
<!--                  "InputNumber", {-->
<!--                    props: {-->
<!--                      value: params.row.song_qty,-->
<!--                      transfer: true,  //select不受body显示，以免显示不出来-->
<!--                    },-->
<!--                    on: {-->
<!--                      // 编辑数量的时候,触发的事件-->
<!--                      'on-change': e => {-->
<!--                        params.row.song_qty = e-->
<!--                        _this.serviceProviders[params.index] = params.row-->
<!--                        this.$emit('getVal', _this.serviceProviders, false);-->
<!--                      }-->
<!--                    }-->
<!--                  },-->
<!--                )]);-->
<!--            }-->
<!--          }],-->
<!--        columns5: [-->
<!--          {-->
<!--            title: "分卷二维码",-->
<!--            key: "img",-->
<!--            align: 'center',-->
<!--            width: 120,-->
<!--            render: (h, params) => {-->
<!--              return h('img', {-->
<!--                style: {//设置样式-->
<!--                  'width': '100px',-->
<!--                  'height': '80px',-->
<!--                  'border-radius': '5%',-->
<!--                },-->

<!--                attrs: {//设置属性-->
<!--                  src: params.row.img,-->
<!--                },-->
<!--                on: {-->
<!--                  click: () => {-->
<!--                    this.handleChangeImg(params.row.img)-->
<!--                  }-->
<!--                }-->
<!--              });-->
<!--            }-->
<!--          },-->
<!--          {-->
<!--            title: '分卷条码',-->
<!--            key: 'rec_sn',-->
<!--            align: 'center',-->
<!--            width: 95,-->
<!--          }, {-->
<!--            title: '商品名称',-->
<!--            key: 'goods_name',-->
<!--            align: 'center',-->
<!--            width: 100,-->
<!--          },-->
<!--          {-->
<!--            title: '规格型号',-->
<!--            key: 'goods_spec',-->
<!--            align: 'center',-->
<!--            width: 100,-->
<!--          },-->
<!--          {-->
<!--            title: '单位',-->
<!--            key: 'goods_unit',-->
<!--            align: 'center',-->
<!--            width: 90,-->
<!--          },-->
<!--          {-->
<!--            title: '此次送货数量',-->
<!--            key: 'song_qty',-->
<!--            align: 'center',-->
<!--            width: 120,-->
<!--          }-->
<!--        ],-->
<!--        urls: '',-->
<!--      }-->
<!--    },-->
<!--    mounted() {-->
<!--      // console.log(JSON.stringify(this.row))-->
<!--      this.studentData = []-->
<!--      this.studentData.length = 0-->
<!--      //初始化-->
<!--      this.initialiseIndex(this.row)-->
<!--    },-->
<!--    methods: {-->
<!--      clickPrint() {-->
<!--        let subOutputRankPrint = document.getElementById('printContent');-->
<!--        // console.log(subOutputRankPrint.innerHTML);-->
<!--        let newContent = subOutputRankPrint.innerHTML;-->
<!--        let oldContent = document.body.innerHTML;-->
<!--        document.body.innerHTML = newContent;-->
<!--        window.print();-->
<!--        window.location.reload();-->
<!--        document.body.innerHTML = oldContent;-->
<!--        return false;-->
<!--      },-->
<!--      initialiseIndex(row) {-->
<!--        if (this.detailsFlag) {-->
<!--          this.columns = this.columns2-->
<!--          post('/index/Depot/getWuliuGoods?wuliu_id=' + this.wuliu_id).then((response) => {-->
<!--            this.serviceProviders = response.data-->
<!--          }, err => {-->
<!--            Common.errNotice(this, err, constant.distributorErrTitle)-->
<!--          })-->
<!--        } else {-->
<!--          this.columns = this.columns2-->
<!--          if (this.isExpand === true) {-->
<!--            this.$emit('isOpen', row._index)-->
<!--            this.serviceProviders = constant.appendList-->
<!--          } else {-->
<!--            let lists = []-->
<!--            for (let i = 0; i < row.song_total_num; i++) {-->
<!--              let sp = {}-->
<!--              sp.depot_qty = row.depot_qty-->
<!--              sp.song_qty = row.song_single_qty-->
<!--              sp.index = row._index-->
<!--              sp.rec_sn = Common.generationNumber(this.tedayNum)-->
<!--              lists.push(sp)-->
<!--              this.tedayNum++;-->
<!--            }-->
<!--            this.serviceProviders = lists-->
<!--            this.$emit('getVal', lists, true, row._index);-->
<!--            this.$emit('getTedayNum', this.tedayNum);-->
<!--            this.$emit('getIsExpand', true);-->
<!--          }-->
<!--        }-->
<!--      },-->
<!--      qrcode(contractValue) {-->
<!--        let _this = this-->
<!--        _this.urls = ''-->
<!--        const opts = {-->
<!--          errorCorrectionLevel: 'H',-->
<!--          type: 'image/jpeg',-->
<!--          rendererOpts: {-->
<!--            quality: 0.3-->
<!--          }-->
<!--        }-->
<!--        QRCode.toDataURL(contractValue, opts, function (err, url) {-->
<!--          if (err) throw err-->
<!--          _this.urls = url-->
<!--        })-->
<!--        return this.urls-->
<!--      },-->
<!--      handleChangeImg(e) {-->
<!--        this.showImg = true;-->
<!--        this.imgSrc = e;-->
<!--      },-->
<!--      //当勾选完毕取值-->
<!--      selectUnit(selection) {-->
<!--        //console.log(JSON.stringify(selection))-->
<!--        this.allTotalAll = []-->
<!--        let total = 0-->
<!--        let list = []-->
<!--        for (let i = 0; i < selection.length; i++) {-->
<!--          let lists = {}-->
<!--          let listsmall = []-->
<!--          let listssmall = {}-->
<!--          total += parseFloat(selection[i].song_qty)-->
<!--          selection[i].img = this.qrcode(selection[i].rec_sn)-->
<!--          selection[i].goods_name = this.row.goods_name-->
<!--          selection[i].goods_spec = this.row.goods_spec-->
<!--          selection[i].goods_color = this.row.goods_color-->
<!--          selection[i].goods_width = this.row.goods_width-->
<!--          selection[i].song_person = this.row.song_person-->
<!--          selection[i].order_date = this.row.order_date-->
<!--          selection[i].goods_unit = this.row.goods_unit-->
<!--          selection[i].wuliu_sn = this.row.wuliu_sn-->

<!--          lists.IMG = this.qrcode(this.row.wuliu_sn)-->
<!--          lists.PuCode = this.row.wuliu_sn-->
<!--          lists.dDate = this.row.order_date-->
<!--          lists.shPerson = this.row.song_person-->
<!--          lists.shDate = this.row.song_date-->

<!--          listssmall.cInvCode = this.row.goods_sn-->
<!--          listssmall.cInvName = this.row.goods_name-->
<!--          listssmall.cComUnitName = this.row.goods_unit-->
<!--          listssmall.cInvStd = this.row.goods_spec-->
<!--          listssmall.iQuantity =selection[i].song_qty-->
<!--          listsmall.push(listssmall)-->
<!--          lists.data = listsmall-->
<!--          list.push(lists)-->
<!--        }-->
<!--        this.allTotalAll = list-->
<!--        this.selectList = selection-->
<!--        this.row.song_total_qty = total.toFixed(2)-->
<!--      },-->
<!--      //打印条码-->
<!--      commodityConfirmation() {-->
<!--        let flag;-->
<!--        flag = Cookies.get('isFlage')-->
<!--        if (flag === 'true') {-->
<!--          this.studentData = []-->
<!--          if (this.selectList.length === 0) {-->
<!--            this.$Notice.error({-->
<!--              title: '打印条码',-->
<!--              desc: '请勾选您要打印的商品！',-->
<!--            });-->
<!--          } else {-->
<!--            Common.clickPrint(this.selectList)-->
<!--          }-->
<!--        } else {-->
<!--          this.$Notice.error({-->
<!--            title: '订单未保存',-->
<!--            desc: '请先保存您的订单！',-->
<!--          });-->
<!--        }-->
<!--      },-->
<!--      //打印送货单-->
<!--      commoditySongHuodan() {-->
<!--        let flag;-->
<!--        flag = Cookies.get('isFlage')-->
<!--        if (flag === 'true') {-->
<!--          this.studentData = []-->
<!--          if (this.selectList.length === 0) {-->
<!--            this.$Notice.error({-->
<!--              title: '打印送货单',-->
<!--              desc: '请勾选您要打印的商品！',-->
<!--            });-->
<!--          } else {-->
<!--            let list = this.allTotalAll-->
<!--            let lists =  []-->
<!--            let total = 0-->
<!--            for (let i = 0; i < list.length; i++) {-->
<!--              total += list[i].data[0].iQuantity-->
<!--            }-->
<!--            //console.log(JSON.stringify(this.allTotalAll[0]))-->
<!--            lists.push(this.allTotalAll[0])-->
<!--            //console.log("lists-&ndash;&gt;"+JSON.stringify(lists))-->
<!--            lists[0].data[0].iQuantity = total-->
<!--            Common.fnPrint(lists)-->
<!--          }-->
<!--        } else {-->
<!--          this.$Notice.error({-->
<!--            title: '订单未保存',-->
<!--            desc: '请先保存您的订单！',-->
<!--          });-->
<!--        }-->
<!--      },-->
<!--    }-->
<!--  };-->
<!--</script>-->
<!--<style scoped>-->
<!--  .img.open {-->
<!--    cursor: zoom-out;-->
<!--    max-width: 800px;-->
<!--    max-height: 1000px;-->
<!--  }-->

<!--  .label {-->
<!--    font-size: 15px;-->
<!--  }-->
<!--</style>-->
<!--&lt;!&ndash;<style media="printContent" type="text/css">&ndash;&gt;-->
<!--&lt;!&ndash;  .noprint {&ndash;&gt;-->
<!--&lt;!&ndash;    display:none&ndash;&gt;-->
<!--&lt;!&ndash;  }&ndash;&gt;-->
<!--&lt;!&ndash;  .print {&ndash;&gt;-->
<!--&lt;!&ndash;    margin-left:25%&ndash;&gt;-->
<!--&lt;!&ndash;  }&ndash;&gt;-->
<!--&lt;!&ndash;  page&ndash;&gt;-->
<!--&lt;!&ndash;        {&ndash;&gt;-->
<!--&lt;!&ndash;          size:  auto;   /* auto is the initial value */&ndash;&gt;-->
<!--&lt;!&ndash;          margin: 0mm;  /* this affects the margin in the printer settings */&ndash;&gt;-->
<!--&lt;!&ndash;        }&ndash;&gt;-->
<!--&lt;!&ndash;</style>&ndash;&gt;-->
