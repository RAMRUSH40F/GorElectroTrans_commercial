package temporaryFiles;

import org.springframework.boot.test.context.TestConfiguration;

@TestConfiguration
public class IntegrativeStudentRepositoryTestConfig {

//    @Bean
//    public MockServerClient mockServerClient() throws JsonProcessingException {
//
//        Employee employee = Employee.builder()
//                .employeeId(101L)
//                .firstName("TestName")
//                .email("testmail@mail.ru")
//                .salary(14124f)
//                .commissionPCT(4515f)
//                .hireDate(String.valueOf(LocalDate.now()))
//                .departmentId(1L)
//                .build();
//
//        HttpHeaders headers = new HttpHeaders();
//        headers.setContentType(MediaType.APPLICATION_JSON);
//
//        ResponseEntity<String> responseEntity = new ResponseEntity<>(new ObjectMapper().writeValueAsString(employee),
//                headers, HttpStatus.OK);
//
//        HttpResponse httpResponse = HttpResponse.response()
//                .withStatusCode(responseEntity.getStatusCodeValue())
//                .withBody(responseEntity.getBody())
//                .withHeader(String.valueOf(MediaType.APPLICATION_JSON));
//        MockServerClient mockServerClient = new MockServerClient("127.0.0.1", 8888);
//        mockServerClient.when(
//                HttpRequest.request()
//                        .withMethod("GET")
//                        .withPath("/api/employee/{id}")
//        ).respond(httpResponse);
//        return mockServerClient;
//    }
}
