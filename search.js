var request = require('request');

exports.search=function(query,callback)
{
    
    if(typeof query!=='string'|| query.length===0)
    {
        
        callback({code:400,message:'missing query(q parameter)'});
    }
    
    const url='https://maps.googleapis.com/maps/api/place/textsearch/json';
    
    const query_string={q:query, maxResults:40,fields:'items(name,address,rating,price_level),key:AIzaSyAd1xMYT1bt99qtFWQEzXiRBvORDWHgPtk'};
    
    request.get({url:url,qs:query_string},function(err,res,body)
    {
        if(err)
        {
            console.log('Search failed');
            return callback({code:500,message:'internal server error',data:err});
        }
    
    console.log(typeof body);
    
    const json= JSON.parse(body);
    
    const items= json.items;
    
    const places = items.map (function (place)
    
    {
        
    return {name:place.name , address:place.formatted_address, rating:place.rating,price: place.price_level};
    
    });
    
    callback({code:200,message:'Success',data:places});
    
});

};





    
   
  




