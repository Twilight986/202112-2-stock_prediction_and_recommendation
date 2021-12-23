package org.launchcode.stocks;

import org.launchcode.stocks.controllers.AbstractController;
import org.launchcode.stocks.models.User;
import org.launchcode.stocks.dao.UserDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Arrays;
import java.util.List;

/**
 * Created by cbay on 5/11/15.
 */
public class AuthenticationInterceptor extends HandlerInterceptorAdapter {

    @Autowired
    UserDao userDao;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws IOException {

        List<String> authPages = Arrays.asList("/login", "/register", "/logout");

        // Require sign-in for all but auth pages
        if ( !authPages.contains(request.getRequestURI()) ) {

            Integer userId = (Integer) request.getSession().getAttribute(AbstractController.userSessionKey);

            if (userId == null) {
                response.sendRedirect("/login");
                return false;
            }

            User user = userDao.findByUid(userId);

            // If no ID present in session, redirect to login
            if (user == null) {
                response.sendRedirect("/login");
                return false;
            }
        }

        return true;
    }

}
