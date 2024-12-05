$("#staff-section").css({display: 'block'});
$("#field-section").css({display: 'none'});

$("#staff-btn").on('click', () => {
    $("#staff-section").css({display: 'block'});
    $("#field-section").css({display: 'none'});

});

$("#field-btn").on('click', () => {
    $("#staff-section").css({display: 'none'});
    $("#field-section").css({display: 'block'});

});