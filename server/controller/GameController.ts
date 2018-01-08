import { IUserInfo, IBaseInfo, ISkillInfo, IWeaponInfo, IPositionInfo, IGameInfo, IWindInfo, Code, IMoveReq, IMoveRsp, IRsp, IShootReq, IShootInfo, ISkillStatusInfo, ISkillHitStatusInfo } from "../../typing/Common";
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

    
    public createGame(userInfoList:Array<IUserInfo>) {
        let gameInfo = this._createGameInfo(userInfoList);
        Global.instance.dataModule.gameInfoList.insert(gameInfo);
        return gameInfo;
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
            userInfo.skillHitStatusInfoList = [];
        })
        return userInfoList;
    }

    private _createGameInfo(userInfoList:Array<IUserInfo>) {
        let gameInfo = {} as IGameInfo;
        gameInfo.roomId = Uuid.instance.create();
        gameInfo.windInfo = this._createWindInfo();
        gameInfo.userInfoList = this._createUserInfoGameContext(userInfoList);
        
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
        let gameInfoList = Global.instance.dataModule.gameInfoList.select(item => item.roomId === req.roomId);
        if(gameInfoList && gameInfoList.length !== 0) {
            let gameInfo = gameInfoList[0];
            if(req.round !== gameInfo.round) {
                return;
            }
            let userInfoList = gameInfo.userInfoList.filter(item => item.userId === req.userId);
             //更新玩家位置信息
            if(userInfoList && userInfoList.length !== 0) {
                let userInfo = userInfoList[0];
                userInfo.positionInfo = req.positionInfo;

                //插入技能状态
                let skillStatusInfo = {} as ISkillStatusInfo;
                skillStatusInfo.duration = req.skillInfo.duration;
                skillStatusInfo.shootPosition = this._getShootPosition(req.shootInfo,userInfo,gameInfo.windInfo);
                skillStatusInfo.skillInfo = req.skillInfo;
                skillStatusInfo.skillStatusId = Uuid.instance.create();
                skillStatusInfo.userInfo = userInfo;
                gameInfo.skillStatusInfoList.push(skillStatusInfo);

                //迭代计算技能比例，插入
                for(let skillStatusInfo of gameInfo.skillStatusInfoList) {
                    let shootRatioList = this._getShootRatioList(skillStatusInfo,gameInfo.userInfoList);
                    for(let i = 0,l = gameInfo.userInfoList.length; i < l; i++) {
                        if(shootRatioList[i] !== 0) {
                            let eachUserInfo = gameInfo.userInfoList[i];
                            if(eachUserInfo.skillHitStatusInfoList.filter(item => item.skillStatusId === skillStatusInfo.skillStatusId).length === 0){
                                let skillHitStatusInfo = {} as ISkillHitStatusInfo;
                                skillHitStatusInfo.hitDuration = skillStatusInfo.skillInfo.hitDuration;
                                skillHitStatusInfo.skillInfo = skillStatusInfo.skillInfo;
                                skillHitStatusInfo.skillStatusId = skillStatusInfo.skillStatusId;
                                skillHitStatusInfo.userInfo = skillStatusInfo.userInfo;
                                skillHitStatusInfo.ratio = shootRatioList[i];
                                eachUserInfo.skillHitStatusInfoList.push(skillHitStatusInfo);
                            }
                        }
                    }
                }

                //计算技能效果
                
            }
        }
    }

    private _getShootRatioList(skillStatusInfo:ISkillStatusInfo,userInfoList:Array<IUserInfo>):number[] {
        let ret:number[] = [];
        for(let userInfo of userInfoList) {
            let distance = Vector.instance.distance(userInfo.positionInfo,skillStatusInfo.shootPosition);
            let radiusDistance = userInfo.baseInfo.radius + skillStatusInfo.userInfo.weaponInfo.exploreRadius;
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