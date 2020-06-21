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
                                  FILES.path as fpath  
                                  FROM MINDMAP INNER JOIN FILES ON FILES.uid = MINDMAP.child 
                                  WHERE MINDMAP.uid =`+uid, [], function (tx, results) {

                var len = results.rows.length, i;
                
                console.log('len',len);

                for (i = 0; i < len; i++) {

                    var subarray = new Object();
                    var parent = results.rows.item(i).mparent;
                    var child = results.rows.item(i).mchild;
                    var name = results.rows.item(i).fname;
                    var path = results.rows.item(i).fpath;
                    
                    subarray.parent = parent;
                    subarray.child = child;
                    subarray.name = name;
                    subarray.path = path;

                    mainArray[i] = subarray;
                    
                }
                
                resolve(mainArray);
            })
            
        })

        

        })
    }


}