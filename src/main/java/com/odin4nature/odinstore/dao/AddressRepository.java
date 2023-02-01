package com.odin4nature.odinstore.dao;

import com.odin4nature.odinstore.entity.Address;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AddressRepository extends JpaRepository<Address, Long> {
}
