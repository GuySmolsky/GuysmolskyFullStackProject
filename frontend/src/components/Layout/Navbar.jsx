import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  Menu,
  MenuItem,
  useMediaQuery,
  useTheme,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Avatar,
  Divider,
  Badge,
  Tooltip,
  Snackbar,
  Alert,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import WorkIcon from "@mui/icons-material/Work";
import { useAuth } from "../../hooks/useAuth";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import { ThemeContext } from "../../context/ThemeContext";
import { useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";

const MotionButton = motion(Button);
const MotionIconButton = motion(IconButton);

const Navbar = () => {
  const { user, logout, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { mode, toggleColorMode } = useContext(ThemeContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [menuReady, setMenuReady] = useState(false);

  useEffect(() => {
    if (!loading) {
      setMenuReady(true);
    }
  }, [loading]);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleMenuClose();
    navigate("/");
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMobileNavigation = () => {
    setMobileOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNotificationClick = () => {
    setNotificationOpen(true);
  };

  const handleNotificationClose = () => {
    setNotificationOpen(false);
  };

  const getMenuItems = () => {
    const baseItems = [
      { label: "Home", path: "/" },
      { label: "Jobs", path: "/jobs" },
    ];

    if (loading || !menuReady) {
      baseItems.push({ label: "About", path: "/about" });
      return baseItems;
    }

    const isEmployer = user?.role === "employer";
    const isAdmin = user?.role === "admin";

    if (!user || (user && !isEmployer && !isAdmin)) {
      baseItems.push({ label: "Companies", path: "/companies" });
    }

    if (isEmployer) {
      baseItems.push({ label: "Dashboard", path: "/employer/dashboard" });
    }

    if (isAdmin) {
      baseItems.push({ label: "Admin Panel", path: "/admin/dashboard" });
    }

    baseItems.push({ label: "About", path: "/about" });

    return baseItems;
  };

  const menuItems = getMenuItems();

  const isActive = (path) => location.pathname === path;

  const drawer = (
    <Box sx={{ width: 250, pt: 2 }}>
      <Box sx={{ px: 2, mb: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Box
            sx={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              borderRadius: 2,
              p: 0.8,
              display: "flex",
            }}
          >
            <WorkIcon sx={{ color: "white", fontSize: 24 }} />
          </Box>
          <Typography variant="h6" fontWeight="bold" color="primary">
            JobBoard
          </Typography>
        </Box>
      </Box>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem
            button
            key={item.label}
            component={Link}
            to={item.path}
            selected={isActive(item.path)}
            onClick={handleMobileNavigation}
          >
            <ListItemText primary={item.label} />
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        {!isAuthenticated ? (
          <>
            <ListItem
              button
              component={Link}
              to="/login"
              onClick={handleMobileNavigation}
            >
              <ListItemText primary="Login" />
            </ListItem>
            <ListItem
              button
              component={Link}
              to="/register"
              onClick={handleMobileNavigation}
            >
              <ListItemText primary="Register" />
            </ListItem>
          </>
        ) : (
          <>
            <ListItem
              button
              component={Link}
              to="/profile"
              onClick={handleMobileNavigation}
            >
              <ListItemText primary="Profile" />
            </ListItem>
            <ListItem
              button
              onClick={() => {
                handleMobileNavigation();
                handleLogout();
              }}
            >
              <ListItemText primary="Logout" />
            </ListItem>
          </>
        )}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          bgcolor: (theme) => theme.palette.background.paper,
          color: (theme) => theme.palette.text.primary,
          backdropFilter: "blur(20px)",
          borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
          transition: "all 0.3s ease",
        }}
      >
        <Toolbar sx={{ py: 1 }}>
          {isMobile && (
            <IconButton
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Box
              component={Link}
              to="/"
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                textDecoration: "none",
                color: "inherit",
                flexGrow: isMobile ? 1 : 0,
                mr: 4,
              }}
            >
              <Box
                sx={{
                  background:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  borderRadius: 2,
                  p: 1,
                  display: "flex",
                  boxShadow: "0 4px 12px rgba(102,126,234,0.3)",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    boxShadow: "0 6px 20px rgba(102,126,234,0.4)",
                    transform: "translateY(-2px)",
                  },
                }}
              >
                <WorkIcon sx={{ color: "white", fontSize: 24 }} />
              </Box>
              <Typography
                variant="h6"
                fontWeight="bold"
                sx={{
                  background:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  backgroundClip: "text",
                  textFillColor: "transparent",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                JobBoard
              </Typography>
            </Box>
          </motion.div>

          {!isMobile && (
            <Box sx={{ display: "flex", gap: 0.5, flexGrow: 1 }}>
              <AnimatePresence mode="wait">
                {menuItems.map((item) => (
                  <MotionButton
                    key={item.label}
                    component={Link}
                    to={item.path}
                    onClick={() =>
                      window.scrollTo({ top: 0, behavior: "smooth" })
                    }
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    sx={{
                      fontWeight: 600,
                      px: 2.5,
                      py: 1,
                      color: "text.primary",
                      position: "relative",
                      borderRadius: 2,
                      transition: "all 0.3s ease",
                      ...(isActive(item.path) && {
                        background: (theme) =>
                          `linear-gradient(135deg, ${theme.palette.primary.main}15 0%, ${theme.palette.primary.main}25 100%)`,
                        color: "primary.main",
                      }),
                      "&:hover": {
                        bgcolor: "action.hover",
                      },
                      "&::after": isActive(item.path)
                        ? {
                            content: '""',
                            position: "absolute",
                            bottom: 0,
                            left: "50%",
                            transform: "translateX(-50%)",
                            width: "60%",
                            height: "3px",
                            background:
                              "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                            borderRadius: "3px 3px 0 0",
                          }
                        : {},
                    }}
                  >
                    {item.label}
                  </MotionButton>
                ))}
              </AnimatePresence>
            </Box>
          )}

          {!isMobile && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Tooltip
                title={mode === "dark" ? "Light Mode" : "Dark Mode"}
                arrow
              >
                <MotionIconButton
                  onClick={toggleColorMode}
                  whileHover={{ scale: 1.1, rotate: 180 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  sx={{
                    bgcolor: (theme) => theme.palette.action.hover,
                    "&:hover": {
                      bgcolor: (theme) => theme.palette.action.selected,
                    },
                  }}
                >
                  {mode === "dark" ? <Brightness7Icon /> : <Brightness4Icon />}
                </MotionIconButton>
              </Tooltip>

              {isAuthenticated && (
                <Tooltip title="Notifications" arrow>
                  <MotionIconButton
                    onClick={handleNotificationClick}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    sx={{
                      bgcolor: (theme) => theme.palette.action.hover,
                      "&:hover": {
                        bgcolor: (theme) => theme.palette.action.selected,
                      },
                    }}
                  >
                    <Badge badgeContent={0} color="error">
                      <NotificationsIcon />
                    </Badge>
                  </MotionIconButton>
                </Tooltip>
              )}

              {!isAuthenticated && !loading ? (
                <>
                  <MotionButton
                    component={Link}
                    to="/login"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    sx={{
                      fontWeight: 600,
                      px: 2.5,
                    }}
                  >
                    Login
                  </MotionButton>
                  <MotionButton
                    variant="contained"
                    component={Link}
                    to="/register"
                    whileHover={{
                      scale: 1.05,
                      boxShadow: "0 6px 20px rgba(102,126,234,0.4)",
                    }}
                    whileTap={{ scale: 0.95 }}
                    sx={{
                      ml: 1,
                      px: 2.5,
                      background:
                        "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      fontWeight: 600,
                      boxShadow: "0 4px 12px rgba(102,126,234,0.3)",
                    }}
                  >
                    Register
                  </MotionButton>
                </>
              ) : isAuthenticated ? (
                <>
                  <Tooltip title="Profile" arrow>
                    <MotionIconButton
                      onClick={handleProfileMenuOpen}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      sx={{
                        ml: 1,
                        "&:hover": {
                          bgcolor: "action.hover",
                        },
                      }}
                    >
                      <motion.div
                        animate={{
                          boxShadow: [
                            "0 0 0 0 rgba(102,126,234,0.4)",
                            "0 0 0 8px rgba(102,126,234,0)",
                          ],
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          repeatType: "loop",
                        }}
                        style={{ borderRadius: "50%", display: "flex" }}
                      >
                        <Avatar
                          sx={{
                            width: 38,
                            height: 38,
                            background:
                              "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                            fontSize: "0.9rem",
                            fontWeight: "bold",
                          }}
                        >
                          {user?.profile?.firstName?.charAt(0)}
                          {user?.profile?.lastName?.charAt(0)}
                        </Avatar>
                      </motion.div>
                    </MotionIconButton>
                  </Tooltip>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                    PaperProps={{
                      elevation: 8,
                      sx: {
                        mt: 1.5,
                        minWidth: 220,
                        borderRadius: 2,
                        overflow: "visible",
                        boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                        "&:before": {
                          content: '""',
                          display: "block",
                          position: "absolute",
                          top: 0,
                          right: 14,
                          width: 10,
                          height: 10,
                          bgcolor: "background.paper",
                          transform: "translateY(-50%) rotate(45deg)",
                          zIndex: 0,
                        },
                      },
                    }}
                    transformOrigin={{ horizontal: "right", vertical: "top" }}
                    anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                  >
                    <Box sx={{ px: 2, py: 1.5 }}>
                      <Typography
                        variant="subtitle2"
                        color="text.secondary"
                        fontWeight={600}
                      >
                        Signed in as
                      </Typography>
                      <Typography variant="body1" fontWeight="bold">
                        {user?.profile?.firstName} {user?.profile?.lastName}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {user?.email}
                      </Typography>
                    </Box>
                    <Divider />
                    {user?.role === "employer" && (
                      <MenuItem
                        onClick={() => {
                          navigate("/employer/dashboard");
                          handleMenuClose();
                        }}
                        sx={{
                          py: 1.5,
                          "&:hover": {
                            bgcolor: "action.hover",
                          },
                        }}
                      >
                        <DashboardIcon sx={{ mr: 1.5, fontSize: 20 }} />
                        Dashboard
                      </MenuItem>
                    )}
                    {user?.role === "admin" && (
                      <MenuItem
                        onClick={() => {
                          navigate("/admin/dashboard");
                          handleMenuClose();
                        }}
                        sx={{
                          py: 1.5,
                          "&:hover": {
                            bgcolor: "action.hover",
                          },
                        }}
                      >
                        <AdminPanelSettingsIcon
                          sx={{ mr: 1.5, fontSize: 20 }}
                        />
                        Admin Panel
                      </MenuItem>
                    )}
                    <MenuItem
                      onClick={() => {
                        navigate("/profile");
                        handleMenuClose();
                      }}
                      sx={{
                        py: 1.5,
                        "&:hover": {
                          bgcolor: "action.hover",
                        },
                      }}
                    >
                      <PersonIcon sx={{ mr: 1.5, fontSize: 20 }} />
                      Profile
                    </MenuItem>
                    <Divider />
                    <MenuItem
                      onClick={handleLogout}
                      sx={{
                        color: "error.main",
                        py: 1.5,
                        "&:hover": {
                          bgcolor: "error.lighter",
                        },
                      }}
                    >
                      <LogoutIcon sx={{ mr: 1.5, fontSize: 20 }} />
                      Logout
                    </MenuItem>
                  </Menu>
                </>
              ) : null}
            </Box>
          )}

          {isMobile && (
            <Tooltip title={mode === "dark" ? "Light Mode" : "Dark Mode"} arrow>
              <MotionIconButton
                onClick={toggleColorMode}
                whileHover={{ scale: 1.1, rotate: 180 }}
                whileTap={{ scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                {mode === "dark" ? <Brightness7Icon /> : <Brightness4Icon />}
              </MotionIconButton>
            </Tooltip>
          )}
        </Toolbar>

        <Drawer anchor="left" open={mobileOpen} onClose={handleDrawerToggle}>
          {drawer}
        </Drawer>
      </AppBar>

      {/* Snackbar for Notifications */}
      <Snackbar
        open={notificationOpen}
        autoHideDuration={3000}
        onClose={handleNotificationClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleNotificationClose}
          severity="info"
          variant="filled"
          sx={{ width: "100%", borderRadius: 2 }}
        >
          No new notifications
        </Alert>
      </Snackbar>
    </>
  );
};

export default Navbar;
