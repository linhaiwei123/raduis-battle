import WebSocket = require('ws');
import EventModule from './EventModule';
import Global from '../global/Global';
import Uuid from '../util/Uuid';
import { IReq, Code, ILoginReq, IUserInfo, ILoginRsp, IRsp, IWsItem } from '../typings/Common';
import Logger from '../decorator/Logger';
export default class NetWorkModule {
    
    private _port:number = 443;
    @Logger.log
    initialize() {
        this._initRef();
        this._initEvent();
    }

    private _wss:WebSocket.Server;
    @Logger.log
    private _initRef() {
        this._wss = new WebSocket.Server({port:this._port});
    }

    @Logger.log
    private _initEvent() {
        this._wss.on('connection',this._onConnection.bind(this));
    }

    @Logger.log
    private _onConnection(ws:WebSocket) {
        //保存wsItem
        let wsItem = {} as IWsItem; 
        wsItem.userId = Uuid.instance.create();
        wsItem.ws = <any>ws;
        Global.instance.dataModule.wsList.insert(<any>wsItem);
        
        ws.on('message',(dataReqString:string)=>{
            let dataReq:IReq = JSON.parse(dataReqString);
            if(dataReq.code === Code.loginReq) {
                //处理login req
                let req = dataReq.req as ILoginReq;
                let userInfoItem = {} as IUserInfo;
                userInfoItem.name = req.name;
                userInfoItem.userId = wsItem.userId;
                //todo 处理重连
                Global.instance.dataModule.userInfoList.insert(userInfoItem);
                //返回login rsp
                let rsp = {} as ILoginRsp;
                rsp.userId = userInfoItem.userId;
                let dataRsp = {} as IRsp;
                dataRsp.code = Code.loginRsp;
                dataRsp.rsp = rsp;
                wsItem.ws.send(JSON.stringify(dataRsp));
                return;
            }
            Global.instance.eventModule.emit(dataReq.code,dataReq.req);
        });
        ws.on('error',(err:Error) =>{
            console.log(err);
            Global.instance.dataModule.wsList.delete(<any>wsItem);
        })
        ws.on('close',(code:number,reason:string)=>{
            console.log({code,reason});
            Global.instance.dataModule.wsList.delete(<any>wsItem);
        })
    }

    @Logger.log
    public sendToUser(userId:string,rsp:IRsp) {
        let wsList = Global.instance.dataModule.wsList.select(item => item.userId === userId);
        if(wsList && wsList.length !== 0) {
            if(wsList[0].ws.readyState === WebSocket.OPEN){
                wsList[0].ws.send(JSON.stringify(rsp));
            }
        }
    }

    @Logger.log
    public sendToRoom(roomId:string,rsp:IRsp) {
        let gameInfoList = Global.instance.dataModule.gameInfoList.select(item => item.roomId === roomId);
        if(gameInfoList && gameInfoList.length !== 0) {
            gameInfoList[0].userInfoList.forEach(item => this.sendToUser(item.userId,rsp));
        }
    }
}