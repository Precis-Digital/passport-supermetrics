const SUPERMETRICS_BASE_PATH = "https://api.supermetrics.com/enterprise/v2";

interface LoginLinkResponse {
  data: {
    login_id: string;
    login_username: string;
  };
}

interface LoginDataResponse {
  data: {
    display_name: string;
    username: string;
  };
}

export const getLoginLink = async (
  linkId: string,
  authToken: string
): Promise<LoginLinkResponse> => {
  const response = await fetch(
    `${SUPERMETRICS_BASE_PATH}/ds/login/link/${linkId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error(await response.text());
  }

  return (await response.json()) as LoginLinkResponse;
};

export const getLoginData = async (
  loginId: string,
  authToken: string
): Promise<LoginDataResponse> => {
  const response = await fetch(
    `${SUPERMETRICS_BASE_PATH}/ds/login/${loginId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error(await response.text());
  }

  return (await response.json()) as LoginDataResponse;
};

interface CreateLoginUrlResponse {
  data: {
    login_url: string;
    link_id: string;
  };
}

export const createLoginUrl = async ({
  platform,
  authToken,
  redirectUrl,
  expiryTime = "1 hour",
  dataSourceUsername,
}: {
  platform: string;
  authToken: string;
  redirectUrl: string;
  expiryTime?: string;
  dataSourceUsername?: string;
}): Promise<{
  data: {
    login_url: string;
    link_id: string;
  };
}> => {
  const response = await fetch(`${SUPERMETRICS_BASE_PATH}/ds/login/link`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
    body: JSON.stringify({
      ds_id: platform,
      expiry_time: expiryTime,
      redirect_url: redirectUrl,
      ...(dataSourceUsername && {
        require_username: dataSourceUsername,
      }),
    }),
  });

  if (!response.ok) {
    throw new Error(await response.text());
  }

  return (await response.json()) as CreateLoginUrlResponse;
};
