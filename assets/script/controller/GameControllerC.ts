import LoggerC from "../decorator/LoggerC";

const {ccclass, property} = cc._decorator;

@ccclass
export default class GameControllerC extends cc.Component {

    @LoggerC.log
    onLoad() {
        this.initialize();
    }

    @LoggerC.log
    initialize() {
        this._initEvent();
        this._initInteractive();
        this._initRender();
    }

    @LoggerC.log
    private _initEvent() {
        
    }

    @LoggerC.log
    private _initInteractive() {

    }

    @LoggerC.log
    private _initRender() {

    }
}
