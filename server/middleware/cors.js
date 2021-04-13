class Cors{
  constructor(port){
    this.port = port;
  }

  enable = (req,res,next)=>{
    // if( req.originalUrl.includes("/api") ){
        res.setHeader('Access-Control-Allow-Origin',"*");
        res.setHeader('Access-Control-Allow-Methods','GET,HEAD,OPTIONS,POST,PUT');
        res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Methods,Access-Control-Allow-Origin, Access-Control-Allow-Headers');
    //}
    next();
  }
}

module.exports = Cors;