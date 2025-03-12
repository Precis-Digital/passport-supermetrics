import { Strategy } from "passport-strategy";
import { createLoginUrl, getLoginData, getLoginLink } from "./api";

interface VerifiedCallback {
  (err: any, user: any, info?: any): void;
}

export interface SupermetricsVerifyCallback {
  (
    req: Request,
    linkId: string,
    dataSourceLoginId: string,
    displayName: string,
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
    linkId: string;
    dataSourceLoginId: string;
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

      function verified(err: Error | null, user: any, info: any): void {
        if (err) {
          return self.error(err);
        }
        if (!user) {
          return self.fail(info);
        }
        self.success(user, info);
      }

      getLoginLink(link_id, this.clientSecret)
        .then(({ data: loginLink }) => {
          getLoginData(loginLink.login_id, this.clientSecret)
            .then(({ data: loginData }) => {
              this.profile = {
                linkId: link_id,
                dataSourceLoginId: loginLink.login_id,
                displayName: loginData.display_name,
              };

              this._verify(
                req,
                this.profile.linkId,
                this.profile.dataSourceLoginId,
                this.profile.displayName,
                verified
              );
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

  async prepare(_: any, res: any) {
    try {
      const loginUrlResponse = await createLoginUrl({
        platform: this.platform,
        authToken: this.clientSecret,
        redirectUrl: this.callbackURL,
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
