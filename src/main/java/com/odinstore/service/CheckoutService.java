package com.odinstore.service;

import com.odinstore.dto.PaymentInfoDto;
import com.odinstore.dto.PurchaseDto;
import com.odinstore.dto.PurchaseResponseDto;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;

public interface CheckoutService {
    PurchaseResponseDto placeOrder(PurchaseDto purchase);

    PaymentIntent createPaymentIntent(PaymentInfoDto paymentInfo) throws StripeException;
}
