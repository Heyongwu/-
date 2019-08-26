const MyDialog = [];

MyDialog.valiable = function (that, value, msg) {
  if (value || value === 0) {
    return true
  } else {
    that.$notify({
      message: '请输入' + msg,
      type: 'warning'
    })
    return false
  }
}

MyDialog.showSuccess = function (that, msg) {
  that.$message({
    message: msg,
    type: 'success'
  });
}

MyDialog.showError = function (that, msg, tip) {
  if (msg && msg !== "" && msg !== undefined && typeof msg === 'string') {
    that.$message.error(msg);
  } else if (tip) {
    that.$message.error(msg);
  }
}

export default MyDialog
