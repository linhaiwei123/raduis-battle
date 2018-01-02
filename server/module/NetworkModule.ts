import * as WebSocket from 'ws';
import EventModule from './EventModule';
import Global from '../global/Global';
import { IReq } from '../../typing/Common';
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
        ws.on('message',(data:IReq)=>{
            Global.instance.eventModule.emit(data.code,data.req);
        });
        ws.on('error',(err:Error) =>{
            console.log(err);
        })
        ws.on('close',(code:number,reason:string)=>{
            console.log({code,reason});
        })
    }

    //todo clients getter
}