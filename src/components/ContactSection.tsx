"use client";

import React from "react";

export default function ContactSection() {
  return (
    <section className="portfolio-section" id="connect" aria-label="Contact">
      <div className="section-header reveal">
        <span className="section-eyebrow">Get In Touch</span>
        <h2 className="section-title">Let&apos;s Connect</h2>
      </div>

      <div className="contact-form-container reveal">
        <form
          action="https://formspree.io/f/mvgwzbnb"
          method="POST"
          className="contact-form"
          id="contact-form"
          suppressHydrationWarning
        >
          <input
            type="text"
            name="name"
            id="form-name"
            placeholder="Your Name"
            required
            suppressHydrationWarning
          />
          <input
            type="email"
            name="_replyto"
            id="form-email"
            placeholder="Your Email"
            required
            suppressHydrationWarning
          />
          <textarea
            name="message"
            id="form-message"
            placeholder="Tell me about your project or opportunity!"
            rows={5}
            required
            suppressHydrationWarning
          ></textarea>
          <button
            type="submit"
            className="cta-button"
            id="form-submit"
            suppressHydrationWarning
          >
            Send Message
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </form>
      </div>
    </section>
  );
}
