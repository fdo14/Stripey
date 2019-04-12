import React from 'react';
import { Container, Box, Button, Heading, Text, TextField, TextArea } from 'gestalt'
import Strapi from 'strapi-sdk-javascript/build/main'
import { setToken } from '../utils'
import ToastMessage from './ToastMessage'

const apiUrl = process.env.API_URL || 'http://localhost:1337'
const strapi = new Strapi(apiUrl)

class Signin extends React.Component {
    state = {
        username: '',
        password: '',
        toast: false,
        toastMessage: '',
        loading: false
    }
    handleChange = ({ event, value }) => {
        event.persist()
        this.setState({ [event.target.name]: value })
    }

    handleSubmit = async event => {
        const { username, password } = this.state
        event.preventDefault()
        if (this.isFormEmpty(this.state)) {
            this.showToast('Fill in all fields')
            return 
        }

        try {
            this.setState({ loading: true })
            const response = await strapi.login(username, password)
            this.setState({ loading: false })
            setToken(response.jwt)
            this.redirectUser('/')
        } catch (err) {
            this.setState({ loading: false })
            this.showToast(err.message)
        }
    }

    redirectUser = path => this.props.history.push(path)

    isFormEmpty = ({ username, password }) => {
        return !username || !password
    }

    showToast = toastMessage => {
        this.setState({ toast: true, toastMessage})
        setTimeout(() => this.setState({ toast: false, toastMessage: '' }), 5000)
    }

    render() {
        const { toastMessage, toast, loading } = this.state

        return (
            <Container>
                <Box
                dangerouslySetInlineStyle={{
                    __style: {
                        backgroundColor: '#d6a3b1'
                    }
                }}
                margin={4} padding={4} shape="rounded" display="flex" justifyContent="center"
                >
                    <form style={{
                        display: "inlineBlock",
                        textAlign: 'center',
                        maxWidth: 450
                    }}
                    onSubmit={this.handleSubmit}>
                        <Box marginBottom={2} display="flex" direction="column" alignItems="center">
                            <Heading color="midnight">welcome Back!</Heading>
                        </Box>
                        <TextField 
                            id="username"
                            type="text"
                            name="username"
                            placeholder="Username"
                            onChange={this.handleChange}
                        />
                        <TextField 
                            id="password"
                            type="text"
                            name="password"
                            placeholder="Password"
                            onChange={this.handleChange}
                        />
                        <Button disabled={loading} color="blue" text="Submit" type="submit" />
                    </form>
                </Box>
                <ToastMessage message={toastMessage} show={toast}/>
            </Container>
        )
    }
}

export default Signin