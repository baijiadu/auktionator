import {Pipe, PipeTransform} from 'angular2/core';

@Pipe({name: 'floatadd0'})
export class FloatAdd0 implements PipeTransform {
    transform(value:number, args:number[]) : any {
        value = value || 0;

        let num = args[0] || 2;
        return value.toFixed(num);
    }
}
