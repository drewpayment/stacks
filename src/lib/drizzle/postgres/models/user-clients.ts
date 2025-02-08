import { db } from '../client';


export const UserClient = {
  canAccess: async (userId: string, clientId: string): Promise<boolean> => {
    const res = db.query.userClient.findFirst({
      columns: { id: true, },
      where: (uc, { eq, and }) => and(eq(uc.userId, userId), eq(uc.clientId, clientId)),
    });
    return !!res;
  }
}