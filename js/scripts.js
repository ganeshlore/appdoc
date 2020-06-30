////// Custom Router //////
var hashRoute = window.location.pathname;
    hashRoute = window.location.hash; //route.replace('/appdoc.io/','');

console.log('->',hashRoute);

if(hashRoute == ''){

    $.loadDoc('./app/home.html','app-body', function(){

        
            var db = openDatabase('appdoc', '0.0.1', 'AppDoc', 2 * 1024 * 1024); 
            db.transaction(function (tx) { 

                tx.executeSql('CREATE TABLE IF NOT EXISTS FILES (uid INTEGER PRIMARY KEY, pid INTEGER, name, type, size, path, lastModified, lastModifiedDate)');
                tx.executeSql('CREATE TABLE IF NOT EXISTS PROJECTS (pid INTEGER PRIMARY KEY, name, start INTEGER, created)');
                tx.executeSql('CREATE TABLE IF NOT EXISTS PROCESS (id INTEGER PRIMARY KEY, uid INTEGER, puid INTEGER, step INTEGER, title, description)');
                
                
                window.addEventListener('load',function(){
                    document.getElementById("filepicker").addEventListener("change", function(event) {

                        db.transaction(function (tx) { 

                        var created = Date.now();
                        var project = $('input[name=project]').val();  /// project name
                        var start = null;
            
                        tx.executeSql(`INSERT INTO PROJECTS (name, start, created) VALUES ("${project}", ${start},"${created}")` , [], function(txx, sql_res) { 
                        var projectid = sql_res.insertId;


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
                            
    
                                tx.executeSql(`INSERT INTO FILES (pid, name, type, size, path, lastModified, lastModifiedDate) VALUES (${projectid},"${files[i].name}","${files[i].type}","${files[i].size}","${files[i].webkitRelativePath}","${files[i].lastModifiedDate}","${files[i].lastModified}")`); 
                                var progress = Math.round(current_file * 100 / files.length);
                                console.log('progress', progress);
                                current_file += 1;
                                $("#complete").append(progress);
                                $("progress").attr("value",progress);

                                if(progress == 100){
                                    $("#procced").css("display","block");
                                }


                        }

                        };

                        })
                        })

                    }, false);
                    
                })
            

            })
 
         

    })


}else if(hashRoute == '#dashboard'){

    $.loadDoc('./app/dashboard.html','app-body', function(){
        
        $.loadScript('./js/dashboard.js', function(){
            var db = openDatabase('appdoc', '0.0.1', 'AppDoc', 2 * 1024 * 1024); 
            var msg;

            

            db.transaction(function (tx) { 

                tx.executeSql('CREATE TABLE IF NOT EXISTS FILES (uid INTEGER PRIMARY KEY, pid INTEGER, name, type, size, path, lastModified, lastModifiedDate)');
                tx.executeSql('CREATE TABLE IF NOT EXISTS PROJECTS (pid INTEGER PRIMARY KEY, name, start INTEGER, created)');
                tx.executeSql('CREATE TABLE IF NOT EXISTS PROCESS (id INTEGER PRIMARY KEY, uid INTEGER, puid INTEGER, step INTEGER, title, description)');
                tx.executeSql('CREATE TABLE IF NOT EXISTS MINDMAP (id INTEGER PRIMARY KEY, uid INTEGER, parent INTEGER, child INTEGER)');
                
                tx.executeSql('SELECT * FROM MINDMAP', [], function (tx, res) {
                    var map = res.rows.length; 
                    if(map == 0){
                        
                        console.log('need to set start page');

                    }
                })
                
                var pid = localStorage.getItem("pid");

                console.log('pid',pid);

                tx.executeSql(`SELECT * FROM FILES WHERE pid=${pid}`, [], function (tx, results) { 
                   
                   var container = $('#pagination-btn');
                   var dataContainer = $('#appdoc-structure');

                   var xres = results.rows;

                   var options = {
                        dataSource: Object.values(JSON.parse(JSON.stringify(xres))),
                        pageSize: 30,
                        callback: function(xres, pagination) {
                            
                            var dataHtml = '<ul id="appdoc-list" class="appdoc-files">';
                            var currentPage = pagination.pageNumber;

                            //console.log('xres',xres);

                            $.each(xres, function (index, item) {

                                var newIndex = Math.ceil((currentPage - 1) * 30) + index;

                                dataHtml += `<li index="`+newIndex+`">`+
                                              `<div class="app-doc-row-id">`+newIndex+`</div>`+
                                              `<div class="app-doc-row-name" dbid="`+item.uid+`">`+item.name+`</div>`+
                                              `<div class="app-doc-row-path">`+item.path+`</div>`+
                                            //   `<span style="width:20px">`+item.lastModified+`</span>`+
                                              `</li>`;
                            })
                            dataHtml += '</ul>';

                            container.prev().html(dataHtml); //// apply pagination
                            var html = dataHtml;
                            dataContainer.html(html); ///// apply data 

                        }
                    }
                    /////////////////////////////////////////////////////////////////
                    container.pagination(options);  ///// options apply to pagination
                    /////////////////////////////////////////////////////////////////
                    
                }, null); 
            }); 
            
            
        });

    });  

}
