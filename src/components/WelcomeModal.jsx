import React, { useEffect } from 'react';

export default function WelcomeModal({ onClose }) {
  useEffect(() => {
    function handleKey(e) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <div className="welcome-overlay" onClick={onClose}>
      <div className="welcome-modal" onClick={(e) => e.stopPropagation()}>
        <button className="welcome-close" onClick={onClose} aria-label="Close">
          &times;
        </button>

        <div className="welcome-eyebrow">Wind Farm Parameter Explorer</div>
        <h2 className="welcome-title">
          Explore how a single global power curve fits real wind farms.
        </h2>

        <p className="welcome-lede">
          This dashboard tests one question: how close can a blind, globally-applicable
          power curve come to a farm's <em>actual</em> hourly generation — across 105 real
          wind farms in 9 countries. Move the sliders, switch modes, and inspect any farm.
        </p>

        <div className="welcome-sections">
          <section>
            <h3>What you're looking at</h3>
            <p>
              Every wind REC has a location and an annual volume. That's enough —
              plus ERA5 reanalysis wind data — to build a defensible hourly generation
              shape and compute a <strong>matching score</strong>: the fraction of a
              buyer's demand that can be met by that generator on an hour-by-hour basis.
              The dashboard shows how accurate the match is per farm, given a chosen
              power curve.
            </p>
          </section>

          <section>
            <h3>How it's calculated</h3>
            <ol>
              <li>Pull hourly 100m wind speeds from <strong>ERA5</strong> (Google Earth Engine) at each farm's lat/lon for a full year.</li>
              <li>Apply a generic power curve defined by two knobs: <strong>Vr</strong> (rated wind speed) and <strong>n</strong> (curve exponent).</li>
              <li>Produce an 8,760-hour modeled generation profile.</li>
              <li>Compute matching scores against a reference load, for both modeled and actual metered output.</li>
              <li>Report the <strong>signed error in percentage points</strong> (pp). Positive = overcredited; negative = undercredited.</li>
            </ol>
          </section>

          <section>
            <h3>The controls</h3>
            <ul>
              <li><strong>Type filter (All / Offshore / Onshore)</strong> — restrict the fleet.</li>
              <li><strong>Mode (Blind vs N-month calibration)</strong> — blind uses one global curve; calibrated refits the curve using N months of that farm's own metered data.</li>
              <li><strong>Wind Climate (ERA5 raw vs GWA corrected)</strong> — GWA (Global Wind Atlas) rescales ERA5 winds toward the local long-term mean.</li>
              <li><strong>Presets</strong> — Conservative (Vr 15, n 2), Optimized (Vr 13.5, n 1.75), Cubic (n 3, textbook).</li>
              <li><strong>Sliders</strong> — move Vr and n independently and watch the fleet-wide error distribution respond in real time.</li>
              <li><strong>Click any farm row</strong> — open its modeled vs actual power curve and generation CDF.</li>
            </ul>
          </section>

          <section>
            <h3>The data</h3>
            <p>
              105 farms across <strong>UK, Australia, Canada, Belgium, Denmark, New
              Zealand, Brazil, USA, and China</strong>. Metered data from Dryad, ENTSO-E,
              AEMO, IESO, NZ EMI, BMRS, SCADA archives, ONS Brazil, and SDWPF. ERA5
              reanalysis from Google Earth Engine. Source study:{' '}
              <a
                href="https://github.com/NathanDIyer/GEE_Test/tree/main/Satellite_Paper"
                target="_blank"
                rel="noopener noreferrer"
              >
                Satellite Paper
              </a>.
            </p>
          </section>

          <section>
            <h3>Reading the results</h3>
            <ul>
              <li><strong>Median error</strong> is the median of absolute errors — a summary of typical accuracy.</li>
              <li><strong>Overcredited %</strong> is the share of farms where the model overstates matching score. For certificate markets, overcrediting is worse than undercrediting.</li>
              <li><strong>Every icon</strong> <span className="info-badge-inline">i</span> on the page explains that specific metric, chart, or control.</li>
            </ul>
          </section>
        </div>

        <div className="welcome-footer">
          <button className="welcome-cta" onClick={onClose}>
            Start exploring
          </button>
          <span className="welcome-footnote">You can reopen this any time via the <strong>?</strong> button in the header.</span>
        </div>
      </div>
    </div>
  );
}
