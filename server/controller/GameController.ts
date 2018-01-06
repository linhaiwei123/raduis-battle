import { IUserInfo, IBaseInfo, ISkillInfo, IWeaponInfo, IPositionInfo, IGameContextInfo, IGameInfo, IWindInfo, Code, IMoveReq, IMoveRsp, IRsp, IShootReq, IShootInfo, ISkillStatusInfo } from "../../typing/Common";
import Global from "../global/Global";
import Clone from "../util/Clone";
import Uuid from "../util/Uuid";
import Vector from "../util/Vector";

export default class GameController  {
    initialize() {
        this._initEvent();
    }

    private _initEvent() {
        Global.instance.eventModule.on(Code.moveReq,this._onMoveReq,this);
        Global.instance.eventModule.on(Code.shootReq,this._onShootReq,this);
    }

    
    public createGameContext(userInfoList:Array<IUserInfo>) {
        let gameContextInfo = {} as IGameContextInfo;
        this._createUserInfoGameContext(userInfoList);
        gameContextInfo.gameInfo = this._createGameInfo();
        gameContextInfo.userInfoList = userInfoList;
        Global.instance.dataModule.gameContextInfoList.insert(gameContextInfo);
        return gameContextInfo;
    }

    private _createUserInfoGameContext(userInfoList:Array<IUserInfo>) {
        userInfoList.forEach(userInfo => {
            userInfo.baseInfo = this._createBaseInfo();
            userInfo.positionInfo = this._createPositionInfo();
            userInfo.weaponInfo = this._createWeaponInfo();
            userInfo.skillInfoList = [];
            for(let i =0,l = 3;i < l;i++) {
                userInfo.skillInfoList.push(this._createSkillInfo());
            }
            userInfo.skillStatusInfoList = [];
        })
    }

    private _createGameInfo() {
        let gameInfo = {} as IGameInfo;
        gameInfo.roomId = Uuid.instance.create();
        gameInfo.windInfo = this._createWindInfo();
        return gameInfo;
    }

    private _createWindInfo() {
        let windInfo = {} as IWindInfo;
        windInfo.windAngle = Math.floor((Math.random()*2-1) * 180);
        windInfo.windPower = Math.floor(Math.random() * 7);
        return windInfo;
    }

    private _createBaseInfo():IBaseInfo {
        let baseInfo = {} as IBaseInfo;
        baseInfo.hp = 100;
        baseInfo.atk = 5;
        baseInfo.def = 2;
        baseInfo.agl = 3;
        baseInfo.radius = 50;
        baseInfo.power = 0;
        return baseInfo;
    }

    //技能信息
    private _createSkillInfo():ISkillInfo {
        //todo;
        let skillInfo = {} as ISkillInfo;
        let skillInfoList = Global.instance.dataModule.skillInfoList.select(v => true);
        let randomSkillInfo = skillInfoList[Math.floor(Math.random() * skillInfoList.length)];
        Clone.instance.clone(skillInfo,randomSkillInfo);
        return skillInfo;
    }

    //武器信息
    private _createWeaponInfo():IWeaponInfo {
        //todo;
        let weaponInfo = {} as IWeaponInfo;
        let weaponInfoList = Global.instance.dataModule.weaponInfoList.select(v => true);
        let randomWeaponInfo = weaponInfoList[Math.floor(Math.random() * weaponInfoList.length)];
        Clone.instance.clone(weaponInfo,randomWeaponInfo);
        return weaponInfo;
    }

    //位置信息
    private _createPositionInfo():IPositionInfo {
        //todo;
        let positionInfo = {} as IPositionInfo;
        positionInfo.x = Math.random() * 1280;
        positionInfo.y = Math.random() * 720;
        return positionInfo;
    }

    private _onMoveReq(req:IMoveReq) {
        //不插入位置信息 仅仅保留在客户端
        let moveRsp = {} as IMoveRsp;
        moveRsp.positionInfo = req.positionInfo;
        moveRsp.userId = req.userId;
        let dataRsp = {} as IRsp;
        dataRsp.code = Code.moveRsp;
        dataRsp.rsp = moveRsp;

        Global.instance.networkModule.sendToRoom(req.roomId,dataRsp);
    }

