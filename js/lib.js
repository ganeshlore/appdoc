
jQuery.loadDoc = function (url,targetid, callback) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        document.getElementById(targetid).innerHTML =
        this.responseText;
      }
    };
    xhttp.open("GET", url, true);
    xhttp.send();
    callback(xhttp);
}

jQuery.loadScript = function (url, callback) {
    jQuery.ajax({
        url: url,
        dataType: 'script',
        success: callback,
        async: true
    });
}

jQuery.showCode = function(target){
  jQuery.ajax({
            url:'./../'+target,
                type:'GET',
                success: function(data){
                //$(document).find('[appdoc-page=*]');
                $('#appdoc-code').html('<pre class="language-markup line-numbers"><code>'+htmlentities.encode(data)+'</code></pre>');
                }
  }); 
}

jQuery.addChild = function(uid){

  $("#appDocTree figure ul li").removeClass('active');
  $("#appDocTree figure ul li[uid="+uid+"]").addClass('active');

    var db = openDatabase('appdoc', '0.0.1', 'AppDoc', 2 * 1024 * 1024); 
    db.transaction(function (tx) {
            tx.executeSql('SELECT * FROM FILES', [], function (tx, results) { 
                var len = results.rows.length, i;
                var option = '';
                
                for (i = 0; i < len; i++) { 
                    option += `<option value="`+results.rows.item(i).uid+`">`+results.rows.item(i).name+` &nbsp;&nbsp; (`+results.rows.item(i).path+`)</option>`;

                
                }

                var html = `<div class="form-group mb-2">
                                <label for="staticEmail2" class="sr-only">Email</label>
                                <select name="childnode" id="childnode" class="form-control">`+option+`</select>
                            </div>`;

                            
                 
                $('#modal-body').html(html);
                
                ////  this  will trigger select on change and add value to db  ////
                $(document).delegate("select#childnode",'change',function(){
                  var cuid = uid;
                  var uidx = this.value;
          
                  // console.log('child cuid', cuid);
                  // console.log('child uid', uid);
                  
                  var db = openDatabase('appdoc', '0.0.1', 'AppDoc', 2 * 1024 * 1024); 
                  db.transaction(function (tx) { 
                    tx.executeSql('INSERT INTO MINDMAP (uid, parent, child) VALUES ('+cuid+','+cuid+','+uidx+')'); 
                  })
                  $('#master-model').modal('toggle'); /// will close model after insert

                  
                  window.location.href='appdoc.io/#dashboard';// ## change url with hash
                  location.reload();       // ## reload page
                  e.preventDefault(); 

                })
                /////////////////////////////////////////////////////////////////////

            })
            
    })

    $('#master-model').modal('toggle');
}


$(function() {
$(".tree").contextMenu({
  selector: 'li',
  callback: function(key, options) {
      var uid  = $(this).attr('uid');
      var path = $(this).attr('path');
      var m = "clicked: " + key + " on " + $(this).attr('uid') + $(this).attr('path');
      //window.console && console.log(m) || alert(m); 
      switch(key){
        case 'show':
        $.showCode(path);
        break;

        case 'add':
        $.addChild(uid);
        break;

      }
  },
  events: {
    show: function(opt) { 
      opt.$menu.find('.context-menu-item > span').attr('title', function(){ return $(this).text(); });
    }
  },
  items: {
      "add": {name: "Add File", icon: "fa-file"},
      "show": {name: "Show Code", icon: "fa-file-code-o"},
      "process": {name: "Add Process", icon: "fa-object-ungroup"},
      "include": {name: "Include", icon: "fa-at", items: {
        "css": {name: "CSS", icon: "fa-css3"},
        "js": {name: "Js", icon: "fa-jsfiddle"}
      }},
      "delete": {name: "Delete",icon: "fa-times-circle", items: {
        "process": {name: "Delete Process", icon: "fa-times-circle"},
        "child": {name: "Delete Child", icon: "fa-times-circle"},
        "include": {name: "Delete Include", icon: "fa-times-circle"}
      }}
  }
});
});
