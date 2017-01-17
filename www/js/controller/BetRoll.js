var BetRoll=function () {
	
	var form=$("#page_betRoll")[0];
	var keyCodeArray=[48,49,50,51,52,53,54,55,56,57,8,96,97,98,99,100,101,102,103,104,105,110];
	var keyCodeArray2=[48,49,50,51,52,53,54,55,56,57,190,8,96,97,98,99,100,101,102,103,104,105,110];

	 this.init=function(){
	 	Page.prototype.init.call(this);

	 	$("#betRoll_bet").click(bet);
		$("#betRoll_reset").click(reset);

	 	//下注号码验证设置  只能输入位数字
		$("#betRoll_reset .num").keydown(function(e){
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
		$("#betRoll_reset .money").keydown(function(e) {
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
		 	$("#app_head").html(locale.getString('BET_ROLL'));
	 	});	 	
	 }

	 this.unload=function(){
	 	Page.prototype.unload.call(this);
		$("#backMenu").hide();	 	
	 }

	 var bet=function(){
	 	var betItems=getbetData();
	 	var isInvid=validate(betItems);
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
	 	$(".betRoll_table").find("tr:gt(0)").each(function(){
	 		var $this=$(this);
	 		var item=getItem($this);
	 		if (item!=null){
				item.line=line;
				line++;
				betItems.push(item);
			} 
	 	});

	 	var Roll19Item=get19RollItem();
	 	if (Roll19Item!=null) betItems.push(Roll19Item);

	 	return betItems;
	 }

	 var getItem=function($this){
	 	var item={};
	 	item.number=$this.find(".num").val();
	 	if (item.number.length==0) return null;

	 	var money=$this.find(".money").val();
	 	if (money) {
	 		var type="d"+item.number.length+"Roll";
	 		item[type]=money;
	 	}else{
	 		return null;
	 	}
	 	return item;
	 }

	 var get19RollItem=function(){
	 	var item={};
	 	item.number=$(".19roll").find(".num").val();
	 	if (item.number.length==0) return null;

	 	var topMoney=$(".19roll").find("input[betType=bet_top]").val();
	 	if (topMoney) item["r191"]=topMoney;

	 	var bottomMoney=$(".19roll").find("input[betType=bet_bottom]").val();
	 	if (bottomMoney) item["r192"]=bottomMoney;
	 	
	 	//确保数据完整性
	 	var count=0;
	 	for(var i in item){
	 		count++;
	 	}
	 	if (count<2) return null;
	 	return item;
	 }
	 

	 var validate=function(betItems){
	 	//只需要验证数据的合法性
	 	var isInvid=false;

	 	//合法数据 金额
	 	$(".betRoll_table").find('.num, .money').each(function(){
			var value=$(this).val();
			if (!$.isNumeric(value)&&value!="")  isInvid=true;
	 	});

	 	// roll的号码长度至少为2
	 	for(var i=0;i<betItems.length;i++){
	 		var item=betItems[i];
	 		if(item.hasOwnProperty('r191')||item.hasOwnProperty("r192")) continue;
	 		if (item.number.toString().length==1) isInvid=true;
	 	}

	 	return isInvid;
	 }

}

