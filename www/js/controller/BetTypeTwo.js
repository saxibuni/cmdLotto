var BetTypeTwo=function(){

	var form=$("#page_betTypeTwo")[0];
	var keyCodeArray=[48,49,50,51,52,53,54,55,56,57,8,96,97,98,99,100,101,102,103,104,105,110];
	var keyCodeArray2=[48,49,50,51,52,53,54,55,56,57,190,8,96,97,98,99,100,101,102,103,104,105,110];

	this.init=function(){
		Page.prototype.init.call(this);

		$("#betTypeTwo_reset").click(reset);

		//下注号码验证
		$(".num4, .num3, .num2, .num1, .bet_top_num3").keydown(function(e) {
			if ($.inArray(e.keyCode,keyCodeArray)==-1) return false;
		}).blur(function(e){
			var value=$(this).val();
			if (value!="") {
				var length=$(this).attr('class').charAt($(this).attr('class').length-1);
				if (value.length!=length){
					mm.popup.showMessage(locale.getString('MSG_VALID_NUMBER'));
					$(this).focus();
				} 	
			};
		});

		//金额验证  只能输入数字和小数点
		$(".betmoney").keydown(function(e) {
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


		//下注
		$("#bet4,#bet3,#bet2,#bet1").click(function(){
			var betItems=[];
			var line=0;
			var id=$(this).attr('id');
			$(".num"+id.charAt(3)).each(function(){
				var value=$(this).val();
				if (value.length!="") {
					var item={};
					var type=$(this).attr('gameType');
					var money=$(this).parent().next().find('input').val();
					item.line=line;
					item.number=value;
					if (money!="") item[type.toString()]=money;
					betItems.push(item);
					line++;
				};
			});

			var InvidType=validate(betItems,"num"+id.charAt(3));
			if (InvidType.isInvid) { mm.popup.showMessage(locale.getString('MSG_VALID_NUMBER_AMOUNT')); return;}
			if (InvidType.isUnFull|| betItems.length==0) {mm.popup.showMessage(locale.getString('Bet Information Incomplete')); return;};
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
				//下注成功后清空下注信息
				$(".num"+id.charAt(3)).each(function(){
					$(this).val('');
					$(this).parent().next().find('input').val('');
				});
			});	

		});

		//set bet 3d top
		$("#placeBet").click(function(){
			var sourceNum = $("#sourceNum").val();			
			if (!$.isNumeric(sourceNum) || sourceNum.length!=3) {
				mm.popup.showMessage(locale.getString('MSG_VALID_NUMBER'));	
			}else{
				var arr=perm(sourceNum.split(''));
				var filterArr=uniqueArray(arr); //去除相同项
				var rollTopEle=$(".rollTop");
				rollTopEle.hide();
				for(var i=0;i<arr.length;i++){
					var $currentElement=$(rollTopEle[i]);
					$currentElement.show();
					$currentElement.find('.bet_top_num3').val(arr[i]);
					if (i==0) {
						$currentElement.find('.betmoney').val($("#topMoney").val());
					}else{
						$currentElement.find('.betmoney').val($("#rollMoney").val());
					}
				}
			}
			

		});

		//3d top bet
		$(".placeBet:gt(0)").click(function(){
			var thisTr=$(this).parent().parent();
			var item={line:0};
			item.number=thisTr.find('.bet_top_num3').val();
			item["d3Top"]=thisTr.find('.betmoney').val();
			if (!$.isNumeric(item["d3Top"])) { //合法金额
				mm.popup.showMessage(locale.getString('MSG_VALID_AMOUNT'));
			}else{
				var betItems=[];
				betItems.push(item);
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
					thisTr.hide();
					thisTr.find('.bet_top_num3').val("");
					thisTr.find('.betmoney').val("");
				});					
			};

		});


	}

	this.load=function(){
		Page.prototype.load.call(this);
		$("#backMenu").show();

	 	refresh(function(){
			$("#app_head").html(locale.getString('BET_TYPE2_TITLE'));
	 	});
	}

	this.unload=function(){
		Page.prototype.unload.call(this);
		form.reset();
		$("#backMenu").hide();
	}

	var reset=function(){
		form.reset();
		var rollTopEle=$(".rollTop");
		rollTopEle.hide();
	}

	var validate=function(betItems,className){
		//1.合法数据验证  
		//2.完整数据验证
		var InvidType={
			isInvid:false,
			isUnFull:false
		}
		var numElement=$("."+className);

		for(var i=0;i<numElement.length;i++){
			var $this=$(numElement[i]);

			var value=$this.val();
			if (!$.isNumeric(value)&&value!=""){   //不合法数据验证  非数字
				InvidType.isInvid=true;
				return InvidType;
			}

			var constLength=$this.attr('maxLength');  
			if (constLength!=$this.val().length && $this.val()!="") {  //不合法数据验证  号码长度不合法
				InvidType.isInvid=true;
				return InvidType;
			};
		}

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

	//全排列算法 From Baidu
	function perm(arr) { 
		var Arr=new Array();
     	var result = new Array(arr.length); 
    	var fac = 1; 
     	for (var i = 2; i <= arr.length; i++) 
        	fac *= i; 
   		for (index = 0; index < fac; index++) { 
         	var t = index; 
         	for (i = 1; i <= arr.length; i++) { 
            	var w = t % i; 
             	for (j = i - 1; j > w; j--) 
                	result[j] = result[j - 1]; 
            	result[w] = arr[i - 1]; 
            	t = Math.floor(t / i); 
        	}
        	Arr.push(result.join(''));
     	}

     	return Arr;
 	}

 	//去除重复项
 	function uniqueArray(data){  
		data = data || [];  
	   	var a = {};  
	   	for (var i=0; i<data.length; i++) {  
	       	var v = data[i];  
	       	if (typeof(a[v]) == 'undefined'){  
	           a[v] = 1;  
	       	}  
	   	};  
	   	data.length=0;  
	  	for (var i in a){  
	    	data[data.length] = i;  
	   	}  
	   	return data;  
	}  




 	
	
}