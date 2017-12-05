function Stack(){  //栈构造函数
	var items=[];
	this.push=function(element){//添加
		items.push(element)
	};
	this.pop=function(){//移除栈顶的元素
		return items.pop();
	};
	this.peek=function(){//返回栈顶的元素
        return items[items.length-1]
	};
	this.isEmpty=function(){//栈里没有任何元素就返回true，否则返回false;
          return items.length=0;
	};
	this.size=function(){ //返回栈里的所有元素;
		return items.length;
	}
	this.clear=function(){//移除栈里所有元素
		items=[];
	};
	this.print=function(){//将栈转string打印出来
		console.log(items.toString());
	};

}

function divideBy2(decNumber){  //十进制转二进制
   var remStack=new Stack(),rem,binaryString='';
   while(decNumber>0){
   	 rem=Math.floor(decNumber%2);
   	 remStack.push(rem);
   	 decNumber=Math.floor(decNumber/2)
   }
   while(!remStack.isEmpty()){
   	binaryString+=remStack.pop().toString();
   }
   return binaryString;
}
console.log(divideBy2(233))

function baseConverter(decNumber,base){
  var remStack=new Stack(),rem,baseString='',digits='0123456789ABCDEF';
  while(decNumber>0){
  	rem=Math.floor(decNumber%base);
  	remStack.push(rem);
  	decNumber=Matn.floor(decNumber/base);
  }
  while(!remStack.isEmpty()){
  	baseString+=digits[remStack.pop()]
  }
  return baseString;
}
console.log(baseConverter(100345,2)) //转二进制
console.log(baseConverter(100345,8)) //转八进制
console.log(baseConverter(100345,16)) //转十六进制

function Queue(){
  var items=[];
  this.enqueue=function(element){
    items.push(element)
  };
  this.dequeue=function(){
    return items.shift();
  };
  this.front=function(){
    return items[0];
  };
  this.isEmpty=function(){
    return items.length=0;
  };
  this.size=function(){
    return items.length;
  };
  this.print=function(){
    console.log(items.toString())
  }
}
function PriorityQueue(){ //优先队列
  var items=[];
  function QueueElement(element,priority){
   this.element=element;
   this.priority=priority;
  };
  this.enqueue=function(element,priority){
    var queueElement=new QueueElement(ele,priority);
    if(this.isEmpty()){
      items.push(queueElement);
    }else{
      var added=false;
      for(var i=0;i<items.length;i++){
        if(queueElement.priority<items[i].priority){
          items.splice(i,0,queueElement)
          added=true;
          break;
        }
        if(!added){
          items.push(queueElement)
        }
      }
    }
  }
}

function hotPotata(nameList,num){//击鼓传花
  var queue=new Queue();
  for(var i=0;i<nameList.length;i++){
    queue.enqueue(nameList[i])
  }
  var eliminated='',
  while(queue.size>1){
    for(var i=0;i<num;i++){
      queue.enqueue(queue.dequeue())
    }
    eliminated=queue.dequeue();
    console.log(eliminated+'在击鼓传花游戏中被淘汰');
  }
  return queue.dequeue()
}
var names=['john','jack','camila','ingrid','carl'];
var winner=hotPotata(names,7);
console.log('胜利者'+winner);

