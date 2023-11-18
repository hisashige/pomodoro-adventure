import { DecodedIdToken } from "firebase-admin/lib/auth/token-verifier";

interface Request {
  user: DecodedIdToken;
}

export interface RequestContext {
  req: Request;
}