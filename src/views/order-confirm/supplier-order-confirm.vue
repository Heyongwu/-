<template>
  <div>
    <row :gutter="16" style="margin-bottom: 20px;display:flex;font-size: 15px">
      <i-col span="3" class="label">订单号编号：</i-col>
      <i-col span="4">
        <i-input clearable v-model="order_sn" placeholder="请输入采购订单号" @on-enter="initialiseIndex(1)"/>
      </i-col>
      <i-col span="3" class="label">规格型号：</i-col>
      <i-col span="4">
        <i-input clearable v-model="goods_spec" placeholder="请输入规格型号" @on-enter="initialiseIndex(1)"/>
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
    <row :gutter="16" style="margin-bottom: 20px;display:flex;font-size: 15px">
      <i-col span="3" class="label">排产状态：</i-col>
      <i-col span="4">
        <i-select clearable v-model="plan_status">
          <i-option v-for="item in plan_statuss" :value="item.code" :key="item.code">{{ item.name }}
          </i-option>
        </i-select>
      </i-col>
      <i-col span="3" class="label">单据日期：</i-col>
      <i-col span="4">
        <DatePicker :clearable="false" @on-change="sss" type="daterange" v-model="order_date" placeholder="请输入单据日期"
                    style="width: 200px"></DatePicker>
      </i-col>
      <i-col span="3" class="label"></i-col>
      <i-col span="4">
      </i-col>
      <i-col span="3">
        <i-button type="primary" @click="initialiseIndex(1)">检索</i-button>
      </i-col>
    </row>
    <row :gutter="16">
      <i-col span="3">
        <i-button type="primary" @click="addServiceProviders()">新增</i-button>
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
    <Modal :title=title :mask-closable="false" v-model="configSingle" width=75 :styles="{top: '40px'}">
      <i-form :rules="checkRules" ref="refConfig" :model="orders_config_manage">
        <row :gutter="16">
          <i-col span="1">&nbsp;</i-col>
          <i-col span="4">
            <form-item label="订单日期：　 　 　 　" prop="order_date">
              <DatePicker type="date" v-model="orders_config_manage.order_date" placeholder="请选择订单日期"></DatePicker>
            </form-item>
          </i-col>
          <i-col span="1">&nbsp;</i-col>
          <i-col span="4">
            <form-item label="订单编号：" prop="sn">
              <i-input v-model="orders_config_manage.sn"/>
            </form-item>
          </i-col>
          <i-col span="1">&nbsp;</i-col>
          <i-col span="4">
            <form-item label="供应商：" prop="supplier">
              <i-select clearable v-model="orders_config_manage.supplier"
                        @on-change="jurisdictionMenurChange">
                <i-option v-for="item in orders_config_manage.suppliers" :value="item.company_sn" :key="item.id">
                  {{ item.company_name }}
                </i-option>
              </i-select>
            </form-item>
          </i-col>
          <i-col span="1">&nbsp;</i-col>
        </row>
        <row :gutter="16">
          <i-col span="1">&nbsp;</i-col>
          <i-col span="22">
            <form-item label="备注：" prop="call_type">
              <i-input type="textarea" v-model="orders_config_manage.remark"/>
            </form-item>
          </i-col>
          <i-col span="1">&nbsp;</i-col>
        </row>
        <row>
          <i-col span="1">&nbsp;</i-col>
          <i-col span="3">
            <i-button type="primary" @click="searchGoods(0)">新增商品</i-button>
          </i-col>
        </row>
        <row :gutter="16">
          <i-col span="1">&nbsp;</i-col>
          <i-col span="22">
            <!--            @on-current-change="deliveryChecked"-->
            <i-table border highlight-row ref="currentRowTable"
                     :height="tableHeightLis" :columns="configColumns" :data="configNote"></i-table>
          </i-col>
          <i-col span="1">&nbsp;</i-col>
        </row>
      </i-form>
      <div slot="footer">
        <i-button @click="configSingle = false">取消</i-button>
        <i-button type="primary" @click="createSubmit('add')" v-preventReClick>保存</i-button>
      </div>
    </Modal>
    <Modal :title=title :mask-closable="false" v-model="retrievalDeliverySingle" width=70>
      <i-form>
        <row :gutter="16">
          <i-col span="11">
            <i-input v-model="goods_sn" placeholder="请输入商品编号或者商品名称或助记符"/>
          </i-col>
          <i-col span="1" class="label">
            <i-button @click="searchGoods(0)">检索</i-button>
          </i-col>
          <i-col span="6">
          </i-col>
          <i-col span="3">
          </i-col>
        </row>
        <br>
        <row :gutter="16">
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
    <Modal title="生产计划详情" :mask-closable="false" v-model="productionPlanningCurriculumFlag" width=50>
      <row>
        <i-table border :height="tableHeight" :columns="columnsCurriculum" :data="Curriculum"></i-table>
      </row>
      <row>
        <i-col span="24" style="text-align: center">
          <Page :current="pageSon" :page-size="numSon" :total="totalSon" @on-change="pageChangeSon" simple/>
        </i-col>
      </row>
      <div slot="footer">
        <i-button @click="productionPlanningCurriculumFlag = false">关闭</i-button>
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
  import {constant} from '@/constant/constant'
  import Common from "@/utils/common";
  import TableExpand from '@/views/order-confirm/confirm-table-expand'

  export default {
    name: 'Ueditor',
    inject: ['reload'],
    data() {
      return {
        // <--------------------          基础变量          -------------------->
        columnsCurriculum: [
          {
            title: '机台编码',
            key: 'mac_id',
            align: 'center'
          }, {
            title: '机台名称',
            key: 'mac_sn',
            align: 'center'
          },
          {
            title: '生产开始时间',
            key: 'plan_begin',
            align: 'center'
          },
          {
            title: '生产结束时间',
            key: 'plan_end',
            align: 'center'
          },
          {
            title: '生产数量',
            key: 'plan_qty',
            align: 'center'
          }
        ],
        Curriculum: [],
        pageSon: 0,
        numSon: constant.pageSize,
        totalSon: 0,
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
        retrievalDeliverySingle: false,
        spinShow: false,
        order_sn: '',
        goods_spec: '',
        retrievalDeliveryNote: [],
        retrievalTableHeight: '',
        header: {token: ''},
        order_date: [new Date(), new Date()],
        other_party_name: '',
        contract_name: '',
        name: '',
        goods_sn: '',
        goods_name: '',
        loading: true,
        // 每页显示条目个数
        num: 10,
        numMax: constant.pageSize,
        // 当前页数
        page: 0,
        pageMax: 0,
        // 总个数
        total: 0,
        totalMax: 0,
        tableHeight: '',
        tableHeightLis: '',
        title: '新增采购单',
        configSingle: false,
        orders_config_manage: {
          order_date: '',
          sn: '',
          deptcode: '',
          taxrate: '13',
          remark: '',
          supplier: '',
          company_id: '',
          company_sn: '',
          company_name: '',
          suppliers: []
        },
        //<--------------------          表格头布局          -------------------->
        columns: [
          {
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
            key: 'goods_type',
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
            align: 'center',
            render: (h, params) => {
              this.keysRecId = params.row.rec_id
              return h('a', {
                attrs: {},
                on: {
                  click: () => {
                    this.fourCurriculum(params.row.rec_id, 0)
                  }
                }
              }, params.row.plan_qty)
            }
          },
          {
            title: '在途数量',
            key: 'deliver_qty',
            align: 'center'
          },
          {
            title: '已确认数量',
            key: 'receiv_qty',
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
        retrievalDeliveryColumns: [
          {
            title: '商品编码',
            key: 'goods_sn',
            align: 'center'
          }, {
            title: '商品名称',
            key: 'goods_name',
            align: 'center',
          }, {
            title: '助记符',
            key: 'memory_code',
            align: 'center',
          }, {
            title: '规格型号',
            key: 'goods_spec',
            align: 'center',
          },
          {
            title: '幅宽',
            key: 'goods_width',
            align: 'center',
          },
          {
            title: '颜色',
            key: 'goods_color',
            align: 'center',
          },
          {
            title: '单位',
            key: 'goods_unit',
            align: 'center'
          },
          {
            title: '加入订单',
            align: 'center',
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
        serviceProviders: [],
        configColumns: [
          {
            title: '商品编码',
            key: 'goods_sn',
            align: 'center'
          }, {
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
            title: '数量',
            key: 'amount_qty',
            align: 'center',
            render: (h, params) => {
              let _this = this;
              return h('div', [
                h(
                  "InputNumber", {
                    props: {
                      value: params.row.amount_qty,
                      transfer: true,  //select不受body显示，以免显示不出来
                    },
                    on: {
                      // 编辑数量的时候,触发的事件
                      'on-change': e => {
                        params.row.amount_qty = e
                        _this.configNote[params.index] = params.row
                        // this.updateDataMf() // 改变的时候触发一下改变数据时事件,这样只要编辑了就会获取里面的值
                        this.updateList()
                      }
                    }
                  },
                )]);
            }
          },
          {
            title: '单位',
            key: 'goods_unit',
            align: 'center'
          },
          {
            title: '原币含税单价',
            key: 'taxprice',
            align: 'center',
            render: (h, params) => {
              let _this = this;
              return h('div', [
                h(
                  "InputNumber", {
                    props: {
                      value: params.row.taxprice,
                      transfer: true,  //select不受body显示，以免显示不出来
                    },
                    on: {
                      // 编辑数量的时候,触发的事件
                      'on-change': e => {
                        params.row.taxprice = e
                        _this.configNote[params.index] = params.row
                        // this.updateDataMf() // 改变的时候触发一下改变数据时事件,这样只要编辑了就会获取里面的值
                        this.updateList()
                      }
                    }
                  },
                )]);
            }
          },
          {
            title: '原币价税合计',
            key: 'total_amount',
            align: 'center',
          },
          {
            title: '布纹',
            key: 'goods_type',
            align: 'center'
          },
          {
            title: '备注',
            key: 'remark',
            align: 'center',
            render: (h, params) => {
              let _this = this;
              return h('div', [
                h(
                  "Input", {
                    props: {
                      type: "Text",
                      value: params.row.remark,
                      transfer: true,  //select不受body显示，以免显示不出来
                    },
                    on: {
                      "on-blur": event => {
                        params.row.remark = event.target.value
                        _this.configNote[params.index] = params.row
                        this.updateDataMf() // 改变的时候触发一下改变数据时事件,这样只要编辑了就会获取里面的值
                      },
                    }
                  },
                )]);
            }
          },
          {
            title: '操作',
            align: 'center',
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'error',
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      this.removeDelivery(params.index, params.row)
                    }
                  }
                }, '删除')
              ]);
            }
          }, {
            key: 'goods_id',
            align: 'center',
            width: 1
          }
        ],
        productionPlanningCurriculumFlag: false,
        configNote: [],
        checkRules: {
          sn: [
            {required: true, message: '订单编号为必输项。', trigger: 'blur'}
          ],
          supplier: [
            {required: true, message: '供应商为必选项。', trigger: 'blur'}
          ],
          order_date: [
            {required: true, type: 'date', message: '订单日期为必选项', trigger: 'change'}
          ]
        }
      }
    },
    mounted() {
      if (Common.isTokenUndefined(this) == false) {
        this.$router.push('/')
        return
      } else {
        this.tableHeight = document.documentElement.clientHeight - 350
        this.tableHeightLis = document.documentElement.clientHeight - 450

        var now = new Date();
        var nowTime = now.getTime();
        // var day = now.getDay();
        var oneDayLong = 24 * 60 * 60 * 1000;
        var MondayTime = nowTime - (7) * oneDayLong;
        // var SundayTime = nowTime + (7 - day) * oneDayLong;
        var monday = new Date(MondayTime);
        // var sunday = new Date(SundayTime);
        this.order_date = [monday, now]
        this.initialiseIndex(1)
      }
    },
    methods: {
      //<--------------------          增删改查翻页          -------------------->
      //页面每天添加履历
      fourCurriculum(plan_id, page) {
        if (page === 0) {
          this.pageSon = 1
        }
        let params = {
          page: page,
          num: this.numSon,
          rec_id: plan_id
        }
        post('/index/Produce/getPlan', params).then((response) => {
          this.productionPlanningCurriculumFlag = true
          this.Curriculum = response.data
          this.totalSon = response.count
        }, err => {
          Common.errNotice(this, err, constant.distributorErrTitle)
        })
      },
      //初始化页面
      initialiseIndex(page) {
        let flag = true
        this.spinShow = true
        this.pageMax = page
        let index = {
          "num": this.numMax,
          "page": page
        }
        if (this.order_sn) {
          flag = false
          index.order_sn = this.order_sn
        }
        if (this.plan_status) {
          flag = false
          index.is_plan = this.plan_status
        }
        if (this.goods_spec) {
          flag = false
        }
        if (this.confirm_status) {
          flag = false
          index.is_confirm = this.confirm_status
        }
        if (this.order_date != ',' && flag) {
          index.start_date = Common.formatDate(this.order_date[0], "yyyy-MM-dd")
          index.end_date = Common.formatDate(this.order_date[1], "yyyy-MM-dd")
        }
        post('/index/Order/getNewOrder', index).then((response) => {
          if (response === 0) {
            this.spinShow = false
            // this.totalMax = response.count
            // this.serviceProviders = response.data
            this.totalMax = 0
            this.pageMax = page
            this.serviceProviders = []
          } else {
            this.spinShow = false
            let list = []
            if (this.goods_spec) {
              list = this.searchData(this.goods_spec, response.data)
              response.data = list
            }
            this.totalMax = response.data.length
            this.pageMax = page
            this.serviceProviders = response.data.slice(page * this.numMax - this.numMax, page * this.numMax);
          }
        }, err => {
          Common.errNotice(this, err, constant.distributorErrTitle)
        })
      },
      //模糊查询
      searchData(keyWord, list) {
        if (!Array.isArray(list) && keyWord !== '') return
        let arr = []
        let reg = new RegExp(keyWord, 'i') // 不区分大小写
        for (let i = 0; i < list.length; i++) {
          if(list[i].goods_spec){
            if (list[i].goods_spec.match(reg)) arr.push(list[i])
          }
        }
        return arr
      },
      pageChange(value) {
        this.initialiseIndex(value)
      },
      addServiceProviders() {
        post('/index/Company/getCompany?is_active=1').then((response) => {
          this.orders_config_manage.suppliers = response
        }, err => {
          Common.errNotice(this, err, constant.distributorErrTitle)
        })
        this.clearAddConfig()
        this.configSingle = true

      },
      check_price() {
        var price = '' + this.orders_config_manage.elderCode;
        price = price
          .replace(/[^\d.]/g, '') // 清除“数字”和“.”以外的字符
          .replace(/\.{2,}/g, '.') // 只保留第一个. 清除多余的
          .replace('.', '$#$')
          .replace(/\./g, '')
          .replace('$#$', '.')
          .replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3'); // 只能输入两个小数
        if (price.indexOf('.') < 0 && price != '') {
          // 以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额
          price = parseFloat(price);
        }
        this.orders_config_manage.elderCode = price;
      },
      //保存判断
      createSubmit(flag) {
        this.loading = false;
        this.$nextTick(() => {
          this.loading = true;
        });
        this.$refs['refConfig'].validate((valid) => {
          if (valid) {
            if (flag === 'add') {
              this.appendManage()
            }
          }
        })
      },
      //供应商传参
      jurisdictionMenurChange(val) {
        let params = this.orders_config_manage.suppliers
        for (let i = 0; i < params.length; i++) {
          if (params[i].company_sn == val) {
            this.orders_config_manage.company_id = params[i].company_id
            this.orders_config_manage.company_sn = params[i].company_sn
            this.orders_config_manage.company_name = params[i].company_name
          }
        }
      },
      // 更新选中的数据
      updateDataMf(val = this.selectData) {
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
      updateList() {
        let params = this.configNote
        for (let i = 0; i < params.length; i++) {
          this.configNote[i].total_amount = params[i].amount_qty * params[i].taxprice
          this.configNote[i].total_amount = this.configNote[i].total_amount.toFixed(2)

        }
      },
      //搜索所有商品
      searchGoods(page) {
        if (page === 0) {
          this.page = 1
        }
        let index = {
          "num": this.num,
          "page": page
        }
        if (this.goods_sn) {
          index.str = this.goods_sn
        }
        post('/index/Goods/getGoods', index).then((response) => {
          this.retrievalDeliveryNote = response
          post('/index/Goods/getGoodsNum', index).then((response) => {
            this.retrievalDeliverySingle = true
            this.total = response
          }, err => {
            Common.errNotice(this, err, constant.distributorErrTitle)
          })
        }, err => {
          Common.errNotice(this, err, constant.distributorErrTitle)
        })
      },
      pageChangeSon(value) {
        this.fourCurriculum(this.keysRecId, value - 1)
      },
      //翻页
      pageChangeTetrieval(value) {
        this.searchGoods(value - 1)
      },
      //将选中的订单添加到送货单表格中
      appendDeliveryList(val) {
        val.amount_qty = 0;
        val.total_amount = 0;
        val.remark = "";
        val.taxprice = 0;
        this.configNote.push(val)
        this.updateList()
        this.$Notice.success({
          title: '商品添加',
          desc: val.goods_name + '添加送货单成功！',
        });
      },
      //保存该采购单
      appendManage() {
        let params = {}
        params.order_date = Common.formatDate(this.orders_config_manage.order_date, "yyyy-MM-dd")
        params.order_sn = this.orders_config_manage.sn
        params.remark = this.orders_config_manage.remark
        params.company_id = this.orders_config_manage.company_id
        params.company_sn = this.orders_config_manage.company_sn
        params.company_name = this.orders_config_manage.company_name
        params.info = this.configNote
        if (params.info.length === 0) {
          this.$Notice.error({
            title: '采购单新增',
            desc: params.order_sn + ' 请新增商品！',
          });
          return
        }
        post('/index/Order/insertOrder', params).then((response) => {
          if (response > 0) {
            this.$Notice.success({
              title: '采购单新增',
              desc: params.order_sn + ' 采购单新增成功！',
            });
            this.configSingle = false
            this.initialiseIndex(1)
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
            this.configNote.splice(index, 1)
            this.$Notice.success({
              title: '商品删除',
              desc: row.goods_name + '删除成功！',
            });
          }
        })
      },
      clearAddConfig() {
        this.$refs['refConfig'].resetFields();
        this.orders_config_manage.order_date = ''
        this.orders_config_manage.sn = ''
        this.orders_config_manage.supplier = ''
        this.orders_config_manage.remark = ''
        this.configNote = []
      },
      sss() {
        let start_date = Common.formatDate(this.order_date[0], "yyyy-MM-dd")
        let end_date = Common.formatDate(this.order_date[1], "yyyy-MM-dd")
        var day1 = new Date(start_date);
        var day2 = new Date(end_date);
        var pL = (day2 - day1) / (1000 * 60 * 60 * 24)
        if (pL > 30) {
          this.$Notice.error({
            title: '日期跨度不可以超过一月',
          });
          var now = new Date();
          var nowTime = now.getTime();
          // var day = now.getDay();
          var oneDayLong = 24 * 60 * 60 * 1000;
          var MondayTime = nowTime - (7) * oneDayLong;
          // var SundayTime = nowTime + (7 - day) * oneDayLong;
          var monday = new Date(MondayTime);
          // var sunday = new Date(SundayTime);
          this.order_date = [monday, now]
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