function LinkedList(){ //链表
  var Node=function(element){
    this.element=element;
    this.next=null;
  }
  var length=0;
  var head=null;
  this.append=function(element){
    var node =new Node(element),current;
    if(head===null){
      head=node;
    }else{
      current=head;
      while(current.next){
        current=current.next;
      }
      current.next=node;
    }
    length++;
  };
  this.insert=function(position,element){
    if(position>=0&&position<=length){
      var node=new Node(element),current=head,previous,index=0;
      if(position===0){
        node.next=current;
        head=node;
      }else{
        while(index++<position){
          previous=current;
          current=current.next;
        }
        node.next=current;
        previous.next=node;
      }
      length++;
      return true;
    }else{
      return false;
    }
  };
  this.removeAt=function(position){
    if(position>-1&&position<length){
      var current=head,previous,index=0;
      if(position===0){
        head=current.next;
      }else{
        while(index++<position){
          previous=current;
          current=current.next;
        }
        previous.next=current.next;
      }
      length--;
      return current.element
    }else{
      return null;
    }
  };
  this.remove=function(element){
    var index=this.indexOf(element);
    return this.removeAt(index);
  };
  this.indexOf=function(element){
    var current=head,index=-1;
    while(current){
      if(element===current.element){
        return index;
      }
      index++;
      current=current.next;
    }
    return -1;
  };
  this.isEmpty=function(){
    return length===0
  };
  this.size=function(){
    return length
  };
  this.toString=function(){
    var current=head,string='';
    while(current){
      string+=","+current.element;
      current=current.next;
    }
    return string.slice(1);
  };
}

function DoublyLinkedList(){
  var Node=function(element){
    this.element=element;
    this.next=null;
    this.prev=null;
  }
  var length=0;
  var head=null;
  var tail=null;
  this.insert=function(position,element){
    if(position>=0&&position<=length){
      var node=new Node(element),current=head,previous,index=0;
      if(position===0){
        if(!head){
          head=node;
          tail=node;
        }else{
          node.next=current;
          current.prev=node;
          head=node;
        }
      }else if(position===length){
        current=tail;
        current.next=node;
        node.prev=current;
        tail=node;
      }else{
        while(index++<position){
          previous=current;
          current=current.next;
        }
        node.next=current;
        previous.next=node;
        current.prev=node;//新增
        node.prev=previous;//新增
      }
      length++;
      return true;
    }else{
      return false;
    }
  }
  this.removeAt=function(position){
    if(position>-1&&position<length){
      var current=head,previous,index=0;
      if(position===0){
        head=current.next;
        if(length===1){
          tail=null;
        }else{
          head.prev=null;
        }
      }else if(position===length-1){
        current=tail;
        tail=current.prev;
        tail.next=null;
      }else{
        while(index++<position){
          previous=current;
          current=current.next;
        }
        previous.next=current.next;
        current.next.prev=previous
      }
      length--;
      return current.element;
    }else{
      return null
    }
  }
}

function Set(){//集合
  var items={};
  this.has=function(value){
       return items.hasOwnProperty(value);
  };
  this.add=function(value){
       if(!this.has(value)){
        items[value]=value;
        return true;
       }
       return false;
  };
  this.remove=function(value){
      if(this.has(value)){
        delete items[value];
        return true;
      }
      return false;
  };
  this.clear=function(value){
    items={};
  };
  this.size=function(){
    return Object.keys(items).length;
  };
  this.value=function(){
    return Object.keys(items)
  };
  this.union=function(otherSet){//并集
    var unionSet=new Set();
    var value=this.values();
    for(let i=0;i<values.length;i++){
      unionSet.add(values[i])
    }
    values=otherSet.values();
    for(var i=0;i<values.length;i++){
      unionSet.add(values[i])
    }
    return unionSet;
  };
  this.intersection=function(otherSet){//合集
    var intersectionSet=new Set();
    var values=this.values();
    for(var i=0;i<values.length;i++){
      if(otherSet.has(values[i])){
        intersectionSet.add(values[i])
      }
    }
    return intersectionSet
  };
  this.difference=function(otherSet){//差集
    var differenceSet=new Set();
    var values=this.values();
    for(var i=0;i<values.length;i++){
      if(!otherSet.has(values[i])){
        differenceSet.add(values[i])
      }
    }
    return differenceSet
  };
  this.subset=function(otherSet){
    if(this.size()>otherSet.size()){
      return false
    }else{
      var values=this.values()
      for(var i=0;i<values.length;i++){
        if(!otherSet.has(values[i])){
          return false;
        }
      }
      return true;
    }
  };
}


