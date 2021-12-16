const pending='pending';
const fulfilled='fulfilled';
const rejected='rejected'
class MyPromise{
   status=pending;
   value=undefined;
   reason=undefined;
   fulfilledCb=[];
   rejectedCb=[]
   constructor(executor){
    executor(this.resolve,this.rejected)
   }
   then(onfulfilled,onRejected){
   const onfulfilledFn=typeof onfulfilled==='function'?onfulfilled:value=>value;
   const onRejectedFn=typeof onRejected==='function' ? onRejected:reason=>{throw reason}
     // 满足链式调用需要返回一个新的promise
     // 执行then 的时候，promise 可能有三种状态pending,fulfilled,rejected
      let p2=new MyPromise((resolve,reject)=>{
        const _onfulfilled=()=>queueMicrotask(()=>{
        
          try{
            const x = onfulfilledFn(this.value);
         
            this.resolvePromise(x,p2,resolve,reject);
           
          }catch(e){
            reject(e)
          }
        })
        const _onRejected=()=> queueMicrotask(()=>{
              try{
              const x = onRejectedFn(this.reason);
              this.resolvePromise(x,p2,resolve,reject)
            }catch(e){
              reject(e)
            }
            })
        if(this.status==='pending'){
          // 存储回调函数，resolve,和reject 一并存储
          this.fulfilledCb.push(_onfulfilled);
          this.rejectedCb.push(_onRejected)
        }else if(this.status==='fulfilled'){
         
          _onfulfilled()
        }else if(this.status==='rejected'){
          _onRejected()
         
        }
      })
      return p2
   }
   resolve=(value)=>{
     // 把promise 状态变成 fulfilled，且状态一旦改变就不能恢复
     if(this.status==='pending'){
       this.status=fulfilled;
       this.value=value;
       this.fulfilledCb.forEach(fn=>{
        fn()
       })
     }

   }
   rejected=(reason)=>{
    if(this.status==='pending'){
      this.status=rejected;
      this.reason=reason;
      this.rejectedCb.forEach(fn=>{
        fn()
      })
    }
   }
   resolvePromise(x,p2,resolve,reject){
     
    if(x===p2){
      return reject(new TypeError('Chaining cycle detected for promise #<Promise>')) 
    }
    if(typeof x==='object'||typeof x==='function'){
      // promise 是对象
      if(x===null){
        return resolve(x);
      }
      let then
      try{
        then=x.then
      }catch(e){
        return reject(e)
      }
      if(typeof then ==='function'){
          x.then(resolve,reject)
      }
    }else{
      // undefined boolean arr 等
      resolve(x)
    }
    
   }

}

MyPromise.deferred=function(){
  var result={};
  result.promise=new MyPromise(function(resolve,reject){
    result.resolve=resolve;
    result.reject=reject;
    
  })
  return result
}
module.exports=MyPromise
