"use client";
import React, { useState } from "react";
import "../../Style/BiblePlans.css"; // Import the separate CSS file

const BiblePlans = () => {
  // State to track which step is active (1, 2, or 3)
  const [activeStep, setActiveStep] = useState(1);
  // State to track selected plan
  const [selectedPlan, setSelectedPlan] = useState(null);
  // State to track selected day for detailed view
  const [selectedDay, setSelectedDay] = useState(null);

  // Handle starting a plan
  const handleStartPlan = (planName) => {
    setSelectedPlan(planName);
    setActiveStep(2);
  };

  // Handle continuing to next day
  const handleContinueDay = () => {
    setActiveStep(3);
    setSelectedDay(3); // Day 3 as active
  };

  // Handle viewing a specific day from timeline
  const handleViewDay = (dayNumber) => {
    setSelectedDay(dayNumber);
    setActiveStep(3);
  };

  // Handle going back to previous step
  const handleGoBack = () => {
    if (activeStep === 3) {
      setActiveStep(2);
    } else if (activeStep === 2) {
      setActiveStep(1);
      setSelectedPlan(null);
    }
  };

  // Handle marking day as complete
  const handleMarkComplete = () => {
    // Logic to mark day as complete
    alert(`Day ${selectedDay} marked as complete!`);
    // Go back to step 2 after completion
    setActiveStep(2);
  };

  return (
    <main className="hm--main">
      {/* STEP 1: DISCOVERY - Browse and Select Plans */}
      {activeStep === 1 && (
        <>
          {/* Hero Banner */}
          <section className="hm--hero-section first--hero--section">
            <div className="hm--hero-card first--hero--card">
              <img
                alt="Bible in sunlight"
                className="hm--hero-image"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBkNWkn7VBR9WhzXac11cZGjmX0PHRxooR2dfD14N2QHS869eCfsMw7SKOrasfgZLa4JWInPxkfIE89VMJk2ZaO7nApEAFPLf2XHeKnGPnZ9dDpwD97VkXAd13rPc2dMDbZUt5-gPCtNeyEDyt1QouaPH4fP_xeUqHibCQCBlx_k5Lam36Onn58ztKimze3PDIRXLsvTKhTxusIKT97XfIH95X8K-Oo4H820hOpv4zkDUBvI0Xwpwtn5LEX5pvozZJR5azzoFMvfBs"
              />
              <div className="hm--hero-overlay">
                <div className="hm--hero-content">
                  <div>
                    <span className="hm--hero-badge">Recommended for you</span>
                    <h1 className="hm--hero-title">This Weeks Bible Plan</h1>
                  </div>
                  <div className="hm--hero-icon-circle">
                    <span className="material-symbols-outlined hm--hero-icon">
                      chevron_right
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Plan Discovery Grid */}
          <section className="hm--plans-section">
            <div className="hm--section-header">
              <h2 className="hm--section-title">Bible Plans</h2>
              <a className="hm--view-all-link" href="#">
                SEE ALL PLANS
              </a>
            </div>
            <div className="hm--plans-grid">
              {/* Plan Card 1 */}
              <div className="hm--plan-card">
                <div className="hm--card-image-wrapper">
                  <img
                    alt="Discipline thumbnail"
                    className="hm--card-image"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuASsYz9qcYGf8tShPWnQ_N5dlEdyRz6_6ZcA7iD9YEsjzWm7U5JMbI04MPQ0SHd9OK1zjMoBy5p0Rg8WZ4Zhogx9pgTHqM-C00woQqBDpnNSbXU5uXdTaUZLvUIJ1J3nUyBsV2WkPu6fUuxC_5NwtivR-6ZkR1ObHgIh-EBh_WQXCs3zOup_tDraxGiSYR04N1pYKFfbMBwIdOMnnEvwyDjMcJbYTZEY85ZKjGPno2NLMiPPMuEbzTaxBQGe0dcSMme36ZYL7WeeCQ"
                  />
                </div>
                <div className="hm--card-content">
                  <div className="hm--card-header">
                    <h3 className="hm--card-title">Discipline</h3>
                    <span className="hm--card-duration">5 Days</span>
                  </div>
                  <p className="hm--card-description">
                    Build spiritual foundations through daily prayer and
                    consistent scripture engagement.
                  </p>
                  <button
                    className="hm--start-button"
                    onClick={() => handleStartPlan("Discipline")}
                  >
                    Start Plan
                  </button>
                </div>
              </div>

              {/* Plan Card 2 */}
              <div className="hm--plan-card">
                <div className="hm--card-image-wrapper">
                  <img
                    alt="Anxiety thumbnail"
                    className="hm--card-image"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDKGWuir8kKTf6JQqNk2jAyMl2YswJDmms_X3P_V9LCDkgdYCv9wqLMtT7LPElWgtRmgZEvnK1nuvf1xAdNGoIa7tmd8xgwAg49l7h15NKC20wSHDPz0IaHlCMtG5W-r4McrTvQQVmA1cE59m2pngS3Y0e503i4Jv6Vag4iUNTBE4ubTgDl6w-Atk98L0oYfgeCr7A0CJ9ixV8vqOC3LIadFZvne01uaAIJIFVpWs70K-BDD9RoQv7jluqYt_bIrYkf_2Wc3esmUUA"
                  />
                </div>
                <div className="hm--card-content">
                  <div className="hm--card-header">
                    <h3 className="hm--card-title">Anxiety</h3>
                    <span className="hm--card-duration">7 Days</span>
                  </div>
                  <p className="hm--card-description">
                    Finding rest and quiet for your soul in times of
                    overwhelming worry.
                  </p>
                  <button
                    className="hm--start-button"
                    onClick={() => handleStartPlan("Anxiety")}
                  >
                    Start Plan
                  </button>
                </div>
              </div>

              {/* Plan Card 3 */}
              <div className="hm--plan-card">
                <div className="hm--card-image-wrapper">
                  <img
                    alt="Purpose thumbnail"
                    className="hm--card-image"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCkENnwugV41cUozOdALwEFX462FtVoKxeljgiPZ0Vbs30mWtyElxoGExpens0Q0ezX5_-BGtWM17Wg_-YWI1d_HfxfkOdOO822dEX_AU2PvxKKXtfnRN5p4TB8-NiJyaMKKTCP1SYb0987TRJ7RQi0BytQ7b7_Xd3n0K_SGUmxCxTfz0XKs9SRsgt1pScbogvY7s3hBP9yTNJDxL2u2ijrx71FnKrlPFDSSwrY8zBGXaQG6lLv6hvIenksWe0uMPk7M8nInJZGJK4"
                  />
                </div>
                <div className="hm--card-content">
                  <div className="hm--card-header">
                    <h3 className="hm--card-title">Purpose</h3>
                    <span className="hm--card-duration">4 Days</span>
                  </div>
                  <p className="hm--card-description">
                    Discovering Gods unique design for your life and your
                    specific calling.
                  </p>
                  <button
                    className="hm--start-button"
                    onClick={() => handleStartPlan("Purpose")}
                  >
                    Start Plan
                  </button>
                </div>
              </div>

              {/* Plan Card 4 */}
              <div className="hm--plan-card">
                <div className="hm--card-image-wrapper">
                  <img
                    alt="Strength + Faith thumbnail"
                    className="hm--card-image"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBCaynF3EmHkV1L1o14VUb4uL-3eNy5XtzTJp5BKJzQYFKKzM4J949wnor8cYJBHFxUhT-kpThk_QtHWkNHDwslFU_CBhaodwlwiRsuC7RQV907tkvkegdLcGXsMLIb3BUS3_fBh2840GgIp0LW9EfGq7lMzly-nUh2PMmZyV86X3tgxbxNR0zVWNgGQp_fA--EXjI7DHyq7-IgHOPuj2FheRfSeLusq8hCPzaBV_WlzL0VplycVNFlkclNnY5-GkwuNljnVwY814Y"
                  />
                </div>
                <div className="hm--card-content">
                  <div className="hm--card-header">
                    <h3 className="hm--card-title">Strength + Faith</h3>
                    <span className="hm--card-duration">7 Days</span>
                  </div>
                  <p className="hm--card-description">
                    Cultivating a resilient spirit that stands firm regardless
                    of the seasons of life.
                  </p>
                  <button
                    className="hm--start-button"
                    onClick={() => handleStartPlan("Strength + Faith")}
                  >
                    Start Plan
                  </button>
                </div>
              </div>
            </div>
          </section>
        </>
      )}

      {/* STEP 2: ACTIVE PLAN OVERVIEW - Current Plan Progress */}
      {activeStep === 2 && (
        <>
          {/* Back Button */}
          <button className="hm--back-button" onClick={handleGoBack}>
            <span className="material-symbols-outlined">arrow_back</span>
            Back to Plans
          </button>

          {/* Active Journey Hero */}
          <section className="hm--hero-section">
            <div className="hm--hero-card">
              <img
                alt="Sacred study space"
                className="hm--hero-image"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAADSe6pbGAv-yXCVZloPIr8tp6vQSWtZ3kdSYi1ZALIPzTYGZg5tlnDHIpi25-Sxkd-imMJ3e8sfDTAsQHFfy3sKIkgEoWMf4gFaZ10LUI8IW1XboSMrV8ZZ9fviv2L5Tx0-VHcc6B1vxjyLGB8rmMwp9iZ9iSA84ytwpr7n4q1Jymg7UReQH-SFjTPHfRqPHWhlwPexYbx42jqVZCqVtaqFcWORj0Oi0cctIOr1vF8W8aw4MPXbO10IaQeN6GL-X2egJ66h_fxJDU"
              />
              <div className="hm--hero-gradient"></div>
              <div className="hm--hero-overlay">
                <div className="hm--hero-content">
                  <div className="hm--hero-text">
                    <h2 className="hm--hero-title">
                      {selectedPlan || "Walking in Discipline"}
                    </h2>
                    <div className="hm--hero-progress">
                      <div className="hm--progress-bar">
                        <div className="hm--progress-fill"></div>
                      </div>
                      <span className="hm--progress-text">
                        2/5 Days Complete
                      </span>
                    </div>
                  </div>
                  <button
                    className="hm--continue-button"
                    onClick={handleContinueDay}
                  >
                    <span>Continue Day 3</span>
                    <span className="material-symbols-outlined hm--button-icon">
                      arrow_forward
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Plan Curriculum Timeline */}
          <section className="hm--curriculum-section">
            <div className="hm--curriculum-header">
              <h3 className="hm--curriculum-title">Plan Curriculum</h3>
              <span className="hm--curriculum-subtitle">
                5 Lessons • Estimated 15 min / day
              </span>
            </div>
            <div className="hm--timeline">
              {/* Day 1: Completed */}
              <div
                className="hm--timeline-item hm--timeline-completed"
                onClick={() => handleViewDay(1)}
              >
                <div className="hm--timeline-icon hm--icon-completed">
                  <span
                    className="material-symbols-outlined"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    check_circle
                  </span>
                </div>
                <div className="hm--timeline-content">
                  <div className="hm--timeline-header">
                    <h4 className="hm--timeline-day-title">
                      Day 1: Self-Control
                    </h4>
                    <span className="hm--timeline-status hm--status-completed">
                      Completed
                    </span>
                  </div>
                  <p className="hm--timeline-description">
                    Understanding the biblical foundations of restraining the
                    flesh for spiritual growth.
                  </p>
                </div>
              </div>

              {/* Day 2: Completed */}
              <div
                className="hm--timeline-item hm--timeline-completed"
                onClick={() => handleViewDay(2)}
              >
                <div className="hm--timeline-icon hm--icon-completed">
                  <span
                    className="material-symbols-outlined"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    check_circle
                  </span>
                </div>
                <div className="hm--timeline-content">
                  <div className="hm--timeline-header">
                    <h4 className="hm--timeline-day-title">Day 2: Diligence</h4>
                    <span className="hm--timeline-status hm--status-completed">
                      Completed
                    </span>
                  </div>
                  <p className="hm--timeline-description">
                    The call to labor faithfully in whatever station God has
                    placed you.
                  </p>
                </div>
              </div>

              {/* Day 3: Active */}
              <div
                className="hm--timeline-item hm--timeline-active"
                onClick={() => handleViewDay(3)}
              >
                <div className="hm--timeline-icon hm--icon-active">
                  <span className="hm--icon-number">03</span>
                </div>
                <div className="hm--timeline-content">
                  <div className="hm--timeline-header">
                    <h4 className="hm--timeline-day-title">Day 3: Obedience</h4>
                    <span className="hm--timeline-status hm--status-active">
                      Up Next
                    </span>
                  </div>
                  <p className="hm--timeline-description">
                    Surrendering your will to the Divine path even when the road
                    is narrow.
                  </p>
                  <div className="hm--timeline-tags">
                    <span className="hm--tag">12 MIN READ</span>
                    <span className="hm--tag">REFLECTION</span>
                  </div>
                </div>
              </div>

              {/* Day 4: Locked */}
              <div className="hm--timeline-item hm--timeline-locked">
                <div className="hm--timeline-icon hm--icon-locked">
                  <span className="material-symbols-outlined">lock</span>
                </div>
                <div className="hm--timeline-content">
                  <h4 className="hm--timeline-day-title">
                    Day 4: Perseverance
                  </h4>
                  <p className="hm--timeline-description">
                    How to stand firm when spiritual fatigue sets in during the
                    middle of the journey.
                  </p>
                </div>
              </div>

              {/* Day 5: Locked */}
              <div className="hm--timeline-item hm--timeline-locked">
                <div className="hm--timeline-icon hm--icon-locked">
                  <span className="material-symbols-outlined">lock</span>
                </div>
                <div className="hm--timeline-content">
                  <h4 className="hm--timeline-day-title">
                    Day 5: Prayer & Fasting
                  </h4>
                  <p className="hm--timeline-description">
                    Culminating the plan with the most vital tools for
                    maintaining a disciplined soul.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </>
      )}

      {/* STEP 3: DAILY CONTENT - Detailed Lesson View */}
      {activeStep === 3 && (
        <>
          {/* Back Button */}
          <button className="hm--back-button" onClick={handleGoBack}>
            <span className="material-symbols-outlined">arrow_back</span>
            Back to Curriculum
          </button>

          <section className="hm--detail-section">
            <div className="hm--detail-container">
              {/* Content Header with Image */}
              <div className="hm--detail-header">
                <img
                  alt="Plan Header"
                  className="hm--detail-header-image"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDy9fnYU1Nrp2rOqBhF3T52qUHCgtDsaJl-A-ih08IujUpWQDzmkUq0RQhnlPS99de6iXO3DWSNOJhVVGawWkTD9pWioZyE9U1ZrvG9zVe62CnuTdXbPNj58SKqEfQ-H7JN0KbaFCBwBS6RCHF8DkUd-O1A8GtT01T5eH0ipDA6JjHO3gZPR5KgALqu7Ji2NUJGacJ8rD4kaA8VT8utN8wFLoDCPpS79XxphFT3lUbYXFC66G8BKyESRXD-Q243O3Gwgmotg6h4TLB-"
                />
                <div className="hm--detail-header-overlay">
                  <div className="hm--detail-breadcrumb">
                    <span className="hm--breadcrumb-text">
                      {selectedPlan || "Walking in Discipline"}
                    </span>
                  </div>
                  <h2 className="hm--detail-title">
                    Day {selectedDay} -{" "}
                    {selectedDay === 3
                      ? "Obedience"
                      : selectedDay === 2
                        ? "Diligence"
                        : "Self-Control"}
                  </h2>
                  <div className="hm--detail-progress-wrapper">
                    <div className="hm--detail-progress-header">
                      <span className="hm--detail-progress-label">
                        {selectedDay === 3
                          ? "2/5 Days Complete"
                          : "2/5 Days Complete"}
                      </span>
                    </div>
                    <div className="hm--detail-progress-bar-container">
                      <div className="hm--detail-progress-segment hm--progress-filled"></div>
                      <div className="hm--detail-progress-segment hm--progress-filled"></div>
                      <div className="hm--detail-progress-segment hm--progress-empty"></div>
                      <div className="hm--detail-progress-segment hm--progress-empty"></div>
                      <div className="hm--detail-progress-segment hm--progress-empty"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Scripture Section */}
              <div className="hm--detail-scripture">
                <div className="hm--scripture-icon-wrapper">
                  <span className="material-symbols-outlined hm--scripture-icon">
                    book
                  </span>
                  <h3 className="hm--scripture-title">
                    {selectedDay === 3 ? "Proverbs 13:4" : "Proverbs 13:4"}
                  </h3>
                </div>

                <div className="hm--scripture-card">
                  <p className="hm--scripture-text">
                    The soul of the sluggard craves and gets nothing, while the
                    soul of the diligent is richly supplied.
                  </p>
                </div>
              </div>

              {/* Devotional Section */}
              <div className="hm--devotional-section">
                <h3 className="hm--devotional-title">Devotional</h3>
                <div className="hm--devotional-content">
                  <p className="hm--devotional-paragraph">
                    Diligence is key to a disciplined life. God calls us to work
                    diligently, as a reflection of our commitment to Him.
                  </p>
                  <p className="hm--devotional-paragraph">
                    Are you giving your best in your spiritual pursuits?
                    Diligence is not about perfection but consistent, steady
                    effort. Today, ask God to help you stay focused on the tasks
                    He has set before you.
                  </p>
                </div>
              </div>

              {/* Reflection Section */}
              <div className="hm--reflection-section">
                <h3 className="hm--reflection-title">Reflection</h3>
                <div className="hm--reflection-card">
                  <p className="hm--reflection-question">
                    In what area of your life do you need to cultivate more
                    diligence?
                  </p>
                  <textarea
                    className="hm--reflection-textarea"
                    placeholder="Write your notes here..."
                    rows={4}
                  ></textarea>
                  <button
                    className="hm--mark-complete-button"
                    onClick={handleMarkComplete}
                  >
                    <span className="material-symbols-outlined hm--check-icon">
                      check_box
                    </span>
                    Mark Complete
                  </button>
                </div>
              </div>
            </div>
          </section>
        </>
      )}
    </main>
  );
};

export default BiblePlans;
