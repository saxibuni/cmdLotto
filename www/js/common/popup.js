var mm = mm || {};
mm.popup = {
	showMessage: function(message, title, onDone){
		if($(".afPopup").size() > 0) return ;
	
		//title = title || locale.getString("MSG_PROMPT");
		$.afui.popup({
				title: " ",
				message: message,
				cancelText: locale.getString("MSG_OK"),
				cancelOnly: true,
				cancelCallback: function(){
					if (message=="Login Required." || message=="ต้องเข้าสู่ระบบ") {
						var i=location.href.indexOf("#");
						location.href=location.href.substr(0,i);
					};
				}
			});	
		//this.resize();
	},
	
	showConfirm: function(message, title, onDone, onCancel){
		//title = title || locale.getString("MSG_PROMPT");
		var self = this;
		var fn = function(){
			$.afui.popup({
				title: " ",
				message: message,
				cancelText: locale.getString("MSG_CANCEL"),
				doneText: locale.getString("MSG_OK"),
				doneCallback: onDone,
				cancelCallback : onCancel || function(){},
				cancelOnly: false
			});
			//self.resize();
		};
		
		setTimeout(fn, 50);
	},
	
	resize: function(){
		if(browser.iphone && browser.safari && !browser.qqbrowser){
			var h = $(window).height();
			var _h = $("#mask").height();
			$("#mask").height(h).css("top", (_h - h) + "px");
		}
	}
};