import { IUserInfo, IBaseInfo, ISkillInfo, IWeaponInfo, IPositionInfo } from "../../typing/Common";
import Global from "../global/Global";
import Clone from "../util/Clone";

class GameController  {
    initialize() {
        this._initEvent();
    }

    private _initEvent() {
        
    }

    public createGameContext(roomId:string,userInfoList:Array<IUserInfo>) {
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

    private _createBaseInfo():IBaseInfo {
        let baseInfo = {} as IBaseInfo;
        baseInfo.hp = 100;
        baseInfo.atk = 5;
        baseInfo.def = 2;
        baseInfo.agl = 3;
        baseInfo.radius = 50;
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
}