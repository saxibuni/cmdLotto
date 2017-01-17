$(function () {

	//退出登录
	$("#logOut").click(function(){
		$.afui.popup({
			title:locale.getString("MSG_LOGOUT"),
			message:"",
			cancelText:locale.getString('MSG_CANCEL'),
			cancelCallback:function(){
				$.afui.drawer.hide("#leftMenu");
			},
			doneText:locale.getString("MSG_OK"),
			doneCallback:function(){
				service.logout({},function(res){
					if (res.code > 0) return;
					var i=location.href.indexOf("#");
					location.href=location.href.substr(0,i);

					$.removeCookie("sid");
					$.removeCookie("token");
					$.removeCookie("currentLanguage");
					isLogin=false;
				});
			},
			cancelOnly:false
		})
	});

});