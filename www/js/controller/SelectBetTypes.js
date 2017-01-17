var SelectBetTypes=function () {

	var ui=$("#selectBetTypes")[0];

	this.init=function(){
		Page.prototype.init.call(this);
	}

	this.load=function(){

	 	refresh(function(){
			$("#app_head").html(locale.getString('SELECET_BET_TYPES_TITLE'));
			getBetStatus();
	 	});
	}

	this.unload=function(){
		Page.prototype.unload.call(this);
	}

	var getBetStatus=function () {
		service.queryBetStatus({}, function(res) {
			if (res.code > 0) {	mm.popup.showMessage(locale.getString("MSG_RES_" + res.code)); return; }
			if (!res.open) {
				$(ui).find('li:eq(0)').css('border-radius','0');
			}else{
				$(ui).find('li:gt(0)').show();
			}

		});
	}

}