var BetRule=function () {

	var rewards = ['d4TopOdds','d4RollOdds','d3TopOdds','d3BottomOdds','d3RollOdds','d2TopOdds','d2BottomOdds','d2RollOdds','d1TopOdds','d1BottomOdds','d1Fix1Odds','d1Fix2Odds','d1Fix3Odds','r19R191Odds','r19R192Odds'];
	var min = ['d4TopMin','d4RollMin','d3TopMin','d3BottomMin','d3RollMin','d2TopMin','d2BottomMin','d2RollMin','d1TopMin','d1BottomMin','d1Fix1Min','d1Fix2Min','d1Fix3Min','r19R191Min','r19R192Min','bsMin'];
	var max = ['d4TopMax','d4RollMax','d3TopMax','d3BottomMax','d3RollMax','d2TopMax','d2BottomMax','d2RollMax','d1TopMax','d1BottomMax','d1Fix1Max','d1Fix2Max','d1Fix3Max','r19R191Max','r19R192Max','bsMax'];
	var per = ['d4TopPer','d4RollPer','d3TopPer','d3BottomPer','d3RollPer','d2TopPer','d2BottomPer','d2RollPer','d1TopPer','d1BottomPer','d1Fix1Per','d1Fix2Per','d1Fix3Per','r19R191Per','r19R192Per','bsPer'];

	
	this.init=function(){
		Page.prototype.init.call(this);
	}

	this.load=function(){
		Page.prototype.load.call(this);

		refresh(getBetRule);
	}

	this.unload=function(){
		Page.prototype.unload.call(this);
	}


	var getBetRule=function(){

		$("#app_head").html(locale.getString('BET_RULE_TITLE'));

		service.queryBetRule({},function(res){
			if (res.code > 0) {	mm.popup.showMessage(locale.getString("MSG_RES_"+res.code)); return; }
			var list=res.limit,listOdds=res.pack;
			$(".max_bet_pay").each(function(i){
				var odds=listOdds[rewards[i]] == null ? '-' : listOdds[rewards[i]];
				$(this).text(mm.addDotToNumber(odds,false) + '/' + list[min[i]] + '/' + mm.addDotToNumber(list[max[i]],false));
			});
			$(".bet_number").each(function(i){
				$(this).text(mm.addDotToNumber(list[per[i]],false));
			});
		});

	}


}