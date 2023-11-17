import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { CardActionArea } from "@mui/material";
import { useTranslation } from "react-i18next";
import i18next from "i18next";

const Preyer = ({ name, time, image }) => {
  const { t } = useTranslation();
  return (
    <div style={{ width: "250px", flexGrow: "1", margin: "5px" }}>
      {" "}
      <Card sx={{ maxWidth: 345 }}>
        <CardActionArea>
          <CardMedia
            component="img"
            height="140"
            image={image}
            alt="green iguana"
          />
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              {i18next.language == "en" && (
                <>
                  {name} {t("t_prayer")}{" "}
                </>
              )}
              {i18next.language == "fr" && (
                <>
                  {t("t_prayer")} {name}
                </>
              )}
              {i18next.language == "ar" && (
                <>
                  {t("t_prayer")} {name}
                </>
              )}
            </Typography>
            <Typography variant="h2" color="text.secondary">
              {time}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    </div>
  );
};

export default Preyer;
