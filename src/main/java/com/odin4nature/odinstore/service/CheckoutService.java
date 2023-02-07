package com.odin4nature.odinstore.service;

import com.odin4nature.odinstore.dto.PaymentInfoDto;
import com.odin4nature.odinstore.dto.PurchaseDto;
import com.odin4nature.odinstore.dto.PurchaseResponseDto;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;

public interface CheckoutService {
    PurchaseResponseDto placeOrder(PurchaseDto purchase);

    PaymentIntent createPaymentIntent(PaymentInfoDto paymentInfo) throws StripeException;
}
