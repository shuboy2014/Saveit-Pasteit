/**
 * Created by Shubham Aggarwal on 04-07-2016.
 */
$('document').ready(function () {

    /* copy information to clipboard */
    function copyTextToClipboard(text) {
        var copyFrom = $('<textarea/>');
        copyFrom.text(text);
        $('body').append(copyFrom);
        copyFrom.select();
        document.execCommand('copy');
        copyFrom.remove();
    }

    /* make slug of id of information name */
    function slugify(text) {
        return text.toString().toLowerCase()
            .replace(/\s+/g, '-')           // Replace spaces with -
            .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
            .replace(/\-\-+/g, '-')         // Replace multiple - with single -
            .replace(/^-+/, '')             // Trim - from start of text
            .replace(/-+$/, '');            // Trim - from end of text
    }

    /* slim scroll */
    $(function(){
        $('.saved-links-container').slimScroll({
            height:'300px',
            alwaysVisible: true,
            color : '#34495E'
        });
    });

    /* to remove information */
    function remove_it(){
        var element_id = this.id ;
        console.log('remove ' + element_id );
        var information_name = element_id.substr(0,element_id.length-4);
        var list = JSON.parse(localStorage["saved_data"]);
        for(var i in list){
            object = list[i];
            if(object["name"]==information_name) {
                list.splice(i, 1);
            }
        }
        localStorage.setItem("saved_data",JSON.stringify(list));
        var div_element = "#"+slugify(information_name + "-div");
        $(div_element).remove();
        chrome.runtime.sendMessage({"task":"removeit"});
    }

    /* init copy function */
    function copy_it() {
        var name = this.id ;
        var string = document.getElementById(name).value ;
        document.getElementById('message').innerHTML =  name + ' Copied';
        $('#myModal').modal('show');
        copyTextToClipboard(string);
    }

    /* init UI */
    var list = JSON.parse(localStorage.getItem("saved_data"));
    list.reverse();
    for(var i in list) {
        var object = list[i];
        var div_id = object["name"] + "-div" ;
        var remove_btn = object["name"]+"-btn" ;
        var copy_element_id = object["name"];
        var element = '<div  class="container-fluid" id="'+slugify(div_id)+'"><p><strong>'+object["name"]+'</strong></p><div class="saved-input-box"><span><i class="fa fa-hand-o-right fa-2x"></i></span><input type="text" class="form-control" id="'+object["name"]+'" value="'+object["link"]+'" autocomplete="off" spellcheck="false"><button><span class="copy" id="'+ copy_element_id +'"><i class="fa fa-clipboard "></i></span></button><button><span  class="remove" id="' + remove_btn +'"><i class="fa fa-times"></i></span></button></div><br></div>';
        $('.saved-links-container').append(element);
    }

    /* New Information adder form */
    $('#add-new-form-element').click(function () {
        document.getElementById('form-link-name').value = "";
        document.getElementById('form-link').value = "";
        $('#add-new-form-element').prop('disabled',true);
        $('.link-adder-form').slideToggle();
    });

    /* display off information adder form */
    $('#Cancel').click(function () {
        $('.link-adder-form').slideToggle();
        $('#add-new-form-element').prop('disabled',false);
    });

    $('.remove').on( "click", remove_it);

    $('.copy').on('click', copy_it);

    /* Add and Store new information created */
    $('#Add-it').click(function () {
        var link_name = $('input[name="form-link-name"]').val();
        var link = $('input[name="form-link"]').val();
        if(link_name && link) {
            var array = JSON.parse(localStorage.getItem("saved_data"));
            var object = {"name": link_name, 'link': link} ;
            for(var i=0;i<array.length;++i){
                if(link_name == array[i]["name"]){
                    alert('Oops , ' + link_name  + ' already exist...!!!');
                    return;
                }
            }
            array.push(object);
            var div_id = object["name"] + "-div" ;
            var remove_btn = object["name"]+"-btn" ;
            var copy_btn = object["name"]+"-btn" ;
            localStorage.setItem('saved_data', JSON.stringify(array));
            var element = '<div  class="container-fluid" id="'+slugify(div_id)+'"><p><strong>'+object["name"]+'</strong></p><div class="saved-input-box"><span><i class="fa fa-hand-o-right fa-2x"></i></span><input type="text" class="form-control" id="'+object["name"]+'" value="'+object["link"]+'" autocomplete="off" spellcheck="false"><button><span class="copy" id="'+ copy_element_id +'"><i class="fa fa-clipboard "></i></span></button><button><span  class="remove" id="' + remove_btn +'"><i class="fa fa-times"></i></span></button></div><br></div>';
            $('.saved-links-container').prepend(element);
            $('.link-adder-form').slideToggle();
            $('#add-new-form-element').prop('disabled', false);
            $('.remove').on("click",remove_it);
            chrome.runtime.sendMessage({"task":"addit"});
        }else{
            alert('Please Enter both Information Name and Information !');
        }
    });
    
    /* Save all edited information */
    $('#saveit-btn').click(function () {
        var save_btn = $('#saveit-btn' );
        save_btn.prop('disabled',true);
        var list = JSON.parse(localStorage["saved_data"]);

        for(var i=0;i<list.length;++i){
            if(document.getElementById(list[i]["name"]).value == ''){
                alert("Oops ," + list[i]["name"] +" information is not filled !!");
                save_btn.html("Saveit");
                save_btn.prop('disabled',false);
                return ;
            }
        }
        
        for(var i=0;i<list.length;++i){
            var object = {
                "name":list[i]["name"] ,
                "link":document.getElementById(list[i]["name"]).value
            };
            list[i]=object;
        }
        
        localStorage.setItem("saved_data",JSON.stringify(list));
        chrome.runtime.sendMessage({"task":"saveit"});
        save_btn.prop('disabled',false);
        document.getElementById('message').innerHTML = ' Saved Successfully ';
        $('#myModal').modal('show');
    });
}); 