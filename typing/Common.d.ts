export enum Code {
    //登陆
    loginReq = 1,
    loginRsp = 2,

    //匹配
    matchReq = 6,
    matchRsp = 7,

    //玩法
    moveReq = 8,
    moveRsp = 9,

    shootReq = 10,
    shootRsp = 11,
}

export interface IReq {
    code:Code,
    req:any,
}

export interface IRsp {
    code:Code,
    rsp:any,
}

export interface ILoginReq {
    name:string,
}

export interface ILoginRsp {
    userId:string,
}

export interface IMatchReq {
    userId:string,
    matching:boolean,
}

export interface IMatchRsp {
    roomId:string,
    //玩家信息列表
    userInfoList:Array<IUserInfo>
}

export interface IUserInfo {
    userId:string,
    roomId:string,
    matching:boolean,
    name:string,
    baseInfo:IBaseInfo,
    weaponInfo:IWeaponInfo,
    skillInfoList:Array<ISkillInfo>,
    positionInfo:IPositionInfo,
    skillStatusInfoList:Array<ISkillStatusInfo>
}

export interface IBaseInfo {
    hp:number,//血量
    atk:number,//攻击
    def:number,//防御
    agl:number,//敏捷
}

export interface IWeaponInfo {
    weaponId:number,
    shootRadius:number,
    exploreRadius:number,
}

export interface ISkillInfo {
    skillId:number,
    skillName:string,
    skillDesc:string,
}

export interface IMoveReq {
    userId:string,
    positionInfo:IPositionInfo,
}

export interface IPositionInfo {
    x:number,
    y:number,
}

export interface IMoveRsp {
    userId:string,
    positionInfo:IPositionInfo
}

export interface IShootReq {
    userId:string,
    positionInfo:IPositionInfo,
    shootInfo:IShootInfo,
    skillInfo:ISkillInfo,
}

export interface IShootInfo {
    ratioX:number,
    ratioY:number,
}

export interface IShootRsp {
    userId:string,
    positionInfo:IPositionInfo,
    shootInfo:IShootInfo,
    skillInfo:ISkillInfo,
    gameInfo:IGameInfo,
}

export interface IGameInfo {
    roomId:string,
    windInfo:IWindInfo,
}

export interface IWindInfo {
    windAngle:number,
    windPower:number,
}

export interface ISkillStatusInfo {
    skillId:number,
    userId:string,
    duration:number,
}


