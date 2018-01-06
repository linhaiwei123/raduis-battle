import * as WebSocket from 'ws';
import EventModule from './EventModule';
import Global from '../global/Global';
import { IReq, Code, IUserInfo, ILoginReq, ILoginRsp, IRsp } from '../../typing/Common';
import Uuid from '../util/Uuid';
import { IWsItem } from '../typing/Server';
export default class NetWorkModule {
    
    private _port:number = 443;
    initialize() {
        this._initRef();
        this._initEvent();
    }

    private _wss:WebSocket.Server;
    private _initRef() {
        this._wss = new WebSocket.Server({port:this._port});
    }

    private _initEvent() {
        this._wss.on('connection',this._onConnection.bind(this));
    }

    private _onConnection(ws:WebSocket) {
        //保存wsItem
        let wsItem = {} as IWsItem;
        wsItem.userId = Uuid.instance.create();
        wsItem.ws = <any>ws;
        Global.instance.dataModule.wsList.insert(<any>wsItem);
        
        ws.on('message',(dataReq:IReq)=>{
            if(dataReq.code === Code.loginReq) {
                //处理login req
                let req = dataReq.req as ILoginReq;
                let userInfoItem = {} as IUserInfo;
                userInfoItem.name = req.name;
                userInfoItem.userId = wsItem.userId;
                Global.instance.dataModule.userInfoList.insert(userInfoItem);
                //返回login rsp
                let rsp = {} as ILoginRsp;
                rsp.userId = userInfoItem.userId;
                let dataRsp = {} as IRsp;
                dataRsp.code = Code.loginRsp;
                dataRsp.rsp = rsp;
                wsItem.ws.send(dataRsp);
                return;
            }
            Global.instance.eventModule.emit(dataReq.code,dataReq.req);
        });
        ws.on('error',(err:Error) =>{
            console.log(err);
        })
        ws.on('close',(code:number,reason:string)=>{
            console.log({code,reason});
        })
    }

    public sendToUser(userId:string,rsp:IRsp) {
        let wsList = Global.instance.dataModule.wsList.select(item => item.userId === userId);
        if(wsList && wsList.length !== 0) {
            wsList[0].ws.send(rsp);
        }
    }

    public sendToRoom(roomId:string,rsp:IRsp) {
        let gameInfoList = Global.instance.dataModule.gameContextInfoList.select(item => item.gameInfo.roomId === roomId);
        if(gameInfoList && gameInfoList.length !== 0) {
            gameInfoList[0].userInfoList.forEach(item => this.sendToUser(item.userId,rsp));
        }
    }
}