import React, { useState } from "react";

import advers_1 from "./assets/advers_1.jpg";
import advers_2 from "./assets/advers_2.jpg";
import advers_3 from "./assets/advers_3.jpg";
import advers_4 from "./assets/advers_4.jpg";
import advers_5 from "./assets/advers_5.jpg";
import advers_6 from "./assets/advers_6.jpg";
import advers_7 from "./assets/advers_7.jpg";
import advers_8 from "./assets/advers_8.jpg";


function AdsFaqsSection() {
  // FAQs Data
const faqs = [
  {
    question: "How does Hater Fantasy League work?",
    answer: "HFL is a fantasy league where instead of drafting the best players, you pick players who you think will have the worst performances. You earn points for missed shots, turnovers, fouls, and other bad plays.",
  },
  {
    question: "How do I draft my Flop Squad?",
    answer: "You select a team of underperforming players from the available roster each week. Your goal is to draft players who will accumulate the most negative stats.",
  },
  {
    question: "How is scoring calculated?",
    answer: "Points are awarded based on negative performances: missed shots (+2), turnovers (+3), fouls (+1), airballs (+4), and getting benched early (+5). The more mistakes your players make, the better!",
  },
  {
    question: "Can I trade or swap players?",
    answer: "Yes! You can swap out players weekly based on real-life performances. Trades are available before the trade deadline each week.",
  },
  {
    question: "What are Hater Chips and how do I use them?",
    answer: "Hater Chips are power-ups that allow you to double your points for a single player, force a trade, or apply penalties to your opponents. Use them strategically!",
  },
  {
    question: "What happens if my players actually perform well?",
    answer: "If a player in your Flop Squad unexpectedly has a great game, you’ll earn fewer points and may drop in the rankings. Choose wisely!",
  },
  {
    question: "How do leagues work?",
    answer: "You can join public leagues or create private leagues with friends. Compete for weekly bragging rights and climb the season leaderboard!",
  },
  {
    question: "Are there rewards for winning?",
    answer: "Yes! Weekly and season-long winners earn HFL badges, leaderboard recognition, and exclusive access to special game modes.",
  },
];

  const [openFaq, setOpenFaq] = useState(null);

  return (
    <div className="ads-faqs-container">  
      {/* FAQs Section */}
      <div className="faqs-container">
        {faqs.map((faq, index) => (
        <div key={index} className={`faq-item ${openFaq === index ? "open" : ""}`}>
        {/* Question Button */}
        <button 
          className="faq-question" 
          onClick={() => setOpenFaq(openFaq === index ? null : index)}
        >
        <span className="faq-icon">{openFaq === index ? "▼" : "►"}</span>
        {faq.question}
        </button>

        {/* Answer (Only Visible When Clicked) */}
        <div className={`faq-answer ${openFaq === index ? "open" : ""}`}>
          {faq.answer}
        </div>
      </div>
    ))}
    </div>

      {/* Ads Section */}
      <div className="ads-scroll-wrapper">
        <div className="ads-container">
          <div className="sponsor-box">
            <img src={advers_1} alt="advertisement 1" className="sponsor-img" />
          </div>
          <div className="sponsor-box">
            <img src={advers_2} alt="advertisement 2" className="sponsor-img" />
          </div>
          <div className="sponsor-box">
            <img src={advers_3} alt="advertisement 3" className="sponsor-img" />
          </div>
          <div className="sponsor-box">
            <img src={advers_4} alt="advertisement 4" className="sponsor-img" />
          </div>
          <div className="sponsor-box">
            <img src={advers_5} alt="advertisement 5" className="sponsor-img" />
          </div>
          <div className="sponsor-box">
            <img src={advers_6} alt="advertisement 6" className="sponsor-img" />
          </div>
          <div className="sponsor-box">
            <img src={advers_7} alt="advertisement 7" className="sponsor-img" />
          </div>
          <div className="sponsor-box">
            <img src={advers_8} alt="advertisement 8" className="sponsor-img" />
          </div>
        </div>
      </div>

    </div>
  );
}

export default AdsFaqsSection;
