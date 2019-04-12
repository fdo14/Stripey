import React from 'react'
import Strapi from 'strapi-sdk-javascript/build/main'
import { Box, Heading, Text, Image, Card, Button, Mask, IconButton } from 'gestalt'
import { Link } from 'react-router-dom'

import { calculatePrice, setCart, getCart } from '../utils'

const apiUrl = process.env.API_URL || 'http://localhost:1337'
const strapi = new Strapi(apiUrl)

class Brews extends React.Component {
    state = {
        brews: [],
        brand: '',
        cartItems: []
    }
    
    async componentDidMount() {
        console.log(this.props)
        try {
            const response = await strapi.request('POST', '/graphql', {
                data: {
                    query : `query {
                        brand(id: "${this.props.match.params.id}") {
                            _id
                            name
                            brews {
                                _id
                                name
                                description
                                image {
                                    url
                                }
                                price
                            }
                        }
                    }`
                }
            })
            this.setState({
                brews: response.data.brand.brews,
                brand: response.data.brand.name,
                cartItems: getCart()
            })
        } catch (err) {
            console.log(err)
        }
        
    }

    addToCart = brew => {
        const alreadyInCart = this.state.cartItems.findIndex(item => item._id === brew._id)
        if(alreadyInCart === -1) {
            const updatedItems = this.state.cartItems.concat({
                ...brew,
                quantity: 1
            })
            this.setState({ cartItems: updatedItems }, () => setCart(updatedItems))
        } else {
            const updatedItems = [ ...this.state.cartItems ]
            updatedItems[alreadyInCart].quantity += 1
            this.setState({ cartItems: updatedItems }, () => setCart(updatedItems))
        }
    }

    deleteItemFromCart = itemToDeleteId => {
        const filteredItems = this.state.cartItems.filter(item => item._id !== itemToDeleteId)
        this.setState({ cartItems: filteredItems }, () => setCart(filteredItems))
    }

    render() {
        const { brand, brews, cartItems } = this.state
        return (
            <Box marginTop={4} display="flex" justifyContent="center" alignItems="start"
            dangerouslySetInlineStyle={{
                __style: {
                    flexWrap: 'wrap-reverse'
                }
            }}
            >
                <Box display="flex" direction="column" alignItems="center">
                    <Box margin={2}>
                        <Heading color="orchid">{brand}</Heading>
                    </Box>

                    <Box 
                        dangerouslySetInlineStyle={{
                            __style: {
                                backgroundColor: '#bdcdd9'
                            }
                        }}
                        shape="rounded" display="flex" justifyContent="center" padding={4} wrap
                    > 
                        {brews.map(brew => (
                            <Box paddingY={4} key={brew.id} width={210} margin={2} >
                            <Card
                              image={
                                <Box height={250} width={200}>
                                  <Image 
                                    fit="cover"
                                    alt="brand"
                                    naturalHeight={1}
                                    naturalWidth={1}
                                    src={`${apiUrl}${brew.image.url}`}
                                  />
                                </Box>
                              }
                            >
                              <Box display="flex" alignItems="center" justifyContent="center" direction="column">
                                <Box marginBottom={2}>
                                    <Text bold size="xl">{brew.name}</Text>
                                </Box>
                                <Box marginTop={2}>
                                    <Text>{brew.description}</Text>
                                    <Text color="orchid">${brew.price}</Text>
                                </Box>
                                <Text bold size="xl">
                                  <Button color="blue" text="Add to Cart" onClick={() => this.addToCart(brew)}/>
                                </Text>
                              </Box>
                            </Card>
                          </Box>
                        ))}
                      </Box>
                    </Box>

                    <Box alignSelf="end" marginTop={2} marginLeft={8}>
                              <Mask shape="rounded" wash>
                                <Box display="flex" direction="column" alignItems="center" padding={2}>
                                    <Heading align="center" size="md">Your Cart</Heading>
                                    <Text color="gray" italic>{cartItems.length} items selected</Text>

                                    {cartItems.map(item => (
                                        <Box key={item._id} display="flex" alignItems="center">
                                            <Text>{item.name} x {item.quantity} - {(item.quantity * item.price).toFixed(2)}</Text>
                                            <IconButton 
                                                accessibilityLabel="Delete Item"
                                                icon="cancel"
                                                size="sm"
                                                iconColor="red"
                                                onClick={() => this.deleteItemFromCart(item._id)}
                                            />
                                        </Box>
                                    ))}

                                    <Box display="flex" alignItems="center" justifyContent="center" direction="column">
                                        <Box margin={2}>
                                            {cartItems.length === 0 && (
                                                <Text color="red">Please select some items</Text>
                                            )}
                                        </Box>
                                        <Text size="lg">Total: {calculatePrice(cartItems)}</Text>
                                        <Text>
                                            <Link to="/checkout">Checkout</Link>
                                        </Text>
                                    </Box>
                                </Box>
                              </Mask>
                    </Box>
                </Box>
        )
    }
}

export default Brews