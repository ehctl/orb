const e = require("express");
const setting = require("../config/setting");

module.exports = class Updater{
    constructor(){
        this.updateQueue = [];
        this.pendingUpdateQueue = [];

        setInterval( ()=>{  
            if( this.updateQueue.length > 0){
                for(let i=0 ; i< this.updateQueue.length ; i++){
                    if( !this.updateQueue[i].res.headersSent){
                        this.updateQueue[i].res.sendStatus(200);
                    }

                    this.updateQueue.splice( i,1);
                }
            }
       
        }, setting.UDPATE_TIMEOUT)
    }

    newUpdateRequest = (req,res)=>{
        try{
            var t = this.searchUpdateQueue(req.jwtInfo.data.id);
            if(t){
                t.res = res;
            }else{
                var pending = this.searchPendingUpdateQueue(req.jwtInfo.data.id); 
                if(pending){
                    res.status(200).send(JSON.stringify(pending.message));
                    this.pendingUpdateQueue.splice( this.pendingUpdateQueue.indexOf( pending),1);
                }else{
                    this.updateQueue.push({
                        user_id: req.jwtInfo.data.id,
                        res: res,
                    })
                }
            }
        }catch(e){
            console.log(e);
            res.sendStatus(400);
        }
    }

    sendMessageToAllOnlineMembers = ( member ,payload)=>{
        for(let i=0 ; i<member.length ; i++){
            try{
                let user = this.searchUpdateQueue( member[i]);
                if( user){
                    if( !user.res.headersSent){
                        user.res.send(payload);
                        this.updateQueue.splice( this.updateQueue.indexOf(user) , 1);
                    }
                }
                throw 'a';
            }catch(e){
                if( e === 'a'){
                    this.pendingUpdateQueue.push({
                        user_id: member[i],
                        message: payload,
                    })
                }
            }
            
        }
    }
    
    searchUpdateQueue = (user_id)=>{
        var t = null;
        for(var i=0 ; i< this.updateQueue.length ; i++){
            if( user_id == this.updateQueue[i].user_id){
                t = this.updateQueue[i];
                break;
            }
        }
        return t;

    }

    searchPendingUpdateQueue = (user_id)=>{
        var t = null;
        for(var i=0 ; i< this.pendingUpdateQueue.length ; i++){
            if( user_id == this.pendingUpdateQueue[i].user_id){
                t = this.pendingUpdateQueue[i];
                break;
            }
        }
        return t;
    }
}