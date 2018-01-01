import * as WebSocket from 'ws';
class NetWorkModule {
    private _wss:WebSocket.Server;
    private _port:number = 443;
    initialize() {
        this._initRef();
        this._initEvent();
        
    }

    private _initRef() {
        this._wss = new WebSocket.Server({port:this._port});
    }

    private _initEvent() {
        this._wss.on('connection',this._onConnection.bind(this));
    }

    private _onConnection(ws:WebSocket) {
        ws.on('message',(data:WebSocket.Data)=>{
            
        });
        ws.on('error',(err:Error) =>{
            console.log(err);
        })
        ws.on('close',(code:number,reason:string)=>{
            console.log({code,reason});
        })
    }
}