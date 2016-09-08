/**
 * Created by Shubham Aggarwal on 07-07-2016.
 */

/* init localStorage for saved_data*/

if(! localStorage["saved_data"]) {
    var data = [
        { "Id" : "12" , "Name" : "Personal Website Link" , "Link" : "https://name.com" },
        { "Id" : "9" , "Name" : "Reddit Profile" , "Link" : "https://reddit.com/username" },
        { "Id" : "8"  , "Name" : "Youtube Channel" , "Link" : "https://youtube.com/channelName" },
        { "Id" : "7"  , "Name" : "Wordpress website" , "Link" : "https://username.wordpress.com" },
        { "Id" : "10"  , "Name" : "Contact Number" , "Link" : "9999999999" },
        { "Id" : "6"  , "Name" : "Yahoo Email Id" , "Link" : "username@yahoo.com" },
        { "Id" : "4"  , "Name" : "Gmail Email Id" , "Link" : "username@gmail.com" },
        { "Id" : "11"  , "Name" : "Stackoverflow Profile Link" , "Link" : "https://stackoverflow.com/username" },
        { "Id" : "3"  , "Name" : "Dropbox Resume Link" , "Link" : "https://dropbox.com/resume.pdf" },
        { "Id" : "5"  , "Name" : "Github Profile Link" , "Link" : "https://github.com/username" },
        { "Id" : "2"  , "Name" : "Linkedin Profile Link" , "Link" : "https://linkedin.con/username" },
        { "Id" : "1"  , "Name" : "Facebook Profile Link" , "Link" : "https://facebook.com/username" }
    ];
    localStorage.setItem("saved_data", JSON.stringify(data));
}

/*function to init contextMenus */
function ready_context_menu() {
    var list = JSON.parse(localStorage.getItem("saved_data"));
    if(list.length == 0 ){
        chrome.contextMenus.removeAll(function(){});
        return ;
    }
    for (var i in list) {
        var object = list[i];
        chrome.contextMenus.create({
            id: object["Name"],
            title: object["Name"],
            contexts: ['editable']
        });
    }
}

ready_context_menu();

/* to modify context menu adding , removing , updating */
chrome.runtime.onMessage.addListener( function (response,sender,sendResponse) {
    var resp =response.task;
    if(resp == "saveit" || resp == "addit" || resp == "removeit") {
        chrome.contextMenus.removeAll(function(){});
        ready_context_menu();
    }
});

/*Onclick listener of context menu saved_links */
chrome.contextMenus.onClicked.addListener( function(info, tab) {
    var list = JSON.parse(localStorage.getItem('saved_data'));
    for (var i in list) {
        var object = list[i];
        if (info.menuItemId == object["Name"]) {
            chrome.tabs.query({
                "currentWindow": true,
                "active": true
            }, function (tabs) {
                chrome.tabs.sendMessage(tabs[0].id, {"requested_link": object["Link"]});
            });
            break;
        }
    }
});



