var domUtils = UE.dom.domUtils;
var ServerUrl = '/server/ueditor/';
var options = {
    //图片上传配置区
    serverUrl:ServerUrl+"controller.php"
    ,imageUrl:ServerUrl+"imageUp.php"             //图片上传提交地址
    ,imagePath:ServerUrl                    //图片修正地址，引用了fixedImagePath,如有特殊需求，可自行配置

    //涂鸦图片配置区
    ,scrawlUrl:ServerUrl+"scrawlUp.php"           //涂鸦上传地址
    ,scrawlPath:ServerUrl+""                            //图片修正地址，同imagePath

    //附件上传配置区
    ,fileUrl:ServerUrl+"fileUp.php"               //附件上传提交地址
    ,filePath:ServerUrl                   //附件修正地址，同imagePath

    ,catchRemoteImageEnable: false
    // ,catcherUrl:ServerUrl +"getRemoteImage.php"   //处理远程图片抓取的地址
    // ,catcherPath:ServerUrl                  //图片修正地址，同imagePath

    ,imageManagerUrl:ServerUrl + "imageManager.php"       //图片在线管理的处理地址
    ,imageManagerPath:ServerUrl                                    //图片修正地址，同imagePath

    ,snapscreenHost: location.hostname                                 //屏幕截图的server端文件所在的网站地址或者ip，请不要加http://
    ,snapscreenServerUrl: ServerUrl +"imageUp.php" //屏幕截图的server端保存程序，UEditor的范例代码为“ServerUrl +"server/upload/snapImgUp.php"”
    ,snapscreenPath: ServerUrl
    ,snapscreenServerPort: location.port                                   //屏幕截图的server端端口

    ,wordImageUrl:ServerUrl + "imageUp.php"             //word转存提交地址
    ,wordImagePath:ServerUrl                       //

    ,getMovieUrl:ServerUrl+"getMovie.php"                   //视频数据获取地址
    ,videoUrl:ServerUrl+"fileUp.php"               //附件上传提交地址
    ,videoPath:ServerUrl,                   //附件修正地址，同imagePath


    lang:/^zh/.test(navigator.language || navigator.browserLanguage || navigator.userLanguage) ? 'zh-cn' : 'en',
    langPath:UEDITOR_HOME_URL + "lang/",

    disabledTableInTable: false,

    webAppKey:"9HrmGf2ul4mlyK8ktO2Ziayd",
    initialFrameWidth:860,
    initialFrameHeight:400,
    focus:true,
    shortcutMenu:["fontfamily", "fontsize", "bold", "italic", "underline", "forecolor", "backcolor", "insertorderedlist", "insertunorderedlist"]
};

function setLanguage(obj) {
    var value = obj.value,
        opt = {
            lang:value
        };
    UE.utils.extend(opt, options, true);

    UE.delEditor("editor");

    //清空语言
    if (!UE._bak_I18N) {
        UE._bak_I18N = UE.I18N;
    }
    UE.I18N = {};
    UE.I18N[opt.lang] = UE._bak_I18N[ opt.lang ];

    UE.getEditor('editor', opt);
}
function isFocus(e){
    alert(UE.getEditor('editor').isFocus());
    UE.dom.domUtils.preventDefault(e)
}
function setblur(e){
    UE.getEditor('editor').blur();
    UE.dom.domUtils.preventDefault(e)
}
function insertHtml() {
    var value = prompt('插入html代码', '');
    UE.getEditor('editor').execCommand('insertHtml', value)
}
function createEditor() {
    enableBtn();
    UE.getEditor('editor', {
        initialFrameWidth:"100%"
    })
}
function getAllHtml() {
    alert(UE.getEditor('editor').getAllHtml())
}
function getContent() {
    var arr = [];
    arr.push("使用editor.getContent()方法可以获得编辑器的内容");
    arr.push("内容为：");
    arr.push(UE.getEditor('editor').getContent());
    alert(arr.join("\n"));
}
function getPlainTxt() {
    var arr = [];
    arr.push("使用editor.getPlainTxt()方法可以获得编辑器的带格式的纯文本内容");
    arr.push("内容为：");
    arr.push(UE.getEditor('editor').getPlainTxt());
    alert(arr.join('\n'))
}
function setContent(isAppendTo) {
    var arr = [];
    arr.push("使用editor.setContent('欢迎使用ueditor')方法可以设置编辑器的内容");
    UE.getEditor('editor').setContent('欢迎使用ueditor', isAppendTo);
    alert(arr.join("\n"));
}
function setDisabled() {
    UE.getEditor('editor').setDisabled('fullscreen');
    disableBtn("enable");
}
function setEnabled() {
    UE.getEditor('editor').setEnabled();
    enableBtn();
}
function getText() {
    //当你点击按钮时编辑区域已经失去了焦点，如果直接用getText将不会得到内容，所以要在选回来，然后取得内容
    var range = UE.getEditor('editor').selection.getRange();
    range.select();
    var txt = UE.getEditor('editor').selection.getText();
    alert(txt)
}
function getContentTxt() {
    var arr = [];
    arr.push("使用editor.getContentTxt()方法可以获得编辑器的纯文本内容");
    arr.push("编辑器的纯文本内容为：");
    arr.push(UE.getEditor('editor').getContentTxt());
    alert(arr.join("\n"));
}
function hasContent() {
    var arr = [];
    arr.push("使用editor.hasContents()方法判断编辑器里是否有内容");
    arr.push("判断结果为：");
    arr.push(UE.getEditor('editor').hasContents());
    alert(arr.join("\n"));
}
function setFocus() {
    UE.getEditor('editor').focus();
}
function deleteEditor() {
    disableBtn();
    UE.getEditor('editor').destroy();
}
function disableBtn(str) {
    var div = document.getElementById('btns');
    var btns = domUtils.getElementsByTagName(div, "button");
    for (var i = 0, btn; btn = btns[i++];) {
        if (btn.id == str) {
            domUtils.removeAttributes(btn, ["disabled"]);
        } else {
            btn.setAttribute("disabled", "true");
        }
    }
}

function enableBtn() {
    var div = document.getElementById('btns');
    var btns = domUtils.getElementsByTagName(div, "button");
    for (var i = 0, btn; btn = btns[i++];) {
        domUtils.removeAttributes(btn, ["disabled"]);
    }
}

function getLocalData () {
    alert(UE.getEditor('editor').execCommand( "getlocaldata" ));
}
function clearLocalData () {
    UE.getEditor('editor').execCommand( "clearlocaldata" );
    alert("已清空草稿箱")
}

window.onkeydown = function (e){
    if (!ue.isFocus()) {
        var keyCode = e.keyCode || e.which;
        if (keyCode == 8) {
            e.preventDefault();
        }
    }
};
