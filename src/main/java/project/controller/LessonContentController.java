package project.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import project.model.LessonContent;
import project.security.model.MyToken;
import project.security.model.User;
import project.repository.LessonContentRepository;
import project.security.JwtAuthorizationService;

import java.io.IOException;
import java.util.List;

import static project.exceptions.Validator.*;

@RestController
@RequiredArgsConstructor
public class LessonContentController {

    private final LessonContentRepository repository;
    private final JwtAuthorizationService auth;

    @GetMapping("/dep_{N}/content/data")
    public ResponseEntity<List<LessonContent>> getPagedLessons(@PathVariable("N") Integer departmentId,
                                                               @RequestParam String page,
                                                               @RequestParam String size,
                                                               @RequestBody MyToken token) {
        validateDepartmentId(departmentId);
        validatePaginationParams(page, size);
        User user = auth.decodeUserFromToken(token.getToken());
        validateAuth(user, departmentId);
        HttpHeaders headers = new HttpHeaders();
        headers.add("content_count", String.valueOf(repository.getLessonContentCount(departmentId)));
        return ResponseEntity
                .ok()
                .headers(headers)
                .body(repository.getAllContentInfoPaged(departmentId, Integer.parseInt(page), Integer.parseInt(size)));
    }

    @GetMapping("/dep_{N}/content/data/{file_name}")
    public ResponseEntity<ByteArrayResource> getFileByName(@PathVariable("N") Integer departmentId,
                                                           @PathVariable("file_name") String fileName,
                                                           @RequestBody MyToken token) {
        validateDepartmentId(departmentId);
        User user = auth.decodeUserFromToken(token.getToken());
        validateAuth(user, departmentId);
        byte[] file = repository.getFileByName(fileName, departmentId);

        ByteArrayResource resource = new ByteArrayResource(file);

        // Set response headers
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
        headers.setContentDispositionFormData("attachment", fileName);

        // Return ResponseEntity with file data and headers
        return ResponseEntity.ok()
                .headers(headers)
                .contentLength(file.length)
                .body(resource);
    }

    @PostMapping("/dep_{N}/content/data")
    public LessonContent addNewContent(@RequestParam("file") MultipartFile file,
                                       @RequestParam("lessonId") String lessonId,
                                       @PathVariable("N") Integer departmentId,
                                       @RequestBody MyToken token) {
        validateDepartmentId(departmentId);
        User user = auth.decodeUserFromToken(token.getToken());
        validateAuth(user, departmentId);
        try {
            repository.create(LessonContent.builder()
                    .lessonId(Integer.valueOf(lessonId))
                    .fileName(file.getOriginalFilename())
                    .file(file.getBytes())
                    .build(), departmentId);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
        return repository.getContentInfoByFileName(departmentId, file.getOriginalFilename());


    }


    @DeleteMapping("/dep_{N}/content/data/{file_name}")
    public boolean deleteFileByName(@PathVariable("N") Integer departmentId,
                                    @PathVariable("file_name") String fileName,
                                    @RequestBody MyToken token) {
        validateDepartmentId(departmentId);
        User user = auth.decodeUserFromToken(token.getToken());
        validateAuth(user, departmentId);
        return repository.deleteFileByName(departmentId, fileName);
    }

}