    private _onShootReq(req:IShootReq) {
        //获取房间信息
        let gameContextInfoList = Global.instance.dataModule.gameContextInfoList.select(item => item.gameInfo.roomId === req.roomId);
        if(gameContextInfoList && gameContextInfoList.length !== 0) {
            let gameContextInfo = gameContextInfoList[0];
            let userInfoList = gameContextInfo.userInfoList.filter(item => item.userId === req.userId);
             //更新玩家位置信息
            if(userInfoList && userInfoList.length !== 0) {
                let userInfo = userInfoList[0];
                userInfo.positionInfo = req.positionInfo;

                //计算射击位置
                let shootPosition = this._getShootPosition(req.shootInfo,userInfo,gameContextInfo.gameInfo.windInfo);
                //计算效果比例
                let shootRatioList = this._getShootRatioList(shootPosition,userInfo.weaponInfo,gameContextInfo.userInfoList)
                //插入技能状态列表
                this._insertSkillStatus(gameContextInfo.userInfoList,shootRatioList,shootPosition,req.skillInfo,req.userId);
            }
        }
    }

    private _insertSkillStatus(userInfoList:Array<IUserInfo>,shootRatioList:number[],shootPosition:IPositionInfo,skillInfo:ISkillInfo,userId:string) {
        for(let i = 0,l = shootRatioList.length; i < l; i++) {
            if(shootRatioList[i] !== 0) {
                let skillStatusInfo = {} as ISkillStatusInfo;
                skillStatusInfo.duration = skillInfo.duration;
                skillStatusInfo.skillInfo = skillInfo;
                skillStatusInfo.userId = userId;
                skillStatusInfo.radio = shootRatioList[i];
                skillStatusInfo.shootPosition = shootPosition;
                userInfoList[i].skillStatusInfoList.push(skillStatusInfo);
            }
        }
    }

    private _getShootRatioList(shootPosition:IPositionInfo,weaponInfo:IWeaponInfo,userInfoList:Array<IUserInfo>):number[] {
        let ret:number[] = [];
        for(let userInfo of userInfoList) {
            let distance = Vector.instance.distance(userInfo.positionInfo,shootPosition);
            let radiusDistance = userInfo.baseInfo.radius + weaponInfo.exploreRadius;
            if(distance > radiusDistance) {
                ret.push(0);
            }else{
                ret.push(distance/radiusDistance);
            }
        }
        return ret;
    }

    private _getShootPosition(shootInfo:IShootInfo,userInfo:IUserInfo,windInfo:IWindInfo):IPositionInfo {
        let positionInfo = userInfo.positionInfo;
        let shootDirectionOffset = this._getShootDirectionOffset(shootInfo,userInfo.weaponInfo.shootRadius);
        let windOffset = this._getWindOffset(windInfo);
        positionInfo.x = shootDirectionOffset.x + windOffset.x;
        positionInfo.y = shootDirectionOffset.y + windOffset.y;
        return positionInfo;
    }

    private _getShootDirectionOffset(shootInfo:IShootInfo,length:number):IPositionInfo {
        let positionInfo = {} as IPositionInfo;
        //客户端反向
        let radian = Vector.instance.deg2rad(shootInfo.angle);
        positionInfo.x = length * shootInfo.ratio * Math.cos(radian);
        positionInfo.y = length * shootInfo.ratio * Math.sin(radian);
        return positionInfo;
    }

    private _getWindOffset(windInfo:IWindInfo):IPositionInfo {
        let length = windInfo.windPower * 27;
        let positionInfo = {} as IPositionInfo;
        let radian = Vector.instance.deg2rad(windInfo.windAngle)
        positionInfo.x = length * Math.cos(radian);
        positionInfo.y = length * Math.sin(radian);
        return positionInfo;
    }

    //速度计算
    // maxPower = 10 currPower;
    // duration = (maxPower - currPower)/maxSpeed;
    // other currPower = duartion * currSpeed + currPower;
}