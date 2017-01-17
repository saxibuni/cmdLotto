
var Statement=function(){
	var content=$("#statement_list");

	this.init=function(){
		Page.prototype.init.call(this);

		$("#thisWeek").click(function(){
			$(this).addClass('current').removeClass('other');
			$("#lastWeek").addClass('other').removeClass('current');
			var d = mm.getThisWeek();
			initList({"beginDate":d[0],"endDate":d[1]});
		});
		$("#lastWeek").click(function(){
			$(this).addClass('current').removeClass('other');
			$("#thisWeek").addClass('other').removeClass('current');
			var d = mm.getLastWeek();
			initList({"beginDate":d[0],"endDate":d[1]});
		});

		$("#statement_list").on('click', 'a', function(event) {
			var date=$(this).html().replace(/-/g,"");//alert(date);
			$.cookie("paramDate", date);
			$.afui.loadContent("#ticketDetail");
		});
	}

	this.load=function(){
		Page.prototype.load.call(this);

		refresh(function(){
			$("#app_head").html(locale.getString('STATEMENT_TITLE'));
			$("#thisWeek").trigger("click");
		});

	}

	this.unload=function(){
		Page.prototype.unload.call(this);
		content.html(" ");
	}


	var initList=function(req){
		content.html("");
		service.statement(req,function(res){		
			if (res.code > 0) {	mm.popup.showMessage(locale.getString("MSG_RES_"+res.code)); return; }
			var list = res.list;
			var htm=[];
			for(var i in list){
				var item = list[i];
				htm.push('<div class="statement">');
				htm.push('<table>');
				htm.push('<tr><td key="DATE">'+ locale.getString('DATE')+' : </td><td><a href="javascript:void(0);">'+item.drawDate+'</a></td></tr>');
				htm.push('<tr><td key="TRUNOVER">'+locale.getString('TRUNOVER') +' : </td><td>'+mm.getMoneySpans(mm.formatMoney(item.turnOver))+'</td></tr>');
				htm.push('<tr><td key="COMM">'+ locale.getString('COMM') +' : </td><td>'+mm.getMoneySpans(mm.formatMoney(item.comm))+'</td></tr>');
				htm.push('<tr><td key="PAY_OUT">'+locale.getString('PAY_OUT') +' : </td><td>'+mm.getMoneySpans(mm.formatMoney(item.payOut))+'</td></tr>');
				htm.push('<tr><td key="WIN_LOST">'+locale.getString('WIN_LOST') +' : </td><td>'+mm.getMoneySpans(mm.formatMoney(item.winLose))+'</td></tr>');
				htm.push('<tr><td key="SETTLED">'+locale.getString('SETTLED') +' : </td><td>'+mm.getMoneySpans(mm.formatMoney(item.payment))+'</td></tr>');
				htm.push('<tr><td key="BALANCE">'+locale.getString('BALANCE') +' : </td><td>'+ mm.getMoneySpans(mm.formatMoney(item.netAmount))+'</td></tr>');
				htm.push('</table>');
				htm.push('</div>');
			}
			$(htm.join(" ")).appendTo(content);
		});
	}



}
