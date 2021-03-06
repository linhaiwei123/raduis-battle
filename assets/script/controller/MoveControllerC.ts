import JoyStickControllerC from "./JoyStickControllerC";
import GlobalC from "../global/GlobalC";
import { Code, IJoyStickInfo, JoyStickStatus, JoyStickType, IUserControllerItem,IPositionInfo,IMoveReq, IReq,IMoveRsp } from "../typings/CommonC";
import UserControllerC from "./UserControllerC";

const {ccclass, property} = cc._decorator;

@ccclass
export default class MoveControllerC extends cc.Component {

    onLoad() {
        this._initEvent();
    }

    private _initEvent() {
        GlobalC.instance.eventModuleC.on(Code.joyStickUpdate,this._onJoyStickUpdate,this);
        GlobalC.instance.eventModuleC.on(Code.moveRsp,this._onMoveRsp,this);
    }

    private _onMoveRsp(rsp: IMoveRsp) {
        if (rsp.userId !== GlobalC.instance.dataModuleC.selfUserId) {
            this._position = cc.v2(rsp.positionInfo);
            this._currUserCtrlItem = GlobalC.instance.dataModuleC.userCtrlList.select(item => item.userId === rsp.userId)[0];
            this._renderMove();
        }
    }

    onDestroy() {
        GlobalC.instance.eventModuleC.off(Code.joyStickUpdate,this._onJoyStickUpdate,this);
    }
    
    private _position:cc.Vec2;
    private _currUserCtrlItem:IUserControllerItem;
    private _direction:cc.Vec2;
    
    private _onJoyStickUpdate(joyStickInfo: IJoyStickInfo) {
        if (joyStickInfo.type == JoyStickType.move) {
            let fastUserId = GlobalC.instance.dataModuleC.gameInfo.fastestUserInfo.userId;
            let selfUserId = GlobalC.instance.dataModuleC.selfUserId;
            if (fastUserId === selfUserId) {
                this._currUserCtrlItem = GlobalC.instance.dataModuleC.userCtrlList.select(item => item.userId === selfUserId)[0];
                this._direction = joyStickInfo.direction.normalize();
                switch(joyStickInfo.status) {
                    case JoyStickStatus.start: {
                        this._scheduleMove();
                        break;
                    }
                    case JoyStickStatus.update: {
                        
                        break;
                    }
                    case JoyStickStatus.end: {
                        this._unscheduleMove();
                        break;
                    }
                }
            }
        }
    }

    private _scheduleMove() {
        
        this.schedule(this._moveTick,1/60);
    }

    private _unscheduleMove() {
        this.unschedule(this._moveTick);
    }

    private _calMoveNextPos() {
        let node = this._currUserCtrlItem.userCtrl.node;
        this._position =  cc.pAdd(node.position,this._direction.mul(this._currUserCtrlItem.userCtrl.speed));
    }

    private _moveTick() {
        this._calMoveNextPos();
        this._renderMove();
        if(this._currUserCtrlItem.userId === GlobalC.instance.dataModuleC.selfUserId){
            this._sendToServer();
        }
    }

    private _renderMove() {
        let node = this._currUserCtrlItem.userCtrl.node;
        node.position = this._position;
    }  

    private _sendToServer() {
        let moveReq = {} as IMoveReq;
        moveReq.positionInfo = {} as IPositionInfo;
        moveReq.positionInfo.x = this._position.x;
        moveReq.positionInfo.y = this._position.y;
        moveReq.roomId = GlobalC.instance.dataModuleC.gameInfo.roomId;
        moveReq.userId = GlobalC.instance.dataModuleC.selfUserId;
        let req = {} as IReq;
        req.code = Code.moveReq;
        req.req = moveReq;
        GlobalC.instance.networkModuleC.sendToServer(req);
    }
}
