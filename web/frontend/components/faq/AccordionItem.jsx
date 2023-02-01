import React, { useEffect, useState } from "react";

const AccordionItem = ({ faq, handleToggle,selected }) => {
  const { question, answer, id } = faq;
 

  return (
    <div className={selected === id ? "accordion-item open" : "accordion-item"}>
      <div className="title" onClick={() => handleToggle(id)}>
        <span> Q </span>
        <h4> {question}</h4>
      </div>
      <div className={selected === id ? "content open" : "content"}>
        <span>A</span> {answer}
      </div>
    </div>
  );
};

export default AccordionItem;
