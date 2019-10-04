<template>
  <div>
    <row :gutter="16" style="margin-bottom: 20px;display:flex;font-size: 15px">
      <i-col span="3" class="label">订单号编号：</i-col>
      <i-col span="4">
        <i-input clearable v-model="order_sn" placeholder="请输入采购订单号"/>
      </i-col>
      <i-col span="3" class="label">规格型号：</i-col>
      <i-col span="4">
        <i-input clearable v-model="goods_spec" placeholder="请输入规格型号"/>
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
        <DatePicker :clearable="false" @on-change="sss" type="daterange" v-model="order_date" placeholder="请输入单据日期" style="width: 200px"></DatePicker>
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
        <i-button type="primary" @click="confirmSure()">确认</i-button>
      </i-col>
    </row>
    <br>
    <row>
      <i-table
          border ref="selection" @on-select-all="selectUnit" @on-select-cancel="selectUnit"
          @on-select="selectUnit" @on-select-all-cancel="selectUnit"
          :height="tableHeight" :columns="columns" :data="serviceProviders"
      ></i-table>
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

    <Modal title="安排生产计划" :mask-closable="false" v-model="productionPlanningFlag" width=50>
      <i-form>
        <row :gutter="16">
          <i-col span="2">&nbsp;</i-col>
          <i-col span="7">
            <form-item label="机台：" prop="mac">
              <i-select clearable v-model="mac" @on-change="jurisdictionMenurChange">
                <i-option v-for="item in macs" :value="item.mac_sn" :key="item.mac_sn">
                  {{ item.mac_name }}
                </i-option>
              </i-select>
            </form-item>
          </i-col>
          <i-col span="4">&nbsp;</i-col>
          <i-col span="7">
            <form-item label="生产开始日期：" prop="start_date">
              <DatePicker type="date" v-model="start_date" placeholder="请选择生产开始日期"></DatePicker>
            </form-item>

          </i-col>
          <i-col span="2">&nbsp;</i-col>
        </row>
        <row :gutter="16">
          <i-col span="2">&nbsp;</i-col>
          <i-col span="7">
            <form-item label="生产结束日期：" prop="order_date">
              <DatePicker type="date" v-model="end_date" placeholder="请选择生产结束日期"></DatePicker>
            </form-item>
          </i-col>
          <i-col span="4">&nbsp;</i-col>
          <i-col span="7">
            <form-item label="本次生产数量：" prop="counts">
              <!--              <InputNumber v-model="counts" style="width: 188px"  @blur.native.capture="check_price()"/>-->
              <InputNumber v-model="counts" style="width: 188px" v-on:input="check_price()"/>
            </form-item>
          </i-col>
          <i-col span="2">&nbsp;</i-col>
        </row>
      </i-form>
      <div slot="footer">
        <i-button @click="productionPlanningFlag = false">关闭</i-button>
        <i-button type="primary" @click="createSubmit">保存</i-button>
      </div>
    </Modal>
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
        pageSon: 0,
        numSon: constant.pageSize,
        totalSon: 0,
        productionPlanningCurriculumFlag: false,
        confirm_status: '',
        confirm_statuss: [{
          "code": 1, "name": "未确认"
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
        selectList: [],
        spinShow: false,
        retrievalDeliverySingle: false,
        productionPlanningFlag: false,
        retrievalDeliveryNote: [],
        retrievalTableHeight: '',
        titleNumber: 0,
        titlePlan: 0,
        order_id: '',
        rec_id: '',
        counts: 0,
        order_sn: '',
        goods_spec: '',
        order_date: [new Date(), new Date()],
        other_party_name: '',
        mac_id: '',
        mac_sn: '',
        mac: '',
        macs: [],
        start_date: '',
        end_date: '',
        contract_name: '',
        name: '',
        goods_sn: '',
        goods_name: '',
        loading: true,
        // 每页显示条目个数
        numMax: constant.pageSize,
        keysRecId: '',
        // 当前页数
        pageMax: 1,
        // 总个数
        totalMax: 0,
        tableHeight: '',
        //<--------------------          表格头布局          -------------------->
        columns: [
          {
            type: 'selection',
            width: 60,
            align: 'center',
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
          // {
          //   title: '布纹',
          //   key: 'goods_type',
          //   align: 'center'
          // },
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
          },
          {
            title: '操作',
            align: 'center',
            render: (h, params) => {
              if (params.row.confirm_status == 2) {
                return h('div', [
                  h('Button', {
                    props: {
                      type: 'warning',
                      size: 'small'
                    },
                    on: {
                      click: () => {
                        this.productionPlanning(params.index, params.row)
                      }
                    }
                  }, '安排生产计划')
                ]);
              } else {
                return h('div', [
                  h('Button', {
                    props: {
                      type: 'warning',
                      size: 'small',
                      disabled: true
                    },
                  }, '安排生产计划')
                ]);
              }
            }
          }
        ],
        serviceProviders: [],
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
      }
    },
    mounted() {
      // Common.isTokenUndefined(this)
      if (Common.isTokenUndefined(this) == false) {
        this.$router.push('/')
        return
      } else {
        this.tableHeight = document.documentElement.clientHeight - 350
        this.initialiseIndex(1)

      }
    },
    methods: {
      //<--------------------          增删改查翻页          -------------------->
      //初始化页面
      initialiseIndex(page) {
        this.spinShow = true
        this.pageMax = page
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
        post('/index/Order/getNewOrder', index).then((response) => {
          if(response === 0){
            this.spinShow = false
            // this.totalMax = response.count
            // this.serviceProviders = response.data
            this.totalMax = 0
            this.pageMax = page
            this.serviceProviders = []
          }else{
            this.spinShow = false
            let list = []
            if(this.goods_spec){
              for (let i = 0; i < response.data.length; i++) {
                if(this.goods_spec == response.data[i].goods_spec){
                  list.push(response.data[i])
                }
              }
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
      pageChange(value) {
        this.initialiseIndex(value)
      },
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
      confirmSure() {
        let list = []
        if (this.selectList.length === 0) {
          this.$Notice.error({
            title: '商品确认',
            desc: '请勾选您要确认的商品！',
          });
        } else {
          this.$Modal.confirm({
            title: '确认',
            content: '是否确认选择的商品？',
            okText: '确定',
            cancelText: '取消',
            onOk: () => {
              this.selectList.forEach(item => {
                let lists = {}
                if (list.length == 0) {
                  if(item.confirm_status !== 2){
                    let goods_id = []
                    lists.order_id = item.order_id
                    goods_id.push(item.goods_id)
                    lists.goods_ids = goods_id
                    list.push(lists)
                  }
                } else {
                  let flag = false
                  let index = 999
                  for (let i = 0; i < list.length; i++) {
                    if (list[i].order_id === item.order_id) {
                      flag = true
                      index = i
                      break;
                    }
                  }
                  if (flag) {
                    if(item.confirm_status !== 2){
                      list[index].goods_ids.push(item.goods_id)
                    }
                  } else {
                    if(item.confirm_status !== 2){
                      let goods_id = []
                      lists.order_id = item.order_id
                      goods_id.push(item.goods_id)
                      lists.goods_ids = goods_id
                      list.push(lists)
                    }
                  }
                }
              })
              if(list.length == 0){
                this.$Notice.error({
                  title: '商品重复确认',
                  desc: '请勾选未确认的商品！',
                });
                return
              }
              let flagLy = true
              for (let i = 0; i < list.length; i++) {
                let index = {
                  "order_id": list[i].order_id,
                  "goods_ids": list[i].goods_ids.join(",")
                }
                post('/index/Order/confirmOrder', index).then((response) => {
                  if (response <= 0) {
                    flagLy = false
                  }
                }, err => {
                  flagLy = false
                  Common.errNotice(this, err, constant.distributorErrTitle)
                })
              }
              if (flagLy) {
                this.$Notice.success({
                  title: '商品确认',
                  desc: '商品确认成功！',
                });
                this.initialiseIndex(1)
                this.selectList = []
              }
            }
          })
        }
      },
      //当勾选完毕取值
      selectUnit(selection) {
        this.selectList = selection
      },
      pageChangeSon(value) {
        this.fourCurriculum(this.keysRecId, value - 1)
      },
      //打开model
      productionPlanning(index, row) {
        let difference = row.amount_qty - row.plan_qty
        if (difference == 0) {
          this.$Notice.error({
            title: '安排生产',
            desc: "您的订单数量已经全部安排！",
          });
        } else {
          this.order_id = row.order_id
          this.rec_id = row.rec_id
          this.titleNumber = row.amount_qty
          this.titlePlan = row.plan_qty
          this.clearRefConfigTable()
          this.productionPlanningFlag = true
          this.getMac()
        }
      },
      clearRefConfigTable() {
        // this.$refs['refConfigTable'].resetFields();
        this.mac = ''
        this.start_date = ''
        this.end_date = ''
        this.counts = 0
      },
      check_price() {
        let difference = this.titleNumber - this.titlePlan
        if (this.counts > difference) {
          this.counts = this.titleNumber - this.titlePlan
          this.$Notice.error({
            title: '生产数量超出',
            desc: "本次计划数量不能超出总数！ " + '<br>' + " 当前可计划总数：" + difference
          });
        }
      },
      //获取机台
      getMac() {
        post('/index/BaseData/getMac').then((response) => {
          if (response === constant.distributorErrkCode1 || response === constant.distributorErrkCode2) {
            Common.errNotice(this, constant.distributorErrTitle2, constant.distributorErrTitle1)
          } else {
            this.macs = response
          }
        }, err => {
          Common.errNotice(this, err, constant.distributorErrTitle1)
        })
      },
      createSubmit() {
        if(this.mac == ''){
          this.$Notice.error({
            title: '请选择机台',
          });
          return
        }
        if(this.start_date == ''){
          this.$Notice.error({
            title: '请选择生产开始日期',
          });
          return
        }
        if(this.end_date == ''){
          this.$Notice.error({
            title: '请选择生产结束日期',
          });
          return
        }
        if(this.counts == ''){
          this.$Notice.error({
            title: '请输入本次生产数量',
          });
          return
        }
        this.productionPlanningSave()
      },
      //保存生产计划
      productionPlanningSave() {
        let params = {}
        params.order_id = this.order_id
        params.rec_id = this.rec_id
        params.order_sn = this.order_sn
        params.order_id = this.order_id
        params.plan_qty = this.counts
        params.plan_begin = Common.formatDate(this.start_date, "yyyy-MM-dd")
        params.plan_end = Common.formatDate(this.end_date, "yyyy-MM-dd")
        params.mac_id = this.mac_id
        params.mac_sn = this.mac_sn
        let difference = this.titleNumber - this.titlePlan
        if (this.counts > difference) {
          this.$Notice.error({
            title: '生产数量超出',
            desc: "本次计划数量不能超出总数！ " + '<br>' + " 当前可计划总数：" + difference
          });
        } else {
          post('/index/Produce/insertPlan', params).then((response) => {
            if (response > 0) {
              this.$Notice.success({
                title: '安排生产计划',
                desc: "本次安排生产计划成功！",
              });
              this.productionPlanningFlag = false
              this.initialiseIndex(1)
            }
          }, err => {
            Common.errNotice(this, err, constant.distributorErrTitle)
          })
        }
      },
      //机台传参
      jurisdictionMenurChange(val) {
        let params = this.macs
        for (let i = 0; i < params.length; i++) {
          if (params[i].mac_sn == val) {
            this.mac_id = params[i].mac_id
            this.mac_sn = params[i].mac_sn
          }
        }
      },
      //判断日期是否超出
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
          this.order_date = [new Date(), new Date()]
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
