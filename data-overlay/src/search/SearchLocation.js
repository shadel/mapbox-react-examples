import * as React from "react";
import { withStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import ClearIcon from "@material-ui/icons/Clear";
import * as classNames from "classnames";
import { debounce } from "lodash";
import { SiteService } from "./SiteService";
import { MenuItem, Select } from "@material-ui/core";

const styles = (theme) => ({
  wrap: {
    width: 300,
    position: "absolute",
    top: "10px",
    right: "10px",
    paddingTop: theme.spacing(0.5),
    paddingRight: theme.spacing(2),
    paddingLeft: theme.spacing(2),
    paddingBottom: theme.spacing(0.5)
  },
  list: {
    paddingTop: 0,
    paddingBottom: 0
  },
  listText: {
    fontSize: 13,
    overflow: "hidden",
    alignItems: "center",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis"
  },
  listItem: {
    paddingRight: theme.spacing(2),
    paddingLeft: theme.spacing(2)
  },
  result: {
    position: "absolute",
    width: "100%",
    top: "calc(100% + 4px)",
    left: 0,
    maxHeight: `300px`,
    overflowY: "scroll"
  }
});

class SearchLocation extends React.Component {
  state = {
    keyword: "",
    result: [],
    access: "public"
  };

  debounceCallGeoService = debounce((cb) => {
    cb();
  }, 250);

  geo = new SiteService();

  onChangeHandler = (e) => {
    const target = e.target;
    this.setState(state => ({ ...state, keyword: target.value }));
    e.persist();
    if (!target.value) {
      this.setState(state => ({ ...state, result: [] }));
      if (this.props.onClear) {
        this.props.onClear();
      }
    }
    this.debounceCallGeoService(() => {
      if (target.value) {
        this.geo.textSearch(target.value, this.state.access).then(result => {
          this.setState({ result });
        });
      }
    });
  };

  onClickResult = (item) => () => {
    this.props.onClickResult(...item.geometry.coordinates);
  };

  clear = () => {
    this.setState({
      keyword: "",
      result: []
    });

    if (this.props.onClear) {
      this.props.onClear();
    }
  };

  onChangeAccess = (event) => {
    this.setState({ access: event.target.value })
  }

  render() {
    const { classes, className } = this.props;
    const { result, keyword, access } = this.state;
    return (
      <Paper className={classNames(classes.wrap, className)}>
        <TextField
          value={keyword}
          fullWidth={true}
          onChange={this.onChangeHandler}
          placeholder="Search places"
          InputProps={{
            disableUnderline: true,
            endAdornment: (
              <InputAdornment position="end">
                {result.length > 0 && <ClearIcon onClick={this.clear} />}
                <Select value={access} onChange={this.onChangeAccess}>
                  <MenuItem value={"public"} key={"public"}>
                    {"PUBLIC"}
                  </MenuItem>
                  <MenuItem value={"private"} key={"private"}>
                    {"PRIVATE"}
                  </MenuItem>
                  <MenuItem value={"all"} key={"all"}>
                    {"ALL"}
                  </MenuItem>
                </Select>
              </InputAdornment>
            )
          }}
        />
        {result.length > 0 && (
          <Paper className={classes.result}>
            <List className={classes.list}>

                {result.map(item => (
                  <ListItem
                    button={true}
                    className={classes.listItem}
                    onClick={this.onClickResult(item)}
                    key={item.properties.address}
                  >
                    <ListItemText
                      classes={{
                        primary: classes.listText
                      }}
                      primary={item.properties.address}
                    />
                  </ListItem>
                ))}

            </List>
          </Paper>
        )}
      </Paper>
    );
  }
}

export default withStyles(styles)(SearchLocation);
