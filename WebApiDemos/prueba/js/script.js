$(document).ready(function(){
	$('#corazon').click(function(){
		$(this).removeAttr('class');
		corazon_time=-1;
		audio('die');
	});
});

function audio(name){
	document.getElementById(name).play();
	console.log(name);
}
function startGame(){
	timeout = 1000;
	points = 0;
	vida = 5;
	max_time=10;
	min_time=5;
	corazon_time =-1;
	Creator();
	Check();
	audio('begin');
	audio('m'+rnd(3,2));
	audio('start');
}

function Creator(){
	if(!$('#corazon').hasClass('active')){
		createObj(rand('X'),rand('Y'));
	}
	if(vida >0){	
		setTimeout(Creator, timeout);	
	}
}
var say = false;
function timerout(){
	if(points<=1500){
		timeout=900;
	}
	else if(points<=2500){
		timeout=800;
		if(!say){audio('wonderful');say=true;}
	}
	else if(points<=3500){
		timeout=700;
		if(say){audio('wonderful');say=false;}
	}
	else if(points<=4500){
		timeout=600;
		if(!say){audio('awesome');say=true;}
	}
	else if(points<=5500){
		timeout=500;
		if(say){audio('awesome');say=false;}
	}
	else if(points<=6500){
		timeout=400;
		if(!say){audio('awesome');say=true;}
	}
	else{
		timeout=300;
	}
}

function Check(){
	if($('#corazon').hasClass('active')){
		var corazon = $('#corazon');
		corazon_time = corazon.attr('time')-1;
		if(corazon_time == 0){
			corazon.removeAttr('class');
			vida = 5;
			corazon_time=-1;
			audio('excellent');
		}
		else
		{
			$('#corazon').attr('time',corazon_time)
		}
	}
	else{
		if(corazon_time == -1){
			corazon_time = rnd(30,10);
		}
		else if(corazon_time == 0){
			$('#corazon').addClass('active').attr('time',rnd(5,3));
			$('body').removeClass('alert');
			audio('line');
			audio('start');
		}
		else
		{
			corazon_time--;
			$.each(object,function( key, value ){
				temp = $($(object).get(key));
				var this_time = temp.attr('time')-1;
				if(this_time == '0'){
					temp.remove();
					object = $('#interface div');
					vida--;
				}
				else
				{
					temp.attr('class',priority(this_time))
					temp.attr('time', this_time);	
				}

			});
		}
		timerout();
		$('#time').html(corazon_time);
		$('body').attr('class','l_'+vida);
			if(corazon_time<2){
				$('body').addClass('alert');
			}
	}
	if(vida >0){
		setTimeout(Check, 1000);
	}
	else{
		audio('die');
		audio('over');
	}
}

function priority(this_time){
	if(this_time < 3){
		return 'important';
	}
	else if(this_time < 5){
		return 'high';
	}
	else if(this_time < 8){
		return 'medium';
	}
	else if(this_time <= 10){
		return 'low';
	}
}

function rand(orient){
	if(orient == 'X')
	{
		return rnd(viewport.width, 40);
	}
	else
	{
		return rnd(viewport.height, 40);
	}
}

function randTime(){
	return rnd(max_time, min_time);
}

function rnd(max,min){
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function createObj(x, y){
	var time = randTime();
	$('#interface').append('<div class="'+priority(time)+'" time = "'+time+'" style="left:'+x+'px;top:'+y+'px;"></div>');
	$('#interface div:last').click(deleteObj);
	object = $('#interface div');
}

function deleteObj(){
	switch($(this).attr('class'))
	{
		case 'low':
			points+=200;
		break;
		case 'medium':
			points+=100;
		break;
		case 'high':
			points+=50;
		break;
		case 'important':
			points+=20;
		break;
	}
	$('#points').html(points);
	$(this).remove();
}