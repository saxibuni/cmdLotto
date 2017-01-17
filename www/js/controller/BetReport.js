var BetReport=function () {

	var ul=$("#bet"); 
	var index=0;
	//var system = mm.config["system"];
	var system=mm.getParam('system');
	
	this.init=function(){
		Page.prototype.init.call(this);

		$("#MORE").click(function(){
			var id = ul.find('li:last').attr('id');
			var req={
				baseId:id,
				next:true
			}
			service.queryBetReport(req,function(res){
				if (res.code > 0) {	mm.popup.showMessage(locale.getString("MSG_RES_"+res.code)); return; }
				initList(res.list,true);
			});
		});

		//print
		$('#page_betReport ul').on('click','a',function(){
			var data=$(this).parent().parent().data('data');
			if (system != "ios") data.replace(/,/g,"");
			mm.print(data);
		});
	}

	this.load=function(){
		Page.prototype.load.call(this);

		refresh(function(){
			$("#app_head").html(locale.getString('BET_REPORT_TITLE'));
			$("#betReportNumber").attr('placeholder',locale.getString('NUMBER_SMALL'));
			service.queryBetReport({},function(res){
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

	var initList = function(list,isNext){
		if(!isNext) ul.html("");
		$(".showAll").css('display',list.length < 5 ? "none" : "block");
		if(list.lengh == 0) return;

		var item;
		for(var i in list){
			index++;
			item = list[i]; var htm = [],data;
			htm.push('<div class="reportContent">');
			htm.push('<span class="reportNum">' + item.acctId + '</span>');
			htm.push('<div class="index">'+index+'</div>');
			htm.push('<br/>' + item.betTime );
			data = item.betTime + "\n";
			htm.push('<br /><span key="STAKE">' +locale.getString('STAKE') +'</span> :'+mm.getMoneySpans(mm.formatMoney(item.betAmt)));
			data += "Stake : " + mm.formatMoney(item.betAmt) + "\n,";
			htm.push('<br /><span key="NET_AMT">' +locale.getString('NET_AMT') +'</span> :'+mm.getMoneySpans(mm.formatMoney(item.netAmt)));
			data += "Net Amt : " + mm.formatMoney(item.netAmt) + "\n";
			htm.push('<br /><span key="COMM">' +locale.getString('COMM') +'</span> : '+ mm.getMoneySpans(mm.formatMoney(item.comm)));
			data += "Comm :  " + mm.formatMoney(item.comm) + "\n";
			htm.push('<br />'+(item.eventMsg || ""));
			data += (item.eventMsg || "").replace(/ #/g,"#").replace(/<br\/>/g,"\n,").replace(/<span class="receipt_cancel">/g,"").replace(/<\/span>/g,"");
			htm.push("</div>");
			htm.push('<div class="marginCss"><a href="javascript:;" key="PRINT">'+ locale.getString('PRINT')+'</a></div>');

			$("<li id='"+item.eventId+"' />").data('data',data).html(htm.join(" ")).appendTo(ul);
		}
	};

}