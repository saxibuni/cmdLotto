var BetTop=function () {
	 
	var form=$("#page_betTop")[0];
	var keyCodeArray=[48,49,50,51,52,53,54,55,56,57,8,96,97,98,99,100,101,102,103,104,105,110];
	var keyCodeArray2=[48,49,50,51,52,53,54,55,56,57,190,8,96,97,98,99,100,101,102,103,104,105,110];	 

	 this.init=function(){
	 	Page.prototype.init.call(this);

	 	$("#betTop_bet").click(bet);
		$("#betTop_reset").click(reset);

	 	//下注号码验证设置  只能输入位数字
		$("#page_betTop .num").keydown(function(e){
			if ($.inArray(e.keyCode,keyCodeArray)==-1) return false;
		}).blur(function(){
			var value=$(this).val();
			if (value=="") return;
			if (!$.isNumeric(value)&&value!="") {
				mm.popup.showMessage(locale.getString("MSG_VALID_NUMBER"));
				$(this).focus();
			}
		});

		//金额验证  只能输入数字和小数点
		$("#page_betTop .money").keydown(function(e) {
			if ($.inArray(e.keyCode,keyCodeArray2)==-1) return false;
		}).blur(function(e) {
			var value=$(this).val();
			if (value=="") return;
			if (!$.isNumeric(value)&&value!="") {
				mm.popup.showMessage(locale.getString('MSG_VALID_AMOUNT'));
				$(this).focus();
			}else{
				$(this).val(parseFloat(value).toFixed(2));
			}
		});

	 }

	 this.load=function(){
	 	Page.prototype.load.call(this);
		$("#backMenu").show();

	 	refresh(function(){
	 		$("#app_head").html(locale.getString('BET_TOP'));
	 	})				 	
	 }

	 this.unload=function(){
	 	Page.prototype.unload.call(this);
	 	$("#backMenu").hide();
	 }

	 var bet=function(){
	 	var betItems=getbetData();
	 	var isInvid=validate();
	 	if (isInvid) { mm.popup.showMessage(locale.getString('MSG_VALID_NUMBER_AMOUNT')); return;}
	 	if (betItems.length==0) {mm.popup.showMessage(locale.getString('MSG_RES_30104')); return;}

		var req={
			acctId:$("#uId").html(),
			betItems:betItems
		};
		service.bet(req,function(res){
			if (res.code > 0) {	mm.popup.showMessage(locale.getString("MSG_RES_"+res.code)); return; }
			mm.popup.showMessage(locale.getString('MSG_RES_0'));
			$("#nav_betAmt").text(mm.addDotToNumber(parseFloat($("#nav_batAmt_num").text()) + res.successAmount));
			$("#nav_batAmt_num").text(parseFloat($("#nav_batAmt_num").text()) + res.successAmount);
			$("#nav_rmLimit").text(mm.addDotToNumber(res.balance,true));
			form.reset();
		});
	 }

	 var reset=function(){
	 	form.reset();
	 }

	 var getbetData=function(){
	 	var betItems=[];
	 	var line=0;
	 	$(".betTop_table").find("tr:gt(0)").each(function(){
	 		var $this=$(this);
	 		var item=getItem($this);
	 		if (item!=null){
				item.line=line;
				line++;
				betItems.push(item);
			} 
	 	});
	 	return betItems;
	 }

	 var getItem=function($this){
	 	var item={};
	 	item.number=$this.find("input[class=num]").val();
	 	if (item.number.length==0) return null;

	 	var money=$this.find("input[class=money]").val();
	 	if (money) {
	 		var type="d"+item.number.length+"Top";
	 		item[type]=money;
	 	}else{
	 		return null;
	 	}
	 	return item;
	 }
	 

	 var validate=function(){
	 	//只需要验证数据的合法性
	 	var isInvid=false;

	 	//合法数据 金额
	 	$(".betTop_table").find('.num, .money').each(function(){
			var value=$(this).val();
			if (!$.isNumeric(value)&&value!="")  isInvid=true;
	 	});
	 	return isInvid
	 }

}