function Dictionary(){   //字典
  var item={};
  this.has=function(key){
     return key in items;
  }
  this.set=function(key,value){
     items[key]=value;
  }
  this.remove=function(key){
     if(this.has(key)){
       delete items[key];
       return true;
     }
     return false
  }
  this.get=function(key){
    return this.has(key)?items[key]:undefined;
  }
  this.values=function(){
     var values=[];
     for(var k in items){
      if(this.has(k)){
        values.push(items[k])
      }
     }
     return values;
  }
  this.getItems=function(){
     return items;
  }
}

var dictionary= new Dictionary();
dictionary.set('Gandalf','gandalf@email.com');

function HashTable(){//散列表
  var table=[];
  var loseloseHashCode=function(key){
     var hash=0;
     for(var i=0;i<key.length;i++){
       hash+=key.charCodeAt(i);
     }
     return hash%37;
  }
  var ValuePair=function(key,value){
     this.key=key;
     this.value=value;
     this.toString=function(){
       return '['+this.key+'-'+this.value+']'
     }
  }
  this.put=function(key,value){
    var position=loseloseHashCode(key);
    if(table[position]==undefined){
      table[position]=new LinkedList();
    }
    table[position].append(new ValuePair(key,value));
  }
  this.get=function(key){
    var position=loseloseHashCode(key);
    if(table[position]!==undefined){
      var current=table[position].getHead();
      while(current.next){
        if(current.element.key===key){
          return current.element.value
        }
        current=current.next;
      }
      if(current.element.key===key){
         return current.element.value;
      }
    }
    return undefined;
  }
  this.remove=function(key){
    var position=loseloseHashCode(key);
    if(table[position]!==undefined){
      var current=table[position].getHead();
      while(current.next){
        if(current.element.key===key){
          table[position].remove(current.element);
          if(table[position].isEmpty()){
            table[position]=undefined;
          }
          return true
        }
        current=current.next;
      }
      if(current.element.key===key){
        table[position].remove(current.element);
        if(table[position].isEmpty()){
           table[position]=undefined
        }
        return true;
      }
    }
    return false;
  }
  
}

function BinarySearchTree(){ //二叉树
  var Node=function(key){
      this.key=key;
      this.left=null;
      this.right=null;
  }
  var root=null;
  var insertNode=function(node,newNode){
    if(newNode.key<node.key){
      if(node.left===null){
        node.left=newNode
      }else{
        insertNode(node.left,newNode)
      }
    }else{
      if(node.right===null){
        node.right=newNode
      }else{
        insertNode(node.right,newNode)
      }
    }
  }
  var inOrderTraverseNode=function(node,callback){
    if(node!==null){
      inOrderTraverseNode(node.left,callback)
      callback(node.key)
      inOrderTraverseNode(node.right,callback)
    }
  }
  var preOrderTraverseNode=function(node,callback){
    if(node!==null){
      callback(node.key)
      preOrderTraverseNode(node.left,callback)
      preOrderTraverseNode(node.right,callback)
    }
  }
  var postOrderTraverseNode=function(node,callback){
      if(node!==null){
        postOrderTraverseNode(node.left,callback);
        postOrderTraverseNode(node.right,callback);
        callback(node.key)
      }
  }
  var minNode=function(node){
     if(node){
        while(node&&node.left!==null){
          node=node.left
        }
        return node.key
     }
     return null;
  }
  var maxNode=function(node){
    if(node){
       while(node&&node.right!==null){
         node=node.right
       }
       return node.key
    }
    return key
  }
  var searchNode=function(node,key){
    if(node===null){
      return false;
    }
    if(key<node.key){
      return searchNode(node.left,key)
    }else if(key>node.key){
      return searchNode(node.right,key)
    }else{
      return true
    }
  }
  var findMinNode=function(){node}{
     if(node){
        while(node&&node.left!==null){
          node=node.left
        }
        return node
     }
     return null;
  }
  var removeNode=function(node,key){
    if(node===null){
      return null
    }
    if(key<node.key){
      node.left=removeNode(node.left,key)
      return node
    }else if(key>node.key){
      node.right=removeNode(node.right,key)
      return node
    }else{
      if(node.left===null&&node.right===null){
        node=null
        return node;
      }
      if(node.left===null){
        node=node.right;
        return node
      }else if(node.right===null){
        node=node.left
        return node;
      }
      var aux=findMinNode(node.right);
      node.key=aux.key
      node.right=removeNode(node.right,aux.key)
      return node
    }
  }
  this.insert=function(key){
    var newNode=new Node(key);
    if(root===null){
      root=newNode;
    }else{
      insertNode(root,newNode)
    }
  }
  this.inOrderTraverse=function(callback){ //中序遍历
    inOrderTraverseNode(root,callback);
  }
  this.preOrderTraverse=function(callback){//先序遍历
     preOrderTraverseNode(root,callback)
  }
  this.postOrderTraverse=function(callback){//后续遍历
     postOrderTraverseNode(root,callback)
  }
  this.min=function(){//最小值
    return minNode(root)
  }
  this.max=function(){//最大值
    return maxNode(root)
  }
  this.search=function(key){//搜索
    return searchNode(root,key)
  }
  this.remove=function(key){//移除
    root=removeNode(root,key)
  }
}

