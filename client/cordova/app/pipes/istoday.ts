import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'istoday'})
export class IsToday implements PipeTransform {
    transform(date:Date, args:any[]) : any {
        date = date || new Date();

        let now = new Date();
        return date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth() && date.getDate() === now.getDate();
    }
}
