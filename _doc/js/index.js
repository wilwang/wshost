$(document).ready(function() {
  $('button.try').click(function(e) {
  	e.preventDefault();

  	var params = {};
  	$(this).closest('form').find('input[name]').each(function(index, element) {
  	  params[$(element).attr('name')] = $(element).val();
  	});

  	var url = '/'+params.name;
  	for (var param in params) {
      if (param != 'name') {
  	   url += '/'+params[param];
  	  }
  	}

  	$.get(url, function(result) {
  	  alert(result);
  	});
  });

  $('button.clear').click(function(e) {
  	e.preventDefault();

	$(this).closest('form').find('input[name]').each(function(index, element) {
	  if ($(element).attr('name') != 'name') {
  	    $(element).val('');
  	  }
  	});  	
  })
});