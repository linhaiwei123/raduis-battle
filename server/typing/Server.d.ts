export interface IEventMapList {
    [event:number]:Array<IEventItem>
}

export interface IEventItem {
    handler:Function,
    target:any
}

export interface IWsItem {
    userId:string,
    ws:WebSocket,
}