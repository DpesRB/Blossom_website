"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

const FALLBACK_SLIDES = [
  { id: 'fallback-1', image_url: "https://images.unsplash.com/photo-1610030469983-98e550d615ef?auto=format&fit=crop&q=80&w=800", title: "Welcome to Blossom" }
];

export default function HeroCarousel({ slides }) {
  const activeSlides = slides && slides.length > 0 ? slides : FALLBACK_SLIDES;
  const [startIndex, setStartIndex] = useState(0);

  const nextSlide = useCallback(() => {
    setStartIndex((prev) => (prev + 1 >= activeSlides.length ? 0 : prev + 1));
  }, [activeSlides.length]);

  const prevSlide = () => {
    setStartIndex((prev) => (prev === 0 ? activeSlides.length - 1 : prev - 1));
  };

  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  const visibleSlides = [
    activeSlides[startIndex],
    activeSlides[(startIndex + 1) % activeSlides.length],
    activeSlides[(startIndex + 2) % activeSlides.length],
  ];

  return (
    <div className="hero-dark-section">
      <div className="hero-text-content fade-in">
        <div className="badge-outline">New summer collection {new Date().getFullYear()}</div>
        <h1>Where style speaks, trends resonate,<br/>fashion flourishes</h1>
        <p>Unveiling a fashion destination where trends blend seamlessly with your<br/> individual style aspirations. Discover today!</p>
        
        <Link href="#collection" className="btn-light-pill btn-with-arrow">
          New collection <span>&rarr;</span>
        </Link>
      </div>

      <div className="arch-carousel-wrapper fade-in">
        {/* The Sleek Left Arrow is Back! */}
        <button onClick={prevSlide} className="arch-nav-btn left-btn" aria-label="Previous">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>
        
        <div className="arch-track">
          {visibleSlides.map((slide, index) => (
            <div key={slide?.id || index} className={`arch-frame ${index === 1 ? 'arch-center' : ''}`}>
              <img key={slide?.id} src={slide?.image_url} alt={slide?.title} className="arch-image cinematic-fade" />
              
              {index === 1 && slide?.title && (
                <div className="arch-overlay cinematic-fade">
                  <div className="glass-pill">{slide.title}</div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* The Sleek Right Arrow is Back! */}
        <button onClick={nextSlide} className="arch-nav-btn right-btn" aria-label="Next">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      </div>
    </div>
  );
}