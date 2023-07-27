package com.example.backend.service;

import com.example.backend.dto.CourseDto;
import com.example.backend.dto.TourRegistDto;
import com.example.backend.model.category.Category;
import com.example.backend.model.category.CategoryRepository;
import com.example.backend.model.course.Course;
import com.example.backend.model.course.CourseRepository;
import com.example.backend.model.courseimage.CourseImage;
import com.example.backend.model.courseimage.CourseImageRepository;
import com.example.backend.model.image.Image;
import com.example.backend.model.image.ImageRepository;
import com.example.backend.model.tour.Tour;
import com.example.backend.model.tour.TourResitory;
import com.example.backend.model.tourcategory.TourCategory;
import com.example.backend.model.tourcategory.TourCategoryRepository;
import com.example.backend.model.tourimage.TourImage;
import com.example.backend.model.tourimage.TourImageRepository;
import com.example.backend.model.user.User;
import com.example.backend.util.awsS3.S3Uploader;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import javax.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class TourService {

    private final TourResitory tourResitory;
    private final CourseRepository courseRepository;
    private final CategoryRepository categoryRepository;
    private final TourCategoryRepository tourCategoryRepository;
    private final TourImageRepository tourImageRepository;
    private final ImageRepository imageRepository;
    private final CourseImageRepository courseImageRepository;
    private final S3Uploader s3Uploader;

    @Transactional
    public void tourRegist(TourRegistDto.Request request, User user)
            throws IOException, IllegalAccessException {
        System.out.println(user);
        Tour tour = request.toTour(user);
        tourResitory.save(tour);

        // 투어 이미지 저장해 url 가져와서 Image 객체 생성 및 저장
        List<Image> tourImages = new ArrayList<>();
        for (int i = 0; i < request.getTourImgs().size(); i++) {
            String fileUrl = s3Uploader.upload(request.getTourImgs().get(i));
            Image image = new Image(fileUrl);
            tourImages.add(image);
            imageRepository.save(image);
        }

        // TourImage 객체 생성 및 저장
        for (Image image : tourImages) {
            TourImage tourImage = new TourImage();
            tourImage.setTour(tour);
            tourImage.setImage(image);
            tourImageRepository.save(tourImage);
        }

        // 가이드가 선택한 카테고리 이름들을 Category 객체로 변환하고 저장
        List<Category> categories = new ArrayList<>();
        for (String categoryName : request.getCategory()) {
            Category category = request.toCategory(categoryName);
            categories.add(category);
            categoryRepository.save(category);
        }

        // TourCategory 객체 생성 및 저장
        for (Category category : categories) {
            TourCategory tourCategory = new TourCategory();
            tourCategory.setTour(tour);
            tourCategory.setCategory(category);
            tourCategory.setDate(new Date());
            tourCategoryRepository.save(tourCategory);
        }

        // Course 객체 생성 및 저장
        for (CourseDto courseDto : request.getCourses()) {
            System.out.println(courseDto);
            Course course = new Course(courseDto.getLon(), courseDto.getLat(), courseDto.getTitle(),
                    courseDto.getContent(), tour.getId());
            courseRepository.save(course);

            // 코스 이미지 저장해 url 가져와서 Image 객체 생성 및 저장
            String fileUrl = s3Uploader.upload(courseDto.getImage());
            Image image = new Image(fileUrl);
            imageRepository.save(image);

            // CourseImage 객체 생성 및 저장
            CourseImage courseImage = new CourseImage();
            courseImage.setCourse(course);
            courseImage.setImage(image);
            courseImageRepository.save(courseImage);

        }
    }
}


