import NetworkModule from "../module/NetworkModule";
import EventModule from "../module/EventModule";
import DataModule from "../module/DataModule";

const {ccclass,property} = cc._decorator;

export default class Global extends cc.Component {

    onLoad() {
        cc.game.addPersistRootNode(this.node);
        this.initialize();
    }


    private _networkModule:NetworkModule
    public get networkModule():NetworkModule {
        return this._networkModule;
    }
    private _eventModule:EventModule;
    public get eventModule():EventModule {
        return this._eventModule;
    }
    private _dataModule:DataModule;
    public get dataModule():DataModule {
        return this._dataModule;
    }
    initialize() {
        this._eventModule = this.node.addComponent(EventModule);
        this._eventModule.initialize();
        this._networkModule = this.node.addComponent(NetworkModule);
        this._networkModule.initialize();
        this._dataModule = this.node.addComponent(DataModule);
        this._dataModule.initialize();
    }
}