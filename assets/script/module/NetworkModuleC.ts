import LoggerC from "../decorator/LoggerC";
import { IReq, Code, ILoginReq, IUserInfo, IRsp } from "../typings/CommonC";
import GlobalC from "../global/GlobalC";


const {ccclass, property} = cc._decorator;

@ccclass
export default class NetworkModuleC extends cc.Component{
    
    private _port:number = 443;
    private _url:string = 'ws://localhost:'
    @LoggerC.log
    initialize() {
        this._initRef();
        this._initEvent();
    }

    private _ws:WebSocket
    @LoggerC.log
    private _initRef() {
        this._ws = new WebSocket(this._url + this._port);
    }

    @LoggerC.log
    private _initEvent() {
        this._ws.onopen = this._onConnection.bind(this);
    }

    @LoggerC.log
    private _onConnection() {
        this._ws.onmessage = this._onMessage.bind(this);
        this._ws.onerror = this._onError.bind(this);
        this._ws.onclose = this._onClose.bind(this);
    }

    @LoggerC.log
    private _onMessage(msg:MessageEvent) {
        let dataRsp:IRsp = JSON.parse(msg.data);
        GlobalC.instance.eventModuleC.emit(dataRsp.code,dataRsp.rsp); 
    }

    @LoggerC.log
    private _onError(msg:MessageEvent) {

    }

    @LoggerC.log
    private _onClose(msg:MessageEvent) {
    }

    public sendToServer(req:IReq) {
        this._ws.send(JSON.stringify(req));
    }
}
