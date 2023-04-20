package project.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import project.model.LessonContent;
import project.repository.LessonContentRepository;
import project.security.JwtAuthorizationService;

import java.io.IOException;
import java.util.List;

import static project.exceptions.Validator.validateDepartmentId;
import static project.exceptions.Validator.validatePaginationParams;

@RestController
@RequiredArgsConstructor
public class LessonContentController {

    private final LessonContentRepository repository;
    private final JwtAuthorizationService auth;

    @GetMapping("/dep_{N}/content/data")
    public ResponseEntity<List<LessonContent>> getPagedLessons(@PathVariable("N") Integer departmentId,
                                                               @RequestParam String page,
                                                               @RequestParam String size,
                                                               @RequestHeader(value = HttpHeaders.AUTHORIZATION, defaultValue = "") String jwtToken) {
        validateDepartmentId(departmentId);
        validatePaginationParams(page, size);
        auth.authorize(jwtToken, departmentId);

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
                                                           @RequestHeader(value = HttpHeaders.AUTHORIZATION, defaultValue = "") String jwtToken) {
        validateDepartmentId(departmentId);
        auth.authorize(jwtToken, departmentId);
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
                                       @RequestHeader(value = HttpHeaders.AUTHORIZATION, defaultValue = "") String jwtToken) {
        validateDepartmentId(departmentId);
        auth.authorize(jwtToken, departmentId);

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
                                    @RequestHeader(value = HttpHeaders.AUTHORIZATION, defaultValue = "") String jwtToken) {
        validateDepartmentId(departmentId);
        auth.authorize(jwtToken, departmentId);

        return repository.deleteFileByName(departmentId, fileName);
    }

}
