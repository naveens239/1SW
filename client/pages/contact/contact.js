'use strict';
$(function () {
    $('input[type=submit]').click(contact);
});

function contact(e) {
    var constraints = {
        name: {presence:true},
        email:{ email:true },
        phone: { presence:true },
        subject: { presence:true },
        message: { presence:true }
    };
    var formData = commonModule.form_to_object($('form[name=contactForm]'));
    var errors = validate(formData, constraints, {flatten:true});
    if(errors){
        alert(errors.join('\n'));
        return false;
    }

    $.post("api/contact", formData, function (saved) {
        //TODO: check why alert is not working in server; but works locally
        if(saved){
            alert('Thanks for contacting. Your message is saved.');
        }
    });
    e.preventDefault();
    return true;
}