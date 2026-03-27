import React from "react";
import "../styles/button.scss";

interface ButtonProps {
  text: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  className?: string;
  variant?: "primary" | "secondary";
  disabled?: boolean;
  showArrows?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  text,
  onClick,
  type = "button",
  className = "",
  variant = "primary",
  disabled = false,
  showArrows = true,
}) => {
  return (
    <button
      className={`animated-button ${variant === "secondary" ? "animated-button--secondary" : ""} ${className}`}
      onClick={onClick}
      type={type}
      disabled={disabled}
    >
      {showArrows && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="arr-2"
          viewBox="0 0 24 24"
        >
          <path d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z"></path>
        </svg>
      )}
      <span className="text">{text}</span>
      <span className="circle"></span>
      {showArrows && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="arr-1"
          viewBox="0 0 24 24"
        >
          <path d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z"></path>
        </svg>
      )}
    </button>
  );
};

export default Button;
