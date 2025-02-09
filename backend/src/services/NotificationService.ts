import { PushToken, IPushToken, Notification, INotification } from '../models';
import { getConnection } from '../utils/database';
import { Types } from 'mongoose';

export class NotificationService {
  /**
   * Register a push token for a user
   */
  public async registerToken(
    userId: string,
    token: string,
    platform: 'ios' | 'android' | 'web'
  ): Promise<IPushToken> {
    const existingToken = await PushToken.findOne({ token });

    if (existingToken) {
      existingToken.user = new Types.ObjectId(userId);
      existingToken.platform = platform;
      existingToken.last_used = new Date();
      return await existingToken.save();
    }

    return await PushToken.create({
      user: new Types.ObjectId(userId),
      token,
      platform,
    });
  }

  /**
   * Create a notification
   */
  public async createNotification(
    userId: string,
    type: 'evaluation' | 'show' | 'sync' | 'system',
    title: string,
    body: string,
    data: any = {}
  ): Promise<INotification> {
    return await Notification.create({
      user: new Types.ObjectId(userId),
      type,
      title,
      body,
      data,
      status: 'pending',
    });
  }

  /**
   * Get user's notifications
   */
  public async getUserNotifications(userId: string): Promise<INotification[]> {
    return await Notification.find({ user: new Types.ObjectId(userId) })
      .sort({ created_at: -1 })
      .limit(100);
  }

  /**
   * Mark notification as read
   */
  public async markAsRead(notificationId: string): Promise<INotification | null> {
    return await Notification.findByIdAndUpdate(
      notificationId,
      {
        $set: {
          read: true,
          read_at: new Date(),
        },
      },
      { new: true }
    );
  }

  /**
   * Send pending notifications
   * This is typically called by a scheduled job
   */
  public async sendPendingNotifications(): Promise<void> {
    const session = await getConnection().startSession();

    try {
      await session.withTransaction(async () => {
        const pendingNotifications = await Notification.find({ status: 'pending' })
          .limit(100)
          .session(session);

        for (const notification of pendingNotifications) {
          const tokens = await PushToken.find({
            user: notification.user,
          }).session(session);

          if (tokens.length === 0) {
            await notification.markAsFailed();
            continue;
          }

          try {
            // Here you would integrate with FCM, APNS, or web push
            // For now, we'll just mark it as sent
            await notification.markAsSent();

            // Update token last_used
            for (const token of tokens) {
              await token.updateLastUsed();
            }
          } catch (error) {
            await notification.markAsFailed();
          }
        }
      });
    } finally {
      await session.endSession();
    }
  }

  /**
   * Delete old notifications
   * This is typically called by a scheduled job
   */
  public async deleteOldNotifications(daysToKeep: number = 30): Promise<void> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

    await Notification.deleteMany({
      created_at: { $lt: cutoffDate },
    });
  }

  /**
   * Clean up unused tokens
   * This is typically called by a scheduled job
   */
  public async cleanupUnusedTokens(daysUnused: number = 30): Promise<void> {
    await PushToken.cleanupExpiredTokens(daysUnused);
  }
}