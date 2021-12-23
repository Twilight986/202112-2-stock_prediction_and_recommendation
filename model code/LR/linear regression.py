import csv
from sklearn.linear_model import LinearRegression
tickers = ['AAPL', 'KO', 'NVDA', 'PFE', 'TSLA']
data_path = './data/'
dates_path = 'dates.csv'
def read_data():
    data, close = {}, {}
    for com in tickers:
        path = data_path + com + '.csv'
        with open(path, encoding='utf-8') as f:
            csv_reader = csv.reader(f)
            data_list = []
            close_list = []
            j = 0
            for line in csv_reader:
                if j > 0:
                    for i in range(1,7):
                        line[i] = float(line[i])
                    close_list.append(line[4])
                data_list.append(line)
                j += 1
            data[com] = data_list
            close[com] = close_list
            f.close()
    return data, close
data, close = read_data()
for key, value in data.items():
    print(key, len(value))
dates = []
with open(dates_path, encoding='utf-8') as f:
    reader = csv.reader(f)
    for line in reader:
        dates.append(line[0])
dates = dates[1:]
print("dates", dates)
print(len(dates))
def Trian_LR_model(data, close,dates):
    print('Train LR Model using data from step 1 and write to CSV file.')
    predict_result = [['date', 'stock_name', 'predict']]
    for key, value in data.items():
        label = close[key]
        print(len(label))
        n = len(value)
        train = []
        for i in range(1, n-40):
            tmp = []
            for j in range(5):
                tmp += value[i+j][1:]
            train.append(tmp)
        train_label = label[10: -30]
        print(train[0], train_label[0])
        print(train[-1], train_label[-1])
        test_label = label[-30:]
        test = []
        for i in range(n-40, n-5):
            tmp = []
            for j in range(5):
                tmp += value[i+j][1:]#value[i+j][1:]原本为value[i+j][1:]
            test.append(tmp)
        print(len(test), len(test_label))
        print(key, test[0], test_label[0])
        print(key, test[-1], test_label[-1])
        model = LinearRegression().fit(train, train_label)
        test_result = model.predict(test)
        print(key)
        print(len(test_result))
        for i in range(30):
            print(test_result[i], test_label[i])
        for i in range(35):
            tmp = [dates[i], key, test_result[i]]
            predict_result.append(tmp)
    return  predict_result
print(dates[0])
LR_result = Trian_LR_model(data, close, dates)
with open('LR_only_close_result.csv', 'a', encoding='utf-8', newline='') as f:
    write = csv.writer(f)
    write.writerows(LR_result)
    f.close()

def Trian_LR_model_only_close(data, close,dates):
    print('Train LR Model using data from step 1 and write to CSV file.')
    predict_result = [['date', 'stock_name', 'predict']]
    for key, value in data.items():
        label = close[key]
        print(len(label))
        n = len(value)
        train = []
        for i in range(1, n-40):
            tmp = []
            for j in range(5):
                tmp.append(value[i+j][4])#value[i+j][1:]原本为value[i+j][1:]
            train.append(tmp)
        train_label = label[10: -30]
        print(train[0], train_label[0])
        print(train[-1], train_label[-1])
        test_label = label[-30:]
        test = []
        for i in range(n-40, n-5):
            tmp = []
            for j in range(5):
                tmp.append(value[i+j][4])#value[i+j][1:]原本为value[i+j][1:]
            test.append(tmp)
        print(len(test), len(test_label))
        print(key, test[0], test_label[0])
        print(key, test[-1], test_label[-1])
        model = LinearRegression().fit(train, train_label)
        test_result = model.predict(test)
        print(key)
        print(len(test_result))
        for i in range(30):
            print(test_result[i], test_label[i])
        for i in range(35):
            tmp = [dates[i], key, test_result[i]]
            predict_result.append(tmp)
    return  predict_result

LR_only_close_result = Trian_LR_model_only_close(data, close, dates)
with open('LR_only_close_result.csv', 'a', encoding='utf-8', newline='') as f:
    write = csv.writer(f)
    write.writerows(LR_only_close_result)
    f.close()