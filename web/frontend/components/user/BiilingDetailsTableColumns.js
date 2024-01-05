// Billing Table Columns
export const billingColumns = [
  {
    name: "Name",
    selector: (row) => row.plan_name,
    sortable: true,
    id: "charge_name",
    style: {
      fontSize: 17,
    },
  },
  {
    name: "Amount",
    selector: (row) => row.price,
    sortable: true,
    id: "charge_amount",

    style: {
      fontSize: 17,
    },
  },
  {
    name: "Charged Date",
    selector: (row) => row.created_at,
    sortable: true,
    id: "charged_date",
    style: {
      fontSize: 15,
    },
  },
];
