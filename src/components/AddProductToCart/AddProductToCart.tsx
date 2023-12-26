import Typography from "@mui/material/Typography";
import { Product } from "~/models/Product";
import CartIcon from "@mui/icons-material/ShoppingCart";
import Add from "@mui/icons-material/Add";
import Remove from "@mui/icons-material/Remove";
import IconButton from "@mui/material/IconButton";
import { useCart, useInvalidateCart, useUpsertCart } from "~/queries/cart";
import { CartItem } from "~/models/CartItem";
import { useEffect } from "react";

type AddProductToCartProps = {
  product: Product;
};

export default function AddProductToCart({ product }: AddProductToCartProps) {
  const { data = [], isFetching } = useCart();
  // notes for integration: data has no product title, description, price

  console.log("DAta.data", data.data);

  const { mutate: upsertCart } = useUpsertCart();
  const invalidateCart = useInvalidateCart();

  let cartItem: CartItem | undefined;

  useEffect(() => {
    if (data.data) {
      const itemsData: CartItem[] = data.data.cart.items;
      cartItem = itemsData.find((i: CartItem) => i.product.id === product.id);

      console.log("itemsData", itemsData);
    }
  }, [isFetching, data]);

  // notes for integration: upsertCart use product, but need products
  const addProduct = () => {
    upsertCart(
      { items: [{ product, count: cartItem ? cartItem.count + 1 : 1 }] },
      { onSuccess: invalidateCart }
    );
  };

  const removeProduct = () => {
    if (cartItem) {
      upsertCart(
        { ...cartItem, count: cartItem.count - 1 },
        { onSuccess: invalidateCart }
      );
    }
  };

  return cartItem ? (
    <>
      <IconButton disabled={isFetching} onClick={removeProduct} size="large">
        <Remove color={"secondary"} />
      </IconButton>
      <Typography align="center">{cartItem.count}</Typography>
      <IconButton disabled={isFetching} onClick={addProduct} size="large">
        <Add color={"secondary"} />
      </IconButton>
    </>
  ) : (
    <IconButton disabled={isFetching} onClick={addProduct} size="large">
      <CartIcon color={"secondary"} />
    </IconButton>
  );
}
