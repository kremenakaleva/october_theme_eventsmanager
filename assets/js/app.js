
var documentHasScroll = function() {
    return window.innerHeight <= document.body.offsetHeight;
};


$(document).ready(function() {
	$('#loading_gif').hide();
	var payment = $('#payment_options_field input[name="payment_options[]"]:checked').val();
	if(payment == 'group_invoice'){
		$("#group_invoice_fields").show(300);
	}else{
		$("#group_invoice_fields").hide(200);
	}
	var selectedRegistrationRequest = $('#registration_request_field select').val(); // virtual or physical
	var ticket = $('#discount_options_field select :selected').val();
	if(ticket != 1){
		$("#members_code_field").hide(200);
		$('#ticket_type_message').hide(200);
	}else{
		$("#members_code_field").show(300);
		if(selectedRegistrationRequest == 'physical'){
			$.request('onCheckEarlyBookingDate', {
				data: {},
			}).then(response => {
				if(response.result){
					$('#ticket_type_message').show(300);
				}else{
					$('#ticket_type_message').hide(200);
				}
			});
		}
	}

	$('#accompanying_person_field_container').show(300);

	if(selectedRegistrationRequest == 'virtual'){
		$('#accompanying_person_field_container').hide(200);
		$('#accompanying_person_name_field').hide(200);
		$('.hide_for_virtual').hide(200);
		var newRegistrationType = {
			"-- Choose --": "",
		};

		$.request('onTicketsList', {
			data: {
				type: selectedRegistrationRequest
			},
		}).then(response => {
			$.each( response, function( index, value ) {
				newRegistrationType[value.name + " - " + value.amount + " " + value.currency] = index + 1;
			});
			var $el = $("#discount_options");
			$el.empty(); // remove old options
			$.each(newRegistrationType, function(key,value) {
				$el.append($("<option></option>")
					.attr("value", value)
					.attr("id", 'ticket_'+value)
					.text(key));
			});
		});
	}

	$('#payment_options_field input[name="payment_options[]"]').click(function(){
		var inputValue = $(this).attr("value");
		var targetBox = $("#group_invoice_fields");
		if(inputValue == 'group_invoice'){
			$(targetBox).slideDown(300);
		}else{
			$(targetBox).slideUp(300);
		}
	});

	$('#discount_options_field select[name="discount_options"]').change(function(){
		var inputValue = $(this).val();
		if(inputValue != 1){
			$("#members_code_field").hide(200);
			$('#ticket_type_message').hide(200);
		}else{
			$("#members_code_field").show(300);
			if(selectedRegistrationRequest == 'physical'){
				$.request('onCheckEarlyBookingDate', {
					data: {},
				}).then(response => {
					if(response.result){
						$('#ticket_type_message').show(300);
					}else{
						$('#ticket_type_message').hide(200);
					}
				});
			}

		}
	});

	$('#members_code_field input[name="discount_code"]').keyup(function(){
		var inputValue = $(this).val();
		if(inputValue != '' && $(this).val().length > 2){
			$("#discount_options_field select option").hide();
			$("#discount_options_field select option[id='ticket_1']").show();
			$("#discount_options_field select").val(1);
			$("#discount_options_field select").trigger('change');
		}else{
			$("#discount_options_field select option").show();
		}
	});


	var countryValue = $('#country_field select[name="country"]').val();
	$("#discount_options_field select option").show();
	$("#discount_options_field select option[id='ticket_4']").hide();

	if(countryValue){
		$.request('onCheckLowIncomeCountry', {
			data: {
				country: countryValue
			},
		}).then(response => {
			if(response.result){
				$("#discount_options_field select option").hide();
				$("#discount_options_field select option[id='ticket_4']").show();
				$("#discount_options_field select").val(4);
				$("#members_code_field").hide();
			}else{
				$("#discount_options_field select option").show();
				$("#discount_options_field select option[id='ticket_4']").hide();
				$("#discount_options_field select").val(1);
				$("#members_code_field").show();
			}
		});
	}


	$('#country_field select[name="country"]').change(function(){
		var inputValue = $(this).val();
		$.request('onCheckLowIncomeCountry', {
			data: {
				country: inputValue
			},
		}).then(response => {
			if(response.result){
				// $('#registration_request_field select').trigger('change');
				$("#discount_options_field select option").hide();
				$("#discount_options_field select option[id='ticket_4']").show();
				$("#discount_options_field select").val(4);

				$("#members_code_field").hide();
			}else{
				// $('#registration_request_field select').trigger('change');
				$("#discount_options_field select option").show();
				$("#discount_options_field select option[id='ticket_4']").hide();
				$("#discount_options_field select").val(1);
				$("#members_code_field").show();

			}
		});
	});



	$('#registration_request_field select').change(function(){

		var newOptions = {
			"-- Choose --": "",
		};
		var selected = $(this).val(); // virtual or physical

		$('#accompanying_person_field_container').show(300);
		$('.hide_for_virtual').show(300);

		if($('#accompanying_person_field').is(":checked")) {
			$("#accompanying_person_name_field").show(300);
		} else {
			$("#accompanying_person_name_field").hide(200);
		}

		if(selected == 'virtual'){
			$('#accompanying_person_field_container').hide(200);
			$('#accompanying_person_name_field').hide(200);
			$('.hide_for_virtual').hide(200);
		}
		$.request('onTicketsList', {
			data: {
				type: selected
			},
		}).then(response => {
			$('#country_field select[name="country"]').trigger('change');
			$.each( response, function( index, value ) {
				newOptions[value.name + " - " + value.amount + " " + value.currency] = index + 1;
			});
			var $el = $("#discount_options");
			$el.empty(); // remove old options
			$.each(newOptions, function(key,value) {
				$el.append($("<option></option>")
					.attr("value", value)
					.attr("id", 'ticket_'+value)
					.text(key));
			});
		});
	});


	var accomanyngSelected = $("#accompanying_person_field").is(":checked");

	if(accomanyngSelected){
		$("#accompanying_person_name_field").show();
	}else{
		$("#accompanying_person_name_field").hide();
	}

	$("#accompanying_person_field").click(function() {
		if($(this).is(":checked")) {
			$("#accompanying_person_name_field").show(300);
		} else {
			$("#accompanying_person_name_field").hide(200);
		}
	});


	var helpOthersSelected = $("#help_others_field").is(":checked");

	if(helpOthersSelected){
		$("#help_others_has_invoice_field_container").show();
	}else{
		$("#help_others_has_invoice_field_container").hide();
	}

	$("#help_others_field").click(function() {
		if($(this).is(":checked")) {
			$("#help_others_has_invoice_field_container").show(300);
		} else {
			$("#help_others_has_invoice_field_container").hide(200);
		}
	});

	var helpOthersHasInvoiceSelected = $("#help_others_has_invoice_field").is(":checked");
	var accomanyngHasInvoiceSelected = $("#accompanying_person_has_invoice_field").is(":checked");

	if(helpOthersHasInvoiceSelected || accomanyngHasInvoiceSelected){
		$('input[name=\'payment_options[]\'][value=\'group_invoice\']').trigger('click');
		$('input[name=\'payment_options[]\'][value=\'group_invoice\']').attr('checked', 'checked');
		$('input[name=\'payment_options[]\'][value=\'pay_now\']').attr('disabled', 'disabled');
	}

	$("#help_others_has_invoice_field, #accompanying_person_has_invoice_field").click(function() {
		if($(this).is(":checked") || $('#help_others_has_invoice_field').is(":checked") || $('#accompanying_person_has_invoice_field').is(":checked")) {
			$('input[name=\'payment_options[]\'][value=\'group_invoice\']').trigger('click');
			$('input[name=\'payment_options[]\'][value=\'group_invoice\']').attr('checked', 'checked');
			$('input[name=\'payment_options[]\'][value=\'pay_now\']').attr('disabled', 'disabled');
		} else {
			$('input[name=\'payment_options[]\'][value=\'group_invoice\']').removeAttr('checked');
			$('input[name=\'payment_options[]\'][value=\'pay_now\']').removeAttr('disabled');
		}
	});

	// check discount code

	var discountCode = $("#discount_code").val();

	if(discountCode != '' && !(typeof discountCode === 'undefined')){
		$.request('onDiscountCodeValidate', {
			data: {
				code: discountCode
			},
		}).then(response => {
			if(response.err){
				$('#discount_code_err_message').text(response.err);
				$('#discount_code_success_message').text('');
			}

			if(response.result){
				$('#discount_code_err_message').text('');
				var successMsg = '<b>' + response.result.value + ' ' + response.result.type + '</b>  discount will be applied'
				$('#discount_code_success_message').html(successMsg);
			}
		});
	}


	$("#discount_code").blur(function() {
		var discountCode = $(this).val();
		$('#discount_code_err_message').text('');
		$('#discount_code_success_message').text('');
		if(discountCode != ''){
			$.request('onDiscountCodeValidate', {
				data: {
					code: discountCode
				},
			}).then(response => {
				if(response.err){
					$('#discount_code_err_message').text(response.err);
					$('#discount_code_success_message').text('');
				}

				if(response.result){
					$('#discount_code_err_message').text('');
					var successMsg = '<b>' + response.result.value + ' ' + response.result.type + '</b>  discount will be applied'
					$('#discount_code_success_message').html(successMsg);
				}
			});
		}
	});

});


