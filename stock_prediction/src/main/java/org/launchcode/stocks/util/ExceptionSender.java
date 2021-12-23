package org.launchcode.stocks.util;

/**
 * @Author Huiyan Xing
 * @Date 2021/12/16 - 17:52
 */
public class ExceptionSender extends RuntimeException {
    public ExceptionSender() {
    }

    public ExceptionSender(String message) {
        super(message);
    }

    public ExceptionSender(String message, Throwable cause) {
        super(message, cause);
    }

    public ExceptionSender(Throwable cause) {
        super(cause);
    }
}
