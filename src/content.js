/**
 * Created by Shubham Aggarwal on 05-07-2016.
 */
let element = null;
let elementId = null;
let elementAriaLabel = null;

document.addEventListener("contextmenu", function (event) {
    element = event.target;
    elementId = $(event.target).attr('id');
    elementAriaLabel = $(event.target).attr('aria-label');
});

const types = [
    "text",
    "url",
    "search",
    "tel",
    "password",
    "email",
    "number",
    "textarea"
];

function getCaretPosition(element) {
    let caretPos = 0;

    /* Chrome and Firefox support */
    if (!document.selection && $.inArray(element.type, types) >= 0) {
        //  element.selectionStart for type email give error because their is a bug in chrome
        if (element.type === 'email' || element.type === 'number') {
            caretPos = 0;
        } else {
            caretPos = element.selectionStart;
        }
    } else {
        // IE support
        if (document.selection) {
            element.focus();
            let sel = document.selection.createRange();
            sel.moveStart('character', -element.value.length);
            caretPos = sel.text.length;
        }
    }
    return caretPos;
}

$(document).ready(function () {
    chrome.runtime.onMessage.addListener((response, sender, sendResponse) => {
        let caretPosition = getCaretPosition(element);
        let initValue = element.value;
        let setValue = response.requestLink;
        let firstPart = initValue.substr(0, caretPosition);
        let lastPart = initValue.substr(caretPosition);

        // when element type is email or number
        if (element.type === 'email' || element.type === 'number') {
            if (elementId) {
                $("#" + elementId).sendkeys(setValue + lastPart);
            } else if (elementAriaLabel) {
                $("[aria-label='" + elementAriaLabel + "']").sendkeys(setValue + lastPart);
            } else {
                element.value = firstPart + setValue + lastPart;
            }
        } else {
            // when element type is other than email or number

            // selected text in input field
            let selected_text = element.value.substring(element.selectionStart, element.selectionEnd);

            // if text selected
            if (selected_text !== '') {
                lastPart = initValue.substr(caretPosition + selected_text.length);
            }

            element.value = firstPart + setValue.substr(0, setValue.length - 1);
            if (elementId) {
                $("#" + elementId).sendkeys(setValue.substr(setValue.length - 1));
            } else if (elementAriaLabel) {
                $("[aria-label='" + elementAriaLabel + "']").sendkeys(setValue.substr(setValue.length - 1));
            } else {
                element.value += setValue.substr(setValue.length - 1);
            }
            element.value += lastPart;
        }
    });
});
