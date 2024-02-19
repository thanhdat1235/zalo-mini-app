import { lazy } from "react";
import { PATH_NAME } from "constants/router";
import CartPage from "pages/cart";
import FlashSale from "pages/flash-sale";
// import HomePage from "pages/home";
import SubscriptionPage from "pages/membership-package";
import OrderForm from "pages/order/order-form";
import PaymentResult from "pages/order/payment-result";
import PaymentSelect from "pages/order/payment-select";
import Product from "pages/product";
import ProductDetail from "pages/product/product-detail";
import SearchPage from "pages/search";
import TicketApplyPage from "pages/ticket/ticket-apply";
import TicketDetailPage from "pages/ticket/ticket-detail";
import UserPage from "pages/user";
import UserDetailPage from "pages/user/user-detail";
import UserDetailUpdate from "pages/user/user-detail/user-detail-update";
import UserCrown from "pages/user/user-crown";
import UserReferralCode from "pages/user/user-referral-code";
import UserListReferral from "pages/user/user-list-referral";
import PaymentDetail from "pages/order/payment-detail";
import FaqsPage from "pages/user/user-faqs";
import UserOrder from "pages/user/user-order";
import OrderDetailPage from "pages/order/order-detail";
import PolicyServices from "pages/policy-services";
import MethodPayment from "pages/policy-services/method-payment";
import PrivacyPolicy from "pages/policy-services/privacy-policy";
import ReturnPolicy from "pages/policy-services/return-policy";
import DeliveryPolicy from "pages/policy-services/delivery-policy";
import InspectionPolicy from "pages/policy-services/inspection-policy";
import Responsibility from "pages/policy-services/responsibility";
import Disclaimer from "pages/policy-services/disclaimer";
import ReorderProductPage from "pages/order/reorder-product";
import HomePage from "pages/home";
import ReceivedGifts from "pages/user/received-gifts";
import SubscriptionGiftPage from "pages/membership-package/subscription-gifts";
import VoucherListPage from "pages/ticket/voucher-list";
import ComboAdvantagePacks from "pages/combo-advantage-packs";
import SubscriptionDetail from "pages/user/subscription-detail";
import PaymentThanks from "pages/order/components/payment-thanks";

const routes = [
  {
    path: PATH_NAME.HOME,
    component: HomePage,
    title: "Trang chủ",
  },
  {
    path: PATH_NAME.PRODUCT,
    component: Product,
    title: "Sản phẩm",
  },
  {
    path: `${PATH_NAME.PRODUCT}/:id`,
    component: ProductDetail,
    title: "Chi tiết sản phẩm",
  },
  {
    path: PATH_NAME.COMBO_ADVANTAGE_PACKS,
    component: ComboAdvantagePacks,
    title: "Ưu đãi",
  },
  {
    path: PATH_NAME.TICKET_APPLY,
    component: TicketApplyPage,
    title: "Sử dụng ưu đãi",
  },
  {
    path: `${PATH_NAME.VOUCHER_PAGE}/:id`,
    component: TicketDetailPage,
    title: "Chi tiết ưu đãi",
  },
  {
    path: PATH_NAME.CART,
    component: CartPage,
    title: "Giỏ hàng",
  },
  {
    path: PATH_NAME.USER,
    component: UserPage,
    title: "Cá nhân",
  },
  {
    path: PATH_NAME.POLICY_SERVICES,
    component: PolicyServices,
    title: "Chính sách dịch vụ",
  },
  {
    path: PATH_NAME.METHOD_PAYMENT,
    component: MethodPayment,
    title: "Hình thức thanh toán",
  },
  {
    path: PATH_NAME.PRIVACY_POLICY,
    component: PrivacyPolicy,
    title: "Chính sách bảo mật",
  },
  {
    path: PATH_NAME.RETURN_POLICY,
    component: ReturnPolicy,
    title: "Chính sách đổi trả",
  },
  {
    path: PATH_NAME.DELIVERY_POLICY,
    component: DeliveryPolicy,
    title: "Chính sách giao hàng",
  },
  {
    path: PATH_NAME.INSPECTION_POLICY,
    component: InspectionPolicy,
    title: "Chính sách kiểm hàng",
  },
  {
    path: PATH_NAME.RESPONSIBILITY,
    component: Responsibility,
    title: "Trách nhiệm giao nhận",
  },
  {
    path: PATH_NAME.DISCLAIMER,
    component: Disclaimer,
    title: "Tuyên bố miễn trừ",
  },
  {
    path: `${PATH_NAME.USER}/:id`,
    component: UserDetailPage,
    title: "Thông tin của bạn",
  },
  {
    path: `${PATH_NAME.USER}/update/:id`,
    component: UserDetailUpdate,
    title: "Cập nhật thông tin của bạn",
  },
  {
    path: `${PATH_NAME.UPDATE_CROWN}/:id`,
    component: UserCrown,
    title: "Gói thành viên",
  },
  {
    path: `${PATH_NAME.REFERRAL_CODE}/:id`,
    component: UserReferralCode,
    title: "Mã giới thiệu",
  },
  {
    path: `${PATH_NAME.LIST_REFERRAL}/:id`,
    component: UserListReferral,
    title: "Danh sách người đã được bạn giới thiệu",
  },
  {
    path: PATH_NAME.USER_FAQS,
    component: FaqsPage,
    title: "Thắc mắc",
  },
  {
    path: `${PATH_NAME.USER_ORDER}`,
    component: UserOrder,
    title: "Đơn hàng",
  },
  {
    path: `${PATH_NAME.RECEIVED_GIFTS}`,
    component: ReceivedGifts,
    title: "Quà tặng đã nhận",
  },
  {
    path: `${PATH_NAME.ORDER}/:id`,
    component: OrderDetailPage,
    title: "Chi tiết đơn hàng",
  },
  {
    path: PATH_NAME.SEARCH,
    component: SearchPage,
    title: "Tìm kiếm",
  },
  {
    path: `${PATH_NAME.FLASH_SALE}/:id`,
    component: FlashSale,
    title: "Flash Sale",
  },
  {
    path: PATH_NAME.SUBSCRIPTION,
    component: SubscriptionPage,
    title: "Gói thành viên",
  },
  {
    path: PATH_NAME.ORDER_FORM,
    component: OrderForm,
    title: "Đặt hàng",
  },
  {
    path: PATH_NAME.PAYMENT_SELECT,
    component: PaymentSelect,
    title: "Thanh toán",
  },
  {
    path: PATH_NAME.PAYMENT_DETAIL,
    component: PaymentDetail,
    title: "Thanh toán",
  },
  {
    path: PATH_NAME.PAYMENT_THANKS,
    component: PaymentThanks,
    title: "Lời cảm ơn khi thanh toán thành công",
  },
  {
    path: `${PATH_NAME.PAYMENT_RESULT}/:id`,
    component: PaymentResult,
    title: "Kết quả thanh toán",
  },
  {
    path: `${PATH_NAME.PRODUCT_REORDER}`,
    component: ReorderProductPage,
    title: "Mua lại",
  },
  {
    path: `${PATH_NAME.SUBSCRIPTION_GIFTS}`,
    component: SubscriptionGiftPage,
    title: "Quà tặng gói thành viên",
  },
  {
    path: `${PATH_NAME.VOUCHER_PAGE}`,
    component: VoucherListPage,
    title: "Danh sách ưu đãi",
  },
  {
    path: `${PATH_NAME.SUBSCRIPTION_DETAIL}`,
    component: SubscriptionDetail,
    title: "Chi tiết gói thành viên",
  },
];

export { routes };
