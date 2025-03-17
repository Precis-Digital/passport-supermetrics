import { Strategy } from "passport-strategy";
import { createLoginUrl, getLoginData, getLoginLink } from "./api";

interface VerifiedCallback {
  (err: any, user: any, info?: any): void;
}

export interface SupermetricsVerifyCallback {
  (
    req: Request,
    profile: {
      loginId: string;
      displayName: string;
    },
    done: VerifiedCallback
  ): void;
}

export interface SupermetricsStrategyOptions {
  clientSecret: string;
  platform: string;
  callbackURL: string;
}

class SupermetricsStrategy extends Strategy {
  clientSecret: string;
  platform: string;
  callbackURL: string;
  profile?: {
    loginId: string;
    displayName: string;
  };
  _verify: SupermetricsVerifyCallback;
  constructor(
    options: SupermetricsStrategyOptions,
    verifyCallback: SupermetricsVerifyCallback
  ) {
    super();
    this.clientSecret = options.clientSecret;
    this.platform = options.platform;
    this.callbackURL = options.callbackURL;
    this._verify = verifyCallback;
  }

  authenticate(req: any, _options?: any): any {
    const self = this;

    if (req.query.link_id && req.query.link_verifier) {
      const { link_id } = req.query;

      const verified = (err: Error | null, user: any, info: any): void => {
        if (err) {
          return self.error(err);
        }
        if (!user) {
          return self.fail(info);
        }
        self.success(user, info);
      };

      getLoginLink(link_id, this.clientSecret)
        .then(({ data: loginLink }) => {
          getLoginData(loginLink.login_id, this.clientSecret)
            .then(({ data: loginData }) => {
              this.profile = {
                loginId: loginLink.login_id,
                displayName: loginData.display_name,
              };

              this._verify(req, this.profile, verified);
            })
            .catch((err: Error) => {
              return self.error(err);
            });
        })
        .catch((err: Error) => {
          return self.error(err);
        });
    }
  }

  async prepare(req: any, res: any) {
    let dataSourceUsername: string | undefined;

    try {
      if (req.query.login_id != null) {
        const loginData = await getLoginData(
          req.query.login_id,
          this.clientSecret
        );
        dataSourceUsername = loginData.data.username;
      }

      const loginUrlResponse = await createLoginUrl({
        platform: this.platform,
        authToken: this.clientSecret,
        redirectUrl: this.callbackURL,
        dataSourceUsername,
      });

      res.json({
        thirdPartyId: loginUrlResponse.data.link_id,
        redirect: loginUrlResponse.data.login_url,
      });
    } catch (err: any) {
      return res.json({ error: err.message });
    }
  }
}

export default SupermetricsStrategy;
