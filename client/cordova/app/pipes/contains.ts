import {Pipe, PipeTransform} from 'angular2/core';

@Pipe({name: 'contains'})
export class Contains implements PipeTransform {
    transform(list:Array<any>, args:any[]) : any {
        list = list || [];
        let key = args[0];
        let value = args[1];

        return list && !!list.find(item => item[key] === value);
    }
}
