import { useState } from "react";
import content from "../content";
import Footer from "./Footer";
import "./FAQ.css";

export default function FAQ() {
  const { faq } = content;
  const [openIndex, setOpenIndex] = useState(null);

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
                  {isOpen && <p className="faq-item__answer">{item.answer}</p>}
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <Footer />
    </section>
  );
}
