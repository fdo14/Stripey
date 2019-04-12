import React, { Component } from 'react';
import { Container, Box, Heading, Card, Image, Text, SearchField, Icon, Spinner } from 'gestalt'
import { Link } from 'react-router-dom'
import Strapi from 'strapi-sdk-javascript/build/main'
import './App.css';
import Loader from './Loader'

const apiUrl = process.env.API_URL || 'http://localhost:1337'
const strapi = new Strapi(apiUrl)

class App extends Component {
  state = {
    brands: [],
    searchTerm: '',
    loadingBrands: true
  }

  async componentDidMount() {
    try{
      const response = await strapi.request('POST', '/graphql', {
        data: {
          query: `query {
            brands {
              _id
              name
              description
              image {
                url
              }
            }
          }`
        }
      })

      this.setState({ brands: response.data.brands, loadingBrands: false })
    } catch (err) {
      console.log(err)
      this.setState({ loadingBrands: false})
    }
  }

  handleChange = ({ value }) => {
    this.setState({ searchTerm: value })
  }

  filteredBrands = ({ searchTerm, brands }) => {
    return brands.filter(brand => {
      return brand.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      brand.description.toLowerCase().includes(searchTerm.toLowerCase())
    })
  }

  render() {
    const { searchTerm, loadingBrands } = this.state
    return (
      <Container>
        <Box display="flex" justifyContent="center" marginTop={4}>
          <SearchField 
            id="searchField"
            accessiblityLabel="Brands Search"
            onChange={this.handleChange}
            placeholder="Search Brands"
            value={searchTerm}
          />
          <Box margin={2}>
            <Icon 
              icon="filter"
              color={searchTerm ? "orange" : 'gray'}
              size={20}
              accessibilityLabel="Filter"
            />
          </Box>
        </Box>

        <Box
          display="flex"
          justifyContent="center"
          marginBottom={2}
        > 
          <Heading color="midnight" size="md">
            Brew Brands
          </Heading>
        </Box>

        <Box 
        dangerouslySetInlineStyle={{
          __style: {
            backgroundColor: '#d6c8ec'
          }
        }}
        wrap display="flex" justifyContent="around" shape="rounded">
          {this.filteredBrands(this.state).map(brand => (
            <Box paddingY={4} key={brand.id} width={200} margin={2} >
              <Card
                image={
                  <Box height={200} width={200}>
                    <Image 
                      fit="cover"
                      alt="brand"
                      naturalHeight={1}
                      naturalWidth={1}
                      src={`${apiUrl}${brand.image.url}`}
                    />
                  </Box>
                }
              >
                <Box display="flex" alignItems="center" justifyContent="center" direction="column">
                  <Text bold size="xl">{brand.name}</Text>
                  <Text>{brand.description}</Text>
                  <Text bold size="xl">
                    <Link to={`/${brand._id}`}>See Brews</Link>
                  </Text>
                </Box>
              </Card>
            </Box>
          ))}
        </Box>
          <Loader show={loadingBrands}/>
      </Container>
    );
  }
}

export default App;
