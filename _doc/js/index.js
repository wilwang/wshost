$(document).ready(function() {
  $('button.try').click(function(e) {
  	e.preventDefault();

  	var params = {};
		var queryparams = '?';
  	$(this).closest('form').find('input[name]').each(function(index, element) {
			if ($(element).attr('qs') === 'true') {
				if ($(element).val() != '') {
					queryparams += $(element).attr('name') + '=' + escape($(element).val()) + '&';
				}
			} else {
			  params[$(element).attr('name')] = {
					value: $(element).val()
				}
			}
  	});

  	var url = '/'+params.name.value;
  	for (var param in params) {
      if (param != 'name') {
  	   url += '/'+params[param].value;
  	  }
  	}
		url += queryparams;

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
