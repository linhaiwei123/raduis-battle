export default class Logger {
    public static log(target, methodName: string, descriptor: PropertyDescriptor) {
        const oldValue: Function = descriptor.value;
        let signature = new RegExp('(.*)').exec(oldValue.toString())[1];
        signature = signature.substring(signature.indexOf('('),signature.lastIndexOf(')')+1);
        descriptor.value = function (...args) {
            try {
                Logger.logFormat(target,methodName,signature,args,'');
                const ret = oldValue.apply(this, args);
                return ret;
            } catch (err) {
                Logger.logFormat(target,methodName,signature,args,err);
            }
        }
    }
    private static logFormat(target,methodName,signature,args,ret) {
        const split = `--------------------------------------------`;
        if(typeof args === 'object'){
            args = {...args};
        }
        if(typeof ret === 'object'){
            ret = {...ret};
        }
        const date = new Date();
        console.log(split,`\n[date:]`,date,`\n[call]:`,`${target.constructor.name}.${methodName}${signature}`,`\n[args]:`,args,`\n[ret]:`,ret);
    }
}


