var BetTypeThree=function(){

	var form=$("#page_betTypeThree")[0];
	var keyCodeArray=[48,49,50,51,52,53,54,55,56,57,190,8,96,97,98,99,100,101,102,103,104,105,110];

	this.init=function(){
		Page.prototype.init.call(this);

		$("#betTypeThree_bet").click(bet);
		$("#betTypeThree_reset").click(reset);
		
		//金额验证  只能输入数字和小数点
		$(".money_top, .money_bottom, .money_roll").keydown(function(e) {
			if ($.inArray(e.keyCode,keyCodeArray)==-1) return false;
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
			$("#app_head").html(locale.getString('BET_TYPE3_TITLE'));
	 	});	
	}

	this.unload=function(){
		Page.prototype.unload.call(this);
		form.reset();
		$("#backMenu").hide();
	}

	var reset=function(){
		form.reset();
	}

	var bet=function(){
		//todo
		var req={};
		var betItems = getbetData();
		var InvidType=validate(betItems);
		if (InvidType.isInvid) { mm.popup.showMessage(locale.getString('MSG_VALID_AMOUNT')); return;}
		if (InvidType.isUnFull|| betItems.length==0) {mm.popup.showMessage(locale.getString('MSG_RES_30104')); return;};
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


	var getbetData=function(){
		var betItems=[];
		var d2Top=$(".money_top").val();
		var d2Bottom=$(".money_bottom").val();
		var d2Roll=$(".money_roll").val();
		if (d2Top==""&&d2Bottom==""&&d2Roll=="") return betItems;
		var num=[];
		$("#betTypeThree_num").find("input[type=checkbox]").each(function(index) {
			if($(this)[0].checked){
				if(index<10) num.push((0+index.toString()));
				else num.push(index.toString());
			}
		});
		if (num.length==0) return betItems;
		for(var i=0;i<num.length;i++){
			var item={};
			item.line=i;
			item.number=num[i];
			if (d2Top!="") item["d2Top"]=d2Top;
			if (d2Bottom!="") item["d2Bottom"]=d2Bottom;
			if (d2Roll!="") item["d2Roll"]=d2Roll;
			betItems.push(item);
		}

		return betItems;
	}


	var validate=function(betItems){
		//1.合法数据验证  
		//2.完整数据验证
		var InvidType={
			isInvid:false,
			isUnFull:false
		}

		//合法数据		
		$(".money_top, .money_roll, .money_bottom").each(function(){
			var value=$(this).val();
			if (!$.isNumeric(value)&&value!="")  InvidType.isInvid=true;
		});
		if (InvidType.isInvid) return InvidType; //不合法数据  直接返回
		
		//完整数据  有下注金额
		for(var i=0;i<betItems.length;i++){
			var item=betItems[i];
			var count=0;
			for(var j in item){    //至少有三个属性  line number  gameType
				count++;
			}
			if (count<3) InvidType.isUnFull=true;
		}
		return InvidType;
	}

	
}