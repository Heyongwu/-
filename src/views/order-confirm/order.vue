<template>
  <div class="layout">
    <Layout :style="{minHeight: '100'}">
      <Sider collapsible :collapsed-width="78" v-model="isCollapsed">
        <div v-show="!isCollapsed" class="layout-logo-left">
          <div class="name">供应商系统</div>
        </div>
        <div v-show="isCollapsed" class="logo-con">
          <div class="name">供应商系统</div>
        </div>
        <Menu theme="dark" width="auto" :class="menuitemClasses">
          <router-link :to="{path: pathurls.name}" v-for="pathurls in pathUrl" :key="pathurls.code">
            <menu-item :name="pathurls.code">
              <Icon type="ios-flag"></Icon>
              <span>采购订单</span>
            </menu-item>
          </router-link>
        </Menu>
      </Sider>
      <Layout>
        <Header :style="{background: '#fff', boxShadow: '0 2px 3px 2px rgba(0,0,0,.1)'}">
          <div class="user-info">
            <Dropdown class="user-info" @on-click="handleClick">
              <a href="javascript:void(0)">
                {{uName}}
                <Icon type="ios-arrow-down"></Icon>
              </a>
              <DropdownMenu slot="list">
                <DropdownItem name="logout">退出登陆</DropdownItem>
              </DropdownMenu>
            </Dropdown>
            <div class="user-info">欢迎！</div>
          </div>
        </Header>
        <Content :style="{padding: '0 16px 16px'}">
          <Breadcrumb :style="{margin: '16px 0'}">
            <BreadcrumbItem to="/home">Home</BreadcrumbItem>
            <BreadcrumbItem>采购订单</BreadcrumbItem>
          </Breadcrumb>
          <Card>
            <div ref="homePage">
              <router-view/>
            </div>
          </Card>
        </Content>
      </Layout>
    </Layout>
  </div>
</template>
<script>
  import common from '@/utils/common'
  import Cookies from 'js-cookie'

  export default {
    data() {
      return {
        isCollapsed: false,
        uName: '',
        clientHeight: '',
        p1: '',
        pathUrlList: [
          {"code": "orderConfirm", "name": "/home/order/orderConfirm"},
          {"code": "supplierOrderConfirm", "name": "/home/order/supplierOrderConfirm"}
        ],
        pathUrl1: [
          {"code": "orderConfirm", "name": "/home/order/orderConfirm"}
        ],
        pathUrl2: [
          {"code": "supplierOrderConfirm", "name": "/home/order/supplierOrderConfirm"}
        ],
        pathUrl: []
      };
    },
    mounted() {
      if (common.isTokenUndefined(this) == false) {
        this.$router.push('/')
        return
      } else {
        if (Cookies.get("company_type") == 0) {
          // if(window.location.href.length === 34){
          // this.p1 = "orderConfirm"
          // this.$router.push('/home/order/orderConfirm')
          this.pathUrl = this.pathUrlList
        } else if (Cookies.get("company_type") == 1) {
          this.p1 = "supplierOrderConfirm"
          this.pathUrl = this.pathUrl2
          this.$router.push('/home/order/supplierOrderConfirm')
        } else if (Cookies.get("company_type") == 2) {
          this.p1 = "orderConfirm"
          this.pathUrl = this.pathUrl1
          this.$router.push('/home/order/orderConfirm')
        }
        // 获取浏览器可视区域高度
        this.clientHeight = document.documentElement.clientHeight
        window.onresize = () => {
          return (() => {
            this.clientHeight = document.documentElement.clientHeight
          })()
        }
      }
    },
    watch: {
      // 如果 `clientHeight` 发生改变，这个函数就会运行
      clientHeight: function () {
        this.changeFixed(this.clientHeight)
      }
    },
    computed: {
      menuitemClasses: function () {
        return [
          'menu-item',
          this.isCollapsed ? 'collapsed-menu' : ''
        ]
      }
    },
    methods: {
      handleClick(name) {
        switch (name) {
          case 'logout':
            common.logout()
            this.$router.push('/')
            break
        }
      },
      changeFixed(clientHeight) {
        // 动态修改样式
        this.$refs.homePage.style.height = (clientHeight - 180) + 'px';
      }
    }
  }
</script>
<style lang="less">
  .layout-con {
    height: 100%;
    width: 100%;
  }

  .menu-item span {
    display: inline-block;
    overflow: hidden;
    width: 130px;
    text-overflow: ellipsis;
    white-space: nowrap;
    vertical-align: bottom;
    transition: width .2s ease .2s;
  }

  .menu-item i {
    transform: translateX(0px);
    transition: font-size .2s ease, transform .2s ease;
    vertical-align: middle;
    font-size: 16px;
  }

  .collapsed-menu span {
    width: 0px;
    transition: width .2s ease;
  }

  .collapsed-menu i {
    transform: translateX(5px);
    transition: font-size .2s ease .2s, transform .2s ease .2s;
    vertical-align: middle;
    font-size: 22px;
  }

  .logo-con {
    height: 64px;
    padding: 10px;

    img {
      height: 30px;
      width: auto;
      display: block;
      margin: 0 auto;
    }
  }

  .layout-logo-left {
    width: 150px;
    height: 30px;
    border-radius: 3px;
    margin-top: 17px;
    margin-bottom: 17px;

    .name {
      color: #fff;
      font-size: 18px;
      font-weight: bold;
      float: right;
      width: 80%;
      line-height: 30px;
      text-align: left;
    }
  }

  .user-info {
    float: right;
    padding: 6px 5px;
    line-height: 33px;
  }
</style>
