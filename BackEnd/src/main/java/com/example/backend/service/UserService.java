package com.example.backend.service;

import com.example.backend.dto.SignUpDto;
import com.example.backend.model.Category;
import com.example.backend.model.User;
import com.example.backend.repository.CategoryRepository;
import com.example.backend.repository.UserRepository;
import com.example.backend.util.awsS3.S3Uploader;
import lombok.AllArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.io.IOException;
import java.util.concurrent.TimeUnit;

@Service
@AllArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final S3Uploader s3Uploader;
    private final RedisTemplate<String, String> redisTemplate;
    @Transactional
    public void signup(SignUpDto.Reqeust reqeust, String encodedPassword) throws IOException, IllegalAccessException {
        String fileUrl = s3Uploader.upload(reqeust.getProfileImg());
//        System.out.println(fileUrl);
        User user = reqeust.toUser(fileUrl, encodedPassword);
        userRepository.save(user);

        for (String categoryName : reqeust.getCategory()) {
            Category category = reqeust.toCategory(categoryName, user);
            categoryRepository.save(category);
        }
    }

    public void saveEmailAuth(String email, String code) throws IllegalAccessException {

        ValueOperations<String, String> valueOperations = redisTemplate.opsForValue();

        if(valueOperations.get(email) != null) throw new IllegalAccessException("인증 이메일이 전송되었습니다. 잠시후에 시도해주세요.");

        valueOperations.set(email, code);
        redisTemplate.expire(email, 5, TimeUnit.MINUTES);
    }

    public void emailExistValidCheck(String email) throws IllegalAccessException {
        User user = userRepository.findByEmail(email);
        if(user != null) throw new IllegalAccessException("이메일이 중복되어 이메일 인증이 불가합니다.");
    }

    public boolean checkNicknameDuplicate(String nickname) {
        return userRepository.existsByNickname(nickname);
    }
    
}
