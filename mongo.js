var mongoose= require('mongoose');

mongoose.Promise= global.Promise;

var database= 'api';

const server = 'mongodb://'+process.env.IP+'/'+database;

console.log(server);

mongoose.connect (server);

const db= mongoose.connection;

const QuerySchema = new mongoose.Schema 
({
    
    searchkey:{type:String , required:true},
    count:{type:Number, required:true},
    results:[{type:String}]
    
});

const Query = mongoose.model('Query',QuerySchema);

exports.addQuery= (data,callback)=>
{
    console.log('addQuery()...');
    
    const newQuery= new Query({searchkey:data.query, count:data.data.length, results:JSON.stringify(data)});
    
    newQuery.save((err,data)=>
    {
       if(err)
         callback('error:'+err);
       else
         callback('Query Results saved');
       
    });
};

exports.clear=(callback)=>
{
    Query.remove({},err=>
    {
        if(err)
        {
            callback('error'+err);
        }
        
        callback('Queries deleted');
    });
};



