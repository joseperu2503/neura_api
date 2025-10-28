export interface JwtPayload {
  id: string;
  isGuest: boolean;
  email: string | null;
}
