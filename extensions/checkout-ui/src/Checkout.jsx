import { useEffect, useState } from "react";
import {
  reactExtension,
  BlockStack,
  useTotalAmount,
  useCartLines,
  useApplyCartLinesChange,
  useStorage
} from "@shopify/ui-extensions-react/checkout";

// 1. Choose an extension target
export default reactExtension("purchase.checkout.block.render", () => (
  <Extension />
));

function Extension() {
  const storage = useStorage()
  const { amount } = useTotalAmount();
  const cartLines = useCartLines();
  const applyCartLinesChange = useApplyCartLinesChange();

  useEffect(() => {
    const removeStorage = async() => {
      const data = await storage.delete("variantId")
    }

    const getPreviousId = async() => {
      const data = await storage.read("variantId")
      console.log("data111", data)
      if(data && amount > 99) {
        addPreviousRemovedProduct(data)
      }
    }

    const storeDeletedId = async(id) => {
      const data = await storage.write("variantId", id)
    }

    const addPreviousRemovedProduct = (id) => {
      applyCartLinesChange({
        type: "addCartLine",
        quantity: 1,
        merchandiseId: id
      })
      removeStorage()
    }

    const removeProduct = (id) => {
      applyCartLinesChange({
        type: "removeCartLine",
        quantity: 1,
        id: id
      })
    }

    getPreviousId()
    if(amount < 100){
      const variantIds = [
        "gid://shopify/ProductVariant/46413740474618",
        "gid://shopify/ProductVariant/44804943577338",
        "gid://shopify/ProductVariant/46184820900090",
      ]
      // const variantIds = [
      //   "gid://shopify/ProductVariant/43681947418796",
      // ]
      let cartLineId = ""
      variantIds.forEach(item => {
        cartLineId = cartLines.find(
          (cartLine) => cartLine.merchandise.id == item
        )?.id;

        if(cartLineId){
          storeDeletedId(item)
          removeProduct(cartLineId)
        }
      });
    }
    
  }, [amount])

  // 3. Render a UI
  return (
    <BlockStack>
    </BlockStack>
  );
}