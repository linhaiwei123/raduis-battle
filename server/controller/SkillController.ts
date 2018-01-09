import {IUserInfo, IGameInfo, ISkillStatusInfo, ISkillHitStatusInfo, SkillHitStatusStep } from "../../typing/Common";
import Vector from "../util/Vector";

export default class SkillController {
    public initialize() {

    }

    public updateSkillHitStatusInfoList(userInfo:IUserInfo,skillHitStatus:ISkillHitStatusInfo) {
        for(let skillHitStatus of userInfo.skillHitStatusInfoList) {
            this[skillHitStatus.skillStatusInfo.skillInfo.skillId](userInfo,skillHitStatus);
            skillHitStatus.step = SkillHitStatusStep.update;
        }
        userInfo.skillHitStatusInfoList.reverse().forEach( item => {
            item.hitDuration--;
            if(item.hitDuration === 0){
                item.step = SkillHitStatusStep.end;
                this[item.skillStatusInfo.skillInfo.skillId](userInfo,item);
                userInfo.skillHitStatusInfoList.splice(userInfo.skillHitStatusInfoList.indexOf(item),1);
            }
        })
    }

    public updateSkillStatusInfoList(skillStatusInfoList:Array<ISkillStatusInfo>) {
        skillStatusInfoList.reverse().forEach(item => {
            item.duration--;
            if(item.duration === 0){
                skillStatusInfoList.splice(skillStatusInfoList.indexOf(item),1);
            }
        })
    }

    private _getHit(dstUserInfo:IUserInfo,srcUserInfo:IUserInfo,ratio:number) {
        let dstBaseInfo = dstUserInfo.baseInfo;
        let srcBaseInfo = srcUserInfo.baseInfo;
        return Math.max(1,srcBaseInfo.atk * ratio - dstBaseInfo.def);
    }

    //连击 //todo 在GameController 处理
    public '0'(userInfo:IUserInfo,skillHitStatus:ISkillHitStatusInfo) {
        switch(skillHitStatus.step) {
            case SkillHitStatusStep.start: {
                let hit = this._getHit(userInfo,skillHitStatus.skillStatusInfo.userInfo,skillHitStatus.ratio);
                userInfo.baseInfo.hp -= hit;
                break;
            }
            case SkillHitStatusStep.update: {

                break;
            }
            case SkillHitStatusStep.end: {

                break;
            }
        }
    }

    //散射 //todo 在GameController 处理
    public '1'(userInfo:IUserInfo,skillHitStatus:ISkillHitStatusInfo) {
        switch(skillHitStatus.step) {
            case SkillHitStatusStep.start: {
                let hit = this._getHit(userInfo,skillHitStatus.skillStatusInfo.userInfo,skillHitStatus.ratio);
                userInfo.baseInfo.hp -= hit;
                break;
            }
            case SkillHitStatusStep.update: {

                break;
            }
            case SkillHitStatusStep.end: {

                break;
            }
        }
    }

    //冲击
    public '2'(userInfo:IUserInfo,skillHitStatus:ISkillHitStatusInfo) {
        switch(skillHitStatus.step) {
            case SkillHitStatusStep.start: {
                let hit = this._getHit(userInfo,skillHitStatus.skillStatusInfo.userInfo,skillHitStatus.ratio);
                userInfo.baseInfo.hp -= hit;
                
                let direction = Vector.instance.sub(userInfo.positionInfo,skillHitStatus.skillStatusInfo.shootPosition);
                userInfo.positionInfo = Vector.instance.add(direction,userInfo.positionInfo);
                break;
            }
            case SkillHitStatusStep.update: {

                break;
            }
            case SkillHitStatusStep.end: {

                break;
            }
        }
    }

    //沉默
    public '3'(userInfo:IUserInfo,skillHitStatus:ISkillHitStatusInfo) {
        switch(skillHitStatus.step) {
            case SkillHitStatusStep.start: {
                let hit = this._getHit(userInfo,skillHitStatus.skillStatusInfo.userInfo,skillHitStatus.ratio);
                userInfo.baseInfo.hp -= hit;
                
                userInfo.userStatusFlags.silence = ~~userInfo.userStatusFlags.silence + 1;
                break;
            }
            case SkillHitStatusStep.update: {

                break;
            }
            case SkillHitStatusStep.end: {
                userInfo.userStatusFlags.silence = ~~userInfo.userStatusFlags.silence - 1;
                break;
            }
        }
    }

