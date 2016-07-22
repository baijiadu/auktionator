import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'numberadd0'})
export class NumberAdd0 implements PipeTransform {
    transform(value:number, args:string[]) : any {
        value = value || 0;

        let suffix = args[0];
        return (value >= 10 ? value : ('0' + value)) + (suffix ? suffix : '');
    }
}
