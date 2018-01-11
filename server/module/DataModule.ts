import Clone from "../util/Clone";
import skillInfoList from '../excel/skill';
import weaponInfoList from '../excel/weapon';
import { IUserInfo, ISkillInfo, IWeaponInfo, IGameInfo, IWsItem } from "../typings/Common";
import Logger from "../decorator/Logger";

export default class DataModule {
    @Logger.log
    public initialize() {
        this._initSkillInfoList();
        this._initWeaponInfoList();
    }

    @Logger.log
    private _initSkillInfoList() {
        skillInfoList.forEach(skillInfo => {
            skillInfo.consume = <any>+skillInfo.consume;
            skillInfo.duration = <any>+skillInfo.duration;
            skillInfo.skillId = <any>+skillInfo.skillId;

            this.skillInfoList.insert(<any>skillInfo);
        })
    }

    @Logger.log
    private _initWeaponInfoList() {
        weaponInfoList.forEach(weaponInfo => {
            weaponInfo.exploreRadius = <any>+weaponInfo.exploreRadius
            weaponInfo.shootRadius = <any>+weaponInfo.shootRadius
            weaponInfo.weaponId = <any>+weaponInfo.weaponId

            this.weaponInfoList.insert(<any>weaponInfo);
        })
    }

    private _collectionMap:{[name:string]:Collection<any>} = {};
    
    @Logger.log
    public get<T>(name:string):Collection<T> {
        if(!this._collectionMap[name]){
            this._collectionMap[name] = new Collection<T>(name);
        }
        return this._collectionMap[name];
    }

    @Logger.log
    public drop(name:string) {
        if(this._collectionMap[name]) {
            this._collectionMap[name].clean();
            delete this._collectionMap[name];
        }
    }

    public get wsList():Collection<IWsItem> {
        return this.get<IWsItem>('wsList');
    }

    public get userInfoList():Collection<IUserInfo> {
        return this.get<IUserInfo>('userInfoList');
    }

    public get skillInfoList():Collection<ISkillInfo> {
        return this.get<ISkillInfo>('skillInfoList');
    }

    public get weaponInfoList():Collection<IWeaponInfo> {
        return this.get<IWeaponInfo>('weaponInfoList');
    }

    public get gameInfoList():Collection<IGameInfo> {
        return this.get<IGameInfo>('gameInfoList');
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

    @Logger.log
    public select(filter:(item:T) => boolean):Array<T> {
        return this._documentList.filter(filter);
    }

    @Logger.log
    public update(filter:(item:T) => boolean,data:object) {
        let items = this.select(filter);
        let clone = Clone.instance;
        items.forEach(item => {
            clone.clone(<any>item,data);
        })
    }

    @Logger.log
    public insert(data:T) {
        this._documentList.push(data);
    }

    @Logger.log
    public delete(filter:(item:T) => boolean) {
        let items = this.select(filter);
        items.reverse().forEach(item => this._documentList.splice(this._documentList.indexOf(item),1));
    }

    @Logger.log
    public clean() {
        this._documentList = [];
    }
}