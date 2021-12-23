package org.launchcode.stocks.dao;

import org.launchcode.stocks.models.domain.*;
import org.springframework.stereotype.Component;
import java.util.List;

/**
 * @Author Huiyan Xing
 * @Date 2021/12/14 - 16:56
 */
@Component
public interface AAPLDao {
    List<AAPL> selectAAPLByWeek(List<String> dayList);

}

