package com.example.backend.model.wish;

import com.example.backend.model.tour.Tour;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity
@NoArgsConstructor
public class Wish {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private Tour tour;

    @Column
    private long userId;

    @Override
    public String toString() {
        return "Wish{" +
                "id=" + id +
                ", tour=" + tour +
                ", userId=" + userId +
                '}';
    }


    public Wish(Tour tour, Long id) {
        this.tour = tour;
        this.userId = id;

    }
}
