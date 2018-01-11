import GlobalC from "../global/GlobalC";
import { Code, ILoginRsp, ILoginReq, IReq } from "../typings/CommonC";
import LoggerC from "../decorator/LoggerC";


const {ccclass, property} = cc._decorator;

@ccclass
export default class LoginControllerC extends cc.Component {
    @property(cc.EditBox)
    nameEditBox:cc.EditBox = null;

    @property(cc.Button)
    loginButton:cc.Button = null;

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
    private _initInteractive() {
        this.loginButton.node.on('click',this._onLoginButtonClick,this);
    }


    @LoggerC.log
    private _onLoginButtonClick() {
        let name = this.nameEditBox.string;
        if(name !== null && name.length !== 0){
            this.loginButton.interactable = false;
            let loginReq = {} as ILoginReq;
            loginReq.name = name;
            let req = {} as IReq;
            req.code = Code.loginReq;
            req.req = loginReq;
            GlobalC.instance.networkModuleC.sendToServer(req);
        }
    }

    @LoggerC.log
    private _initEvent() {
        GlobalC.instance.eventModuleC.on(Code.loginRsp,this._onLoginRsp,this); 
    }

    @LoggerC.log
    private _onLoginRsp(rsp:ILoginRsp) {
        GlobalC.instance.dataModuleC.selfUserId = rsp.userId;
        cc.director.loadScene('Match');
    }
}