    //冰冻
    public '4'(userInfo:IUserInfo,skillHitStatus:ISkillHitStatusInfo) {
        switch(skillHitStatus.step) {
            case SkillHitStatusStep.start: {
                let hit = this._getHit(userInfo,skillHitStatus.skillStatusInfo.userInfo,skillHitStatus.ratio);
                userInfo.baseInfo.hp -= hit;
                
                userInfo.userStatusFlags.freeze = ~~userInfo.userStatusFlags.freeze + 1;
                break;
            }
            case SkillHitStatusStep.update: {

                break;
            }
            case SkillHitStatusStep.end: {
                userInfo.userStatusFlags.freeze = ~~userInfo.userStatusFlags.freeze - 1;
                break;
            }
        }
    }

    //束缚
    public '5'(userInfo:IUserInfo,skillHitStatus:ISkillHitStatusInfo) {
        switch(skillHitStatus.step) {
            case SkillHitStatusStep.start: {
                let hit = this._getHit(userInfo,skillHitStatus.skillStatusInfo.userInfo,skillHitStatus.ratio);
                userInfo.baseInfo.hp -= hit;
                
                userInfo.userStatusFlags.constraint = ~~userInfo.userStatusFlags.constraint + 1;
                break;
            }
            case SkillHitStatusStep.update: {

                break;
            }
            case SkillHitStatusStep.end: {
                userInfo.userStatusFlags.constraint = ~~userInfo.userStatusFlags.constraint - 1;
                break;
            }
        }
    }

    //致盲
    public '6'(userInfo:IUserInfo,skillHitStatus:ISkillHitStatusInfo) {
        switch(skillHitStatus.step) {
            case SkillHitStatusStep.start: {
                let hit = this._getHit(userInfo,skillHitStatus.skillStatusInfo.userInfo,skillHitStatus.ratio);
                userInfo.baseInfo.hp -= hit;
                
                userInfo.userStatusFlags.blind = ~~userInfo.userStatusFlags.blind + 1;
                break;
            }
            case SkillHitStatusStep.update: {

                break;
            }
            case SkillHitStatusStep.end: {
                userInfo.userStatusFlags.blind = ~~userInfo.userStatusFlags.blind - 1;
                break;
            }
        }
    }

    //换位
    public '7'(userInfo:IUserInfo,skillHitStatus:ISkillHitStatusInfo) {
        switch(skillHitStatus.step) {
            case SkillHitStatusStep.start: {
                let hit = this._getHit(userInfo,skillHitStatus.skillStatusInfo.userInfo,skillHitStatus.ratio);
                userInfo.baseInfo.hp -= hit;
                
                let positionInfo = userInfo.positionInfo;
                userInfo.positionInfo = skillHitStatus.skillStatusInfo.userInfo.positionInfo;
                skillHitStatus.skillStatusInfo.userInfo.positionInfo = positionInfo;
                break;
            }
            case SkillHitStatusStep.update: {

                break;
            }
            case SkillHitStatusStep.end: {
                
                break;
            }
        }
    }

    //中毒
    public '8'(userInfo:IUserInfo,skillHitStatus:ISkillHitStatusInfo) {
        let hit:number = 0;
        switch(skillHitStatus.step) {
            case SkillHitStatusStep.start: {
                hit = this._getHit(userInfo,skillHitStatus.skillStatusInfo.userInfo,skillHitStatus.ratio);
                userInfo.baseInfo.hp -= hit;
                
                userInfo.userStatusFlags.poison = ~~userInfo.userStatusFlags.poison + 1;
                break;
            }
            case SkillHitStatusStep.update: {
                userInfo.baseInfo.hp -= Math.max(1,hit/5);
                break;
            }
            case SkillHitStatusStep.end: {
                userInfo.userStatusFlags.poison = ~~userInfo.userStatusFlags.poison - 1;
                break;
            }
        }
    }

    //补血
    public '9'(userInfo:IUserInfo,skillHitStatus:ISkillHitStatusInfo) {
        let hit:number = 0;
        switch(skillHitStatus.step) {
            case SkillHitStatusStep.start: {
                hit = this._getHit(userInfo,skillHitStatus.skillStatusInfo.userInfo,skillHitStatus.ratio);
                userInfo.baseInfo.hp += hit;
                
                
                break;
            }
            case SkillHitStatusStep.update: {
                
                break;
            }
            case SkillHitStatusStep.end: {
                
                break;
            }
        }
    } 
    
