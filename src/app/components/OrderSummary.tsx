'use client';

import React, { memo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import type { CartItem } from '@/lib/DatabaseTypes';
import { Lock, Package, ShoppingBag } from 'lucide-react';
import { useI18n } from '@/context/I18nContext';

interface OrderSummaryProps {
  items: CartItem[];
  total: number;
}

const OrderSummary = memo(function OrderSummary({ items, total }: OrderSummaryProps) {
  const { messages } = useI18n();

  return (
    <aside aria-label="Order summary">
      <Card className="sticky top-24">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5" aria-hidden="true" />
            {messages.checkout.orderSummary}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {items.map((item) => (
              <div key={item.productId} className="flex gap-3 pb-3 border-b border-border last:border-b-0">
                <div className="relative w-12 h-12 rounded overflow-hidden shrink-0">
                  <Image
                    src={item.image || '/placeholder.png'}
                    alt={item.name || 'Product'}
                    fill
                    sizes="48px"
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium line-clamp-1">{item.name}</p>
                  <p className="text-xs text-muted-foreground">
                    x{item.quantity}
                  </p>
                </div>
                <p className="text-sm font-semibold shrink-0">
                  ${(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
            ))}
          </div>

          <div className="space-y-2 pt-4 border-t border-border">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">{messages.checkout.subtotalWithCount?.replace('{count}', items.length.toString()) || `Subtotal (${items.length} items)`}</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">{messages.checkout.shipping}</span>
              <Badge variant="secondary">{messages.checkout.free}</Badge>
            </div>
          </div>

          <div className="border-t border-border pt-4 flex justify-between text-lg font-bold">
            <span>{messages.checkout.total}</span>
            <span>${total.toFixed(2)}</span>
          </div>

          <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 p-3 rounded">
            <Lock className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>{messages.checkout.secureCheckout}</span>
          </div>
        </CardContent>
      </Card>
    </aside>
  );
});

export default OrderSummary;
