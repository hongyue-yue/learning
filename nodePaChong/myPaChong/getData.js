const superagent = require('superagent');
const async = require('async');
const saveData=require('./saveData');
function getData(city, position){
  let ok = 0;
  let page = 1;
  let urls = [];
  let url='https://www.lagou.com/jobs/positionAjax.json?px=default&city='+city+'&needAddtionalResult=false&isSchoolJob=0';
  console.log(city,position);
  async.series([
     (cb) => {
       console.log(url);
       superagent
          .post(url)
          .send({
                    'pn': page,
                    'kd': position,
                    'first': false
                 })
           .set(saveData.option)
           .end((err, res) => {
               if(err) console.log(err)
               let dataObj = JSON.parse(res.text);
               console.log('111')
               if (dataObj.success === true) {
                 console.log('222')
                   page=Math.ceil(dataObj.content.positionResult.totalCount / 15);
                   cb(null, page);
               } else {
                   console.log('获取数据失败,' + res.text);
               }
           });
     },
     (cb)=>{

       for (let i = 1; i <= page; i++) {
           urls.push({url:'https://www.lagou.com/jobs/positionAjax.json?px=default&city='+city+'&needAddtionalResult=false&isSchoolJob=0',page:i})
       }
       console.log(`${city}的${position}职位共${page}条数据，${urls.length}页`);
       cb(null, urls);
     },
     (cb)=>{
       async.mapLimit(urls, 3, (url, callback) => {
           saveData.save(url,city,position,callback);
       }, (err, result) => {
           if (err) throw err;
           if (result) {
               ok = 1;
           }
           cb(null, ok)
       });
     }
  ],(err,result) =>{
     if(ok) console.log(city+'的数据请求完成')
  })
}

exports.getData=getData;
