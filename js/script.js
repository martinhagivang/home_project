$(function(){
	$('.container').hide
	$('.container').slideDown("slow"); 
	$('h2').click(function(){
			$(this).next().slideToggle();
			return false;
	});
}); 

