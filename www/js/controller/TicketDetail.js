var TicketDetail=function () {

	var ul=$("#ticket"); 
	var index=0;
	var number,pollId;
	//var system = mm.config["system"];
	var system=mm.getParam('system');
	
	this.init=function(){
		Page.prototype.init.call(this);

		$("#ticket_more").click(function(){
			var id = ul.find('li:last').attr('id');
			var date=$.cookie('paramDate');			
			var req={
				drawDate:date,	
				baseId:id,
				next:true
			}
			service.queryTicketDetail(req,function(res){
				if (res.code > 0) {	mm.popup.showMessage(locale.getString("MSG_RES_"+res.code)); return; }
				initList(res.list,true);
			});
		});

		//print
		$('#page_ticketDetail ul').on('click','a',function(){
			var data=$(this).parent().parent().data('item');
			printData(data);
		});
	}

	this.load=function(){
		Page.prototype.load.call(this);

		refresh(function(){
			$("#app_head").html(locale.getString('LIST_TICKET'));
			var date=$.cookie('paramDate');
			service.queryTicketDetail({"drawDate":date},function(res){
				if (res.code > 0) {	mm.popup.showMessage(locale.getString("MSG_RES_"+res.code)); return; }
				index=0;
				initList(res.list,false);
			});
		});
	}


	this.unload=function(){
		Page.prototype.unload.call(this);
		ul.html("");
	}

	//print data
	var printData=function(item){
		var content="";
		content += "CMD LOTTO\n";
		content += item.id + "\n";
		content += "Draw Date:" + item.drawId.substr(0,4)+"-"+item.drawId.substr(4,2)+"-"+item.drawId.substr(6,2) + "\n";
		content += "Transation:" + item.betTime + "\n";
		if (system=="ios") content += "Game:" + item.poolId + "\n" + ",";
		else content += "Game:" + item.poolId + "\n";
		content += "Number:" + item.number + "\n";
		content += "Stack:" + parseFloat(item.betUnit).toFixed(2) + "\n";
		content += "Turnover:" + parseFloat(item.betAmt).toFixed(2) + "\n";
		if (system=="ios")  content += "Comm:" + parseFloat(item.comm).toFixed(2) + "\n" + ",";
		else content += "Comm:" + parseFloat(item.comm).toFixed(2) + "\n";
		content += "Net Amt:" + parseFloat(item.netAmt).toFixed(2) + "\n";
		content += "W/L:" + parseFloat(item.wl).toFixed(2);
		mm.print(content);
 	}

	var initList = function(list,isNext){
		if(!isNext) ul.html("");
		if(list.lengh == 0) return;
		if (list.length<5) {
			$(".showAll").css('display',"none");
		}else{
			$(".showAll").css('display',"block");
		}
		var item;
		for(var i in list){
			index++;
			item = list[i]; var htm = [];
			htm.push('<div class="reportContent">');
			htm.push('<span class="reportNum">' + item.id + '</span>');
			htm.push('<div class="index">'+index+'</div>');
			htm.push('<br/><span key="DRAW_DATE">'+ locale.getString('DRAW_DATE') +'</span> :'+item.drawId.substr(0,4)+"-"+item.drawId.substr(4,2)+"-"+item.drawId.substr(6,2));
			htm.push('<br /><span key="TRANSACTION">'+ locale.getString('TRANSACTION') +'</span> :'+item.betTime);
			htm.push('<br /><span key="GAME">'+locale.getString('GAME') +'</span> :<span key="'+item.poolId+'">'+ locale.getString(item.poolId)+'</span>');
			htm.push('<br /><span key="NUMBER_SMALL">' +locale.getString('NUMBER_SMALL') +'</span> :'+item.number);
			htm.push('<br /><span key="STAKE">' +locale.getString('STAKE') +'</span> :'+mm.getMoneySpans(mm.formatMoney(item.betUnit)));
			htm.push('<br /><span key="TRUNOVER">' +locale.getString('TRUNOVER') +'</span> :'+ mm.getMoneySpans(mm.formatMoney(item.betAmt)));
			htm.push('<br /><span key="COMM">' +locale.getString('COMM') +'</span> : '+ mm.getMoneySpans(mm.formatMoney(item.comm)));
			htm.push('<br /><span key="NET_AMT">' +locale.getString('NET_AMT') +'</span> :'+mm.getMoneySpans(mm.formatMoney(item.netAmt)));
			htm.push('<br /><span key="WL">' +locale.getString('WL') +'</span> :'+mm.getMoneySpans(mm.formatMoney(item.wl)));			
			htm.push("</div>");
			htm.push('<div class="marginCss"><a href="javascript:;" key="PRINT">'+ locale.getString('PRINT')+'</a></div>');


			$("<li id='"+item.id+"' />").html(htm.join(" ")).appendTo(ul);
			$('#'+item.id).data('item', item);
		}
	};

}