import { expect } from 'chai';
import { ParseEnvConfig } from '../../src/domain/config';

describe('ParseEnvConfig', () => {
  it('should throw missing variable error when ENV is missing', () => {
    expect(() => ParseEnvConfig()).to.throw('Missing env variable GITHUB_USERNAME');
  });

  it('should throw not a number when TIMEOUT is a word', () => {
    const oldEnv = { ...process.env };
    process.env.TIMEOUT = 'hello-world';
    expect(() => ParseEnvConfig()).to.throw('Env variable TIMEOUT is not a number.');
    process.env = oldEnv;
  });

  it('should return config when ENV variables are defined', () => {
    const oldEnv = { ...process.env };
    process.env.GITHUB_USERNAME = 'ghuser';
    process.env.GITHUB_TOKEN = 'ghtoken';
    process.env.GITHUB_DATABOX_TOKEN = 'gh_databox';
    process.env.INSTAGRAM_USERNAME = 'iguser';
    process.env.INSTAGRAM_PASSWORD = 'igpass';
    process.env.INSTAGRAM_DATABOX_TOKEN = 'ig_databox';
    process.env.BITBUCKET_USERNAME = 'bituser';
    process.env.BITBUCKET_PASSWORD = 'bitpass';
    process.env.BITBUCKET_DATABOX_TOKEN = 'bit_databox';
    const res = ParseEnvConfig();
    expect(res).to.deep.eq({
      timeout: undefined,
      environment: 'production',
      service: 'databox-example',
      log: {
        filename: 'databox.log',
      },
      github: {
        username: 'ghuser',
        token: 'ghtoken',
        databox: 'gh_databox',
      },
      instagram: {
        username: 'iguser',
        password: 'igpass',
        databox: 'ig_databox',
      },
      bitbucket: {
        username: 'bituser',
        password: 'bitpass',
        databox: 'bit_databox',
      },
    });
    process.env = oldEnv;
  });

  it('should override default when ENV variables are defined', () => {
    const oldEnv = { ...process.env };
    process.env.GITHUB_USERNAME = 'ghuser';
    process.env.GITHUB_TOKEN = 'ghtoken';
    process.env.GITHUB_DATABOX_TOKEN = 'gh_databox';
    process.env.INSTAGRAM_USERNAME = 'iguser';
    process.env.INSTAGRAM_PASSWORD = 'igpass';
    process.env.INSTAGRAM_DATABOX_TOKEN = 'ig_databox';
    process.env.BITBUCKET_USERNAME = 'bituser';
    process.env.BITBUCKET_PASSWORD = 'bitpass';
    process.env.BITBUCKET_DATABOX_TOKEN = 'bit_databox';
    process.env.NODE_ENV = 'fake_env';
    process.env.SERVICE = 'fake_service';
    process.env.LOG_FILENAME = '/example/path/to/log/file.log';
    const res = ParseEnvConfig();
    expect(res).to.deep.eq({
      timeout: undefined,
      environment: 'fake_env',
      service: 'fake_service',
      log: {
        filename: '/example/path/to/log/file.log',
      },
      github: {
        username: 'ghuser',
        token: 'ghtoken',
        databox: 'gh_databox',
      },
      instagram: {
        username: 'iguser',
        password: 'igpass',
        databox: 'ig_databox',
      },
      bitbucket: {
        username: 'bituser',
        password: 'bitpass',
        databox: 'bit_databox',
      },
    });
    process.env = oldEnv;
  });
});
