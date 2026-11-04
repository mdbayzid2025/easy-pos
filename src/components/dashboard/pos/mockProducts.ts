export interface Product {
  id: string;
  image?: string;
  code: string;
  name: string;
  brand: string;
  category: string;
  subCategory?: string;
  buyPrice: number;
  salePrice: number;
  stock: number;
  unit: string;
  alertQuantity: number;
  type: string;
  cost: number;
  warehouseQuantity?: {
    warehouseName: string;
    quantity: number;
    averageCost: number;
  }[];
  salesData?: { month: string; sold: number; purchased: number }[];
}

export const initialMockProducts: Product[] = [
  {
    id: "1",
    code: "02466053",
    name: "tessett",
    brand: "",
    category: "light",
    subCategory: "",
    buyPrice: 0.0,
    salePrice: 0.0,
    stock: 8.0,
    unit: "KG",
    alertQuantity: 0.0,
    type: "Standard",
    cost: 0.0,
    warehouseQuantity: [
      {
        warehouseName: "Uth (1)",
        quantity: 8.0,
        averageCost: 100.0,
      },
    ],
    salesData: [
      { month: "October 2026", sold: 1500, purchased: 1000 },
    ],
  },
  {
    id: "2",
    code: "06062675",
    name: "test service",
    brand: "",
    category: "light",
    subCategory: "",
    buyPrice: 0.0,
    salePrice: 200.0,
    stock: 0.0,
    unit: "",
    alertQuantity: 0.0,
    type: "Service",
    cost: 0.0,
    warehouseQuantity: [
      {
        warehouseName: "Main Store",
        quantity: 0.0,
        averageCost: 0.0,
      },
    ],
  },
  {
    id: "3",
    code: "06353445",
    name: "DJ Combo",
    brand: "",
    category: "Grocery",
    subCategory: "",
    buyPrice: 0.0,
    salePrice: 685.0,
    stock: 0.0,
    unit: "",
    alertQuantity: 0.0,
    type: "Combo",
    cost: 0.0,
  },
  {
    id: "4",
    code: "07430924",
    name: "Fryfan",
    brand: "King Fisher",
    category: "XYZ",
    subCategory: "Kitchen",
    buyPrice: 450.0,
    salePrice: 800.0,
    stock: 0.0,
    unit: "2345",
    alertQuantity: 0.0,
    type: "Standard",
    cost: 450.0,
  },
  {
    id: "5",
    code: "08418467",
    name: "Potato Regular",
    brand: "",
    category: "Grocery",
    subCategory: "Vegetables",
    image: "🥔",
    buyPrice: 23.0,
    salePrice: 45.0,
    stock: -64.0,
    unit: "KG",
    alertQuantity: 0.0,
    type: "Standard",
    cost: 23.0,
    warehouseQuantity: [
      {
        warehouseName: "Uth (1)",
        quantity: -64.0,
        averageCost: 23.0,
      },
    ],
  },
  {
    id: "6",
    code: "09004692",
    name: "Lal Shak (Red Spinach)",
    brand: "",
    category: "Grocery",
    subCategory: "Vegetables",
    image: "🥬",
    buyPrice: 6.0,
    salePrice: 15.0,
    stock: -4.0,
    unit: "PCS",
    alertQuantity: 0.0,
    type: "Standard",
    cost: 6.0,
  },
  {
    id: "7",
    code: "10056407",
    name: "Lau (Bottle Gourd)",
    brand: "",
    category: "Grocery",
    subCategory: "Vegetables",
    image: "🥒",
    buyPrice: 50.0,
    salePrice: 90.0,
    stock: -3.0,
    unit: "PCS",
    alertQuantity: 0.0,
    type: "Standard",
    cost: 50.0,
  },
  {
    id: "8",
    code: "11551463",
    name: "Apple",
    brand: "",
    category: "Grocery",
    subCategory: "Fruits",
    buyPrice: 77.0,
    salePrice: 89.0,
    stock: -12.0,
    unit: "KG",
    alertQuantity: 0.0,
    type: "Standard",
    cost: 77.0,
  },
  {
    id: "9",
    code: "11755112",
    name: "Sobuj Gol Begun (Round Brinjals Green)",
    brand: "",
    category: "Grocery",
    subCategory: "Vegetables",
    image: "🍆",
    buyPrice: 60.0,
    salePrice: 120.0,
    stock: -1.0,
    unit: "KG",
    alertQuantity: 0.0,
    type: "Standard",
    cost: 60.0,
  },
  {
    id: "10",
    code: "12513409",
    name: "Jali Kumra (Water Pumpkin)",
    brand: "",
    category: "Grocery",
    subCategory: "Vegetables",
    image: "🍈",
    buyPrice: 25.0,
    salePrice: 75.0,
    stock: -6.0,
    unit: "PCS",
    alertQuantity: 0.0,
    type: "Standard",
    cost: 25.0,
  },
];

