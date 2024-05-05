// eslint-disable-next-line @typescript-eslint/no-explicit-any
const updateCookies = (res: any, { refreshToken, accessToken }: any) => {
    /** Imposta l'header Cache-Control  */
    res.setHeader('Cache-Control', 'no-cache');
  
    if (!!refreshToken) res.cookie("refresh-token", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'None',
      maxAge: 604800000,
    });
  
    if (!!accessToken)
      res.cookie("access-token", accessToken, {
        /** Significa che il cookie non può essere accessibile tramite JavaScript */
        httpOnly: true,
        /** Impostato su true perché stai utilizzando HTTPS */
        secure: true,
        /** Permette l'invio del cookie da richieste cross-origin */
        sameSite: 'None',
        maxAge: 900000,
      });
    return res;
  };
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const destroyCookies = (res: any) => {
    res.setHeader('Cache-Control', 'no-cache');
    res.clearCookie("refresh-token", {
      secure: true,
      sameSite: 'None',
    });
    res.clearCookie("access-token", {
      secure: true,
      sameSite: 'None',
    });
    return res;
  };
  
  export default {
    updateCookies,
    destroyCookies,
  };
  