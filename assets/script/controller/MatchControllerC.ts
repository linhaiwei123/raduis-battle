import LoggerC from "../decorator/LoggerC";
import GlobalC from "../global/GlobalC";
import { Code, IMatchRsp, IMatchReq, IReq } from "../typings/CommonC";

const {ccclass, property} = cc._decorator;

@ccclass
export default class MatchControllerC extends cc.Component {

    @property(cc.Button)
    matchButton:cc.Button = null;

    @LoggerC.log
    onLoad() {
        this.initialize();
    }

    @LoggerC.log
    initialize() {
        this._initEvent();
        this._initInteractive();
    }

    @LoggerC.log
    private _initEvent() {
        GlobalC.instance.eventModuleC.on(Code.matchRsp,this._onMatchRsp,this)
    }

    onDestroy() {
        GlobalC.instance.eventModuleC.off(Code.matchRsp,this._onMatchRsp,this)
    }

    @LoggerC.log
    private _onMatchRsp(rsp:IMatchRsp) {
        GlobalC.instance.dataModuleC.gameInfo = rsp.gameInfo;
        cc.director.loadScene('Game');
    }

    @LoggerC.log
    private _initInteractive() {
        this.matchButton.node.on('click',this._onMatchButtonClick,this);
    }

    private _isReady:boolean = false;
    private _onMatchButtonClick() {
            this._isReady = !this._isReady;
            this.matchButton.node.opacity = this._isReady?140:255;
            let matchReq = {} as IMatchReq;
            matchReq.matching = this._isReady;
            matchReq.userId = GlobalC.instance.dataModuleC.selfUserId;
            let req = {} as IReq;
            req.code = Code.matchReq;
            req.req = matchReq;
            GlobalC.instance.networkModuleC.sendToServer(req);
    }
}
