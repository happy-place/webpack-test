import {age} from './me'
function sum(a:number,b:number):number{
    return a + b
}

console.log(sum(5,2))
console.log(age)
console.log(Promise) // 只使用babel,不引入corejs，依旧无法编译过，因为此处Promise是从corejs提供