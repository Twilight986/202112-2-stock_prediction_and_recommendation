package org.launchcode.stocks.service.impl;

import org.launchcode.stocks.dao.AAPLDao;
import org.launchcode.stocks.dao.KODao;
import org.launchcode.stocks.models.domain.AAPL;
import org.launchcode.stocks.models.domain.KO;
import org.launchcode.stocks.service.KOService;
import org.launchcode.stocks.service.StockHistoryService;
import org.launchcode.stocks.util.Constant;
import org.launchcode.stocks.util.ExceptionSender;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.List;

/**
 * @Author Huiyan Xing
 * @Date 2021/12/16 - 18:03
 */
@Service
public class KOImpl implements KOService {
    @Resource
    private KODao koDao;

    @Override
    public List<KO> getWeeklyHistoryData(List<String> dayList) {
        List<KO> koList = koDao.selectKOByWeek(dayList);
        if (koList == null || koList.size() == 0){
            throw new ExceptionSender(Constant.NO_HIS_DATA);
        }
        return koList;
    }
}
