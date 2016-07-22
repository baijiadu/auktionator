import {GameService, HomeService, ProductService, UserService, Notification} from './providers/index';

export const APPLICATION_PROVIDERS = [
  Notification,
  GameService,
  HomeService,
  ProductService,
  UserService,
  Notification,
];

export const PROVIDERS = [
  ...APPLICATION_PROVIDERS
];
