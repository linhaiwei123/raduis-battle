import { IUserInfo, IBaseInfo, ISkillInfo, IWeaponInfo, IPositionInfo } from "../../typing/Common";

class GameController  {
    initialize() {
        this._initEvent();
    }

    private _initEvent() {

    }

    public createRoomContext(roomId:string,userInfoList:Array<IUserInfo>) {
        
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
        return skillInfo;
    }

    //武器信息
    private _createWeaponInfo():IWeaponInfo {
        //todo;
        let weaponInfo = {} as IWeaponInfo;
        return weaponInfo;
    }

    //位置信息
    private _createPositionInfo():IPositionInfo {
        //todo;
        let positionInfo = {} as IPositionInfo;
        return positionInfo;
    }
}