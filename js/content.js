/**
 * Created by Shubham Aggarwal on 05-07-2016.
 */
var element = null ;
var element_id = null;
var element_aria_label = null;

document.addEventListener("contextmenu", function(event){
    element = event.target;
    element_id = $(event.target).attr('id');
    element_aria_label = $(event.target).attr('aria-label');
});

var types = [
    "text",
    "url",
    "search",
    "tel",
    "password",
    "email",
    "number",
    "textarea"
];

function getCaretPosition(element){
    var caretPos = 0;

    /* Chrome and Firefox support */
    if(!document.selection && $.inArray(element.type, types) >= 0){
        /*  element.selectionStart for type email give error because their is a bug in chrome */
        if( element.type == 'email' || element.type == 'number' ){
            caretPos = 0 ;
        }else{
            caretPos = element.selectionStart;
        }
    }
    else {
        /* IE support */
        if(document.selection){
            element.focus();
            var sel = document.selection.createRange();
            sel.moveStart('character', -element.value.length);
            caretPos = sel.text.length;
        }
    }
    return caretPos;
}

$(document).ready(function (){

    chrome.runtime.onMessage.addListener( function (response , sender , sendResponse) {
        var caretposition = getCaretPosition(element);
        var initvalue = element.value ;
        var set_value =  response.requested_link;
        var first_part = initvalue.substr(0, caretposition);
        var last_part = initvalue.substr(caretposition);

        /* when element type is email or number */
        if(element.type == 'email' || element.type == 'number') {
            if(element_id) {
                $("#" + element_id).sendkeys(set_value + last_part);
            }else if(element_aria_label){
                $("[aria-label='"+element_aria_label+"']").sendkeys(set_value + last_part);
            }else{
                element.value = first_part + set_value + last_part ;
            }
        }else {
            /* when element type is other than email or number */
            
            /* selected text in input field */
            var selected_text = element.value.substring(element.selectionStart, element.selectionEnd);
            
            /* if  text selected */
            if (selected_text != '') {
                last_part = initvalue.substr(caretposition + selected_text.length);
            }
            
            element.value = first_part + set_value.substr(0, set_value.length - 1);
            if (element_id) {
                $("#" + element_id).sendkeys(set_value.substr(set_value.length - 1));
            } else if (element_aria_label) {
                $("[aria-label='" + element_aria_label + "']").sendkeys(set_value.substr(set_value.length - 1));
            } else {
                element.value += set_value.substr(set_value.length - 1);
            }
            element.value += last_part;
        }
    });
});