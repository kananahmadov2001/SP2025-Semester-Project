import React, { useState } from "react";

import advers_1 from "./assets/advers_1.jpg";
import advers_2 from "./assets/advers_2.jpg";
import advers_3 from "./assets/advers_3.jpg";
import advers_4 from "./assets/advers_4.jpg";
import advers_5 from "./assets/advers_5.jpg";
import advers_6 from "./assets/advers_6.jpg";
import advers_7 from "./assets/advers_7.jpg";


function AdsFaqsSection() {

  return (
    <div className="ads-faqs-container">  

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
        </div>
      </div>

    </div>
  );
}

export default AdsFaqsSection;