function Graph(){
  var vertices=[];
  var adjList=new Dictionary();
  var initializeColor=function(){
    var color=[];
    for(var i=0;i<vertices.length;i++){
      color[vertices[i]]='white'
    }
    return color;
  }
  var dfsVisit=function(u,color,callback){
      color[u]='grey';
      if(callback){
        callback(u)
      }
      var neighbors=adjList.get(u);
      for(var i=0;i<neighbors.length;i++){
        var w=neighbors[i];
        if(color[w]==='white'){
          dfsVisit(w,color,callback);
        }
      }
    color[u]='black'
  }
  var DFSVisit=function(u,color,d,f,p){
     color[u]='grey';
     d[u]=++time;
     var neighbors=adjList.get(u);
     for(var i=0;i<neighbors.length;i++){
       var w=neighbors[i];
       if(color[w]==='white'){
         p[w]=u;
         DFSVisit(w,color,d,f,p);
       }
     }
     color[u]='black';
     f[u]=++time;
  }
  this.addVertex=function(v){
    vertices.push(v)
    adjList.set(v,[]);
  }
  this.addEdge=function(v,w){
    adjList.get(v).push(w);
    adjList.get(w).push(v)
  }
  this.toString=function(){
    var s='';
    for(var i=0;i<vertices.length;i++){
      s+=vertices[i]+'->';
      var neighbors=adjList.get(vertices[i]);
      for(var j=0;j<neighbors.length;j++){
        s+=neighbors[j]+' ';
      }
      s+='\n';
    }
    return s;
  }
  
  this.bfs=function(v,callback){//广度优先搜索算法
    var color=initializeColor(),
        queue=new Queue();
    queue.enqueue(v);
    while(!queue.isEmpty()){
      var u=queue.dequeue(),
          neighbors=adjList.get(u);
          color[u]='grey';
      for(var i=0;i<neighbors.length;i++){
        var w=neighbors[i];
        if(color[w]==='white'){
          color[w]='grey';
          queue.enqueue(w)
        }
      }
      color[u]='black';
      if(callback){
        callback(u)
      }
    }
  }
  this.BFS=function(v){ //改进后的广度优先搜索算法
    var color=initializeColor();
        queue=new Queue();
        d=[];
        pred=[];
    queue.enqueue(v);
    for(var i=0;i<vertices.length;i++){
      d[vertices[i]]=0;
      pred[vertices[i]]=null;
    }
    while(!queue.isEmpty()){
      ver u=queue.dequeue(),
          neighbors=adjList.get(u);
      color[u]='grey';
      for(i=0;i<neighbors.length;i++){
        var w=neighbors[i]
        if(color[w]=='white'){
          color[w]='grey';
          d[w]=d[u]+1;
          pred[w]=u;
          queue.enqueue(w);
        }
      }
      color[u]='black';
    }
    return {
      distances:d,
      predecessors:pred
    }
  }
  this.dfs=function(callback){
    var color=initializeColor();
    for(var i=0;i<vertices.length;i++){
       if(color[vertices[i]]==='white'){
         dfsVisit(vertices[i],color,callback)
       }
    }
  }
  this.DFS=function(){
    var color=initializeColor(),
        d=[],
        f=[],
        p=[];
    time=0;
    for(var i=0;i<vertices.length;i++){
      f[vertices[i]]=0;
      d[vertices[i]]=0;
      p[vertices[i]]=null;
    }
    for(i=0;i<vertices.length;i++){
      if(color[vertices[i]]==='white'){
        DFSVisit(vertices[i],color,d,f,p);
      }
    }
    return{
       discovery:d,
       finished:f,
       predecessors:p
    }
  }
}

