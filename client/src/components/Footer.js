import React, { Component } from "react";

import withStyles from "@material-ui/core/styles/withStyles";
import Typography from "@material-ui/core/Typography";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";

import logo from "./../assets/footer.png";
import developer from "./../assets/nati.jpg";

const styles = {
  footerText: {
    color: "rgba(255,255,255,0.5)",
    textAlign: "center",
    fontSize: 12,
  },
  footerHeader: {
    color: "rgba(255,255,255,0.7)",
    textAlign: "center",
    fontWeight: "bold",
  },
  footerDeveloper: {
    color: "rgba(255,255,255,0.7)",
    textAlign: "center",
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
    paddingTop: 20,
    boxShadow: "5px 5px 15px",
  },
  content: {
    width: "300px",
  },
};

class Footer extends Component {
  render() {
    const { classes } = this.props;

    return (
      <Card className="footerContainer">
        <CardMedia
          image={logo}
          title="LOGO"
          className={classes.image}
          id="footerLogo"
        />
        <CardContent className={classes.content} id="footerNews">
          <Typography variant="h4" className={classes.footerHeader}>
            Truth seekers
          </Typography>
          <br />
          <Typography variant="body1" className={classes.footerText}>
            For every one that asks receives; and he that seeks finds; and to
            him that knocks it shall be opened.
          </Typography>
        </CardContent>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Typography variant="h5" className={classes.footerDeveloper}>
            Developed by
          </Typography>
          <CardMedia
            image={developer}
            title="DEVELOPER"
            className="devImage overlay"
            style={{ textAlign: "center", margin: "auto" }}
          />
          <Typography
            variant="h5"
            className={classes.footerDeveloper}
            style={{ textAlign: "center" }}
          >
            Natnael Biruk
          </Typography>
        </div>
      </Card>
    );
  }
}

export default withStyles(styles)(Footer);
