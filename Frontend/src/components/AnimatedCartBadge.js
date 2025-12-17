import React, { useEffect, useState } from "react";
import "../styles/AnimatedCartBadge.css";

export default function AnimatedCartBadge({ count }) {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (count > 0) {
      setAnimate(true);
      const t = setTimeout(() => setAnimate(false), 300); // animation duration
      return () => clearTimeout(t);
    }
  }, [count]);

  return (
    <span className={`cart-badge ${animate ? "cart-bounce" : ""}`}>
      {count}
    </span>
  );
}
