import Avatar from "@material-ui/core/Avatar";
import Chip from "@material-ui/core/Chip";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Grow from "@material-ui/core/Grow";
import LinearProgress from "@material-ui/core/LinearProgress";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/MenuList";
import Paper from "@material-ui/core/Paper";
import Popper from "@material-ui/core/Popper";
import { makeStyles } from "@material-ui/core/styles";
import { createConfigurationMenu } from "@saleor/configuration";
import useAppState from "@saleor/hooks/useAppState";
import useNavigator from "@saleor/hooks/useNavigator";
import useTheme from "@saleor/hooks/useTheme";
import useUser from "@saleor/hooks/useUser";
import ArrowDropdown from "@saleor/icons/ArrowDropdown";
import { staffMemberDetailsUrl } from "@saleor/staff/urls";
import classNames from "classnames";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";
import useRouter from "use-react-router";

import Container from "../Container";
import ErrorPage from "../ErrorPage";
import Navigator from "../Navigator";
import NavigatorButton from "../NavigatorButton/NavigatorButton";
import SideBar from "../SideBar";
import AppActionContext from "./AppActionContext";
import AppHeaderContext from "./AppHeaderContext";
import { appLoaderHeight } from "./consts";
import createMenuStructure from "./menuStructure";
import ThemeSwitch from "./ThemeSwitch";

