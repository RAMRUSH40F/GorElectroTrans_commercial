package project.security.service;

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import project.dataSource.DynamicDataSourceContextHolder;
import project.security.model.User;

@SpringBootTest
class UserServiceTest {

    @Autowired
    UserService userService;

    @BeforeAll
    static void setDataBaseToCancelException() {
        DynamicDataSourceContextHolder.setCurrentDataSource("DEP_1");
    }


    @Test
    void getUserByUsername_authoritiesNonNull() {
        User user = userService.getUserByUsername("LolsaF");

        System.out.println(user);

    }
}