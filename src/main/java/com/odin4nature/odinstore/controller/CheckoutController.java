package com.odin4nature.odinstore.controller;

import com.odin4nature.odinstore.dto.PurchaseDto;
import com.odin4nature.odinstore.dto.PurchaseResponseDto;
import com.odin4nature.odinstore.service.CheckoutService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/checkout")
public class CheckoutController {

    private final CheckoutService checkoutService;

    public CheckoutController(CheckoutService checkoutService) {
        this.checkoutService = checkoutService;
    }

    @PostMapping("/purchase")
    public PurchaseResponseDto placeOrder(@RequestBody PurchaseDto purchase) {
        return checkoutService.placeOrder(purchase);
    }
}
