	/*author:ls
	*email:liusaint@gmail.com
	* data:2016/03/16
	*/

	function Slide(){
		this.index = 0; //当前是第几个图片。		
		this.urlsLen = 1;//轮播长度。默认已经放了一张图在上面。
		this.interval;//定时器
		this.inited = false;//是否已初始化。
	}

	Slide.prototype={
		constructor:Slide,
		init:function(config){
			this.DOM = config.DOM || ".slide-wrap";//操作的是哪一个DOM根节点。最好是给ID。
			this.TIME = config.TIME || 3000; //时间间隔。
			this.initModel = config.initModel || 2; 
			//初始化模式 1：表示加载完图片再启动轮播。2：加载完成一张添加一张到轮播里面。
			this.lazyloadImgs(config.urls);			
		},
		startSlide:function(){
			//初始化。加载定时器和各种事件绑定。
			this.setTimer();
			this.slideEvent();
			this.triEvent();
			this.circleEvent();
		},
		slideEvent:function(){
			//鼠标移动到组件上。停止计时。轮播暂停。
			var self = this;
			$(this.DOM).hover(function() {
				self.clearTimer();
			}, function() {
				self.setTimer();
			});
		},
		triEvent:function(){
			//左右箭头事件。
			var self = this;
			$(document).on('click', this.DOM+' .slide-tri li', function(event) {
				if($(this).hasClass('slide-tri-left')){
					self.reduceIndex();
				}else{
					self.addIndex();
				}				
				self.setImg();	
				self.circleChange();			
			});
		},
		circleEvent:function(){
			//鼠标移动到小圆上的事件。鼠标在上面停500毫秒则切换。
			var self = this;
			var hoverTimer;
			$(document).on('mouseover mouseout', this.DOM+' .slide-circle li', function(event) {
				var theli = this;
				if(event.type == 'mouseover'){
					hoverTimer = setTimeout(function() {
						self.index = $(theli).index();
						self.setImg();	
						self.circleChange();	
					}, 500);
				}else if(event.type == "mouseout"){
					clearTimeout(hoverTimer);
				}
			});
		},
		lazyloadImgs:function (urls){
			//动态加载图片。
			var i,img,loaded = 0 ,imgLen = urls.length,self=this;
			for(i=0;i<imgLen;i++){
				img = new Image();
				img.src = urls[i];
				(function(i){
					img.onload = function(){
						if(self.initModel == 1){
							loaded++;
							if(loaded == imgLen){
								self.addAllDom(urls);
								self.startSlide();
							}
						}else{
							if(self.inited == false){
								self.inited = true;
								self.addCircleAndTri();
								self.addImg(urls[i]);
								self.startSlide();
							}else{
								self.addImg(urls[i]);								
							}
						}

					}
					img.onerror = function(){
						if(self.initModel != 1){return;}
						loaded++;
						urls[i] = "error";
						if(loaded == imgLen){
							self.addAllDom(urls);
							self.startSlide();
						}
					}
				})(i);
			}
		},
		addImg:function(url){
			//添加一张轮播图片到最后。
			$(this.DOM).find(".slide-tri").before('<li class="slide-item"><img src="'+url+'"></li>');	
			$(this.DOM).find(".slide-circle").append('<li>•</li>');
			this.urlsLen++;
		},
		setImg:function(){
			//显示当前图片。
			$(this.DOM).find(".slide-item")
			.eq(this.index).addClass('slide-item-active')
			.siblings(".slide-item").removeClass('slide-item-active');
		},
		addAllDom:function(urls){
			//模式一初始化dom。
			var i,imgLen = urls.length,self=this,html="";

			//删除没有加载成功的链接。
			for(i =0 ;i< imgLen;){
				if(urls[i] == 'error'){
					urls.splice(i,1);
					imgLen--;//数组中删除一个元素，长度减1，i不变。
					continue;
				}
				i++;
			}
			this.urlsLen = imgLen + 1;
			for(i=0;i<imgLen;i++){
				html += '<li class="slide-item"><img src="'+urls[i]+'"></li>';
			}
			html+='<ul class="slide-tri"><li class="slide-tri-left"><span></span></li><li class="slide-tri-right"><span></span></li></ul>';
			html+='<ul class="slide-circle"><li class="circle-active">•</li>';
			for(i=0;i<imgLen;i++){
				html += '<li>•</li>';
			}
			html+='</ul>';
			$(this.DOM).append(html);
		},
		addCircleAndTri:function(){
			// 添加左右箭头和小圆点
			var html = '';
			html+='<ul class="slide-tri"><li class="slide-tri-left"><span></span></li><li class="slide-tri-right"><span></span></li></ul>';
			html+='<ul class="slide-circle"><li class="circle-active">•</li></ul>';
			$(this.DOM).append(html);
		},
		circleChange:function(){
			//切换circle小圆点。
			$(this.DOM).find(".slide-circle li").eq(this.index).addClass('circle-active').siblings().removeClass('circle-active');
		},
		addIndex:function(){
			//序号自增。
			this.index++;
			this.index = this.index >= this.urlsLen?0:this.index;
		},
		reduceIndex:function(){
			//序号自减。
			this.index--;
			this.index = this.index <= 0?this.urlsLen-1:this.index;
		},
		setTimer:function(){
			//切换的定时器。
			var self = this;
			this.interval = setInterval(function() {
				self.addIndex();
				self.setImg();
				self.circleChange();
			}, this.TIME);
		},
		clearTimer:function(){
			clearInterval(this.interval);
		}
	}