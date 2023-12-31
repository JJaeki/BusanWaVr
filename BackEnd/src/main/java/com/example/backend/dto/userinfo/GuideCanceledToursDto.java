package com.example.backend.dto.userinfo;

import com.example.backend.dto.tour.CanceledTourDto;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

public class GuideCanceledToursDto {

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Response {

        private List<CanceledTourDto> tourDtoList;

    }
}
