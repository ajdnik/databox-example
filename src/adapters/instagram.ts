import { Instagram as Interface } from '../domain/interfaces';
import * as Instagram from 'instagram-web-api';

/**
 * Implementation of the Instagram service using
 * the instagram-web-api library.
 * @class
 */
export class InstagramAdapter implements Interface.Service {
  private client: Instagram;
  constructor(private username: string, private password: string) {
    this.client = new Instagram({ username, password });
  }

  /**
   * Get number of followers for an Instagram user.
   *
   * @param username - Instagram username.
   * @returns The number of followers.
   * @throws
   */
  private async getFollowersByUsername(username: string): Promise<number> {
    const user = await this.client.getUserByUsername({ username });
    const userId = parseInt(user.id);
    const res = await this.client.getFollowers({ userId });
    return res.count;
  }

  /**
   * Get the number of people an Instagram user is following.
   *
   * @param username - Instagram username.
   * @returns The number of people following.
   * @throws
   */
  private async getFollowingsByUsername(username: string): Promise<number> {
    const user = await this.client.getUserByUsername({ username });
    const userId = parseInt(user.id);
    const res = await this.client.getFollowings({ userId });
    return res.count;
  }

  /**
   * Get the number of photos uploaded to Instagram profile.
   *
   * @param username - Instagram username.
   * @returns The number of photos uploaded.
   */
  private async getPhotosByUsername(username: string): Promise<number> {
    const res = await this.client.getPhotosByUsername({ username });
    return res.user.edge_owner_to_timeline_media.count;
  }

  /**
   * Try and authenticate Instagram API actions if they're not yet authenticated.
   *
   * @param username - Instagram username.
   * @param action - Async function that will be executed against the username.
   * @returns The numeric result of the action if successfully executed.
   * @throws
   */
  private async whenAuthenticated(username: string, action: (username: string) => Promise<number>): Promise<number> {
    try {
      const res = await action(username);
      return res;
    } catch (err) {
      try {
        const auth = await this.client.login();
        if (auth.authenticated) {
          const res = await action(username);
          return res;
        }
        throw err;
      } catch (err) {
        throw err;
      }
    }
  }

  /**
   * Get number of followers for an Instagram user.
   *
   * @param username - Instagram username.
   * @returns The number of followers.
   * @throws
   */
  getFollowers(username: string): Promise<number> {
    return this.whenAuthenticated(username, this.getFollowersByUsername.bind(this));
  }

  /**
   * Get the number of people an Instagram user is following.
   *
   * @param username - Instagram username.
   * @returns The number of people following.
   * @throws
   */
  getFollowings(username: string): Promise<number> {
    return this.whenAuthenticated(username, this.getFollowingsByUsername.bind(this));
  }

  /**
   * Get the number of photos uploaded to Instagram profile.
   *
   * @param username - Instagram username.
   * @returns The number of photos uploaded.
   */
  getPhotos(username: string): Promise<number> {
    return this.whenAuthenticated(username, this.getPhotosByUsername.bind(this));
  }
}
