import { AccountDocument } from '../interface/account.interface';

export async function setLastSeenAt(this: AccountDocument): Promise<void> {
  const now = new Date();
  if (!this.lastSeenAt || this.lastSeenAt < now) {
    this.lastSeenAt = now;
    await this.save();
  }
}
