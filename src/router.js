import Vue from "vue";
import Router from "vue-router";
import Login from "@/views/login";
import MobileLogin from "@/views/mobiles/login";
import Home from "@/views/home";
// import Error404 from "@/views/error404";


import Base from "@/views/base/base";
import InformationMaintenance from "@/views/base/base-information-maintenance";
import MachinePlatform from "@/views/base/base-machine-platform";
import Staff from "@/views/base/base-staff";
import Authorization from "@/views/base/base-authorization";
import Mechanism from "@/views/base/base-mechanism";
import Role from "@/views/base/base-role";



import Order from "@/views/order-confirm/order";
import OrderConfirm from "@/views/order-confirm/order-confirm";
import SupplierOrderConfirm from "@/views/order-confirm/supplier-order-confirm";

import Production from "@/views/production/production";
import Operate from "@/views/production/production-operate";

import Warehouse from "@/views/warehouse/warehouse";
import Delivery from "@/views/warehouse/warehouse-delivery";

import DeliveryLarge from "@/views/delivery/delivery";
import Management from "@/views/delivery/delivery-management";

Vue.use(Router);

export default new Router({
  // mode: 'history',
  // base: __dirname,
  routes: [
 {
    path: "/",
    name: "login",
    component: Login
  }, {
    path: "/mobile",
    name: "mobile",
    component: MobileLogin
  },
    {
      path: "*",
      component: resolve => require(["./views/error404.vue"], resolve)
    },
    {
      path: "/home",
      name: "home",
      component: Home
    },

    {
      path: "/home/base/",
      name: "base",
      component: Base,
      children: [ {
        path: "informationMaintenance",
        component: InformationMaintenance
      },{
        path: "machinePlatform",
        component: MachinePlatform
      },{
        path: "staff",
        component: Staff
      },{
        path: "mechanism",
        component: Mechanism
      },{
        path: "authorization",
        component: Authorization
      },{
        path: "role",
        component: Role
      }]
    },
    {
      path: "/home/order/",
      name: "order",
      component: Order,
      children: [ {
        path: "orderConfirm",
        component: OrderConfirm
      } ,{
        path: "supplierOrderConfirm",
        component: SupplierOrderConfirm
      }]
    },
    {
      path: "/home/production/",
      name: "production",
      component: Production,
      children: [ {
        path: "operate",
        component: Operate
      }]
    },
    {
      path: "/home/warehouse/",
      name: "warehouse",
      component: Warehouse,
      children: [ {
        path: "delivery",
        component: Delivery
      }]
    },
    {
      path: "/home/delivery/",
      name: "delivery",
      component: DeliveryLarge,
      children: [ {
        path: "management",
        component: Management
      }]
    }
  ]
});
