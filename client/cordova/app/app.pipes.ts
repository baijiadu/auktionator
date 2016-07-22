import { PLATFORM_PIPES } from '@angular/core';

import {ApplyStatusPipe, GameStatusPipe, List2GridPipe, ProductStatusPipe, QiniuStylesPipe, Str2DatePipe} from './pipes/index';

export const APPLICATION_PIPES = [
  ApplyStatusPipe,
  GameStatusPipe,
  List2GridPipe,
  ProductStatusPipe,
  QiniuStylesPipe,
  Str2DatePipe,
];

export const PIPES = [
  {provide: PLATFORM_PIPES, multi: true, useValue: APPLICATION_PIPES},
];
