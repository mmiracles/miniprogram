package com.smart.web;

import com.smart.domain.User;
import com.smart.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/user")
public class UserController {
    @Autowired
    private UserService userService;
    @RequestMapping("/login")
    public User login(@RequestParam(value = "userName",required = true) String userName, @RequestParam(value = "password",required = true) String password) {
        User user = userService.login(userName, password);
        return user;
    }
    @RequestMapping("/changeInfo")
    public Map<String, Object> changeInfo(User user){
       String msg= userService.changeInfo(user);
        Map<String, Object> map = new HashMap<String, Object>();
        map.put("msg",msg);
        return map;
    }
    @RequestMapping("/register")
    public Map<String, Object> register(User user){
        System.out.println(user);
//        String msg= userService.register(user);
        Map<String, Object> map = new HashMap<String, Object>();
//        map.put("msg",msg);
       return map;
    }
}

