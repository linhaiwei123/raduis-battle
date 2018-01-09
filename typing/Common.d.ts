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
    gameInfo:IGameInfo
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
    //skillStatusInfoList:Array<ISkillStatusInfo>
    skillHitStatusInfoList:Array<ISkillHitStatusInfo>,
    userStatusFlags:IUserStatusFlags,
}

export interface IUserStatusFlags {
    silence:number,//沉默
    freeze:number,//冰冻
    constraint:number,//束缚
    blind:number,//致盲
    poison:number,//中毒
    hide:number,//隐身
    shackles:number,//枷锁
    weak:number,//弱化
    atkup:number,//加攻
    defup:number,//加防
    aglup:number,//加敏
    chaos:number,//混乱
    sleep:number,//昏睡
    stone:number,//石化
    forget:number,//遗忘
    dice:number,//骰子
    rebound:number,//反弹
    invalid:number,//无效
    reverse:number,//反向
}

export interface ISkillHitStatusInfo {
    //skillStatusId:string,
    skillStatusInfo:ISkillStatusInfo,
    hitDuration:number,
    //skillInfo:ISkillInfo,
    //userInfo:IUserInfo,
    ratio:number,
    step:SkillHitStatusStep,
}

export enum SkillHitStatusStep {
    start = 0,
    update = 1,
    end = 2
}

export interface IBaseInfo {
    hp:number,//血量
    atk:number,//攻击
    def:number,//防御
    agl:number,//敏捷
    radius:number,//半径
    power:number,//体力
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
    duration:number,
    hitDuration:number,
    consume:number,
}

export interface IMoveReq {
    userId:string,
    roomId:string,
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
    roomId:string,
    positionInfo:IPositionInfo,
    shootInfo:IShootInfo,
    skillInfo:ISkillInfo,
    skillIndex:number,
    round:number,
}

export interface IShootInfo {
    ratio:number,
    angle:number,
}

export interface IShootRsp {
    userId:string,
    shootInfo:IShootInfo,
    skillInfo:ISkillInfo,
    shootPosition:IPositonInfo,
    gameInfo:IGameInfo,
}

export interface IGameInfo {
    roomId:string,
    windInfo:IWindInfo,
    skillStatusInfoList:Array<ISkillStatusInfo>,
    userInfoList:Array<IUserInfo>,
    round:number,
}

export interface IWindInfo {
    windAngle:number,
    windPower:number,
}

export interface ISkillStatusInfo {
    skillStatusId:string,
    skillInfo:ISkillInfo,
    duration:number,
    shootPosition:IPositionInfo,
    userInfo:IUserInfo
}


