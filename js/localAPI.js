class LocalAPIs {
    
    constructor() {
       this.db = openDatabase('appdoc', '0.0.1', 'AppDoc', 2 * 1024 * 1024);
    }

    
    getProjectStructure(uid){
        return new Promise (function (resolve,reject){
        
        var mainArray = new Array();

        var db = openDatabase('appdoc', '0.0.1', 'AppDoc', 2 * 1024 * 1024);
        db.transaction(function (tx) {

            tx.executeSql(`SELECT MINDMAP.id as mid, 
                                  MINDMAP.uid as muid, 
                                  MINDMAP.parent as mparent, 
                                  MINDMAP.child as mchild,
                                  FILES.uid as fuid, 
                                  FILES.name as fname, 
                                  FILES.path as fpath,
                                  FILES.type as ftype
                                  FROM MINDMAP INNER JOIN FILES ON FILES.uid = MINDMAP.child
                                  WHERE MINDMAP.parent =${uid}` , [], function (tx, results) {

                var len = results.rows.length, i;
                
                //console.log('len',len, uid);

                for (i = 0; i < len; i++) {

                    var subarray = new Object();
                    var id = results.rows.item(i).mid;
                    var parent = results.rows.item(i).mparent;
                    var child = results.rows.item(i).mchild;
                    var name = results.rows.item(i).fname;
                    var path = results.rows.item(i).fpath;
                    var type = results.rows.item(i).ftype;
                    
                    subarray.id    = id;
                    subarray.parent = parent;
                    subarray.child = child;
                    subarray.name = name;
                    subarray.path = path;
                    subarray.type = type;

                    mainArray[i] = subarray;
                    //console.log('subarray',subarray);
                    
                }
                
                resolve(mainArray);
            })
            
        })

        

        })
    }
    
    getAll(){
        return new Promise (function (resolve,reject){
        
            var mainArray = new Array();
    
            var db = openDatabase('appdoc', '0.0.1', 'AppDoc', 2 * 1024 * 1024);
            db.transaction(function (tx) {
    
                tx.executeSql(`SELECT MINDMAP.id as mid, 
                                      MINDMAP.uid as muid, 
                                      MINDMAP.parent as mparent, 
                                      MINDMAP.child as mchild,
                                      FILES.uid as fuid, 
                                      FILES.name as fname, 
                                      FILES.path as fpath,
                                      FILES.type as ftype
                                      FROM MINDMAP INNER JOIN FILES ON FILES.uid = MINDMAP.child` , [], function (tx, results) {
    
                    var len = results.rows.length, i;
                    
                    //console.log('len',len, uid);

    
                    for (i = 0; i < len; i++) {
    
                        var subarray = new Object();
                        var id = results.rows.item(i).mid;
                        var parent = results.rows.item(i).mparent;
                        var child = results.rows.item(i).mchild;
                        var name = results.rows.item(i).fname;
                        var path = results.rows.item(i).fpath;
                        var type = results.rows.item(i).ftype;
                        
                        subarray.id    = id;
                        subarray.parentid = parent;
                        subarray.childid = child;
                        subarray.name = name;
                        subarray.path = path;
                        subarray.type = type;
    
                        mainArray[i] = subarray;
                        //console.log('subarray',subarray);
                        
                    }
                    
                    resolve(mainArray);
                })
                
            })
    
            
    
            })

    }

    getUidDetails(uid){
        return new Promise (function (resolve,reject){
        
        var mainArray = new Array();

        var db = openDatabase('appdoc', '0.0.1', 'AppDoc', 2 * 1024 * 1024);
        db.transaction(function (tx) {

            tx.executeSql(`SELECT * FROM FILES WHERE uid =${uid}` , [], function (tx, results) {


                    var subarray = new Object();
                    var uid = results.rows.item(0).uid;
                    var name = results.rows.item(0).name;
                    var path = results.rows.item(0).path;
                    var type = results.rows.item(0).type;
                    
                    subarray.uid  = uid;
                    subarray.name = name;
                    subarray.path = path;
                    subarray.type = type;

                    
                    resolve(subarray);
            })
            
        })

        

        })
    }


    insertProcess(uid,puid,title,des){

        return new Promise (function (resolve,reject){
    
            var db = openDatabase('appdoc', '0.0.1', 'AppDoc', 2 * 1024 * 1024);
            db.transaction(function (tx) {
    
                tx.executeSql(`INSERT INTO PROCESS (uid, puid, title, description) VALUES (${uid}, ${puid},"${title}","${des}")`, [], function (tx, results) {
                    
                    var lastInsertId = results.insertId;
                    resolve(true);
                    
                },function(err){
                    resolve(false);
                })
            })

        })

    }

    showProcess(puid,uid){

        return new Promise (function (resolve,reject){
            var mainArray = new Array();

            var db = openDatabase('appdoc', '0.0.1', 'AppDoc', 2 * 1024 * 1024);
            db.transaction(function (tx) {
    
                tx.executeSql(`SELECT * FROM PROCESS WHERE uid=${uid} AND puid=${puid} ORDER BY step ASC`, [], function (tx, results) {
                    
                    var len = results.rows.length, i;
    
                    for (i = 0; i < len; i++) {

                    var subarray = new Object();
                    var id  = results.rows.item(i).id;
                    var step  = results.rows.item(i).step;
                    var title = results.rows.item(i).title;
                    var description = results.rows.item(i).description;
                    
                    subarray.id  = id;
                    subarray.step  = step;
                    subarray.title = title;
                    subarray.description = description;

                    mainArray[i] = subarray;
                    }

                    resolve(mainArray);
                    
                })
            })

        })

    }

    showStepData(puid,uid,step){

        return new Promise (function (resolve,reject){

            var db = openDatabase('appdoc', '0.0.1', 'AppDoc', 2 * 1024 * 1024);
            db.transaction(function (tx) {
    
                tx.executeSql(`SELECT * FROM PROCESS WHERE uid=${uid} AND puid=${puid} AND step=${step} ORDER BY step ASC` , [], function (tx, results) {
                    
                    //console.log(results.rows.item(0).title);

                    var subarray = new Object();
                    var id  = results.rows.item(0).id;
                    var step  = results.rows.item(0).step;
                    var title = results.rows.item(0).title;
                    var description = results.rows.item(0).description;
                    
                    subarray.id  = id;
                    subarray.step  = step;
                    subarray.title = title;
                    subarray.description = description;

                    resolve(subarray);
                    
                },function(err){
                    console.log(err);
                })
            })

        })

    }

    updateStepDetails(puid,uid,step,title,des){
        return new Promise (function (resolve,reject){
            var db = openDatabase('appdoc', '0.0.1', 'AppDoc', 2 * 1024 * 1024);
            db.transaction(function (tx) {
                tx.executeSql(`UPDATE PROCESS SET title="${title}", description="${des}" WHERE puid=${puid} AND uid=${uid} AND step=${step}`, [] , function (tx, results) {
                    resolve(true);
                },function(err){
                    resolve(false);
                });
            })
        })
    }

    deleteStep(puid,uid,step){
        return new Promise (function (resolve,reject){
            var db = openDatabase('appdoc', '0.0.1', 'AppDoc', 2 * 1024 * 1024);
            db.transaction(function (tx) {
                tx.executeSql(`DELETE FROM PROCESS WHERE puid=${puid} AND uid=${uid} AND step=${step}`, [] , function (tx, results) {
                    resolve(true);
                },function(err){
                    resolve(false);
                });
            })
        })
    }

    updateProcessStepsSequence(step,id){
        return new Promise (function (resolve,reject){
            var db = openDatabase('appdoc', '0.0.1', 'AppDoc', 2 * 1024 * 1024);
            db.transaction(function (tx) {
                tx.executeSql(`UPDATE PROCESS SET step=${step} WHERE id=${id}`, [] , function (tx, results) {
                    resolve(results);
                },function(err){
                    console.log(err);
                });
            })
        })
    }

}