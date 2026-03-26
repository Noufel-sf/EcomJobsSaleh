import { configureStore } from "@reduxjs/toolkit";
import { cartApi } from "./Services/CartApi";
import { productsApi } from "./Services/ProductsApi";
import { orderApi } from "./Services/OrderApi";
import { authApi } from "./Services/AuthApi";
import { classificationApi } from "./Services/ClassificationApi";
import { shippingApi } from "./Services/ShippingApi";
import { jobApi } from "./Services/JobApi";
import { sellerApi } from "./Services/SellerApi";
import authReducer from "./Slices/AuthSlice";
import { sponsorApi } from "./Services/SponsorApi";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [cartApi.reducerPath]: cartApi.reducer,
    [productsApi.reducerPath]: productsApi.reducer,
    [orderApi.reducerPath]: orderApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [classificationApi.reducerPath]: classificationApi.reducer,
    [shippingApi.reducerPath]: shippingApi.reducer,
    [sponsorApi.reducerPath]: sponsorApi.reducer,
    [jobApi.reducerPath]: jobApi.reducer,
    [sellerApi.reducerPath]: sellerApi.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      cartApi.middleware,
      productsApi.middleware,
      sponsorApi.middleware,
      orderApi.middleware,
      authApi.middleware,
      classificationApi.middleware,
      shippingApi.middleware,
      jobApi.middleware,
      sellerApi.middleware,
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
