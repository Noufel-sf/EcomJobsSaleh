"use client";

import {
  useCallback,
  useMemo,
  memo,
  useTransition,
  useOptimistic,
} from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
} from "@/components/ui/form";
import {
  useGetCartQuery,
  useClearCartMutation,
} from "@/Redux/Services/CartApi";
import { useCreateOrderMutation } from "@/Redux/Services/OrderApi";
import toast from "react-hot-toast";
import CompleteOrderSkeleton from "@/components/CompleteOrderSkeleton";
import OrderSummary from "@/components/OrderSummary";
import { ContactSection, ShippingSection } from "@/components/CheckoutFormSections";
import {
  Lock,
  Package,
  ArrowLeft,
  ShoppingBag,
} from "lucide-react";
import { checkoutSchema, type CheckoutFormValues } from "@/lib/zodValidation";
import { useI18n } from "@/context/I18nContext";
import { useGetSellerStatesQuery } from "@/Redux/Services/OrderApi";

function CompleteOrder() {
  const { messages, t } = useI18n();
  const { data: cartData, isLoading } = useGetCartQuery(undefined);
  const [createOrder] = useCreateOrderMutation();
  const [clearCart] = useClearCartMutation();
  const cart = useMemo(() => cartData?.items || [], [cartData?.items]);
  const total = cartData?.totalPrice || 0;
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const sellerId = useMemo(() => {
    const firstItem = cart[0] as { ownerId?: string } | undefined;
    return firstItem?.ownerId ?? "";
  }, [cart]);
  console.log("the cart is " , cart);
  
  console.log("the seller id " , sellerId);
  
  const { data: sellerStates } = useGetSellerStatesQuery(sellerId, {
    skip: !sellerId,
  });

  const [optimisticStatus, setOptimisticStatus] = useOptimistic<
    "idle" | "submitting" | "success"
  >("idle");

  const displayTotal = total;

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      phoneNumber: "",
      city: "",
      state: "",
      note: "",
    },
  });

  const SubmitOrder = useCallback(
    async (data: CheckoutFormValues) => {
      const formattedProducts = cart.map((item) => ({
        product: item.productId,
        prodNb: item.quantity,
        size: item.size || "",
        color: item.color || "",
      }));

      const payload = {
        firstName: data.firstName,
        lastName: data.lastName,
        phoneNumber: Number(data.phoneNumber),
        state: Number(data.state), // you named it wilaya in form
        city: data.city,
        note: data.note || "",
        products: formattedProducts,
      };

      startTransition(async () => {
        setOptimisticStatus("submitting");

        try {
          await createOrder(payload).unwrap();
          await clearCart().unwrap();

          setOptimisticStatus("success");
          toast.success(messages.checkout.orderPlacedSuccess);
        } catch (error: unknown) {
          const typedError = error as { data?: { message?: string } };
          toast.error(typedError?.data?.message || messages.checkout.orderFailed);
        }
      });
    },
    [cart, clearCart, createOrder, messages.checkout.orderFailed, messages.checkout.orderPlacedSuccess, setOptimisticStatus],
  );

  const isSubmitting = isPending || optimisticStatus === "submitting";

  if (isLoading) {
    return <CompleteOrderSkeleton />;
  }

  if (cart.length === 0 && !isLoading) {
    return (
      <main
        className="container mx-auto px-4 py-16 text-center"
        role="status"
        aria-live="polite"
      >
        <Package
          className="w-16 h-16 mx-auto mb-4 text-muted-foreground"
          aria-hidden="true"
        />
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">
          {messages.checkout.cartEmptyTitle}
        </h1>
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
          {messages.checkout.cartEmptyDescription}
        </p>
        <Button
          onClick={() => router.push("/products")}
          size="lg"
          variant="default"
          className=""
          type="button"
          aria-label={messages.checkout.continueShopping}
        >
          {messages.checkout.continueShopping}
        </Button>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-muted/30">
      <div className="container mx-auto px-4 py-8 lg:py-12">
        {/* Header */}
        <header className="mb-8">
          <Button
            variant="ghost"
            size="default"
            onClick={() => router.push("/cart")}
            className="mb-4"
            type="button"
            aria-label={messages.checkout.backToCart}
          >
            <ArrowLeft className="w-4 h-4 mr-2" aria-hidden="true" />
            {messages.checkout.backToCart}
          </Button>
          <h1 className="text-3xl lg:text-4xl font-bold flex items-center gap-3">
            <ShoppingBag className="w-8 h-8 text-primary" aria-hidden="true" />
            {messages.checkout.completeOrderTitle}
          </h1>
          <p className="text-muted-foreground mt-2">
            {messages.checkout.completeOrderSubtitle}
          </p>
        </header>
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left: Checkout Form */}
          <section className="lg:col-span-2" aria-label="Checkout form">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit((data) => SubmitOrder(data))}
                className="space-y-6"
                aria-label="Complete order form"
              >
                <ContactSection form={form} />
                <ShippingSection form={form} sellerStates={sellerStates ?? []} />

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isSubmitting || cart.length === 0}
                  className="w-full"
                  size="lg"
                  variant="default"
                  aria-label={isSubmitting ? messages.checkout.processingOrder : messages.checkout.placeOrder}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2
                        className="animate-spin h-4 w-4 mr-2"
                        aria-hidden="true"
                      />
                      {messages.checkout.processingOrder}
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4 mr-2" aria-hidden="true" />
                      {t(messages.checkout.placeOrderWithAmount, { amount: displayTotal.toFixed(2) })}
                    </>
                  )}
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  {messages.checkout.termsNotice}
                </p>
              </form>
            </Form>
          </section>

          {/* Right: Order Summary */}
          <OrderSummary items={cart} total={displayTotal} />
        </div>
      </div>
    </main>
  );
}

export default memo(CompleteOrder);
