import {IUserInfo, IGameInfo, ISkillStatusInfo } from "../../typing/Common";

export default class SkillController {
    public initialize() {

    }

    public updateSkillHitStatusInfoList(userInfo:IUserInfo) {
        for(let skillHitStatus of userInfo.skillHitStatusInfoList) {
            this[skillHitStatus.skillInfo.skillId](userInfo);
        }
        userInfo.skillHitStatusInfoList.reverse().forEach( item => {
            item.hitDuration--;
            if(item.hitDuration === 0){
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

    //连击
    public '0'(userInfo:IUserInfo) {

    }

    //散射
    public '1'(userInfo:IUserInfo) {

    }

    //冲击
    public '2'(userInfo:IUserInfo) {
        
    }

    //沉默
    public '3'(userInfo:IUserInfo) {
        
    }

    //冰冻
    public '4'(userInfo:IUserInfo) {
        
    }

    //束缚
    public '5'(userInfo:IUserInfo) {
        
    }

    //致盲
    public '6'(userInfo:IUserInfo) {
        
    }

    //换位
    public '7'(userInfo:IUserInfo) {
        
    }

    //中毒
    public '8'(userInfo:IUserInfo) {
        
    }

    //补血
    public '9'(userInfo:IUserInfo) {
        
    } 
    
    //恢复
    public '10'(userInfo:IUserInfo) {
        
    }

    //隐身
    public '11'(userInfo:IUserInfo) {
        
    }

    //飞行
    public '12'(userInfo:IUserInfo) {
        
    }

    //枷锁
    public '13'(userInfo:IUserInfo) {
        
    }

    //弱化
    public '14'(userInfo:IUserInfo) {
        
    }

    //加攻
    public '15'(userInfo:IUserInfo) {
        
    }

    //加防
    public '16'(userInfo:IUserInfo) {
        
    }

    //加敏
    public '17'(userInfo:IUserInfo) {
        
    }

    //气绝
    public '18'(userInfo:IUserInfo) {
        
    }

    //导航
    public '19'(userInfo:IUserInfo) {
        
    }

    //核弹
    public '20'(userInfo:IUserInfo) {
        
    }

    //威力
    public '21'(userInfo:IUserInfo) {
        
    }

    //混乱
    public '22'(userInfo:IUserInfo) {
    
    }

    //昏睡
    public '23'(userInfo:IUserInfo) {
        
    }

    //石化
    public '24'(userInfo:IUserInfo) {
        
    }

    //遗忘
    public '25'(userInfo:IUserInfo) {
        
    }

    //骰子
    public '26'(userInfo:IUserInfo) {
        
    }

    //善恶
    public '27'(userInfo:IUserInfo) {
        
    }

    //吸血
    public '28'(userInfo:IUserInfo) {
        
    }

    //反弹
    public '29'(userInfo:IUserInfo) {
        
    }

    //无效
    public '30'(userInfo:IUserInfo) {
        
    }

    //乾坤
    public '31'(userInfo:IUserInfo) {
        
    }

    //诸刃
    public '32'(userInfo:IUserInfo) {
        
    }

    //戒躁
    public '33'(userInfo:IUserInfo) {
        
    }

    //即死
    public '34'(userInfo:IUserInfo) {
        
    }

    //洁净
    public '35'(userInfo:IUserInfo) {
        
    }

    //同心
    public '36'(userInfo:IUserInfo) {
        
    }

    //护卫
    public '37'(userInfo:IUserInfo) {
        
    }

    //制衡
    public '38'(userInfo:IUserInfo) {
        
    }

    //反向
    public '39'(userInfo:IUserInfo) {
        
    }

    //火箭
    public '40'(userInfo:IUserInfo) {
        
    }
}