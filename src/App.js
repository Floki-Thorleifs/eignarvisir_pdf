import React, { useState, useEffect } from "react";
import logo from "./logo.svg";
import About from "./component/about";
import Eign from "./component/eign";
import Sold from "./component/sold";
import OnSale from "./component/onSale";
import Charts from "./component/charts";
import Dist from './component/dist';
import {
  Document,
  PDFViewer,
  Page,
  StyleSheet,
  View,
  Text,
  Image,
} from "@react-pdf/renderer";
import {
  getHouse,
  getSold,
  getOnSale,
  getDistance,
  getNeighbour,
} from "./api/index.js";

import "./App.css";

function App() {
  const [eign, setEign] = useState(null);
  const [token, setToken] = useState("598bfddde8354d662ced934d0318289f");
  const [sold, setSold] = useState({ rad: null, hve: null, zip: null });
  const [sold_Loc, setSold_Loc] = useState("rad");
  const [onSale, setOnSale] = useState({ rad: null, hve: null, zip: null });
  const [onSaleLoc, setOnSaleLoc] = useState("rad");
  const [neigh, setNeigh] = useState(null);
  const [dist, setDist] = useState(null);
  async function getData() {
    const [
      neigbour,
      sold_rad,
      sold_zip,
      sold_hve,
      eign,
      onSale_rad,
      onSale_hve,
      onSale_zip,
      dist
    ] = await Promise.all([
      getNeighbour(token),
      getSold(token, "rad"),
      getSold(token, "postcode"),
      getSold(token, "hve"),
      getHouse(token),
      getOnSale(token, "rad"),
      getOnSale(token, "hve"),
      getOnSale(token, "postcode"),
      getDistance(token)
    ]);
    setSold({ rad: sold_rad, hve: sold_hve, zip: sold_zip });
    setOnSale({ rad: onSale_rad, hve: onSale_hve, zip: onSale_zip });
    setNeigh(neigbour);
    setDist(dist);
    console.log(eign.eign)
    setEign(eign.eign);
  }

  function textChange(value) {
    setToken(value);
  }

  function locChange(value) {
    setSold_Loc(value);
  }

  const styles = StyleSheet.create({
    page: {
      flexDirection: "column",
    },
    section_row: {
      flexDirection: "row",
    },
    section_column: {
      flexDirection: "column",
    },
    title: {
      fontSize: 32,
      padding: 10,
    },
    head: {
      width: '100%',
      height: 64,
      backgroundColor:'#dbdbdb',
      flexDirection: 'row',
      marginBottom: 30,
    },
    logo: {
      height: 64,
      width: 64,
      marginBottom: -100
    }
  });
  return (
    <div className="App">
      <div className="input">
        <input onChange={(event) => textChange(event.target.value)} />
        <button disabled={token === null} onClick={() => getData()}>
          Generate
        </button>
        <div className="locChoice">
          <input
            type="radio"
            name="loc"
            id="rad"
            defaultChecked
            onChange={(event) => locChange(event.target.id)}
          />
          <label htmlFor="rad">Radíus</label>
          <input
            type="radio"
            name="loc"
            id="hve"
            onChange={(event) => locChange(event.target.id)}
          />
          <label htmlFor="hve">Hverfi</label>
          <input
            type="radio"
            name="loc"
            id="zip"
            onChange={(event) => locChange(event.target.id)}
          />
          <label htmlFor="zip">Póstnúmer</label>
        </div>
      </div>
      {eign ? (
        <PDFViewer>
          <Document>
            <Page size="A4" style={styles.page}>
              <View style={styles.head}>
                <Image style={styles.logo}
                source={require('./images/logo.png')}
                />
              </View>
              <View>
                <Text style={styles.title}>{eign.address + ', ' + eign.zip + ' ' + eign.location}</Text>
              </View>
              <View style={styles.section_column}>
                <View style={styles.section_row}>
                  <Eign eign={eign} />
                  <About eign={eign} />
                </View>
                <Charts neigh={neigh} />
              </View>
            </Page>
            <Page size="A4" style={styles.page}>
            <View style={styles.head}>
                <Image style={styles.logo}
                source={require('./images/logo.png')}
                />
              </View>
              <View style={styles.section_column}>
                <Sold
                  eignir={
                    sold_Loc === "rad"
                    ? sold.rad.eignir
                    : sold_Loc === "hve"
                    ? sold.hve.eignir
                    : sold.zip.eignir
                  }
                  loc={sold_Loc}
                  hverfi={neigh.hverfi.nafn}
                />
                <OnSale
                  eignir={
                    sold_Loc === "rad"
                    ? onSale.rad.eignir
                    : sold_Loc === "hve"
                    ? onSale.hve.eignir
                    : onSale.zip.eignir
                  }
                  loc={sold_Loc}
                  hverfi={neigh.hverfi.nafn}
                />
                    <Dist dist={dist}/>
              </View>
            </Page>
          </Document>
        </PDFViewer>
      ) : null}
    </div>
  );
}

export default App;
