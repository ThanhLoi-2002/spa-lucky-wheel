export interface Prize {
  id: number;
  text: string;
  color: string;
  icon: string;
}

export interface SpinHistory {
  phone: string;
  prize: string;
  date: string;
}

export const defaultPrizes: Prize[] = [
  { id: 1, text: "Giảm 5% HĐ", color: "#FF6B6B", icon: "💰" },
  { id: 2, text: "Tặng Gương", color: "#4ECDC4", icon: "🪞" },
  { id: 3, text: "Tặng 1 suất trị thâm N-B-M", color: "#45B7D1", icon: "✨" },
  { id: 4, text: "Tặng 1 suất làm hồng Ti-Bi", color: "#96CEB4", icon: "💋" },
  {
    id: 5,
    text: "Tặng voucher trị giá 50k tiền mặt",
    color: "#FFEAA7",
    icon: "🎁",
  },
  { id: 6, text: "Tặng son dưỡng cấp ẩm", color: "#DDA0DD", icon: "💄" },
  { id: 7, text: "Giảm 10% HĐ", color: "#FFB6C1", icon: "🏷️" },
  { id: 8, text: "Tặng lo dưỡng trắng N-B-M", color: "#98FB98", icon: "🧴" },
  {
    id: 9,
    text: "Tặng voucher trị giá 50K tiền mặt",
    color: "#F0E68C",
    icon: "💸",
  },
];
