export const getSafeRedirectPath = (
  redirectPath?: string | null,
  fallbackPath = "/"
) => {
  if (!redirectPath) {
    return fallbackPath;
  }

  if (!redirectPath.startsWith("/") || redirectPath.startsWith("//")) {
    return fallbackPath;
  }

  return redirectPath;
};
