import { client } from "@/lib";
import { cookies } from "next/headers";
import { Cart } from "@medusajs/client-types";
import CartButton from "./CartButton";

function createFallbackCart(cartId?: string) {
  return {
    id: cartId ?? "offline-cart",
    items: [],
  } as unknown as Cart;
}

async function createCart() {
  try {
    const region = await client.regions.list({
      limit: 1,
    }).then((res) => res.regions[0]);

    const res = await client.carts.create({ region_id: region?.id });
    return res.cart as unknown as Cart;
  } catch (error) {
    console.error("[Cart] Failed to create cart", error);
    return createFallbackCart();
  }
}

async function getCart(cartId: string) {
  try {
    const res = await client.carts.retrieve(cartId);
    return res.cart as unknown as Cart;
  } catch (error) {
    console.error("[Cart] Failed to retrieve cart", error);
    return createFallbackCart(cartId);
  }
}

export default async function Cart() {
  const cartId = cookies().get("cartId")?.value;
  let cartIdUpdated = false;
  let cart;

  if (cartId) {
    cart = await getCart(cartId);
  } else {
    cart = await createCart();
    cartIdUpdated = true;
  }

  return <CartButton cart={cart} cartIdUpdated={cartIdUpdated} />;
}
