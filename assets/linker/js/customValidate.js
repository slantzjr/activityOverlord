
$(document).ready(function(){
		
		$('#sign-up-form').validate({
			rules:{
				name: {
					required: true
				},
				email: {
					required: true,
					email: true
				},
				password: {
					minlength: 6,
					required: true
				},
				confirmation: {
					required: true,
					equalTo: '#password'
				}
			},
			success: function(element){
				element
				.text('OK').addClass('valid')
			}
		});
});