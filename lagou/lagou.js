/*   author:ls  
*   email:liusaint@gmail.com
*   time:2016-02-20
*/
$(".demo").bind("mouseenter mouseleave", 
	function(e) { 
		var w = $(this).width(); 
		var h = $(this).height(); 
		var x = (e.pageX - this.offsetLeft - (w / 2)) * (w > h ? (h / w) : 1); 
		var y = (e.pageY - this.offsetTop - (h / 2)) * (h > w ? (w / h) : 1); 
		var direction = Math.round((((Math.atan2(y, x) * (180 / Math.PI)) + 180) / 90) + 3) % 4; 
		var eventType = e.type; 
		//上面判断是从哪个方向进入的代码来自网络。

		toMove = $(this).find(".move");
		if(e.type == 'mouseenter'){ 

			toMove.addClass('no_time');
			switch(direction){
				case 0:
				toMove.css({
					top: '-113px',
					left: '0'
				});
				break;
				case 1:
				toMove.css({
					top: '0',
					left: '113px'
				});
				break;
				case 2:
				toMove.css({
					top: '113px',
					left: '0'
				});
				break;
				case 3:
				toMove.css({
					top: '0',
					left: '-113px'
				});
				break;
			}
			setTimeout(function() {
				toMove.removeClass('no_time');
				toMove.css({
					top: '0',
					left: '0'
				});
			}, 10);
		}else{ 
			toMove.removeClass('no_time');
			switch(direction){
				case 0:
				toMove.css({
					top: '-113px',
					left: '0'
				});
				break;
				case 1:
				toMove.css({
					top: '0',
					left: '113px'
				});
				break;
				case 2:
				toMove.css({
					top: '113px',
					left: '0'
				});
				break;
				case 3:
				toMove.css({
					top: '0',
					left: '-113px'
				});
				break;
			}
		} 
	}); 