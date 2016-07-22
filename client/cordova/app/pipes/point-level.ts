import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'pointlevel'})
export class PointLevel implements PipeTransform {
    transform(value:number, args:string[]) : any {
        let res;
        value = value || 0;

        if (value <= 5) {
            res = '普通';
        } else if (value <= 10) {
            res = '1星';
        } else if (value <= 20) {
            res = '2星';
        } else if (value <= 50) {
            res = '3星';
        } else if (value <= 100) {
            res = '4星';
        } else if (value <= 250) {
            res = '5星';
        } else if (value <= 500) {
            res = '1钻';
        } else if (value <= 1000) {
            res = '2钻';
        } else {
            res = '3钻';
        }
        return res;
    }
}
