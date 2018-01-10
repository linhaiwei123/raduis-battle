import { IPositionInfo } from "../typings/Common";


export default class Vector {
    
        private static _instance:Vector;
        public static get instance():Vector {
            return Vector._instance;
        }
    
        initialize() {
            Vector._instance = this;
        }
    
        deg2rad(degree:number) {
            return Math.PI/180 * degree;
        }

        rad2deg(radian:number) {
            return 180/Math.PI * radian;
        }

        distance(a:IPositionInfo,b:IPositionInfo):number {
            let dx = a.x-b.x;
            let dy = a.y-b.y;
            return Math.sqrt(dx * dx + dy * dy);
        }

        sub(a:IPositionInfo,b:IPositionInfo):IPositionInfo {
            let positionInfo = {} as IPositionInfo;
            positionInfo.x = a.x - b.x;
            positionInfo.y = a.y - b.y;
            return positionInfo;
        }

        add(a:IPositionInfo,b:IPositionInfo):IPositionInfo {
            let positionInfo = {} as IPositionInfo;
            positionInfo.x = a.x + b.x;
            positionInfo.y = a.y + b.y;
            return positionInfo;
        }
    }
    
    new Vector().initialize();
    