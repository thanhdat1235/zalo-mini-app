import React, { useEffect, useRef, useState } from "react";
import { InfiniteData } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import { Box, Button, Checkbox, Text } from "zmp-ui";

import { globalLoading } from "components/global-loading";
import { Cart } from "models/cart";
import { setCartItemSelected } from "redux/slices/cart-slice";
import { AppDispatch, RootState } from "redux/store";
import { cartService } from "services/cart-service";
import { ListResponse } from "types/api";
import { Modal } from "zalo-ui";
import { CartItems } from "./cart-items";
import ModalDelete, { ModalDeletePropRefs } from "./modal-delete";
import { Product } from "models/product";

interface ListCartItemProps {
  listItem: InfiniteData<ListResponse<Cart>> | undefined;
  refetchCart?: () => void;
  totalPrice: number;
  totalDiscountPrice: number;
  gifts?: Product[];
  preSelectedItems?: number[];
  onChangeProductsSelected: (ids: number[]) => void;
}

export const ListCartItem = ({
  listItem,
  refetchCart,
  gifts,
  preSelectedItems,
  onChangeProductsSelected,
}: ListCartItemProps) => {
  const selectedItems = useSelector<RootState, number[]>(
    (state) => state.cartStore.cartItemSelected
  );
  const [cartDeleteItem, setCartDeleteItem] = useState<{
    id: number;
    name: string;
  }>();

  const dispatch = useDispatch<AppDispatch>();

  const [checkAll, setCheckAll] = useState<boolean>(false);
  const [visibleDelete, setVisibleDelete] = useState<boolean>(false);
  const [cartSelect, setCartSelect] = useState<Cart>();

  const cartItemSelected = useSelector<RootState, number[]>(
    (state) => state.cartStore.cartItemSelected
  );

  const modalDeleteRef = useRef<ModalDeletePropRefs>(null);

  useEffect(() => {
    if (selectedItems.length === listItem?.pages?.[0]?.totalElements) {
      setCheckAll(true);
    } else {
      setCheckAll(false);
    }
    onChangeProductsSelected(selectedItems);
  }, [selectedItems]);

  useEffect(() => {
    let totalPrice = 0;
    let totalDiscountPrice = 0;

    selectedItems.forEach((id) => {
      listItem?.pages.forEach((page) => {
        page.content.forEach((content) => {
          if (content.id === id) {
            if (content?.product?.price)
              totalPrice += content.quantity * content.product.price;

            if (
              content?.product?.oldPrice &&
              content?.product?.price &&
              content.product.price < content.product.oldPrice
            )
              totalDiscountPrice +=
                content.quantity *
                (content.product.oldPrice - content.product.price);
          }
        });
      });
    });
  }, [listItem]);

  const handleSelectItem = (id: number) => {
    const index: number = selectedItems.indexOf(id);

    if (index !== -1) {
      let newArr = [...selectedItems];

      newArr.splice(index, 1);
      dispatch(setCartItemSelected(newArr));
    } else {
      dispatch(setCartItemSelected([...selectedItems, id]));
    }
  };

  const handleSelectAllItem = () => {
    setCheckAll(!checkAll);
    if (!checkAll) {
      let arrItemId: number[] = [];

      listItem?.pages.forEach((page) => {
        page.content.forEach((item) => {
          item.id && arrItemId.push(item.id);
        });
      });
      dispatch(setCartItemSelected(arrItemId));
    } else {
      dispatch(setCartItemSelected([]));
    }
  };

  const handleDeleteCartItem = async () => {
    try {
      if (cartSelect?.id) {
        globalLoading.show();
        const cartItemDeleteIndex = cartItemSelected.indexOf(cartSelect.id!);
        await cartService.deleteCartItem(cartSelect.id);
        refetchCart?.();
        modalDeleteRef?.current?.hide();

        if (cartItemDeleteIndex !== -1) {
          if (cartItemSelected.length === 1) {
            dispatch(setCartItemSelected([]));
          } else {
            const newCartSelectedItem = [...selectedItems];

            newCartSelectedItem.splice(cartItemDeleteIndex, 1);
            dispatch(setCartItemSelected(newCartSelectedItem));
          }
        }
      }
    } catch (err) {
      console.log(err);
    } finally {
      globalLoading.hide();
      setVisibleDelete(false);
    }
  };

  return (
    <Box className="mb-[145px]">
      <Box className="bg-background px-4 py-3 sticky top-0 left-0 right-0 z-[99]">
        <Checkbox
          value={0}
          checked={checkAll}
          size="small"
          label={`Tất cả (${listItem?.pages[0]?.totalElements} sản phẩm)`}
          onChange={handleSelectAllItem}
        />
      </Box>
      {listItem?.pages.map((page) => {
        return page?.content.map((item) => (
          <CartItems
            key={item.id}
            cart={item}
            selectedItem={selectedItems}
            onDelete={(cart) => {
              setCartSelect(cart);
              setVisibleDelete(true);
            }}
            onSelect={(id: number) => handleSelectItem(id)}
            refetchCart={refetchCart}
          />
        ));
      })}
      {gifts && gifts.length > 0 ? (
        <Box className="mx-4 p-4 rounded-xl bg-background">
          <Text className="font-normal">Quà tặng: </Text>
          {gifts?.map((gift, index) => (
            <Box className="flex flex-row mt-1 justify-between" key={index}>
              <Box className="flex flex-row">
                <img
                  src={gift.image}
                  className="w-[50px] h-[50px] border-[0.1px] border-gray-second rounded-sm"
                />
                <Text className="font-normal ml-2">
                  <span className="text-[12px] text-red-500 border-[0.5px] p-[2px] border-red-500 rounded-md">
                    Quà tặng
                  </span>{" "}
                  {`${gift.name}`}
                </Text>
              </Box>
              <Text className="font-normal">x1</Text>
            </Box>
          ))}
        </Box>
      ) : null}

      <Modal
        visible={visibleDelete}
        closeable
        onClose={() => setVisibleDelete(false)}
        className="z-[999] mx-4"
        onRequestClose={() => setVisibleDelete(false)}
      >
        <Box>
          <Text className="font-bold text-center mb-2">
            Xóa sản phẩm khỏi giỏ hàng
          </Text>
          <Text className="text-sm">
            Bạn muốn xóa sản phẩm {cartSelect?.product.name || ""} khỏi giỏ hàng
            của bạn không?
          </Text>
          <Box className="flex justify-end mt-6">
            <Button
              size="small"
              className="mr-2 !bg-gray/[.35]"
              onClick={() => setVisibleDelete(false)}
            >
              Hủy
            </Button>
            <Button
              size="small"
              className="!bg-red-500"
              onClick={handleDeleteCartItem}
            >
              Xóa
            </Button>
          </Box>
        </Box>
      </Modal>
      <ModalDelete
        name={cartDeleteItem?.name || ""}
        onDelete={() => handleDeleteCartItem()}
        ref={modalDeleteRef}
      />
    </Box>
  );
};
