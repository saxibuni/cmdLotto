var BetTypeOne=function(){

	var form=$("#page_betTypeOne")[0];
	var keyCodeArray=[48,49,50,51,52,53,54,55,56,57,8,96,97,98,99,100,101,102,103,104,105,110];
	var keyCodeArray2=[48,49,50,51,52,53,54,55,56,57,190,8,96,97,98,99,100,101,102,103,104,105,110];

	this.init=function(){
		Page.prototype.init.call(this);

		$("#betTypeone_bet").click(bet);
		$("#betTypeone_reset").click(reset);

		$(".more").click(function(){
			$(".d").show();
			$(this).hide();
		});

		$("#check_top").click(function(){
			if ($(this)[0].checked) {
				$(".d").find(".bet_top").css("visibility","visible");
			}else{
				$(".d").find(".bet_top").css("visibility","hidden").val("");
			}
		});

		$("#check_roll").click(function(){
			if ($(this)[0].checked) {
				$(".d").find(".bet_roll").each(function(){
					var numElement=$(this).parent().parent().parent().find(".bet_num");
					var length=numElement.val().length;
					if (length!=1) $(this).css("visibility","visible");
				});				
			}else{
				$(".d").find(".bet_roll").css("visibility","hidden").val("");				
			}
		});

		$("#check_buttom").click(function(){
			if ($(this)[0].checked) {
				$(".d").find(".bet_bottom").each(function(){
					var numElement=$(this).parent().parent().parent().find(".bet_num");
					var length=numElement.val().length;
					if (length!=4) $(this).css("visibility","visible");
				});
			}else{
				$(".d").find(".bet_bottom").css("visibility","hidden").val("");
			}
		});

		//下注号码验证设置  只能输入位数字
		$(".bet_num").keydown(function(e){
			if ($.inArray(e.keyCode,keyCodeArray)==-1) return false;
		}).blur(function(){
			var value=$(this).val();
			if (value=="") return;
			if (!$.isNumeric(value)&&value!="") {
				mm.popup.showMessage(locale.getString("MSG_VALID_NUMBER"));
				$(this).focus();
			}
		})

		//根据号码长度 玩法设置
		$(".d").find(".bet_num").bind('input propertychange',function(){			
			var length=$(this).val().length;
			if ($("#check_roll")[0].checked) {
				if (length==1) $(this).parent().parent().parent().find(".bet_roll").css("visibility","hidden").val("");
				else $(this).parent().parent().parent().find(".bet_roll").css("visibility","visible");
			};	
			if ($("#check_buttom")[0].checked) {
				if (length==4) $(this).parent().parent().parent().find(".bet_bottom").css("visibility","hidden").val("");
				else $(this).parent().parent().parent().find(".bet_bottom").css("visibility","visible");
			};
		});


		//金额验证  只能输入数字和小数点
		$(".bet_top, .bet_roll, .bet_bottom").keydown(function(e) {
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
			$("#app_head").html(locale.getString('BET_TYPE1_TITLE'));
	 	});	
	}

	this.unload=function(){
		Page.prototype.unload.call(this);
		form.reset();
		$(".bet_bottom, .bet_roll").css("visibility","visible");
		$(".d:gt(1)").hide();
		$(".more").show();
		$("#backMenu").hide();

	}

	var reset=function(){
		form.reset();
		$(".bet_bottom, .bet_roll").css("visibility","visible");
		$(".d:gt(1)").hide();
		$(".more").show();		
	}


	var bet=function(){
		//todo
		var betItems = getbetData();
		var InvidType=validate(betItems);
		if (InvidType.isInvid) { mm.popup.showMessage(locale.getString('MSG_VALID_NUMBER_AMOUNT')); return;}
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
		var line=0;
		$(".d, .fix, .19roll").each(function(){
			var $this=$(this);
			var item=getSignalItem($this);
			if (item!=null){
				item.line=line;
				line++;
				betItems.push(item);
			} 
		});
		console.log(JSON.stringify(betItems));
		return betItems;
	}

	var getSignalItem=function($this){
		var item={};
		item.number=$this.find("input[class=bet_num]").val();
		if (item.number.length==0) return null;

		var topElement=$this.find("input[class=bet_top]");
		if (topElement&&topElement.val()){
			var type=getType(item.number,"Top",$this);
			item[type.toString()]=topElement.val();
		}

		var rollElement=$this.find("input[class=bet_roll]");
		if (rollElement&&rollElement.val()) {
			var type=getType(item.number,"Roll",$this);
			item[type.toString()]=rollElement.val();
		}

		var bottomElement=$this.find("input[class=bet_bottom]");
		if (bottomElement&&bottomElement.val()){
			var type=getType(item.number,"Bottom",$this);
			item[type.toString()]=bottomElement.val();
		}
		return item;
	}


	var getType=function(num,t,obj){
		var classType=obj.attr('class');
		if (classType=="d") {
			return "d"+num.length+t;
		};
		if (classType=="fix") {
			if (t=="Top") t="Fix1";
			if (t=="Roll") t="Fix2";
			if (t=="Bottom") t="Fix3";
			return "d"+num.length+t;
		};
		if (classType=="19roll") {
			if (t=="Top") return "r191";
			if (t="Bottom") return "r192";
		};
	}

	var validate=function(betItems){
		//1.合法数据验证  
		//2.完整数据验证
		var InvidType={
			isInvid:false,
			isUnFull:false
		}

		//合法数据	金额	
		$(".bet_top, .bet_roll, .bet_bottom").each(function(){
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