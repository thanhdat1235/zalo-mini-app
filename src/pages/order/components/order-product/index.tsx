import React from "react";
import { Box, Text } from "zmp-ui";

import ProductDetail from "assets/images/product-detail.png";
import { PATH_NAME } from "constants/router";
import { Cart } from "models/cart";
import { ProductOrder } from "models/orders";
import { useNavigate } from "react-router-dom";
import { formatCurrencyVND } from "utils/number";

interface OrderProductProps {
  carts?: Cart[];
  products?: ProductOrder[];
}

interface OrderProductItemProps {
  image?: string;
  name?: string;
  quantity?: number;
  price?: number;
  onClick?: () => void;
}

const OrderProduct = ({ carts, products }: OrderProductProps) => {
  const navigate = useNavigate();

  const handleNavigateProduct = (id: number) => {
    navigate(`${PATH_NAME.PRODUCT}/${id}`);
  };
  return (
    <Box className="p-4 pb-0">
      <Text className="text-base">Sản phẩm của bạn</Text>
      <Box>
        {carts?.map((cart) => (
          <OrderProductItem
            key={cart.id}
            image={cart?.product?.image}
            name={cart?.product?.name}
            quantity={cart?.quantity}
            price={cart?.product?.price}
            onClick={() =>
              cart?.product?.id && handleNavigateProduct(cart.product.id)
            }
          />
        ))}
        {products?.map((product) => (
          <OrderProductItem
            key={product.id}
            image={product.image}
            name={product.name}
            quantity={product.orderQuantity}
            price={product.price}
            onClick={() => product?.id && handleNavigateProduct(product.id)}
          />
        ))}
      </Box>
    </Box>
  );
};

export const OrderProductItem = ({
  image,
  name,
  quantity,
  price,
  onClick,
}: OrderProductItemProps) => {
  return (
    <Box className="flex my-5 items-center w-full">
      <Box className="w-1/4 mr-3">
        <img
          src={image || ProductDetail}
          alt="product detail"
          className="w-full object-cover"
        />
      </Box>
      <Box className="flex-1">
        <Box className="mb-2" onClick={onClick}>
          <Text className="text-sm line-clamp-2">{name}</Text>
        </Box>
        <Box className="flex justify-between text-xs">
          <Text className="text-xs">Số lượng: x{quantity || 0}</Text>
          <Text className="text-xs text-red-color">
            {price && quantity && formatCurrencyVND(price * quantity)}
          </Text>
        </Box>
      </Box>
    </Box>
  );
};

export default OrderProduct;
