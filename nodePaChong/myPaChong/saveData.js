var mongodb = require('./db')
var superagent = require('superagent');

let option = {
  'Host':	'www.lagou.com',
  'Connection': 'keep-alive',
  'User-Agent': 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:55.0) Gecko/20100101 Firefox/55.0',
  'Accept': 'application/json, text/javascript, */*; q=0.01',
  'Accept-Encoding': 'gzip, deflate, br',
  'Accept-Language': 'en-US,en;q=0.5',
  'Content-Type':	'application/x-www-form-urlencoded; charset=UTF-8',
  'Referer': 'https://www.lagou.com/jobs/list_%E5%89%8D%E7%AB%AF?px=default&city=%E4%B8%8A%E6%B5%B7',
  'Content-Length':	38,
  'Cookie': 'JSESSIONID=ABAAABAACDBAAIA3296F76B43BB525E8C7AC20B4BC86970; Hm_lvt_4233e74dff0ae5bd0a3d81c6ccf756e6=1503624871; Hm_lpvt_4233e74dff0ae5bd0a3d81c6ccf756e6=1503625700; _ga=GA1.2.2024936725.1503624871; user_trace_token=20170825093430-8a962c21-8935-11e7-8ecd-5254005c3644; LGSID=20170825093430-8a962fd2-8935-11e7-8ecd-5254005c3644; PRE_UTM=m_cf_cpt_baidu_pc; PRE_HOST=bzclk.baidu.com; PRE_SITE=http%3A%2F%2Fbzclk.baidu.com%2Fadrc.php%3Ft%3D06KL00c00fATEwT01lPm0FNkUsaBxGqu00000Fex4W300000ALnOUM.THL0oUhY1x60UWdBmy-bIfK15ymkryNBPA7hnj0snjPBuyR0IHdAn1NafYPjPYDLrRfYnbNDnjmsnj9AnH0snHw7nYuawfK95gTqFhdWpyfqn10zrHT3PjfsnausThqbpyfqnHm0uHdCIZwsT1CEQLILIz4_myIEIi4WUvYE5LNYUNq1ULNzmvRqUNqWu-qWTZwxmh7GuZNxTAn0mLFW5HRvPWDd%26tpl%3Dtpl_10085_15730_1%26l%3D1055317918%26attach%3Dlocation%253D%2526linkName%253D%2525E6%2525A0%252587%2525E9%2525A2%252598%2526linkText%253D%2525E3%252580%252590%2525E6%25258B%252589%2525E5%25258B%2525BE%2525E7%2525BD%252591%2525E3%252580%252591%2525E5%2525AE%252598%2525E7%2525BD%252591-%2525E4%2525B8%252593%2525E6%2525B3%2525A8%2525E4%2525BA%252592%2525E8%252581%252594%2525E7%2525BD%252591%2525E8%252581%25258C%2525E4%2525B8%25259A%2525E6%25259C%2525BA%2526xp%253Did%28%252522m2a05d072%252522%29%25252FDIV%25255B1%25255D%25252FDIV%25255B1%25255D%25252FDIV%25255B1%25255D%25252FDIV%25255B1%25255D%25252FH2%25255B1%25255D%25252FA%25255B1%25255D%2526linkType%253D%2526checksum%253D164%26ie%3Dutf-8%26f%3D3%26tn%3Dbaidu%26wd%3D%25E6%258B%2589%25E5%258B%25BE%25E7%25BD%2591%26rqlang%3Dcn%26inputT%3D2318%26prefixsug%3Dlagou%26rsp%3D0; PRE_LAND=https%3A%2F%2Fwww.lagou.com%2F%3Futm_source%3Dm_cf_cpt_baidu_pc; LGRID=20170825094819-7872a7ef-8937-11e7-8ecd-5254005c3644; LGUID=20170825093430-8a9631a1-8935-11e7-8ecd-5254005c3644; X_HTTP_TOKEN=45e2673911547c5103b8a7660638ca5e; _gid=GA1.2.1708461372.1503624873; index_location_city=%E5%85%A8%E5%9B%BD; TG-TRACK-CODE=index_navigation; SEARCH_ID=ee80bca9721f4daea91db2060ceff3c4'
};
let datas=[];
let length
function save(urls,city,position,callback){
  let url=urls.url;
  let page=urls.page;
  superagent.post(url)
            .send({
               'pn': page,
               'kd': position,
               'first': false
            })
           .set(option)
           .end((err,res)=>{
                let dataObj = JSON.parse(res.text);
                let posts=dataObj.content.positionResult.result;
                console.log('adsa')
                if(posts.length){
                  datas=datas.concat(posts);
                  console.log('第'+page+'页数据已保存');
                  length=datas.length;
                }else if(datas.length==length&&!posts.length){
                  marge();
                  length+=1;
                }
                callback(null, 'success');
           })
}
function marge(){
  mongodb.open(function(err,db){
     if(err){
       console.log('连接失败')
     }
     console.log('连接成功');
     db.collection('web',function(err,collection){
        if(err){
          mongodb.close();
          console.log(err)
        }
        collection.insertMany(datas,function(err,result){
           mongodb.close();
           if(err){
             mongodb.close();
           }else{
             console.log('数据已保存');
           }
        })
     })
 })
}
exports.save=save;
exports.option=option
