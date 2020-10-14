$(document).ready(function(){
	$('body').toggleClass('loaded');

	setTimeout(function(){
        $('body').addClass('loaded');
    }, 1000);
    $('.modal').on('hidden.bs.modal', function(){
    	$('.modal-body input').val('');
    	$('.modal-body option:first').prop('selected',true);
	});
});

  

