package com.example.backend.controller;

import com.example.backend.dto.Response;
import com.example.backend.dto.TourRegistDto;
import com.example.backend.security.UserDetailsImpl;
import com.example.backend.service.TourService;
import java.io.IOException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class TourController {

    private final TourService tourService;

    // , @AuthenticationPrincipal UserDetailsImpl userDetails
    @PostMapping("/tour")
    public Response<TourRegistDto> tourRegistApi(@ModelAttribute TourRegistDto.Request request,
            @AuthenticationPrincipal UserDetailsImpl userDetails)
            throws IllegalAccessException, IOException {
        if (request.getCourses().size() > 3) {
            throw new IllegalArgumentException("코스 개수는 4개 미만이여야 합니다.");
        }
        tourService.tourRegist(request, userDetails.getUser());
        return new Response<>("200", "성공적으로 투어 등록 되었습니다!", null);
    }
}
