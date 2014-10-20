/**
 * Created by Administrator on 2014/8/12 0012.
 */
 (function(){

     /*
      * ajax 封装
      * */
     var  ajax = function(config){
         var xhr = window.XMLHttpRequest ?
             new XMLHttpRequest() :
             new ActiveXObject('Microsofr.XMLHTTP');

         xhr.onreadystatechange = function(){
             if(xhr.readyState == 4 && xhr.status == 200){
                 config.success && config.success(xhr);
             }
         }

         if(config.method){
             xhr.open(config.method,config.url,true);
             config.method == 'get' ?
                 xhr.send() :
                 (xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded"),
                     xhr.send(serialize(config.data)));

         }

     };

     /*
      * 序列化
      * */
     var serialize = function(json){
         var str = '';
         for(var attr  in json){
             str +=  attr + '=' +json[attr] + '&';
         }
         return str.substr(0,str.length-1);
     }

     /*
      * 遍历元素
      * callback 会传入index,el 当前元素
      * this指向当前对象
      * */
     var each = function(array,callback){
         if (Object.prototype.toString.call(array) !== '[object Array]') return;
         for(var i= 0,len = array.length;i<len;i++){
             callback.call(array[i],i,array[i]);
         }
     }

     /*
     * 数据排序-按中文拼音字母
     * */
     var dataSort = function(data){
        return data.sort(function(a,b){
            return a.msg.localeCompare(b.msg);
        })
     }


     var autoAcomplete = function(targetId,dataId){

         var input = document.getElementById(targetId),
             dataUL = document.getElementById(dataId);

         input.onkeyup = function(event){
             ajax({
                 'method':'post',
                 'url':'http://localhost:63342/work/node-bootstarp/json.js',
                 'data':{
                     'name':input.value
                 },
                 'success':function(xhr){
                     //插入数据
                     var data = new Function( 'return ' + xhr.responseText)();
                     data = dataSort(data);
                     var frag = document.createDocumentFragment();
                     each(data,function(index,el){
                         var li = document.createElement('li');
                         li.innerHTML = el.msg;
                         frag.appendChild(li);
                     })
                     dataUL.style.display = 'block';
                     dataUL.innerHTML = '';
                     dataUL.appendChild(frag);
                 }
             })
         };
     }

     window.autoAcomplete = autoAcomplete;
 })()