function proccedToPayment(ID){
	$('#loading_gif').show();
	$.request('onPaymentProceed', {
		data: {
			ID: ID
		},
	}).then(response => {
		$('#loading_gif').hide();
	});
}

function finishRegistration(ID){
	$('#loading_gif').show();
	$.request('onFinishRegistration', {
		data: {
			ID: ID
		}
	}).then(response => {
		$('#loading_gif').hide();
	});
}



function encodeURIObject(data){
    return Object.keys(data).map(function (i) {
        return encodeURIComponent(i) + '=' + encodeURIComponent(data[i])
    }).join('&');
}

function appendProfile() {
    $(document).on('profile', function (e) {
        var headerNavbarNav = $('#headerNavbarNav');
        var li = '<li class="nav-item"><a href="/profile" target = "_self">Profile</a></li >';
        headerNavbarNav.find('>ul').append(li);
    });
}
function appendSignIn(){
    $(document).on('signin', function (e) {
        var headerNavbarLogin = $('#headerNavbarNav');
        var li = '<li class="nav-item sign-in"><a href="/login" data-request-data="redirect: \'/profile\'">Login</a></li >';
		headerNavbarLogin.find('>ul').append(li);
		var menu = $('#menuToggle');
		menu.find('>ul').append(li);
    });
}

