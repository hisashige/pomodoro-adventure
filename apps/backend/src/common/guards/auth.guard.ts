import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import * as admin from "firebase-admin";

@Injectable()
export class AuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const request = ctx.getContext().req;
    const authorization = request.headers.authorization;

    // ヘッダーにauthorizationがない場合は認証失敗
    if (!authorization) {
      return false;
    }

    // トークンを検証
    const user = await this.validateToken(authorization);

    // ユーザー情報をリクエストに追加
    request.user = user;

    return true;
  }

  private async validateToken(authorization: string) {
    try {
      const token = authorization.replace("Bearer ", "");
      const decodedToken = await admin.auth().verifyIdToken(token);
      return decodedToken;
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }
}
