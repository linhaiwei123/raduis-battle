const {ccclass, property} = cc._decorator;

@ccclass
export default class ResModuleC extends cc.Component {

    initialize() {

    }

    getUserPrefab(cb:(res:cc.Prefab) => void) {
        cc.loader.loadRes('prefabs/user',cc.Prefab,(err,res) => {
            if(err) throw err;
            cb(res);
        })
    }
}
