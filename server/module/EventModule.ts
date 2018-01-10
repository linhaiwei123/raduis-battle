import { IEventMapList } from "../typings/Server";
import Logger from "../decorator/Logger";
export default class EventModule {

    private _eventMapList:IEventMapList
    @Logger.log
    initialize() {
        this._eventMapList = {};
    }

    @Logger.log
    public on(event:number|string,handler:Function,target:any) {
        if(!this._eventMapList[event]){
            this._eventMapList[event] = [];
        }
        this._eventMapList[event].push({handler,target});
    }

    @Logger.log
    public off(event: number, handler: Function, target: any) {
        if (this._eventMapList[event]) {
            let iList = [];
            this._eventMapList[event].forEach((item,i) => {
                if (item.handler === handler && item.target === target) {
                    iList.push(i);
                }
            })
            iList.reverse().forEach(i => this._eventMapList[event].splice(i,1));
        }
    }

    @Logger.log
    public targetOff(target: any) {
        for (let event in this._eventMapList) {
            let iList = [];
            this._eventMapList[event].forEach((item, i) => {
                if (item.target === target) {
                    iList.push(i);
                }
            })
            iList.reverse().forEach(i => this._eventMapList[event].splice(i, 1));
        }
    }

    @Logger.log
    public emit(event: number, args:any, target?:any) {
        if(this._eventMapList[event]) {
            this._eventMapList[event].forEach((item, i)=>{
                if(!target || item.target === target){
                    item.handler.apply(item.target,args)
                }
            });
        }
    }

}