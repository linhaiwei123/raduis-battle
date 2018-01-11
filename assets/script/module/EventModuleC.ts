import { IEventMapList } from "../typings/CommonC";
import LoggerC from "../decorator/LoggerC";
const {ccclass, property} = cc._decorator;

@ccclass
export default class EventModuleC extends cc.Component{
    private _eventMapList:IEventMapList
    @LoggerC.log
    initialize() {
        this._eventMapList = {};
    }

    @LoggerC.log
    public on(event:number|string,handler:Function,target:any) {
        if(!this._eventMapList[event]){
            this._eventMapList[event] = [];
        }
        this._eventMapList[event].push({handler,target});
    }

    @LoggerC.log
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

    @LoggerC.log
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

    @LoggerC.log
    public emit(event: number, args:any, target?:any) {
        if(this._eventMapList[event]) {
            this._eventMapList[event].forEach((item, i)=>{
                if(!target || item.target === target){
                    item.handler.call(item.target,args)
                }
            });
        }
    }

}
