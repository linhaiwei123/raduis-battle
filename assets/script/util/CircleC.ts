const {ccclass, property,requireComponent,executeInEditMode} = cc._decorator;

@ccclass
@requireComponent(cc.Graphics)
@executeInEditMode()
export default class CircleC extends cc.Component {

    private _radius:number = 64;

    @property()
    public set radius(v:number) {
        this._radius = v;
        this.draw();
    }
    public get radius():number {
        return this._radius;
    }

    onLoad() {
        this.draw();
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
