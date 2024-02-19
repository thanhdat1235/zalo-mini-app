interface SePayQRCode {
  bankAccountNumber: number;
  bankName: string;
  totalPayment: number;
  bankingDescription: string;
}
export const generateSePayQRCode = ({
  bankName,
  bankAccountNumber,
  bankingDescription,
  totalPayment,
}: SePayQRCode) => {
  return `https://qr.sepay.vn/img?acc=${bankAccountNumber}&bank=${bankName}&amount=${totalPayment}&des=${bankingDescription}`;
};
