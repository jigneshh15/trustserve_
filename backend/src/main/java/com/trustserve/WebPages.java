package com.trustserve;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
class WebPages {
    @GetMapping({"/services", "/services/{id}", "/book/{id}", "/login",
        "/register", "/dashboard", "/profile", "/support", "/about", "/privacy", "/terms", "/how-it-works"})
    String frontend() {
        return "forward:/index.html";
    }
}
