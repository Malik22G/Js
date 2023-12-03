"use client";
import _LandingWrapper, { _LoginBtn, _StartOnboardBtn } from "./client";
import TopMenu from "./components/landing/TopMenu";
import { LangProps } from "./props";

import FramerLandingEn from "./framer/en/Landing";
import FramerLandingHu from "./framer/hu/Landing";
import { useContext, useEffect } from "react";
import { AuthModalContext } from "./components/landing/AuthModal";

function HashObserver() {
  const authCtx = useContext(AuthModalContext);

  useEffect(() => {
    if (window.location.hash === "#AUTH") {
      authCtx.update(true);
    }
  }, []);

  useEffect(() => {
    function hashChange(e: HashChangeEvent) {
      const hash = new URL(e.newURL).hash;

      if (hash === "#AUTH") {
        authCtx.update(true);
      }
    }
    
    window.addEventListener("hashchange", hashChange);

    return () => {
      window.removeEventListener("hashchange", hashChange);
    };
  }, [authCtx]);

  return null;
}

export default function Landing({
  params: { lang },
}: LangProps) {

  useEffect(() => {
    if (globalThis["document"]) {
      const framerInside = document.getElementById("overlay")?.parentElement?.children[0] as HTMLElement | undefined;
      if (framerInside) {
        framerInside.style.minHeight = "100%";
        framerInside.style.width = "auto";
      }
    }
  }, []);

  return (
    <_LandingWrapper>
      <div className="w-full h-full">
        <TopMenu>
          <_LoginBtn />
        </TopMenu>
        <HashObserver />
        {lang === "hu" ? <FramerLandingHu /> : <FramerLandingEn />}
      </div>
    </_LandingWrapper>
  );
}
