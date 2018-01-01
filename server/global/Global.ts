import EventModule from "../module/EventModule";
import NetWorkModule from "../module/NetworkModule";

export default class Global {
    private static _instance:Global = null;
    public static get instance():Global {
        return Global._instance;
    }

    private _eventModule:EventModule;
    public get eventModule():EventModule{
        return this._eventModule;
    }
    private _networkModule:NetWorkModule;
    public get networkModule():NetWorkModule {
        return this._networkModule;
    }
    initialize() {
        this._initInstance();
        this._initModule();
        this._initController();
    }

    private _initInstance() {
        Global._instance = this;
    }

    private _initModule() {
        this._eventModule = new EventModule();
        this._eventModule.initialize();

        this._networkModule = new NetWorkModule();
        this._networkModule.initialize();
    }

    private _initController() {

    }
}

new Global().initialize();

