var ResultReward=function() {
	
	var selectDate=$("#rewardDate");
	var map = ['d4Top','d4Roll','d3Top','d3Bottom','d3Roll','d2Top','d2Bottom','d2Roll','d1Top','d1Bottom','d1Fix1','d1Fix2','d1Fix3','r19R191','r19R192'];
	
	this.init=function(){
		Page.prototype.init.call(this);

		selectDate.change(queryResult);
	}

	this.load=function(){
		Page.prototype.load.call(this);

		refresh(function(){
			$("#app_head").html(locale.getString('RESULT_REWARD_TITLE'));		
			initDate();
		});

	}

	this.unload=function(){
		Page.prototype.unload.call(this);
	}

	//初始化开奖时间
	var initDate=function(){
		selectDate.html("");
		service.queryDrawDate({},function(res){
			if (res.code > 0) {	mm.popup.showMessage(locale.getString("MSG_RES_"+res.code)); return; }
			var list=res.drawDateList;
			for(var i in list){
				selectDate.append("<option value='"+list[i]+"'>"+list[i]+"</option>");
			}

			queryResult();
		});
	}

	//获取各玩法中奖结果
	var queryResult=function(){
		var date=selectDate.val();

		service.queryResult({"drawDate":date},function(res){
			var reward=res.list;
			var result=res.result;
			$("#topReward").text(reward[0]);
			$("#middleReward").text(reward[1]+" "+reward[2]+" "+ reward[3]+" "+reward[4]);
			$("#bottomReward").text(reward[5]);

			$("#drawResult tr").find('td:eq(1)').each(function(i){
				if (map[i]=="d4Roll" || map[i]=="d3Roll" || map[i]=="d2Roll") {
					var data=res.result[map[i]];
					var html="";
					for(var j=0;j<data.length;j++){
						if((j+1)%4==0) html+=data[j]+"</br> ";
						else html+=data[j]+" ";
					}
					$(this).html(html);
				}else{
					$(this).html(res.result[map[i]].join("  "));
				}
			});
		});






	}

}