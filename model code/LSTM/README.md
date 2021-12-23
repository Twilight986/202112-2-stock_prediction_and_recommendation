### Predict stock market prices using RNN

1. Make sure `tensorflow` has been installed.
2. Run `python main.py --helo` to check the available command line args.
5. Run `python main.py` to train the model.


For examples,
- Train a model only on AAPL.csv; no embedding
```bash
python main.py --stock_symbol=AAPL --train --input_size=1 --lstm_size=128 --max_epoch=50
```

- Start your Tensorboard
```bash
cd stock-rnn
mkdir logs
tensorboard --logdir ./logs --port 1234 --debug
```

My python environment: 
Python version == 3.7

```
BeautifulSoup>=3.2.1
numpy>=1.13.1
pandas>=0.16.2
scikit-learn>=0.16.1
scipy>=0.19.1
tensorflow>=1.2.1
urllib3>=1.8
```
