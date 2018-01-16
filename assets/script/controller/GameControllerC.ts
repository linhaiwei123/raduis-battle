import LoggerC from "../decorator/LoggerC";
import GlobalC from "../global/GlobalC";
import { IUserControllerItem } from "../typings/CommonC";
import UserControllerC from "./UserControllerC";

const {ccclass, property} = cc._decorator;

@ccclass
export default class GameControllerC extends cc.Component {

    public get userContainer():cc.Node {
        return this.node;
    }

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
        const resModuleC = GlobalC.instance.resModuleC;
        const dataModuelC = GlobalC.instance.dataModuleC;
        const userCtrlList = dataModuelC.userCtrlList;
        resModuleC.getUserPrefab((userPrefab) => {
            //初始化玩家位置 信息
            const gameInfo = dataModuelC.gameInfo;
            for (const userInfo of gameInfo.userInfoList) {
                const userNode = cc.instantiate(userPrefab);
                //渲染到界面上
                this.userContainer.addChild(userNode);
                userNode.position = cc.v2(userInfo.positionInfo);

                //插入dataModule
                let userCtrlItem = {} as IUserControllerItem;
                userCtrlItem.userCtrl = userNode.getComponent(UserControllerC);
                userCtrlItem.userId = userInfo.userId;
                userCtrlList.insert(userCtrlItem);
                
            }
        })
    }
}
