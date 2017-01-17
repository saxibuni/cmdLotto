var ChangeLanguage=function () {
	
	var TitleMap={
		"selectBetTypes": "SELECET_BET_TYPES_TITLE",
		"betTypeOne": "BET_TYPE1_TITLE",
		"betTypeTwo": "BET_TYPE2_TITLE",
		"betTypeThree": "BET_TYPE3_TITLE",
		"betReport": "BET_REPORT_TITLE",
		"betRule": "BET_RULE_TITLE",
		"resultReward": "RESULT_REWARD_TITLE",
		"changePassword": "CHANAGE_PWD_TITLE",
		"statement": "STATEMENT_TITLE",

		"changeLanguage": "CHANGELANGUAGE_TTILE",
		"betTop" : "BET_TOP_TITLE",
		"betBottom" : "BET_BOTTOM_TITLE",
		"betRoll" : "BET_ROLL_TITLE",
		"betFix" : "BET_FIX_TITLE"
	}

	this.init=function(){
		Page.prototype.init.call(this);
		$("#btnChangeLanguage").click(changeLanguage);

	}

	this.load=function(){
		Page.prototype.load.call(this);

	 	refresh(function(){
			$("#app_head").html(locale.getString('CHANGELANGUAGE_TTILE'));
	 	});
	}


	this.unload=function(){
		Page.prototype.unload.call(this);
	}

	var changeLanguage=function(){
		var language=$("#page_changeLanguage input[name=language]:checked").attr('tag');
		if (language=="englishi") {
			locale.setLocale("english",setTitle);
		}else{
			locale.setLocale("thailand",setTitle);
		}
	}


	var setTitle=function(){
		var i=location.href.indexOf('#');
		var subPageId=location.href.substring(i+1);
		$("#app_head").html(locale.getString(TitleMap[subPageId]));

		$("#betReportNumber").attr('placeholder',locale.getString('NUMBER_SMALL'));
		$("#oldPwd").attr('placeholder',locale.getString('PASSWORD'));
		$("#newPwd").attr('placeholder',locale.getString('NEW_PASSWORD'));
		$("#reNewPwd").attr('placeholder',locale.getString('RE_ENTER_PWD'));

		var language=$("#page_changeLanguage input[name=language]:checked").attr('tag');
		$.cookie("currentLanguage",language);
	}

}