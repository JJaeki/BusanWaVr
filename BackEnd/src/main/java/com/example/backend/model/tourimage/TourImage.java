package com.example.backend.model.tourimage;

import com.example.backend.model.image.Image;
import com.example.backend.model.tour.Tour;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity
@NoArgsConstructor
public class TourImage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    private Tour tour;

    @ManyToOne(fetch = FetchType.LAZY)
    private Image image;

}
