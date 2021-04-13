const jwt = require("jsonwebtoken");
const setting = require('../config/setting');

class jwtToken{
    static generateToken = (user, lifeTime)=>{
        const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET || setting.JWT_ACCESS_TOKEN;

        return new Promise( (resolve,reject)=>{
            const user_data = {
                id: user._id,
                fullname: user.first_name + " " + user.last_name,
                username: user.username,
                avatar: user.avatar
            }

            jwt.sign(
                {
                    data: user_data
                },
                accessTokenSecret,
                {
                    algorithm:  "HS256",
                    expiresIn: lifeTime,
                },
                (err,token)=>{
                    if(err){
                        reject(err);
                    }
                    resolve(token);
                }
            );
        })
    }

    static verifyToken = (token)=>{
        const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET || setting.JWT_ACCESS_TOKEN;

        return new Promise( (resolve,reject)=>{
            jwt.verify( token, accessTokenSecret , (err,decoded)=>{
                if(err)
                  reject(err)
                resolve(decoded);
            })
        })
    }

    static isAuth =  async (req,res,next)=>{
        const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET || setting.JWT_ACCESS_TOKEN;

        if( req.originalUrl.includes('/assets')){
            return next();
        }
 
        const tokenFromClient = req.query.token || req.body.token || req.headers['x-access-token'];
        if( tokenFromClient){
            this.verifyToken(tokenFromClient, accessTokenSecret)
            .then( (decoded)=>{
                req.jwtInfo = decoded;

                next();
            })
            .catch( (err)=>{
                res.status(401).json({
                    message: "Unauthorized"
                })
            })
        }else{
            res.status(403).json({
                message: "No token provided"
            })
        }
    }
}

module.exports = jwtToken;