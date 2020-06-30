
var seeall = new LocalAPIs();
    seeall.getAll().then((all)=>{
            console.log(all);

            function unflatten(arr) {
                var tree = [],
                    mappedArr = {},
                    arrElem,
                    mappedElem;
          
                // First map the nodes of the array to an object -> create a hash table.
                for(var i = 0, len = arr.length; i < len; i++) {
                  arrElem = arr[i];
                  mappedArr[arrElem.parentid] = arrElem;
                  mappedArr[arrElem.parentid]['children'] = [];
                }
          
          
                for (var id in mappedArr) {
                  if (mappedArr.hasOwnProperty(id)) {
                    mappedElem = mappedArr[id];
                    //console.log(mappedElem);
                    // If the element is not at the root level, add it to its parent array of children.
                    if (mappedElem.childid) {
                      //console.log(mappedElem.childid);
                      mappedArr[mappedElem['parentid']]['children'].push(mappedElem);
                    }
                    // If the element is at the root level, add it to first level elements array.
                    else {
                      tree.push(mappedElem);
                    }
                  }
                }
                return tree;
              }
          
          var tree = unflatten(all);
          //console.log(tree);
          //document.body.innerHTML = "<pre>" + (JSON.stringify(tree, null, " "))

    })

    
      
      

function genrateRoots(idx,uid){

    var uidDetails = new LocalAPIs();

    uidDetails.getProjectStructure(uid).then((data)=>{
        //console.log('inside',uid, data);
            for(var i=0; i<data.length; i++){

                //console.log(data[i].name);

                var id       = data[i].id;
                var filename = data[i].name;
                var filepath = data[i].path;
                var child    = data[i].child;
                var parent    = data[i].parent;
                var type     = data[i].type;

                var file  = type.split("/");
                     file = file[1];
                
                var ix =  Math.round(Math.random()*Math.pow(10,5));
                
   
                if($(".tree li[uid="+parent+"] ul").length > 0) {
                        //console.log('if', idx,uid);
                        ///// subsection already exist need only li /////// 
                        
                        var html  = `<li uid="`+child+`" path="`+filepath+`" filetype="`+type+`" id="test`+id+`_`+ix+`">
                                     <span><img src="./img/fileicon/16px/`+file+`.png" onError="this.onerror=null;this.src='./img/fileicon/16px/_blank.png';"> `+filename+`</span>
                                     </li>`;

                        var current_id = $(".tree li[uid="+parent+"]").attr("id");
                        
                       if($("#"+current_id+" ul li[uid="+child+"]").length > 0){

                        
                                
                       }else{
                               
                                $(".tree li[uid="+parent+"] ul").append(html);
                                genrateRoots(id,child);

                       }
                        
                        ////////////////////////////////////////////////////     

                }else{
                        //console.log('else',uid);
                        ///////////    fresh new subsection  ////////////
                        var html  = `<ul>
                                        <li uid="`+child+`" path="`+filepath+`" filetype="`+type+`" id="test`+id+`_`+ix+`">
                                        <span><img src="./img/fileicon/16px/`+file+`.png" onError="this.onerror=null;this.src='./img/fileicon/16px/_blank.png';"> `+filename+`</span>
                                        </li>
                                        </ul>`;

                        if($(".tree li[uid="+parent+"]").length > 0 ){
                                //genrateRoots(id,child);
                                $(".tree li[uid="+uid+"]").append(html);
                                genrateRoots(id,child);
                        }
                        
                        
                }

                

            }


    })

}

////  if project not selected ////

var pid = localStorage.getItem("pid"); //// projectis

if(!pid){

        var db = openDatabase('appdoc', '0.0.1', 'AppDoc', 2 * 1024 * 1024); 
        db.transaction(function (tx) { 
                
                tx.executeSql('SELECT * FROM PROJECTS', [], function (tx, res) {
                         var lenx = res.rows.length, p;
                         var option = `<option value="null">Select Project</option>`;

                         console.log('res.rows', res.rows);

                         for(p=0; p<lenx; p++){
                                
                           var projectName = res.rows.item(p).name;
                           var projectId   = res.rows.item(p).pid;
                           

                           option += `<option value="`+projectId+`">`+projectName+`</option>`;
                         }

                         var html = `<div class="form-group mb-2">
                                        <h2>Select Project</h2>
                                        <select name="projectname" id="projectname" class="form-control">`+option+`</select>
                                    </div>`;

                        $('#modal-body').html(html);
                        $('#master-model').modal('toggle');

                        $(document).delegate("select#projectname",'change',function(){
                          
                                var projectid = this.value;
                               

                                localStorage.setItem("pid", projectid);
                                
                                $('#master-model').modal('toggle');

                                window.location.href='appdoc.io/#dashboard';// ## change url with hash
                                location.reload();       // ## reload page
                                e.preventDefault(); 

                        })

                })

        })

        
}