function ArrayList(){   //排序
   var array=[];
   var swap=function(index1,index2){
     var aux=array[index1];
     array[index1]=array[index2];
     array[index2]=aux
   }
   this.insert=function(item){
     array.push(item);
   }
   this.toString=function(){
     return array.join();
   }
   this.bubbleSort=function(){ //冒泡排序
      var length=array.length;
      for(var i=0;i<length-1;i++){
         for(var j=0;j<length-1;j++){
           if(array[j]>array[j+1]){
             swap(j,j+1)
           }
         }
      }
   }
   this.modifiedBubbleSort=function(){  //改进冒泡排序
     var length=array.length;
     for(var i=0;i<length;i++){
       for(var j=0;j<length-1-i;j++){
          if(array[j]>array[j+1]){
             swap(j,j+1)
          }
       }
     }
   }
   this.selectionSort=function(){ //选择排序算法
     var length=array.length,indexMin;
     for(var i=0;i<length-1;i++){
        indexMin=i;
        for(var j=i;j<length;j++){
           if(array[indexMin]>array[j]){
             indexMin=j;
           }
        }
        if(i!==indexMin){
          swap(i,indexMin);
        }
     }
   }
   this.insertionSort=function(){
      var length=array.length,j,temp;
      for(var i=1;i<length;i++){
        j=i;temp=array[i];
        while(j>0&&array[j-1]>temp){
          array[j]=array[j-1]
          j--;
        }
        array[j]=temp;
      }
   }
   this.quickSort(){  //快速排序
     if(array.length<=1) return array;
     let item=array[0];
     let leftArr=[];
     let rightArr=[];
     for(let i=1;i<array.length;i++){
        if(array[i]>item) rightArr.push(array[i])
        else leftArr.push(array[i])
     }
     return [].concat(this.quickSort(leftArr),[item],this.quickSort(rightArr))
   }
   var mergeSortRec=function(array){
      var length=array.length;
      if(length===1){
        return array;
      }
      var mid=Math.floor(length/2),
          left=array.slice(0,mid),
          right=array.slice(mid,length);
      return merge(mergeSortRec(left),mergeSortRec(right));
   }
   var merge=function(left,right){
      var result=[],il=0,ir=0;
      while(il<left.length&&ir<right.length){
        if(left[il]<right[ir]){
          result.push(left][il+1])
        }else{
          result.push(right[ir+1])
        }
      }
      while(il<left.length){
        result.push(left[il+1]);
      }
      while(ir<right.length){
        result.push(right[ir++])
      }
      return result;
   }
   this.mergeSort=function(){ //归并排序
     array=mergeSortRec(array)
   }
   this.sequentialSearch=function(item){ //顺序搜索
     for(var i=0;i<array.length;i++){
       if(item===array[i]){
         return i
       }
     }
     return -1;
   }
   this.binarySearch=function(item){ //二分搜索
     this.quickSort();
     var low=0,high=array.length-1,mid,element;
     while(low<=high){
       mid=Math.floor((low+high)/2);
       element=array[mid];
       if(element<item){
         low=mid+1;
       }else if(element>item){
         high=mid-1;
       }else{
         return mid
       }
     }
     return -1
   }
}

