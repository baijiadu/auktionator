import { PLATFORM_DIRECTIVES } from '@angular/core';

import {GridImg} from './components/index';

export const APPLICATION_DIRECTIVES  = [
  GridImg,
];

export const DIRECTIVES = [
  { provide: PLATFORM_DIRECTIVES, multi: true, useValue: APPLICATION_DIRECTIVES },
];
