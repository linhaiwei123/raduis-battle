
import { IWsItem, IUserInfo, ISkillInfo, IWeaponInfo, IGameInfo, IUserControllerItem } from "../typings/CommonC";
import LoggerC from "../decorator/LoggerC";
const {ccclass, property} = cc._decorator;

@ccclass
export default class DataModuleC extends cc.Component{
    @LoggerC.log
    public initialize() {
        // this._initSkillInfoList();
        // this._initWeaponInfoList();
    }

    // @LoggerC.log
    // private _initSkillInfoList() {
    //     skillInfoList.forEach(skillInfo => {
    //         skillInfo.consume = <any>+skillInfo.consume;
    //         skillInfo.duration = <any>+skillInfo.duration;
    //         skillInfo.skillId = <any>+skillInfo.skillId;

    //         this.skillInfoList.insert(<any>skillInfo);
    //     })
    // }

    // @LoggerC.log
    // private _initWeaponInfoList() {
    //     weaponInfoList.forEach(weaponInfo => {
    //         weaponInfo.exploreRadius = <any>+weaponInfo.exploreRadius
    //         weaponInfo.shootRadius = <any>+weaponInfo.shootRadius
    //         weaponInfo.weaponId = <any>+weaponInfo.weaponId

    //         this.weaponInfoList.insert(<any>weaponInfo);
    //     })
    // }

    private _collectionMap:{[name:string]:Collection<any>} = {};
    
    @LoggerC.log
    public get<T>(name:string):Collection<T> {
        if(!this._collectionMap[name]){
            this._collectionMap[name] = new Collection<T>(name);
        }
        return this._collectionMap[name];
    }

    @LoggerC.log
    public drop(name:string) {
        if(this._collectionMap[name]) {
            this._collectionMap[name].clean();
            delete this._collectionMap[name];
        }
    }

    private _selfUserId:string = null;
    public set selfUserId(v:string) {
        this._selfUserId = v;
    }
    public get selfUserId():string {
        return this._selfUserId;
    }

    private _gameInfo:IGameInfo = null;
    public get gameInfo():IGameInfo {
        return this._gameInfo;
    }
    public set gameInfo(v:IGameInfo) {
        this._gameInfo = v;
    }

    public get userCtrlList() {
        return this.get<IUserControllerItem>('userCtrl');
    }

    private _skillInfo:ISkillInfo = null;

    public set skillInfo(v:ISkillInfo) {
        this._skillInfo = v;
    }       
    public get skillInfo():ISkillInfo {
        return this._skillInfo;
    }

    private _skillIdx:number = null;
    public get skillIdx():number {
        return this._skillIdx;
    }
    public set skillIdx(v:number) {
        this._skillIdx = v;
    }
}

class Collection<T> {
    private _documentList : Array<T> = [];
    private _name:string = null;
    public get name() {
        return this._name;
    }

    constructor(name:string) {
        this._name = name;
    }

    @LoggerC.log
    public select(filter:(item:T) => boolean):Array<T> {
        return this._documentList.filter(filter);
    }

    @LoggerC.log
    public update(filter:(item:T) => boolean,data:object) {
        let items = this.select(filter);
        let clone = Clone.instance;
        items.forEach(item => {
            clone.clone(<any>item,data);
        })
    }

    @LoggerC.log
    public insert(data:T) {
        this._documentList.push(data);
    }

    @LoggerC.log
    public delete(filter:(item:T) => boolean) {
        let items = this.select(filter);
        items.reverse().forEach(item => this._documentList.splice(this._documentList.indexOf(item),1));
    }

    @LoggerC.log
    public clean() {
        this._documentList = [];
    }
}
