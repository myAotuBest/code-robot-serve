// This file is created by egg-ts-helper@1.29.1
// Do not modify this file!!!!!!!!!

import 'egg';
import ExtendApplication from '../../../app/extend/application';
type ExtendApplicationType = typeof ExtendApplication;
declare module 'egg' {
  interface Application extends ExtendApplicationType { }
}