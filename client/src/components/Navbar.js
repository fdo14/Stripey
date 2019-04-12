import React from 'react'
import { Box, Text, Heading, Image, Button  } from 'gestalt'
import { NavLink, withRouter } from 'react-router-dom'
import { getToken, clearToken, clearCart } from '../utils'

class Navbar extends React.Component {
    handleSignout = () => {
        clearCart()
        clearToken()
        this.props.history.push('/')
    }

    render() {
        return getToken() !== null ? <AuthNav handleSignout={this.handleSignout}/> : <UnAuthNav />
    }
}

const UnAuthNav = () => (
    <Box
        height={70}
        color="midnight"
        padding={1}
        shape="roundedBottom"
        display="flex"
        alignItems="center"
        justifyContent="around"
    >
        <NavLink activeClassName="active" to="/signin">
            <Text size="xl" color="white">Sign in</Text>
        </NavLink>
        <NavLink activeClassName="active" exact to="/">
            <Box display="flex" alignItems="center">
                <Box margin={2} height={50} width={50}>
                    <Image src="./icons/logo.svg" alt="logo" naturalHeight={1} naturalWidht={1}/>
                </Box>
                <Heading size="xs" color="orange">BrewHaha</Heading>
            </Box>
        </NavLink>
        <NavLink activeClassName="active" to="/signup">
            <Text size="xl" color="white">Sign up</Text>
        </NavLink>
        
    </Box>
)

const AuthNav = ({ handleSignout }) => (
    <Box
        height={70}
        color="midnight"
        padding={1}
        shape="roundedBottom"
        display="flex"
        alignItems="center"
        justifyContent="around"
    >
        <NavLink activeClassName="active" to="/checkout">
            <Text size="xl" color="white">Checkout</Text>
        </NavLink>
        <NavLink activeClassName="active" exact to="/">
            <Box display="flex" alignItems="center">
                <Box margin={2} height={50} width={50}>
                    <Image src="./icons/logo.svg" alt="logo" naturalHeight={1} naturalWidht={1}/>
                </Box>
                <Heading size="xs" color="orange">BrewHaha</Heading>
            </Box>
        </NavLink>
        <Button onClick={handleSignout} color="transparent" text="Signout" inline size="md" />
        
    </Box>
)

export default withRouter(Navbar)