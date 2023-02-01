package com.odin4nature.odinstore.dao;

import com.odin4nature.odinstore.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderRepository extends JpaRepository<Order, Long> {
}
