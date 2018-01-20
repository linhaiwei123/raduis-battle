import GlobalC from "../global/GlobalC";
import { Code, IJoyStickInfo, JoyStickType, IUserControllerItem, JoyStickStatus, IShootReq, IPositionInfo, IShootInfo, IReq,IShootRsp } from "../typings/CommonC";

const {ccclass, property} = cc._decorator;

@ccclass
export default class ShootControllerC extends cc.Component {
    onLoad() {
        this._initEvent();
    }

    private _initEvent() {
        GlobalC.instance.eventModuleC.on(Code.shootRsp,this._onShootRsp,this);
        GlobalC.instance.eventModuleC.on(Code.joyStickUpdate,this._onJoyStickUpdate,this);
    }
    private _currUserCtrlItem:IUserControllerItem;
    private _ratio:number;
    private _direction:cc.Vec2;

    private _onShootRsp(rsp:IShootRsp) {
        GlobalC.instance.dataModuleC.gameInfo = rsp.gameInfo;
        this._renderShoot(rsp);
    }

    private _onJoyStickUpdate(joyStickInfo: IJoyStickInfo) {
        if (joyStickInfo.type == JoyStickType.shoot) {
            let fastUserId = GlobalC.instance.dataModuleC.gameInfo.fastestUserInfo.userId;
            let selfUserId = GlobalC.instance.dataModuleC.selfUserId;
            if (fastUserId === selfUserId) {
                this._currUserCtrlItem = GlobalC.instance.dataModuleC.userCtrlList.select(item => item.userId === selfUserId)[0];
                this._ratio = joyStickInfo.ratio;
                this._direction = joyStickInfo.direction;
                switch(joyStickInfo.status) {
                    case JoyStickStatus.start: {
                        this._renderShootLine();
                        break;
                    }
                    case JoyStickStatus.update: {
                        this._renderShootLine();
                        break;
                    }
                    case JoyStickStatus.end: {
                        this._shoot();
                        break;
                    }
                }
            }
        }
    }

    private _renderShootLine() {
        let selfUserId = GlobalC.instance.dataModuleC.selfUserId;
        let userInfo = GlobalC.instance.dataModuleC.gameInfo.userInfoList.filter(item => item.userId === selfUserId)[0];
        let lineLength = userInfo.weaponInfo.shootRadius;
        let shootGraphic = this._currUserCtrlItem.userCtrl.shootGraphic;
        shootGraphic.clear();
        shootGraphic.moveTo(0,0);
        let dstPos = this._direction.mul(this._ratio * lineLength);
        shootGraphic.lineTo(dstPos.x,dstPos.y);
        shootGraphic.stroke();
        shootGraphic.fill();
    }

    private _shoot() {
        this._cleanShootLine();
        if(GlobalC.instance.dataModuleC.selfUserId === this._currUserCtrlItem.userId){
            this._sendToServer()
        }
    }

    private _cleanShootLine() {
        let shootGraphic = this._currUserCtrlItem.userCtrl.shootGraphic;
        shootGraphic.clear();
    }

    private _sendToServer() {
        let userCtrl = this._currUserCtrlItem.userCtrl;
        let shootReq = {} as IShootReq;
        shootReq.positionInfo = {} as IPositionInfo;
        shootReq.positionInfo.x = userCtrl.node.x;
        shootReq.positionInfo.y = userCtrl.node.y;
        shootReq.roomId = GlobalC.instance.dataModuleC.gameInfo.roomId;
        shootReq.round = GlobalC.instance.dataModuleC.gameInfo.round;
        shootReq.shootInfo = {} as IShootInfo;
        shootReq.shootInfo.ratio = this._ratio;
        shootReq.shootInfo.angle = cc.pToAngle(this._direction);
        shootReq.skillIndex = GlobalC.instance.dataModuleC.skillIdx;
        shootReq.skillInfo = GlobalC.instance.dataModuleC.skillInfo;
        shootReq.userId = GlobalC.instance.dataModuleC.selfUserId;

        let req = {} as IReq;
        req.code = Code.shootReq;
        req.req = shootReq;
        GlobalC.instance.networkModuleC.sendToServer(req);
    }

    private _renderShoot(rsp:IShootRsp) {
        let shootGraphic = this._currUserCtrlItem.userCtrl.shootGraphic;
        shootGraphic.moveTo(0,0);
        //todo draw weapon throw

        let ctrlPos =  cc.pForAngle(rsp.shootInfo.angle).mul(rsp.shootInfo.ratio * rsp.gameInfo.userInfoList.filter(item => item.userId == rsp.userId)[0].weaponInfo.shootRadius);

        //test
        shootGraphic.bezierCurveTo(ctrlPos.x,ctrlPos.y,ctrlPos.x,ctrlPos.y,rsp.shootPosition.x,rsp.shootPosition.y);
    }
}
