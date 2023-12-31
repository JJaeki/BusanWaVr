package com.example.backend.dto.review;

import com.example.backend.model.review.Review;
import com.example.backend.model.tour.Tour;
import com.example.backend.model.tourimage.TourImage;
import java.util.Date;
import java.util.List;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class ReviewUserInfoDto {
    private Long id;
    private String title;
    private String content;
    private Date date;
    private double score;
    private long userId;
    private long tourId;
    private List<String> tourImageUrls;
    private String tourTitle;

    public ReviewUserInfoDto(Review review, Tour tour, List<String> tourImageUrls){
        this.id = review.getId();
        this.title = review.getTitle();
        this.content = review.getContent();
        this.date = review.getDate();
        this.score = review.getScore();
        this.userId = review.getUserId();
        this.tourId = review.getTourId();
        this.tourImageUrls = tourImageUrls;
        this.tourTitle = tour.getTitle();
    }
}
