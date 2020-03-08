/**
 * Created by Shubham Aggarwal on 07-07-2016.
 */

/* init localStorage for saved_data*/
if (!localStorage["saved_data"]) {
    const data = [
        {"id": "12", "name": "Personal Website Link", "linkUrl": "https://name.com"},
        {"id": "9", "name": "Reddit Profile", "linkUrl": "https://reddit.com/username"},
        {"id": "8", "name": "Youtube Channel", "linkUrl": "https://youtube.com/channelName"},
        {"id": "7", "name": "Wordpress website", "linkUrl": "https://username.wordpress.com"},
        {"id": "10", "name": "Contact Number", "linkUrl": "9999999999"},
        {"id": "6", "name": "Yahoo Email Id", "linkUrl": "username@yahoo.com"},
        {"id": "4", "name": "Gmail Email Id", "linkUrl": "username@gmail.com"},
        {"id": "11", "name": "Stackoverflow Profile Link", "linkUrl": "https://stackoverflow.com/username"},
        {"id": "3", "name": "Dropbox Resume Link", "linkUrl": "https://dropbox.com/resume.pdf"},
        {"id": "5", "name": "Github Profile Link", "linkUrl": "https://github.com/username"},
        {"id": "2", "name": "Linkedin Profile Link", "linkUrl": "https://linkedin.con/username"},
        {"id": "1", "name": "Facebook Profile Link", "linkUrl": "https://facebook.com/username"}
    ];
    localStorage.setItem("saved_data", JSON.stringify(data));
}

/*function to init contextMenus */
function initContentMenu() {
    const linksList = JSON.parse(localStorage.getItem("saved_data"));
    if (!linksList.length) {
        chrome.contextMenus.removeAll(() => {
        });
        return;
    }
    for (let link of linksList) {
        chrome.contextMenus.create({
            id: link.id,
            title: link.name,
            contexts: ['editable']
        });
    }
}

initContentMenu();

/* to modify context menu adding , removing , updating */
chrome.runtime.onMessage.addListener(function (response, sender, sendResponse) {
    var resp = response.task;
    if (resp === "saveIt" || resp === "addIt" || resp === "removeIt") {
        chrome.contextMenus.removeAll(function () {
        });
        initContentMenu();
    }
});

/*Onclick listener of context menu saved_links */
chrome.contextMenus.onClicked.addListener((info, tab) => {
    const linksList = JSON.parse(localStorage.getItem('saved_data'));
    for (let link of linksList) {
        if (info.menuItemId === link.name) {
            chrome.tabs.query({
                "currentWindow": true,
                "active": true
            }, function (tabs) {
                chrome.tabs.sendMessage(tabs[0].id, {requestLink: link.linkUrl});
            });
            break;
        }
    }
});



