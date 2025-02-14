export const constant = {
  sessionFlag: 0,
  flag: true,
  pageSize: 150,
  distributorOkCodePwd: 2,
  distributorOkCode: 1,
  distributorErrkCode1: 0,
  distributorErrkCode2: -1,
  distributorErrTitle: '服务器错误',
  distributorErrTitle1: '服务器错误',
  distributorErrTitle2: '请求失败请重试或联系管理员',
  toolbarOptions: [
    ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
    ['blockquote', 'code-block'],
    [{'header': 1}, {'header': 2}],               // custom button values
    [{'list': 'ordered'}, {'list': 'bullet'}],
    [{'script': 'sub'}, {'script': 'super'}],      // superscript/subscript
    [{'indent': '-1'}, {'indent': '+1'}],          // outdent/indent
    // [{'direction': 'rtl'}],                         // text direction

    // [{'size': ['small', false, 'large', 'huge']}],  // custom dropdown
    // [{'header': [1, 2, 3, 4, 5, 6, false]}],

    [{'color': []}, {'background': []}],          // dropdown with defaults from theme
    // [{'font': []}],
    [{'align': []}],
    ['link', 'image', 'video'],
    ['clean']                                         // remove formatting button
  ],
  appendList:[],
  successfulPreservation:[],
}
