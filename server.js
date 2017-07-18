
var restify= require('restify');
//var cors= require('cors');
var server= restify.createServer();
//server.use(restify.fullResponse());
//server.use(restify.queryParse());
//server.use(restify.bodyParser());
//server.use(restify.authorizationParser());

var places= require('./search.js');
var db= require('./mongo.js');

//var allowCrossDomain = function(req, res, next) 
//{
    //res.header('Access-Control-Allow-Origin', '*');
    //res.header('Access-Control-Allow-Methods', 'GET,OPTIONS,HEAD,PUT,POST,DELETE,PATCH');
    //res.header('Access-Control-Allow-Headers', 'origin, x-http-method-override, accept, content-type, authorization, x-pingother, if-match, if-modified-since, if-none-match, if-unmodified-since, x-requested-with');
    //res.header('Access-Control-Expose-Headers', 'tag, link, X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset, X-OAuth-Scopes, X-Accepted-OAuth-Scopes');
   // next();
//};

//module.exports = function allowCORS()
//{

 // return allowCrossDomain;

//};

//server.use(cors());

server.del('/places',function(req,res)

{
    console.log('DELETE/library');
    
    db.clear(dbResult=>
    {
        console.log('mongo:'+db.Result);
        res.setHeader('content-type','application/json');
        
        res.send(202,'Query cache deleted');
        
        res.end();
        
    });

});



server.get('/places',function(req,res)
{
    
   console.log('GET/places');
   
   const searchTerm= req.query.q;
   console.log('q='+searchTerm);
   
   if(!searchTerm)
   {
       console.log('No found');
      
       res.setHeader('content-type','application/json');
       res.send(400,'Query is empty');
       res.end();
       return;
   }
   
   db.getByQuery(searchTerm, function (data)
   
   {
       if(data!= null)
       {
           var jdata= JSON.parse(data.results);
           console.log('use persisted data');
           res.setHeader('content-type','application/json');
           res.send(jdata.code, jdata.data);
           res.end();
       }
       else
       {
           places.search(searchTerm, function(placeData)
           
           {
               console.log(placeData.message);
               res.setHeader('content-type','application/json');
               res.status(placeData.code);
               
               res.send(placeData.code,placeData.data);
               
               res.end();
               
               placeData.query= searchTerm;
               
               db.addQuery(placeData,dbResult=>
               {
                   console.log('mongo:'+dbResult);
                   
               });
               
           });
           
       }
       
   });
   
  
});

var port = 8081;
server.listen(port, function (err) {
  if (err) {
      console.error(err);
  } else {
    console.log('App is ready at : ' + port);
  }
});
