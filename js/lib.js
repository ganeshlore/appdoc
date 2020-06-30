
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

jQuery.showCode = function(target, filetype){

  var prism = {
    xml:"xml",
    html:"html",
    json:"json",
    javascript:"javascript",
    css:"css"
  }

  jQuery.ajax({
            url:'./../'+target,
                type:'GET',
                success: function(data){
                //$(document).find('[appdoc-page=*]');
                var type = filetype.split('/');
                type = prism[type[1]];
                console.log(type);
                var code = data;
                const html = Prism.highlight(code, Prism.languages[`${type}`], type);
                $('#appdoc-code').html('<pre class="language-'+type+' line-numbers"><code>'+html+'</code></pre>');
                  
                  document.querySelectorAll('pre[class*=language-]').forEach(function(node){
                    node.classList.add('line-numbers');
                  })
                  //Prism.highlightAll();
               
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
                    tx.executeSql(`INSERT INTO MINDMAP (uid, parent, child) VALUES (${cuid}, ${cuid}, ${uidx})`); 
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

jQuery.process = function(puid,uid){

        var getUidDetails = new LocalAPIs();

        getUidDetails.showProcess(puid,uid).then((steps)=>{
          
          getUidDetails.getUidDetails(puid).then((parentDetails)=>{
            
            $(".process-menu").attr('puid',puid);
            $(".process-menu").attr('uid',uid);
              
            getUidDetails.getUidDetails(uid).then((uidDetails)=>{

              var process = `<div class="flex-parent">
                            <div class="input-flex-container">`;

              console.log('parent details', parentDetails, uidDetails);

                  process += `<div class="input active start">
                              <span data-step="start" data-info="`+parentDetails.name+`"></span>
                            </div>`;

                            //console.log(steps);
                            var lenx = steps.length;
                            var html = '';
                            var details = '';
                            
                            for(var i=0; i<lenx; i++){
                  
                              html += `<div class="input">
                                        <span data-step="`+(1+i)+`" data-info="`+steps[i].title+`"></span>
                                      </div>`;
                              
                              details += `<p>`+steps[i].description+`</p>`;
                                      
                            }

                            process += html;
                                
                          


                  process += `<div class="input end">
                              <span data-step="end" data-info="`+uidDetails.name+`"></span>
                            </div>
                            </div>`;

                  process += `<div class="description-flex-container">
                              <p>`+parentDetails.path+`</p>
                              `+details+`
                              <p>`+uidDetails.path+`</p>
                              </div></div>`;

                $('#appdoc-process').html(process);
                $.loadScript('./js/dashboard-process.js', function(){
                  ///  after load everting show which step is active  ///
                  var activeStep = $(".input.active span").attr('data-step');
                  $("#active-step").html(activeStep);
                  ///////////////////////////////////////////////////////
                })

            })

          })

        })
         
        
}

jQuery.setParentNodeOfMindmap = function(){

  var pid = localStorage.getItem('pid');

  var db = openDatabase('appdoc', '0.0.1', 'AppDoc', 2 * 1024 * 1024); 
      db.transaction(function (tx) {
            tx.executeSql(`SELECT * FROM FILES WHERE pid=${pid}`, [], function (tx, results) { 
                var len = results.rows.length, i;
                var option = '<option vlaue="none">select file</option>';
                
                for (i = 0; i < len; i++) { 
                    option += `<option value="`+results.rows.item(i).uid+`">`+results.rows.item(i).name+` &nbsp;&nbsp; (`+results.rows.item(i).path+`)</option>`;

                
                }

                var html = `<div class="form-group mb-2">
                                <h2>Set Parent Node</h2>
                                <select name="parentNode" id="parentNode" class="form-control">`+option+`</select>
                            </div>`;

                            
                 
                $('#modal-body').html(html);
                
                ////  this  will trigger select on change and add value to db  ////
                $(document).delegate("select#parentNode",'change',function(){
                  
                  var uidx = this.value;
          
                  // console.log('child cuid', cuid);
                  // console.log('child uid', uid);
                  
                  var db = openDatabase('appdoc', '0.0.1', 'AppDoc', 2 * 1024 * 1024); 
                  db.transaction(function (tx) { 
                    tx.executeSql(`UPDATE PROJECTS SET start=${uidx} WHERE pid =${pid}`);
                  })
                  $('#master-model').modal('toggle'); /// will close model after insert

                  localStorage.setItem("start",uidx);
                  window.location.href='appdoc.io/#dashboard';// ## change url with hash
                  location.reload();       // ## reload page
                  e.preventDefault(); 

                })
                /////////////////////////////////////////////////////////////////////

            })
            
    })

    $('#master-model').modal('toggle');
}


jQuery.backup = function(table) {
  var def = new $.Deferred();
  var db = openDatabase('appdoc', '0.0.1', 'AppDoc', 2 * 1024 * 1024); 
	db.readTransaction(function(tx) {
		tx.executeSql("select * from "+table, [], function(tx,results) {
			var data = $.convertResults(results);
			console.dir(data);
			def.resolve(data);
		});
	},$.dbError);
	return def;
}

jQuery.dbError = function(e) {
  console.log("SQL ERROR");
  console.dir(e);
}

jQuery.convertResults = function(resultset) {
	var results = [];
	for(var i=0,len=resultset.rows.length;i<len;i++) {
		var row = resultset.rows.item(i);
		var result = {};
		for(var key in row) {
			result[key] = row[key];
		}
		results.push(result);
	}
	return results;
}


$(function() {
$(".tree").contextMenu({
  selector: 'li:not(.parent-node)',
  callback: function(key, options) {
      
      /*          Selected Page        */
      var cfilename = $(this).attr('path');
          cfilename = cfilename.split("/");
          cfilename = cfilename[cfilename.length-1];
      $('.selected-page').html(cfilename);
      console.log('cfilename',cfilename);
      /*******************************/

      var parentUid = $(this).parent('ul').closest('li').attr('uid');
      var uid  = $(this).attr('uid');
      var path = $(this).attr('path');
      var filetype = $(this).attr('filetype');
      var m = "parent uid:"+ parentUid +  "clicked: " + key + " on " + $(this).attr('uid') + $(this).attr('path');
      window.console && console.log(m); 


      switch(key){
        case 'show':
          $.loadScript('./js/prism/prism.js', function(){
            $.loadScript('./js/prism/prism-line-numbers.js', function(){
               
                $.showCode(path, filetype);
                $(".appdoc-tabs li[tab=code]").trigger('click'); /// this will trigger code tab click ( open code view)

            })
          })
        break;

        case 'add':
        $.addChild(uid);
        break;

        case 'process':
        $.process(parentUid,uid);
        $(".appdoc-tabs li[tab=process]").trigger('click'); /// this will trigger proccess tab click ( open proccess view)
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
      "process": {name: "Show Process", icon: "fa-object-ungroup"},
      "include": {name: "Include / @import", icon: "fa-plus", items: {
        "css": {name: "CSS", icon: "fa-css3"},
        "js": {name: "Js", icon: "fa-jsfiddle"},
        "file": {name: "File", icon: "fa-file-code-o"}
      }},
      "delete": {name: "Delete",icon: "fa-times-circle", items: {
        "dprocess": {name: "Delete Process", icon: "fa-times-circle"},
        "dchild": {name: "Delete Child", icon: "fa-times-circle"},
        "dinclude": {name: "Delete Include", icon: "fa-times-circle"}
      }}
  }
});


$(".tree").contextMenu({
  selector: 'li.parent-node',
  callback: function(key, options) {
     
      switch(key){
        case 'start':
        $.setParentNodeOfMindmap();
        break;
      }

  },
  events: {
    show: function(opt) { 
      opt.$menu.find('.context-menu-item > span').attr('title', function(){ return $(this).text(); });
    }
  },
  items: {
      "start": {name: "Set Start", icon: "fa-file"}
  }
});
});
