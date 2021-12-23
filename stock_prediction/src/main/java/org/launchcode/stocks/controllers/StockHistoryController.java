package org.launchcode.stocks.controllers;

import org.launchcode.stocks.models.domain.*;
import org.launchcode.stocks.service.*;
import org.launchcode.stocks.util.GetWeek;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.annotation.Resource;
import java.util.*;

import org.launchcode.stocks.util.*;

/**
 * @Author Huiyan Xing
 * @Date 2021/12/20 - 0:05
 */
@Controller
public class StockHistoryController {
    @Resource
    private ARIAMPredService ariamPredService;

    @Resource
    private AAPLService aaplService;

    @Resource
    private KOService koService;

    @Resource
    private NVDAService nvdaService;

    @Resource
    private PFEService pfeService;

    @Resource
    private TLSAService tlsaService;

    // return history price of all 5 stocks
    @PostMapping("/market")
    @ResponseBody
    public Map market(){
        GetWeek weekUtil = new GetWeek();
        List<String> weekdays = weekUtil.getWeekDate();
        List<AAPL> aaplList = aaplService.getWeeklyHistoryData(weekdays);
        List<KO> koList = koService.getWeeklyHistoryData(weekdays);
        List<NVDA> nvdaList = nvdaService.getWeeklyHistoryData(weekdays);
        List<PFE> pfeList = pfeService.getWeeklyHistoryData(weekdays);
        List<TLSA> tlsaList = tlsaService.getWeeklyHistoryData(weekdays);
        HashMap<String, List> stockHistory = new HashMap<>();
        stockHistory.put("AAPL", aaplList);
        stockHistory.put("KO", koList);
        stockHistory.put("NVDA", nvdaList);
        stockHistory.put("PFE", pfeList);
        stockHistory.put("TLSA", tlsaList);
        return stockHistory;
    }

    @PostMapping("/holdStock")
    @ResponseBody
    public Map holdStock(){
        GetWeek weekUtil = new GetWeek();
        List<String> weekdays = weekUtil.getNextWeekDate();
        List<AAPL> aaplList = ariamPredService.getAAPLWeekPred(weekdays);
        List<KO> koList = ariamPredService.getKOWeekPred(weekdays);
        List<NVDA> nvdaList = ariamPredService.getNVDAWeekPred(weekdays);
        List<PFE> pfeList = ariamPredService.getPFEWeekPred(weekdays);
        List<TLSA> tlsaList = ariamPredService.getTLSAWeekPred(weekdays);
        HashMap<String, List> stockPrediction = new HashMap<>();
        stockPrediction.put("AAPL", aaplList);
        stockPrediction.put("KO", koList);
        stockPrediction.put("NVDA", nvdaList);
        stockPrediction.put("PFE", pfeList);
        stockPrediction.put("TLSA", tlsaList);
        return stockPrediction;
    }
}