function appendSignOut() {
    $(document).on('signout', function (e) {
        var headerNavbarNav = $('#headerNavbarNav');
        var li = '<li class="nav-item  sign-in"><a href="javascript:void(0);" data-request="onLogout" data-request-data="redirect: \'/\'">Logout</a></li >';
        headerNavbarNav.find('>ul').append(li);
		var menu = $('#menuToggle');
		menu.find('>ul').append(li);
    });
}

// function initAccordeon(pElem) {
// 	$('body').on('click', '.accordion-toggle', function () {
// 		if ($(this).next(".accordion-content").is(':visible')) {
// 			$(this).next(".accordion-content").slideUp(300);
// 			$(this).children(".plusminus").html('<span class="plus"></span>');
// 		} else {
// 			$(this).next(".accordion-content").slideDown(300);
// 			$(this).children(".plusminus").html('<span class="minus"></span>');
// 		}
// 	});
// }

function isBreakpointLarge() {
    return window.innerWidth <= 991;
}

function init() {
    appendProfile()
    appendSignIn()
    appendSignOut()
}



function onExportTDWGAttendees() {
	var checked  = $("input[name=attendee]:checked");
	var data = [];
	var eventId = null;

	$.each(checked, function(){
		data.push($(this).data("id"));
		eventId = $(this).data("eventid");
	});

	$.request('onExportTDWGAttendees', {
		data: {
			'attendee_ids': data,
			'event_id': eventId,
		},
	})
		.then(function(result, status, xmlHeaderRequest) {
			// The actual download
			var bin = window.atob(result['data']);
			var ab = s2ab(bin);
			var blob = new Blob([ab], {
				type: xmlHeaderRequest.getResponseHeader('Content-Type')
			});
			var url = window.URL || window.webkitURL;
			var link = document.createElement('a');
			link.href = url.createObjectURL(blob);
			link.download = 'export_attendees.xlsx';

			document.body.appendChild(link);

			link.click();
			document.body.removeChild(link);
		});
}


init()
