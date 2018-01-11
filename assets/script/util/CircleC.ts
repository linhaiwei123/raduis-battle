const {ccclass, property,requireComponent} = cc._decorator;

@ccclass
@requireComponent(cc.Graphics)
export default class CircleC extends cc.Component {

    @property()
    public radius:number = 128;

    @property()
    public set test(v:boolean) {
        this.draw();
    }
    public get test():boolean {
        return false;
    }

    public draw() {
        let radius = this.radius;
        let ctx = this.getComponent(cc.Graphics);
        ctx.clear();
        ctx.circle(this.node.width *this.node.anchorX,this.node.height *this.node.anchorY,radius);
        ctx.fill();
        ctx.stroke();
    }
}