    //恢复
    public '10'(userInfo:IUserInfo,skillHitStatus:ISkillHitStatusInfo) {
        let hit:number = 0;
        switch(skillHitStatus.step) {
            case SkillHitStatusStep.start: {
                hit = this._getHit(userInfo,skillHitStatus.skillStatusInfo.userInfo,skillHitStatus.ratio);
                userInfo.baseInfo.hp += hit;
                
                break;
            }
            case SkillHitStatusStep.update: {
                userInfo.baseInfo.hp -= Math.max(1,hit/5);
                break;
            }
            case SkillHitStatusStep.end: {
                
                break;
            }
        }
    }

    //隐身
    public '11'(userInfo:IUserInfo,skillHitStatus:ISkillHitStatusInfo) {
        //let hit:number = 0;
        switch(skillHitStatus.step) {
            case SkillHitStatusStep.start: {
                userInfo.userStatusFlags.hide = ~~userInfo.userStatusFlags.hide + 1;
                break;
            }
            case SkillHitStatusStep.update: {
                
                break;
            }
            case SkillHitStatusStep.end: {
                userInfo.userStatusFlags.hide = ~~userInfo.userStatusFlags.hide - 1;
                break;
            }
        }
    }

    //飞行 //todo 由game controller处理
    public '12'(userInfo:IUserInfo,skillHitStatus:ISkillHitStatusInfo) {
        
    }

    //枷锁
    public '13'(userInfo:IUserInfo,skillHitStatus:ISkillHitStatusInfo) {
        let hit:number = 0;
        switch(skillHitStatus.step) {
            case SkillHitStatusStep.start: {
                hit = this._getHit(userInfo,skillHitStatus.skillStatusInfo.userInfo,skillHitStatus.ratio);
                userInfo.baseInfo.hp -= hit;
                userInfo.userStatusFlags.shackles = ~~userInfo.userStatusFlags.shackles + 1;
                break;
            }
            case SkillHitStatusStep.update: {
                
                break;
            }
            case SkillHitStatusStep.end: {
                userInfo.userStatusFlags.shackles = ~~userInfo.userStatusFlags.shackles - 1;
                break;
            }
        }
    }

    //弱化
    public '14'(userInfo:IUserInfo,skillHitStatus:ISkillHitStatusInfo) {
        let hit:number = 0;
        switch(skillHitStatus.step) {
            case SkillHitStatusStep.start: {
                hit = this._getHit(userInfo,skillHitStatus.skillStatusInfo.userInfo,skillHitStatus.ratio);
                userInfo.baseInfo.hp -= hit;
                userInfo.userStatusFlags.weak = ~~userInfo.userStatusFlags.weak + 1;
                break;
            }
            case SkillHitStatusStep.update: {
                
                break;
            }
            case SkillHitStatusStep.end: {
                userInfo.userStatusFlags.weak = ~~userInfo.userStatusFlags.weak - 1;
                break;
            }
        }
    }

    //加攻
    public '15'(userInfo:IUserInfo,skillHitStatus:ISkillHitStatusInfo) {
        let hit:number = 0;
        switch(skillHitStatus.step) {
            case SkillHitStatusStep.start: {
                // hit = this._getHit(userInfo,skillHitStatus.skillStatusInfo.userInfo,skillHitStatus.ratio);
                // userInfo.baseInfo.hp -= hit;
                userInfo.userStatusFlags.atkup = ~~userInfo.userStatusFlags.atkup + 1;
                break;
            }
            case SkillHitStatusStep.update: {
                
                break;
            }
            case SkillHitStatusStep.end: {
                userInfo.userStatusFlags.atkup = ~~userInfo.userStatusFlags.atkup - 1;
                break;
            }
        }
    }

    //加防
    public '16'(userInfo:IUserInfo,skillHitStatus:ISkillHitStatusInfo) {
        let hit:number = 0;
        switch(skillHitStatus.step) {
            case SkillHitStatusStep.start: {
                // hit = this._getHit(userInfo,skillHitStatus.skillStatusInfo.userInfo,skillHitStatus.ratio);
                // userInfo.baseInfo.hp -= hit;
                userInfo.userStatusFlags.defup = ~~userInfo.userStatusFlags.defup + 1;
                break;
            }
            case SkillHitStatusStep.update: {
                
                break;
            }
            case SkillHitStatusStep.end: {
                userInfo.userStatusFlags.defup = ~~userInfo.userStatusFlags.defup - 1;
                break;
            }
        }
    }

