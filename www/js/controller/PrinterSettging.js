var PrinterSettging=function () {

	//var system = mm.config["system"];
	var system=mm.getParam('system');

	var ul=$('#page_BlueToothSetting ul');
	var address="";
	var addressArray=[]; //just for ios;
	this.init=function(){
		Page.prototype.init.call(this);

		//save mac address
		$('#page_BlueToothSetting ul').on('click', 'li:gt(0)', function(event) {
			$("#page_BlueToothSetting ul").find('li:gt(0)').removeClass('bgClass');
			var liElement=$(this).addClass('bgClass');
			address=liElement.find('a').attr('id');
		});

		//refresh
		$("#blueTooth_refresh").click(function(){
			addressArray=[];
			loadBlueTooth();
		});

		//save
		$("#blueTooth_save").click(function(){
			var mac = mm.Storage.getItem('MacAddress');
			if (address==""&& mac==null) mm.popup.showMessage(locale.getString("MSG_DEVICE_NOT_SAVE"));
			else {
				if(address=="") address=mac;
			 	mm.Storage.setItem('MacAddress',address);

			 	//ios不光需要mac  还需要 serviceUuid和characteristicUuid
			 	//serviceUuid和characteristicUuid需要在连接上blueTooth后才能获取
			 	//此处会有连接操作 不同于android 打印的时候才会去连接
			 	if (system=="ios")   
			 		getIosConnectParams(address);
			 	else
			  		mm.popup.showMessage(locale.getString("MSG_DEICE_SAVE_SUCCESS"));
			}
		});
	}

	this.load=function(){
		Page.prototype.load.call(this);
		addressArray=[];//清空数组

		refresh(function(){
			$("#app_head").html(locale.getString('PRINT_SETTING_TITLE'));
			loadBlueTooth();
		});
	}

	this.unload=function(){
		Page.prototype.unload.call(this);
		$('#page_BlueToothSetting ul').find('li:gt(0)').remove();
	}

	var loadBlueTooth=function(){
		if (system=="ios") {
			ul.find('li:gt(0)').remove();
			bluetoothle.initialize(onStartScan,function(){
				// scan error
			});
		}else{
			bluetoothSerial.list(onDeviceList,onError);
		}
		address="";
	}

	//for andriod
	var onDeviceList=function(devives){
		ul.find('li:gt(0)').remove();
		var mac = mm.Storage.getItem('MacAddress');
		devives.forEach(function(device){
			var liElement;
			if (mac==device.id) 
				liElement ='<li class="bgClass"><a href="javascript:;" id="'+ device.id+'">'+device.name+'</a></li>';
			else 
				liElement ='<li><a href="javascript:;" id="'+ device.id+'">'+device.name+'</a></li>';

			$(liElement).appendTo(ul);
		});

		if (devives.length==0) {mm.popup.showMessage(locale.getString("MSG_NODEVICE"));};
	}

	var onError=function(reason){
		mm.popup.showMessage(reason);
	}


	//for ios
	var onStartScan=function(){
		bluetoothle.startScan(
			function(data){
				if (data.status == "scanResult"){
					if ($.inArray(data.address,addressArray)==-1) {
						addressArray.push(data.address);
						createElement(data);
					}					
				}
			},
			function(data){				
			},
			{"serviceUuids":[],allowDuplicates: false}
		);

		//只搜索3秒
		setTimeout(function(){
			bluetoothle.stopScan(
				function(){},
				function(){}
			);
		}, 3000);
 	}

 	// for ios
 	var createElement=function(device){
		var mac = mm.Storage.getItem('MacAddress');
		var liElement;
		if (mac==device.address) 
			liElement ='<li class="bgClass"><a href="javascript:;" id="'+ device.address+'">'+device.name+'</a></li>';
		else 
			liElement ='<li><a href="javascript:;" id="'+ device.address+'">'+device.name+'</a></li>';

		$(liElement).appendTo(ul);		
 	}

 	//获取serviceUuid和characteristicUuid
 	var getIosConnectParams=function(mac){
 		bluetoothle.connect(
 			function(obj){
				if (obj.status=="connected") {

					//discover
					bluetoothle.discover(
						function(deviceInfo){
							//alert(JSON.stringify(deviceInfo));
							var serviceUuid=deviceInfo.services[1].serviceUuid;
							var characteristicUuid =deviceInfo.services[1].characteristics[0].characteristicUuid;
			 				
			 				mm.Storage.setItem('serviceUuid',serviceUuid);
			 				mm.Storage.setItem('characteristicUuid',characteristicUuid);

			  				mm.popup.showMessage(locale.getString("MSG_DEICE_SAVE_SUCCESS"));

			 				//bluetoothle.disconnect(function(){},function(){},{"address":mac});
						},
						function(err){
							alert("discover failed");
						},
						{"address":mac}
					);
				}
 			},
 			function(errerr){;
				//alert('connect failed');
				alert(JSON.stringify(errerr));
 			},
			{"address":mac}
 		);
 	}

}