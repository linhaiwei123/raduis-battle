import CircleC from "../util/CircleC";
import GlobalC from "../global/GlobalC";
import { Code, IJoyStickInfo, JoyStickType, JoyStickStatus } from "../typings/CommonC";

const {ccclass, property} = cc._decorator;

@ccclass
export default class JoyStickControllerC extends cc.Component {
    @property({
        type: cc.Enum(JoyStickType)
    })
    joyStickType:JoyStickType = JoyStickType.move

    @property(CircleC)
    circleBg:CircleC = null;

    @property(CircleC)
    circleStick:CircleC = null;

    @property()
    maxMoveRadius:number = 32;

    onLoad() {
        this.circleStick.node.on('touchstart',this._onTouchStart,this);
        this.circleStick.node.on('touchmove',this._onTouchMove,this);
        this.circleStick.node.on('touhend',this._onTouchEnd,this);
    }

    private _onTouchStart(e:cc.Event.EventTouch) {
        let localPos = this.circleStick.node.parent.convertToNodeSpaceAR(e.getLocation());
        let direction = localPos.normalize();
        let radio = Math.min(1,localPos.mag()/this.maxMoveRadius);
        this.circleStick.node.position = cc.pMult(direction,radio * this.maxMoveRadius);

        let joyStickInfo = {} as IJoyStickInfo;
        joyStickInfo.direction = direction;
        joyStickInfo.ratio = radio;
        joyStickInfo.type = this.joyStickType;
        joyStickInfo.status = JoyStickStatus.start
        GlobalC.instance.eventModuleC.emit(Code.joyStickUpdate,joyStickInfo);
    }

    private _onTouchMove(e:cc.Event.EventTouch) {
        let localPos = this.circleStick.node.parent.convertToNodeSpaceAR(e.getLocation());
        let direction = localPos.normalize();
        let radio = Math.min(1,localPos.mag()/this.maxMoveRadius);
        this.circleStick.node.position = cc.pMult(direction,radio * this.maxMoveRadius);

        let joyStickInfo = {} as IJoyStickInfo;
        joyStickInfo.direction = direction;
        joyStickInfo.ratio = radio;
        joyStickInfo.type = this.joyStickType;
        joyStickInfo.status = JoyStickStatus.update
        GlobalC.instance.eventModuleC.emit(Code.joyStickUpdate,joyStickInfo);
    }

    private _onTouchEnd(e:cc.Event.EventTouch) {
        //let localPos = this.circleStick.node.parent.convertToNodeSpaceAR(e.getLocation());
        let localPos = cc.v2();
        this.circleStick.node.position = localPos;
        
        let direction = localPos.normalize();
        let radio = Math.min(1,localPos.mag()/this.maxMoveRadius);

        let joyStickInfo = {} as IJoyStickInfo;
        joyStickInfo.direction = direction;
        joyStickInfo.ratio = radio;
        joyStickInfo.type = this.joyStickType;
        joyStickInfo.status = JoyStickStatus.end
        GlobalC.instance.eventModuleC.emit(Code.joyStickUpdate,joyStickInfo);
    }
}
