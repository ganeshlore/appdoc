

// $(document).delegate("#appDocTree figure ul li",'click',function(e){  

//     e.stopImmediatePropagation();

//     $("#appDocTree figure ul li").removeClass('active');
//     $(this).addClass('active');

//     var db = openDatabase('appdoc', '0.0.1', 'AppDoc', 2 * 1024 * 1024); 
//     db.transaction(function (tx) {
//             tx.executeSql('SELECT * FROM FILES', [], function (tx, results) { 
//                 var len = results.rows.length, i;
//                 var option = '';
                
//                 for (i = 0; i < len; i++) { 
//                     option += `<option value="`+results.rows.item(i).uid+`">`+results.rows.item(i).name+`</option>`;

                
//                 }

//                 var html = `<div class="form-group mb-2">
//                                 <label for="staticEmail2" class="sr-only">Email</label>
//                                 <select name="childnode" id="childnode" class="form-control">`+option+`</select>
//                             </div>`;
                 
//                 $('#modal-body').html(html);

//             })
            
//     })

//     $('#master-model').modal('toggle');

// })



// $(document).delegate("select#childnode",'change',function(){

//     var cuid = $("#appDocTree figure ul li.active").attr('uid');
//     var uid = this.value;

//         // console.log('child cuid', cuid);
//         // console.log('child uid', uid);
        
//         var db = openDatabase('appdoc', '0.0.1', 'AppDoc', 2 * 1024 * 1024); 
//         db.transaction(function (tx) { 
//           tx.executeSql('INSERT INTO MINDMAP (uid, parent, child) VALUES ('+cuid+','+cuid+','+uid+')'); 
//         })
        
//         $('#master-model').modal('toggle');   

// });


////  Genrate tree from index 1  /////
genrateRoots(1);
//////////////////////////////////////

function genrateRoots(uid){

    var uidDetails = new LocalAPIs();

    uidDetails.getProjectStructure(uid).then((data)=>{
    
            for(var i=0; i<data.length; i++){

                console.log(data[i].name);

                var filename = data[i].name;
                var filepath = data[i].path;
                var child    = data[i].child;

   
                if($(".tree li[uid="+uid+"]").closest("li").children("ul").length) {
                        ///// subsection already exist need only li /////// 
                        var html  = `<li uid="`+child+`" path="`+filepath+`"><span>`+filename+`</span>`;

                        $(".tree li[uid="+uid+"] ul").append(html)
                        genrateRoots(child);
                       

                }else{
                        ///////////    fresh new subsection  ////////////
                        var html  = `<ul>
                                        <li uid="`+child+`" path="`+filepath+`"><span>`+filename+`</span>
                                        </ul>`;

                        $(".tree li[uid="+uid+"]").append(html)
                        genrateRoots(child);
                        
                }

            }


    })

}
