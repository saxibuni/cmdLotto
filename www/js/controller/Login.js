var Login=function(){
	
	//ui加载完毕后才会实例化该对象  所以以下dom对象会找到
	var txtUser=$("#txtUserName"),txtPwd=$("#txtPWD"),form=$('#pagelogin form')[0],user=null;
	var lan="";

	this.init=function(){
		Page.prototype.init.call(this);
		$("#btnLoginEn,#btnLoginTha").click(login);
		getUser();
	}

	this.load=function(){
		Page.prototype.load.call(this);
	}

	this.unload=function(){
		Page.prototype.unload.call(this);
		form.reset();
	}

	//登录
	var login=function(){
		var id=$(this).attr("id");
		var lan="";
		if(id=="btnLoginEn") lan="english";
		if(id=="btnLoginTha") lan="thailand";

		locale.setLocale(lan,function(){
			var req={
				acctId: txtUser.val().trim(),
				passwd:txtPwd.val()
			};
			if(req.acctId.length ==0 || req.passwd.length==0){
				mm.popup.showMessage(locale.getString("MSG_CANNOTNULL"));
				return;
			}

			service.login(req,function(res){
				if (res.code > 0) { mm.popup.showMessage(locale.getString("MSG_RES_" + res.code)); return; }
				//记住密码或删除密码
				($("#remember")[0].checked == true) ? mm.Storage.setItem("user", req) : mm.Storage.setItem("user",{acctId:req.acctId,passwd:""});
				
				getAccountInfo();
				$.afui.loadContent("#selectBetTypes");

				$.cookie("currentLanguage", lan);
				isLogin=true;
			});
		});
	
	}


	
	var getUser=function(){
		user=mm.Storage.getItem('user',true);
		if (user!=null) {
			txtUser.val(user.acctId);
			txtPwd.val(user.passwd);
			if (user.passwd) $("#remember")[0].checked=true;
		}
	}

}
