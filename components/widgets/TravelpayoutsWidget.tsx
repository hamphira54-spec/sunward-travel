'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { RefreshCw, WifiOff } from 'lucide-react';

type WidgetStatus = 'loading' | 'ready' | 'error' | 'timeout';

export interface TravelpayoutsWidgetProps {
  /** Full tpwdg.com script URL with all affiliate params intact */
  src: string;
  className?: string;
  /** Height of the animated skeleton while the widget loads (px) */
  skeletonHeight?: number;
  /** Milliseconds before showing the timeout fallback (default 12 s) */
  timeout?: number;
}

/**
 * Safe wrapper for any Travelpayouts tpwdg.com widget script.
 *
 * HOW IT WORKS (direct DOM injection — NOT an iframe):
 *
 * 1. A container div is rendered immediately and is always visible, so that
 *    `containerRef.current.clientWidth` is non-zero by the time the third-
 *    party script evaluates.  This is the critical fix:  Klook's
 *    auto_dynamic_widget uses `parentElement.clientWidth` as a guard; if it
 *    is 0 the widget silently aborts.  Kiwitaxi compact uses
 *    `document.currentScript` which also fails inside srcDoc iframes.
 *
 * 2. We wait (via ResizeObserver) for the container to have a positive
 *    clientWidth before injecting the <script> tag — handles edge cases where
 *    the parent flex/grid hasn't laid out yet.
 *
 * 3. A MutationObserver + polling interval detect when the provider's DOM
 *    appears and transition the UI from skeleton → ready.
 *
 * 4. A configurable timeout triggers a polished fallback card.
 *
 * 5. Cleanup removes timers and clears the container on unmount (SPA nav safe).
 */
export default function TravelpayoutsWidget({
  src,
  className = '',
  skeletonHeight = 340,
  timeout = 12_000,
}: TravelpayoutsWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const injectedRef  = useRef(false);
  const timerRef     = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pollRef      = useRef<ReturnType<typeof setInterval> | null>(null);
  const moRef        = useRef<MutationObserver | null>(null);
  const [status, setStatus] = useState<WidgetStatus>('loading');

  // ── Helpers ────────────────────────────────────────────────────────────────

  const stopTimers = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (pollRef.current)  clearInterval(pollRef.current);
    if (moRef.current)    moRef.current.disconnect();
  }, []);

  const markReady = useCallback(() => {
    stopTimers();
    setStatus('ready');
  }, [stopTimers]);

  // ── Script injection ────────────────────────────────────────────────────────

  const inject = useCallback(() => {
    const el = containerRef.current;
    if (!el || injectedRef.current) return;

    // Double-check layout width — Klook guard
    if (el.clientWidth === 0) return;

    injectedRef.current = true;

    // Timeout guard — show fallback if nothing appears
    timerRef.current = setTimeout(() => setStatus('timeout'), timeout);

    // MutationObserver — fires when the provider injects its DOM nodes
    moRef.current = new MutationObserver(() => {
      if ((containerRef.current?.scrollHeight ?? 0) > 80) markReady();
    });
    moRef.current.observe(el, { childList: true, subtree: true });

    // Polling fallback — some widgets update only via CSS changes
    pollRef.current = setInterval(() => {
      if ((containerRef.current?.scrollHeight ?? 0) > 80) markReady();
    }, 400);
    // Stop polling after timeout to avoid memory leaks
    setTimeout(() => { if (pollRef.current) clearInterval(pollRef.current); }, timeout + 2000);

    // Create and append the provider script
    const script = document.createElement('script');
    script.async = true;
    script.charset = 'utf-8';
    script.src = src;
    script.onerror = () => { stopTimers(); setStatus('error'); };
    el.appendChild(script);
  }, [src, timeout, markReady, stopTimers]);

  // ── Retry (used by fallback card) ──────────────────────────────────────────

  const retry = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    stopTimers();
    el.innerHTML = '';
    injectedRef.current = false;
    setStatus('loading');
    // Small delay so React can re-render the skeleton before re-injecting
    setTimeout(inject, 80);
  }, [inject, stopTimers]);

  // ── Effect — wait for layout width, then inject ────────────────────────────

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    if (el.clientWidth > 0) {
      inject();
      return stopTimers;
    }

    // Container not yet laid out — wait for ResizeObserver
    const ro = new ResizeObserver(() => {
      if ((containerRef.current?.clientWidth ?? 0) > 0) {
        ro.disconnect();
        inject();
      }
    });
    ro.observe(el);

    return () => {
      ro.disconnect();
      stopTimers();
    };
  }, [inject, stopTimers]);

  // ── Fallback UI ────────────────────────────────────────────────────────────

  if (status === 'error' || status === 'timeout') {
    return (
      <div
        className={`w-full flex flex-col items-center justify-center gap-4 py-14 px-6
          rounded-2xl bg-surface border border-gray-200 text-center ${className}`}
        style={{ minHeight: skeletonHeight }}
      >
        <WifiOff size={28} className="text-mist" />
        <div>
          <p className="font-display font-700 text-ink text-sm mb-1">
            {status === 'timeout'
              ? 'Search is taking longer than expected'
              : 'Could not load search widget'}
          </p>
          <p className="text-mist text-xs max-w-xs mx-auto">
            Our partner service may be temporarily unavailable.
            Please refresh the page or try again shortly.
          </p>
        </div>
        <button
          onClick={retry}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-ocean text-white
            text-xs font-700 hover:bg-ocean-dark transition-colors"
        >
          <RefreshCw size={12} />
          Try again
        </button>
      </div>
    );
  }

  // ── Normal render — skeleton overlays the container while loading ──────────

  return (
    <div className={`relative w-full ${className}`}>
      {/* Skeleton — animated gradient behind the widget while it loads */}
      {status === 'loading' && (
        <div
          aria-hidden="true"
          className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none"
          style={{ minHeight: skeletonHeight }}
        >
          <div className="w-full h-full bg-gradient-to-r from-surface via-white/80 to-surface animate-pulse" />
          <div className="absolute inset-0 flex flex-col gap-3 p-6 opacity-40">
            <div className="h-4 bg-mist/20 rounded-lg w-1/3" />
            <div className="h-10 bg-mist/15 rounded-xl w-full" />
            <div className="grid grid-cols-3 gap-3">
              <div className="h-10 bg-mist/15 rounded-xl" />
              <div className="h-10 bg-mist/15 rounded-xl" />
              <div className="h-10 bg-mist/15 rounded-xl" />
            </div>
            <div className="h-11 bg-ocean/20 rounded-xl w-full mt-1" />
          </div>
        </div>
      )}

      {/*
        Widget injection target.

        CRITICAL: This div must remain VISIBLE (not display:none or
        visibility:hidden) at all times, including during 'loading' state.
        Provider scripts (Klook, Kiwitaxi) measure clientWidth at evaluation
        time — hiding the container causes clientWidth=0 and widget abort.

        We use minHeight to hold space during loading; the content collapses
        it naturally once the widget renders.
      */}
      <div
        ref={containerRef}
        className="w-full"
        style={{ minHeight: status === 'loading' ? skeletonHeight : undefined }}
      />
    </div>
  );
}
