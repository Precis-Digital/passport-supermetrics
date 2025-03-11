const SUPERMETRICS_BASE_PATH = "https://api.supermetrics.com/enterprise/v2";

interface LoginLinkResponse {
  data: {
    login_id: string;
  };
}

interface LoginDataResponse {
  data: {
    display_name: string;
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
    throw new Error("Failed to fetch login link");
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
    throw new Error("Failed to fetch login data");
  }

  return (await response.json()) as LoginDataResponse;
};
