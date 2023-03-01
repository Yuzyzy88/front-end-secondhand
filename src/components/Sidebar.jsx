import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { FiBell, FiList, FiLogOut, FiUser } from "react-icons/fi";
import { Link } from 'react-router-dom';
import { UserAuth } from '../context/AuthContext';
import {
  Button,
  NavbarToggler,
} from "reactstrap";

export default function TemporaryDrawer() {
  const { logout, getToken } = UserAuth();
  const [state, setState] = React.useState({
    left: false,
  });

  const handleLogout = async () => {
    try {
      await logout();
    } catch (e) {
      console.log(e.message);
    }
  };

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event.type === 'keydown' &&
      (event.key === 'Tab' || event.key === 'Shift')
    ) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  const list = (anchor) => (
    <Box
      sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 250 }}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <List>
        {['List', 'Notification', 'Profile'].map((text, index) => (
          <Link style={{ textDecoration:"none", color:"black" }} to={text === "List"  ? "/list" : text === "Notification" ? "/" : text === "Profile" ? "/profile" : ""}>
          <ListItem key={text} disablePadding>
            <ListItemButton>
            <ListItemIcon>
                {text === "List" ? <FiList /> : text === "Notification" ? <FiBell /> : text === "Profile" ? <FiUser/> : <FiLogOut/>}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
          </Link>
        ))}
      </List>
      <Button className='btn tombol ms-2' onClick={handleLogout}>
        Logout
      </Button>
    </Box>
  );

  return (
    <div>
      {['left'].map((anchor) => (
        <React.Fragment key={anchor}>
          <NavbarToggler
            style={{ marginRight: "30px" }}
            onClick={toggleDrawer(anchor, true)}
            className="togglernav navtoggler"
          />
          <Drawer
            anchor={anchor}
            open={state[anchor]}
            onClose={toggleDrawer(anchor, false)}
          >
            {list(anchor)}
          </Drawer>
        </React.Fragment>
      ))}
    </div>
  );
}
