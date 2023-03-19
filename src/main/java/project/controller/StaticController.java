package project.controller;


import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;


@Controller
public class StaticController {

    @GetMapping(value = {"/"})
    public String getBasicHtml() {

        return "index";
    }

}
