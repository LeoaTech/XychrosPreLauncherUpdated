export const referralColumns = [
  {
    name: "ID",
    selector: "id",
    sortable: true,
    id: "id",
    style: {
      fontSize: 17,
      maxWidth: "20px",
    },
  },
  {
    name: "Referral Email",
    selector: "referral_email",
    sortable: true,
    headerClassName: "datatable__header",
    style: {
      fontSize: 17,
    },
  },
  {
    name: "Referral Code",
    selector: "referral_code",
    sortable: true,
    style: {
      fontSize: 17,
    },
  },
  {
    name: "Points Collected",
    selector: "points",
    sortable: true,
    style: {
      textAlign: "center",
      fontSize: 17,
      alignItems: "center",
    },
  },
  ,
  {
    name: "Friends Joined",
    selector: "friends_joined",
    sortable: true,
    style: {
      textAlign: "center",
      alignItems: "center",
      fontSize: 17,
    },
  },
];

export const modalColumns = [
  {
    name: "ID",
    selector: "id",
    id: "id",
    sortable: true,
    style: {
      fontSize: 15,
      maxWidth: "12px",
    },
  },
  {
    name: "Email",
    selector: "referral_email",
    sortable: true,
    style: {
      fontSize: 15,
      // maxWidth: "14px",
    },
  },
  {
    name: "Date of Joining",
    selector: "date",
    sortable: true,
    id: "date",
    defaultValue: new Date(),
    style: {
      textAlign: "center",
      alignItems: "center",
      fontSize: 15,
    },
  },
];

export const referralRows = [
  {
    id: 10678,
    referral_code: "www.product-prelauncher/p=1234/test",
    referral_email: "Jon@example.com",
    points: 35,
    friends_joined: 2,
  },
  {
    id: 10679,
    referral_code: "www.product-prelauncher/p=1234/test",
    referral_email: "Cersei@example.com",
    points: 42,
    friends_joined: 2,
  },
  {
    id: 30678,
    referral_code: "www.product-prelauncher/p=1234/test",
    referral_email: "Jaime@example.com",
    points: 45,
    friends_joined: 2,
  },
  {
    id: 40678,
    referral_code: "www.product-prelauncher/p=1234/test",
    referral_email: "Arya@example.com",
    points: 17,
    friends_joined: 2,
  },
  {
    id: 50678,
    referral_code: "www.product-prelauncher/p=1234/test",
    referral_email: "Daenerys@example.com",
    points: null,
    friends_joined: 2,
  },
  {
    id: 60678,
    referral_code: "Melisandre",
    referral_email: "lena@example.com",
    points: 150,
    friends_joined: 2,
  },
  {
    id: 70678,
    referral_code: "www.product-prelauncher/p=1234/test",
    referral_email: "Ferrara@example.com",
    points: 44,
    friends_joined: 2,
  },
  {
    id: 80678,
    referral_code: "www.product-prelauncher/p=1234/test",
    referral_email: "Rossini@example.com",
    points: 36,
    friends_joined: 2,
  },
  {
    id: 90678,
    referral_code: "www.product-prelauncher/p=1234/test",
    referral_email: "Harvey@example.com",
    points: 65,
    friends_joined: 2,
  },
];
