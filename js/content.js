/**
 * Created by Shubham Aggarwal on 05-07-2016.
 */
var clicked_element = null ;

document.addEventListener("contextmenu", function(event){
    clicked_element = event.target;
});

var input_types = [
    "text",
    "url",
    "search",
    "tel",
    "password",
    "email",
    "tel"
];

function getCaretPosition(element){
    var caretPos = 0;
    if($.inArray(element.type, input_types) >= 0){
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
        console.log("test");
        var caretposition = getCaretPosition(clicked_element);
        var initvalue = clicked_element.value ;
        clicked_element.value = response["requested_link"];
        var first_part = initvalue.substr(0,caretposition);
        var last_part = initvalue.substr(caretposition);
        clicked_element.value =  first_part + response.requested_link +last_part ;
    });
});