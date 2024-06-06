import { Router } from "express"

export type $RouteInterface={
    path:string,
    module:Router
}

export interface JwtUserInterface {
    email: string;
    _id: string;
    role: string;
    iat: number;
    exp: number;
  }