import {Pipe, PipeTransform} from 'angular2/core';

@Pipe({name: 'str2date'})
export class Str2DatePipe implements PipeTransform {
    transform(value:string, args:string[]) : any {
        return value && new Date(value);
    }
}
