package ma.emsi.ainflucer.Controller;

import jakarta.servlet.RequestDispatcher;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
public class ErrorController implements org.springframework.boot.web.servlet.error.ErrorController {

    @RequestMapping("/error")
    public ResponseEntity<Map<String, Object>> handleError(HttpServletRequest request) {
        Object status = request.getAttribute(RequestDispatcher.ERROR_STATUS_CODE);
        Object message = request.getAttribute(RequestDispatcher.ERROR_MESSAGE);
        Object path = request.getAttribute(RequestDispatcher.ERROR_REQUEST_URI);
        
        Map<String, Object> errorDetails = new HashMap<>();
        errorDetails.put("status", status != null ? status : HttpStatus.INTERNAL_SERVER_ERROR.value());
        errorDetails.put("message", message != null ? message : "Une erreur s'est produite");
        errorDetails.put("path", path != null ? path : request.getRequestURI());
        
        return new ResponseEntity<>(errorDetails, HttpStatus.valueOf((Integer) status));
    }
}
