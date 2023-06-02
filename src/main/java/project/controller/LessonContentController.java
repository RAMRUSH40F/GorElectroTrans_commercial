package project.controller;

import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import project.model.LessonContent;
import project.service.LessonContentService;

import static project.exceptions.Validator.validateDepartmentId;

@RestController
@RequiredArgsConstructor
public class LessonContentController {

    private final LessonContentService service;


    @GetMapping("/dep_{N}/content/data/{file_name}")
    public ResponseEntity<ByteArrayResource> getFileByName(@PathVariable("N") String depId,
                                                           @PathVariable("file_name") String fileName,
                                                           @RequestHeader(value = HttpHeaders.AUTHORIZATION, defaultValue = "") String jwtToken) {
        Integer departmentId = validateDepartmentId(depId);
        byte[] file = service.getFileByName(departmentId, fileName);

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
    @SneakyThrows
    public LessonContent addNewContent(@RequestParam("file") MultipartFile file,
                                       @PathVariable("N") String depId,
                                       @RequestParam("lesson") String lessonId,
                                       @RequestHeader(value = HttpHeaders.AUTHORIZATION, defaultValue = "") String jwtToken) {
        Integer departmentId = validateDepartmentId(depId);

        LessonContent content = LessonContent.builder()
                .lessonId(Integer.valueOf(lessonId))
                .fileName(file.getOriginalFilename())
                .file(file.getBytes())
                .build();
        service.save(departmentId, content);
        return service.getContentByFileName(departmentId, file.getOriginalFilename());

    }


    @DeleteMapping("/dep_{N}/content/data/{file_name}")
    public boolean deleteFileByName(@PathVariable("N") String depId,
                                    @PathVariable("file_name") String fileName,
                                    @RequestHeader(value = HttpHeaders.AUTHORIZATION, defaultValue = "") String jwtToken) {
        Integer departmentId = validateDepartmentId(depId);

        return service.deleteFileByName(departmentId, fileName);
    }

}
