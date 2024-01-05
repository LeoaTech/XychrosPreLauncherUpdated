import React from "react";
import { billingStyles } from "./BillingTableStyles";
import { billingColumns } from "./BiilingDetailsTableColumns";
import BillingCard from "./BillingCard";
import DataTable from "react-data-table-component";

const BillingDetailsCard = ({priceCard, tableData, subscribeMessage}) => {
  return (
    <div className="billing-details">
      <h3>Billing Details</h3>
      <p>{subscribeMessage}</p>

      {priceCard?.length > 0 ? (
        <div className="carousel">
          <div className="billing-cards" >
            {priceCard?.length > 0 ? (
              priceCard?.map((card, index) => {
                return (
                  <div key={index} className="billing-card">
                    <BillingCard className="card" key={card.id} card={card} />
                  </div>
                );
              })
            ) : (
              <div class="spinner"></div>
            )}
          </div>
          <div className="billing_table">
            <DataTable
              columns={billingColumns}
              data={tableData}
              customStyles={billingStyles}
              pagination
              highlightOnHover
            />
          </div>
        </div>
      ) : (
        <div className="spinner"></div>
      )}
    </div>
  );
};

export default BillingDetailsCard;
