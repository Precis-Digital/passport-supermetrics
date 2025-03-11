import { Strategy } from "passport-strategy";
import { getLoginData, getLoginLink } from "./api";

interface VerifiedCallback {
  (err: any, user: any, info: any): void;
}

interface SupermetricsVerifyCallback {
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
}

class SupermetricsStrategy extends Strategy {
  clientSecret: string;
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
}

export default SupermetricsStrategy;
