var	locale = new mm.Locale();
var isLogin=false;


//跳转到当前页面只需要 执行原页面的callback
//F5刷新  token session  languageq全无 徐重新获取
function refresh(callback){
	if (isLogin) {   //跳转		
		callback();
	}else{			//刷新

		//原页面中存有用在ssession
		if ($.cookie("sid")) {
			var currentLanguage=$.cookie("currentLanguage");
			locale.setLocale(currentLanguage,function(){				
				getAccountInfo();
				callback();
				isLogin=true;
			});

		}else{
			var i=location.href.indexOf("#");
			location.href=location.href.substr(0,i);
		}
	}
}

	//获取账户信息
var getAccountInfo=function(){
	service.queryAccount({},function(res){
		if (res.code > 0) return 0;
		var accctInfo=res.acctInfo;
		$("#uId").text(accctInfo.acctId);
		$("#nav_date").text(res.drawDate);
		$("#nav_rmLimit").text(accctInfo.currId + ' ' + mm.addDotToNumber(accctInfo.rmLimit));
		$("#nav_rmLimit_num").text(accctInfo.rmLimit); 
		$("#nav_crLimit").text(mm.addDotToNumber(accctInfo.crLimit));
		$("#nav_betAmt").text(mm.addDotToNumber(accctInfo.betAmt));
		$("#nav_balAmt").html(mm.getMoneySpans(mm.addDotToNumber(accctInfo.balAmt)));
		$("#nav_batAmt_num").text(accctInfo.betAmt);	
	});
}


var systemSetting = function(){
	//var system = mm.config["system"];
	var system=mm.getParam('system');

	switch(system){
		case "web":
			webSetting();
		break;
		case "ios":
			iosSetting();
		break;
		case "android":
			andriodSetting();
		break;
		default:
			webSetting();
		break;
	}


	function webSetting(){
		var printElement=$(".list").find("[key=PIRNT_SETTING]").parent();
		printElement.remove();
	}

	function iosSetting(){
		var fixCss="css/iosFixed.css";
		loadCss(fixCss);

		/*
		var cordovaJs="../publish/ios/cordova.js";
		
		loadJs('ios',cordovaJs,function(){
			eval($("#ios")[0].innerHTML);
		});
		*/

		StatusBar.overlaysWebView(true);
		StatusBar.styleLightContent();
	}

	function andriodSetting(){
		/*
		var cordovaJs="../publish/android/cordova.js";

		loadJs('android',cordovaJs,function(){
			eval($("#android")[0].innerHTML);

		});
		*/
	}

	function loadCss(url){
		var link = document.createElement("link"); 
		link.type = "text/css"; 
		link.rel = "stylesheet"; 
		link.href = url; 
		document.getElementsByTagName("head")[0].appendChild(link);
	}

	function loadJs(sid,jsurl,callback){
        var nodeHead = document.getElementsByTagName('head')[0];
        var nodeScript = null;
        if(document.getElementById(sid) == null){
            nodeScript = document.createElement('script');
            nodeScript.setAttribute('type', 'text/javascript');
            nodeScript.setAttribute('src', jsurl);
            nodeScript.setAttribute('id',sid);
            if (callback != null) {
                nodeScript.onload = nodeScript.onreadystatechange = function(){
                    if (nodeScript.ready) {
                        return false;
                    }
                   	if (!nodeScript.readyState || nodeScript.readyState == "loaded" || nodeScript.readyState == 'complete') {
                        nodeScript.ready = true;
                        callback();
                    }
                };
            }
            nodeHead.appendChild(nodeScript);
        } else {
            if(callback != null){
                callback();
            }
        }
    }


};

