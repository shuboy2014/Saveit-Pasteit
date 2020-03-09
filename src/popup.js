/**
 * Created by Shubham Aggarwal on 04-07-2016.
 */

/* BoilerPlate icons id as index */
const id_to_image = {
    "1": "facebook-square",
    "2": "linkedin-square",
    "3": "dropbox",
    "4": "envelope",
    "5": "github-alt",
    "6": "yahoo",
    "7": "wordpress",
    "8": "youtube-square",
    "9": "reddit",
    "10": "mobile",
    "11": "stack-overflow",
    "12": "hand-o-right",
    "13": "play-circle",
    "14": "skype",
    "15": "google-plus-official",
    "16": "twitter",
    "17": "instagram",
    "18": "whatsapp",
    "19": "slack",
    "20": "pinterest",
    "21": "th-large",
    "22": "align-left"
};

$('document').ready(function () {

    (() => {
        $('.saved-links-container').slimScroll({
            height: '400px',
            alwaysVisible: true,
            color: '#34495E'
        });


        const linksList = JSON.parse(localStorage.getItem("saved_data"));
        linksList.reverse();
        for (let link of linksList) {
            const elementHtml = `
                <div class="container-fluid" id="${link.id + "-div"}">
                    <p><strong id="${link.id}-name">${link.name}</strong></p>
                    <div class="saved-input-box">
                        <span><i class="fa fa-${link.icon} fa-2x"></i></span>
                        <input type="text" class="form-control" id="${link.id}-url" value="${link.linkUrl}" autocomplete="off" spellcheck="false">
                        <button type="button"><span class="copytext" id="${link.id}-copy"><i class="fa fa-clipboard"></i></span></button>
                        <button type="button"><span  class="remove" id="${link.id}-btn"><i class="fa fa-times"></i></span></button>
                     </div>
                     <br>
                </div>
            `;
            $('.saved-links-container').append(elementHtml);
        }
    })();

    function getNewId(linksList) {
        let maxId = 0;
        for (const link of linksList) {
            if (link.id > maxId) {
                maxId = link.id;
            }
        }

        return maxId + 1;
    }

    function getLinkIcon() {
        const classAttr = $('#new-link-i').attr('class');
        return classAttr.slice(6, classAttr.length - 19);
    }

    function copyTextToClipboard(text) {
        const copyFrom = $('<textarea/>');
        copyFrom.text(text);
        $('body').append(copyFrom);
        copyFrom.select();
        document.execCommand('copy');
        copyFrom.remove();
    }

    function removeLink() {
        const elementId = this.id;
        const linkId = elementId.substr(0, elementId.length - 4); // block id = '${linkId}-btn'
        const linksList = JSON.parse(localStorage["saved_data"]);
        for (let index in linksList) {
            if (linksList[index].id.toString() === linkId) {
                linksList.splice(parseInt(index, 10), 1);
            }
        }
        localStorage.setItem("saved_data", JSON.stringify(linksList));
        $(`#${linkId}-div`).remove();
        chrome.runtime.sendMessage({"task": "removeIt"});
    }

    function copyLink() {
        const elementId = this.id;
        const linkId = elementId.substr(0, elementId.length - 5); // block id = '${linkId}-copy'
        const linkUrl = document.getElementById(`${linkId}-url`).value;
        const linkName = document.getElementById(`${linkId}-name`).innerText;
        document.getElementById('message').innerHTML = `${linkName} copied`;
        copyTextToClipboard(linkUrl);
        $('#myModal').modal('show');
    }

    function saveNewLink() {
        const linkName = $('input[name="new-name"]').val();
        const linkUrl = $('input[name="new-link"]').val();
        if (linkName && linkUrl) {
            const linksList = JSON.parse(localStorage.getItem("saved_data"));
            const newLink = {"id": getNewId(linksList), icon: getLinkIcon(), name: linkName, linkUrl: linkUrl};
            linksList.push(newLink);
            localStorage.clear();
            localStorage.setItem('saved_data', JSON.stringify(linksList));
            chrome.runtime.sendMessage({"task": "addIt"});
        } else {
            alert('Please Enter both Information Name and Information!');
        }
    }

    $('.change-image').on("click", function () {
        $('#new-name-i').attr("class", "fa fa-" + id_to_image[this.id] + " fa-2x change-image");
        $('#new-link-i').attr("class", "fa fa-" + id_to_image[this.id] + " fa-2x change-image");
    });

    $('#save-add-another').on("click", function () {
        saveNewLink();
        document.getElementById('new-name-input').value = "";
        document.getElementById('new-link-input').value = "";
        $("#new-info-form-modal").modal('show');
    });

    $('#add-new-information-btn').on('click', function () {
        document.getElementById('new-name-input').value = "";
        document.getElementById('new-link-input').value = "";
        $('#new-info-form-modal').modal('show');
    });

    $('#cancel').on("click", function () {
        $('#new-info-form-modal').modal('hide');
    });

    $('.remove').on("click", removeLink);

    $('.copytext').on('click', copyLink);

    $('#save').on("click", function () {
        saveNewLink();
    });

    $('#saveit-btn').on("click", function () {
        const save_btn = $('#saveit-btn');
        save_btn.prop('disabled', true);
        const linksList = JSON.parse(localStorage["saved_data"]);

        for (let link of linksList) {
            const elem = document.getElementById(link.name);
            if (elem && elem.value === '') {
                alert("Oops ," + link.name + " information is not filled!!");
                save_btn.html("SaveIt");
                save_btn.prop('disabled', false);
                return;
            }
        }

        for (let link of linksList) {
            const elem = document.getElementById(link.name);
            if (elem) {
                link.linkUrl = elem.value;
            }
        }

        localStorage.clear();
        localStorage.setItem("saved_data", JSON.stringify(linksList));
        chrome.runtime.sendMessage({"task": "saveit"});
        save_btn.prop('disabled', false);
        document.getElementById('message').innerHTML = ' Saved Successfully ';
        $('#myModal').modal('show');
    });
});
