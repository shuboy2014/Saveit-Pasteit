/**
 * Created by Shubham Aggarwal on 05-07-2016.
 */
var element = null ;

document.addEventListener("contextmenu", function(event){
    element = event.target;
});

var input_types = [
    "text",
    "url",
    "search",
    "tel",
    "password",
    "email",
    "number"
];


function getCaretPosition(element){
    var caretPos = 0;
    if($.inArray(element.type, input_types) >= 0){
        /*  element.selectionStart for type email give error because their is bug in chrome */
        if( element.type == 'email' || element.type == 'number' ){
            return 0;
        }
        caretPos = element.selectionStart;
    }
    else {
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
        var first_part = initvalue.substr(0, caretposition);
        var last_part = initvalue.substr(caretposition);
        if(element.type == 'email' || element.type =='number'){
            element.value = response.requested_link + initvalue;
        } else {
            var selected_text = element.value.substring(element.selectionStart, element.selectionEnd);
            if ( selected_text != ''){
                last_part = initvalue.substr(caretposition + selected_text.length);
            }
            element.value = first_part + response.requested_link + last_part;
        }
    });

});