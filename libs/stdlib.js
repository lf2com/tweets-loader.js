'use strict';

export const isnum = (n) => (!isNaN(n));
export const isint = (n) =>(isnum(n)&&n===(n|0));
export const isstr = (s) => ('string'===typeof s);
export const isfunc = (f) => ('function'===typeof f);