import { IUserInfo, IBaseInfo, ISkillInfo } from "../../typing/Common";

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
        return baseInfo;
    }

    private _createSkillInfo():ISkillInfo {
        //todo;
        let skillInfo = {} as ISkillInfo;
        return skillInfo;
    }
}