declare module 'instagram-web-api' {
  class Instagram {
    constructor(config: Instagram.ClientConfig);
    getFollowers(config: Instagram.UserIdConfig): Promise<Instagram.CountResult>;
    getFollowings(config: Instagram.UserIdConfig): Promise<Instagram.CountResult>;
    getUserByUsername(config: Instagram.UsernameConfig): Promise<Instagram.IdResult>;
    getPhotosByUsername(config: Instagram.UsernameConfig): Promise<Instagram.PhotosResult>;
    login(): Promise<Instagram.LoginResult>;
  }

  namespace Instagram {
    interface ClientConfig {
      username: string;
      password: string;
    }

    interface UserIdConfig {
      userId: number;
    }

    interface UsernameConfig {
      username: string;
    }

    interface LoginResult {
      authenticated: boolean;
      user: boolean;
    }

    interface CountResult {
      count: number;
    }

    interface IdResult {
      id: string;
    }

    interface PhotosResult {
      user: {
        edge_owner_to_timeline_media: {
          count: number;
        };
      };
    }
  }
  export = Instagram;
}
