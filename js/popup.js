/**
 * Created by Shubham Aggarwal on 04-07-2016.
 */

/* BoilerPlate icons id as index */
var id_icon = [
    "facebook-square",
    "linkedin-square",
    "dropbox",
    "envelope",
    "github-alt",
    "yahoo",
    "wordpress",
    "youtube-square",
    "reddit",
    "mobile",
    "stack-overflow",
    "hand-o-right",
    "play-circle",
    "skype",
    "google-plus-official",
    "twitter",
    "instagram",
    "whatsapp",
    "slack",
    "pinterest",
    "th-large",
    "align-left"
];

$('document').ready(function () {

    function get_id(){
        var class_attr = $('#new-link-i').attr('class');
        var image_name = "",i;

        for(i=6;i<class_attr.length-19;i++){
            image_name+=class_attr[i];
        }
        console.log(image_name);
        for(i=0;i<21;i++){
            if(image_name == id_icon[i]){
                console.log("index : " + i);
                return (i+1).toString();
            }
        }
        return "12";
    }
    
    function copyTextToClipboard(text) {
        var copyFrom = $('<textarea/>');
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

    $(function(){
        $('.saved-links-container').slimScroll({
            height:'400px',
            alwaysVisible: true,
            color : '#34495E'
        });
    });

    function remove_it(){
        var element_id = this.id ;
        var information_name = element_id.substr(0,element_id.length-4);
        var list = JSON.parse(localStorage["saved_data"]);
        for(var i=0;i<list.length ; i++){
            object = list[i];
            if(object["Name"]==information_name) {
                list.splice(i, 1);
            }
        }
        localStorage.setItem("saved_data",JSON.stringify(list));
        var div_element = "#"+slugify(information_name + "-div");
        $(div_element).remove();
        chrome.runtime.sendMessage({"task":"removeit"});
    }

    function copy_it() {
        var name = this.id ;
        var string = document.getElementById(name).value ;
        document.getElementById('message').innerHTML =  name + ' Copied';
        $('#myModal').modal('show');
        copyTextToClipboard(string);
    }

    function save_information() {
        var link_name = $('input[name="new-name"]').val();
        var link = $('input[name="new-link"]').val();
        if(link_name && link) {
            var array = JSON.parse(localStorage.getItem("saved_data"));
            var object = {"Id": get_id(),"Name": link_name, 'Link': link} ;
            // TO check newly added information is already present or not
            for(var i=0;i<array.length;++i){
                if(link_name == array[i]["Name"]){
                    alert('Oops , ' + link_name  + ' already exist...!!!');
                    return;
                }
            }
            console.log(object);
            array.push(object);
            localStorage.clear();
            localStorage.setItem('saved_data', JSON.stringify(array));
            chrome.runtime.sendMessage({"task":"addit"});
        }else{
            alert('Please Enter both Information Name and Information !');
        }
    }


    var list = JSON.parse(localStorage.getItem("saved_data"));
    list.reverse();
    for(var i in list) {
        var object = list[i];
        var div_id = object["Name"] + "-div" ;
        var remove_btn = object["Name"]+"-btn" ;
        var copy_element_id = object["Name"];
        var element = '<div  class="container-fluid" id="'+slugify(div_id)+'"><p><strong>'+object["Name"]+'</strong></p><div class="saved-input-box"><span><i class="fa fa-'+ id_icon[parseInt(object["Id"])-1] +' fa-2x"></i></span><input type="text" class="form-control" id="'+object["Name"]+'" value="'+object["Link"]+'" autocomplete="off" spellcheck="false"><button><span class="copytext" id="'+ copy_element_id +'"><i class="fa fa-clipboard "></i></span></button><button><span  class="remove" id="' + remove_btn +'"><i class="fa fa-times"></i></span></button></div><br></div>';
        $('.saved-links-container').append(element);
    }

    $('.change-image').on("click",function () {
        console.log(get_id());
        $('#new-name-i').attr("class", "fa fa-"+ id_icon[parseInt(this.id)-1]+" fa-2x change-image");
        $('#new-link-i').attr("class", "fa fa-"+ id_icon[parseInt(this.id)-1]+" fa-2x change-image");
    });
    
    $('#save-add-another').on("click",function () {
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

    $('.remove').on( "click", remove_it);

    $('.copytext').on('click', copy_it);

    $('#save').click(function () {
        save_information();
    });

    $('#saveit-btn').click(function () {
        var save_btn = $('#saveit-btn' );
        save_btn.prop('disabled',true);
        var list = JSON.parse(localStorage["saved_data"]);
        var i;
        for(i=0;i<list.length;++i){
            if(document.getElementById(list[i]["Name"]).value == ''){
                alert("Oops ," + list[i]["Name"] +" information is not filled !!");
                save_btn.html("Saveit");
                save_btn.prop('disabled',false);
                return ;
            }
        }

        for(i=0;i<list.length;++i){
            var object = {
                "Id":get_id(),
                "Name":list[i]["Name"] ,
                "Link": document.getElementById(list[i]["Name"]).value
            };
            list[i]=object;
        }
        localStorage.clear();
        localStorage.setItem("saved_data",JSON.stringify(list));
        chrome.runtime.sendMessage({"task":"saveit"});
        save_btn.prop('disabled',false);
        document.getElementById('message').innerHTML = ' Saved Successfully ';
        $('#myModal').modal('show');
    });
}); 