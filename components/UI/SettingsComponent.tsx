import { initFirebase } from "@/firebase";
import useAuth from "@/hooks/useAuth";
import { useSubscription } from "@/hooks/useSubscription";
import { getAuth } from "firebase/auth";
import { useEffect, useState } from "react";
import SettingsLogin from "./SettingsLogin";

function SettingsComponent() {
  const app = initFirebase();
  const auth = getAuth(app);
  const subscription = useSubscription(app);

  const { user } = useAuth();

  const [isUserPremium, setUserPremium] = useState(false);
  const [premiumStatusName, setPremiumStatusName] = useState("");

  useEffect(() => {
    const checkPremium = async () => {
      setUserPremium(subscription.isActive);
      setPremiumStatusName(subscription.subscriptionName || "");
    };

    checkPremium();
  }, [app, auth.currentUser?.uid]);

  return (
    <div className="container">
      <div className="row">
        <div className="setting__title">Settings</div>
        {user ? (
          <>
            <div className="setting__info">
              <div className="setting__info--title">Your Subscription Plan</div>
              <div className="setting__info--subtitle">
                {isUserPremium ? (
                  premiumStatusName
                ) : (
                  <>
                    Basic
                    <a
                      href="/choose-plan"
                      className="btn settings__upgrade--btn"
                    >
                      Upgrade to Premium
                    </a>
                  </>
                )}
              </div>
            </div>
            <div className="setting__info">
              <div className="setting__info--title">Email</div>
              {user?.email ? (
                <div className="setting__info--subtitle">{user?.email}</div>
              ) : (
                <div className="setting__info--subtitle">Guest</div>
              )}
            </div>
          </>
        ) : (
          <SettingsLogin />
        )}
      </div>
    </div>
  );
}
export default SettingsComponent;
