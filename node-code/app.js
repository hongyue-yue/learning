var express=require("express");
var path=require("path");
var fs=require("fs");
var qr = require('qr-image');

var app=express();
app.use(express.static(path.join(__dirname,"public")));

app.get('/create_qrcode',function(req,res,next){
   var text = req.query.text;
  try {
      var img = qr.image(text,{size :10,type:"png"});
      res.writeHead(200, {'Content-Type': 'image/png'});
      img.pipe(res);
      img.pipe(fs.createWriteStream(path.join(__dirname,"public/image/"+text+".png")))
  } catch (e) {

  }
})

app.listen(8090, function() {
     console.log('Express server listening on port 8090' );
});
