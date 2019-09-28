import Cookies from "js-cookie"
import {getLodop} from '@/utils/LodopFuncs'

export default {
  logout() {
    Cookies.remove("token")
    Cookies.remove("company_sn")
    Cookies.remove("company_name")
    Cookies.remove("company_id")
    Cookies.remove("user_type")
    Cookies.remove("uCode")
    Cookies.remove("uName")
    Cookies.remove("user_id")
    Cookies.remove("user_type")
    Cookies.remove("addDataList")
    Cookies.remove("isFlage")
    Cookies.remove("tedayNum")
    Cookies.remove("user_mobile")
    Cookies.remove("company_type")
    Cookies.remove("count")
  },
  isTokenUndefined(val){
    const authorization = Cookies.get("token");
    if (authorization) {
      val.uName = Cookies.get('uName')
      return true
    } else {
      return false
    }
  },

  // isTokenUndefined(){
  //   const authorization = Cookies.get("token");
  //   if (authorization) {
  //     return true
  //   } else {
  //     return false
  //   }
  // },
  //加法
  add(arg1,arg2){
    let r1,r2,m;
    try{r1=arg1.toString().split(".")[1].length}catch(e){r1=0}
    try{r2=arg2.toString().split(".")[1].length}catch(e){r2=0}
    m=Math.pow(10,Math.max(r1,r2))
    return (arg1*m+arg2*m)/m
  },
  //减法
  sub(arg1,arg2){
    var r1,r2,m,n;
    try{r1=arg1.toString().split(".")[1].length}catch(e){r1=0}
    try{r2=arg2.toString().split(".")[1].length}catch(e){r2=0}
    m=Math.pow(10,Math.max(r1,r2));
    n=(r1>=r2)?r1:r2;
    return ((arg1*m-arg2*m)/m).toFixed(n);
  },
  //删除数组元素
  removeByValue(arr, val) {
    for (let i = 0; i < arr.length; i++) {
      if (arr[i] == val) {
        arr.splice(i, 1);
        break;
      }
    }
  },
  //删除数组对象
  removeByObject(arr, val) {
    for (let i = 0; i < arr.length; i++) {
      if(arr[i].service_code === val.service_code){
        arr.splice(i, 1)
        return arr;
      }
    }
  },
  //checkbox回显
  setCheckedTableRow(rows, codes) {
    for (let i = 0; i < codes.length; i++) {
      for(let j = 0; j < rows.length; j++) {
        if (rows[j].code === codes[i]) {
          rows[j]._checked = true
          break
        }
      }
    }
  },
  //table单选回显
  setHighlightTableRow(rows, code) {
    for (let j = 0; j < rows.length; j++) {
      if (rows[j].code === code) {
        rows[j]._highlight = true
        break
      }
    }
  },
  businessCheckErr(that, title, content){
    let config = {
      title: title,
      content: content
    }
    that.$Modal.warning(config)
    return
  },
  infoModal(that, title, content){
    let config = {
      title: title,
      content: content
    }
    that.$Modal.info(config)
  },
  errNotice(that, err, title) {
    that.$Notice.error({
      title: title,
      desc: err
    });
  },
  infoNotice(that, info, title) {
    that.$Notice.info({
      title: title,
      desc: info
    });
  },
  findCodeAndName(code, selectArr) {
    for(let i = 0, val; val = selectArr[i++]; ){
      if(val.code === code) {
        return val
      }
    }
    return undefined
  },
  checkNull(value) {
    if(value != null && value !== undefined) {
      return value.toString()
    } else {
      return ''
    }
  },
  formatDate(date, fmt) {
    if (/(y+)/.test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    let o = {
      'M+': date.getMonth() + 1,
      'd+': date.getDate(),
      'h+': date.getHours(),
      'm+': date.getMinutes(),
      's+': date.getSeconds()
    };
    for (let k in o) {
      if (new RegExp(`(${k})`).test(fmt)) {
        let str = o[k] + '';
        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str))
      }
    }
    return fmt
  },
  isNullOrUndefined(data){
    if(data === null || data === undefined || data === '')
      return false;
    else
      return  true
  },
  isNullOrUndefinedOr0(data){
    if(data === null || data === undefined || data === '' || data === 0)
      return false;
    else
      return  true
  },
  generationNumber(td) {
    let company_id = Cookies.get("company_id")
    let code = ""
    var myDate = new Date();
    if (company_id.toString().length == 1) {
      company_id = "00" + parseInt(company_id)
    } else if (company_id.toString().length == 2) {
      company_id = "0" + parseInt(company_id)
    }

    let year =(myDate.getFullYear() + '')
    let month =''
    if((myDate.getMonth() + 1)<10){
      month = "0"+(myDate.getMonth() + 1)
    }else{
      month = ""+(myDate.getMonth() + 1)
    }
    let day =''
    if((myDate.getDate())<10){
      day = "0"+(myDate.getDate() )
    }else{
      day = ""+(myDate.getDate() )
    }
    if ((td +1 ).toString().length == 1) {
      td = "0000" + (parseInt(td) + 1)
    } else if ((td +1 ).toString().length == 2) {
      td = "000" + (parseInt(td) + 1)
    } else if ((td +1 ).toString().length == 3) {
      td = "00" + (parseInt(td) + 1)
    } else if ((td +1 ).toString().length == 4){
      td = "0" + (parseInt(td) + 1)
    }else{
      td = parseInt(td) + 1
    }
    code = "2*Br" +  year + month + day + td
    return code
  },
  //打印条码
  clickPrint(rowDataList) {
    let LODOP = getLodop();
    if (rowDataList.length >= 1) {
      LODOP.PRINT_INITA(0, 0, "70.0mm", "60.0mm", "条码打印模板");
      let count = 0
      for (var k = 0; k < rowDataList.length; k++) {
        var rowHeight = 20;
        var nowheight = 32 + count;
        var left = 12;
        var lleft = 70;
        LODOP.ADD_PRINT_IMAGE(73 + count, 17, 80, 80, '<img src= "' + rowDataList[k].img + '" style="width: 60px;height: 60px;"/> ');
        LODOP.SET_PRINT_STYLEA(0, "DataCharset", "UTF-8");
        LODOP.ADD_PRINT_TEXT(6 + count, 10, 238, 25, "浙江联翔智能家居股份有限公司");
        LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
        LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
        nowheight = 77 + count;
        LODOP.ADD_PRINT_TEXT(nowheight, 97, 55, 20, "批号：");
        LODOP.ADD_PRINT_TEXT(nowheight, 152, 100, 20, rowDataList[k].maker_date);
        nowheight += rowHeight;
        LODOP.ADD_PRINT_TEXT(nowheight, 97, 55, 20, "门幅：");
        LODOP.ADD_PRINT_TEXT(nowheight, 152, 100, 20, rowDataList[k].goods_width);
        nowheight += rowHeight;
        LODOP.ADD_PRINT_TEXT(nowheight, 97, 55, 20, "布纹：");
        LODOP.ADD_PRINT_TEXT(nowheight, 151, 100, 20, rowDataList[k].cInvBw);
        nowheight = 32;
        LODOP.ADD_PRINT_TEXT(nowheight, left, 48, 20, "名称：");
        LODOP.ADD_PRINT_TEXT(nowheight, 54, 104, 20, rowDataList[k].goods_name);
        LODOP.ADD_PRINT_TEXT(nowheight, 150, 50, 20, "颜色：");
        LODOP.ADD_PRINT_TEXT(nowheight, 194, 90, 20, rowDataList[k].goods_color);
        nowheight += rowHeight;
        LODOP.ADD_PRINT_TEXT(nowheight, left, 79, 20, "规格型号：");
        LODOP.ADD_PRINT_TEXT(nowheight, lleft, 90, 20, rowDataList[k].goods_spec);
        LODOP.ADD_PRINT_TEXT(nowheight, 150, 50, 20, "米数：");
        LODOP.ADD_PRINT_TEXT(nowheight, 194, 90, 20, rowDataList[k].song_qty);
        nowheight = 140;
        LODOP.ADD_PRINT_TEXT(nowheight, left, 79, 20, "采购订单：");
        LODOP.ADD_PRINT_TEXT(nowheight, lleft, 181, 20, rowDataList[k].wuliu_sn);
        nowheight += rowHeight;
        LODOP.ADD_PRINT_TEXT(nowheight, left, 62, 20, "条码：");
        LODOP.ADD_PRINT_TEXT(nowheight, lleft, 183, 20, rowDataList[k].rec_sn);
        nowheight += rowHeight;
        LODOP.ADD_PRINT_TEXT(nowheight, left, 69, 20, "进货时间：")
        LODOP.ADD_PRINT_TEXT(nowheight, lleft, 183, 20, rowDataList[k].order_date);
        nowheight += rowHeight;
        LODOP.ADD_PRINT_TEXT(nowheight, left, 69, 20, "送货人：")
        LODOP.ADD_PRINT_TEXT(nowheight, lleft, 183, 20, rowDataList[k].song_person);
        nowheight += rowHeight;
        LODOP.PRINT();
        // LODOP.PREVIEW();
      }
    }
  },
  //打印送货单
  fnPrint(rowDataList) {
    // console.log(JSON.stringify(rowDataList))
    for (var i = 0; i < rowDataList.length; i++) {
      var whichOne = 'jx';  //模板
      let LODOP = getLodop();
      LODOP.PRINT_INITA(110, 11, 700, 463, "送货单打印模板");
      if (whichOne == "jx") {
        // LODOP.SET_PRINT_PAGESIZE(0, '210mm', '140mm', "A4");
        LODOP.SET_PRINT_MODE("PRINT_PAGE_PERCENT", "Width:100%;Height:100%");
      }
      var left = 20;
      //---标准单据标题--------------------------------------------------------------------
      LODOP.ADD_PRINT_TEXT("3.39mm", left + 36.09 + "mm", "77.55mm", "9.6mm", "联翔家居供应商送货单");
      LODOP.SET_PRINT_STYLEA(0, "ItemType", 0);
      LODOP.SET_PRINT_STYLEA(0, "FontSize", 14);
      LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
      LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
      LODOP.ADD_PRINT_IMAGE(-10, left + 2  + "mm","37.52mm","28.79mm", '<img src= "' + rowDataList[i].IMG + '" style="width: 110px;height: 110px;"/> ');
      var size = rowDataList.length;//19;
      var table_hegth = (size + 1) * 25;
      var rowBeginTop = 31.2;
      var rowHeight = 6.12;
      //上面的信息
      if (whichOne == "jx") {
        //表头
        var now = new Date();
        var nowdate = now.getFullYear() + "-" + ((now.getMonth() + 1) < 10 ? "0" : "") + (now.getMonth() + 1) + "-" + (now.getDate() < 10 ? "0" : "") + now.getDate();
        LODOP.ADD_PRINT_TEXT("26.22mm", left + 1.69 + "mm", "20.13mm", "5.37mm", "送货单号：");
        LODOP.ADD_PRINT_TEXT("26.22mm", left + 17.33 + "mm", "45.56mm", "5.37mm", rowDataList[i].PuCode);
        LODOP.ADD_PRINT_TEXT("26.22mm", left + 73.1 + "mm", "20.13mm", "5.37mm", "单据日期：");
        LODOP.ADD_PRINT_TEXT("26.22mm", left + 88.4 + "mm", "20.13mm", "5.37mm", rowDataList[i].dDate);
        LODOP.ADD_PRINT_TEXT("26.22mm", left + 109.3 + "mm", "20.13mm", "5.37mm", "打印日期：");
        LODOP.ADD_PRINT_TEXT("26.22mm", left + 129.41 + "mm", "25mm", "5.37mm", nowdate);
      }
      //标题等
      LODOP.ADD_PRINT_TEXT("33.02mm", left + 1 + "mm", "9.55mm", "5.37mm", "行号");
      LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
      LODOP.ADD_PRINT_TEXT("33.02mm", left + 5.48 + "mm", "37.33mm", "5.37mm", "采购单编号");
      LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
      LODOP.ADD_PRINT_TEXT("33.02mm", left + 32.79 + "mm", "35.48mm", "5.37mm", "存货编码");
      LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
      LODOP.ADD_PRINT_TEXT("33.02mm", left + 60.71 + "mm", "34.69mm", "5.37mm", "名称");
      LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
      LODOP.ADD_PRINT_TEXT("33.02mm", left + 88.71 + "mm", "34.69mm", "5.37mm", "型号");
      LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
      LODOP.ADD_PRINT_TEXT("33.02mm", left + 118 + "mm", "11.93mm", "5.37mm", "单位");
      LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
      LODOP.ADD_PRINT_TEXT("33.02mm", left + 129.49 + "mm", "26.48mm", "5.37mm", "此次送货数量");
      LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
      LODOP.ADD_PRINT_LINE(rowBeginTop + "mm", left + 0.2 + "mm", rowBeginTop + "mm", left + 154.1 + "mm", 0, 1);
      rowBeginTop += rowHeight;
      LODOP.ADD_PRINT_LINE(rowBeginTop + "mm", left + 0.2 + "mm", (rowBeginTop - rowHeight) + "mm", left + 0.2 + "mm", 0, 1);
      LODOP.ADD_PRINT_LINE(rowBeginTop + "mm", left + 9 + "mm", (rowBeginTop - rowHeight) + "mm", left + 9 + "mm", 0, 1);
      LODOP.ADD_PRINT_LINE(rowBeginTop + "mm", left + 35.79 + "mm", (rowBeginTop - rowHeight) + "mm", left + 35.79 + "mm", 0, 1);
      LODOP.ADD_PRINT_LINE(rowBeginTop + "mm", left + 65.74 + "mm", (rowBeginTop - rowHeight) + "mm", left + 65.74 + "mm", 0, 1);
      LODOP.ADD_PRINT_LINE(rowBeginTop + "mm", left + 90.71 + "mm", (rowBeginTop - rowHeight) + "mm", left + 90.71 + "mm", 0, 1);
      LODOP.ADD_PRINT_LINE(rowBeginTop + "mm", left + 117 + "mm", (rowBeginTop - rowHeight) + "mm", left + 117 + "mm", 0, 1);
      LODOP.ADD_PRINT_LINE(rowBeginTop + "mm", left + 127.8 + "mm", (rowBeginTop - rowHeight) + "mm", left + 127.8 + "mm", 0, 1);
      LODOP.ADD_PRINT_LINE(rowBeginTop + "mm", left + 154.2 + "mm", (rowBeginTop - rowHeight) + "mm", left + 154.2 + "mm", 0, 1);
      LODOP.ADD_PRINT_LINE(rowBeginTop + "mm", left + 0.2 + "mm", rowBeginTop + "mm", left + 154.1 + "mm", 0, 1);
      rowBeginTop += rowHeight;
      //动态列表信息
      var trheight = 37.32;//用于每个竖线距离上面的固定长度
      var thHeight = 39;//用于每行商品距离上面的固定长度
      var newHeight = 0;//用于动态增加一行的长度
      LODOP.ADD_PRINT_TEXT(thHeight + newHeight + "mm", left + 1 + "mm", "9.55mm", "5.37mm", 1);
      LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
      LODOP.ADD_PRINT_TEXT(thHeight + newHeight + "mm", left + 3.48 + "mm", "37.07mm", "5.37mm", rowDataList[i].data[0].OrderSn);
      LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
      LODOP.ADD_PRINT_TEXT(thHeight + newHeight + "mm", left + 32.48 + "mm", "37.07mm", "5.37mm", rowDataList[i].data[0].cInvCode);
      LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
      LODOP.ADD_PRINT_TEXT(thHeight + newHeight + "mm", left + 60.79 + "mm", "35.48mm", "5.37mm", rowDataList[i].data[0].cInvName);
      LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
      LODOP.ADD_PRINT_TEXT(thHeight + newHeight + "mm", left + 88.71 + "mm", "34.69mm", "5.37mm", rowDataList[i].data[0].cInvStd);
      LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
      LODOP.ADD_PRINT_TEXT(thHeight + newHeight + "mm", left + 117.37 + "mm", "11.93mm", "5.37mm", rowDataList[i].data[0].cComUnitName);
      LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
      LODOP.ADD_PRINT_TEXT(thHeight + newHeight + "mm", left + 129.49 + "mm", "26.48mm", "5.37mm", rowDataList[i].data[0].iQuantity);
      LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
      LODOP.ADD_PRINT_LINE(trheight + newHeight + "mm", left + 0.2 + "mm", trheight + newHeight + rowHeight + "mm", left + 0.2 + "mm", 0, 1);
      LODOP.ADD_PRINT_LINE(trheight + newHeight + "mm", left + 9 + "mm", trheight + newHeight + rowHeight + "mm", left + 9 + "mm", 0, 1);
      LODOP.ADD_PRINT_LINE(trheight + newHeight + "mm", left + 35.7 + "mm", trheight + newHeight + rowHeight + "mm", left + 35.7 + "mm", 0, 1);
      LODOP.ADD_PRINT_LINE(trheight + newHeight + "mm", left + 65.79 + "mm", trheight + newHeight + rowHeight + "mm", left + 65.79 + "mm", 0, 1);
      LODOP.ADD_PRINT_LINE(trheight + newHeight + "mm", left + 90.7 + "mm", trheight + newHeight + rowHeight + "mm", left + 90.7 + "mm", 0, 1);
      LODOP.ADD_PRINT_LINE(trheight + newHeight + "mm", left + 117 + "mm", trheight + newHeight + rowHeight + "mm", left + 117 + "mm", 0, 1);
      LODOP.ADD_PRINT_LINE(trheight + newHeight + "mm", left + 127.8 + "mm", trheight + newHeight + rowHeight + "mm", left + 127.8 + "mm", 0, 1);
      LODOP.ADD_PRINT_LINE(trheight + newHeight + "mm", left + 154.2 + "mm", trheight + newHeight + rowHeight + "mm", left + 154.2 + "mm", 0, 1);
      LODOP.ADD_PRINT_LINE(rowBeginTop + "mm", left + 0.2 + "mm", rowBeginTop + "mm", left + 154.1 + "mm", 0, 1);
      rowBeginTop += rowHeight;
      newHeight += rowHeight;
      table_hegth = trheight + newHeight + rowHeight;
      //---------------合计----------------------------------------------------------------------------
      LODOP.ADD_PRINT_TEXT(thHeight + newHeight + "mm", left + 1.69 + "mm", "127.8mm", "5.37mm", "合计");
      LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
      LODOP.ADD_PRINT_TEXT(thHeight + newHeight + "mm", left + 129.49 + "mm", "26.48mm", "5.37mm", parseFloat(rowDataList[i].data[0].iQuantity).toFixed(2));
      LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
      LODOP.ADD_PRINT_LINE(rowBeginTop + "mm", left + 0.2 + "mm", rowBeginTop + "mm", left + 154.1 + "mm", 0, 1);//每条数据后加一横线

      LODOP.ADD_PRINT_LINE(trheight + newHeight + "mm", left + 0.2 + "mm", trheight + newHeight + rowHeight + "mm", left + 0.2 + "mm", 0, 1);//最左竖线
      LODOP.ADD_PRINT_LINE(trheight + newHeight + "mm", left + 127.8 + "mm", trheight + newHeight + rowHeight + "mm", left + 127.8 + "mm", 0, 1);//单价后竖线
      LODOP.ADD_PRINT_LINE(trheight + newHeight + "mm", left + 154.2 + "mm", trheight + newHeight + rowHeight + "mm", left + 154.2 + "mm", 0, 1);//数量后竖线
      //------------------------------------------------------------------------------------------------------------
      var table_hegth_end = thHeight + newHeight + 10;
      // 最下显示订单信息
      LODOP.ADD_PRINT_TEXT(table_hegth_end + "mm", left + 12.54 + "mm", "27.81mm", "5.37mm", "送货人：");
      LODOP.ADD_PRINT_TEXT(table_hegth_end + "mm", left + 30 + "mm", "27.81mm", "5.37mm", rowDataList[i].shPerson);
      LODOP.ADD_PRINT_TEXT(table_hegth_end + "mm", left + 60 + "mm", "19.61mm", "5.37mm", "送货日期：");
      LODOP.ADD_PRINT_TEXT(table_hegth_end + "mm", left + 79.96 + "mm", "27.81mm", "5.37mm", rowDataList[i].shDate);
      LODOP.NewPage();
      LODOP.PRINT();
      // LODOP.PREVIEW();
    }

  }



}
function padLeftZero(str) {
  return ('00' + str).substr(str.length)
}



