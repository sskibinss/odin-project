package com.odin4nature.odinstore.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "address")
@Getter
@Setter
public class Address {

    @Id
    @GeneratedValue
    private Long id;

    private String country;

    private String state;

    private String city;

    private String address;

    private String address2;

    @Column(name = "postal_code")
    private String postalCode;

    @OneToOne
    @PrimaryKeyJoinColumn
    private Order order;
}
