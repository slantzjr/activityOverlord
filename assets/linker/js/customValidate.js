$(document).ready(function(){
		alert("validation loaded");
		console.log("validation loaded");
		$('#form-signin').validate({
			rules:{
				name: {
					required: true
				},
				email: {
					required: true,
					email: true
				}
				password: {
					required: true,
					minlength: 6
				},
				confirmation: {
					required: true,
					equalTo: '#password'
				}
			},
			success function(element){
				element
				.text('OK').addClass('valid')
			}
		});
});