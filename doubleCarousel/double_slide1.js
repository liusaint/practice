/*   author:ls  
 *   email:liusaint@gmail.com
 *   time:2016-03-19
 */

//考虑每个类型图片数量不一致的情况。

function DoubleSlide(){
	this.imgNum = 0;
	this.index = 0;//图片的序号
	this.menuIndex = 0;//菜单一的序号
	this.menuIndex1 = 0;//菜单二的序号。
	this.lenArr = [];//记录每种类型的长度。即每个上面的菜单有几个右边菜单项。
	this.imgArr = imgArr;
	this.interval;
	this.TIME = 3000;
	this.DOM;
}

//初始化方法。dom方法。事件方法。数据方法。定时器方法。
DoubleSlide.prototype = {
	init:function(config){
		//初始化
		this.DOM = config.DOM || '.slide-wrap';
		this.TIME = config.TIME || 3000;
		this.imgArr = config.imgArr || [];

		this.createImgs(this.imgArr);
		this.createMenu(this.imgArr);
		this.createMenu1(this.imgArr,0);
		this.menuEvent();
		this.menuEvent1();
		this.setTimer();
	},
	createImgs:function(imgArr){
		//根据传入的数组生成图片列表。
		var i,j,len = imgArr.length,len1,html="";
		for(i = 0;i<len;i++){
			len1 = imgArr[i].data.length;
			this.lenArr.push(len1);
			for(j=0,len1=imgArr[i].data.length;j<len1;j++){
				if(j == 0 && i == 0){
					html+=('<img class="active" src="images/'+imgArr[i].data[j].src+'">');
				}else{
					html+=('<img src="images/'+imgArr[i].data[j].src+'">');
				}						
				this.imgNum++;
			}
		}
		$(this.DOM +" .imgs-wrap").append(html);
	},
	createMenu:function(imgArr){
		//根据传入的数组生成上边的菜单。
		var i,len = imgArr.length,html='';
		for(i = 0;i<len;i++){
			if(i == 0){
				html+= ('<li class="active">'+ imgArr[i].type+'</li>');
			}else{
				html+= ('<li>'+ imgArr[i].type+'</li>');
			}					
		}				
		$(this.DOM + " .menu").append(html);
	},
	createMenu1:function(imgArr,i){
		//根据传入的数组生成右边的菜单。
		var j,len1,html="";
		for(j=0,len1=imgArr[i].data.length;j<len1;j++){
			if(j == 0){
				html+=('<li class="active">'+ imgArr[i].data[j].name +'</li>');
			}else{
				html+=('<li>'+ imgArr[i].data[j].name +'</li>');
			}

		}				
		$(this.DOM + " .menu1").html(html);
	},
	changeImg:function(){
		//变化图片。
		$(this.DOM + " .imgs-wrap .active").removeClass('active');
		$(this.DOM + " .imgs-wrap img").eq(this.index).addClass('active');
		//变化菜单。
		$(this.DOM + " .menu li").eq(this.menuIndex).addClass('active').siblings().removeClass('active');
		$(this.DOM + " .menu1 li").eq(this.menuIndex1).addClass('active').siblings().removeClass('active');
	},
	addIndex:function(){
		//序号自增。
		this.index++;
		this.index = this.index >= this.imgNum?0:this.index;
	},
	setMenuIndex:function(index){
		//根据图片index设置菜单一和菜单二的index。
		index = index || this.index;
		var lenArr = this.lenArr;
		index ++;//比索引多1。
		var i,len = lenArr.length,sum=0,item;
		for(i=0;i<len;i++){
			item = index - sum;
			sum += lenArr[i];
			if(index - sum <= 0){
				this.menuIndex = i;
				this.menuIndex1 = item-1;
				break;
			}
		}
	},
	setImgIndex:function(x,y){
		//根据菜单一和菜单二的index设置图片index
		var MIndex = x || this.menuIndex;
		var MIndex1 = y || this.menuIndex1;
		var lenArr = this.lenArr;

		var i;
		var sum  = MIndex1;
		for(i=1;i<=MIndex;i++){
			sum = sum + lenArr[MIndex - 1];
		}
		this.index = sum;
	},
	menuEvent:function(){
		//上面菜单的点击事件。
		var self = this;
		$(document).on('click', this.DOM + ' .menu li', function(event) {					
			if(!$(this).hasClass("active")){
				var img_index = $(this).index();
				self.menuIndex = img_index;
				self.menuIndex1 = 0;
				self.setImgIndex();
				self.createMenu1(self.imgArr,img_index);	
				self.changeImg();
				self.clearTimer();
				self.setTimer();
			}
		});
	},
	menuEvent1:function(){
		//右边菜单的点击事件。
		var self = this;
		$(document).on('click', this.DOM + '.menu1 li', function(event) {
			if(!$(this).hasClass("active")){
				self.menuIndex1 = $(this).index();
				self.setImgIndex();
				self.changeImg();
				self.clearTimer();
				self.setTimer();
			}
		});
	},
	setTimer:function(){
		//设置定时器。
		var self = this;
		this.interval = setInterval(function() {
			var oldMenuIndex = self.menuIndex;
			self.addIndex();
			self.setMenuIndex();
			var newMenuIndex = self.menuIndex;
			if(newMenuIndex != oldMenuIndex){
				self.createMenu1(self.imgArr,self.menuIndex);
			}
			self.changeImg();
		}, this.TIME);
	},
	clearTimer:function(){
		clearInterval(this.interval);
	}
}