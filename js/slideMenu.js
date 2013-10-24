 $(window).resize(function() {
	$('nav').slideDown();
	if ($(window).width() < 480) {
		$('#banner').click(function(){
			$('nav').slideToggle();
			return false;
		});
	}
});


$('#banner').click(function()  {
                if ($('.menu').css('display')=='none'){
                    $('.menu').css('display', 'block');
                } else {
                    $('.menu').css('display', 'none');
                }
 });
 