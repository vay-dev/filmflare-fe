import { useState, useEffect } from "react";
import { CircleAlert, RefreshCw, AlertTriangle } from "lucide-react";
import "./styles/errorMessage.scss";

type ErrorMessageProps = {
  error?: string | null;
  onRetry?: () => void;
  maxAttempts?: number;
  retryDelay?: number;
};

const ErrorMessage = ({
  error,
  onRetry,
  maxAttempts = 5,
  retryDelay = 5,
}: ErrorMessageProps) => {
  const [attempts, setAttempts] = useState(0);
  const [countdown, setCountdown] = useState(retryDelay);
  const [isRetrying, setIsRetrying] = useState(false);
  const [isPermanent, setIsPermanent] = useState(false);

  useEffect(() => {
    if (!error || !onRetry) return;

    if (attempts < maxAttempts && !isPermanent) {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev === 1) {
            clearInterval(timer);
            setIsRetrying(true);

            // Simulate retry delay with animation
            setTimeout(() => {
              setIsRetrying(false);
              setAttempts((a) => a + 1);
              setCountdown(retryDelay);
              onRetry();
            }, 800);
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    } else if (attempts >= maxAttempts) {
      setIsPermanent(true);
    }
  }, [attempts, isPermanent, onRetry, error, maxAttempts, retryDelay]);

  const handleManualRetry = () => {
    if (isPermanent && onRetry) {
      setAttempts(0);
      setCountdown(retryDelay);
      setIsPermanent(false);
      setIsRetrying(true);

      setTimeout(() => {
        setIsRetrying(false);
        onRetry();
      }, 800);
    }
  };

  const handleReload = () => {
    window.location.reload();
  };

  if (!error) return null;

  return (
    <div className="error-message">
      <div className="error-message__container">
        <div className="error-message__content">
          {/* Icon Section */}
          <div className="error-message__icon-wrapper">
            <div
              className={`error-message__icon ${
                isPermanent ? "error-message__icon--critical" : ""
              }`}
            >
              {isPermanent ? (
                <AlertTriangle size={28} />
              ) : (
                <CircleAlert size={28} />
              )}
            </div>
            {!isPermanent && <div className="error-message__pulse-ring"></div>}
          </div>

          {/* Message Section */}
          <div className="error-message__text-content">
            <h3 className="error-message__title">
              {isPermanent ? "Connection Failed" : "Temporary Issue"}
            </h3>
            <p className="error-message__description">
              {error ||
                "Oops! Something went wrong while loading your content."}
            </p>

            {/* Retry Status */}
            {!isPermanent && onRetry && (
              <div className="error-message__retry-status">
                {isRetrying ? (
                  <div className="error-message__retrying">
                    <RefreshCw
                      size={16}
                      className="error-message__retry-icon error-message__retry-icon--spinning"
                    />
                    <span>Retrying...</span>
                  </div>
                ) : (
                  <div className="error-message__countdown">
                    <div className="error-message__countdown-circle">
                      <span className="error-message__countdown-number">
                        {countdown}
                      </span>
                      <svg
                        className="error-message__countdown-ring"
                        viewBox="0 0 36 36"
                      >
                        <path
                          className="error-message__countdown-bg"
                          d="M18 2.0845
                            a 15.9155 15.9155 0 0 1 0 31.831
                            a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                        <path
                          className="error-message__countdown-progress"
                          d="M18 2.0845
                            a 15.9155 15.9155 0 0 1 0 31.831
                            a 15.9155 15.9155 0 0 1 0 -31.831"
                          style={{
                            strokeDasharray: `${
                              ((retryDelay - countdown + 1) / retryDelay) * 100
                            }, 100`,
                          }}
                        />
                      </svg>
                    </div>
                    <span className="error-message__countdown-text">
                      Auto-retry in <strong>{countdown}</strong> seconds
                    </span>
                  </div>
                )}
                <div className="error-message__attempt-counter">
                  Attempt {attempts + 1} of {maxAttempts}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="error-message__actions">
          {isPermanent ? (
            <>
              {onRetry && (
                <button
                  className="error-message__btn error-message__btn--primary"
                  onClick={handleManualRetry}
                  disabled={isRetrying}
                >
                  <RefreshCw
                    size={16}
                    className={
                      isRetrying ? "error-message__retry-icon--spinning" : ""
                    }
                  />
                  {isRetrying ? "Retrying..." : "Try Again"}
                </button>
              )}
              <button
                className="error-message__btn error-message__btn--secondary"
                onClick={handleReload}
              >
                Reload Page
              </button>
            </>
          ) : (
            onRetry && (
              <button
                className="error-message__btn error-message__btn--ghost"
                onClick={handleManualRetry}
                disabled={isRetrying}
              >
                <RefreshCw
                  size={16}
                  className={
                    isRetrying ? "error-message__retry-icon--spinning" : ""
                  }
                />
                Retry Now
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default ErrorMessage;
