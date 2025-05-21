import jwt, { JwtPayload }  from 'jsonwebtoken';
import { Request } from 'express';

const SECRET = process.env.JWT_SECRET || 'supersecretkey';
const expiration = '2h';

export interface UserPayload {
  _id: string;
  email: string;
  username: string;
}

export interface AuthRequest extends Request {
  user?: UserPayload;
}

export function signToken(user: UserPayload): string {
  return jwt.sign({ data: user }, SECRET, { expiresIn: expiration });
}

export function authMiddleware({ req }: { req: AuthRequest }): AuthRequest {
  let token = req.headers.authorization;

  if (token && token.startsWith ('Bearer ')) {
    token = token.split(' ').pop()?.trim();
}

if (!token) {
  return req;
}

try {
  const { data } = jwt.verify(token, SECRET) as JwtPayload & { data: UserPayload };
  req.user = data;
} catch (err) {
  console.log('Invalid token');
}
  return req;
}
