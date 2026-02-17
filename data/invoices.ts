export type Invoice = {
  id: string;
  customer: string;
  items: { name: string; qty: number; unitPrice: number }[];
  total: number;
  status: "sent" | "paid" | "draft";
};

const invoices: Invoice[] = [
  {
    id: "inv1",
    customer: "Acme Corp",
    items: [{ name: "Chicken Biryani", qty: 10, unitPrice: 13.5 }],
    total: 135.0,
    status: "sent",
  },
];

export default invoices;
