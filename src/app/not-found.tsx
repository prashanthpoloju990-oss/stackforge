"use client";

import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 py-12 bg-background notfound-page-container">
      <div className="flex flex-col items-center justify-center space-y-6">
        
        {/* Retro TV 404 Widget Wrapper */}
        <div className="main_wrapper relative scale-[0.8] sm:scale-100 select-none">
          <div className="main">
            <div className="antenna">
              <div className="antenna_shadow"></div>
              <div className="a1"></div>
              <div className="a1d"></div>
              <div className="a2"></div>
              <div className="a2d"></div>
              <div className="a_base"></div>
            </div>
            <div className="tv">
              <div className="cruve">
                <svg
                  className="curve_svg"
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  xmlnsXlink="http://www.w3.org/1999/xlink"
                  viewBox="0 0 189.929 189.929"
                  xmlSpace="preserve"
                >
                  <path
                    d="M70.343,70.343c-30.554,30.553-44.806,72.7-39.102,115.635l-29.738,3.951C-5.442,137.659,11.917,86.34,49.129,49.13
                C86.34,11.918,137.664-5.445,189.928,1.502l-3.95,29.738C143.041,25.54,100.895,39.789,70.343,70.343z"
                  />
                </svg>
              </div>
              <div className="display_div">
                <div className="screen_out">
                  <div className="screen_out1">
                    <div className="screen">
                      <span className="notfound_text">NOT FOUND</span>
                    </div>
                    <div className="screenM">
                      <span className="notfound_text">NOT FOUND</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="lines">
                <div className="line1"></div>
                <div className="line2"></div>
                <div className="line3"></div>
              </div>
              <div className="buttons_div">
                <div className="b1"><div /></div>
                <div className="b2"></div>
                <div className="speakers">
                  <div className="g1">
                    <div className="g11"></div>
                    <div className="g12"></div>
                    <div className="g13"></div>
                  </div>
                  <div className="g"></div>
                  <div className="g"></div>
                </div>
              </div>
            </div>
            <div className="bottom">
              <div className="base1"></div>
              <div className="base2"></div>
              <div className="base3"></div>
            </div>
          </div>
          <div className="text_404">
            <div className="text_4041">4</div>
            <div className="text_4042">0</div>
            <div className="text_4043">4</div>
          </div>
        </div>

        {/* Action Button & Help Text */}
        <div className="pt-2 text-center z-10 flex flex-col items-center gap-4">
          <p className="text-fluid-body text-forge-text-secondary/70 max-w-xs leading-relaxed">
            Lost in transmission? Let&apos;s get you back on frequency.
          </p>
          <Link
            href="/"
            className="btn-primary inline-flex items-center gap-2 bg-forge-accent text-white rounded-lg px-8 py-3.5 text-fluid-btn font-semibold uppercase transition-all duration-200 border-2 border-forge-text shadow-[4px_4px_0px_0px_var(--forge-text)] active:translate-y-1 active:shadow-[0px_0px_0px_0px_var(--forge-text)]"
          >
            Back to Home
          </Link>
        </div>

      </div>
    </main>
  );
}
