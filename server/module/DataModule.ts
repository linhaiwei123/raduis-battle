import Clone from "../util/Clone";


export default class DataModule {
    public initialize() {
        
    }

    private _collectionMap:{[name:string]:Collection<any>}
    
    public getCollection<T>(name:string):Collection<T> {
        if(!this._collectionMap[name]){
            this._collectionMap[name] = new Collection<T>(name);
        }
        return this._collectionMap[name];
    }

    public dropCollection(name:string) {
        if(this._collectionMap[name]) {
            this._collectionMap[name].clean();
            delete this._collectionMap[name];
        }
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

    public select(filter:(item:T) => boolean):Array<T> {
        return this._documentList.filter(filter);
    }

    public update(filter:(item:T) => boolean,data:object) {
        let items = this.select(filter);
        let clone = Clone.instance;
        items.forEach(item => {
            clone.clone(<any>item,data);
        })
    }

    public insert(data:T) {
        this._documentList.push(data);
    }

    public delete(filter:(item:T) => boolean) {
        let items = this.select(filter);
        items.reverse().forEach(item => this._documentList.splice(this._documentList.indexOf(item),1));
    }

    public clean() {
        this._documentList = [];
    }
}