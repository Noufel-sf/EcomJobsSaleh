"use client";



import { memo, useCallback } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SkeletonItem, SkeletonSummary } from "@/components/CartItemsSkeleton";
import {
  useGetCartQuery,
  useUpdateCartItemMutation,
  useDeleteCartItemMutation,
  useClearCartMutation,
} from "@/Redux/Services/CartApi";
import toast from "react-hot-toast";
import CartItem from "@/components/CartItem";
import { useI18n } from "@/context/I18nContext";

import {
  ShoppingBag,
  Trash2,
  CreditCard,
  Lock,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";

function CartPage() {
  const { messages, t } = useI18n();
  const { data: cartData, isLoading } = useGetCartQuery(undefined);
  const [updateCartItem] = useUpdateCartItemMutation();
  const [deleteCartItemMutation] = useDeleteCartItemMutation();
  const [clearCartMutation] = useClearCartMutation();

  const cart = cartData?.items || [];

  const total = cartData?.totalPrice || 0;

  const Total = cart.reduce(
    (sum: number, item) => sum + item.price * item.quantity,
    0,
  );
  const displayTotal = total > 0 ? total : Total;


  const handleQuantityUpdate = useCallback(
    async (productId: string, newVal: number, currentVal: number) => {
      try {
        if (newVal < 1) {
          await deleteCartItemMutation(productId).unwrap();
          toast.success(messages.cart.itemRemoved);
        } else {
          const action = newVal > currentVal ? "increment" : "decrement";
          await updateCartItem({ productId, action }).unwrap();
        }
      } catch (error: any) {
        toast.error(error?.data?.message || messages.cart.failedToUpdateCart);
      }
    },
    [deleteCartItemMutation, messages.cart.failedToUpdateCart, messages.cart.itemRemoved, updateCartItem],
  );

  const handleDeleteCartItem = useCallback(
    async (productId: string) => {
      try {
        await deleteCartItemMutation(productId).unwrap();
        toast.success(messages.cart.itemRemoved);
      } catch (error: any) {
        toast.error(error?.data?.message || messages.cart.failedToRemoveItem);
      }
    },
    [deleteCartItemMutation, messages.cart.failedToRemoveItem, messages.cart.itemRemoved],
  );

  const handleClearCart = useCallback(async () => {
    try {
      await clearCartMutation().unwrap();
      toast.success(messages.cart.cartCleared);
    } catch (error: any) {
      toast.error(error?.data?.message || messages.cart.failedToClearCart);
    }
  }, [clearCartMutation, messages.cart.cartCleared, messages.cart.failedToClearCart]);

 
  const savings = 0; // Can be used for future promo code feature
  const finalTotal = displayTotal - savings;

  return (
    <main className="min-h-screen bg-muted/30">
      <div className="container mx-auto px-4 py-8 lg:py-12">
        {/* Breadcrumb */}
        <nav
          className="text-sm text-muted-foreground mb-6 flex items-center gap-2"
          aria-label="Breadcrumb"
        >
          <Link href="/products" className="hover:underline">
          <Button
            variant="ghost"
            size="sm"
            className="gap-1"
            type="button"
            aria-label={messages.cart.continueShopping}
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            {messages.cart.continueShopping}
          </Button>
          </Link>
        </nav>

        {/* Header */}
        <header className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold mb-2 flex items-center gap-3">
            <ShoppingBag className="w-8 h-8 text-primary" aria-hidden="true" />
            {messages.cart.shoppingCart}
          </h1>
          <p className="text-muted-foreground" role="status" aria-live="polite">
            {isLoading
              ? messages.cart.loading
              : t(messages.cart.cartCount, {
                  count: cart.length,
                  label: cart.length === 1 ? messages.cart.item : messages.cart.items,
                })}
          </p>
        </header>

        <div className="grid lg:grid-cols-3 pr-2 gap-8">
          {/* Left: Cart Items */}
          <section
            className="lg:col-span-2 space-y-4"
            aria-label="Shopping cart items"
          >
            {isLoading ? (
              <>
                {/* Loading Skeletons */}
                {[...Array(3)].map((_, index) => (
                  <SkeletonItem key={index} />
                ))}
              </>
            ) : cart.length > 0 ? (
              <>
                {/* Cart items */}
                {cart.map((item) => (
                  <CartItem
                    key={item.productId}
                    item={item}
                    handleQuantityUpdate={handleQuantityUpdate}
                    handleDeleteCartItem={handleDeleteCartItem}
                  />
                ))}

                {/* Clear cart */}
                <Button
                  variant="outline"
                  onClick={handleClearCart}
                  className="w-full sm:w-auto"
                  size="default"
                  type="button"
                  aria-label="Clear all items from cart"
                >
                  <Trash2 className="w-4 h-4 mr-2" aria-hidden="true" />
                  {messages.cart.clearCart}
                </Button>
              </>
            ) : (
              <Card
                className="p-12 text-center"
                role="status"
                aria-live="polite"
              >
                <ShoppingBag
                  className="w-16 h-16 mx-auto mb-4 text-muted-foreground"
                  aria-hidden="true"
                />
                <h3 className="text-xl font-semibold mb-2">
                  {messages.cart.cartEmptyTitle}
                </h3>
                <p className="text-muted-foreground mb-6">
                  {messages.cart.cartEmptyDescription}
                </p>
                <Link href="/products" className="w-full">
                <Button
                  size="lg"
                  variant="primary"
                  className=""
                  type="button"
                >
                  {messages.cart.startShopping}
                  <ArrowRight className="ml-2 w-4 h-4" aria-hidden="true" />
                </Button>
                </Link>
              </Card>
            )}
          </section>

          {/* Right: Order Summary */}
          <aside className="space-y-4" aria-label="Order summary">
            {isLoading ? (
              <SkeletonSummary />
            ) : cart.length > 0 ? (
              <Card className="sticky top-4">
                <CardHeader className="">
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5" aria-hidden="true" />
                    {messages.cart.orderSummary}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Price breakdown */}
                  <dl className="space-y-3 mt-3">
                    <div className="flex justify-between text-sm">
                      <dt className="text-muted-foreground">{messages.cart.subtotal}</dt>
                      <dd className="font-medium">${total.toFixed(2)}</dd>
                    </div>

                    {savings > 0 && (
                      <div className="flex justify-between text-sm">
                        <dt className="text-green-600">Discount</dt>
                        <dd className="font-medium text-green-600">
                          -${savings.toFixed(2)}
                        </dd>
                      </div>
                    )}

                    <div className="flex justify-between text-sm">
                      <dt className="text-muted-foreground">{messages.cart.shipping}</dt>
                      <dd className="font-medium text-green-600">{messages.cart.free}</dd>
                    </div>

                    <div className="flex justify-between text-sm">
                      <dt className="text-muted-foreground">{messages.cart.tax}</dt>
                      <dd className="font-medium">$0.00</dd>
                    </div>

                    <Separator className="" />

                    <div className="flex justify-between text-lg">
                      <dt className="font-bold">{messages.cart.total}</dt>
                      <dd className="font-bold text-primary">
                        ${finalTotal.toFixed(2)}
                      </dd>
                    </div>
                  </dl>
                  <Link href="/completeorder" className="w-full">
                    <Button
                      size="lg"
                      variant="primary"
                      className="w-full mt-2 text-base font-semibold"
                      disabled={cart.length === 0}
                      type="button"
                      aria-label="Proceed to complete order"
                    >
                      {messages.cart.proceedToCompleteOrder}
                      <ArrowRight className="ml-2 w-4 h-4" aria-hidden="true" />
                    </Button>
                  </Link>
                  <div className="flex mt-3 items-center justify-center gap-2 text-xs text-muted-foreground">
                    <Lock className="w-3 h-3" aria-hidden="true" />
                    <span>{messages.cart.secureCheckout}</span>
                  </div>
                </CardContent>
              </Card>
            ) : null}
          </aside>
        </div>
      </div>
    </main>
  );
}

export default memo(CartPage);
