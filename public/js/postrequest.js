$(document).ready( () => {

    if($('#custId').val()=="admin"){
        //$("#showhide").show();   
        $("#div_selectuser").show();
        ajaxGet($('#exampleFormControlSelect1').val());
             
    }
    else{
        //$("#showhide").show();   
        $("#div_selectuser").hide();
        ajaxGet($('#custname').val());
                
    }
    

    $("#btnSubmit").click((event) => {
        //stop submit the form, we will post it manually.
        event.preventDefault();
        if($('#custId').val()=="admin"){
            var selectedCountry = $('#exampleFormControlSelect1').val();
            if(selectedCountry!=undefined){
                doAjaxuser(selectedCountry);
            }
            else{
                alert("Please select the User")
            }
        }
        else{
            var selectedCountry = $('#custname').val();
            if(selectedCountry!=undefined){
                doAjaxuser(selectedCountry);
            }
            else{
                alert("Please select the User")
            }
        }


    });
 
    $("#exampleFormControlSelect1").change(function(){
       var selectedCountry = $(this).children("option:selected").val();
        //alert("You have selected the country - " + selectedCountry);
        if(selectedCountry!=""){
            //doAjaxuser(selectedCountry);
            ajaxGet(selectedCountry);
        }
        else{
            alert("Please select the User")
        } 
    });
});
 
 
function doAjaxuser(selectedCountry) {
 
    // Get form
    //var form = $('#fileUploadForm')[0];
    selectedCountry1=selectedCountry;
    var form = $("input[name=uploadfile]")[0].files[0];
    if(form!=undefined && selectedCountry1!=undefined){
        //var data = new FormData(form);
        var data = new FormData(); 
            data.append("file", form);
        console.log('uploadfile', data, data.type);
        $.ajax({
            type: "POST",
            enctype: 'multipart/form-data',
            url: "/uploadsuser/"+selectedCountry1,
            data: data,
            processData: false, //prevent jQuery from automatically transforming the data into a query string
            contentType: false,
            cache: false,
            success: (data) => {
                $("#puliengo").text("");
                $('.custom-file-label').html('');
                $('#uploadfile').val('');
                $("#puliengo").text(data);
                //var url = window.location;
                ajaxGet(selectedCountry1);

            },
            error: (e) => {
                $("#puliengo").text(e.responseText);
            }
        });
    }
    else{
        alert("Please select the file and User!!");
    }
}


function doAjax() {
 
    // Get form
    //var form = $('#fileUploadForm')[0];
    var form = $("input[name=uploadfile]")[0].files[0];
    if(form!=undefined){
        //var data = new FormData(form);
        var data = new FormData(); 
            data.append("file", form);
        console.log('uploadfile', data, data.type);
        $.ajax({
            type: "POST",
            enctype: 'multipart/form-data',
            url: "/uploads",
            data: data,
            processData: false, //prevent jQuery from automatically transforming the data into a query string
            contentType: false,
            cache: false,
            success: (data) => {
                $("#puliengo").text("");
                $('.custom-file-label').html('');
                $('#uploadfile').val('');
                $("#puliengo").text(data);
                //var url = window.location;
                ajaxGet();

            },
            error: (e) => {
                $("#puliengo").text(e.responseText);
            }
        });
    }
    else{
        alert("Please select the file!!");
    }
}


function ajaxGet(){
    var url = window.location;
    $.ajax({
        type : "GET",
        url : "/files",
        success: (data) => {
            $("#listFiles").html("");
            $("#listFiles").append('<ul>');
            $.each(data, (index, filename) => {
                $("#listFiles").append('<li><a href=' + url + 'files/' + filename +'>' + filename + '</a></li>');
            });
            $("#listFiles").append('</ul>');
            $('.custom-file-label').html('');
        },
        error : (err) => {
            $("#listFiles").html(err.responseText);
        }
    }); 
}

function ajaxGet(a){
    var url = window.location;
    $.ajax({
        type : "GET",
        url : "/filesuser/"+a,
        success: (data) => {
            $("#listFiles").html("");
            $("#listFiles").append('<ul>');
            $.each(data, (index, filename) => {
                $("#listFiles").append('<li><a href=' + url + 'files/'+ a +'/' + filename +'>' + filename + '</a></li>');
            });
            $("#listFiles").append('</ul>');
            $('.custom-file-label').html('');
        },
        error : (err) => {
            $("#listFiles").html(err.responseText);
        }
    }); 
}