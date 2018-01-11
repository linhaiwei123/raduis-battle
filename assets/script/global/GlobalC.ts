import NetworkModuleC from "../module/NetworkModuleC";
import DataModuleC from "../module/DataModuleC";
import EventModuleC from "../module/EventModuleC";
import LoggerC from "../decorator/LoggerC";

const {ccclass, property} = cc._decorator;
@ccclass
export default class GlobalC extends cc.Component {
    private static _instance:GlobalC;
    public static get instance():GlobalC {
        return GlobalC._instance;
    }

    @LoggerC.log
    onLoad() {
        cc.game.addPersistRootNode(this.node);
        GlobalC._instance = this;
        this.initialize();
    }

    private _networkModuleC:NetworkModuleC;
    public get networkModuleC():NetworkModuleC {
        return this._networkModuleC;
    }
    private _dataModuleC:DataModuleC;
    public get dataModuleC():DataModuleC {
        return this._dataModuleC;
    }
    private _eventModuleC:EventModuleC;
    public get eventModuleC():EventModuleC {
        return this._eventModuleC;
    }
    
    @LoggerC.log
    public initialize() {
        this._eventModuleC = this.node.addComponent(EventModuleC);
        this._eventModuleC.initialize();
        (<any>window)._eventModuleC = this._eventModuleC;

        this._dataModuleC = this.node.addComponent(DataModuleC);
        this._dataModuleC.initialize();
        (<any>window)._dataModuleC = this._dataModuleC;

        this._networkModuleC = this.node.addComponent(NetworkModuleC);
        this._networkModuleC.initialize();
        (<any>window)._networkModuleC = this._dataModuleC;
    }
}
