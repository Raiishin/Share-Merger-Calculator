import "./App.css";
import { Button } from "@material-ui/core";
const React = require("react");
const { CircularProgress, TextField, Grid } = require("@material-ui/core");
const { Autocomplete } = require("@material-ui/lab");
const { countDecimals } = require("./helpers");

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      convertedNumberOfShares: null,
      receivedCash: null,
      firstStock: [{ longName: "", shortName: "", price: "" }],
      secondStock: [{ longName: "", shortName: "", price: "" }],
    };
  }

  componentDidMount = async () => {
    // const firstStock = await this.queryForStockData("SG", "C38U.SI");
    // const secondStock = await this.queryForStockData("SG", "C61U.SI");
    // this.setState({ firstStock: [firstStock], secondStock: [secondStock] });
    this.setState({ loading: false });
  };

  queryForStockData = async (region, symbol) => {
    const baseURL = "https://apidojo-yahoo-finance-v1.p.rapidapi.com/stock/get-detail?";
    const targetURL = `${baseURL}region=${region}&lang=en&symbol=${symbol}`;

    const data = await fetch(targetURL, {
      method: "GET",
      headers: {
        "x-rapidapi-host": "env.BASE_STOCK_API_URL",
        "x-rapidapi-key": "env.BASE_STOCK_API_KEY",
      },
    })
      .then((response) => {
        return response.json();
      })
      .catch((err) => {
        console.log(err);
      });

    const price = data.price.regularMarketPrice.fmt;
    const shortName = data.quoteType.shortName;
    const longName = data.quoteType.longName;

    const dataObject = {
      longName: longName,
      shortName: shortName,
      price: price,
    };
    return dataObject;
  };

  calculate = async (splitRatio1, numberOfShares1, splitRatio2, numberOfShares2, cashDistribution) => {
    let convertedNumberOfShares;
    let receivedCash;

    if (numberOfShares1 && numberOfShares1 !== null && numberOfShares1 !== undefined) {
      convertedNumberOfShares = (numberOfShares1 * splitRatio1) / splitRatio2;
      receivedCash = cashDistribution * numberOfShares1;
    }

    if (numberOfShares2 && numberOfShares2 !== null && numberOfShares2 !== undefined) {
      convertedNumberOfShares = (numberOfShares2 * splitRatio2) / splitRatio1;
      receivedCash = cashDistribution * numberOfShares2;
    }

    if (convertedNumberOfShares !== null && receivedCash !== null)
      this.setState({ convertedNumberOfShares: convertedNumberOfShares, receivedCash: receivedCash });

    const ratio = splitRatio1 / splitRatio2;
    await this.minimumToRoundLots(ratio);
  };

  minimumToRoundLots = async (ratio) => {
    let numberOfDecimals = countDecimals(ratio);
    let a = 0;
    let i = 0;

    let base = 10;
    while (a < numberOfDecimals) {
      base = base * 10;
      a++;
    }

    while (base % 1 !== 0) {
      ratio = ratio / 2;
      base = base / 2;
      i++;
    }

    console.log(ratio);
    console.log(base);
  };

  render = () => {
    const { loading, firstStock, secondStock, convertedNumberOfShares, receivedCash } = this.state;

    if (loading === true) {
      return (
        <div style={{ textAlign: "center" }}>
          <CircularProgress color="secondary" />
        </div>
      );
    }

    document.title = "Share Merger Calculator";
    return (
      <>
        <Grid container>
          <Grid item l={12} xl={12}>
            <Grid container spacing={3} justify="center">
              <Grid item l={6} xl={6}>
                <Autocomplete
                  options={firstStock}
                  getOptionLabel={(option) => option.longName}
                  style={{ width: 300 }}
                  renderInput={(params) => <TextField {...params} label="Input the first stock's name" variant="outlined" />}
                />

                <label>Number of shares you own :</label>
                <TextField id="numberOfShares1" style={{ width: "50px" }} />
              </Grid>

              <Grid item l={6} xl={6}>
                <Autocomplete
                  options={secondStock}
                  getOptionLabel={(option) => option.longName}
                  style={{ width: 300 }}
                  renderInput={(params) => <TextField {...params} label="Input the second stock's name" variant="outlined" />}
                />

                <label>Number of shares you own :</label>
                <TextField id="numberOfShares2" style={{ width: "50px" }} />
              </Grid>
            </Grid>
          </Grid>

          <Grid item l={12} xl={12}>
            <Grid container spacing={4} justify="center">
              <Grid item l={6} xl={6}>
                <label>Split Ratio :</label>
                <TextField id="splitRatioText1" style={{ width: "50px" }} />/
                <TextField id="splitRatioText2" style={{ width: "50px" }} />
              </Grid>
              <Grid item l={6} xl={6}>
                <label>Cash Per Share :</label>
                <TextField id="cashText" style={{ width: "50px" }} /> / share
              </Grid>
            </Grid>
          </Grid>

          <Grid item l={12} xl={12}>
            <Button
              variant="outlined"
              color="primary"
              onClick={() =>
                this.calculate(
                  document.getElementById("splitRatioText1").value,
                  document.getElementById("numberOfShares1").value,
                  document.getElementById("splitRatioText2").value,
                  document.getElementById("numberOfShares2").value,
                  document.getElementById("cashText").value
                )
              }
            >
              Calculate
            </Button>
          </Grid>
          {convertedNumberOfShares !== null ? (
            <Grid item l={12} xl={12}>
              <div>Number of new shares you will own {convertedNumberOfShares}</div>
              <div>Amount of cash to be received {receivedCash}</div>
            </Grid>
          ) : (
            <Grid item l={12} xl={12}></Grid>
          )}
        </Grid>
      </>
    );
  };
}

export default App;
