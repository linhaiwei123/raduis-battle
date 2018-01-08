import Global from "../global/Global";
import { Code, IMatchReq, IMatchRsp, IRsp } from "../../typing/Common";
import Uuid from "../util/Uuid";

export default class MatchController {
    initialize() {
        this._initEvent();
    }

    private _initEvent() {
        Global.instance.eventModule.on(Code.matchReq, this._onMatchReq, this);
    }

    private _onMatchReq(req: IMatchReq) {
        let userInfoItem = Global.instance.dataModule.userInfoList.select(item => item.userId === req.userId)[0];
        //未匹配成功则可以修改匹配状态
        if (!userInfoItem.roomId) {
            userInfoItem.matching = req.matching;
        }

        //试图找寻是否有可以匹配的玩家
        if (req.matching === true) {
            let matchingUserInfoList = Global.instance.dataModule.userInfoList.select(item => item.matching === true && item.userId !== req.userId);
            //大于一个玩家就可以匹配
            if (matchingUserInfoList.length >= 1) {
                //房间内玩家信息列表
                let roomUserInfoList = [];
                // //房间Id 
                // let roomId = Uuid.instance.create();
                //插入自己的信息
                //userInfoItem.roomId = roomId;
                userInfoItem.matching = false;
                roomUserInfoList.push(userInfoItem);

                //插入其他玩家的信息
                for (let i = 0, l = 3; i < l; i++) {
                    let otherUserInfoItem = matchingUserInfoList[i];
                    if(otherUserInfoItem){
                        //otherUserInfoItem.roomId = roomId;
                        otherUserInfoItem.matching = false;
                        roomUserInfoList.push(otherUserInfoItem);
                    }
                }

                //GameController生成房间
                let gameInfo = Global.instance.gameController.createGame(matchingUserInfoList);
                let matchRsp = {} as IMatchRsp;
                matchRsp.gameInfo = gameInfo;
                let dataRsp = {} as IRsp;
                dataRsp.code = Code.matchRsp;
                dataRsp.rsp = matchRsp;
                //返回匹配结果
                Global.instance.networkModule.sendToRoom(gameInfo.roomId,dataRsp);
            }
        }
    }
}