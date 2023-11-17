import React, { useEffect, useState } from "react";
import { styled } from "@mui/material/styles";
import Grid from "@mui/material/Unstable_Grid2";
import Divider from "@mui/material/Divider";

import Stack from "@mui/material/Stack";
import Preyer from "./Preyer";

import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { useTranslation } from "react-i18next";
import "flag-icon-css/css/flag-icons.min.css";
import { LightMode, DarkMode } from "@mui/icons-material";

import i18next from "i18next";
import cookies from "js-cookie";
import { countrys } from "../Data/countrys";
import { languages, GlobeIcon, modes } from "../Data/data";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import moment from "moment";

const PrayPage = () => {
  const currentLanguageCode = cookies.get("i18next") || "en";
  const currentLanguage = languages.find((l) => l.code === currentLanguageCode);
  const { t } = useTranslation();

  const decodCookie = decodeURIComponent(document.cookie);
  const arrayCookie = decodCookie.split("; ");

  const arrMode = arrayCookie.map((arr) => {
    const newArr = decodeURIComponent(arr).split("=");
    return newArr;
  });

  let findMode;
  arrMode.map((arr) => {
    if (arr[0] === "mode") {
      findMode = arr[1];
    }
  });

  let findCountryObj;
  arrMode.map((arr) => {
    if (arr[0] === "country") {
      findCountryObj = arr[1];
    }
  });

  const CountryObj = findCountryObj && JSON.parse(findCountryObj);

  let findCityObj;
  arrMode.map((arr) => {
    if (arr[0] === "city") {
      findCityObj = arr[1];
    }
  });

  const CityObj = findCityObj && JSON.parse(findCityObj);

  const [modeSite, setModeSite] = useState(findMode ? findMode : "dark");

  const darkTheme = createTheme({
    palette: {
      mode: findMode ? findMode : "dark",
    },
  });

  useEffect(() => {
    document.body.dir = currentLanguage.dir || "ltr";
    document.title = t("app_title");
  }, [currentLanguage, t]);

  const [city, setcity] = useState({
    nameCity: CityObj ? CityObj.nameCity : "الجزائر العاصمة",
    apiCity: CityObj ? CityObj.apiCity : "Algiers",
  });
  const [country, setCountry] = useState({
    nameCountryAr: CountryObj ? CountryObj.nameCountryAr : "الجزائر",
    nameCountryEn: CountryObj ? CountryObj.nameCountryEn : "Algeria",
    nameCountryFr: CountryObj ? CountryObj.nameCountryFr : "Algérie",
    apiCountry: CountryObj ? CountryObj.apiCountry : "DZ",
  });
  const [indexNumber, setIndexNumber] = useState(0);

  const [time, settime] = useState({
    Fajr: "06:26",
    Dhuhr: "12:32",
    Asr: "15:20",
    Sunset: "17:39",
    Isha: "18:38",
  });

  // const [clock, setClock] = useState(new Date());
  // const [timer, settimer] = useState(10);
  const [today, setToday] = useState();
  const [remainingTime, setRemainingTime] = useState("");
  const [nextPrayerIndex, setNextPrayerIndex] = useState(2);
  const prayersArray = [
    { key: "Fajr", displayName: "الفجر" },
    { key: "Dhuhr", displayName: "الظهر" },
    { key: "Asr", displayName: "العصر" },
    { key: "Maghrib", displayName: "المغرب" },
    { key: "Isha", displayName: "العشاء" },
  ];

  useEffect(() => {
    let interval = setInterval(() => {
      // setClock(new Date());
      setupCountdownTimer();
      // settimer((t) => t - 1);
      const mo = moment();
      setToday(mo.format("DD/MM/YYYY | h:mm"));
    }, 1000);

    return () => clearInterval(interval);
  }, [time]);

  useEffect(() => {
    const res = fetch(
      `https://api.aladhan.com/v1/timingsByCity/:date?country=${country.apiCountry}&city=${city.apiCity}`
    )
      .then((response) => response.json())
      .then((data) => settime(data.data.timings));
  }, [city]);

  const setupCountdownTimer = () => {
    const momentNow = moment();

    let prayerIndex = 2;

    if (
      momentNow.isAfter(moment(time["Fajr"], "hh:mm")) &&
      momentNow.isBefore(moment(time["Dhuhr"], "hh:mm"))
    ) {
      prayerIndex = 1;
    } else if (
      momentNow.isAfter(moment(time["Dhuhr"], "hh:mm")) &&
      momentNow.isBefore(moment(time["Asr"], "hh:mm"))
    ) {
      prayerIndex = 2;
    } else if (
      momentNow.isAfter(moment(time["Asr"], "hh:mm")) &&
      momentNow.isBefore(moment(time["Sunset"], "hh:mm"))
    ) {
      prayerIndex = 3;
    } else if (
      momentNow.isAfter(moment(time["Sunset"], "hh:mm")) &&
      momentNow.isBefore(moment(time["Isha"], "hh:mm"))
    ) {
      prayerIndex = 4;
    } else {
      prayerIndex = 0;
    }

    setNextPrayerIndex(prayerIndex);

    const nextPrayerObject = prayersArray[prayerIndex];
    const nextPrayerTime = time[nextPrayerObject.key];
    const nextPrayerTimeMoment = moment(nextPrayerTime, "hh:mm");

    let remainingTime = moment(nextPrayerTime, "hh:mm").diff(momentNow);

    if (remainingTime < 0) {
      const midnightDiff = moment("23:59:59", "hh:mm:ss").diff(momentNow);
      const fajrToMidnightDiff = nextPrayerTimeMoment.diff(
        moment("00:00:00", "hh:mm:ss")
      );

      const totalDiffernce = midnightDiff + fajrToMidnightDiff;

      remainingTime = totalDiffernce;
    }
    // console.log("remainingTime", remainingTime);

    const durationRemainingTime = moment.duration(remainingTime);

    i18next.language === "ar"
      ? setRemainingTime(
          `${durationRemainingTime.seconds()} : ${durationRemainingTime.minutes()} : ${durationRemainingTime.hours()}`
        )
      : setRemainingTime(
          `${durationRemainingTime.hours()} : ${durationRemainingTime.minutes()} : ${durationRemainingTime.seconds()}`
        );

    // console.log(
    //   "duration issss ",
    //   durationRemainingTime.hours(),
    //   durationRemainingTime.minutes(),
    //   durationRemainingTime.seconds()
    // );
  };

  let nextPrayeName =
    i18next.language === "ar"
      ? prayersArray[nextPrayerIndex].displayName
      : prayersArray[nextPrayerIndex].key;

  const handleCity = (event) => {
    const findCity = countrys[indexNumber]?.cities.find(
      (item) => item.apiCity == event.target.value
    );
    setcity(findCity);
    document.cookie = `city = ${JSON.stringify(findCity)}`;
  };
  const handleCountry = (event) => {
    const findCountry = countrys.find((item, index) => {
      setIndexNumber(index);
      return item.apiCountry == event.target.value;
    });
    setCountry(findCountry);
    document.cookie = `country = ${JSON.stringify(findCountry)}`;
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <div>
        <Stack
          direction="row"
          justifyContent={"space-between"}
          style={{ display: "flex", flexWrap: "wrap" }}
        >
          <FormControl sx={{ m: 1, minWidth: 200 }}>
            <InputLabel
              id="demo-simple-select-label"
              style={
                modeSite === "dark" ? { color: "white" } : { color: "black" }
              }
            >
              <GlobeIcon /> {t("language")}
            </InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              //  value={city.nameCity}
              label="Country"
              defaultValue=""
              onChange={(event) => {
                i18next.changeLanguage(event.target.value);
              }}
            >
              {languages.map(({ code, name, country_code }) => (
                <MenuItem value={code} key={country_code}>
                  <span
                    className={`flag-icon flag-icon-${country_code} mx-2`}
                  ></span>{" "}
                  {name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl sx={{ m: 1, minWidth: 200 }}>
            <InputLabel
              id="demo-simple-select-label"
              style={
                modeSite === "dark" ? { color: "white" } : { color: "black" }
              }
            >
              {t("t_mode")}
            </InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              //  value={city.nameCity}
              label="City"
              defaultValue=""
              onChange={(event) => {
                if (event.target.value === "dark") {
                  setModeSite("dark");
                  document.cookie = "mode = dark";
                } else {
                  setModeSite("light");
                  document.cookie = "mode = light";
                }
              }}
            >
              {/* {modes?.map((item) => ( */}
              <MenuItem value="dark">
                {i18next.language == "en" && (
                  <div className="CenterModeInput">
                    <DarkMode /> Dark
                  </div>
                )}
                {i18next.language == "fr" && (
                  <div className="CenterModeInput">
                    <DarkMode /> Sombre
                  </div>
                )}
                {i18next.language == "ar" && (
                  <div className="CenterModeInput">
                    <DarkMode /> المظلم
                  </div>
                )}
              </MenuItem>
              <MenuItem value="light">
                {i18next.language == "en" && (
                  <div className="CenterModeInput">
                    <LightMode /> Light
                  </div>
                )}
                {i18next.language == "fr" && (
                  <div className="CenterModeInput">
                    <LightMode /> Lumière
                  </div>
                )}
                {i18next.language == "ar" && (
                  <div className="CenterModeInput">
                    <LightMode /> الضوء
                  </div>
                )}
              </MenuItem>
              {/* ))} */}
            </Select>
          </FormControl>

          <FormControl sx={{ m: 1, minWidth: 200 }}>
            <InputLabel
              id="demo-simple-select-label"
              style={
                modeSite === "dark" ? { color: "white" } : { color: "black" }
              }
            >
              {t("t_Country")}
            </InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              //  value={city.nameCity}
              label="Country"
              defaultValue=""
              onChange={handleCountry}
            >
              {countrys.map((item) => (
                <MenuItem value={item.apiCountry} key={item.apiCountry}>
                  {i18next.language == "en" && item.nameCountryEn}
                  {i18next.language == "fr" && item.nameCountryFr}
                  {i18next.language == "ar" && item.nameCountryAr}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl sx={{ m: 1, minWidth: 200 }}>
            <InputLabel
              id="demo-simple-select-label"
              style={
                modeSite === "dark" ? { color: "white" } : { color: "black" }
              }
            >
              {t("t_city")}
            </InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              //  value={city.nameCity}
              label="City"
              defaultValue=""
              onChange={handleCity}
            >
              {countrys[indexNumber].cities?.map((item) => (
                <MenuItem value={item.apiCity} key={item.apiCity}>
                  {i18next.language == "en" && item.apiCity}
                  {i18next.language == "fr" && item.apiCity}
                  {i18next.language == "ar" && item.nameCity}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>

        <Divider
          style={
            modeSite === "dark"
              ? { borderColor: "white", opacity: "0.5" }
              : { borderColor: "black", opacity: "0.5" }
          }
        />

        <Grid
          direction="row"
          justifyContent={"space-between"}
          style={{ display: "flex", flexWrap: "wrap" }}
        >
          <Grid sx={{ m: 1, minWidth: 200 }}>
            <div style={{ fontSize: "27px", fontWeight: "600" }}>
              {t("t_Country")}
            </div>
            <div style={{ marginBottom: "10px", fontWeight: "600" }}>
              {" "}
              {i18next.language == "en" && country.nameCountryEn}
              {i18next.language == "fr" && country.nameCountryFr}
              {i18next.language == "ar" && country.nameCountryAr}
            </div>
          </Grid>
          <Grid sx={{ m: 1, minWidth: 200 }}>
            <div style={{ fontSize: "27px", fontWeight: "600" }}>
              {t("t_city")}
            </div>
            <div style={{ marginBottom: "10px", fontWeight: "600" }}>
              {" "}
              {i18next.language == "en" && city.apiCity}
              {i18next.language == "fr" && city.apiCity}
              {i18next.language == "ar" && city.nameCity}
            </div>
          </Grid>
          <Grid sx={{ m: 1, minWidth: 200 }}>
            <div style={{ fontSize: "27px", fontWeight: "600" }}>
              {t("t_clock")}
            </div>
            <div style={{ marginBottom: "10px", fontWeight: "600" }}>
              {today}{" "}
            </div>
          </Grid>
          <Grid sx={{ m: 1, minWidth: 200 }}>
            <div style={{ fontSize: "27px", fontWeight: "600" }}>
              {t("t_afternoon_prayer", { nextPrayeName })}
            </div>
            <div style={{ marginBottom: "10px", fontWeight: "600" }}>
              {remainingTime}
            </div>
          </Grid>
        </Grid>
        <Divider
          style={
            modeSite === "dark"
              ? { borderColor: "white", opacity: "0.2" }
              : { borderColor: "black", opacity: "0.2" }
          }
        />

        <Stack
          direction="row"
          // justifyContent={"space-between"}
          style={{
            marginTop: "20px",
            display: "flex",
            flexWrap: "wrap",
          }}
        >
          <Preyer
            name={i18next.language == "ar" ? "الفجر" : "Fajr"}
            time={time.Fajr}
            image="https://idsb.tmgrup.com.tr/ly/uploads/images/2022/04/03/195874.jpg"
          />
          <Preyer
            name={i18next.language == "ar" ? "الضهر" : "Dhuhr"}
            time={time.Dhuhr}
            image="https://img.freepik.com/premium-photo/serene-aerial-view-majestic-mosque-with-tranquil-man-sitting-bench-generative-ai_561855-17733.jpg?w=1380"
          />
          <Preyer
            name={i18next.language == "ar" ? "العصر" : "Asr"}
            time={time.Asr}
            image="https://img.freepik.com/free-photo/free-photo-background-ramadan-kareem-eid-mubarak-royal-moroccan-lamp-mosque-with-fireworks_1340-23572.jpg?t=st=1695667528~exp=1695671128~hmac=7c215979c090565d8d42286dbe738fe7f7c19bb01f660415c1688dff74763dab&w=996"
          />
          <Preyer
            name={i18next.language == "ar" ? "المغرب" : "Maghrib"}
            time={time.Maghrib}
            image="https://img.freepik.com/premium-photo/man-praying-mosque-with-sun-shining-through-window_220363-834.jpg"
          />
          <Preyer
            name={i18next.language == "ar" ? "العشاء" : "Isha"}
            time={time.Isha}
            image="https://t3.ftcdn.net/jpg/05/71/33/30/360_F_571333003_t1LTzlm3NfeC9ba6ZBMgfQ65lTCshwEm.jpg"
          />
        </Stack>
      </div>
    </ThemeProvider>
  );
};

export default PrayPage;
