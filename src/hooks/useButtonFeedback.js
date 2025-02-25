import { useCallback } from "react";

export const useButtonFeedback = () => {
  const playFeedback = useCallback(() => {
    // 진동 - 짧은 햅틱 피드백 패턴
    if (navigator.vibrate) {
      navigator.vibrate([10, 5, 10]);
    }
  }, []);

  return playFeedback;
};
