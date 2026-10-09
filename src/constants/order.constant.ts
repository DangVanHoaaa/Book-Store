export enum ORDER_STATUS {
  AWAITING_CONFIRMATION = 'AWAITING_CONFIRMATION', // Chờ xác nhận
  PROCESSING = 'PROCESSING',                       // Đang xử lý / Đóng gói
  SHIPPING = 'SHIPPING',                           // Đang giao hàng
  DELIVERED = 'DELIVERED',                         // Đã giao hàng thành công
  CANCELLED = 'CANCELLED'                          // Đã hủy đơn
}

export enum PAYMENT_METHOD {COD = 'COD', VNPAY = 'VNPAY'}

export enum PAYMENT_STATUS {UNPAID = 'UNPAID',PAID = 'PAID', FAILED = 'FAILED', REFUNDED = 'REFUNDED' }

export default {ORDER_STATUS, PAYMENT_METHOD, PAYMENT_STATUS}