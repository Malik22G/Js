import LoadingButton from "@/components/ui/LoadingButton";
import { useEffect, useState } from "react";

export default function FacebookLogin({
  setAccess,
}: {
  setAccess(obj: { accessToken: string; userID: string }): any;
}) {
  const [loadSetup, setLoadSetup] = useState<boolean>(false);
  const [loaded, setLoaded] = useState<boolean>(false);

  useEffect(() => {
    if ((window as any).fbAsyncInit) {
      (window as any).FB.getLoginStatus(function (_: any) {
        setLoaded(true);
      });
    } else {
      (window as any).fbAsyncInit = () => {
        (window as any).FB.init({
          appId: "410589949570890",
          autoLogAppEvents: false,
          xfbml: true,
          version: "v17.0",
        });
        setLoaded(true);
      };
    }
    setLoadSetup(true);
  }, []);

  return (
    <>
      {loaded ? (
        <LoadingButton
          palette="secondary"
          className="w-full"
          action={async () => {
            return await new Promise((resolve) => {
              (window as any).FB.login(
                (response: any) => {
                  if (response.authResponse) {
                    setAccess({
                      accessToken: response.authResponse.accessToken,
                      userID: response.authResponse.userID,
                    });
                  }

                  resolve(1);
                },
                {
                  scope:
                    "public_profile,email,pages_show_list,pages_manage_engagement,pages_manage_posts,pages_manage_instant_articles,pages_manage_cta,pages_read_engagement,pages_read_user_content,pages_manage_ads,read_insights,pages_manage_metadata",
                }
              );
            });
          }}
        >
          Sign in with Facebook
        </LoadingButton>
      ) : (
        <span>Loading...</span>
      )}
      {loadSetup ? (
        <script
          async
          defer
          crossOrigin="anonymous"
          src="https://connect.facebook.net/en_US/sdk.js"
        ></script>
      ) : null}
    </>
  );
}
