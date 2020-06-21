////// Custom Router //////
var hashRoute = window.location.pathname;
    hashRoute = window.location.hash; //route.replace('/appdoc.io/','');

console.log('->',hashRoute);

if(hashRoute == ''){

    $.loadDoc('./app/home.html','app-body', function(){

        var db = openDatabase('appdoc', '0.0.1', 'AppDoc', 2 * 1024 * 1024); 
        db.transaction(function (tx) { 
          tx.executeSql('CREATE TABLE IF NOT EXISTS FILES (uid INTEGER PRIMARY KEY, name, type, size, path, lastModified, lastModifiedDate)');
        });

        window.addEventListener('load',function(){
            document.getElementById("filepicker").addEventListener("change", function(event) {

                $("#status").css("display","block");
                //let output = document.getElementById("listing");
                let files = event.target.files;
                let current_file = 1;

                for (let i=0; i<files.length; i++) {
                let item = document.createElement("li");
                item.innerHTML = files[i].webkitRelativePath;

                if(files[i].webkitRelativePath.includes("/appdoc/")){
                
                    console.log('exclude',files[i].webkitRelativePath);
                    current_file += 1;
                    var progress = Math.round(current_file * 100 / files.length);
                    $("progress").attr("value",progress);
                
                }else{

                    db.transaction(function (tx) { 
                    
                    tx.executeSql('INSERT INTO FILES (name, type, size, path, lastModified, lastModifiedDate) VALUES ("'+files[i].name+'","'+files[i].type+'","'+files[i].size+'","'+files[i].webkitRelativePath+'","'+files[i].lastModifiedDate+'","'+files[i].lastModified+'")'); 
                    var progress = Math.round(current_file * 100 / files.length);
                    console.log('progress', progress);
                    current_file += 1;
                    $("#complete").append(progress);
                    $("progress").attr("value",progress);

                    if(progress == 100){
                        $("#procced").css("display","block");
                    }

                    });

                    


                }

                


                };
            }, false);
        })

    })


}else if(hashRoute == '#dashboard'){

    $.loadDoc('./app/dashboard.html','app-body', function(){
        
        $.loadScript('./js/dashboard.js', function(){
            var db = openDatabase('appdoc', '0.0.1', 'AppDoc', 2 * 1024 * 1024); 
            var msg;

            db.transaction(function (tx) { 
                tx.executeSql('CREATE TABLE IF NOT EXISTS MINDMAP (id INTEGER PRIMARY KEY, uid, parent, child)');
                
                tx.executeSql('SELECT * FROM MINDMAP', [], function (tx, res) {
                    var map = res.rows.length; 
                    if(map == 0){
                        
                        console.log('need to set start page');

                    }
                })

                tx.executeSql('SELECT * FROM FILES', [], function (tx, results) { 
                   var len = results.rows.length, i; 
                   msg = `<table class="table table-sm">
                            <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">File</th>
                                <th scope="col">Path</th>
                                <th scope="col">Last Modified</th>
                            </tr>
                            </thead>
                          <tbody>`;
          
                   for (i = 0; i < len; i++) { 
                        msg += `<tr>
                                <th scope="row">`+i+`</th>
                                <td>`+results.rows.item(i).name+`</td>
                                <td>`+results.rows.item(i).path+`</td>
                                <td>`+results.rows.item(i).lastModified+`</td>
                                </tr>`;

                      
                   } 
                   msg += `</tbody>
                           </table>`;

                   document.querySelector('#appdoc-structure').innerHTML +=  msg; 
                }, null); 
            }); 
            
            
        });

    });  

}
