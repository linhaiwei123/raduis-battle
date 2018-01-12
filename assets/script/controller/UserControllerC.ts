const {ccclass, property} = cc._decorator;

@ccclass
export default class UserControllerC extends cc.Component {
    @property()
    speed:number = 2;

    @property(cc.Graphics)
    shootGraphic:cc.Graphics = null;

    onLoad() {

    }
}
