import {Pipe, PipeTransform} from 'angular2/core';

@Pipe({name: 'reverseList'})
export class ReverseList implements PipeTransform {
    transform(list:Array, args:string[]) : Array {
        list = list || [];
        return list.reverse();
    }
}
