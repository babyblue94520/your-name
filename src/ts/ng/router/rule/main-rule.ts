import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { AuthUserNode } from '../../../data/node/common';
import { AppRoute } from '../app';

/**
 * 是否有權限訪問
 */
@Injectable()
export class MainRoutingRule implements CanActivate {
    private authUser;
    constructor(private router: Router) {
        AuthUserNode.listen(() => {
            this.authUser = AuthUserNode.get();
            this.hasAuthority();
        }, true);
    }

    private hasAuthority = (): boolean => {
        if (this.authUser) {
            return true;
        } else {
            this.router.navigate(AppRoute.Main.Login);
            return false;
        }
    }

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): boolean {
        return this.hasAuthority();
    }
}

/**
 * 使用者登陸後回到首頁
 */
@Injectable()
export class MainRoutingRule2 implements CanActivate {
    private authUser;
    constructor(private router: Router) {
        AuthUserNode.listen(() => {
            this.authUser = AuthUserNode.get();
            this.hasAuthority();
        }, true);
    }

    private hasAuthority = (): boolean => {
        if (this.authUser) {
            this.router.navigate(AppRoute.Main.Default);
            return false;
        } else {
            return true;
        }
    }
    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): boolean {
        return this.hasAuthority();
    }
}
