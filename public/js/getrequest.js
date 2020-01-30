$( document ).ready( () => {
	
	var url = window.location;
	
	// GET REQUEST
	$("#btnGetFiles").click( (event) => {
		event.preventDefault();
		
	});
	//ajaxGet();
	// DO GET
	function ajaxGet(){
		$.ajax({
			type : "GET",
			url : "/files",
			success: (data) => {
				$("#listFiles").html("");
				$("#listFiles").append('<ul>');
				$.each(data, (index, filename) => {
					$("#listFiles").append('<li><a href=' + url + 'files/' + filename +'>' + filename + '</a></li>');
				});
				$("#listFiles").append('</ul>');
				$('.custom-file-label').html('');
			},
			error : (err) => {
				$("#listFiles").html(err.responseText);
			}
		});	
	}
})