const useStyles = makeStyles(
  theme => ({
    appAction: {
      [theme.breakpoints.down("sm")]: {
        left: 0,
        width: "100%"
      },
      bottom: 0,
      gridColumn: 2,
      position: "sticky",
      zIndex: 10
    },
    appLoader: {
      height: appLoaderHeight,
      marginBottom: theme.spacing(4),
      zIndex: 1201
    },
    appLoaderPlaceholder: {
      height: appLoaderHeight,
      marginBottom: theme.spacing(4)
    },
    arrow: {
      marginLeft: theme.spacing(2),
      transition: theme.transitions.duration.standard + "ms"
    },
    avatar: {
      "&&": {
        height: 32,
        width: 32
      }
    },
    content: {
      flex: 1
    },
    darkThemeSwitch: {
      [theme.breakpoints.down("sm")]: {
        marginRight: -theme.spacing(1.5)
      },
      marginRight: theme.spacing(2)
    },
    header: {
      display: "grid",
      gridTemplateAreas: `"headerAnchor headerToolbar"`,
      [theme.breakpoints.down("sm")]: {
        height: 88,
        marginBottom: 0
      },
      marginBottom: theme.spacing(3)
    },
    headerAnchor: {
      gridArea: "headerAnchor"
    },
    headerToolbar: {
      display: "flex",
      gridArea: "headerToolbar",
      height: 40,
      [theme.breakpoints.down("sm")]: {
        height: "auto"
      }
    },
    menu: {
      background: theme.palette.background.paper,
      height: "100vh",
      padding: "25px 20px"
    },
    menuSmall: {
      background: theme.palette.background.paper,
      height: "100vh",
      overflow: "hidden",
      padding: 25
    },
    popover: {
      zIndex: 1
    },
    root: {
      [theme.breakpoints.up("md")]: {
        display: "flex"
      },
      width: `100%`
    },
    rotate: {
      transform: "rotate(180deg)"
    },
    spacer: {
      flex: 1
    },
    userBar: {
      [theme.breakpoints.down("sm")]: {
        alignItems: "flex-end",
        flexDirection: "column-reverse",
        overflow: "hidden"
      },
      alignItems: "center",
      display: "flex"
    },
    userChip: {
      backgroundColor: theme.palette.background.paper,
      borderRadius: 24,
      color: theme.palette.text.primary,
      height: 40,
      padding: theme.spacing(0.5)
    },
    userMenuContainer: {
      position: "relative"
    },
    userMenuItem: {
      textAlign: "right"
    },
    view: {
      flex: 1,
      flexGrow: 1,
      marginLeft: 0,
      paddingBottom: theme.spacing(),
      [theme.breakpoints.up("sm")]: {
        paddingBottom: theme.spacing(3)
      }
    },
    viewContainer: {
      minHeight: `calc(100vh - ${theme.spacing(4) + appLoaderHeight + 120}px)`
    }
  }),
  {
    name: "AppLayout"
  }
);

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const classes = useStyles({});
  const { isDark, toggleTheme } = useTheme();
  const [isMenuOpened, setMenuState] = React.useState(false);
  const appActionAnchor = React.useRef<HTMLDivElement>();
  const appHeaderAnchor = React.useRef<HTMLDivElement>();
  const anchor = React.useRef<HTMLDivElement>();
  const { logout, user } = useUser();
  const navigate = useNavigator();
  const intl = useIntl();
  const [appState, dispatchAppState] = useAppState();
  const { location } = useRouter();
  const [isNavigatorVisible, setNavigatorVisibility] = React.useState(false);

  const menuStructure = createMenuStructure(intl);
  const configurationMenu = createConfigurationMenu(intl);
  const userPermissions = user?.userPermissions || [];

  const renderConfigure = configurationMenu.some(section =>
    section.menuItems.some(
      menuItem =>
        !!userPermissions.find(
          userPermission => userPermission.code === menuItem.permission
        )
    )
  );

  const handleLogout = () => {
    setMenuState(false);
    logout();
  };

  const handleViewerProfile = () => {
    setMenuState(false);
    navigate(staffMemberDetailsUrl(user.id));
  };

  const handleErrorBack = () => {
    navigate("/");
    dispatchAppState({
      payload: {
        error: null
      },
      type: "displayError"
    });
  };

  return (
    <>
      <Navigator
        visible={isNavigatorVisible}
        setVisibility={setNavigatorVisibility}
      />
      <AppHeaderContext.Provider value={appHeaderAnchor}>
        <AppActionContext.Provider value={appActionAnchor}>
          <div className={classes.root}>
            <SideBar
              menuItems={menuStructure}
              location={location.pathname}
              user={user}
              renderConfigure={renderConfigure}
              onMenuItemClick={navigate}
            />
            <div className={classes.content}>
              {appState.loading ? (
                <LinearProgress className={classes.appLoader} color="primary" />
              ) : (
                <div className={classes.appLoaderPlaceholder} />
              )}
              <div className={classes.viewContainer}>
                <div>
                  <Container>
                    <div className={classes.header}>
                      <div ref={appHeaderAnchor} />
                      <div className={classes.spacer} />
                      <div className={classes.userBar}>
                        <ThemeSwitch
                          className={classes.darkThemeSwitch}
                          checked={isDark}
                          onClick={toggleTheme}
                        />
                        <NavigatorButton
                          isMac={navigator.platform
                            .toLowerCase()
                            .includes("mac")}
                          onClick={() => setNavigatorVisibility(true)}
                        />
                        <div className={classes.userMenuContainer} ref={anchor}>
                          <Chip
                            avatar={
                              user.avatar && (
                                <Avatar alt="user" src={user.avatar.url} />
                              )
                            }
                            classes={{
                              avatar: classes.avatar
                            }}
                            className={classes.userChip}
                            label={
                              <>
                                {user.email}
                                <ArrowDropdown
                                  className={classNames(classes.arrow, {
                                    [classes.rotate]: isMenuOpened
                                  })}
                                />
                              </>
                            }
                            onClick={() => setMenuState(!isMenuOpened)}
                            data-test="userMenu"
                          />
                          <Popper
                            className={classes.popover}
                            open={isMenuOpened}
                            anchorEl={anchor.current}
                            transition
                            placement="bottom-end"
                          >
                            {({ TransitionProps, placement }) => (
                              <Grow
                                {...TransitionProps}
                                style={{
                                  transformOrigin:
                                    placement === "bottom"
                                      ? "right top"
                                      : "right bottom"
                                }}
                              >
                                <Paper>
                                  <ClickAwayListener
                                    onClickAway={() => setMenuState(false)}
                                    mouseEvent="onClick"
                                  >
                                    <Menu>
                                      <MenuItem
                                        className={classes.userMenuItem}
                                        onClick={handleViewerProfile}
                                        data-test="accountSettingsButton"
                                      >
                                        <FormattedMessage
                                          defaultMessage="Account Settings"
                                          description="button"
                                        />
                                      </MenuItem>
                                      <MenuItem
                                        className={classes.userMenuItem}
                                        onClick={handleLogout}
                                        data-test="logOutButton"
                                      >
                                        <FormattedMessage
                                          defaultMessage="Log out"
                                          description="button"
                                        />
                                      </MenuItem>
                                    </Menu>
                                  </ClickAwayListener>
                                </Paper>
                              </Grow>
                            )}
                          </Popper>
                        </div>
                      </div>
                    </div>
                  </Container>
                </div>
                <main className={classes.view}>
                  {appState.error
                    ? appState.error === "unhandled" && (
                        <ErrorPage onBack={handleErrorBack} />
                      )
                    : children}
                </main>
              </div>
              <div className={classes.appAction} ref={appActionAnchor} />
            </div>
          </div>
        </AppActionContext.Provider>
      </AppHeaderContext.Provider>
    </>
  );
};

export default AppLayout;
