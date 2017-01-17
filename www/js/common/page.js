var mm = mm || {};

mm.initPages=function(){
	$("div.pages div.panel[data-include]").each(function(){
		var item=$(this),id=item.attr("id");
		var className=mm.toUpperFirstLetter(id);
		try{
			var classInstance=eval(className);
		}catch(e){
			mm.error("class "+ className + "not found.");
			return true;
		}

		if (!mm.isFunction(classInstance)) return false;

		var obj=new classInstance();
		item.bind('panelload ',obj.load.bind(obj));   //改变执行上下文 变为obj
		item.bind('panelunload', obj.unload.bind(obj));

		item.data("instance",obj);
	});

	//执行活动窗体的js
	$($.afui.activeDiv).getInstance().load();
}


/*  Page对象貌似可以不需要   该对象操作内容不太多  可以放到子类中实现 */
var Page=function(){
	this.isInit=false;
}

//dom加载完后 事件注册一般放在这里   
Page.prototype.init=function(){
	this.isInit=true;
}

//dom加载完后  初始化执行放在这里
Page.prototype.load=function(){
	if(!this.isInit) this.init();
}

//子页面跳转后 执行这里  一般清空页面load完后的数据
Page.prototype.unload=function(){

}



