<template>
  <div>
    <row :gutter="16" style="margin-bottom: 20px;display:flex;font-size: 15px">

      <i-col span="3" class="label">当前完成状态：</i-col>
      <i-col span="4">
        <i-select clearable  v-model="state">
          <i-option v-for="item in states" :value="item.code" :key="item.code">{{ item.name }}
          </i-option>
        </i-select>
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
    <br>
    <row>
      <i-table border :height="tableHeight" :columns="columns" :data="serviceProviders"></i-table>
    </row>
    <row>
      <i-col span="24" style="text-align: center">
        <Page :current="page" :page-size="num" :total="total" simple/>
      </i-col>
    </row>
    <Modal :title=title :mask-closable="false" v-model="productionPlanningFlag" width=50>
      <i-form>
        <row v-if="typePlan == 3" :gutter="16" style="margin-bottom: 20px;display:flex;font-size: 15px">
          <i-col span="2">&nbsp;</i-col>
          <i-col span="6">
            <form-item label="开始日期：" prop="order_date">
              <DatePicker type="date" v-model="start_date" placeholder="请选择开始日期"></DatePicker>
            </form-item>
          </i-col>
          <i-col span="5">&nbsp;</i-col>
          <i-col span="6">
            <form-item label="结束日期：" prop="order_date">
              <DatePicker type="date" v-model="end_date" placeholder="请选择结束日期"></DatePicker>
            </form-item>
          </i-col>
          <i-col span="2">&nbsp;</i-col>
        </row>
        <row :gutter="16" style="margin-bottom: 20px;display:flex;font-size: 15px">
          <i-col span="2">&nbsp;</i-col>
          <i-col span="5">
            <form-item label="数量：" prop="sn">
              <!--              <InputNumber v-model="counts" style="width: 188px"  @blur.native.capture="check_price()"/>-->
              <InputNumber v-model="counts" style="width: 188px"
                           @blur.native.capture="check_price(titleNumber,titlePlan)"/>
            </form-item>
          </i-col>
          <i-col span="6">&nbsp;</i-col>
          <i-col v-if="typePlan !== 3" span="5">
            <form-item label="日期：" prop="order_date">
              <DatePicker type="date" v-model="produceDate" placeholder="请选择日期"></DatePicker>
            </form-item>
          </i-col>
          <i-col span="2">&nbsp;</i-col>
        </row>
      </i-form>
      <div slot="footer">
        <i-button @click="productionPlanningFlag = false">关闭</i-button>
        <i-button type="primary" @click="productionPlanningSave">保存</i-button>
      </div>
    </Modal>

    <Modal :title=titleCurriculum :mask-closable="false" v-model="productionPlanningCurriculumFlag" width=50>
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
  import Cookies from 'js-cookie'

  export default {

    name: 'Ueditor',
    data() {
      return {
        // <--------------------          基础变量          -------------------->
        typePlan: 0,
        typeCurriculum: '',
        header: {token: ''},
        code: '',
        other_party_name: '',
        contract_name: '',
        name: '',
        leftSans: true,
        spinShow: true,
        valLeftRight: '',
        planLeftRight: '',
        loading: true,
        // 每页显示条目个数
        num: constant.pageSize,
        numSon: constant.pageSize,
        // 当前页数
        page: 0,
        pageSon: 0,
        // 总个数
        total: 0,
        totalSon: 0,
        tableHeight: '',
        title: '',
        titleCurriculum: '',
        titleNumber: 0,
        titlePlan: 0,
        counts: 0,
        start_date: '',
        end_date: '',
        produceDate: '',
        order_id: '',
        rec_id: '',
        goods_id: '',
        goods_sn: '',
        mac_id: '',
        mac_sn: '',
        plan_id: '',
        state: '',
        states: [
          {"code": 0, name: "未生产"},
          {"code": 1, name: "开始生产"},
          {"code": 2, name: "完成生产"},
        ],
        productionPlanningFlag: false,
        productionPlanningCurriculumFlag: false,
        //<--------------------          表格头布局          -------------------->
        serviceProviders: [],
        Curriculum: [],
        columnsCurriculum: [],

        columnsCurriculum1: [
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
            title: '产能数量',
            key: 'produce_qty',
            align: 'center'
          },
          {
            title: '汇报时间',
            key: 'report_date',
            align: 'center'
          },
        ],

        columnsCurriculum2: [
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
            title: '检验数量',
            key: 'check_qty',
            align: 'center'
          },
          {
            title: '检验时间',
            key: 'check_date',
            align: 'center'
          },
        ],

        columnsCurriculum3: [
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
            title: '定型数量',
            key: 'dingxing_qty',
            align: 'center'
          },
          {
            title: '定型开始时间',
            key: 'start_date',
            align: 'center'
          },
          {
            title: '定型结束时间',
            key: 'end_date',
            align: 'center'
          },
        ],

        columnsCurriculum4: [
          {
            title: '机台序号',
            key: 'mac_id',
            align: 'center'
          }, {
            title: '机台编码',
            key: 'mac_sn',
            align: 'center'
          },
          {
            title: '商品编码',
            key: 'goods_sn',
            align: 'center'
          },
          {
            title: '入库数量',
            key: 'in_num',
            align: 'center'
          },
          {
            title: '入库时间',
            key: 'in_date',
            align: 'center'
          },
        ],
        columns: [
          {
            title: '机台编码',
            key: 'mac_id',
            align: 'center'
          }, {
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
            title: '单位',
            key: 'goods_unit',
            align: 'center'
          },
          {
            title: '计划数量',
            key: 'plan_qty',
            align: 'center'
          },
          {
            title: '产能数量',
            key: 'produce_qty',
            align: 'center',
            render: (h, params) => {
              return h('a', {
                attrs: {},
                on: {
                  click: () => {
                    this.titleCurriculum = "产能数量履历"
                    this.fourCurriculum("capacity", params.row.plan_id)
                  }
                }
              }, params.row.produce_qty)
            }
          },
          {
            title: '检验数量',
            key: 'check_qty',
            align: 'center',
            render: (h, params) => {
              return h('a', {
                attrs: {},
                on: {
                  click: () => {
                    this.titleCurriculum = "检验数量履历"
                    this.fourCurriculum("check", params.row.plan_id)
                  }
                }
              }, params.row.check_qty)
            }
          },
          {
            title: '定型数量',
            key: 'dingxing_qty',
            align: 'center',
            render: (h, params) => {
              return h('a', {
                attrs: {},
                on: {
                  click: () => {
                    this.titleCurriculum = "定型数量履历"
                    this.fourCurriculum("dingxing", params.row.plan_id)
                  }
                }
              }, params.row.dingxing_qty)
            }
          },
          {
            title: '入库数量',
            key: 'in_qty',
            align: 'center',
            render: (h, params) => {
              return h('a', {
                attrs: {},
                on: {
                  click: () => {
                    this.titleCurriculum = "入库数量履历"
                    this.fourCurriculum("ruku", params.row.goods_id)
                  }
                }
              }, params.row.in_qty)
            }
          }, {
            title: '操作',
            align: 'center',
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'primary',
                    size: 'small',
                    disabled: this.isDisabled(params.row.plan_qty, params.row.produce_qty),
                  },
                  style: {
                    marginTop: '5px',
                    marginRight: '5px',
                    marginBottom: '5px'
                  },
                  on: {
                    click: () => {
                      this.titleNumber = params.row.plan_qty
                      this.titlePlan = params.row.produce_qty
                      this.productionPlanningFlag = true
                      this.title = "产能汇报"
                      this.typePlan = 1
                      this.addClear(params)
                    }
                  }
                }, '汇 报'),
                h('Button', {
                  props: {
                    type: 'warning',
                    size: 'small',
                    disabled: this.isDisabled(params.row.produce_qty, params.row.check_qty),
                  },
                  style: {
                    marginTop: '5px',
                    marginRight: '5px',
                    marginBottom: '5px'
                  },
                  on: {
                    click: () => {
                      this.titleNumber = params.row.produce_qty
                      this.titlePlan = params.row.check_qty
                      this.productionPlanningFlag = true
                      this.title = "产品检验"
                      this.typePlan = 2
                      this.addClear(params)
                    }
                  }
                }, '检 验'),
                h('Button', {
                  props: {
                    type: 'info',
                    size: 'small',
                    disabled: this.isDisabled(params.row.check_qty, params.row.dingxing_qty),
                  },
                  style: {
                    marginRight: '5px',
                    marginBottom: '5px',
                  },
                  on: {
                    click: () => {
                      this.titleNumber = params.row.check_qty
                      this.titlePlan = params.row.dingxing_qty
                      this.productionPlanningFlag = true
                      this.title = "产品定型"
                      this.typePlan = 3
                      this.addClear(params)
                    }
                  }
                }, '定 型'),
                h('Button', {
                  props: {
                    type: 'success',
                    size: 'small',
                    disabled: this.isDisabled(params.row.dingxing_qty, params.row.in_qty),
                  },
                  style: {
                    marginRight: '5px',
                    marginBottom: '5px',
                  },
                  on: {
                    click: () => {
                      this.titleNumber = params.row.dingxing_qty
                      this.titlePlan = params.row.in_qty
                      this.title = "产品入库"
                      this.typePlan = 4
                      this.addClear(params)
                    }
                  }
                }, '入 库')
              ]);
            }
          }
        ],
        //<--------------------          表格头布局          -------------------->

      }
    },
    mounted() {
      if (Common.isTokenUndefined(this) == false) {
        this.$router.push('/')
        return
      } else {
        this.tableHeight = document.documentElement.clientHeight - 300
        this.initialiseIndex(0)
      }
    },
    methods: {
      //<--------------------          增删改查翻页          -------------------->
      //初始化页面
      initialiseIndex(page) {
        this.spinShow = true
        this.page = page + 1
        let params = {
          "num":this.num,
          "page":page,
        }
        if (this.state) {
          params.plan_status = this.state
        }
        post('/index/Produce/getPlan', params).then((response) => {
          this.spinShow = false
          this.total = response.count
          this.serviceProviders = response.data
        }, err => {
          Common.errNotice(this, err, constant.distributorErrTitle)
        })
      },
      pageChange(value) {
        this.initialiseIndex(value - 1)
      },

      //判断是否禁用按钮
      isDisabled(valTypeLeft, valTypeRight) {
        if (valTypeLeft <= 0 || valTypeLeft - valTypeRight <= 0) {
          return true
        } else {
          return false
        }
      },
      check_price(valTypeLeft, valTypeRight) {
        let difference = valTypeLeft - valTypeRight
        if (this.counts > difference) {
          // this.counts = difference
          this.$Notice.error({
            title: '数量超出',
            desc: "数量不能超出总数！ " + '<br>' + " 当前可用总数：" + difference
          });
        }
      },
      checkIsNull() {
        if (this.counts == '') {
          this.$Notice.error({
            title: '请输入数量',
          });
          return
        }
        if (this.produceDate == '') {
          this.$Notice.error({
            title: '请选择日期',
          });
          return
        }
      },
      checkIsNullDingX() {
        if (this.start_date == '') {
          this.$Notice.error({
            title: '请选择开始日期',
          });
          return
        }
        if (this.end_date == '') {
          this.$Notice.error({
            title: '请选择结束日期',
          });
          return
        }

      },
      productionPlanningSave() {
        let params = {}
        // params.goods_id = this.goods_id
        params.plan_id = this.plan_id
        params.mac_id = this.mac_id
        params.mac_sn = this.mac_sn
        if (this.typePlan === 1) {
          this.checkIsNull()
          let difference = this.titleNumber - this.titlePlan
          if (this.counts > difference) {
            this.$Notice.error({
              title: '汇报数量超出',
              desc: "汇报数量不能超出计划总数！ " + '<br>' + " 当前可汇报总数：" + difference
            });
          } else {
            params.produce_qty = this.counts
            params.report_date = Common.formatDate(this.produceDate, "yyyy-MM-dd")
            this.insertCapacity(params)
          }
        } else if (this.typePlan === 2) {
          this.checkIsNull()
          let difference = this.titleNumber - this.titlePlan
          if (this.counts > difference) {
            this.$Notice.error({
              title: '检验数量超出',
              desc: "检验数量不能超出汇报总数！ " + '<br>' + " 当前可检验总数：" + difference
            });
          } else {
            params.check_qty = this.counts
            params.check_date = Common.formatDate(this.produceDate, "yyyy-MM-dd")
            this.insertCheck(params)
          }
        } else if (this.typePlan === 3) {
          this.checkIsNullDingX()
          if (Common.isNullOrUndefined(this.counts) == false) {
            this.$Notice.error({
              title: '请输入数量',
            });
            return
          }
          let difference = this.titleNumber - this.titlePlan
          if (this.counts > difference) {
            this.$Notice.error({
              title: '定型数量超出',
              desc: "定型数量不能超出检验总数！ " + '<br>' + " 当前可定型总数：" + difference
            });
          } else {
            params.dingxing_qty = this.counts
            params.start_date = Common.formatDate(this.start_date, "yyyy-MM-dd")
            params.end_date = Common.formatDate(this.end_date, "yyyy-MM-dd")
            this.insertDingxing(params)
          }
        } else {
          this.checkIsNull()
          let difference = this.titleNumber - this.titlePlan
          if (this.counts > difference) {
            this.$Notice.error({
              title: '入库数量超出',
              desc: "入库数量不能超出定型总数！ " + '<br>' + " 当前可入库总数：" + difference
            });
          } else {
            params.in_num = this.counts
            params.goods_id = this.goods_id
            params.goods_sn = this.goods_sn
            params.in_date = Common.formatDate(this.produceDate, "yyyy-MM-dd")
            this.inDepot(params)
          }
        }
      },
      //产能汇报
      insertCapacity(params) {
        post('/index/Produce/insertCapacity', params).then((response) => {
          if (response > 0) {
            this.$Notice.success({
              title: '产能汇报',
              desc: "产能汇报成功！ "
            });
            this.productionPlanningFlag = false
            this.initialiseIndex()
          }
        }, err => {
          Common.errNotice(this, err, constant.distributorErrTitle)
        })
      },
      //check检验
      insertCheck(params) {
        post('/index/Produce/insertCheck', params).then((response) => {
          if (response > 0) {
            this.$Notice.success({
              title: '产品检验',
              desc: "产品检验成功！ "
            });
            this.productionPlanningFlag = false
            this.initialiseIndex()
          }
        }, err => {
          Common.errNotice(this, err, constant.distributorErrTitle)
        })
      },
      //dingxing定型
      insertDingxing(params) {
        post('/index/Produce/insertDingxing', params).then((response) => {
          if (response > 0) {
            this.$Notice.success({
              title: '产品定型',
              desc: "产品定型成功！ "
            });
            this.productionPlanningFlag = false
            this.initialiseIndex()
          }
        }, err => {
          Common.errNotice(this, err, constant.distributorErrTitle)
        })
      },
      //inDepot 入库
      inDepot(params) {
        post('/index/Depot/inDepot', params).then((response) => {
          if (response > 0) {
            this.$Notice.success({
              title: '产品入库',
              desc: "产品入库成功！ "
            });
            this.productionPlanningFlag = false
            this.initialiseIndex()
          }
        }, err => {
          Common.errNotice(this, err, constant.distributorErrTitle)
        })
      },

      addClear(params) {
        this.productionPlanningFlag = true
        this.goods_id = params.row.goods_id
        this.goods_sn = params.row.goods_sn
        this.mac_id = params.row.mac_id
        this.mac_sn = params.row.mac_sn
        this.plan_id = params.row.plan_id
        this.start_date = ''
        this.end_date = ''
        this.counts = ''
        this.produceDate = ''
      },

      //页面每天添加履历
      fourCurriculum(val, plan_id) {
        if (val == "capacity") {
          this.columnsCurriculum = this.columnsCurriculum1
          this.leftSans = true
          this.planLeftRight = plan_id
          this.valLeftRight = val
        } else if (val == "check") {
          this.leftSans = true
          this.planLeftRight = plan_id
          this.valLeftRight = val
          this.columnsCurriculum = this.columnsCurriculum2
        } else if (val == "dingxing") {
          this.leftSans = true
          this.planLeftRight = plan_id
          this.valLeftRight = val
          this.columnsCurriculum = this.columnsCurriculum3
        } else if (val == "ruku") {
          this.leftSans = false
          this.planLeftRight = plan_id
          this.valLeftRight = val
          this.columnsCurriculum = this.columnsCurriculum4
          this.rightYi(0, val, plan_id)
          return
        }
        this.leftSan(0, val, plan_id)
      },
      // model查询数据
      rightYi(page, val, plan_id) {
        if (page === 0) {
          this.pageSon = 1
        }
        let params = {
          page: page,
          num: this.numSon,
          type: val,
          goods_id: plan_id
        }
        post('/index/Depot/getDepotIn', params).then((response) => {
          this.productionPlanningCurriculumFlag = true
          this.Curriculum = response.data
          this.totalSon = response.count
        }, err => {
          Common.errNotice(this, err, constant.distributorErrTitle)
        })
      },
      // model查询数据
      leftSan(page, val, plan_id) {
        if (page === 0) {
          this.pageSon = 1
        }
        let params = {
          page: page,
          num: this.numSon,
          type: val,
          plan_id: plan_id
        }
        post('/index/Produce/getDetail', params).then((response) => {
          this.productionPlanningCurriculumFlag = true
          this.Curriculum = response.data
          this.totalSon = response.count
        }, err => {
          Common.errNotice(this, err, constant.distributorErrTitle)
        })
      },
      pageChangeSon(value) {
        if (this.leftSans) {
          this.leftSan(value - 1, this.valLeftRight, this.planLeftRight)
        } else {
          this.rightYi(value - 1, this.valLeftRight, this.planLeftRight)
        }
      },
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
