package org.launchcode.stocks.service.impl;

import org.launchcode.stocks.dao.KODao;
import org.launchcode.stocks.dao.PFEDao;
import org.launchcode.stocks.models.domain.KO;
import org.launchcode.stocks.models.domain.PFE;
import org.launchcode.stocks.service.PFEService;
import org.launchcode.stocks.service.StockHistoryService;
import org.launchcode.stocks.util.Constant;
import org.launchcode.stocks.util.ExceptionSender;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.List;

/**
 * @Author Huiyan Xing
 * @Date 2021/12/16 - 18:04
 */
@Service
public class PFEImpl implements PFEService {
    @Resource
    private PFEDao pfeDao;

    @Override
    public List<PFE> getWeeklyHistoryData(List<String> dayList) {
        List<PFE> pfeList = pfeDao.selectPFEByWeek(dayList);
        if (pfeList == null || pfeList.size() == 0){
            throw new ExceptionSender(Constant.NO_HIS_DATA);
        }
        return pfeList;
    }
}
