import React, { useState } from "react";
import { faqsData } from "./faqDummy";
import { HiOutlineSearch } from "react-icons/hi";
import AccordionItem from "./AccordionItem";
import "./faq.css";
const FAQ = () => {
  const [selected, setSelected] = useState(null);

  const handleToggle = (i) => {
    setSelected(selected === i ? null : i);
  };
  return (
    <div className="faq-container">
      <h2>FAQ</h2>

      <div className="searchbar">
        <div className="search-icon">
          <HiOutlineSearch style={{ height: 20, width: 20, color: "gray" }} />
        </div>
        <input type="text" placeholder="Search" />
      </div>
      <ul className="accordion">
        {faqsData.map((faq, index) => (
          <AccordionItem
            key={faq.id}
            faq={faq}
            handleToggle={handleToggle}
            selected={selected}
          />
        ))}
      </ul>
    </div>
  );
};

export default FAQ;
