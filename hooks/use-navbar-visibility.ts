"use client";

import { useLenis } from "lenis/react";
import { useState } from "react";

const TOP_THRESHOLD = 80;

export function useNavbarVisibility() {
  const [visible, setVisible] = useState(true);

  useLenis((lenis) => {
    if (lenis.scroll < TOP_THRESHOLD) {
      setVisible(true);
      return;
    }
    if (lenis.direction === 1) setVisible(false);
    else if (lenis.direction === -1) setVisible(true);
  });

  return visible;
}
