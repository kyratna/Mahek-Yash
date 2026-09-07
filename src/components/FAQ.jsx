import { useState } from "react";
import content from "../content";
import Footer from "./Footer";
import VenueModal from "./VenueModal";
import GalleryUploadModal from "./GalleryUploadModal";
import cameraIcon from "../assets/flaticons/camera-711191.png";
import { smoothScrollTo } from "../lib/smoothScroll";
import "./FAQ.css";

export default function FAQ({ isDateRevealed }) {
  const { faq, venue } = content;
  const [openIndex, setOpenIndex] = useState(null);
  const [isVenueModalOpen, setIsVenueModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const toggle = (index) => {
    setOpenIndex((current) => (current === index ? null : index));
  };

  return (
    <section id="faq" className="section faq-section">
      <div className="section__inner">
        <div className="faq-content-wrap">
          <div className="section__heading">
            <span className="eyebrow">Good to Know</span>
            <h2>FAQ</h2>
          </div>
          <div className="faq-list">
            {faq.map((item, index) => {
              const isOpen = openIndex === index;
              return (
                <div className="faq-item" key={item.question}>
                  <button
                    type="button"
                    className="faq-item__question"
                    onClick={() => toggle(index)}
                    aria-expanded={isOpen}
                  >
                    <span>{item.question}</span>
                    <span className="faq-item__icon">{isOpen ? "−" : "+"}</span>
                  </button>
                  {isOpen && (
                    <div className="faq-item__answer-wrap">
                      <p className="faq-item__answer">{item.answer}</p>
                      {item.action?.type === "venueModal" && (
                        <div className="faq-item__action-row">
                          <button
                            type="button"
                            className="faq-item__action-btn faq-item__action-btn--venue"
                            onClick={() => setIsVenueModalOpen(true)}
                          >
                            <svg
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              aria-hidden="true"
                            >
                              <path d="M12 2a8 8 0 0 0-8 8c0 5.25 8 12 8 12s8-6.75 8-12a8 8 0 0 0-8-8z" />
                              <circle cx="12" cy="10" r="3" />
                            </svg>
                            {item.action.label}
                          </button>
                        </div>
                      )}
                      {item.action?.type === "uploadModal" && (
                        <div className="faq-item__action-row">
                          <button
                            type="button"
                            className="faq-item__action-btn faq-item__action-btn--upload"
                            onClick={() => setIsUploadModalOpen(true)}
                          >
                            <img src={cameraIcon} alt="" className="faq-item__action-img" />
                            {item.action.label}
                          </button>
                        </div>
                      )}
                      {item.action?.type === "scroll" && (
                        <div className="faq-item__action-row">
                          <button
                            type="button"
                            className="faq-item__action-btn faq-item__action-btn--scroll"
                            onClick={() => smoothScrollTo(item.action.targetId)}
                          >
                            {item.action.label}
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <VenueModal
        isOpen={isVenueModalOpen}
        onClose={() => setIsVenueModalOpen(false)}
        venue={venue}
      />
      <GalleryUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
      />
      <Footer isDateRevealed={isDateRevealed} />
    </section>
  );
}
