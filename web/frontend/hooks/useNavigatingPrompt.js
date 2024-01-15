import { useCallback, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import history from "./history";

/**
 * https://stackoverflow.com/questions/74106591/getting-navigator-block-is-not-a-function-while-navigating-to-other-page
 */

const useBlocker = (blocker, when = true) => {
  useEffect(() => {
    if (!when) return;
    const unblock = history.block((tx) => {
      const autoUnblockingTx = {
        ...tx,
        retry() {
          unblock();
          tx.retry();
        }
      };
      blocker(autoUnblockingTx);
    });
    return unblock;
  }, [blocker, when]);
};

export const useCallbackPrompt = (when) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showPrompt, setShowPrompt] = useState(false);
  const [lastLocation, setLastLocation] = useState(null);
  const [confirmedNavigation, setConfirmedNavigation] = useState(false);
  const cancelNavigation = useCallback(() => {
    setShowPrompt(false);
    setConfirmedNavigation(true);

  }, []);

  const handleBlockedNavigation = useCallback(
    (nextLocation) => {
      if (
        !confirmedNavigation &&
        nextLocation.location.pathname !== location.pathname
      ) {
        setShowPrompt(true);
        setLastLocation(nextLocation);
        return false;
      }
      return true;
    },
    [confirmedNavigation]
  );

  const confirmNavigation = useCallback(() => {
    setShowPrompt(false);
    setConfirmedNavigation(true);
  }, []);
  useEffect(() => {
    if (confirmedNavigation && lastLocation) {
      navigate(lastLocation.location.pathname);
    }
  }, [confirmedNavigation, lastLocation]);
  useBlocker(handleBlockedNavigation, when);
  return [showPrompt, confirmNavigation, cancelNavigation,setShowPrompt];
};