function MinCoinChange(coins){ //硬币找零算法
   var coins=coins;
   var cache={};
   this.makeChange=function(amount){
     var me=this;
     if(!amount){
       return [];
     }
     if(cache[amount]){
       return cache[amount]
     }
     var min=[],newMin,newAmount;
     for(var i=0;i<coins.length;i++){
       var coin=coins[i];
       newAmount=amount-coin;
       if(newAmount>=0){
         newMin=me.makeChange(newAmount);
       }
       if(newAmount>=0&&(newMin.length,min.length-1||!min.length)&&(newMin.length||!newAmount)){
         min=[coin].concat(newMin);
         console.log('new Min'+min+'for'+amount)
       }
     }
     return (cache[amount]=min);
   }
}

function MinCoinChangeTwo(coins){
   var coins=coins;
   this.makeChange=function(amount){
     var change=[],total=0;
     for(var i=coins.length;i>=0;i--){
       var coin=coins[i];
       while(total+coin<=amount){
         change.push(coin);
         total+=coin;
       }
     }
     return change;
   }
}



function calender(arr){  //日历算法
  var str='2017/10/6'
  var strArray = str.split('-');

  var $tbody = $('#tbody');
  $tbody.empty();
  var $currentDate = $('#currentDate');
  var $tbody = $('#tbody');
  var $currentDate = $('#currentDate');
  var dayArray = [];
  $currentDate.text(strArray[0] + '年' + strArray[1] + '月');

  var monthFirst = new Date(strArray[0],strArray[1] - 1,1).getDay();//当前月第一天星期几

  var currentMon = new Date(strArray[0],strArray[1],0);
  var totalDay = currentMon.getDate(); //获取当前月的天数

  var monthLast = new Date(strArray[0],strArray[1] - 1,totalDay).getDay();//当前月最后一天星期几
  var parMon = new Date(strArray[0],strArray[1] - 1,0);
  var parTotalDay = parMon.getDate();//前一个月天数

  //console.log(str,monthFirst,totalDay,monthLast,parTotalDay)
  for(var i = parTotalDay - monthFirst + 1; i<=parTotalDay; i++){
    dayArray.push({color:'#9a9a9a',day:i,tody:false,indexOf:false})
  }

  for(var j = 1; j<totalDay + 1; j++){
    arr.indexOf(j)
    if(j == strArray[2] && arr.indexOf(j) !== -1){
      dayArray.push({color:'#fff',day:j,tody:true,indexOf:true})
    }else if(j == strArray[2] && arr.indexOf(j) === -1){
      dayArray.push({color:'#fff',day:j,tody:true,indexOf:false})
    }else if(j != strArray[2] && arr.indexOf(j) !== -1){
      dayArray.push({color:'#333332',day:j,tody:false,indexOf:true})
    }else if(j != strArray[2] && arr.indexOf(j) === -1){
      dayArray.push({color:'#333332',day:j,tody:false,indexOf:false})
    }
  }
  for(var m = 1; m<7 - monthLast; m++){
    dayArray.push({color:'#9a9a9a',day:m,tody:false,indexOf:false})
  }
  //console.log(dayArray,arr)
  var html = ''
  for(var n = 0; n<dayArray.length; n++){
    if(dayArray[n].tody && dayArray[n].indexOf){
      html += '<li style="color:' + dayArray[n].color + '"><div class="background">' + dayArray[n].day + '<span class="arrow arrowColor1"></span></div></li>';
    }else if(dayArray[n].tody && !(dayArray[n].indexOf)){
      html += '<li style="color:' + dayArray[n].color + '"><div class="background">' + dayArray[n].day + '</div></li>';
    }else if(!(dayArray[n].tody) && dayArray[n].indexOf){
      html += '<li style="color:' + dayArray[n].color + '"><div>' + dayArray[n].day + '<span class="arrow arrowColor2"></span></div></li>';
    }else if(!(dayArray[n].tody) && !(dayArray[n].indexOf)){
      html += '<li style="color:' + dayArray[n].color + '"><div>' + dayArray[n].day + '</div></li>'
    }
  }
  $tbody.html(html)
} 