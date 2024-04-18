const timeExpiration = (rememberMe: boolean) => {
  if (rememberMe) {
    const oneWeek = 7 * 24 * 60 * 60;
    const exp = Math.floor(Date.now() / 1000) + oneWeek;

    return exp;
  }

  const oneHour = 3600;
  const exp = Math.floor(Date.now() / 1000) + oneHour;

  return exp;
};

export default timeExpiration;
