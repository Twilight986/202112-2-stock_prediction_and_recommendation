package org.launchcode.stocks.service.impl;

import org.launchcode.stocks.dao.AAPLDao;
import org.launchcode.stocks.models.domain.AAPL;
import org.launchcode.stocks.service.AAPLService;
import org.launchcode.stocks.service.StockHistoryService;
import org.launchcode.stocks.util.Constant;
import org.launchcode.stocks.util.ExceptionSender;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.List;

/**
 * @Author Huiyan Xing
 * @Date 2021/12/16 - 3:28
 */
@Service
public class AAPLImpl implements AAPLService {
    @Resource
    private AAPLDao aaplDao;

    @Override
    public List<AAPL> getWeeklyHistoryData(List<String> dayList) {
        List<AAPL> aaplList = aaplDao.selectAAPLByWeek(dayList);
        if (aaplList == null || aaplList.size() == 0){
            throw new ExceptionSender(Constant.NO_HIS_DATA);
        }
        return aaplList;
    }
}