//////////////////////////////////


var start = localStorage.getItem("start");

if(start != 'undefined'){
  //console.log('start',start);

  var db = openDatabase('appdoc', '0.0.1', 'AppDoc', 2 * 1024 * 1024); 
  db.transaction(function (tx) { 
                
        tx.executeSql(`SELECT * FROM FILES WHERE uid=${start}`, [], function (tx, res) {
                
                 //console.log(res);
                 
                        var uid   = res.rows.item(0).uid;      
                        var name  = res.rows.item(0).name;
                        var path  = res.rows.item(0).path;
                        
                 

                $(".tree").html(`<li id="test0_" uid="`+uid+`" path="`+path+`"><span>`+name+`</span></li>`);
                
                ////  Genrate tree from index 1  /////
                genrateRoots(1,start); 
                //////////////////////////////////////
        })

  })
}

/////////  Dashboard Grid Menu Functions (DB Export / Import ) ///
$(document).on("click",".project-backup", function(e){
        e.preventDefault();
        console.log("Begin backup process");
        
        websqldump.export({
                database: 'appdoc',
                version: '0.0.1',
                dbsize: 2 * 1024 * 1024,
                linebreaks: true,
                success: function(sql) {
                        window.open(URL.createObjectURL(
                                new Blob([sql], {
                                type: 'application/sql'}
                                )
                        ))
                },
                error: function(msg) {
                        // do nothing
                }

        });

})

$(document).on("click",".project-import", function(e){
        $.get('./backup.sql', function(response) {
                // console.log("got db dump!", response);
                var db = openDatabase('appdoc', '0.0.1', 'AppDoc', 2 * 1024 * 1024);  
                processQuery(db, 0, response.split(';\n'), 'appdoc'); 
        });
})

function processQuery(db, i, queries, dbname) {
        if(i < queries.length -1) {
          console.log(i +' of '+queries.length);
          if(!queries[i+1].match(/(INSERT|CREATE|DROP|PRAGMA|BEGIN|COMMIT)/)) {
            queries[i+1] = queries[i]+ ';\n' + queries[i+1];
             return processQuery(db, i+1, queries, dbname);
          }
          console.log('------------>', queries[i]);
          db.transaction( function (query){ 
            query.executeSql(queries[i]+';', [], function(tx, result) {
              processQuery(db, i +1, queries,dbname);  
            });          
          }, function(err) { 
          console.log("Query error in ", queries[i], err.message);                          
          processQuery(db, i +1, queries, dbname);   
          });
      } else {
          console.log("Done importing!");
      }
}
//////////////////////////////////////////////////////////////////

//////  Dashboard process submenu functions  /////////////////////
$(document).on("click",".process-add", function(){

       
        var uid  = $(this).parent(".process-menu").attr('uid');
        var puid = $(this).parent(".process-menu").attr('puid');
        

                var html = `   
                        <h2 class="modal-title" id="exampleModalLabel">Add Step to Process</h2>
                        <br/>
                        <form>
                        <div class="form-group">
                        <label for="recipient-name" class="col-form-label">Title</label>
                        <input type="text" class="form-control" id="process-title">
                        </div>
                        <div class="form-group">
                        <label for="message-text" class="col-form-label">Description</label>
                        <textarea class="form-control" id="process-description"></textarea>
                        </div>
                        <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                                <button type="button" class="btn btn-primary add-step-process">Add Step</button>
                        </div>
                        </form>`;

                        $('#modal-body').html(html);
                        $('#master-model').modal('toggle');

        


        $(document).on("click",".add-step-process", function(){

                var title = $("input#process-title").val();
                var des   = $("textarea#process-description").val();

                var addStep = new LocalAPIs();
                addStep.insertProcess(uid,puid,title,des).then((resx)=>{
                        if(resx == true){
                          $('#master-model').modal('toggle');    
                        }else{
                          alert('Err : Not Added');
                        }
                })


        })
})

