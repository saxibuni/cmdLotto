var ChangePassword=function() {
	
	var form=$("#page_changePassword")[0];

	this.init=function(){
		Page.prototype.init.call(this);

		$("#changePwd").click(changePwd);
	}

	this.load=function(){
		Page.prototype.load.call(this);

	 	refresh(function(){
			$("#app_head").html(locale.getString('CHANAGE_PWD_TITLE'));	
			$("#oldPwd").attr('placeholder',locale.getString('PASSWORD'));
			$("#newPwd").attr('placeholder',locale.getString('NEW_PASSWORD'));
			$("#reNewPwd").attr('placeholder',locale.getString('RE_ENTER_PWD'));
	 	});

	}

	this.unload=function(){
		Page.prototype.unload.call(this);
		form.reset();
	}


	var changePwd=function(){
		var oldPWd=$("#oldPwd").val(), newPwd=$("#newPwd").val(), reNewPwd=$("#reNewPwd").val();
		if (oldPWd.length == 0 || newPwd.length == 0 || reNewPwd.length == 0){
			mm.popup.showMessage(locale.getString("MSG_PWDNOTNULL"));
			return;
		 }
		 if (newPwd!=reNewPwd) {
		 	mm.popup.showMessage(locale.getString("MSG_NOTSAME"));
			return;
		 };

		var req={
			oldPwd:oldPWd,
			newPwd:reNewPwd
		};

		/*
		$.afui.popup({
			title:"Confirm Change Password?",
			message:"",
			cancelText:"NO",
			cancelCallback:function(){
			},
			doneText:"YES",
			doneCallback:function(){
				service.changePwd(req,function(res){
					if (res.code > 0) return;
					mm.popup.showMessage(locale.getString("MSG_PWDSUCCESS"));
					form.reset();

				});
			},
			cancelOnly:false
		});
		*/

		
		service.changePwd(req,function(res){
			if (res.code > 0) {	mm.popup.showMessage(locale.getString("MSG_RES_" + res.code)); return; }
			mm.popup.showMessage(locale.getString("MSG_PWDSUCCESS"));
			form.reset();
		});
		
	}



}