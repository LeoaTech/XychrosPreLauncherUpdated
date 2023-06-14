export const referralColumns = [
  {
    name: 'Joining Date',
    selector: (row) => row.created_at,
    sortable: true,
    id: 'join_date',
    style: {
      fontSize: 17,
      // maxWidth: '40px',
    },
  },
  {
    name: 'Referral Email',
    selector: (row) => row.email,
    sortable: true,
    headerClassName: 'datatable__header',
    style: {
      fontSize: 17,
    },
  },
  {
    name: 'Referral Code',
    selector: (row) => row.referral_code,
    sortable: true,
    style: {
      fontSize: 17,
    },
  },
  {
    name: 'Campaign Name',
    selector: (row) => row.campaign_name,
    sortable: true,
    style: {
      textAlign: 'center',
      fontSize: 17,
      alignItems: 'center',
    },
  },
  ,
  {
    name: 'Friends Joined',
    selector: (row) => row.friends_joined,
    sortable: true,
    id: 'friends_joined',
    style: {
      textAlign: 'center',
      alignItems: 'center',
      fontSize: 17,
      maxWidth: '12px',
    },
  },
];

export const modalColumns = [
  {
    name: 'Referral Code',
    selector: (row) => row.referral_code,
    id: 'referral_code',
    sortable: true,
    style: {
      fontSize: 15,
      // maxWidth: '12px',
    },
  },
  {
    name: 'Email',
    selector: (row) => row.email,
    sortable: true,
    style: {
      fontSize: 15,
      // maxWidth: "14px",
    },
  },
  {
    name: 'Date of Joining',
    selector: (row) => row.created_at,
    sortable: true,
    id: 'date',
    defaultValue: new Date(),
    style: {
      textAlign: 'center',
      alignItems: 'center',
      fontSize: 15,
    },
  },
];

export const referralRows = [
  {
    id: 10678,
    referral_code: 'www.product-prelauncher/p=1234/test',
    referral_email: 'Jon@example.com',
    campaign: 35,
    friends_joined: 2,
  },
  {
    id: 10679,
    referral_code: 'www.product-prelauncher/p=1234/test',
    referral_email: 'Cersei@example.com',
    campaign: 42,
    friends_joined: 2,
  },
  {
    id: 30678,
    referral_code: 'www.product-prelauncher/p=1234/test',
    referral_email: 'Jaime@example.com',
    campaign: 45,
    friends_joined: 2,
  },
  {
    id: 40678,
    referral_code: 'www.product-prelauncher/p=1234/test',
    referral_email: 'Arya@example.com',
    campaign: 17,
    friends_joined: 2,
  },
  {
    id: 50678,
    referral_code: 'www.product-prelauncher/p=1234/test',
    referral_email: 'Daenerys@example.com',
    campaign: null,
    friends_joined: 2,
  },
  {
    id: 60678,
    referral_code: 'Melisandre',
    referral_email: 'lena@example.com',
    campaign: 150,
    friends_joined: 2,
  },
  {
    id: 70678,
    referral_code: 'www.product-prelauncher/p=1234/test',
    referral_email: 'Ferrara@example.com',
    campaign: 44,
    friends_joined: 2,
  },
  {
    id: 80678,
    referral_code: 'www.product-prelauncher/p=1234/test',
    referral_email: 'Rossini@example.com',
    campaign: 36,
    friends_joined: 2,
  },
  {
    id: 90678,
    referral_code: 'www.product-prelauncher/p=1234/test',
    referral_email: 'Harvey@example.com',
    campaign: 65,
    friends_joined: 2,
  },
];
