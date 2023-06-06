package project.service;

import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.lang.NonNull;
import org.springframework.lang.Nullable;
import org.springframework.stereotype.Service;
import project.exceptions.FileSizeLimitExceededException;
import project.model.LessonContent;
import project.model.projection.LessonContentInfo;
import project.repository.LessonContentJpaRepository;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;
import java.util.stream.Collectors;

import static project.dataSource.DynamicDataSourceContextHolder.setCurrentDataSource;

@Service
@RequiredArgsConstructor
public class LessonContentService {
    private final LessonContentJpaRepository repository;

    public @Nullable byte[] getFileByName(Integer departmentId, String fileName) {
        setCurrentDataSource("DEP_" + departmentId);
        Optional<LessonContent> lessonContent = repository.findById(fileName);
        return lessonContent.map(LessonContent::getFile).orElse(null);
    }

    public @NonNull List<String> getFileNamesByLessonId(Integer departmentId, int id) {
        setCurrentDataSource("DEP_" + departmentId);
        List<LessonContentInfo> lessonContentList = repository.findByLessonId(id);
        return lessonContentList.stream()
                .map(LessonContentInfo::getFileName)
                .collect(Collectors.toList());


    }

    public @NonNull LessonContent getContentByFileName(int departmentId, String fileName) {
        setCurrentDataSource("DEP_" + departmentId);
        Optional<LessonContent> lessonContent = repository.findById(fileName);
        if (lessonContent.isEmpty())
            throw new NoSuchElementException("Такого файла в базе нет. Или слишком длинное название у файла");
        return lessonContent.get();

    }

    public boolean save(Integer departmentId, LessonContent content) {
        setCurrentDataSource("DEP_" + departmentId);
        try {
            return repository.save(content).getLessonId() == null;
        }catch (DataIntegrityViolationException e) {
            throw new FileSizeLimitExceededException();
        }
    }


    public boolean deleteFileByName(Integer departmentId, String fileName) {
        setCurrentDataSource("DEP_" + departmentId);
        repository.deleteById(fileName);
        return true;

    }


}