    //加敏
    public '17'(userInfo:IUserInfo,skillHitStatus:ISkillHitStatusInfo) {
        let hit:number = 0;
        switch(skillHitStatus.step) {
            case SkillHitStatusStep.start: {
                // hit = this._getHit(userInfo,skillHitStatus.skillStatusInfo.userInfo,skillHitStatus.ratio);
                // userInfo.baseInfo.hp -= hit;
                userInfo.userStatusFlags.aglup = ~~userInfo.userStatusFlags.aglup + 1;
                break;
            }
            case SkillHitStatusStep.update: {
                
                break;
            }
            case SkillHitStatusStep.end: {
                userInfo.userStatusFlags.aglup = ~~userInfo.userStatusFlags.aglup - 1;
                break;
            }
        }
    }

    //气绝
    public '18'(userInfo:IUserInfo,skillHitStatus:ISkillHitStatusInfo) {
        let hit:number = 0;
        switch(skillHitStatus.step) {
            case SkillHitStatusStep.start: {
                hit = this._getHit(userInfo,skillHitStatus.skillStatusInfo.userInfo,skillHitStatus.ratio);
                userInfo.baseInfo.hp -= hit;
                if(userInfo.baseInfo.hp <=0){
                    userInfo.baseInfo.hp += hit;
                }
                break;
            }
            case SkillHitStatusStep.update: {
                
                break;
            }
            case SkillHitStatusStep.end: {
                
                break;
            }
        }
    }

    //导航
    public '19'(userInfo:IUserInfo,skillHitStatus:ISkillHitStatusInfo) {
        //todo 设计上如何导航
    }

    //核弹
    public '20'(userInfo:IUserInfo,skillHitStatus:ISkillHitStatusInfo) {
        //todo 
    }

    //威力
    public '21'(userInfo:IUserInfo,skillHitStatus:ISkillHitStatusInfo) {
        
    }

    //混乱
    public '22'(userInfo:IUserInfo,skillHitStatus:ISkillHitStatusInfo) {
    
    }

    //昏睡
    public '23'(userInfo:IUserInfo,skillHitStatus:ISkillHitStatusInfo) {
        
    }

    //石化
    public '24'(userInfo:IUserInfo,skillHitStatus:ISkillHitStatusInfo) {
        
    }

    //遗忘
    public '25'(userInfo:IUserInfo,skillHitStatus:ISkillHitStatusInfo) {
        
    }

    //骰子
    public '26'(userInfo:IUserInfo,skillHitStatus:ISkillHitStatusInfo) {
        
    }

    //善恶
    public '27'(userInfo:IUserInfo,skillHitStatus:ISkillHitStatusInfo) {
        
    }

    //吸血
    public '28'(userInfo:IUserInfo,skillHitStatus:ISkillHitStatusInfo) {
        
    }

    //反弹
    public '29'(userInfo:IUserInfo,skillHitStatus:ISkillHitStatusInfo) {
        
    }

    //无效
    public '30'(userInfo:IUserInfo,skillHitStatus:ISkillHitStatusInfo) {
        
    }

    //乾坤
    public '31'(userInfo:IUserInfo,skillHitStatus:ISkillHitStatusInfo) {
        
    }

    //诸刃
    public '32'(userInfo:IUserInfo,skillHitStatus:ISkillHitStatusInfo) {
        
    }

    //戒躁
    public '33'(userInfo:IUserInfo,skillHitStatus:ISkillHitStatusInfo) {
        
    }

    //即死
    public '34'(userInfo:IUserInfo,skillHitStatus:ISkillHitStatusInfo) {
        
    }

    //洁净
    public '35'(userInfo:IUserInfo,skillHitStatus:ISkillHitStatusInfo) {
        
    }

    //同心
    public '36'(userInfo:IUserInfo,skillHitStatus:ISkillHitStatusInfo) {
        
    }

    //护卫
    public '37'(userInfo:IUserInfo,skillHitStatus:ISkillHitStatusInfo) {
        
    }

    //制衡
    public '38'(userInfo:IUserInfo,skillHitStatus:ISkillHitStatusInfo) {
        
    }

    //反向
    public '39'(userInfo:IUserInfo,skillHitStatus:ISkillHitStatusInfo) {
        
    }

    //火箭
    public '40'(userInfo:IUserInfo,skillHitStatus:ISkillHitStatusInfo) {
        
    }
}