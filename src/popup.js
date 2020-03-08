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

const image_to_id = {
    "facebook-square": "1",
    "linkedin-square": "2",
    "dropbox": "3",
    "envelope": "4",
    "github-alt": "5",
    "yahoo": "6",
    "wordpress": "7",
    "youtube-square": "8",
    "reddit": "9",
    "mobile": "10",
    "stack-overflow": "11",
    "hand-o-right": "12",
    "play-circle": "13",
    "skype": "14",
    "google-plus-official": "15",
    "twitter": "16",
    "instagram": "17",
    "whatsapp": "18",
    "slack": "19",
    "pinterest": "20",
    "th-large": "21",
    "align-left": "22"
};

$('document').ready(function () {

    function get_id() {
        const classAttr = $('#new-link-i').attr('class');
        let imageName = "";
        for (let index = 6; index < classAttr.length - 19; index++) {
            imageName += classAttr[index];
        }

        if (!imageName) {
            imageName = 'hand-o-right';
        }

        return image_to_id[imageName];
    }

    function copyTextToClipboard(text) {
        const copyFrom = $('<textarea/>');
        copyFrom.text(text);
        $('body').append(copyFrom);
        copyFrom.select();
        document.execCommand('copy');
        copyFrom.remove();
    }

    function slugify(text) {
        return text.toString().toLowerCase()
            .replace(/\s+/g, '-')           // Replace spaces with -
            .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
            .replace(/\-\-+/g, '-')         // Replace multiple - with single -
            .replace(/^-+/, '')             // Trim - from start of text
            .replace(/-+$/, '');            // Trim - from end of text
    }

    $(function () {
        $('.saved-links-container').slimScroll({
            height: '400px',
            alwaysVisible: true,
            color: '#34495E'
        });
    });

    function remove_it() {
        let linkId = this.id;
        let linkName = linkId.substr(0, linkId.length - 4);
        const linksList = JSON.parse(localStorage["saved_data"]);
        for (let index in linksList) {
            if (linksList[index].name === linkName) {
                linksList.splice(index, 1);
            }
        }
        localStorage.setItem("saved_data", JSON.stringify(linksList));
        const div_element = "#" + slugify(linkName + "-div");
        $(div_element).remove();
        chrome.runtime.sendMessage({"task": "removeIt"});
    }

    function copy_it() {
        let copyText = document.getElementById(this.id).value;
        document.getElementById('message').innerHTML = this.id + ' Copied';
        $('#myModal').modal('show');
        copyTextToClipboard(copyText);
    }

    function save_information() {
        const linkName = $('input[name="new-name"]').val();
        const linkUrl = $('input[name="new-link"]').val();
        if (linkName && linkUrl) {
            const linksList = JSON.parse(localStorage.getItem("saved_data"));
            const newLink = {"id": get_id(), "name": linkName, 'linkUrl': linkUrl};
            // TO check newly added information is already present or not
            for (let link of linksList) {
                if (linkName === link.name) {
                    alert('Oops , ' + linkName + ' already exist...!!!');
                    return;
                }
            }
            linksList.push(newLink);
            localStorage.clear();
            localStorage.setItem('saved_data', JSON.stringify(linksList));
            chrome.runtime.sendMessage({"task": "addIt"});
        } else {
            alert('Please Enter both Information Name and Information!');
        }
    }

    const linksList = JSON.parse(localStorage.getItem("saved_data"));
    linksList.reverse();
    for (let link of linksList) {
        let div_id = link.name + "-div";
        let remove_btn = link.name + "-btn";
        let copy_element_id = link.name;
        let element = '<div  class="container-fluid" id="' + slugify(div_id) + '"><p><strong>' + link.name + '</strong></p><div class="saved-input-box"><span><i class="fa fa-' + id_to_image[link.id] + ' fa-2x"></i></span><input type="text" class="form-control" id="' + link.name + '" value="' + link.linkUrl + '" autocomplete="off" spellcheck="false"><button><span class="copytext" id="' + copy_element_id + '"><i class="fa fa-clipboard "></i></span></button><button><span  class="remove" id="' + remove_btn + '"><i class="fa fa-times"></i></span></button></div><br></div>';
        $('.saved-links-container').append(element);
    }

    $('.change-image').on("click", function () {
        $('#new-name-i').attr("class", "fa fa-" + id_to_image[this.id] + " fa-2x change-image");
        $('#new-link-i').attr("class", "fa fa-" + id_to_image[this.id] + " fa-2x change-image");
    });

    $('#save-add-another').on("click", function () {
        save_information();
        document.getElementById('new-name-input').value = "";
        document.getElementById('new-link-input').value = "";
        $("#new-info-form-modal").modal('show');
    });

    $('#add-new-information-btn').click(function () {
        document.getElementById('new-name-input').value = "";
        document.getElementById('new-link-input').value = "";
        $('#new-info-form-modal').modal('show');
    });

    $('#cancel').click(function () {
        $('#new-info-form-modal').modal('hide');
    });

    $('.remove').on("click", remove_it);

    $('.copytext').on('click', copy_it);

    $('#save').click(function () {
        save_information();
    });

    $('#saveit-btn').click(function () {
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
