import {Pipe, PipeTransform} from 'angular2/core';

@Pipe({name: 'timediff'})
export class TimeDiff implements PipeTransform {
    transform(time:Date, args:any[]) : any {
        let now = args[0];
        if (!now) return '';
        time = time || new Date();

        let diff = time.getTime() - now.getTime();
        let hours, mins, seconds;
        let result = '';

        hours = mins = seconds = 0;
        if (diff > 0) {
            diff = diff / 1000;
            if (diff > 3600) {
                hours = parseInt((diff / 3600) + '');
                diff %= 3600;
            }
            if (diff > 60) {
                mins = parseInt((diff / 60) + '');
                diff %= 60;
            }
            seconds = parseInt(diff + '');
            result = hours + '时' + mins + '分' + seconds + '秒';
        }
        return result;
    }
}
