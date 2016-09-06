/**
 * Created by Shubham Aggarwal on 07-07-2016.
 */

/* init localStorage for saved_data*/

if(! localStorage["saved_data"]) {
    var links = [
        {"name":'Personal Website Link',"link":'https://www.******.com'},
        {"name":'Facebook Profile Link',"link":'https://www.facebook.com/username'},
        {"name":'Linkedin Profile Link',"link":'https://www.linkedin.com/username'},
        {"name":'Email Address', "link" : 'username@domain.com'}
    ];
    localStorage.setItem("saved_data", JSON.stringify(links));
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
            id: object["name"],
            title: object["name"],
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
        if (info.menuItemId == object["name"]) {
            chrome.tabs.query({
                "currentWindow": true,
                "active": true
            }, function (tabs) {
                chrome.tabs.sendMessage(tabs[0].id, {"requested_link": object["link"]});
            });
            break;
        }
    }
});



