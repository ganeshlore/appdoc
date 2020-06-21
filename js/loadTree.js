let tree = {
    1: {
       2:'' 
    }
};

let treeParams = {
    1: {fileName: 'index.html', path:''},
    2: {fileName: 'index.html', path:''},
    3: {fileName: 'index.html', path:''}
    
};

treeMaker(tree, {
    id: 'appDocTree', card_click: function (element,target) {

        pushNewKey('3','');

        $.ajax({
            url:'./../'+target,
                type:'GET',
                success: function(data){
                  //$(document).find('[appdoc-page=*]');
                  $('#appdoc-code').html('<pre class="language-markup line-numbers"><code>'+htmlentities.encode(data)+'</code></pre>');
                }
        });   
        console.log(element,target);
    },
    treeParams: treeParams,
    'link_width': '4px',
    'link_color': '#2199e8',
});

function pushNewKey(addKey,NewVal){

        //tree[addKey] =  NewVal;
        tree[1][addKey] = NewVal;
        console.log('=>', tree);

        

        treeMaker(tree, {
            id: 'appDocTree',
            treeParams: treeParams,
            'link_width': '4px',
            'link_color': '#2199e8',
        });

        $("#tree__svg-container:nth(2)").remove();
        $("#tree__container:nth(2)").remove();

}

function addItem(parentValue, newKey, newValue) {
    
    console.log('before', JSON.stringify(tree))
  
    const parent = dfs(parentValue);
    if (!parent[parentValue] || parent[parentValue] === '') {
      parent[parentValue] = {};
    }
    parent[parentValue][newKey] = newValue;
    console.log('after', JSON.stringify(tree))
}
  
function dfs(value) {
    let collection = [tree];
  
    while (collection.length) {
      let node = collection.shift();
      if (Object.keys(node).includes(value)) return node;
      collection.unshift(...Object.values(node));
    }
    return null;
}