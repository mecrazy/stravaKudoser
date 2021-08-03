javascript:(function(func){

var jqVer={"$":{"full":"","sep":[],"match":false},"jQuery":{"full":"","sep":[],"match":false}};
if(typeof($)!='undefined'){jqVer.$.full=$().jquery}
if(typeof(jQuery)!='undefined'){jqVer.jQuery.full=jQuery().jquery}
var tempMatch=jqVer.$.full.match(/^([0-9]+)\.([0-9]+)\.([0-9]+)$/);
if(tempMatch!=null){jqVer.$.match=true;jqVer.$.sep.push(Number(tempMatch[1]));jqVer.$.sep.push(Number(tempMatch[2]));jqVer.$.sep.push(Number(tempMatch[3]))}
tempMatch=jqVer.jQuery.full.match(/^([0-9]+)\.([0-9]+)\.([0-9]+)$/);
if(tempMatch!=null){jqVer.jQuery.match=true;jqVer.jQuery.sep.push(Number(tempMatch[1]));jqVer.jQuery.sep.push(Number(tempMatch[2]));jqVer.jQuery.sep.push(Number(tempMatch[3]))}

var newJQ=true;
if(jqVer.$.match||jqVer.jQuery.match){
	if(jqVer.$.match){
		if(jqVer.$.sep[0]>=2){
			if(jqVer.$.sep[1]>=1){
				newJQ=false;
				func($)
			}
		}
	}
	if(newJQ){
		if(jqVer.jQuery.match){
			if(jqVer.jQuery.sep[0]>=2){
				if(jqVer.jQuery.sep[1]>=1){
					newJQ=false;
					func(jQuery)
				}
			}
		}
	}
}
if(newJQ){
	var scr=document.createElement("script");scr.src="//ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js";
	scr.onload=function(){func(jQuery.noConflict(true))};
	document.body.appendChild(scr)
}

})
(function($){

var style ='<style type="text/css" id="cutsom_style_wxyz">';
style+='#btn_outer_wxyz{display:none;padding:0px 5px;box-shadow:-3px 6px 5px;width:auto;height:auto;z-index:9999;position:fixed;top:60px;right:5px;background-color:#ffffff;text-align-right;border-radius:4px;}';
style+='.btn_wxyz{margin:8px 5px;display:inline-block;padding:1px 5px;border-style:solid;border-width:1px;border-radius:4px;box-shadow:inset 0 1px 0 rgba(255,255,255,0.2);text-shadow:0 1px 0 rgba(0,0,0,0.2);cursor:pointer;}';
style+='.btn_wxyz:hover{background-color:#eaeaea;}';
style+='</style>';

var lang=detectLang();
var strings={
	"en":{"btnAll":"Kudos for all","btnActivity":"Kudos only for activities","btnPost":"Kudos only for posts","btnClose":"CLOSE","chkScroll":"Auto scroll"},
	"ja":{"btnAll":"全てにスゴイする","btnActivity":"アクティビティのみにスゴイする","btnPost":"投稿のみにスゴイする","btnClose":"閉じる","chkScroll":"自動スクロール"},
	"ru":{"btnAll":"Престижность для всех","btnActivity":"Престижность только для занятий","btnPost":"Престижность только для должности","btnClose":"ЗАКРЫТЬ","chkScroll":"Автопрокрутка"},
	"zh":{"btnAll":"感谢大家","btnActivity":"荣誉只为活动","btnPost":"荣誉仅限于帖子","btnClose":"关","chkScroll":"自动滚屏"},
};

if($('#cutsom_style_wxyz').length>0){$('#cutsom_style_wxyz').remove()}
$('head').append(style);

$(document).on('click','.btn_wxyz',function(){
	var mode=$(this).attr('data-mode');
	var autoScroll=$('#chk_wxyz_auto').prop('checked');
	if((mode=='all')||(mode=='activity')||(mode=='post')){
		if(autoScroll){
			funcAutoScroll(mode);
		}else{
			mainFunc(mode);
		}
	}else if(mode=='close'){
		$('#btn_outer_wxyz').fadeOut(function(){
			$(this).remove();
			$('#cutsom_style_wxyz').remove();
			$(document).off('click','.btn_wxyz');
		})
	}
});

function mainFunc(mode){
	if(mode=='all'){
		$(".react-card-container > div[data-react-class='Activity'],.react-card-container > div[data-react-class='Post']").find("button[data-testid='kudos_button']").
		filter(function(){
			return $(this).find('svg').attr('data-testid') != 'filled_kudos';
		}).each(function(){$(this).trigger('click')});
	}else if(mode=='activity'){
		$(".react-card-container > div[data-react-class='Activity']").find("button[data-testid='kudos_button']").
		filter(function(){
			return $(this).find('svg').attr('data-testid') != 'filled_kudos';
		}).each(function(){$(this).trigger('click')});
	}else if(mode=='post'){
		$(".react-card-container > div[data-react-class='Post']").find("button[data-testid='kudos_button']").
		filter(function(){
			return $(this).find('svg').attr('data-testid') != 'filled_kudos';
		}).each(function(){$(this).trigger('click')});
	}	
}


var scrollDetection={detecting:false,pos:0,mode:''};

$(window).on('scroll',function(){
	if(scrollDetection.detecting){
		if(($('html').scrollTop()+window.innerHeight)>=(scrollDetection.pos-20)){
			scrollDetection.detecting=false;
			detectLoaded({count:0,loop:true,mode:scrollDetection.mode});
		}
	}
});

function funcAutoScroll(mode){
	scrollDetection.detecting=true;
	scrollDetection.pos=$(document).height();
	scrollDetection.mode=mode;
	$('html').animate({scrollTop:scrollDetection.pos},'fast');
}

function detectLoaded(io){
	if(io.loop){
		io.count++;
		setTimeout(function(){
			io.loop=$('.load-feed').eq(0).hasClass('loading-more');
			detectLoaded(io);
		},250);
	}else{
		afterLoaded(io);
	}
}

function afterLoaded(io){
	var alreadyPushed=0;
	if(io.mode=='all'){
		alreadyPushed=$('.feed-entry.activity,.feed-entry.post').find('.media-actions').find('button.js-view-kudos').length;
	}else if(io.mode=='activity'){
		alreadyPushed=$('.feed-entry.activity').find('.media-actions').find('button.js-view-kudos').length;
	}else if(io.mode=='post'){
		alreadyPushed=$('.feed-entry.post').find('.media-actions').find('button.js-view-kudos').length;
	}	
	if(alreadyPushed>0){
		$('html').animate({scrollTop:0},'fast',function(){
			mainFunc(io.mode);
		});
	}else{
		funcAutoScroll(io.mode)
	}
}

var btnSrc='';
btnSrc+='&nbsp;<label><input id="chk_wxyz_auto" type="checkbox" name="chk_wxyz" checked>&nbsp;'+strings[lang].chkScroll+'</label>&nbsp;';
btnSrc+='<button class="btn_wxyz" data-mode="all">'+strings[lang].btnAll+'</button>';
btnSrc+='<button class="btn_wxyz" data-mode="activity">'+strings[lang].btnActivity+'</button>';
btnSrc+='<button class="btn_wxyz" data-mode="post">'+strings[lang].btnPost+'</button>';
btnSrc+='<button class="btn_wxyz" data-mode="close">'+strings[lang].btnClose+'</button>';

$('body').append($('<div>').attr({'id':'btn_outer_wxyz'}).append(btnSrc)).eq(0).each(function(){$('#btn_outer_wxyz').fadeIn()});

function detectLang(){
	var lang=(window.navigator.languages&&window.navigator.languages[0])||
		window.navigator.language||
		window.navigator.userLanguage||
		window.navigator.browserLanguage;
	if(lang.match(/^ja(\-[a-zA-Z]+)?/i)){
		lang='ja'
	}else if(lang.match(/^ru(\-[a-zA-Z]+)?/i)){
		lang='ru'
	}else if(lang.match(/^zh(\-[a-zA-Z]+)?/i)){
		lang='zh'
	}else{
		lang='en'
	}
	return lang
}

});