$(document).on("click",".process-sequence", function(){
        
        var puid = $(this).parent(".process-menu").attr('puid');
        var uid  = $(this).parent(".process-menu").attr('uid');

        var allProcessSteps = new LocalAPIs();
        allProcessSteps.showProcess(puid,uid).then((steps)=>{

                var ul = `<ul id="sortable-steps" class="connectedSortable">`;
                //<li class="ui-state-default">Item 1</li>`;

                var lenx = steps.length;

                for(var i=0; i<lenx; i++){
                  
                        ul += `<li class="ui-state-default" step="`+(1+i)+`" dbid="`+steps[i].id+`">`+steps[i].title+`</li>`;
                                
                }

                ul += `</ul>`;

                $('#modal-body').html(ul);
                $('#master-model').modal('toggle');

                

                $( "#sortable-steps" ).sortable({
                        stop: function (event, ui) {
                                var idsInOrder = $("#sortable-steps").sortable("toArray", {
                                        attribute: 'dbid'
                                      });
                             

                                idsInOrder.forEach((element, index) => {
                                        
                                        var id = element;
                                        var step = 1+index;  // step start from 1 so
                                        allProcessSteps.updateProcessStepsSequence(step,id).then((result)=>{
                                                console.log('update : '+ result);
                                        })
                                });

                                //

                        }
                }).disableSelection();

        })     

})

$(document).on("click",".process-modify", function(){

        var puid = $(this).parent(".process-menu").attr('puid');
        var uid  = $(this).parent(".process-menu").attr('uid');
        var current_step = $(".input.active span").attr('data-step');



        if(current_step == 'start' || current_step == 'end'){
               ////////  Not editable step  /////////
        }else{
               /////////   editable step   //////////
               console.log(puid,uid,current_step);

               var allProcessSteps = new LocalAPIs();
               allProcessSteps.showStepData(puid,uid,current_step).then((steps)=>{

                        var html = `   
                        <h2 class="modal-title" id="exampleModalLabel">Update Step</h2>
                        <br/>
                        <form>
                        <div class="form-group">
                        <label for="recipient-name" class="col-form-label">Title</label>
                        <input type="text" class="form-control" id="process-title" value="`+steps.title+`">
                        </div>
                        <div class="form-group">
                        <label for="message-text" class="col-form-label">Description</label>
                        <textarea class="form-control" id="process-description">`+steps.description+`</textarea>
                        </div>
                        <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                                <button type="button" class="btn btn-primary update-step-details">Update</button>
                        </div>
                        </form>`;

                        $('#modal-body').html(html);
                        $('#master-model').modal('toggle');

                        $(document).on("click",".update-step-details", function(){

                                var title = $("input#process-title").val();
                                var des   = $("textarea#process-description").val();
                
                                var addStep = new LocalAPIs();
                                addStep.updateStepDetails(puid,uid,current_step,title,des).then((resx)=>{
                                        if(resx == true){
                                          $('#master-model').modal('toggle');    
                                        }else{
                                          alert('Err : Not Updated');
                                        }
                                })
                
                
                        })

                })



        }
})

$(document).on("click",".process-delete", function(){
        var puid = $(this).parent(".process-menu").attr('puid');
        var uid  = $(this).parent(".process-menu").attr('uid');
        var current_step = $(".input.active span").attr('data-step');



        if(current_step == 'start' || current_step == 'end'){
               ////////  Can Not Delet   /////////////
        }else{
               /////////   You Can Delete   //////////
               var allProcessSteps = new LocalAPIs();
               allProcessSteps.showStepData(puid,uid,current_step).then((steps)=>{

                        var html = `   
                        <h2 class="modal-title" id="exampleModalLabel">Delete Step</h2>
                        <br/>
                        <form>
                        <div class="form-group">
                        <label for="recipient-name" class="col-form-label">Title</label>
                        <input type="text" class="form-control" id="process-title" value="`+steps.title+`" disable>
                        </div>
                        <div class="form-group">
                        <label for="message-text" class="col-form-label">Description</label>
                        <textarea class="form-control" id="process-description" disable>`+steps.description+`</textarea>
                        </div>
                        <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                                <button type="button" class="btn btn-danger delete-step-details">Delete</button>
                        </div>
                        </form>`;

                        $('#modal-body').html(html);
                        $('#master-model').modal('toggle');

                        $(document).on("click",".delete-step-details", function(){

                                // var title = $("input#process-title").val();
                                // var des   = $("textarea#process-description").val();
                
                                var deleteStep = new LocalAPIs();
                                deleteStep.deleteStep(puid,uid,current_step).then((resx)=>{
                                        if(resx == true){
                                          $('#master-model').modal('toggle');    
                                        }else{
                                          alert('Err : Not Deleted');
                                        }
                                })
                
                
                        })

                })

        }
})
//////////////////////////////////////////////////////////////////