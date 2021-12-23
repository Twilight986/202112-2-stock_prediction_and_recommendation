package org.launchcode.stocks.service.impl;

import org.launchcode.stocks.dao.KODao;
import org.launchcode.stocks.dao.NVDADao;
import org.launchcode.stocks.models.domain.KO;
import org.launchcode.stocks.models.domain.NVDA;
import org.launchcode.stocks.service.NVDAService;
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
public class NVDAImpl implements NVDAService {
    @Resource
    private NVDADao nvdaDao;

    @Override
    public List<NVDA> getWeeklyHistoryData(List<String> dayList) {
        List<NVDA> nvdaList = nvdaDao.selectNVDAByWeek(dayList);
        if (nvdaList == null || nvdaList.size() == 0){
            throw new ExceptionSender(Constant.NO_HIS_DATA);
        }
        return nvdaList;
    }
}
